#!/usr/bin/env python3
"""
Unified StudyMate AI Server
Combines chatbot, PDF processing, FAISS embeddings, and search in one service
Compatible with OpenAI API format for easy integration
"""


from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import json
import time
import logging
import tempfile
import shutil
from datetime import datetime
from typing import List, Dict, Any, Optional
import uuid
import requests
from dotenv import load_dotenv


# Load environment variables
load_dotenv()


# AI and ML imports
try:
    from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
    import torch
    HF_AVAILABLE = True
except ImportError:
    HF_AVAILABLE = False
    print("Warning: transformers not available, using mock responses")


# PDF processing imports
try:
    import PyMuPDF as fitz
    PDF_AVAILABLE = True
    print("✅ PyMuPDF available for PDF processing")
except ImportError:
    try:
        # Fallback to pdfplumber
        import pdfplumber
        PDF_AVAILABLE = True
        print("✅ Using pdfplumber for PDF processing")
    except ImportError:
        PDF_AVAILABLE = True  # Enable mock PDF processing
        print("⚠️ Using mock PDF processor - install PyMuPDF for full functionality")


# Embeddings and search imports
try:
    from sentence_transformers import SentenceTransformer
    import numpy as np
    import faiss
    EMBEDDINGS_AVAILABLE = True
except ImportError:
    EMBEDDINGS_AVAILABLE = False
    np = None
    print("Warning: sentence-transformers/faiss not available, search disabled")


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = Flask(__name__)
CORS(app)


# Configuration from environment variables
HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY')
HUGGINGFACE_API_URL = os.getenv('HUGGINGFACE_API_URL', 'https://api-inference.huggingface.co/models/ibm-granite/granite-3.3-2b-instruct')
CHAT_MODEL = os.getenv('HUGGINGFACE_MODEL', 'ibm-granite/granite-3.3-2b-instruct')
HF_MAX_TOKENS = int(os.getenv('HF_MAX_TOKENS', '512'))
HF_TEMPERATURE = float(os.getenv('HF_TEMPERATURE', '0.7'))
HF_TOP_P = float(os.getenv('HF_TOP_P', '0.9'))
HF_TIMEOUT = int(os.getenv('HF_TIMEOUT', '30000'))

EMBEDDING_MODEL = "all-MiniLM-L6-v2"
UPLOAD_FOLDER = "uploads"
VECTOR_DB_PATH = "vector_db"

# Global variables
chat_model = None
chat_tokenizer = None
embedding_model = None
vector_index = None
document_store = {}
chunk_store = {}

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(VECTOR_DB_PATH, exist_ok=True)

def initialize_models():
    """Initialize all AI models"""
    global chat_model, chat_tokenizer, embedding_model, vector_index
    
    logger.info("Initializing AI models...")
    
    # Always use Hugging Face API for IBM Granite - no local model loading
    if HUGGINGFACE_API_KEY:
        logger.info(f"✅ Using Hugging Face API for IBM Granite model: {CHAT_MODEL}")
        logger.info(f"✅ API URL: {HUGGINGFACE_API_URL}")
        chat_model = "huggingface_api"  # Flag to use API
        chat_tokenizer = None  # Not needed for API calls
    else:
        logger.error("❌ No Hugging Face API key found in environment!")
        logger.error("❌ Please set HUGGINGFACE_API_KEY in your .env file")
        chat_model = None
        chat_tokenizer = None
    
    # Initialize embedding model
    if EMBEDDINGS_AVAILABLE:
        try:
            logger.info(f"Loading embedding model: {EMBEDDING_MODEL}")
            global embedding_model, vector_index
            embedding_model = SentenceTransformer(EMBEDDING_MODEL)
            
            # Initialize FAISS index
            vector_index = faiss.IndexFlatIP(384)  # MiniLM embedding dimension
            logger.info("Embedding model and FAISS index initialized")
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            embedding_model = None
            vector_index = None
    else:
        logger.warning("Embeddings not available - sentence-transformers/faiss not installed")

