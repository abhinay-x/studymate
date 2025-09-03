import React, { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import PageLayout from '../components/layout/PageLayout'
import ChatInterface from '../components/ChatInterface'
import PDFProcessor from '../components/PDFProcessor'
import SemanticSearch from '../components/SemanticSearch'
import { MessageSquare, Sparkles, Zap, FileText, Brain, Database } from 'lucide-react'

const AIChatPage = () => {
  const { isDark } = useTheme()
  const [processedDocuments, setProcessedDocuments] = useState([])
  const [searchIndex] = useState(new SemanticSearch())

  const handleDocumentProcessed = (processedData) => {
    setProcessedDocuments(prev => [...prev, processedData])
    searchIndex.addDocumentChunks(processedData.chunks)
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 transition-all duration-500">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-4">
              AI Chat Assistant
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Get instant answers, explanations, and personalized learning support from our advanced AI tutor
            </p>
          </div>

          {/* Enhanced Features Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 text-center">
              <FileText className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">PDF Processing</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Extract and chunk text from academic PDFs</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 text-center">
              <Brain className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Semantic Search</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Find relevant content using AI embeddings</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 text-center">
              <Database className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">RAG System</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Retrieval-Augmented Generation for accurate answers</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 text-center">
              <MessageSquare className="w-8 h-8 text-cyan-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Session Export</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Download Q&A history for offline study</p>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl overflow-hidden animate-fade-in-up">
            <ChatInterface 
              searchIndex={searchIndex}
              processedDocuments={processedDocuments}
              onDocumentProcessed={handleDocumentProcessed}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default AIChatPage
