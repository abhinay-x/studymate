import { useState, useRef, useEffect } from 'react'
import { Bot, Mic, MicOff, Volume2, VolumeX, Zap, Brain, Heart } from 'lucide-react'

function StudyBuddy({ user }) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [buddyMood, setBuddyMood] = useState('happy') // happy, thinking, concerned
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Initialize with welcome message
  useEffect(() => {
    if (!isInitialized) {
      setMessages([{
        id: 1,
        type: 'ai',
        content: `Hey ${user?.name || 'there'}! I'm your AI study buddy. I can help you understand concepts, create study plans, and even detect when you're stressed. What would you like to work on today?`,
        timestamp: new Date()
      }])
      setIsInitialized(true)
      // Scroll to bottom for initial message after a brief delay
      setTimeout(() => scrollToBottom(), 100)
    }
  }, [user?.name, isInitialized])

  useEffect(() => {
    // Only auto-scroll if user is near bottom or if it's a new AI response (but not initial load)
    if (messages.length > 1 && isInitialized) {
      const lastMessage = messages[messages.length - 1]
      const container = messagesEndRef.current?.parentElement
      
      if (container) {
        const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100
        const isNewAIMessage = lastMessage.type === 'ai'
        
        if (isNearBottom || isNewAIMessage) {
          scrollToBottom()
        }
      }
    }
  }, [messages, isInitialized])

  const mockResponses = {
    stress: "I notice you might be feeling overwhelmed. Let's take a 5-minute breathing break together. Would you like me to guide you through a quick meditation?",
    study: "Great! I've analyzed your learning pattern and suggest focusing on active recall for the next 25 minutes. Should I create a custom quiz for you?",
    motivation: "You're doing amazing! You've maintained a 7-day study streak. Remember, every expert was once a beginner. What's one small win you can celebrate today?",
    schedule: "Based on your energy patterns, you're most productive between 9-11 AM. I've optimized your schedule to tackle difficult subjects during this time.",
    default: "That's an interesting question! Let me think about the best way to help you with that. I'm analyzing your learning style to provide personalized guidance."
  }

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setCurrentMessage('')

    // Simulate AI thinking
    setBuddyMood('thinking')
    setTimeout(() => {
      const responseKey = currentMessage.toLowerCase().includes('stress') ? 'stress' :
                         currentMessage.toLowerCase().includes('study') ? 'study' :
                         currentMessage.toLowerCase().includes('motivat') ? 'motivation' :
                         currentMessage.toLowerCase().includes('schedule') ? 'schedule' : 'default'

      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: mockResponses[responseKey],
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiResponse])
      setBuddyMood('happy')
    }, 1500)
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    // Mock voice recognition
    if (!isListening) {
      setTimeout(() => {
        setCurrentMessage("How can I improve my focus while studying?")
        setIsListening(false)
      }, 2000)
    }
  }

  const speakMessage = (text) => {
    setIsSpeaking(true)
    // Mock text-to-speech
    setTimeout(() => {
      setIsSpeaking(false)
    }, 3000)
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            buddyMood === 'thinking' ? 'bg-yellow-100 animate-pulse' :
            buddyMood === 'concerned' ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            <Bot className={`w-6 h-6 ${
              buddyMood === 'thinking' ? 'text-yellow-600' :
              buddyMood === 'concerned' ? 'text-red-600' : 'text-blue-600'
            }`} />
            {buddyMood === 'thinking' && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-bounce">
                <Brain className="w-3 h-3 text-white m-0.5" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">AI Study Buddy</h3>
            <p className="text-sm text-slate-600">
              {buddyMood === 'thinking' ? 'Thinking...' : 'Online & Ready to Help'}
            </p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full">
              <Zap className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-700">AI Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
              message.type === 'user'
                ? 'bg-primary-600 text-white'
                : 'bg-white shadow-sm border border-slate-200'
            }`}>
              <p className="text-sm">{message.content}</p>
              {message.type === 'ai' && (
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={() => speakMessage(message.content)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-full transition-all duration-200 ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about studying..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {isListening && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-red-500 rounded animate-pulse"></div>
                  <div className="w-1 h-4 bg-red-500 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-4 bg-red-500 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim()}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {['Help me focus', 'Create study plan', 'Check my stress', 'Motivate me'].map((action) => (
            <button
              key={action}
              onClick={() => setCurrentMessage(action)}
              className="px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StudyBuddy
