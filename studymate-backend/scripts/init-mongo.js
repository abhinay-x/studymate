// MongoDB initialization script
db = db.getSiblingDB('studymate');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'name'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        password: {
          bsonType: 'string',
          minLength: 6
        },
        name: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 100
        }
      }
    }
  }
});

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

db.documents.createIndex({ userId: 1, uploadDate: -1 });
db.documents.createIndex({ status: 1 });

db.conversations.createIndex({ userId: 1, updatedAt: -1 });
db.conversations.createIndex({ isActive: 1 });

db.messages.createIndex({ conversationId: 1, timestamp: 1 });
db.messages.createIndex({ timestamp: -1 });

db.documentchunks.createIndex({ documentId: 1, chunkIndex: 1 });
db.documentchunks.createIndex({ documentId: 1, pageNumber: 1 });

print('StudyMate database initialized successfully');
