// Minimal test to identify issues
console.log('Starting minimal backend test...');

// Test 1: Basic Node.js
console.log('Node.js version:', process.version);

// Test 2: Environment loading
try {
  require('dotenv').config();
  console.log('✓ dotenv loaded');
} catch (e) {
  console.error('❌ dotenv error:', e.message);
}

// Test 3: Express
try {
  const express = require('express');
  const app = express();
  console.log('✓ Express loaded');
  
  app.get('/test', (req, res) => {
    res.json({ status: 'ok' });
  });
  
  const server = app.listen(3001, () => {
    console.log('✓ Test server running on port 3001');
    server.close();
  });
  
} catch (e) {
  console.error('❌ Express error:', e.message);
}

console.log('Test completed.');
