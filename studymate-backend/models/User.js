const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  apiUsage: {
    dailyQuestions: {
      type: Number,
      default: 0
    },
    lastReset: {
      type: Date,
      default: Date.now
    },
    totalQuestions: {
      type: Number,
      default: 0
    }
  },
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '7d'
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for user's documents
userSchema.virtual('documents', {
  ref: 'Document',
  localField: '_id',
  foreignField: 'userId'
});

// Virtual for user's conversations
userSchema.virtual('conversations', {
  ref: 'Conversation',
  localField: '_id',
  foreignField: 'userId'
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check daily usage limit
userSchema.methods.canAskQuestion = function() {
  const dailyLimit = parseInt(process.env.USER_DAILY_QUESTION_LIMIT) || 50;
  const now = new Date();
  const lastReset = new Date(this.apiUsage.lastReset);
  
  // Reset daily count if it's a new day
  if (now.toDateString() !== lastReset.toDateString()) {
    this.apiUsage.dailyQuestions = 0;
    this.apiUsage.lastReset = now;
  }
  
  return this.apiUsage.dailyQuestions < dailyLimit;
};

// Method to increment question count
userSchema.methods.incrementQuestionCount = function() {
  this.apiUsage.dailyQuestions += 1;
  this.apiUsage.totalQuestions += 1;
  return this.save();
};

// Method to clean expired refresh tokens
userSchema.methods.cleanExpiredTokens = function() {
  this.refreshTokens = this.refreshTokens.filter(tokenObj => {
    const tokenAge = Date.now() - tokenObj.createdAt.getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return tokenAge < sevenDaysInMs;
  });
  return this.save();
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshTokens;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
