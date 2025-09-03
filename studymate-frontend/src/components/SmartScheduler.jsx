import { useState } from 'react'
import { Calendar, Clock, Brain, Zap, Moon, Sun, Coffee, Target, TrendingUp } from 'lucide-react'

function SmartScheduler({ user }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('day') // day, week, month

  // Mock AI-optimized schedule data
  const mockSchedule = {
    today: [
      {
        id: 1,
        time: '9:00 AM',
        subject: 'Advanced Mathematics',
        type: 'study',
        duration: 90,
        difficulty: 'high',
        energyLevel: 'peak',
        aiReason: 'Your brain is most analytical in the morning',
        completed: false
      },
      {
        id: 2,
        time: '10:30 AM',
        subject: 'Break - Meditation',
        type: 'break',
        duration: 15,
        aiReason: 'Prevent cognitive overload',
        completed: true
      },
      {
        id: 3,
        time: '11:00 AM',
        subject: 'Physics - Quantum Mechanics',
        type: 'study',
        duration: 60,
        difficulty: 'high',
        energyLevel: 'high',
        aiReason: 'Complex concepts need high focus',
        completed: false
      },
      {
        id: 4,
        time: '1:00 PM',
        subject: 'Lunch & Walk',
        type: 'break',
        duration: 60,
        aiReason: 'Physical activity boosts afternoon performance',
        completed: false
      },
      {
        id: 5,
        time: '2:00 PM',
        subject: 'Literature Review',
        type: 'study',
        duration: 45,
        difficulty: 'medium',
        energyLevel: 'medium',
        aiReason: 'Creative tasks work well post-lunch',
        completed: false
      },
      {
        id: 6,
        time: '4:00 PM',
        subject: 'Virtual Study Group',
        type: 'collaboration',
        duration: 90,
        aiReason: 'Social learning enhances retention',
        completed: false
      },
      {
        id: 7,
        time: '7:00 PM',
        subject: 'Review & Flashcards',
        type: 'review',
        duration: 30,
        difficulty: 'low',
        energyLevel: 'low',
        aiReason: 'Light review before dinner',
        completed: false
      }
    ],
    stats: {
      productivityScore: 87,
      focusHours: 4.5,
      breakTime: 1.25,
      streakDays: 7,
      weeklyGoal: 30,
      weeklyProgress: 22
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'study': return <Brain className="w-4 h-4" />
      case 'break': return <Coffee className="w-4 h-4" />
      case 'collaboration': return <Target className="w-4 h-4" />
      case 'review': return <TrendingUp className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getEnergyColor = (level) => {
    switch (level) {
      case 'peak': return 'text-green-600 bg-green-100'
      case 'high': return 'text-blue-600 bg-blue-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-300'
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Smart Scheduler
            </h3>
            <p className="text-sm text-slate-600">AI-optimized for your peak performance</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-3 py-1 bg-purple-100 rounded-full">
              <Zap className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">
                {mockSchedule.stats.productivityScore}% Optimized
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-white rounded-lg border border-slate-200">
            <div className="text-lg font-bold text-slate-900">{mockSchedule.stats.focusHours}h</div>
            <div className="text-xs text-slate-600">Focus Time</div>
          </div>
          <div className="text-center p-2 bg-white rounded-lg border border-slate-200">
            <div className="text-lg font-bold text-slate-900">{mockSchedule.stats.streakDays}</div>
            <div className="text-xs text-slate-600">Day Streak</div>
          </div>
          <div className="text-center p-2 bg-white rounded-lg border border-slate-200">
            <div className="text-lg font-bold text-slate-900">
              {Math.round((mockSchedule.stats.weeklyProgress / mockSchedule.stats.weeklyGoal) * 100)}%
            </div>
            <div className="text-xs text-slate-600">Weekly Goal</div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {mockSchedule.today.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg border-l-4 ${getDifficultyColor(item.difficulty)} p-4 shadow-sm hover:shadow-md transition-shadow ${
                item.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`p-1 rounded ${
                      item.type === 'study' ? 'bg-blue-100 text-blue-600' :
                      item.type === 'break' ? 'bg-green-100 text-green-600' :
                      item.type === 'collaboration' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {getTypeIcon(item.type)}
                    </span>
                    <span className="font-medium text-slate-900">{item.subject}</span>
                    {item.energyLevel && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEnergyColor(item.energyLevel)}`}>
                        {item.energyLevel === 'peak' && <Sun className="w-3 h-3 inline mr-1" />}
                        {item.energyLevel === 'low' && <Moon className="w-3 h-3 inline mr-1" />}
                        {item.energyLevel}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {item.time}
                    </span>
                    <span>{item.duration} min</span>
                  </div>

                  <div className="text-xs text-slate-500 bg-slate-50 rounded p-2">
                    <Brain className="w-3 h-3 inline mr-1" />
                    AI Insight: {item.aiReason}
                  </div>
                </div>

                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            AI Recommendations
          </h4>
          <ul className="space-y-2 text-sm text-purple-800">
            <li>• Your focus peaks at 9 AM - tackle hardest subjects then</li>
            <li>• Take a 15-min walk after lunch to boost afternoon productivity</li>
            <li>• Schedule creative tasks between 2-4 PM when you're most innovative</li>
            <li>• Your retention improves 40% with spaced repetition - I've added review sessions</li>
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="flex space-x-2">
          <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
            Optimize Today
          </button>
          <button className="flex-1 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
            Add Task
          </button>
        </div>
      </div>
    </div>
  )
}

export default SmartScheduler
