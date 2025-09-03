#!/bin/bash

# StudyMate Backend Startup Script

echo "🚀 Starting StudyMate Backend Services..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please update .env file with your configuration before running again."
    exit 1
fi

# Load environment variables
source .env

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if ! mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "❌ MongoDB is not running. Please start MongoDB first."
    echo "💡 You can use: docker-compose up mongodb -d"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Create logs directory
mkdir -p logs

# Start the main backend server
echo "🌟 Starting StudyMate Backend Server..."
npm run dev
