const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required'],
    trim: true
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true // GridFS file ID
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['processing', 'ready', 'failed'],
    default: 'processing'
  },
  chunkCount: {
    type: Number,
    default: 0
  },
  metadata: {
    pages: {
      type: Number,
      default: 0
    },
    fileSize: {
      type: Number,
      required: true
    },
    extractedText: {
      type: Boolean,
      default: false
    },
    processingTime: {
      type: Number, // in milliseconds
      default: 0
    },
    mimeType: {
      type: String,
      default: 'application/pdf'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
documentSchema.index({ userId: 1, uploadDate: -1 });
documentSchema.index({ status: 1 });
documentSchema.index({ 'metadata.fileSize': 1 });

// Virtual for document chunks
documentSchema.virtual('chunks', {
  ref: 'DocumentChunk',
  localField: '_id',
  foreignField: 'documentId'
});

// Virtual for conversations using this document
documentSchema.virtual('conversations', {
  ref: 'Conversation',
  localField: '_id',
  foreignField: 'documentIds'
});

// Method to mark document as ready
documentSchema.methods.markAsReady = function(chunkCount = 0) {
  this.status = 'ready';
  this.chunkCount = chunkCount;
  this.metadata.extractedText = true;
  return this.save();
};

// Method to mark document as failed
documentSchema.methods.markAsFailed = function() {
  this.status = 'failed';
  return this.save();
};

// Static method to get user's documents with pagination
documentSchema.statics.getUserDocuments = function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ userId })
    .sort({ uploadDate: -1 })
    .skip(skip)
    .limit(limit)
    .populate('chunks', 'content confidence')
    .exec();
};

// Static method to get documents by status
documentSchema.statics.getByStatus = function(status, limit = 50) {
  return this.find({ status })
    .sort({ uploadDate: -1 })
    .limit(limit)
    .exec();
};

module.exports = mongoose.model('Document', documentSchema);
