# StudyMate Backend

A comprehensive AI-powered PDF-based Q&A system backend built with Node.js, MongoDB, and Hugging Face integration.

## 🏗️ Architecture Overview

### Core Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **File Storage**: GridFS (MongoDB)
- **LLM Integration**: Hugging Face Inference API (2B model)
- **Python Services**: FastAPI microservices for PDF processing and embeddings
- **Containerization**: Docker & Docker Compose

### Services Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Nginx Proxy   │    │   Backend API   │
│   (React)       │◄──►│   Load Balancer │◄──►│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐             │
                       │   MongoDB       │◄────────────┤
                       │   + GridFS      │             │
                       └─────────────────┘             │
                                                        │
┌─────────────────┐    ┌─────────────────┐             │
│  PDF Processor  │◄───┤  Embedding      │◄────────────┘
│  (Python)       │    │  Service        │
│                 │    │  (Python)       │
└─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Python 3.11+
- MongoDB 7.0+
- Docker & Docker Compose (optional)

### Environment Setup

1. **Clone and navigate to backend directory**
```bash
cd studymate-backend
```

2. **Copy environment file**
```bash
cp .env.example .env
```

3. **Configure environment variables in `.env`**
```env
# Required configurations
MONGODB_URI=mongodb://localhost:27017/studymate
JWT_SECRET=your_super_secret_key_change_this_in_production
REFRESH_TOKEN_SECRET=your_refresh_secret_change_this_in_production
HUGGINGFACE_API_KEY=your_huggingface_api_token

# Optional configurations
NODE_ENV=development
PORT=3000
```

### Installation & Running

#### Option 1: Docker Compose (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Option 2: Manual Setup
```bash
# Install Node.js dependencies
npm install

# Start MongoDB (if not using Docker)
mongod

# Start Python microservices
chmod +x scripts/start-services.sh
./scripts/start-services.sh

# Start main backend server
npm run dev
```

## 📚 API Documentation

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
x-refresh-token: your_refresh_token
```

### Document Management

#### Upload PDF
```http
POST /api/documents/upload
Authorization: Bearer your_access_token
Content-Type: multipart/form-data

pdf: [PDF file]
```

#### Get User Documents
```http
GET /api/documents?page=1&limit=10
Authorization: Bearer your_access_token
```

#### Download Document
```http
GET /api/documents/:id/download
Authorization: Bearer your_access_token
```

### Conversations & Q&A

#### Create Conversation
```http
POST /api/conversations
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "title": "My Study Session",
  "documentIds": ["document_id_1", "document_id_2"]
}
```

#### Ask Question
```http
POST /api/conversations/:id/messages
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "question": "What is the main topic of this document?"
}
```

#### Get Conversation History
```http
GET /api/conversations/:id/messages
Authorization: Bearer your_access_token
```

### Model & Usage

#### Check Model Status
```http
GET /api/models/status
Authorization: Bearer your_access_token
```

#### Get Usage Statistics
```http
GET /api/users/usage/stats
Authorization: Bearer your_access_token
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/studymate` |
| `JWT_SECRET` | JWT signing secret | Required |
| `REFRESH_TOKEN_SECRET` | Refresh token secret | Required |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | Required |
| `HUGGINGFACE_MODEL` | Model name | `microsoft/DialoGPT-medium` |
| `USER_DAILY_QUESTION_LIMIT` | Daily questions per user | `50` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `10485760` (10MB) |

### Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes  
- **File Upload**: 10 uploads per hour
- **AI Questions**: 10 questions per minute

## 🐍 Python Microservices

### PDF Processor Service (Port 5001)
- **Purpose**: Extract text from PDF files and create chunks
- **Technology**: FastAPI + PyMuPDF
- **Endpoints**:
  - `POST /process-pdf` - Process uploaded PDF
  - `POST /process-document/{id}` - Process by document ID
  - `GET /health` - Health check

### Embedding Service (Port 5002)
- **Purpose**: Generate embeddings and semantic search
- **Technology**: FastAPI + SentenceTransformers + FAISS
- **Model**: `all-MiniLM-L6-v2`
- **Endpoints**:
  - `POST /generate-embeddings` - Generate embeddings
  - `POST /embed-document-chunks/{id}` - Embed document chunks
  - `POST /search-similar` - Semantic search
  - `GET /health` - Health check

## 🗄️ Database Schema

### Collections

#### Users
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date,
  lastLogin: Date,
  isActive: Boolean,
  apiUsage: {
    dailyQuestions: Number,
    lastReset: Date,
    totalQuestions: Number
  }
}
```

