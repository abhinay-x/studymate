const express = require('express');
const { authenticate } = require('../middleware/auth');
const { User, Message } = require('../models');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/users/usage/stats
// @desc    Get user's API usage statistics
// @access  Private
router.get('/usage/stats', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const dailyLimit = parseInt(process.env.USER_DAILY_QUESTION_LIMIT) || 50;
    
    // Get recent activity (last 7 days)
    const recentMessages = await Message.getRecentMessages(user._id, 7);
    
    // Calculate daily usage for the last 7 days
    const dailyUsage = {};
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      dailyUsage[dateStr] = 0;
    }
    
    recentMessages.forEach(message => {
      const dateStr = message.timestamp.toDateString();
      if (dailyUsage.hasOwnProperty(dateStr)) {
        dailyUsage[dateStr]++;
      }
    });

    res.json({
      success: true,
      data: {
        currentUsage: {
          dailyQuestions: user.apiUsage.dailyQuestions,
          dailyLimit,
          remainingQuestions: dailyLimit - user.apiUsage.dailyQuestions,
          totalQuestions: user.apiUsage.totalQuestions,
          lastReset: user.apiUsage.lastReset
        },
        weeklyUsage: dailyUsage,
        statistics: {
          averageQuestionsPerDay: Math.round(recentMessages.length / 7),
          totalMessagesLast7Days: recentMessages.length
        }
      }
    });
  } catch (error) {
    logger.error('Get usage stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch usage statistics',
      message: error.message
    });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const user = req.user;
    
    // Get user's document count
    const { Document, Conversation } = require('../models');
    const documentCount = await Document.countDocuments({ userId: user._id });
    const conversationCount = await Conversation.countDocuments({ 
      userId: user._id, 
      isActive: true 
    });
    
    // Get recent messages
    const recentMessages = await Message.getRecentMessages(user._id, 7);
    
    // Get processing documents
    const processingDocuments = await Document.countDocuments({ 
      userId: user._id, 
      status: 'processing' 
    });

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        statistics: {
          totalDocuments: documentCount,
          totalConversations: conversationCount,
          questionsLast7Days: recentMessages.length,
          processingDocuments
        },
        usage: {
          dailyQuestions: user.apiUsage.dailyQuestions,
          dailyLimit: parseInt(process.env.USER_DAILY_QUESTION_LIMIT) || 50,
          totalQuestions: user.apiUsage.totalQuestions
        }
      }
    });
  } catch (error) {
    logger.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data',
      message: error.message
    });
  }
});

module.exports = router;
