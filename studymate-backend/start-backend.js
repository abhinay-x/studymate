
// Direct backend startup script
console.log('🚀 Starting StudyMate Backend...');

// Load environment variables
require('dotenv').config();

// Check critical environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'REFRESH_TOKEN_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  process.exit(1);
}

console.log('✓ Environment variables loaded');

try {
  // Start the main server
  require('./server.js');
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
