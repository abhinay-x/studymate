import { useState, useEffect } from 'react'
import { Heart, Brain, Activity, AlertTriangle, Smile, Frown, Meh, TrendingUp, Moon, Sun } from 'lucide-react'

function MentalHealthMonitor({ user }) {
  const [currentMood, setCurrentMood] = useState(null)
  const [stressLevel, setStressLevel] = useState(3)
  const [isMonitoring, setIsMonitoring] = useState(false)

  // Mock mental health data
  const mockData = {
    todayStats: {
      stressLevel: 3, // 1-5 scale
      moodScore: 7, // 1-10 scale
      focusTime: 4.5,
      breaksTaken: 6,
      sleepQuality: 8,
      energyLevel: 6
    },
    weeklyTrend: [
      { day: 'Mon', stress: 2, mood: 8, focus: 5.2 },
      { day: 'Tue', stress: 4, mood: 6, focus: 3.8 },
      { day: 'Wed', stress: 3, mood: 7, focus: 4.5 },
      { day: 'Thu', stress: 5, mood: 5, focus: 2.1 },
      { day: 'Fri', stress: 2, mood: 9, focus: 6.2 },
      { day: 'Sat', stress: 1, mood: 9, focus: 4.0 },
      { day: 'Sun', stress: 3, mood: 7, focus: 4.5 }
    ],
    recommendations: [
      {
        type: 'break',
        title: 'Take a Mindful Break',
        description: 'You\'ve been studying for 2 hours. A 10-minute meditation can reduce stress by 23%.',
        urgency: 'medium',
        action: 'Start 10-min meditation'
      },
      {
        type: 'exercise',
        title: 'Physical Activity Needed',
        description: 'Your stress indicators suggest light exercise. Even 5 minutes of stretching helps.',
        urgency: 'high',
        action: 'Quick workout routine'
      },
      {
        type: 'social',
        title: 'Connect with Others',
        description: 'Social interaction can boost mood. Consider joining a study group or calling a friend.',
        urgency: 'low',
        action: 'Join virtual study room'
      }
    ],
    insights: [
      'Your focus peaks between 9-11 AM when stress is lowest',
      'Taking breaks every 45 minutes improves your mood by 15%',
      'You perform 30% better after physical activity',
      'Your stress spikes on Thursdays - consider lighter study loads'
    ]
  }

  const moodOptions = [
    { value: 1, icon: Frown, color: 'text-red-500', label: 'Very Sad' },
    { value: 2, icon: Frown, color: 'text-orange-500', label: 'Sad' },
    { value: 3, icon: Meh, color: 'text-yellow-500', label: 'Okay' },
    { value: 4, icon: Smile, color: 'text-green-500', label: 'Good' },
    { value: 5, icon: Smile, color: 'text-blue-500', label: 'Great' }
  ]

  const getStressColor = (level) => {
    if (level <= 2) return 'text-green-600 bg-green-100'
    if (level <= 3) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-300 bg-gray-50'
    }
  }

  // Simulate real-time monitoring
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        // Simulate stress level changes based on study patterns
        const newStress = Math.max(1, Math.min(5, stressLevel + (Math.random() - 0.5) * 0.5))
        setStressLevel(newStress)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isMonitoring, stressLevel])

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-600" />
              Mental Health Monitor
            </h3>
            <p className="text-sm text-slate-600">AI-powered wellness tracking</p>
          </div>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              isMonitoring 
                ? 'bg-green-100 text-green-700' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isMonitoring ? 'Monitoring Active' : 'Start Monitoring'}
          </button>
        </div>

        {/* Current Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-slate-900">{mockData.todayStats.moodScore}/10</div>
                <div className="text-xs text-slate-600">Mood Score</div>
              </div>
              <Smile className="w-6 h-6 text-green-500" />
            </div>
          </div>
          
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-lg font-bold ${getStressColor(stressLevel).split(' ')[0]}`}>
                  {Math.round(stressLevel)}/5
                </div>
                <div className="text-xs text-slate-600">Stress Level</div>
              </div>
              <Activity className={`w-6 h-6 ${getStressColor(stressLevel).split(' ')[0]}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Mood Check-in */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h4 className="font-semibold text-slate-900 mb-3">How are you feeling right now?</h4>
          <div className="flex justify-between items-center">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setCurrentMood(mood.value)}
                className={`p-3 rounded-full transition-all duration-200 ${
                  currentMood === mood.value 
                    ? 'bg-blue-100 ring-2 ring-blue-500' 
                    : 'hover:bg-slate-100'
                }`}
              >
                <mood.icon className={`w-6 h-6 ${mood.color}`} />
              </button>
            ))}
          </div>
          {currentMood && (
            <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
              Thanks for sharing! I'll adjust your study plan to match your current mood.
            </div>
          )}
        </div>

        {/* Real-time Stress Indicator */}
        {isMonitoring && (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900">Live Stress Monitor</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-600">Live</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Current Stress</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStressColor(stressLevel)}`}>
                  {stressLevel <= 2 ? 'Low' : stressLevel <= 3 ? 'Moderate' : 'High'}
                </span>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    stressLevel <= 2 ? 'bg-green-500' : 
                    stressLevel <= 3 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(stressLevel / 5) * 100}%` }}
                ></div>
              </div>
              
              <div className="text-xs text-slate-500">
                Based on typing patterns, break frequency, and study duration
              </div>
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
            <Brain className="w-4 h-4 mr-2 text-purple-600" />
            AI Wellness Recommendations
          </h4>
          <div className="space-y-3">
            {mockData.recommendations.map((rec, index) => (
              <div key={index} className={`border-l-4 ${getUrgencyColor(rec.urgency)} p-3 rounded-r-lg`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-slate-900 mb-1">{rec.title}</h5>
                    <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                      {rec.action}
                    </button>
                  </div>
                  {rec.urgency === 'high' && <AlertTriangle className="w-5 h-5 text-red-500 ml-2" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
            Weekly Wellness Trends
          </h4>
          <div className="space-y-3">
            {mockData.weeklyTrend.map((day, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-8 text-sm font-medium text-slate-600">{day.day}</div>
                
                <div className="flex-1 flex items-center space-x-2">
                  <span className="text-xs text-slate-500 w-12">Stress</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        day.stress <= 2 ? 'bg-green-500' : 
                        day.stress <= 3 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(day.stress / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex-1 flex items-center space-x-2">
                  <span className="text-xs text-slate-500 w-12">Mood</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(day.mood / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200 p-4">
          <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            Personalized Insights
          </h4>
          <ul className="space-y-2">
            {mockData.insights.map((insight, index) => (
              <li key={index} className="text-sm text-purple-800 flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
            <Moon className="w-4 h-4" />
            <span>Meditation</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Sun className="w-4 h-4" />
            <span>Breathing</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MentalHealthMonitor
