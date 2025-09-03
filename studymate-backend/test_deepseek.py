#!/usr/bin/env python3
"""
Test DeepSeek API connection
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_deepseek_api():
    """Test DeepSeek API with the configured key"""
    
    api_key = os.getenv('DEEPSEEK_API_KEY')
    
    if not api_key:
        print("❌ DEEPSEEK_API_KEY not found in environment")
        return False
    
    print(f"🔑 Using API key: {api_key[:20]}...")
    
    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "deepseek-chat",
            "messages": [
                {
                    "role": "user",
                    "content": "Hello, this is a test message. Please respond with 'DeepSeek API is working correctly!'"
                }
            ],
            "max_tokens": 50,
            "temperature": 0.7
        }
        
        print("🚀 Testing DeepSeek API...")
        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=15
        )
        
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            ai_response = result["choices"][0]["message"]["content"]
            print(f"✅ DeepSeek Response: {ai_response}")
            return True
        else:
            print(f"❌ API Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 DeepSeek API Test")
    print("=" * 30)
    success = test_deepseek_api()
    print("=" * 30)
    print(f"Result: {'✅ SUCCESS' if success else '❌ FAILED'}")
