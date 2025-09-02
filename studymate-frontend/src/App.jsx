import { useState } from 'react'
import Header from './components/Header'
import DocumentManager from './components/DocumentManager'
import ChatInterface from './components/ChatInterface'
import StudyTools from './components/StudyTools'
import WelcomeModal from './components/WelcomeModal'
import { FileText, MessageSquare, BarChart3, Settings } from 'lucide-react'

function App() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [uploadedDocuments, setUploadedDocuments] = useState([])
  const [chatQuestions, setChatQuestions] = useState([])
  const [activeView, setActiveView] = useState('chat') // For mobile navigation

  return (
    <div className="min-h-screen bg-slate-50">
      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}
      
      <Header />
      
      <main className="flex h-screen pt-16">
        {/* Desktop Layout - Three Panel */}
        <div className="hidden lg:flex w-full">
          {/* Document Manager - Left Panel */}
          <div className="w-80 border-r border-slate-200 bg-white">
            <DocumentManager 
              documents={uploadedDocuments}
              onDocumentSelect={setSelectedDocument}
              onDocumentUpload={setUploadedDocuments}
            />
          </div>
          
          {/* Chat Interface - Center Panel */}
          <div className="flex-1 flex flex-col">
            <ChatInterface 
              selectedDocument={selectedDocument}
              documents={uploadedDocuments}
            />
          </div>
          
          {/* Study Tools - Right Panel */}
          <div className="w-80 border-l border-slate-200 bg-white">
            <StudyTools 
              documents={uploadedDocuments}
              questions={chatQuestions}
            />
          </div>
        </div>

        {/* Mobile Layout - Single Panel with Bottom Navigation */}
        <div className="lg:hidden w-full pb-16">
          {activeView === 'documents' && (
            <DocumentManager 
              documents={uploadedDocuments}
              onDocumentSelect={setSelectedDocument}
              onDocumentUpload={setUploadedDocuments}
            />
          )}
          
          {activeView === 'chat' && (
            <ChatInterface 
              selectedDocument={selectedDocument}
              documents={uploadedDocuments}
              onQuestionsUpdate={setChatQuestions}
            />
          )}
          
          {activeView === 'analytics' && (
            <StudyTools 
              documents={uploadedDocuments}
              questions={chatQuestions}
            />
          )}
          
          {activeView === 'settings' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Settings</h3>
                <p className="text-slate-600">App settings and preferences coming soon!</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2">
        <div className="flex justify-around">
          <button 
            onClick={() => setActiveView('documents')}
            className={`flex flex-col items-center py-2 px-3 ${
              activeView === 'documents' ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs mt-1">Documents</span>
          </button>
          <button 
            onClick={() => setActiveView('chat')}
            className={`flex flex-col items-center py-2 px-3 ${
              activeView === 'chat' ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs mt-1">Chat</span>
          </button>
          <button 
            onClick={() => setActiveView('analytics')}
            className={`flex flex-col items-center py-2 px-3 ${
              activeView === 'analytics' ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs mt-1">Analytics</span>
          </button>
          <button 
            onClick={() => setActiveView('settings')}
            className={`flex flex-col items-center py-2 px-3 ${
              activeView === 'settings' ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default App
