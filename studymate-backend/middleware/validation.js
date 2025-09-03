const { body, param, query } = require('express-validator');

// Common validation rules
const commonValidations = {
  // MongoDB ObjectId validation
  mongoId: param('id').isMongoId().withMessage('Invalid ID format'),
  
  // Pagination validation
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ],

  // File validation
  fileUpload: [
    body('file').custom((value, { req }) => {
      if (!req.file) {
        throw new Error('File is required');
      }
      return true;
    })
  ]
};

// User validation rules
const userValidations = {
  register: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must be at least 6 characters with uppercase, lowercase, and number'),
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name must be 2-100 characters and contain only letters and spaces')
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name must be 2-100 characters and contain only letters and spaces'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email')
  ],

  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must be at least 6 characters with uppercase, lowercase, and number')
  ]
};

// Document validation rules
const documentValidations = {
  upload: [
    // File validation is handled by multer middleware
  ],

  updateDocument: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters')
  ]
};

// Conversation validation rules
const conversationValidations = {
  create: [
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('documentIds')
      .optional()
      .isArray()
      .withMessage('Document IDs must be an array'),
    body('documentIds.*')
      .optional()
      .isMongoId()
      .withMessage('Each document ID must be a valid MongoDB ObjectId')
  ],

  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('documentIds')
      .optional()
      .isArray()
      .withMessage('Document IDs must be an array'),
    body('documentIds.*')
      .optional()
      .isMongoId()
      .withMessage('Each document ID must be a valid MongoDB ObjectId')
  ]
};

// Message validation rules
const messageValidations = {
  sendMessage: [
    body('question')
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage('Question must be between 1 and 2000 characters')
      .matches(/^[^<>{}]*$/)
      .withMessage('Question contains invalid characters')
  ],

  addFeedback: [
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
  ]
};

module.exports = {
  commonValidations,
  userValidations,
  documentValidations,
  conversationValidations,
  messageValidations
};
