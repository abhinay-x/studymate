import { useState, useEffect } from 'react'
import { Upload, FileText, Trash2, Eye, Clock, FolderOpen, BookOpen, FileImage, Brain, BarChart3, CheckCircle, AlertCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

function DocumentManager({ documents, onDocumentSelect, onDocumentUpload }) {
  const [uploadQueue, setUploadQueue] = useState([])
  const [processingFiles, setProcessingFiles] = useState(new Set())
  const [categories, setCategories] = useState(['All', 'Textbooks', 'Notes', 'Research Papers', 'Presentations'])
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Smart file categorization
  const categorizeFile = (fileName) => {
    const name = fileName.toLowerCase()
    if (name.includes('textbook') || name.includes('book')) return 'Textbooks'
    if (name.includes('notes') || name.includes('lecture')) return 'Notes'
    if (name.includes('research') || name.includes('paper') || name.includes('journal')) return 'Research Papers'
    if (name.includes('presentation') || name.includes('slides')) return 'Presentations'
    return 'Notes' // Default category
  }

  // Simulate file processing
  useEffect(() => {
    uploadQueue.forEach(file => {
      if (!processingFiles.has(file.id)) {
        setProcessingFiles(prev => new Set([...prev, file.id]))
        
        // Simulate processing time
        setTimeout(() => {
          onDocumentUpload(prev => prev.map(doc => 
            doc.id === file.id 
              ? { ...doc, processed: true, processingProgress: 100 }
              : doc
          ))
          setProcessingFiles(prev => {
            const newSet = new Set(prev)
            newSet.delete(file.id)
            return newSet
          })
          setUploadQueue(prev => prev.filter(f => f.id !== file.id))
        }, Math.random() * 3000 + 2000) // 2-5 seconds
      }
    })
  }, [uploadQueue, processingFiles, onDocumentUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    },
    onDrop: (acceptedFiles) => {
      const newDocuments = acceptedFiles.map(file => {
        const category = categorizeFile(file.name)
        return {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date(),
          processed: false,
          processingProgress: 0,
          category,
          file: file,
          thumbnail: null,
          pageCount: null,
          contentType: category
        }
      })
      onDocumentUpload(prev => [...prev, ...newDocuments])
      setUploadQueue(prev => [...prev, ...newDocuments])
    }
  })

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Textbooks': return <BookOpen className="w-4 h-4" />
      case 'Research Papers': return <Brain className="w-4 h-4" />
      case 'Presentations': return <BarChart3 className="w-4 h-4" />
      case 'Notes': return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const filteredDocuments = selectedCategory === 'All' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">📚 Documents</h2>
          <span className="text-sm text-slate-500">{documents.length} files</span>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-600 mb-2">
            {isDragActive ? 'Drop files here' : 'Drop PDFs here or click to browse'}
          </p>
          <p className="text-xs text-slate-500">
            Supports PDF, DOC, DOCX files
          </p>
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto">
        {filteredDocuments.length === 0 ? (
          <div className="p-6 text-center">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-2">
              {selectedCategory === 'All' ? 'No documents uploaded yet' : `No ${selectedCategory.toLowerCase()} found`}
            </p>
            <p className="text-sm text-slate-400">
              {selectedCategory === 'All' ? 'Upload your first document to get started' : 'Try uploading some documents or select a different category'}
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="group p-4 border border-slate-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => onDocumentSelect(doc)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 text-primary-600">
                    {getCategoryIcon(doc.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-900 truncate group-hover:text-primary-700">
                      {doc.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                      <span>{formatFileSize(doc.size)}</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(doc.uploadDate)}</span>
                      </span>
                    </div>
                    <div className="mt-2">
                      {doc.processed ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary-100 text-secondary-700">
                          ✓ Processed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent-100 text-accent-700">
                          ⏳ Processing...
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <button className="p-1 text-slate-400 hover:text-primary-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="text-xs text-slate-500 mb-2">Recent uploads</div>
        <div className="flex space-x-2">
          {documents.slice(-3).map((doc) => (
            <button
              key={doc.id}
              onClick={() => onDocumentSelect(doc)}
              className="flex-1 p-2 text-xs bg-white border border-slate-200 rounded hover:border-primary-300 hover:text-primary-700 transition-colors truncate"
            >
              {doc.name.split('.')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DocumentManager
