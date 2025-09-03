import { useState } from 'react'
import { Video, VideoOff, Mic, MicOff, Users, Share, MessageCircle, Hand, Settings, Monitor } from 'lucide-react'

function VirtualClassroom({ user }) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [activeTab, setActiveTab] = useState('participants') // participants, chat, whiteboard

  // Mock classroom data
  const mockClassroom = {
    title: "Advanced Calculus - Integration Techniques",
    instructor: "Dr. Sarah Johnson",
    participants: [
      { id: 1, name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face", role: "student", isPresenting: false, handRaised: false },
      { id: 2, name: "Maria Garcia", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face", role: "student", isPresenting: false, handRaised: true },
      { id: 3, name: "John Smith", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face", role: "student", isPresenting: false, handRaised: false },
      { id: 4, name: "Dr. Sarah Johnson", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face", role: "instructor", isPresenting: true, handRaised: false }
    ],
    chatMessages: [
      { id: 1, sender: "Dr. Sarah Johnson", message: "Welcome everyone! Today we'll cover integration by parts.", timestamp: "2:00 PM" },
      { id: 2, sender: "Alex Chen", message: "Could you explain the LIATE rule again?", timestamp: "2:05 PM" },
      { id: 3, sender: "Dr. Sarah Johnson", message: "Of course! LIATE stands for Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential", timestamp: "2:06 PM" },
      { id: 4, sender: "Maria Garcia", message: "That's really helpful, thank you!", timestamp: "2:07 PM" }
    ],
    currentSlide: 3,
    totalSlides: 15,
    duration: "45 minutes",
    attendees: 24
  }

  const [chatMessage, setChatMessage] = useState('')
  const [messages, setMessages] = useState(mockClassroom.chatMessages)

  const sendMessage = () => {
    if (!chatMessage.trim()) return
    
    const newMessage = {
      id: messages.length + 1,
      sender: user?.name || "You",
      message: chatMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages([...messages, newMessage])
    setChatMessage('')
  }

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="p-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">{mockClassroom.title}</h3>
            <p className="text-sm text-slate-300">with {mockClassroom.instructor}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-3 py-1 bg-red-600 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-white">LIVE</span>
            </div>
            <div className="text-sm text-slate-300">{mockClassroom.attendees} attendees</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Presenter Video */}
          <div className="flex-1 relative bg-slate-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-4xl font-bold text-white">SJ</span>
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{mockClassroom.instructor}</h4>
                <p className="text-slate-300">Presenting: Integration Techniques</p>
                {isScreenSharing && (
                  <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                    <Monitor className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-300">Screen sharing active</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Slide Progress */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black bg-opacity-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-white text-sm mb-2">
                  <span>Slide {mockClassroom.currentSlide} of {mockClassroom.totalSlides}</span>
                  <span>{mockClassroom.duration}</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(mockClassroom.currentSlide / mockClassroom.totalSlides) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Participant Videos Grid */}
          <div className="h-32 bg-slate-800 border-t border-slate-700 p-2">
            <div className="flex space-x-2 h-full overflow-x-auto">
              {mockClassroom.participants.filter(p => p.role === 'student').map((participant) => (
                <div key={participant.id} className="flex-shrink-0 relative">
                  <div className="w-24 h-24 bg-slate-700 rounded-lg overflow-hidden">
                    <img 
                      src={participant.avatar} 
                      alt={participant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-70 rounded text-xs text-white px-1 py-0.5 truncate">
                    {participant.name}
                  </div>
                  {participant.handRaised && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Hand className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 bg-slate-800 border-t border-slate-700">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setIsAudioOn(!isAudioOn)}
                className={`p-3 rounded-full transition-colors ${
                  isAudioOn ? 'bg-slate-600 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full transition-colors ${
                  isVideoOn ? 'bg-slate-600 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-full transition-colors ${
                  isScreenSharing ? 'bg-blue-600 text-white' : 'bg-slate-600 text-white hover:bg-slate-500'
                }`}
              >
                <Share className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsHandRaised(!isHandRaised)}
                className={`p-3 rounded-full transition-colors ${
                  isHandRaised ? 'bg-yellow-600 text-white' : 'bg-slate-600 text-white hover:bg-slate-500'
                }`}
              >
                <Hand className="w-5 h-5" />
              </button>

              <button className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors">
                Leave
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {[
              { id: 'participants', label: 'Participants', icon: Users },
              { id: 'chat', label: 'Chat', icon: MessageCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'participants' && (
              <div className="p-4 space-y-3">
                <h4 className="font-semibold text-slate-900 mb-3">
                  Participants ({mockClassroom.participants.length})
                </h4>
                {mockClassroom.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50">
                    <img 
                      src={participant.avatar} 
                      alt={participant.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{participant.name}</div>
                      <div className="text-xs text-slate-500 capitalize">{participant.role}</div>
                    </div>
                    {participant.handRaised && (
                      <Hand className="w-4 h-4 text-yellow-600" />
                    )}
                    {participant.isPresenting && (
                      <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Presenting
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm text-slate-900">{msg.sender}</span>
                        <span className="text-xs text-slate-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-700">{msg.message}</p>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-slate-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VirtualClassroom
