import { useState, useRef, useEffect } from 'react'
import { Send, ThumbsUp, ThumbsDown, Bookmark, Share, Search, Sparkles, Volume2, Copy } from 'lucide-react'
import VoiceInput from './VoiceInput'
import QuestionTemplates from './QuestionTemplates'

function ChatInterface({ selectedDocument, documents = [], onQuestionsUpdate }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-complete suggestions based on input
  useEffect(() => {
    if (inputValue.length > 2) {
      const newSuggestions = [
        `${inputValue} in machine learning?`,
        `How does ${inputValue} work?`,
        `What are examples of ${inputValue}?`,
        `Why is ${inputValue} important?`
      ]
      setSuggestions(newSuggestions)
    } else {
      setSuggestions([])
    }
  }, [inputValue])

  const suggestedQuestions = [
    "What are the main concepts in this document?",
    "Explain the key points in simple terms",
    "What are the most important takeaways?",
    "How does this relate to other topics?",
    "Can you summarize the main arguments?"
  ]

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => {
      const updated = [...prev, userMessage]
      // Update questions for StudyTools
      if (onQuestionsUpdate) {
        const questions = updated.filter(msg => msg.type === 'user').map(msg => ({
          id: msg.id,
          question: msg.content,
          timestamp: msg.timestamp
        }))
        onQuestionsUpdate(questions)
      }
      return updated
    })
    setInputValue('')
    setIsTyping(true)
    setSuggestions([])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Based on your uploaded documents, here's what I found about "${inputValue}".`,
        sources: [
          {
            title: "Machine Learning Fundamentals.pdf",
            excerpt: "Machine learning is a subset of artificial intelligence that focuses on algorithms...",
            page: 15,
            confidence: 0.92
          },
          {
            title: "Neural Networks Guide.docx", 
            excerpt: "Deep learning networks consist of multiple layers of interconnected nodes...",
            page: 8,
            confidence: 0.87
          }
        ],
        confidence: 87,
        timestamp: new Date(),
        relatedConcepts: ['Machine Learning', 'Neural Networks', 'Data Science'],
        difficulty: 'intermediate'
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 2000)
  }

  const handleVoiceTranscript = (transcript) => {
    setInputValue(transcript)
  }

  const handleTemplateSelect = (template) => {
    setInputValue(template)
    setShowTemplates(false)
  }

  const handleSuggestionSelect = (suggestion) => {
    setInputValue(suggestion)
    setSuggestions([])
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">💬 Ask me anything about your documents</h2>
            <p className="text-sm text-slate-500 mt-1">
              {selectedDocument 
                ? `Currently focused on: ${selectedDocument.name}`
                : `${documents.length} documents available for questions`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🤔</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to help you study!</h3>
            <p className="text-slate-600 mb-8">Ask me questions about your uploaded documents and I'll provide detailed answers with source references.</p>
            
            {/* Question Templates */}
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-slate-700">🎯 Get started with these questions:</h4>
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>More Templates</span>
                </button>
              </div>
              
              <div className="grid gap-3 mb-6">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleTemplateSelect(question)}
                    className="p-3 text-left bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-300 rounded-lg transition-colors text-sm"
                  >
                    • {question}
                  </button>
                ))}
              </div>

              {showTemplates && (
                <div className="mb-6">
                  <QuestionTemplates 
                    onSelectTemplate={handleTemplateSelect}
                    selectedDocument={selectedDocument}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl ${message.type === 'user' ? 'ml-12' : 'mr-12'}`}>
                  {message.type === 'user' ? (
                    <div className="bg-primary-600 text-white rounded-lg px-4 py-3">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                      {/* AI Response Header */}
                      <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm">🤖</span>
                          </div>
                          <span className="font-medium text-slate-900">StudyMate's Answer</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <span>Confidence: {message.confidence}%</span>
                        </div>
                      </div>

                      {/* Answer Content */}
                      <div className="p-4">
                        <p className="text-slate-700 leading-relaxed mb-4">{message.content}</p>

                        {/* Enhanced Sources with Excerpts */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="bg-slate-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
                              📖 Sources ({message.sources.length} found):
                            </h4>
                            <div className="space-y-3">
                              {message.sources.map((source, index) => (
                                <div key={index} className="bg-white rounded border border-slate-200 overflow-hidden">
                                  <div className="flex items-center justify-between p-3 border-b border-slate-100">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-slate-700">{source.document}</span>
                                      <span className="text-xs text-slate-500">- {source.page}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                                        {source.relevance}% match
                                      </span>
                                      <button
                                        onClick={() => copyToClipboard(source.excerpt)}
                                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                  {source.excerpt && (
                                    <div className="p-3 bg-slate-50">
                                      <p className="text-xs text-slate-600 italic">"{source.excerpt}"</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Related Concepts */}
                        {message.relatedConcepts && message.relatedConcepts.length > 0 && (
                          <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                            <h5 className="text-sm font-medium text-primary-800 mb-2">🔗 Related Concepts:</h5>
                            <div className="flex flex-wrap gap-2">
                              {message.relatedConcepts.map((concept, index) => (
                                <button
                                  key={index}
                                  onClick={() => setInputValue(`Tell me more about ${concept}`)}
                                  className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs hover:bg-primary-200 transition-colors"
                                >
                                  {concept}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50">
                        <div className="flex space-x-2">
                          <button className="flex items-center space-x-1 px-3 py-1 text-xs text-slate-600 hover:text-secondary-600 hover:bg-secondary-50 rounded transition-colors">
                            <ThumbsUp className="w-3 h-3" />
                            <span>Helpful</span>
                          </button>
                          <button className="flex items-center space-x-1 px-3 py-1 text-xs text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <ThumbsDown className="w-3 h-3" />
                            <span>Not helpful</span>
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex items-center space-x-1 px-3 py-1 text-xs text-slate-600 hover:text-accent-600 hover:bg-accent-50 rounded transition-colors">
                            <Bookmark className="w-3 h-3" />
                            <span>Save</span>
                          </button>
                          <button 
                            onClick={() => copyToClipboard(message.content)}
                            className="flex items-center space-x-1 px-3 py-1 text-xs text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                          <button 
                            onClick={() => speakText(message.content)}
                            className="flex items-center space-x-1 px-3 py-1 text-xs text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </button>
                          <button className="flex items-center space-x-1 px-3 py-1 text-xs text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors">
                            <Share className="w-3 h-3" />
                            <span>Share</span>
                          </button>
                          <button className="flex items-center space-x-1 px-3 py-1 text-xs text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors">
                            <Search className="w-3 h-3" />
                            <span>More</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-3xl mr-12">
                  <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">🤖</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-slate-200 bg-slate-50">
        {/* Auto-complete Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-4 bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-slate-100">
              <h4 className="text-sm font-medium text-slate-700">💡 Suggestions:</h4>
            </div>
            <div className="p-2 space-y-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="w-full text-left p-2 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your documents..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows="2"
            />
          </div>
          <div className="flex space-x-2">
            <VoiceInput 
              onTranscript={handleVoiceTranscript}
              onToggle={setIsListening}
              isListening={isListening}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
