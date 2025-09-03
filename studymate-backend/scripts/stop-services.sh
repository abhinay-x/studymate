#!/bin/bash

# StudyMate Services Stop Script

echo "🛑 Stopping StudyMate Services..."

# Stop PDF Processing Service
if [ -f .pdf_service.pid ]; then
    PDF_PID=$(cat .pdf_service.pid)
    if kill -0 $PDF_PID 2>/dev/null; then
        echo "📄 Stopping PDF Processing Service (PID: $PDF_PID)..."
        kill $PDF_PID
        rm .pdf_service.pid
    else
        echo "📄 PDF Processing Service not running"
        rm -f .pdf_service.pid
    fi
fi

# Stop Embedding Service
if [ -f .embedding_service.pid ]; then
    EMBEDDING_PID=$(cat .embedding_service.pid)
    if kill -0 $EMBEDDING_PID 2>/dev/null; then
        echo "🧠 Stopping Embedding Service (PID: $EMBEDDING_PID)..."
        kill $EMBEDDING_PID
        rm .embedding_service.pid
    else
        echo "🧠 Embedding Service not running"
        rm -f .embedding_service.pid
    fi
fi

# Kill any remaining uvicorn processes on our ports
echo "🔍 Cleaning up any remaining processes..."
pkill -f "uvicorn.*:500[12]" 2>/dev/null || true

echo "✅ All services stopped successfully!"