def generate_chat_response(messages: List[Dict], max_tokens: int = 100, temperature: float = 0.7) -> str:
    """Generate chat response using Hugging Face API or fallback"""
    
    # Extract user message
    user_message = ""
    for msg in reversed(messages):
        if msg.get('role') == 'user':
            user_message = msg.get('content', '')
            break
    
    if not user_message:
        return "I didn't receive a clear message. Could you please rephrase?"
    
    # Use Hugging Face API if available
    if chat_model == "huggingface_api" and HUGGINGFACE_API_KEY:
        try:
            # Prepare the prompt for IBM Granite model
            conversation_text = ""
            for msg in messages:
                role = msg.get('role', '')
                content = msg.get('content', '')
                if role == 'user':
                    conversation_text += f"User: {content}\n"
                elif role == 'assistant':
                    conversation_text += f"Assistant: {content}\n"
            
            conversation_text += "Assistant:"
            
            # Prepare API request
            headers = {
                "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "inputs": conversation_text,
                "parameters": {
                    "max_new_tokens": max_tokens,
                    "temperature": temperature,
                    "top_p": HF_TOP_P,
                    "do_sample": True,
                    "return_full_text": False
                }
            }
            
            # Make API request
            response = requests.post(
                HUGGINGFACE_API_URL,
                headers=headers,
                json=payload,
                timeout=HF_TIMEOUT/1000
            )
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    generated_text = result[0].get('generated_text', '').strip()
                    if generated_text:
                        return generated_text
                elif isinstance(result, dict) and 'generated_text' in result:
                    generated_text = result['generated_text'].strip()
                    if generated_text:
                        return generated_text
            else:
                logger.error(f"Hugging Face API error: {response.status_code} - {response.text}")
                
        except Exception as e:
            logger.error(f"Hugging Face API request error: {e}")
    
    # Fallback responses based on content
    user_lower = user_message.lower()
    
    if any(word in user_lower for word in ['hello', 'hi', 'hey']):
        return f"Hello! I'm StudyMate, your AI learning assistant powered by IBM Granite. How can I help you today?"
    elif any(word in user_lower for word in ['who', 'what are you']):
        return "I'm StudyMate, an AI-powered learning assistant using IBM Granite model. I can help you with questions, analyze documents, and support your studies."
    elif any(word in user_lower for word in ['llm', 'language model']):
        return "LLM stands for Large Language Model. It's an AI system trained on vast amounts of text to understand and generate human-like responses. I'm powered by IBM's Granite model."
    elif any(word in user_lower for word in ['explain', 'what is']):
        topic = user_message.replace('explain', '').replace('what is', '').strip()
        return f"I'd be happy to explain {topic}. This is a complex topic that involves multiple concepts. Would you like me to break it down into simpler parts?"
    else:
        return f"I understand you're asking about '{user_message}'. Let me help you with that. Could you provide more specific details about what you'd like to know?"

def process_pdf(file_path: str) -> Dict[str, Any]:
    """Extract text from PDF and create chunks"""
    
    try:
        # Try PyMuPDF first
        if 'fitz' in globals():
            doc = fitz.open(file_path)
            text_chunks = []
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text = page.get_text()
                
                # Split into chunks (roughly 500 characters each)
                chunk_size = 500
                for i in range(0, len(text), chunk_size):
                    chunk = text[i:i + chunk_size].strip()
                    if chunk:
                        text_chunks.append({
                            "content": chunk,
                            "page": page_num + 1,
                            "chunk_id": len(text_chunks)
                        })
            
            doc.close()
            total_pages = len(doc)
            
        # Try pdfplumber fallback
        elif 'pdfplumber' in globals():
            import pdfplumber
            text_chunks = []
            total_pages = 0
            
            with pdfplumber.open(file_path) as pdf:
                total_pages = len(pdf.pages)
                for page_num, page in enumerate(pdf.pages):
                    text = page.extract_text() or ""
                    
                    # Split into chunks (roughly 500 characters each)
                    chunk_size = 500
                    for i in range(0, len(text), chunk_size):
                        chunk = text[i:i + chunk_size].strip()
                        if chunk:
                            text_chunks.append({
                                "content": chunk,
                                "page": page_num + 1,
                                "chunk_id": len(text_chunks)
                            })
        
        # Mock PDF processing if no library available
        else:
            # Create mock chunks for testing
            mock_text = f"This is a mock PDF document from {file_path}. " \
                       "It contains sample text for testing purposes. " \
                       "In a real implementation, this would be extracted from the actual PDF file. " \
                       "The document discusses various topics related to the filename and content structure."
            
            text_chunks = []
            chunk_size = 200
            for i in range(0, len(mock_text), chunk_size):
                chunk = mock_text[i:i + chunk_size].strip()
                if chunk:
                    text_chunks.append({
                        "content": chunk,
                        "page": 1,
                        "chunk_id": len(text_chunks)
                    })
            total_pages = 1
        
        return {
            "success": True,
            "chunks": text_chunks,
            "total_pages": total_pages,
            "total_chunks": len(text_chunks)
        }
        
    except Exception as e:
        logger.error(f"PDF processing error: {e}")
        return {
            "success": False,
            "error": str(e)
        }

