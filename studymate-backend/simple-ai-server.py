#!/usr/bin/env python3
"""
Simple StudyMate AI Server - Basic version with minimal dependencies
Works with just Flask and basic Python libraries
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import time
import logging
import random

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

def generate_smart_response(user_message: str) -> str:
    """Generate contextual responses based on user input"""
    
    user_lower = user_message.lower()
    
    # Greeting responses
    if any(word in user_lower for word in ['hello', 'hi', 'hey']):
        greetings = [
            f"Hello! I'm StudyMate, your AI learning assistant. How can I help you today?",
            f"Hi there! I'm here to help with your studies. What would you like to learn about?",
            f"Hey! Ready to dive into some learning? What topic interests you?"
        ]
        return random.choice(greetings)
    
    # Identity questions
    elif any(word in user_lower for word in ['who are you', 'what are you']):
        return "I'm StudyMate, an AI-powered learning assistant designed to help students with their studies, answer questions, and provide educational support."
    
    # Name recognition
    elif 'abhinay' in user_lower:
        return f"Nice to meet you, Abhinay! I'm StudyMate, your AI study companion. I'm here to help you learn, understand complex topics, and support your educational journey. What would you like to study today?"
    
    # LLM/AI questions
    elif any(word in user_lower for word in ['llm', 'language model', 'ai model']):
        return "LLM stands for Large Language Model. It's an AI system trained on vast amounts of text data to understand and generate human-like responses. These models can help with various tasks like answering questions, writing, coding, and educational support."
    
    # Explanation requests
    elif any(word in user_lower for word in ['explain', 'what is', 'how does']):
        topic = user_message.replace('explain', '').replace('what is', '').replace('how does', '').strip()
        return f"I'd be happy to explain {topic}! This is an interesting topic with several key concepts. Let me break it down: {topic} involves multiple interconnected ideas that work together. Would you like me to go deeper into any specific aspect?"
    
    # Study-related questions
    elif any(word in user_lower for word in ['study', 'learn', 'understand']):
        return f"Great question about learning! Effective studying involves understanding concepts deeply rather than just memorizing. For '{user_message}', I recommend breaking it down into smaller parts and connecting it to what you already know. What specific aspect would you like to focus on?"
    
    # Math/Science questions
    elif any(word in user_lower for word in ['math', 'science', 'physics', 'chemistry', 'biology']):
        return f"Excellent! {user_message} is a fascinating area of study. These subjects build logical thinking and problem-solving skills. What specific concept or problem are you working on? I can help break it down step by step."
    
    # Programming/Tech questions
    elif any(word in user_lower for word in ['code', 'programming', 'python', 'javascript']):
        return f"Programming is a valuable skill! For '{user_message}', the key is understanding the logic and practicing regularly. Would you like help with a specific concept, debugging, or learning resources?"
    
    # General academic help
    elif any(word in user_lower for word in ['help', 'homework', 'assignment']):
        return f"I'm here to help with your studies! For '{user_message}', let's approach this systematically. What specific part are you finding challenging? I can guide you through the problem-solving process."
    
    # Default intelligent response
    else:
        responses = [
            f"That's an interesting question about '{user_message}'. Let me help you explore this topic. What specific aspect would you like to understand better?",
            f"I see you're asking about '{user_message}'. This is a topic worth exploring! Can you tell me more about what you'd like to learn or what's confusing you?",
            f"Great question! '{user_message}' touches on some important concepts. To give you the best help, could you share more context about what you're trying to understand?"
        ]
        return random.choice(responses)

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    """OpenAI-compatible chat completions endpoint"""
    try:
        data = request.get_json()
        messages = data.get('messages', [])
        max_tokens = data.get('max_tokens', 150)
        temperature = data.get('temperature', 0.7)
        model = data.get('model', 'studymate-basic')
        
        if not messages:
            return jsonify({"error": "No messages provided"}), 400
        
        # Extract user message
        user_message = ""
        for msg in reversed(messages):
            if msg.get('role') == 'user':
                user_message = msg.get('content', '')
                break
        
        if not user_message:
            return jsonify({"error": "No user message found"}), 400
        
        # Generate response
        response_content = generate_smart_response(user_message)
        
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
                "prompt_tokens": len(user_message.split()),
                "completion_tokens": len(response_content.split()),
                "total_tokens": len(user_message.split()) + len(response_content.split())
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
            "id": "studymate-basic",
            "object": "model",
            "created": int(time.time()),
            "owned_by": "studymate"
        }]
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "server": "StudyMate Simple AI Server",
        "services": {
            "chat": True,
            "pdf_processing": False,
            "embeddings": False,
            "vector_search": False
        }
    })

@app.route('/status', methods=['GET'])
def status():
    """Detailed status information"""
    return jsonify({
        "server": "StudyMate Simple AI Server",
        "version": "1.0.0",
        "uptime": time.time(),
        "capabilities": {
            "chat_completions": True,
            "contextual_responses": True,
            "educational_focus": True
        },
        "dependencies": {
            "flask": True,
            "flask_cors": True,
            "advanced_ai": False
        }
    })

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 StudyMate Simple AI Server")
    print("=" * 60)
    print("📋 Features:")
    print("  💬 Smart Chat Responses")
    print("  🎓 Educational Focus")
    print("  🔄 OpenAI Compatible API")
    print("  ⚡ No Heavy Dependencies")
    
    print("\n🌐 Endpoints:")
    print("  POST /v1/chat/completions - Chat with AI")
    print("  GET  /v1/models - List models")
    print("  GET  /health - Health check")
    print("  GET  /status - Server status")
    
    print(f"\n🎯 Server starting on http://localhost:8000")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=8000, debug=False)
