require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
// vLLM base URL and model configuration
const VLLM_BASE_URL = process.env.VLLM_BASE_URL || 'http://localhost:8000';
const VLLM_MODEL = process.env.VLLM_MODEL || process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2';
// Use native fetch if available (Node 18+)
const fetchFn = (typeof fetch !== 'undefined') ? fetch : undefined;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'StudyMate Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Authentication endpoints
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  res.json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: { 
        id: Date.now().toString(), 
        email, 
        name,
        createdAt: new Date().toISOString()
      },
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now()
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: { 
        id: '1', 
        email, 
        name: 'Test User',
        lastLogin: new Date().toISOString()
      },
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now()
    }
  });
});

app.post('/api/auth/refresh', (req, res) => {
  res.json({
    success: true,
    data: {
      accessToken: 'mock_new_access_token_' + Date.now()
    }
  });
});

// Conversation endpoints
app.get('/api/conversations', (req, res) => {
  res.json({
    success: true,
    data: {
      conversations: [
        { 
          id: '1', 
          title: 'Machine Learning Basics', 
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          messageCount: 5
        },
        { 
          id: '2', 
          title: 'Neural Networks Deep Dive', 
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          messageCount: 12
        },
        { 
          id: '3', 
          title: 'Data Science Projects', 
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          messageCount: 8
        }
      ],
      pagination: { page: 1, limit: 10, total: 3, pages: 1 }
    }
  });
});

app.post('/api/conversations', (req, res) => {
  const { title } = req.body;
  res.json({
    success: true,
    message: 'Conversation created successfully',
    data: {
      conversation: {
        id: Date.now().toString(),
        title: title || 'New Conversation',
        createdAt: new Date().toISOString(),
        messageCount: 0
      }
    }
  });
});

app.get('/api/conversations/:id/messages', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    data: {
      messages: [
        {
          id: '1',
          conversationId: id,
          type: 'user',
          content: 'Hello, can you help me understand machine learning?',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          conversationId: id,
          type: 'assistant',
          content: 'Of course! Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.',
          timestamp: new Date(Date.now() - 9 * 60 * 1000).toISOString()
        }
      ],
      pagination: { page: 1, limit: 50, total: 2, pages: 1 }
    }
  });
});

app.post('/api/conversations/:id/messages', (req, res) => {
  const { id } = req.params;
  const { content, attachments } = req.body;
  
  // Simulate AI response
  const aiResponse = `I understand your question: "${content}". Based on the context and any attached files, here's my comprehensive response:\n\nThis is a detailed answer that addresses your question with relevant explanations and examples. I can help you understand complex concepts by breaking them down into simpler parts.\n\nWould you like me to elaborate on any specific aspect of this topic?`;
  
  res.json({
    success: true,
    data: {
      userMessage: {
        id: Date.now().toString(),
        conversationId: id,
        type: 'user',
        content,
        attachments: attachments || [],
        timestamp: new Date().toISOString()
      },
      assistantMessage: {
        id: (Date.now() + 1).toString(),
        conversationId: id,
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date(Date.now() + 1000).toISOString()
      }
    }
  });
});