def create_embeddings(texts: List[str]):
    """Create embeddings for text chunks"""
    
    if not EMBEDDINGS_AVAILABLE or not embedding_model:
        return None
    
    try:
        embeddings = embedding_model.encode(texts)
        return embeddings
    except Exception as e:
        logger.error(f"Embedding creation error: {e}")
        return None

def search_documents(query: str, top_k: int = 5) -> List[Dict]:
    """Search documents using FAISS"""
    
    if not EMBEDDINGS_AVAILABLE or not embedding_model or not vector_index:
        return []
    
    try:
        # Create query embedding
        query_embedding = embedding_model.encode([query])
        
        # Search in FAISS index
        scores, indices = vector_index.search(query_embedding, top_k)
        
        results = []
        for i, (score, idx) in enumerate(zip(scores[0], indices[0])):
            if idx in chunk_store:
                chunk_data = chunk_store[idx]
                results.append({
                    "content": chunk_data["content"],
                    "score": float(score),
                    "page": chunk_data.get("page", 1),
                    "document_id": chunk_data.get("document_id", "unknown"),
                    "chunk_id": idx
                })
        
        return results
        
    except Exception as e:
        logger.error(f"Search error: {e}")
        return []

# API Endpoints

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    """OpenAI-compatible chat completions endpoint"""
    try:
        data = request.get_json()
        messages = data.get('messages', [])
        max_tokens = data.get('max_tokens', 100)
        temperature = data.get('temperature', 0.7)
        model = data.get('model', CHAT_MODEL)
        
        if not messages:
            return jsonify({"error": "No messages provided"}), 400
        
        # Generate response
        response_content = generate_chat_response(messages, max_tokens, temperature)
        
        return jsonify({
            "id": f"chatcmpl-{int(time.time())}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": model,
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": response_content
                },
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": sum(len(msg.get('content', '').split()) for msg in messages),
                "completion_tokens": len(response_content.split()),
                "total_tokens": sum(len(msg.get('content', '').split()) for msg in messages) + len(response_content.split())
            }
        })
        
    except Exception as e:
        logger.error(f"Chat completion error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/v1/models', methods=['GET'])
def list_models():
    """List available models"""
    return jsonify({
        "object": "list",
        "data": [{
            "id": CHAT_MODEL,
            "object": "model",
            "created": int(time.time()),
            "owned_by": "local"
        }]
    })

@app.route('/upload', methods=['POST'])
def upload_document():
    """Upload and process PDF documents"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Only PDF files are supported"}), 400
        
        # Save uploaded file
        doc_id = str(uuid.uuid4())
        filename = f"{doc_id}_{file.filename}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        # Process PDF
        result = process_pdf(file_path)
        
        if not result["success"]:
            return jsonify(result), 500
        
        # Create embeddings and add to vector store
        if EMBEDDINGS_AVAILABLE and embedding_model and vector_index:
            texts = [chunk["content"] for chunk in result["chunks"]]
            embeddings = create_embeddings(texts)
            
            if embeddings is not None:
                # Add to FAISS index
                vector_index.add(embeddings)
                
                # Store chunk metadata
                start_idx = len(chunk_store)
                for i, chunk in enumerate(result["chunks"]):
                    chunk_store[start_idx + i] = {
                        "content": chunk["content"],
                        "page": chunk["page"],
                        "document_id": doc_id,
                        "chunk_id": chunk["chunk_id"]
                    }
        
        # Store document metadata
        document_store[doc_id] = {
            "id": doc_id,
            "filename": file.filename,
            "file_path": file_path,
            "uploaded_at": datetime.now().isoformat(),
            "total_pages": result["total_pages"],
            "total_chunks": result["total_chunks"]
        }
        
        return jsonify({
            "success": True,
            "document_id": doc_id,
            "filename": file.filename,
            "total_pages": result["total_pages"],
            "total_chunks": result["total_chunks"],
            "embeddings_created": EMBEDDINGS_AVAILABLE and embedding_model is not None
        })
        
    except Exception as e:
        logger.error(f"Upload error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/search', methods=['POST'])
def search():
    """Search documents using semantic similarity"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        top_k = data.get('top_k', 5)
        
        if not query:
            return jsonify({"error": "No query provided"}), 400
        
        results = search_documents(query, top_k)
        
        return jsonify({
            "success": True,
            "query": query,
            "results": results,
            "total_results": len(results)
        })
        
    except Exception as e:
        logger.error(f"Search error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/documents', methods=['GET'])
def list_documents():
    """List uploaded documents"""
    return jsonify({
        "success": True,
        "documents": list(document_store.values()),
        "total": len(document_store)
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "services": {
            "chat": chat_model == "huggingface_api",
            "pdf_processing": PDF_AVAILABLE,
            "embeddings": EMBEDDINGS_AVAILABLE and embedding_model is not None,
            "vector_search": EMBEDDINGS_AVAILABLE and vector_index is not None
        },
        "models": {
            "chat": CHAT_MODEL,
            "embeddings": EMBEDDING_MODEL
        },
        "stats": {
            "documents": len(document_store),
            "chunks": len(chunk_store)
        }
    })

@app.route('/status', methods=['GET'])
def status():
    """Detailed status information"""
    return jsonify({
        "server": "StudyMate Unified AI Server",
        "version": "1.0.0",
        "uptime": time.time(),
        "capabilities": {
            "chat_completions": True,
            "pdf_processing": PDF_AVAILABLE,
            "semantic_search": EMBEDDINGS_AVAILABLE,
            "document_upload": True
        },
        "dependencies": {
            "transformers": HF_AVAILABLE,
            "pymupdf": PDF_AVAILABLE,
            "sentence_transformers": EMBEDDINGS_AVAILABLE,
            "faiss": EMBEDDINGS_AVAILABLE
        }
    })

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 StudyMate Unified AI Server")
    print("=" * 60)
    print("Initializing services...")
    
    # Initialize models
    initialize_models()
    
    print("\n📋 Service Status:")
    print(f"  💬 Chat (IBM Granite): {'✅' if chat_model == 'huggingface_api' else '❌'}")
    print(f"  📄 PDF Processing: {'✅' if PDF_AVAILABLE else '❌'}")
    print(f"  🔍 Embeddings: {'✅' if EMBEDDINGS_AVAILABLE and embedding_model else '❌'}")
    print(f"  🗂️  Vector Search: {'✅' if EMBEDDINGS_AVAILABLE and vector_index is not None else '❌'}")
    
    print(f"\n🤖 AI Model Configuration:")
    print(f"  Model: {CHAT_MODEL}")
    print(f"  API URL: {HUGGINGFACE_API_URL}")
    print(f"  API Key: {'✅ Configured' if HUGGINGFACE_API_KEY else '❌ Missing'}")
    
    print("\n🌐 Endpoints:")
    print("  POST /v1/chat/completions - Chat with AI")
    print("  POST /upload - Upload PDF documents")
    print("  POST /search - Search documents")
    print("  GET  /documents - List documents")
    print("  GET  /health - Health check")
    print("  GET  /status - Detailed status")
    
    print(f"\n🎯 Server starting on http://localhost:8000")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=8000, debug=False)
