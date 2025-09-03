#!/usr/bin/env python3
"""
StudyMate All-Models Unified Server
Runs all AI models (DeepSeek, Hugging Face, vLLM) with PDF processing in one server
Compatible with OpenAI API format for easy frontend integration
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import os
import json
import time
import logging
import tempfile
import shutil
from datetime import datetime
from typing import List, Dict, Any, Optional, Union
import uuid
import requests
from dotenv import load_dotenv
import asyncio

# Load environment variables
load_dotenv()

# PDF processing
try:
    import fitz  # PyMuPDF
    PDF_AVAILABLE = True
    print("✅ PyMuPDF available for PDF processing")
except ImportError:
    try:
        import pdfplumber
        PDF_AVAILABLE = True
        print("✅ Using pdfplumber for PDF processing")
    except ImportError:
        PDF_AVAILABLE = False
        print("⚠️ No PDF processing library available")

# AI and ML imports
try:
    from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
    import torch
    HF_AVAILABLE = True
    print("✅ Hugging Face transformers available")
except ImportError:
    HF_AVAILABLE = False
    print("⚠️ Hugging Face transformers not available")

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(
    title="StudyMate All-Models Server",
    description="Unified server with DeepSeek, Hugging Face, vLLM, and PDF processing",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1")
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
HUGGINGFACE_API_URL = os.getenv("HUGGINGFACE_API_URL", "https://api-inference.huggingface.co/models/ibm-granite/granite-3.3-2b-instruct")
VLLM_BASE_URL = os.getenv("VLLM_BASE_URL", "http://localhost:8000")

# Global variables for loaded models
loaded_models = {}
document_store = {}

def extract_pdf_text(file_path: str) -> Dict[str, Any]:
    """Extract text from PDF using PyMuPDF or pdfplumber"""
    
    logger.info(f"Extracting text from PDF: {file_path}")
    
    try:
        text_chunks = []
        full_text = ""
        total_pages = 0
        
        # Try PyMuPDF first
        if 'fitz' in globals():
            logger.info("Using PyMuPDF for extraction")
            doc = fitz.open(file_path)
            total_pages = len(doc)
            
            for page_num in range(total_pages):
                page = doc.load_page(page_num)
                page_text = page.get_text()
                full_text += page_text + "\n"
                
                # Create chunks of ~1000 characters
                chunk_size = 1000
                for i in range(0, len(page_text), chunk_size):
                    chunk = page_text[i:i + chunk_size].strip()
                    if chunk:
                        text_chunks.append({
                            "content": chunk,
                            "page": page_num + 1,
                            "chunk_id": len(text_chunks)
                        })
            
            doc.close()
            logger.info(f"Extracted {len(full_text)} characters from {total_pages} pages")
            
        # Fallback to pdfplumber
        elif 'pdfplumber' in globals():
            logger.info("Using pdfplumber for extraction")
            import pdfplumber
            
            with pdfplumber.open(file_path) as pdf:
                total_pages = len(pdf.pages)
                for page_num, page in enumerate(pdf.pages):
                    page_text = page.extract_text() or ""
                    full_text += page_text + "\n"
                    
                    chunk_size = 1000
                    for i in range(0, len(page_text), chunk_size):
                        chunk = page_text[i:i + chunk_size].strip()
                        if chunk:
                            text_chunks.append({
                                "content": chunk,
                                "page": page_num + 1,
                                "chunk_id": len(text_chunks)
                            })
        
        else:
            raise Exception("No PDF processing library available")
        
        return {
            "success": True,
            "full_text": full_text,
            "chunks": text_chunks,
            "total_pages": total_pages,
            "total_characters": len(full_text)
        }
        
    except Exception as e:
        logger.error(f"PDF extraction failed: {e}")
        return {
            "success": False,
            "error": str(e),
            "full_text": "",
            "chunks": [],
            "total_pages": 0,
            "total_characters": 0
        }

async def call_deepseek_api(messages: List[Dict], max_tokens: int = 500, temperature: float = 0.7) -> str:
    """Call DeepSeek API"""
    
    if not DEEPSEEK_API_KEY or DEEPSEEK_API_KEY == 'your_deepseek_api_key_here':
        raise Exception("DeepSeek API key not configured")
    
    try:
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "deepseek-chat",
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature
        }
        
        response = requests.post(
            f"{DEEPSEEK_BASE_URL}/chat/completions",
            headers=headers,
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"]
        else:
            raise Exception(f"DeepSeek API error: {response.status_code} - {response.text}")
            
    except Exception as e:
        logger.error(f"DeepSeek API call failed: {e}")
        raise

async def call_huggingface_api(messages: List[Dict], max_tokens: int = 500, temperature: float = 0.7) -> str:
    """Call Hugging Face API"""
    
    if not HUGGINGFACE_API_KEY:
        raise Exception("Hugging Face API key not configured")
    
    try:
        # Convert messages to conversation format
        conversation_text = ""
        for msg in messages:
            role = msg.get('role', '')
            content = msg.get('content', '')
            if role == 'user':
                conversation_text += f"User: {content}\n"
            elif role == 'assistant':
                conversation_text += f"Assistant: {content}\n"
            elif role == 'system':
                conversation_text = f"System: {content}\n" + conversation_text
        
        conversation_text += "Assistant:"
        
        headers = {
            "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "inputs": conversation_text,
            "parameters": {
                "max_new_tokens": max_tokens,
                "temperature": temperature,
                "top_p": 0.9,
                "do_sample": True,
                "return_full_text": False
            }
        }
        
        response = requests.post(
            HUGGINGFACE_API_URL,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                return result[0].get('generated_text', '').strip()
            elif isinstance(result, dict) and 'generated_text' in result:
                return result['generated_text'].strip()
        else:
            raise Exception(f"Hugging Face API error: {response.status_code} - {response.text}")
            
    except Exception as e:
        logger.error(f"Hugging Face API call failed: {e}")
        raise

async def call_vllm_api(messages: List[Dict], max_tokens: int = 500, temperature: float = 0.7) -> str:
    """Call vLLM API"""
    
    try:
        data = {
            "model": os.getenv("VLLM_MODEL", "mistralai/Mistral-7B-Instruct-v0.2"),
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature
        }
        
        response = requests.post(
            f"{VLLM_BASE_URL}/v1/chat/completions",
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"]
        else:
            raise Exception(f"vLLM API error: {response.status_code} - {response.text}")
            
    except Exception as e:
        logger.error(f"vLLM API call failed: {e}")
        raise

async def get_ai_response(messages: List[Dict], model: str = "auto", max_tokens: int = 500, temperature: float = 0.7) -> Dict[str, Any]:
    """Get AI response from specified model or auto-select best available"""
    
    errors = []
    
    # Auto-select model or try specified model
    models_to_try = []
    
    if model == "auto":
        # Try in order of preference
        if DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != 'your_deepseek_api_key_here':
            models_to_try.append("deepseek")
        if HUGGINGFACE_API_KEY:
            models_to_try.append("huggingface")
        models_to_try.append("vllm")
    else:
        models_to_try = [model]
    
    for model_name in models_to_try:
        try:
            if model_name == "deepseek":
                response = await call_deepseek_api(messages, max_tokens, temperature)
                return {"content": response, "model": "deepseek-chat", "success": True}
            
            elif model_name == "huggingface":
                response = await call_huggingface_api(messages, max_tokens, temperature)
                return {"content": response, "model": "ibm-granite", "success": True}
            
            elif model_name == "vllm":
                response = await call_vllm_api(messages, max_tokens, temperature)
                return {"content": response, "model": "vllm-local", "success": True}
                
        except Exception as e:
            error_msg = f"{model_name}: {str(e)}"
            errors.append(error_msg)
            logger.warning(f"Model {model_name} failed: {e}")
            continue
    
    # All models failed, return fallback
    user_message = messages[-1].get('content', '') if messages else ''
    user_lower = user_message.lower()
    
    if any(word in user_lower for word in ['hello', 'hi', 'hey']):
        fallback_response = "Hello! I'm StudyMate, your AI learning assistant. I can help you with questions, analyze documents, and support your studies. How can I assist you today?"
    elif any(word in user_lower for word in ['who', 'what are you']):
        fallback_response = "I'm StudyMate, an AI-powered learning assistant that can use multiple AI models including DeepSeek, IBM Granite, and local models. I can help you with questions, analyze documents, and support your studies."
    else:
        fallback_response = f"I understand you're asking about '{user_message}'. I'm having trouble connecting to my AI models right now, but I'm here to help. Could you try rephrasing your question?"
    
    return {
        "content": fallback_response,
        "model": "fallback",
        "success": False,
        "errors": errors
    }

@app.get("/")
async def root():
    """Health check and server info"""
    return {
        "message": "StudyMate All-Models Server",
        "status": "running",
        "models": {
            "deepseek": bool(DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != 'your_deepseek_api_key_here'),
            "huggingface": bool(HUGGINGFACE_API_KEY),
            "vllm": True,  # Always try vLLM
            "pdf_processing": PDF_AVAILABLE
        },
        "version": "1.0.0",
        "endpoints": [
            "POST /v1/chat/completions - OpenAI-compatible chat",
            "POST /upload-pdf - Upload and process PDF",
            "POST /summarize-pdf - Upload PDF for AI summarization",
            "GET /documents - List uploaded documents",
            "GET /models - List available models"
        ]
    }

@app.get("/models")
async def list_models():
    """List available AI models"""
    models = []
    
    if DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != 'your_deepseek_api_key_here':
        models.append({
            "id": "deepseek-chat",
            "object": "model",
            "created": int(time.time()),
            "owned_by": "deepseek",
            "permission": [],
            "root": "deepseek-chat",
            "parent": None
        })
    
    if HUGGINGFACE_API_KEY:
        models.append({
            "id": "ibm-granite",
            "object": "model", 
            "created": int(time.time()),
            "owned_by": "ibm",
            "permission": [],
            "root": "granite-3.3-2b-instruct",
            "parent": None
        })
    
    models.append({
        "id": "vllm-local",
        "object": "model",
        "created": int(time.time()),
        "owned_by": "local",
        "permission": [],
        "root": os.getenv("VLLM_MODEL", "mistralai/Mistral-7B-Instruct-v0.2"),
        "parent": None
    })
    
    return {"object": "list", "data": models}

@app.post("/v1/chat/completions")
async def chat_completions(request: Request):
    """OpenAI-compatible chat completions endpoint"""
    
    try:
        body = await request.json()
        
        messages = body.get("messages", [])
        model = body.get("model", "auto")
        max_tokens = body.get("max_tokens", 500)
        temperature = body.get("temperature", 0.7)
        stream = body.get("stream", False)
        
        if not messages:
            raise HTTPException(status_code=400, detail="Messages are required")
        
        # Get AI response
        result = await get_ai_response(messages, model, max_tokens, temperature)
        
        # Format OpenAI-compatible response
        response = {
            "id": f"chatcmpl-{uuid.uuid4().hex[:8]}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": result["model"],
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": result["content"]
                },
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": len(str(messages)),
                "completion_tokens": len(result["content"]),
                "total_tokens": len(str(messages)) + len(result["content"])
            }
        }
        
        if not result["success"]:
            response["warning"] = "Fallback response used due to model errors"
            response["errors"] = result.get("errors", [])
        
        return response
        
    except Exception as e:
        logger.error(f"Chat completion error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and process PDF document"""
    
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
        content = await file.read()
        tmp_file.write(content)
        tmp_file_path = tmp_file.name
    
    try:
        # Extract text from PDF
        extraction_result = extract_pdf_text(tmp_file_path)
        
        if not extraction_result["success"]:
            raise HTTPException(status_code=500, detail=f"PDF extraction failed: {extraction_result['error']}")
        
        # Store document
        doc_id = str(uuid.uuid4())
        document_store[doc_id] = {
            "id": doc_id,
            "filename": file.filename,
            "upload_time": datetime.now().isoformat(),
            "full_text": extraction_result["full_text"],
            "chunks": extraction_result["chunks"],
            "total_pages": extraction_result["total_pages"],
            "total_characters": extraction_result["total_characters"]
        }
        
        return {
            "success": True,
            "document_id": doc_id,
            "filename": file.filename,
            "stats": {
                "total_pages": extraction_result["total_pages"],
                "total_characters": extraction_result["total_characters"],
                "chunks_created": len(extraction_result["chunks"])
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF upload failed: {e}")
        raise HTTPException(status_code=500, detail=f"PDF upload failed: {str(e)}")
    
    finally:
        # Clean up temporary file
        try:
            os.unlink(tmp_file_path)
        except:
            pass

@app.post("/summarize-pdf")
async def summarize_pdf(file: UploadFile = File(...), model: str = "auto"):
    """Upload PDF and get AI summary"""
    
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
        content = await file.read()
        tmp_file.write(content)
        tmp_file_path = tmp_file.name
    
    try:
        # Extract text from PDF
        extraction_result = extract_pdf_text(tmp_file_path)
        
        if not extraction_result["success"]:
            raise HTTPException(status_code=500, detail=f"PDF extraction failed: {extraction_result['error']}")
        
        full_text = extraction_result["full_text"]
        
        if len(full_text.strip()) < 50:
            raise HTTPException(status_code=400, detail="PDF contains insufficient text for summarization")
        
        # Prepare messages for AI
        messages = [
            {
                "role": "system",
                "content": "You are StudyMate, a helpful AI learning assistant. Provide comprehensive summaries of documents, focusing on key points, main ideas, and important details."
            },
            {
                "role": "user",
                "content": f"Please provide a comprehensive summary of the following document:\n\n{full_text[:8000]}"  # Limit text to avoid token limits
            }
        ]
        
        # Get AI summary
        result = await get_ai_response(messages, model, max_tokens=1000, temperature=0.3)
        
        return {
            "success": True,
            "filename": file.filename,
            "summary": result["content"],
            "model_used": result["model"],
            "document_stats": {
                "total_pages": extraction_result["total_pages"],
                "total_characters": extraction_result["total_characters"],
                "chunks_processed": len(extraction_result["chunks"])
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF summarization failed: {e}")
        raise HTTPException(status_code=500, detail=f"PDF summarization failed: {str(e)}")
    
    finally:
        # Clean up temporary file
        try:
            os.unlink(tmp_file_path)
        except:
            pass

@app.get("/documents")
async def list_documents():
    """List uploaded documents"""
    return {
        "documents": [
            {
                "id": doc_id,
                "filename": doc["filename"],
                "upload_time": doc["upload_time"],
                "total_pages": doc["total_pages"],
                "total_characters": doc["total_characters"]
            }
            for doc_id, doc in document_store.items()
        ]
    }

@app.get("/documents/{doc_id}")
async def get_document(doc_id: str):
    """Get specific document details"""
    if doc_id not in document_store:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return document_store[doc_id]

if __name__ == "__main__":
    import uvicorn
    
    print("🚀 StudyMate All-Models Server Starting...")
    print("=" * 60)
    print("📋 Available Features:")
    print("  🤖 Multi-Model AI Chat (DeepSeek, Hugging Face, vLLM)")
    print("  📄 PDF Processing & Summarization")
    print("  🔄 OpenAI-Compatible API")
    print("  📚 Document Management")
    print()
    print("🌐 Endpoints:")
    print("  POST /v1/chat/completions - OpenAI-compatible chat")
    print("  POST /upload-pdf - Upload and process PDF")
    print("  POST /summarize-pdf - Upload PDF for AI summarization")
    print("  GET /documents - List uploaded documents")
    print("  GET /models - List available models")
    print("  GET / - Health check")
    print()
    print("🔧 Models Configuration:")
    print(f"  DeepSeek: {'✅' if DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != 'your_deepseek_api_key_here' else '❌'}")
    print(f"  Hugging Face: {'✅' if HUGGINGFACE_API_KEY else '❌'}")
    print(f"  vLLM: ✅ (will try {VLLM_BASE_URL})")
    print(f"  PDF Processing: {'✅' if PDF_AVAILABLE else '❌'}")
    print()
    print("=" * 60)
    
    uvicorn.run(app, host="0.0.0.0", port=8002)
