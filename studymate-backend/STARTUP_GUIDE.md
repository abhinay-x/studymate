# StudyMate Backend Startup Guide

## Quick Start (Simplified Backend)

### 1. Install Dependencies
```bash
cd studymate-backend
npm install express cors dotenv
```

### 2. Start Simple Backend
```bash
node simple-server.js
```

This will start a basic backend server on `http://localhost:3000` with mock endpoints for testing the frontend.

## Full Backend Setup

### Prerequisites
- Node.js 16+
- MongoDB (local or MongoDB Atlas)
- Python 3.11+ (for microservices)

### 1. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Edit .env file with your configuration
# Required: MONGODB_URI, JWT_SECRET, REFRESH_TOKEN_SECRET, HUGGINGFACE_API_KEY
```

### 2. Install Node.js Dependencies
```bash
npm install
```

### 3. Start MongoDB
```bash
# Option A: Local MongoDB
mongod

# Option B: Docker MongoDB
docker run -d -p 27017:27017 --name studymate-mongo mongo:7.0
```

### 4. Start Backend Services

#### Option A: Full Stack with Docker
```bash
docker-compose up -d
```

#### Option B: Manual Startup
```bash
# Start main backend
npm run dev

# In separate terminals, start Python services:
cd python-services/pdf-processor
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 5001

cd ../embedding-service
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 5002
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Documents
- `GET /api/documents` - List user documents
- `POST /api/documents/upload` - Upload PDF
- `GET /api/documents/:id/download` - Download document

### Conversations
- `GET /api/conversations` - List conversations
- `POST /api/conversations` - Create conversation
- `POST /api/conversations/:id/messages` - Send question

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file

2. **Missing Dependencies**
   - Run `npm install` in backend directory
   - Check Node.js version (16+)

3. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes: `pkill -f node`

4. **Python Services Not Starting**
   - Check Python version (3.11+)
   - Install requirements: `pip install -r requirements.txt`

### Testing Backend

1. **Health Check**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Test API**
   ```bash
   curl http://localhost:3000/api/test
   ```

3. **Register User (Mock)**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
   ```

## Next Steps

1. Start with `simple-server.js` for immediate frontend testing
2. Set up MongoDB for full functionality
3. Configure Hugging Face API key for AI features
4. Start Python microservices for PDF processing
