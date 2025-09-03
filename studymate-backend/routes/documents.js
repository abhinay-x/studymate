const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { Document, DocumentChunk } = require('../models');
const { upload, getFileById, getFileStream, deleteFile } = require('../config/gridfs');
const logger = require('../utils/logger');

const router = express.Router();

// @route   POST /api/documents/upload
// @desc    Upload PDF document
// @access  Private
router.post('/upload', authenticate, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
        message: 'Please select a PDF file to upload'
      });
    }

    // Create document record
    const document = new Document({
      userId: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileId: req.file.id,
      status: 'processing',
      metadata: {
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      }
    });

    await document.save();

    logger.info(`Document uploaded: ${req.file.originalname} by user ${req.user.email}`);

    // TODO: Trigger PDF processing (would call Python microservice)
    // For now, we'll simulate processing completion
    setTimeout(async () => {
      try {
        await document.markAsReady(0); // 0 chunks for now
        logger.info(`Document processing completed: ${document._id}`);
      } catch (error) {
        logger.error('Error marking document as ready:', error);
      }
    }, 2000);

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        document: document.toJSON()
      }
    });
  } catch (error) {
    logger.error('Document upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Upload failed',
      message: 'An error occurred during file upload'
    });
  }
});

// @route   GET /api/documents
// @desc    Get user's documents with pagination
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    let query = { userId: req.user._id };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const documents = await Document.find(query)
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate('chunks', 'chunkIndex pageNumber metadata.wordCount');

    const total = await Document.countDocuments(query);

    res.json({
      success: true,
      data: {
        documents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch documents',
      message: error.message
    });
  }
});

// @route   GET /api/documents/:id
// @desc    Get document details
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('chunks');

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: 'Document not found or access denied'
      });
    }

    res.json({
      success: true,
      data: {
        document: document.toJSON()
      }
    });
  } catch (error) {
    logger.error('Get document error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch document',
      message: error.message
    });
  }
});

// @route   GET /api/documents/:id/download
// @desc    Download document file
// @access  Private
router.get('/:id/download', authenticate, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: 'Document not found or access denied'
      });
    }

    // Get file from GridFS
    const file = await getFileById(document.fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
        message: 'Document file not found in storage'
      });
    }

    // Set response headers
    res.set({
      'Content-Type': file.contentType || 'application/pdf',
      'Content-Disposition': `attachment; filename="${document.originalName}"`,
      'Content-Length': file.length
    });

    // Stream file to response
    const downloadStream = getFileStream(document.fileId);
    downloadStream.pipe(res);

    downloadStream.on('error', (error) => {
      logger.error('File download error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Download failed',
          message: 'An error occurred during file download'
        });
      }
    });

  } catch (error) {
    logger.error('Document download error:', error);
    res.status(500).json({
      success: false,
      error: 'Download failed',
      message: error.message
    });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete document
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: 'Document not found or access denied'
      });
    }

    // Delete file from GridFS
    try {
      await deleteFile(document.fileId);
    } catch (fileError) {
      logger.warn('Failed to delete file from GridFS:', fileError);
      // Continue with document deletion even if file deletion fails
    }

    // Delete document chunks
    await DocumentChunk.deleteMany({ documentId: document._id });

    // Delete document record
    await Document.findByIdAndDelete(document._id);

    logger.info(`Document deleted: ${document._id} by user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    logger.error('Document deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Deletion failed',
      message: error.message
    });
  }
});

// @route   GET /api/documents/:id/chunks
// @desc    Get document chunks with pagination
// @access  Private
router.get('/:id/chunks', authenticate, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: 'Document not found or access denied'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const chunks = await DocumentChunk.getDocumentChunks(document._id, page, limit);
    const total = await DocumentChunk.countDocuments({ documentId: document._id });

    res.json({
      success: true,
      data: {
        chunks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get document chunks error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch document chunks',
      message: error.message
    });
  }
});

// @route   POST /api/documents/:id/reprocess
// @desc    Reprocess document (trigger PDF processing again)
// @access  Private
router.post('/:id/reprocess', authenticate, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        message: 'Document not found or access denied'
      });
    }

    // Reset document status
    document.status = 'processing';
    document.chunkCount = 0;
    document.metadata.extractedText = false;
    await document.save();

    // Delete existing chunks
    await DocumentChunk.deleteMany({ documentId: document._id });

    logger.info(`Document reprocessing triggered: ${document._id}`);

    // TODO: Trigger PDF processing (would call Python microservice)
    // For now, simulate processing
    setTimeout(async () => {
      try {
        await document.markAsReady(0);
        logger.info(`Document reprocessing completed: ${document._id}`);
      } catch (error) {
        logger.error('Error during reprocessing:', error);
      }
    }, 3000);

    res.json({
      success: true,
      message: 'Document reprocessing started',
      data: {
        document: document.toJSON()
      }
    });
  } catch (error) {
    logger.error('Document reprocessing error:', error);
    res.status(500).json({
      success: false,
      error: 'Reprocessing failed',
      message: error.message
    });
  }
});

module.exports = router;
