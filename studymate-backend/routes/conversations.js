const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { Conversation, Message, Document, DocumentChunk } = require('../models');
const HuggingFaceService = require('../services/huggingFaceService');
const logger = require('../utils/logger');

const router = express.Router();
const hfService = new HuggingFaceService();

// @route   POST /api/conversations
// @desc    Create new conversation
// @access  Private
router.post('/', authenticate, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('documentIds')
    .optional()
    .isArray()
    .withMessage('Document IDs must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { title, documentIds = [] } = req.body;

    // Verify user owns all specified documents
    if (documentIds.length > 0) {
      const userDocuments = await Document.find({
        _id: { $in: documentIds },
        userId: req.user._id
      });

      if (userDocuments.length !== documentIds.length) {
        return res.status(400).json({
          success: false,
          error: 'Invalid documents',
          message: 'One or more documents not found or access denied'
        });
      }
    }

    const conversation = new Conversation({
      userId: req.user._id,
      title,
      documentIds
    });

    await conversation.save();

    logger.info(`New conversation created: ${conversation._id} by user ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      data: {
        conversation: conversation.toJSON()
      }
    });
  } catch (error) {
    logger.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create conversation',
      message: error.message
    });
  }
});

// @route   GET /api/conversations
// @desc    Get user's conversations with pagination
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const conversations = await Conversation.getUserConversations(req.user._id, page, limit);
    const total = await Conversation.countDocuments({ 
      userId: req.user._id, 
      isActive: true 
    });

    res.json({
      success: true,
      data: {
        conversations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversations',
      message: error.message
    });
  }
});

// @route   GET /api/conversations/:id
// @desc    Get conversation details with messages
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.getWithMessages(req.params.id, req.user._id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
        message: 'Conversation not found or access denied'
      });
    }

    res.json({
      success: true,
      data: {
        conversation: conversation.toJSON()
      }
    });
  } catch (error) {
    logger.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation',
      message: error.message
    });
  }
});

// @route   PUT /api/conversations/:id
// @desc    Update conversation
// @access  Private
router.put('/:id', authenticate, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('documentIds')
    .optional()
    .isArray()
    .withMessage('Document IDs must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
        message: 'Conversation not found or access denied'
      });
    }

    const { title, documentIds } = req.body;

    if (title) {
      conversation.title = title;
    }

    if (documentIds) {
      // Verify user owns all specified documents
      const userDocuments = await Document.find({
        _id: { $in: documentIds },
        userId: req.user._id
      });

      if (userDocuments.length !== documentIds.length) {
        return res.status(400).json({
          success: false,
          error: 'Invalid documents',
          message: 'One or more documents not found or access denied'
        });
      }

      conversation.documentIds = documentIds;
    }

    await conversation.save();

    logger.info(`Conversation updated: ${conversation._id}`);

    res.json({
      success: true,
      message: 'Conversation updated successfully',
      data: {
        conversation: conversation.toJSON()
      }
    });
  } catch (error) {
    logger.error('Update conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update conversation',
      message: error.message
    });
  }
});

// @route   DELETE /api/conversations/:id
// @desc    Delete conversation
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
        message: 'Conversation not found or access denied'
      });
    }

    // Soft delete - mark as inactive
    conversation.isActive = false;
    await conversation.save();

    logger.info(`Conversation deleted: ${conversation._id} by user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    logger.error('Delete conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete conversation',
      message: error.message
    });
  }
});

