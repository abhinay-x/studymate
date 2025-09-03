const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');
const logger = require('../utils/logger');

let gfs, gridfsBucket;

// Initialize GridFS
const initGridFS = () => {
  const conn = mongoose.connection;
  
  conn.once('open', () => {
    // Initialize GridFS bucket
    gridfsBucket = new GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
    
    // Initialize GridFS stream
    gfs = gridfsBucket;
    
    logger.info('GridFS initialized successfully');
  });
};

// Create storage engine
const storage = new GridFSStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
          metadata: {
            originalName: file.originalname,
            uploadedBy: req.user ? req.user._id : null,
            uploadDate: new Date(),
            mimeType: file.mimetype
          }
        };
        resolve(fileInfo);
      });
    });
  }
});

// File filter for PDF uploads
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  },
  fileFilter: fileFilter
});

// Get file by ID
const getFileById = async (fileId) => {
  try {
    const files = await gridfsBucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
    return files.length > 0 ? files[0] : null;
  } catch (error) {
    logger.error('Error getting file by ID:', error);
    throw error;
  }
};

// Get file stream by ID
const getFileStream = (fileId) => {
  try {
    return gridfsBucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
  } catch (error) {
    logger.error('Error getting file stream:', error);
    throw error;
  }
};

// Delete file by ID
const deleteFile = async (fileId) => {
  try {
    await gridfsBucket.delete(new mongoose.Types.ObjectId(fileId));
    logger.info(`File deleted: ${fileId}`);
    return true;
  } catch (error) {
    logger.error('Error deleting file:', error);
    throw error;
  }
};

// Get files by user ID
const getFilesByUser = async (userId, limit = 50) => {
  try {
    const files = await gridfsBucket.find({
      'metadata.uploadedBy': new mongoose.Types.ObjectId(userId)
    }).limit(limit).toArray();
    return files;
  } catch (error) {
    logger.error('Error getting files by user:', error);
    throw error;
  }
};

module.exports = {
  initGridFS,
  upload,
  getFileById,
  getFileStream,
  deleteFile,
  getFilesByUser,
  get gfs() { return gfs; },
  get gridfsBucket() { return gridfsBucket; }
};
