# Manual StudyMate Backend Setup

## Step-by-Step Installation

### 1. Install Dependencies Manually

Open Command Prompt or PowerShell in the `studymate-backend` directory and run:

```bash
npm install express@^4.18.2
npm install mongoose@^7.5.0
npm install jsonwebtoken@^9.0.2
npm install bcryptjs@^2.4.3
npm install multer@^1.4.5-lts.1
npm install multer-gridfs-storage@^5.0.2
npm install gridfs-stream@^1.1.1
npm install cors@^2.8.5
npm install helmet@^7.0.0
npm install express-rate-limit@^6.10.0
npm install express-validator@^7.0.1
npm install dotenv@^16.3.1
npm install axios@^1.5.0
npm install @huggingface/inference@^2.6.4
npm install node-cron@^3.0.2
npm install winston@^3.10.0
npm install compression@^1.7.4
npm install morgan@^1.10.0
npm install cookie-parser@^1.4.6
npm install express-async-errors@^3.1.1
```

### 2. Install Dev Dependencies

```bash
npm install --save-dev nodemon@^3.0.1
npm install --save-dev jest@^29.6.4
npm install --save-dev supertest@^6.3.3
npm install --save-dev eslint@^8.47.0
```

### 3. Start Simple Backend

```bash
node simple-server.js
```

### 4. Test Backend

Open browser and go to: `http://localhost:3000/health`

You should see:
```json
{
  "status": "OK",
  "message": "StudyMate Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## Alternative: Use Docker

If npm installation fails, use Docker:

```bash
docker-compose up -d
```

## Verify Installation

1. **Check Health**: `http://localhost:3000/health`
2. **Test API**: `http://localhost:3000/api/test`
3. **Mock Login**: 
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

## Next Steps

1. Start with `simple-server.js` for immediate frontend testing
2. The simplified backend provides mock endpoints for:
   - Authentication (register/login)
   - Documents listing
   - Conversations listing
3. Once frontend integration is working, upgrade to full backend with MongoDB

## Troubleshooting

- **Port 3000 in use**: Change PORT in .env or use different port
- **Module not found**: Run manual npm install commands above
- **Permission errors**: Run as administrator or use `sudo`
