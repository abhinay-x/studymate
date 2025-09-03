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
import os
from pathlib import Path

# Get the directory where this script is located
script_dir = Path(__file__).parent
env_path = script_dir / '.env'

# Load environment variables from the .env file in the same directory
load_dotenv(dotenv_path=env_path)

# Debug: Print API key status (first few characters only for security)
deepseek_key = os.getenv('DEEPSEEK_API_KEY')
if deepseek_key:
    print(f"✅ DeepSeek API key loaded: {deepseek_key[:10]}...")
else:
    print("❌ DeepSeek API key not found in environment")


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
    import fitz  # PyMuPDF
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
# Use a widely available public instruct model by default to avoid 404s
CHAT_MODEL = os.getenv('CHAT_MODEL', 'HuggingFaceH4/zephyr-7b-beta')
HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY')
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/gpt2"

# DeepSeek API configuration
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
USE_DEEPSEEK = os.getenv('USE_DEEPSEEK', 'true').lower() == 'true'

# Hugging Face API configuration
HF_MAX_TOKENS = int(os.getenv('HF_MAX_TOKENS', '512'))
HF_TEMPERATURE = float(os.getenv('HF_TEMPERATURE', '0.7'))
HF_TOP_P = float(os.getenv('HF_TOP_P', '0.9'))
HF_TIMEOUT = 30000  # 30 seconds timeout

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

# Service URLs for microservices
EMBEDDING_SERVICE_URL = os.getenv('EMBEDDING_SERVICE_URL', 'http://localhost:5002')
PDF_PROCESSOR_URL = os.getenv('PDF_PROCESSOR_URL', 'http://localhost:5001')

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(VECTOR_DB_PATH, exist_ok=True)

def initialize_models():
    """Initialize all AI models"""
    global chat_model, chat_tokenizer, embedding_model, vector_index
    
    logger.info("Initializing AI models...")
    
    # Debug environment variables
    logger.info(f"DEEPSEEK_API_KEY present: {bool(DEEPSEEK_API_KEY)}")
    logger.info(f"USE_DEEPSEEK: {USE_DEEPSEEK}")
    logger.info(f"HUGGINGFACE_API_KEY present: {bool(HUGGINGFACE_API_KEY)}")
    
    # Check which API to use
    if USE_DEEPSEEK and DEEPSEEK_API_KEY:
        logger.info(f"✅ Using DeepSeek API (displayed as IBM Granite)")
        logger.info(f"✅ DeepSeek API URL: {DEEPSEEK_API_URL}")
        logger.info(f"✅ DeepSeek API Key (first 10 chars): {DEEPSEEK_API_KEY[:10]}...")
        chat_model = "deepseek_api"
    elif HUGGINGFACE_API_KEY:
        logger.info(f"✅ Using Hugging Face API for IBM Granite model: {CHAT_MODEL}")
        logger.info(f"✅ API URL: {HUGGINGFACE_API_URL}")
        chat_model = "huggingface_api"
        chat_tokenizer = AutoTokenizer.from_pretrained(CHAT_MODEL)
    else:
        logger.warning("❌ No API keys provided for DeepSeek or Hugging Face")
        chat_model = None
        chat_tokenizer = None
    
    # Initialize embedding model
    if EMBEDDINGS_AVAILABLE:
        try:
            logger.info(f"Loading embedding model: {EMBEDDING_MODEL}")
            embedding_model = SentenceTransformer(EMBEDDING_MODEL)
            
            # Initialize FAISS index
            vector_index = faiss.IndexFlatIP(384)  # MiniLM embedding dimension
            logger.info("✅ Embedding model and FAISS index initialized")
        except Exception as e:
            logger.error(f"❌ Failed to load embedding model: {e}")
            embedding_model = None
            vector_index = None
    else:
        logger.warning("⚠️ Embeddings not available - sentence-transformers/faiss not installed")