// vLLM chat proxy endpoint (non-streaming)
app.post('/api/llm/chat', async (req, res) => {
  try {
    const { messages, model, temperature, max_tokens, stream } = req.body || {};
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Bad Request', message: 'messages array is required' });
    }

    if (!fetchFn) {
      return res.status(501).json({ error: 'Not Implemented', message: 'fetch is not available in this Node.js runtime. Please use Node 18+ or install node-fetch.' });
    }

    const response = await fetchFn(`${VLLM_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || VLLM_MODEL,
        messages,
        temperature: typeof temperature === 'number' ? temperature : 0.2,
        max_tokens: typeof max_tokens === 'number' ? max_tokens : 512,
        stream: !!stream && false // force non-streaming for now
      })
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return res.status(502).json({ error: 'Bad Gateway', message: `vLLM error ${response.status}: ${text}` });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error('vLLM proxy error:', err);
    return res.status(502).json({ error: 'Bad Gateway', message: err.message });
  }
});

// Update messages endpoint to use vLLM proxy when available
app.post('/api/conversations/:id/messages', async (req, res) => {
  const { id } = req.params;
  const { content, attachments } = req.body;

  // Construct chat messages for vLLM
  const chatMessages = [
    { role: 'system', content: 'You are StudyMate, a concise and helpful AI tutor.' },
    { role: 'user', content: content || '' }
  ];

  let assistantContent;
  let usedVLLM = false;
  try {
    if (fetchFn) {
      const resp = await fetchFn(`${VLLM_BASE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: VLLM_MODEL, messages: chatMessages, temperature: 0.2, max_tokens: 512, stream: false })
      });
      if (resp.ok) {
        const data = await resp.json();
        assistantContent = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || null;
        usedVLLM = !!assistantContent;
      }
    }
  } catch (e) {
    // Fall back to template response on any failure
  }

  if (!assistantContent) {
    assistantContent = `I understand your question: "${content}". Based on the context and any attached files, here's my comprehensive response:\n\nThis is a detailed answer that addresses your question with relevant explanations and examples. I can help you understand complex concepts by breaking them down into simpler parts.\n\nWould you like me to elaborate on any specific aspect of this topic?`;
  }

  return res.json({
    success: true,
    data: {
      userMessage: {
        id: Date.now().toString(),
        conversationId: id,
        type: 'user',
        content,
        attachments: attachments || [],
        timestamp: new Date().toISOString()
      },
      assistantMessage: {
        id: (Date.now() + 1).toString(),
        conversationId: id,
        type: 'assistant',
        content: assistantContent,
        meta: { via: usedVLLM ? 'vLLM' : 'fallback' },
        timestamp: new Date(Date.now() + 1000).toISOString()
      }
    }
  });
});

// Document endpoints
app.get('/api/documents', (req, res) => {
  res.json({
    success: true,
    data: {
      documents: [
        {
          id: '1',
          filename: 'Machine_Learning_Guide.pdf',
          originalName: 'Machine Learning Guide.pdf',
          size: 2048576,
          uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          processed: true
        },
        {
          id: '2',
          filename: 'Neural_Networks_Basics.pdf',
          originalName: 'Neural Networks Basics.pdf',
          size: 1536000,
          uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          processed: true
        }
      ],
      pagination: { page: 1, limit: 10, total: 2, pages: 1 }
    }
  });
});

app.post('/api/documents/upload', (req, res) => {
  // Simulate file upload
  res.json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      document: {
        id: Date.now().toString(),
        filename: 'uploaded_document.pdf',
        originalName: 'Document.pdf',
        size: 1024000,
        uploadedAt: new Date().toISOString(),
        processed: false
      }
    }
  });
});

app.get('/api/documents/:id/download', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    message: 'Document download link generated',
    data: {
      downloadUrl: `http://localhost:${PORT}/api/documents/${id}/file`,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    }
  });
});

// Search endpoint
app.post('/api/search', (req, res) => {
  const { query, documentIds } = req.body;
  res.json({
    success: true,
    data: {
      results: [
        {
          documentId: '1',
          chunkId: '1',
          content: `This is a relevant excerpt about "${query}" from the document...`,
          score: 0.95,
          page: 1
        },
        {
          documentId: '2',
          chunkId: '2',
          content: `Another relevant section discussing "${query}" in detail...`,
          score: 0.87,
          page: 3
        }
      ],
      totalResults: 2
    }
  });
});

// User profile endpoints
app.get('/api/users/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        avatar: null,
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true
        },
        stats: {
          documentsUploaded: 5,
          conversationsStarted: 12,
          questionsAsked: 47
        }
      }
    }
  });
});

app.put('/api/users/profile', (req, res) => {
  const { name, email, preferences } = req.body;
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: '1',
        name: name || 'Test User',
        email: email || 'test@example.com',
        preferences: preferences || {
          theme: 'light',
          language: 'en',
          notifications: true
        },
        updatedAt: new Date().toISOString()
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 StudyMate Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat ready for frontend integration`);
});

module.exports = app;