#### Documents
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  filename: String,
  originalName: String,
  fileId: ObjectId, // GridFS reference
  uploadDate: Date,
  status: String, // 'processing', 'ready', 'failed'
  chunkCount: Number,
  metadata: {
    pages: Number,
    fileSize: Number,
    extractedText: Boolean
  }
}
```

#### Conversations
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  documentIds: [ObjectId],
  title: String,
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean,
  modelUsed: String
}
```

#### Messages
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId,
  question: String,
  answer: String,
  referencedChunks: [String],
  confidence: Number,
  timestamp: Date,
  modelResponse: {
    model: String,
    tokensUsed: Number,
    responseTime: Number
  }
}
```

## 🔒 Security Features

- **JWT Authentication** with access & refresh tokens
- **Password Hashing** with bcrypt (12 rounds)
- **Rate Limiting** on all endpoints
- **Input Validation** with express-validator
- **CORS Protection** with configurable origins
- **Security Headers** via Helmet.js
- **File Type Validation** (PDF only)
- **File Size Limits** (10MB default)

## 📊 Monitoring & Logging

### Health Checks
- Main API: `GET /health`
- PDF Service: `GET /pdf-service/health`  
- Embedding Service: `GET /embedding-service/health`

### Logging
- **Winston** for structured logging
- Log levels: error, warn, info, debug
- Separate error and combined log files
- Console output in development

### Metrics
- API response times
- Database query performance
- Hugging Face API usage
- User activity statistics

## 🚀 Deployment

### Production Checklist
- [ ] Set strong JWT secrets
- [ ] Configure Hugging Face API key
- [ ] Set up MongoDB Atlas or production database
- [ ] Configure SSL certificates
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy
- [ ] Set production environment variables

### Docker Production
```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up --scale backend=3 --scale embedding-service=2
```

## 🛠️ Development

### Project Structure
```
studymate-backend/
├── config/           # Database and GridFS configuration
├── middleware/       # Authentication, validation, rate limiting
├── models/          # MongoDB schemas
├── routes/          # API route handlers  
├── services/        # Business logic (Hugging Face, etc.)
├── utils/           # Utilities (logger, etc.)
├── python-services/ # Python microservices
│   ├── pdf-processor/
│   └── embedding-service/
├── scripts/         # Startup and utility scripts
├── nginx/           # Nginx configuration
└── logs/           # Application logs
```

### Adding New Features

1. **Create Model** (if needed) in `models/`
2. **Add Routes** in `routes/`
3. **Implement Middleware** (if needed) in `middleware/`
4. **Add Validation** in `middleware/validation.js`
5. **Update Documentation**

### Testing
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Lint code
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Check MongoDB status
mongosh --eval "db.adminCommand('ping')"

# Start MongoDB
sudo systemctl start mongod
```

**Python Services Not Starting**
```bash
# Check Python version
python --version  # Should be 3.11+

# Install dependencies manually
cd python-services/pdf-processor
pip install -r requirements.txt
```

**Hugging Face API Errors**
- Verify API key in `.env`
- Check rate limits
- Monitor model availability

**File Upload Issues**
- Check file size limits
- Verify GridFS configuration
- Ensure proper permissions

### Getting Help

- Check logs: `docker-compose logs -f`
- Monitor health endpoints
- Review error messages in console
- Check MongoDB connection

## 🔗 Related Links

- [Hugging Face Models](https://huggingface.co/models)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Docker Compose](https://docs.docker.com/compose/)