def generate_deepseek_response(messages, max_tokens=512, temperature=0.7):
    """Generate response using DeepSeek API"""
    try:
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "deepseek-chat",
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "stream": False
        }
        
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=30)
        
        logger.info(f"DeepSeek API response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            if "choices" in result and len(result["choices"]) > 0:
                return result["choices"][0]["message"]["content"].strip()
            else:
                logger.error(f"DeepSeek API returned empty choices: {result}")
                return "I apologize, but I'm having trouble generating a response right now."
        else:
            logger.error(f"DeepSeek API error: {response.status_code}")
            logger.error(f"Response headers: {dict(response.headers)}")
            logger.error(f"Response body: {response.text}")
            
            # More specific error messages
            if response.status_code == 401:
                return "Authentication failed. Please check your API key configuration."
            elif response.status_code == 429:
                return "Rate limit exceeded. Please try again in a moment."
            elif response.status_code == 403:
                return "Access forbidden. Please verify your API permissions."
            else:
                return f"API error (status {response.status_code}). Please try again later."
            
    except Exception as e:
        logger.error(f"Error calling DeepSeek API: {e}")
        return "I apologize, but I'm having trouble connecting to the AI service."

def search_document_context(query: str, limit: int = 3) -> List[Dict[str, Any]]:
    """Search for relevant document chunks using embedding service"""
    try:
        search_payload = {
            "query": query,
            "limit": limit
        }
        
        response = requests.post(
            f"{EMBEDDING_SERVICE_URL}/search-similar",
            json=search_payload,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success') and result.get('results'):
                logger.info(f"Found {len(result['results'])} relevant document chunks")
                return result['results']
            else:
                logger.info("No relevant document chunks found")
                return []
        else:
            logger.error(f"Embedding service error: {response.status_code}")
            return []
            
    except Exception as e:
        logger.error(f"Error searching document context: {e}")
        return []

def inject_document_context(messages: List[Dict], context_chunks: List[Dict]) -> List[Dict]:
    """Inject document context into the conversation messages"""
    if not context_chunks:
        return messages
    
    # Build context from relevant chunks
    context_text = "\n\n".join([
        f"Document Context {i+1}:\n{chunk['content']}"
        for i, chunk in enumerate(context_chunks)
    ])
    
    # Get the last user message
    user_message = messages[-1]['content'] if messages else ""
    
    # Create enhanced prompt with context
    enhanced_prompt = f"""You are StudyMate, an AI learning assistant. Use the following document context to answer the user's question. If the context doesn't contain relevant information, provide a helpful general response.

Document Context:
{context_text}

User Question: {user_message}

Please provide a helpful and accurate response based on the context above:"""
    
    # Replace the last user message with the enhanced prompt
    enhanced_messages = messages.copy()
    enhanced_messages[-1] = {
        "role": "user",
        "content": enhanced_prompt
    }
    
    return enhanced_messages

def generate_huggingface_response(messages, max_tokens=512, temperature=0.7):
    """Generate response using Hugging Face API"""
    try:
        # Simple prompt for gpt2 testing
        prompt = messages[-1]['content']

        headers = {
            "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": max_tokens,
                "temperature": temperature,
                "top_p": HF_TOP_P,
                "return_full_text": False
            }
        }

        response = requests.post(HUGGINGFACE_API_URL, headers=headers, json=payload, timeout=HF_TIMEOUT/1000)

        if response.status_code == 200:
            result = response.json()
            # Handle different response formats
            if isinstance(result, list) and len(result) > 0:
                return result[0].get("generated_text", "").strip()
            elif isinstance(result, dict):
                return result.get("generated_text", "").strip()
            else:
                logger.warning(f"Unexpected Hugging Face response format: {result}")
                return "I apologize, but I'm having trouble generating a response right now."
        else:
            logger.error(f"Hugging Face API error: {response.status_code} - {response.text}")
            return f"API error (status {response.status_code}). Please try again later."
            
    except requests.exceptions.Timeout:
        logger.error("Hugging Face API request timed out")
        return "The AI service is taking too long to respond. Please try again later."
    except Exception as e:
        logger.error(f"Error calling Hugging Face API: {e}")
        return "I apologize, but I'm having trouble connecting to the AI service."

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    data = request.json
    messages = data.get('messages', [])
    stream = data.get('stream', False)
    use_context = data.get('use_context', True)  # Enable context by default

    # For now, we don't support streaming
    if stream:
        return jsonify({"error": "Streaming not supported"}), 400

    # Get user query for context search
    user_query = messages[-1]['content'] if messages else ""
    
    # Search for relevant document context if enabled
    context_chunks = []
    if use_context and user_query:
        logger.info(f"Searching document context for query: {user_query[:100]}...")
        context_chunks = search_document_context(user_query, limit=3)
        
        if context_chunks:
            logger.info(f"Using {len(context_chunks)} document chunks for context")
            # Inject context into messages
            messages = inject_document_context(messages, context_chunks)
        else:
            logger.info("No relevant document context found, using general AI response")

    # Generate response
    if chat_model == "deepseek_api":
        response_text = generate_deepseek_response(messages)
    elif chat_model == "huggingface_api":
        response_text = generate_huggingface_response(messages)
    else:
        response_text = "Error: No AI model configured"

    # Format response in OpenAI-like format
    return jsonify({
        "id": f"chatcmpl-{uuid.uuid4().hex}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": CHAT_MODEL,
        "choices": [{
            "index": 0,
            "message": {
                "role": "assistant",
                "content": response_text
            },
            "finish_reason": "stop"
        }],
        "usage": {
            "prompt_tokens": 0,  # TODO: calculate
            "completion_tokens": 0,
            "total_tokens": 0
        },
        "context_used": len(context_chunks) > 0,
        "context_chunks": len(context_chunks)
    })

@app.route('/api/upload', methods=['POST'])
def upload_document():
    """Upload and process PDF document"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Only PDF files are supported"}), 400
        
        # Forward to PDF processor service
        files = {'file': (file.filename, file.stream, file.content_type)}
        response = requests.post(
            f"{PDF_PROCESSOR_URL}/process-pdf",
            files=files,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            logger.info(f"PDF processed: {result['total_chunks']} chunks created")
            
            # Generate embeddings for the chunks
            embedding_response = requests.post(
                f"{EMBEDDING_SERVICE_URL}/generate-embeddings",
                json={"texts": [chunk["content"] for chunk in result["chunks"]]},
                timeout=60
            )
            
            if embedding_response.status_code == 200:
                logger.info("Embeddings generated successfully")
                return jsonify({
                    "success": True,
                    "filename": result["filename"],
                    "total_chunks": result["total_chunks"],
                    "message": "Document uploaded and processed successfully"
                })
            else:
                logger.error(f"Embedding generation failed: {embedding_response.status_code}")
                return jsonify({
                    "success": True,
                    "filename": result["filename"],
                    "total_chunks": result["total_chunks"],
                    "message": "Document uploaded but embedding generation failed"
                })
        else:
            logger.error(f"PDF processing failed: {response.status_code}")
            return jsonify({"error": "Failed to process PDF"}), 500
            
    except Exception as e:
        logger.error(f"Upload error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/documents', methods=['GET'])
def list_documents():
    """List all uploaded documents"""
    try:
        # Get stats from PDF processor
        response = requests.get(f"{PDF_PROCESSOR_URL}/stats", timeout=10)
        if response.status_code == 200:
            return response.json()
        else:
            return jsonify({"error": "Failed to get document stats"}), 500
    except Exception as e:
        logger.error(f"Error listing documents: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/search', methods=['POST'])
def search_documents():
    """Search documents using semantic similarity"""
    try:
        data = request.json
        query = data.get('query', '')
        limit = data.get('limit', 5)
        
        if not query:
            return jsonify({"error": "Query is required"}), 400
        
        # Forward to embedding service
        response = requests.post(
            f"{EMBEDDING_SERVICE_URL}/search-similar",
            json={"query": query, "limit": limit},
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            return jsonify({"error": "Search failed"}), 500
            
    except Exception as e:
        logger.error(f"Search error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Check all services
        services_status = {}
        
        # Check PDF processor
        try:
            pdf_response = requests.get(f"{PDF_PROCESSOR_URL}/health", timeout=5)
            services_status['pdf_processor'] = pdf_response.status_code == 200
        except:
            services_status['pdf_processor'] = False
        
        # Check embedding service
        try:
            embedding_response = requests.get(f"{EMBEDDING_SERVICE_URL}/health", timeout=5)
            services_status['embedding_service'] = embedding_response.status_code == 200
        except:
            services_status['embedding_service'] = False
        
        return jsonify({
            "status": "healthy",
            "service": "unified-ai-server",
            "chat_model": chat_model,
            "services": services_status,
            "timestamp": datetime.utcnow().isoformat()
        })
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

if __name__ == '__main__':
    initialize_models()
    app.run(host='0.0.0.0', port=5000, debug=True)
