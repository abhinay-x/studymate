import { useState, useRef, useEffect } from 'react'
import { Send, Plus, Paperclip, MoreHorizontal, Copy, ThumbsUp, ThumbsDown, RotateCcw, Menu, MessageSquare, Trash2 } from 'lucide-react'

function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState([])
  const [showSidebar, setShowSidebar] = useState(false)
  const [conversations, setConversations] = useState([
    { id: 1, title: "Machine Learning Basics", timestamp: "2 hours ago" },
    { id: 2, title: "Neural Networks Deep Dive", timestamp: "Yesterday" },
    { id: 3, title: "Data Science Projects", timestamp: "3 days ago" }
  ])
  const [currentConversation, setCurrentConversation] = useState(1)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue])

  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      attachments: attachedFiles,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentQuestion = inputValue
    setInputValue('')
    setAttachedFiles([])
    setIsTyping(true)

    try {
      // Call actual backend API
      const response = await fetch('http://localhost:3000/api/conversations/1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: currentQuestion,
          attachments: attachedFiles
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.data.assistantMessage) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: data.data.assistantMessage.content,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Fallback response on error
      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `Sorry, I'm having trouble connecting to the server right now. Please make sure the backend is running on http://localhost:3000 and try again.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleFileAttachment = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file
    }))
    setAttachedFiles(prev => [...prev, ...newFiles])
  }

  const removeAttachedFile = (fileId) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const newConversation = () => {
    const newId = Date.now()
    setConversations(prev => [
      { id: newId, title: "New conversation", timestamp: "Just now" },
      ...prev
    ])
    setCurrentConversation(newId)
    setMessages([])
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Claude-style Sidebar */}
      <div className={`${showSidebar ? 'w-64' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={newConversation}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New conversation</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setCurrentConversation(conv.id)}
              className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                currentConversation === conv.id
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-gray-900 text-sm truncate">{conv.title}</div>
              <div className="text-xs text-gray-500 mt-1">{conv.export}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Claude-style Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">StudyMate</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md mx-auto px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">How can I help you today?</h3>
                <p className="text-gray-600 mb-6">I'm StudyMate, your AI learning assistant. Upload documents and ask me questions to get started.</p>
                
                {/* Suggested prompts */}
                <div className="space-y-2">
                  {[
                    "Explain machine learning concepts",
                    "Help me understand this document",
                    "Create a study plan for my exam",
                    "Summarize key points from my notes"
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(prompt)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              {messages.map((message) => (
                <div key={message.id} className="px-4 py-6 border-b border-gray-100">
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {message.type === 'user' ? 'U' : 'A'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {message.type === 'user' ? 'You' : 'StudyMate'}
                      </div>
                      <div className="prose prose-sm max-w-none text-gray-700">
                        {message.content.split('\n').map((line, index) => (
                          <p key={index} className="mb-2 last:mb-0">{line}</p>
                        ))}
                      </div>
                      
                      {/* File attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.attachments.map((file) => (
                            <div key={file.id} className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                              <Paperclip className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 truncate max-w-32">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Message actions */}
                      {message.type === 'assistant' && (
                        <div className="flex items-center space-x-2 mt-3">
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <Copy className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <ThumbsUp className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <ThumbsDown className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <RotateCcw className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="px-4 py-6">
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        A
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 mb-1">StudyMate</div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Claude-style Input Area */}
        <div className="border-t border-gray-200 bg-white">
          {/* Attached Files */}
          {attachedFiles.length > 0 && (
            <div className="px-4 pt-4">
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file) => (
                  <div key={file.id} className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <Paperclip className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate max-w-32">{file.name}</span>
                    <button
                      onClick={() => removeAttachedFile(file.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input container */}
          <div className="p-4">
            <div className="relative max-w-4xl mx-auto">
              <div className="flex items-end space-x-3 bg-white border border-gray-300 rounded-2xl p-3 focus-within:border-gray-400 transition-colors">
                {/* Attachment button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Text input */}
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message StudyMate..."
                  className="flex-1 resize-none border-none outline-none bg-transparent text-gray-900 placeholder-gray-500 min-h-[24px] max-h-[200px]"
                  rows={1}
                />

                {/* Send button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() && attachedFiles.length === 0}
                  className="flex-shrink-0 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.md,image/*"
                onChange={(e) => handleFileAttachment(e.target.files)}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
