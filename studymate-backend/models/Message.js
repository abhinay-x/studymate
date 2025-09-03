const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [2000, 'Question cannot exceed 2000 characters']
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true
  },
  referencedChunks: [{
    type: String, // Chunk IDs or content snippets
    trim: true
  }],
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  processingTime: {
    type: Number, // in milliseconds
    default: 0
  },
  modelResponse: {
    model: {
      type: String,
      default: 'huggingface-2b'
    },
    tokensUsed: {
      type: Number,
      default: 0
    },
    responseTime: {
      type: Number, // in milliseconds
      default: 0
    },
    temperature: {
      type: Number,
      default: 0.7
    },
    maxTokens: {
      type: Number,
      default: 512
    }
  },
  feedback: {
    helpful: {
      type: Boolean,
      default: null
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    comment: {
      type: String,
      maxlength: [500, 'Feedback comment cannot exceed 500 characters']
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
messageSchema.index({ conversationId: 1, timestamp: 1 });
messageSchema.index({ timestamp: -1 });
messageSchema.index({ 'modelResponse.model': 1 });

// Static method to get conversation messages with pagination
messageSchema.statics.getConversationMessages = function(conversationId, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  return this.find({ conversationId })
    .sort({ timestamp: 1 })
    .skip(skip)
    .limit(limit)
    .exec();
};

// Static method to get recent messages for analytics
messageSchema.statics.getRecentMessages = function(userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $lookup: {
        from: 'conversations',
        localField: 'conversationId',
        foreignField: '_id',
        as: 'conversation'
      }
    },
    {
      $unwind: '$conversation'
    },
    {
      $match: {
        'conversation.userId': userId,
        timestamp: { $gte: startDate }
      }
    },
    {
      $sort: { timestamp: -1 }
    }
  ]);
};

// Method to add feedback
messageSchema.methods.addFeedback = function(helpful, rating, comment) {
  this.feedback.helpful = helpful;
  if (rating) this.feedback.rating = rating;
  if (comment) this.feedback.comment = comment;
  return this.save();
};

module.exports = mongoose.model('Message', messageSchema);
