const express = require('express');
const { authenticate } = require('../middleware/auth');
const HuggingFaceService = require('../services/huggingFaceService');
const logger = require('../utils/logger');

const router = express.Router();
const hfService = new HuggingFaceService();

// @route   GET /api/models/status
// @desc    Check Hugging Face model availability
// @access  Private
router.get('/status', authenticate, async (req, res) => {
  try {
    const status = await hfService.checkModelStatus();
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    logger.error('Model status check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check model status',
      message: error.message
    });
  }
});

// @route   POST /api/models/test
// @desc    Test Hugging Face API connection
// @access  Private
router.post('/test', authenticate, async (req, res) => {
  try {
    const testResult = await hfService.testConnection();
    
    if (testResult.success) {
      res.json({
        success: true,
        message: 'API connection test successful',
        data: testResult
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'API connection test failed',
        data: testResult
      });
    }
  } catch (error) {
    logger.error('API test error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test API connection',
      message: error.message
    });
  }
});

// @route   GET /api/models/stats
// @desc    Get model configuration and statistics
// @access  Private
router.get('/stats', authenticate, async (req, res) => {
  try {
    const stats = hfService.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Model stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get model stats',
      message: error.message
    });
  }
});

module.exports = router;
