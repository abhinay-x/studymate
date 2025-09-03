import { useState } from 'react'
import { FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react'

// Simulates PDF text extraction and chunking as described in PRD
const PDFProcessor = ({ document, onProcessingComplete }) => {
  const [processingStatus, setProcessingStatus] = useState('idle') // idle, processing, completed, error
  const [extractedChunks, setExtractedChunks] = useState([])
  const [processingProgress, setProcessingProgress] = useState(0)

  // Simulate PyMuPDF text extraction
  const simulateTextExtraction = (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate extracted text content
        const mockText = `
        Machine Learning Fundamentals
        
        Chapter 1: Introduction to Machine Learning
        Machine learning is a subset of artificial intelligence (AI) that focuses on algorithms and statistical models that enable computer systems to improve their performance on a specific task through experience without being explicitly programmed.
        
        Key Concepts:
        1. Supervised Learning: Learning with labeled training data
        2. Unsupervised Learning: Finding patterns in unlabeled data  
        3. Reinforcement Learning: Learning through interaction with environment
        
        Chapter 2: Neural Networks
        Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) that process information using a connectionist approach to computation.
        
        Deep Learning:
        Deep learning is a subset of machine learning that uses neural networks with multiple layers (deep neural networks) to model and understand complex patterns in data.
        
        Applications include:
        - Image recognition and computer vision
        - Natural language processing
        - Speech recognition
        - Autonomous vehicles
        
        Chapter 3: Data Preprocessing
        Data preprocessing is a crucial step in machine learning that involves cleaning, transforming, and organizing raw data into a format suitable for machine learning algorithms.
        
        Common preprocessing steps:
        1. Data cleaning: Handling missing values, outliers
        2. Feature scaling: Normalization and standardization
        3. Feature selection: Choosing relevant features
        4. Data splitting: Train/validation/test sets
        `
        resolve(mockText)
      }, 1000)
    })
  }

  // Simulate text chunking with overlap as per PRD (500 words, 100-word overlap)
  const chunkText = (text) => {
    const words = text.split(/\s+/).filter(word => word.length > 0)
    const chunks = []
    const chunkSize = 500
    const overlap = 100
    
    for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
      const chunk = words.slice(i, i + chunkSize).join(' ')
      if (chunk.trim().length > 0) {
        chunks.push({
          id: chunks.length + 1,
          content: chunk,
          startIndex: i,
          endIndex: Math.min(i + chunkSize, words.length),
          wordCount: Math.min(chunkSize, words.length - i),
          page: Math.floor(i / 300) + 1, // Simulate page numbers
          document: document.name
        })
      }
    }
    
    return chunks
  }

  // Simulate embedding generation (would use SentenceTransformers in real implementation)
  const generateEmbeddings = (chunks) => {
    return chunks.map(chunk => ({
      ...chunk,
      embedding: Array.from({ length: 384 }, () => Math.random()), // Simulate 384-dim vectors
      processed: true
    }))
  }

  const processDocument = async () => {
    setProcessingStatus('processing')
    setProcessingProgress(0)

    try {
      // Step 1: Text extraction
      setProcessingProgress(25)
      const extractedText = await simulateTextExtraction(document.file)
      
      // Step 2: Text chunking
      setProcessingProgress(50)
      await new Promise(resolve => setTimeout(resolve, 500))
      const chunks = chunkText(extractedText)
      
      // Step 3: Generate embeddings
      setProcessingProgress(75)
      await new Promise(resolve => setTimeout(resolve, 500))
      const processedChunks = generateEmbeddings(chunks)
      
      // Step 4: Complete processing
      setProcessingProgress(100)
      setExtractedChunks(processedChunks)
      setProcessingStatus('completed')
      
      // Notify parent component
      if (onProcessingComplete) {
        onProcessingComplete({
          document,
          chunks: processedChunks,
          totalChunks: processedChunks.length,
          totalWords: extractedText.split(/\s+/).length
        })
      }
      
    } catch (error) {
      setProcessingStatus('error')
      console.error('PDF processing error:', error)
    }
  }

  const getStatusIcon = () => {
    switch (processingStatus) {
      case 'processing':
        return <Loader className="w-5 h-5 animate-spin text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <FileText className="w-5 h-5 text-slate-400" />
    }
  }

  const getStatusText = () => {
    switch (processingStatus) {
      case 'processing':
        return `Processing... ${processingProgress}%`
      case 'completed':
        return `Processed ${extractedChunks.length} chunks`
      case 'error':
        return 'Processing failed'
      default:
        return 'Ready to process'
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-medium text-slate-900">{document.name}</h3>
            <p className="text-sm text-slate-500">{getStatusText()}</p>
          </div>
        </div>
        
        {processingStatus === 'idle' && (
          <button
            onClick={processDocument}
            className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
          >
            Process
          </button>
        )}
      </div>

      {processingStatus === 'processing' && (
        <div className="mb-3">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${processingProgress}%` }}
            />
          </div>
        </div>
      )}

      {processingStatus === 'completed' && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-2 rounded">
              <span className="text-slate-600">Chunks:</span>
              <span className="ml-2 font-medium">{extractedChunks.length}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded">
              <span className="text-slate-600">Pages:</span>
              <span className="ml-2 font-medium">{Math.max(...extractedChunks.map(c => c.page))}</span>
            </div>
          </div>
          
          <details className="mt-3">
            <summary className="text-sm text-slate-600 cursor-pointer hover:text-slate-800">
              View extracted chunks ({extractedChunks.length})
            </summary>
            <div className="mt-2 max-h-40 overflow-y-auto space-y-2">
              {extractedChunks.slice(0, 3).map((chunk) => (
                <div key={chunk.id} className="bg-slate-50 p-2 rounded text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Chunk {chunk.id}</span>
                    <span className="text-slate-500">Page {chunk.page}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">
                    {chunk.content.substring(0, 100)}...
                  </p>
                </div>
              ))}
              {extractedChunks.length > 3 && (
                <p className="text-xs text-slate-500 text-center">
                  +{extractedChunks.length - 3} more chunks
                </p>
              )}
            </div>
          </details>
        </div>
      )}
    </div>
  )
}

export default PDFProcessor
