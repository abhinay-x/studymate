import { X, BookOpen, MessageCircle, BarChart3 } from 'lucide-react'

function WelcomeModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-800 to-secondary-600 px-8 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome to StudyMate</h2>
              <p className="text-primary-100">Your AI-Powered Study Companion</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Upload Documents</h3>
              <p className="text-sm text-slate-600">Drop your PDFs, notes, and study materials to get started</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Ask Questions</h3>
              <p className="text-sm text-slate-600">Get instant answers with source references from your materials</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Track Progress</h3>
              <p className="text-sm text-slate-600">Monitor your learning journey with detailed analytics</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-slate-900 mb-3">Quick Start Tips:</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Upload multiple PDFs for comprehensive study sessions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Use natural language questions like "What is machine learning?"</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Check the suggested questions for topic exploration</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              Skip Tutorial
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-primary-800 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeModal
