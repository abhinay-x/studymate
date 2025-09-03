const mongoose = require('mongoose');

const documentChunkSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: [true, 'Chunk content is required'],
    maxlength: [5000, 'Chunk content cannot exceed 5000 characters']
  },
  chunkIndex: {
    type: Number,
    required: true,
    min: 0
  },
  pageNumber: {
    type: Number,
    default: 1,
    min: 1
  },
  startPosition: {
    type: Number,
    default: 0
  },
  endPosition: {
    type: Number,
    default: 0
  },
  embedding: {
    type: [Number], // Vector embedding from sentence transformers
    default: []
  },
  metadata: {
    wordCount: {
      type: Number,
      default: 0
    },
    characterCount: {
      type: Number,
      default: 0
    },
    language: {
      type: String,
      default: 'en'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 1.0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for performance
documentChunkSchema.index({ documentId: 1, chunkIndex: 1 });
documentChunkSchema.index({ documentId: 1, pageNumber: 1 });
documentChunkSchema.index({ 'metadata.wordCount': 1 });

// Pre-save middleware to calculate metadata
documentChunkSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.metadata.characterCount = this.content.length;
    this.metadata.wordCount = this.content.split(/\s+/).filter(word => word.length > 0).length;
  }
  next();
});

// Static method to get document chunks with pagination
documentChunkSchema.statics.getDocumentChunks = function(documentId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ documentId })
    .sort({ chunkIndex: 1 })
    .skip(skip)
    .limit(limit)
    .exec();
};

// Static method to search chunks by similarity (placeholder for vector search)
documentChunkSchema.statics.searchSimilar = function(documentIds, query, limit = 5) {
  // This is a placeholder implementation
  // In production, this would use vector similarity search with FAISS or similar
  return this.find({ 
    documentId: { $in: documentIds },
    content: { $regex: query, $options: 'i' }
  })
  .sort({ 'metadata.confidence': -1 })
  .limit(limit)
  .exec();
};

// Method to update embedding
documentChunkSchema.methods.updateEmbedding = function(embedding) {
  this.embedding = embedding;
  return this.save();
};

module.exports = mongoose.model('DocumentChunk', documentChunkSchema);
