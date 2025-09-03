const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  documentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  title: {
    type: String,
    required: [true, 'Conversation title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  modelUsed: {
    type: String,
    default: 'huggingface-2b'
  },
  messageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
conversationSchema.index({ userId: 1, updatedAt: -1 });
conversationSchema.index({ isActive: 1 });
conversationSchema.index({ documentIds: 1 });

// Virtual for messages
conversationSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'conversationId'
});

// Pre-save middleware to update timestamp
conversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to add document to conversation
conversationSchema.methods.addDocument = function(documentId) {
  if (!this.documentIds.includes(documentId)) {
    this.documentIds.push(documentId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove document from conversation
conversationSchema.methods.removeDocument = function(documentId) {
  this.documentIds = this.documentIds.filter(id => !id.equals(documentId));
  return this.save();
};

// Method to increment message count
conversationSchema.methods.incrementMessageCount = function() {
  this.messageCount += 1;
  return this.save();
};

// Static method to get user's conversations with pagination
conversationSchema.statics.getUserConversations = function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ userId, isActive: true })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('documentIds', 'filename originalName status')
    .exec();
};

// Static method to get conversation with messages
conversationSchema.statics.getWithMessages = function(conversationId, userId) {
  return this.findOne({ _id: conversationId, userId })
    .populate('documentIds', 'filename originalName status')
    .populate({
      path: 'messages',
      options: { sort: { timestamp: 1 } }
    })
    .exec();
};

module.exports = mongoose.model('Conversation', conversationSchema);
