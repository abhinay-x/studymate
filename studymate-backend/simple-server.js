// Simplified StudyMate Backend Server for Testing
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'StudyMate Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'StudyMate API is working',
    version: '1.0.0'
  });
});

// Mock auth endpoints for frontend testing
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'User registered successfully (mock)',
    data: {
      user: { id: '1', email: req.body.email, name: req.body.name },
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login successful (mock)',
    data: {
      user: { id: '1', email: req.body.email, name: 'Test User' },
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token'
    }
  });
});

// Mock documents endpoint
app.get('/api/documents', (req, res) => {
  res.json({
    success: true,
    data: {
      documents: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 }
    }
  });
});

// Mock conversations endpoint
app.get('/api/conversations', (req, res) => {
  res.json({
    success: true,
    data: {
      conversations: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 StudyMate Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
});

module.exports = app;