// @route   POST /api/conversations/:id/messages
// @desc    Send question and get AI response
// @access  Private
router.post('/:id/messages', authenticate, [
  body('question')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Question must be between 1 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Check user's daily question limit
    if (!req.user.canAskQuestion()) {
      return res.status(429).json({
        success: false,
        error: 'Daily limit exceeded',
        message: `You have reached your daily limit of ${process.env.USER_DAILY_QUESTION_LIMIT || 50} questions`
      });
    }

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true
    }).populate('documentIds');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
        message: 'Conversation not found or access denied'
      });
    }

    const { question } = req.body;
    const startTime = Date.now();

    // Get relevant document chunks for context
    let context = '';
    let referencedChunks = [];

    if (conversation.documentIds.length > 0) {
      const documentIds = conversation.documentIds.map(doc => doc._id);
      
      // Search for relevant chunks (simplified search for now)
      const relevantChunks = await DocumentChunk.searchSimilar(documentIds, question, 5);
      
      if (relevantChunks.length > 0) {
        context = relevantChunks.map(chunk => chunk.content).join('\n\n');
        referencedChunks = relevantChunks.map(chunk => chunk._id.toString());
      }
    }

    // Generate AI response
    const prompt = hfService.optimizePrompt(context, question);
    const aiResponse = await hfService.generateAnswer(prompt);

    if (!aiResponse.success) {
      return res.status(500).json({
        success: false,
        error: 'AI response failed',
        message: aiResponse.error.message || 'Failed to generate response',
        details: aiResponse.error
      });
    }

    const processingTime = Date.now() - startTime;

    // Create message record
    const message = new Message({
      conversationId: conversation._id,
      question,
      answer: aiResponse.answer,
      referencedChunks,
      confidence: 0.8, // Default confidence
      processingTime,
      modelResponse: aiResponse.metadata
    });

    await message.save();

    // Update conversation and user stats
    await conversation.incrementMessageCount();
    await req.user.incrementQuestionCount();

    logger.info(`Question answered in conversation ${conversation._id}: ${processingTime}ms`);

    res.json({
      success: true,
      message: 'Question answered successfully',
      data: {
        message: message.toJSON(),
        processingTime,
        remainingQuestions: (process.env.USER_DAILY_QUESTION_LIMIT || 50) - req.user.apiUsage.dailyQuestions
      }
    });
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process question',
      message: error.message
    });
  }
});

// @route   GET /api/conversations/:id/messages
// @desc    Get conversation messages with pagination
// @access  Private
router.get('/:id/messages', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
        message: 'Conversation not found or access denied'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const messages = await Message.getConversationMessages(conversation._id, page, limit);
    const total = await Message.countDocuments({ conversationId: conversation._id });

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
      message: error.message
    });
  }
});

// @route   POST /api/conversations/:id/messages/:messageId/feedback
// @desc    Add feedback to a message
// @access  Private
router.post('/:id/messages/:messageId/feedback', authenticate, [
  body('helpful')
    .isBoolean()
    .withMessage('Helpful must be a boolean'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Verify conversation ownership
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
        message: 'Conversation not found or access denied'
      });
    }

    // Find message
    const message = await Message.findOne({
      _id: req.params.messageId,
      conversationId: conversation._id
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
        message: 'Message not found in this conversation'
      });
    }

    const { helpful, rating, comment } = req.body;

    await message.addFeedback(helpful, rating, comment);

    logger.info(`Feedback added to message ${message._id}: helpful=${helpful}`);

    res.json({
      success: true,
      message: 'Feedback added successfully',
      data: {
        message: message.toJSON()
      }
    });
  } catch (error) {
    logger.error('Add feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add feedback',
      message: error.message
    });
  }
});

// @route   GET /api/conversations/:id/export
// @desc    Export conversation Q&A history
// @access  Private
router.get('/:id/export', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('documentIds', 'originalName').populate('messages');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
        message: 'Conversation not found or access denied'
      });
    }

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ timestamp: 1 });

    // Format export data
    const exportData = {
      conversation: {
        title: conversation.title,
        createdAt: conversation.createdAt,
        documents: conversation.documentIds.map(doc => doc.originalName)
      },
      messages: messages.map(msg => ({
        question: msg.question,
        answer: msg.answer,
        timestamp: msg.timestamp,
        confidence: msg.confidence,
        feedback: msg.feedback
      })),
      exportedAt: new Date().toISOString(),
      exportedBy: req.user.name
    };

    const format = req.query.format || 'json';

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="conversation-${conversation._id}.json"`);
      res.json(exportData);
    } else {
      // Default to JSON if unsupported format
      res.json({
        success: true,
        data: exportData
      });
    }

    logger.info(`Conversation exported: ${conversation._id} by user ${req.user.email}`);
  } catch (error) {
    logger.error('Export conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export conversation',
      message: error.message
    });
  }
});

module.exports = router;
