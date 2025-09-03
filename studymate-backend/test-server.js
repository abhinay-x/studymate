// Simple test script to check for basic issues
console.log('Testing StudyMate Backend...');

try {
  // Test environment variables
  require('dotenv').config();
  console.log('✓ Environment variables loaded');
  
  // Test basic requires
  const express = require('express');
  console.log('✓ Express loaded');
  
  const mongoose = require('mongoose');
  console.log('✓ Mongoose loaded');
  
  // Test logger
  const logger = require('./utils/logger');
  console.log('✓ Logger loaded');
  
  // Test models
  const { User } = require('./models');
  console.log('✓ Models loaded');
  
  // Test routes
  const authRoutes = require('./routes/auth');
  console.log('✓ Auth routes loaded');
  
  const documentRoutes = require('./routes/documents');
  console.log('✓ Document routes loaded');
  
  const conversationRoutes = require('./routes/conversations');
  console.log('✓ Conversation routes loaded');
  
  const userRoutes = require('./routes/users');
  console.log('✓ User routes loaded');
  
  const modelRoutes = require('./routes/models');
  console.log('✓ Model routes loaded');
  
  // Test services
  const HuggingFaceService = require('./services/huggingFaceService');
  console.log('✓ Hugging Face service loaded');
  
  console.log('\n🎉 All modules loaded successfully!');
  console.log('Backend is ready to start.');
  
} catch (error) {
  console.error('❌ Error loading modules:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
