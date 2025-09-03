// Export all models for easy importing
const User = require('./User');
const Document = require('./Document');
const Conversation = require('./Conversation');
const Message = require('./Message');
const DocumentChunk = require('./DocumentChunk');

module.exports = {
  User,
  Document,
  Conversation,
  Message,
  DocumentChunk
};
