const axios = require('axios');
const { HfInference } = require('@huggingface/inference');
const logger = require('../utils/logger');

class HuggingFaceService {
  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.model = process.env.HUGGINGFACE_MODEL || 'ibm-granite/granite-3.3-2b-instruct';
    this.baseUrl = process.env.HUGGINGFACE_API_URL || 'https://api-inference.huggingface.co/models/ibm-granite/granite-3.3-2b-instruct';
    this.maxTokens = parseInt(process.env.HF_MAX_TOKENS) || 512;
    this.temperature = parseFloat(process.env.HF_TEMPERATURE) || 0.7;
    this.topP = parseFloat(process.env.HF_TOP_P) || 0.9;
    this.timeout = parseInt(process.env.HF_TIMEOUT) || 30000;
    
    // Initialize Hugging Face Inference client
    this.hf = new HfInference(this.apiKey);
    
    // Axios instance for direct API calls
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Generate answer using Hugging Face API
   * @param {string} prompt - The constructed prompt with context and question
   * @param {Object} options - Additional options for generation
   * @returns {Promise<Object>} - Generated response with metadata
   */
  async generateAnswer(prompt, options = {}) {
    const startTime = Date.now();
    
    try {
      // Validate inputs
      if (!prompt || typeof prompt !== 'string') {
        throw new Error('Valid prompt is required');
      }

      if (!this.apiKey) {
        throw new Error('Hugging Face API key not configured');
      }

      // Prepare request parameters
      const requestParams = {
        max_length: options.maxTokens || this.maxTokens,
        temperature: options.temperature || this.temperature,
        top_p: options.topP || this.topP,
        do_sample: true,
        pad_token_id: 50256,
        return_full_text: false,
        ...options.parameters
      };

      logger.info(`Generating answer with model: ${this.model}`);

      // Make API request using Hugging Face Inference client
      const response = await this.hf.textGeneration({
        model: this.model,
        inputs: prompt,
        parameters: requestParams,
        options: {
          wait_for_model: true,
          use_cache: false
        }
      });

      const responseTime = Date.now() - startTime;

      // Process response
      let generatedText = '';
      if (Array.isArray(response)) {
        generatedText = response[0]?.generated_text || '';
      } else if (response.generated_text) {
        generatedText = response.generated_text;
      } else {
        generatedText = String(response);
      }

      // Clean up the response
      generatedText = this.cleanResponse(generatedText, prompt);

      logger.info(`Answer generated successfully in ${responseTime}ms`);

      return {
        success: true,
        answer: generatedText,
        metadata: {
          model: this.model,
          responseTime,
          tokensUsed: this.estimateTokens(generatedText),
          temperature: requestParams.temperature,
          maxTokens: requestParams.max_length
        }
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error('Hugging Face API error:', error);

      return {
        success: false,
        error: this.handleError(error),
        metadata: {
          model: this.model,
          responseTime,
          tokensUsed: 0
        }
      };
    }
  }

  /**
   * Check if the model is available and loaded
   * @returns {Promise<Object>} - Model status information
   */
  async checkModelStatus() {
    try {
      const response = await this.axiosInstance.get(this.model);
      
      return {
        available: true,
        model: this.model,
        status: 'loaded',
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      logger.warn('Model status check failed:', error.message);
      
      return {
        available: false,
        model: this.model,
        status: error.response?.status === 503 ? 'loading' : 'error',
        error: error.message,
        lastChecked: new Date().toISOString()
      };
    }
  }

  /**
   * Test Hugging Face API connection
   * @returns {Promise<Object>} - Connection test result
   */
  async testConnection() {
    try {
      const testPrompt = "Hello, this is a test.";
      const result = await this.generateAnswer(testPrompt, { maxTokens: 50 });
      
      return {
        success: true,
        message: 'Hugging Face API connection successful',
        model: this.model,
        responseTime: result.metadata.responseTime
      };
    } catch (error) {
      return {
        success: false,
        message: 'Hugging Face API connection failed',
        error: error.message
      };
    }
  }

  /**
   * Optimize prompt for token efficiency
   * @param {string} context - Document context/chunks
   * @param {string} question - User question
   * @returns {string} - Optimized prompt
   */
  optimizePrompt(context, question) {
    // Truncate context if too long (keep most relevant parts)
    const maxContextLength = 2000; // Adjust based on model limits
    let optimizedContext = context;
    
    if (context.length > maxContextLength) {
      // Take first and last parts of context
      const halfLength = Math.floor(maxContextLength / 2);
      optimizedContext = context.substring(0, halfLength) + 
                       '\n...\n' + 
                       context.substring(context.length - halfLength);
    }

    // Construct optimized prompt
    const prompt = `Context: ${optimizedContext}

Question: ${question}

Answer: Based on the provided context, `;

    return prompt;
  }

  /**
   * Handle rate limiting with intelligent retry
   * @param {number} retryAfter - Seconds to wait before retry
   * @returns {Promise<void>}
   */
  async handleRateLimit(retryAfter) {
    const waitTime = (retryAfter || 60) * 1000; // Convert to milliseconds
    logger.warn(`Rate limited. Waiting ${retryAfter || 60} seconds before retry`);
    
    return new Promise(resolve => {
      setTimeout(resolve, waitTime);
    });
  }

  /**
   * Clean and format the generated response
   * @param {string} response - Raw response from API
   * @param {string} originalPrompt - Original prompt sent
   * @returns {string} - Cleaned response
   */
  cleanResponse(response, originalPrompt) {
    let cleaned = response.trim();
    
    // Remove the original prompt if it's included in response
    if (cleaned.startsWith(originalPrompt)) {
      cleaned = cleaned.substring(originalPrompt.length).trim();
    }
    
    // Remove common prefixes
    const prefixes = ['Answer:', 'Response:', 'Based on the provided context,'];
    for (const prefix of prefixes) {
      if (cleaned.startsWith(prefix)) {
        cleaned = cleaned.substring(prefix.length).trim();
      }
    }
    
    // Ensure response ends properly
    if (cleaned && !cleaned.match(/[.!?]$/)) {
      cleaned += '.';
    }
    
    return cleaned || 'I apologize, but I could not generate a proper response based on the provided context.';
  }

  /**
   * Handle API errors with specific error types
   * @param {Error} error - Error object from API call
   * @returns {Object} - Formatted error response
   */
  handleError(error) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 429:
          return {
            type: 'rate_limit',
            message: 'Rate limit exceeded',
            retryAfter: error.response.headers['retry-after'] || 60
          };
        case 503:
          return {
            type: 'model_loading',
            message: 'Model is loading, please try again in a few moments',
            retryAfter: 30
          };
        case 401:
          return {
            type: 'authentication',
            message: 'Invalid API key'
          };
        case 400:
          return {
            type: 'bad_request',
            message: data?.error || 'Invalid request parameters'
          };
        default:
          return {
            type: 'api_error',
            message: data?.error || `API error: ${status}`
          };
      }
    }
    
    if (error.code === 'ECONNABORTED') {
      return {
        type: 'timeout',
        message: 'Request timeout - model may be overloaded'
      };
    }
    
    return {
      type: 'unknown',
      message: error.message || 'Unknown error occurred'
    };
  }

  /**
   * Estimate token count for text (rough approximation)
   * @param {string} text - Text to estimate tokens for
   * @returns {number} - Estimated token count
   */
  estimateTokens(text) {
    // Rough estimation: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
  }

  /**
   * Get usage statistics for monitoring
   * @returns {Object} - Service statistics
   */
  getStats() {
    return {
      model: this.model,
      maxTokens: this.maxTokens,
      temperature: this.temperature,
      topP: this.topP,
      timeout: this.timeout,
      apiConfigured: !!this.apiKey
    };
  }
}

module.exports = HuggingFaceService;
