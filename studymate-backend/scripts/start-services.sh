#!/bin/bash

# StudyMate Python Services Startup Script

echo "🐍 Starting StudyMate Python Microservices..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Start PDF Processing Service
echo "📄 Starting PDF Processing Service on port 5001..."
if check_port 5001; then
    cd python-services/pdf-processor
    if [ ! -d "venv" ]; then
        echo "🔧 Creating virtual environment for PDF processor..."
        python -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    else
        source venv/bin/activate
    fi
    
    echo "🚀 PDF Processor starting..."
    uvicorn main:app --host 0.0.0.0 --port 5001 --reload &
    PDF_PID=$!
    cd ../..
else
    echo "❌ Cannot start PDF processor - port 5001 in use"
fi

# Start Embedding Service
echo "🧠 Starting Embedding Service on port 5002..."
if check_port 5002; then
    cd python-services/embedding-service
    if [ ! -d "venv" ]; then
        echo "🔧 Creating virtual environment for embedding service..."
        python -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    else
        source venv/bin/activate
    fi
    
    echo "🚀 Embedding Service starting..."
    uvicorn main:app --host 0.0.0.0 --port 5002 --reload &
    EMBEDDING_PID=$!
    cd ../..
else
    echo "❌ Cannot start embedding service - port 5002 in use"
fi

# Save PIDs for cleanup
echo $PDF_PID > .pdf_service.pid
echo $EMBEDDING_PID > .embedding_service.pid

echo "✅ Python services started successfully!"
echo "📄 PDF Processor: http://localhost:5001"
echo "🧠 Embedding Service: http://localhost:5002"
echo ""
echo "To stop services, run: ./scripts/stop-services.sh"
