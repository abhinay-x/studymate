import { useState } from 'react'
import { BarChart3, Clock, BookOpen, Target, Trophy, Calendar, Brain, Zap, Users, Settings } from 'lucide-react'
import FlashCards from './FlashCards'
import KnowledgeGraph from './KnowledgeGraph'

function StudyTools({ documents = [], questions = [] }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activeSession, setActiveSession] = useState({
    name: "Machine Learning Prep",
    duration: "1h 23m",
    questionsAnswered: 15,
    topicsCovered: 8,
    progress: 65
  })

  const recentTopics = [
    { name: "Supervised Learning", mastery: 85, questions: 12 },
    { name: "Neural Networks", mastery: 72, questions: 8 },
    { name: "Decision Trees", mastery: 91, questions: 15 },
    { name: "Clustering", mastery: 68, questions: 6 }
  ]

  const studyStreak = 7
  const weeklyGoal = 20
  const weeklyProgress = 15

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'flashcards', name: 'Flash Cards', icon: <Brain className="w-4 h-4" /> },
    { id: 'knowledge', name: 'Knowledge Graph', icon: <Zap className="w-4 h-4" /> },
    { id: 'analytics', name: 'Analytics', icon: <Target className="w-4 h-4" /> }
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header with Tabs */}
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">📊 Study Tools</h2>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="p-6 space-y-6">
        {/* Current Study Session */}
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">📊 Current Session</h3>
            <button className="text-xs text-primary-600 hover:text-primary-700">⏸️ Pause</button>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-slate-800">{activeSession.name}</h4>
              <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{activeSession.duration}</span>
                </span>
                <span>📝 {activeSession.questionsAnswered} questions</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{activeSession.questionsAnswered}</div>
                <div className="text-xs text-slate-500">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600">{activeSession.topicsCovered}</div>
                <div className="text-xs text-slate-500">Topics</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">{activeSession.progress}%</div>
                <div className="text-xs text-slate-500">Progress</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Session Progress</span>
                <span>{activeSession.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${activeSession.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Study Streak */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-accent-500" />
              <span>Study Streak</span>
            </h3>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-600 mb-2">{studyStreak}</div>
            <div className="text-sm text-slate-600 mb-4">days in a row! 🔥</div>
            <div className="text-xs text-slate-500">Keep it up! You're doing great.</div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary-500" />
              <span>Weekly Goal</span>
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Study Sessions</span>
              <span>{weeklyProgress}/{weeklyGoal}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(weeklyProgress / weeklyGoal) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-500">
              {weeklyGoal - weeklyProgress} more sessions to reach your goal
            </div>
          </div>
        </div>

        {/* Topic Mastery */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-secondary-500" />
              <span>Topic Mastery</span>
            </h3>
            <button className="text-xs text-slate-500 hover:text-slate-700">View All</button>
          </div>
          
          <div className="space-y-4">
            {recentTopics.map((topic, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">{topic.name}</span>
                  <span className="text-xs text-slate-500">{topic.questions} questions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        topic.mastery >= 80 ? 'bg-secondary-500' :
                        topic.mastery >= 60 ? 'bg-accent-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${topic.mastery}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-slate-600 w-10">{topic.mastery}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 text-left bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg transition-colors">
              <div className="text-sm font-medium text-primary-700">📋 Create Quiz</div>
              <div className="text-xs text-primary-600 mt-1">Test your knowledge</div>
            </button>
            <button className="p-3 text-left bg-secondary-50 hover:bg-secondary-100 border border-secondary-200 rounded-lg transition-colors">
              <div className="text-sm font-medium text-secondary-700">🗂️ Flash Cards</div>
              <div className="text-xs text-secondary-600 mt-1">Review key concepts</div>
            </button>
            <button className="p-3 text-left bg-accent-50 hover:bg-accent-100 border border-accent-200 rounded-lg transition-colors">
              <div className="text-sm font-medium text-accent-700">📈 Analytics</div>
              <div className="text-xs text-accent-600 mt-1">View detailed stats</div>
            </button>
            <button className="p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors">
              <div className="text-sm font-medium text-slate-700">📝 Notes</div>
              <div className="text-xs text-slate-600 mt-1">Personal notes</div>
            </button>
          </div>
        </div>

        {/* Study Schedule */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span>Upcoming</span>
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-slate-700">Review Session</div>
                <div className="text-xs text-slate-500">Machine Learning Concepts</div>
              </div>
              <div className="text-xs text-slate-500">Tomorrow 2:00 PM</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-slate-700">Quiz Practice</div>
                <div className="text-xs text-slate-500">Neural Networks</div>
              </div>
              <div className="text-xs text-slate-500">Wed 10:00 AM</div>
            </div>
          </div>
        </div>
          </div>
        )}

        {activeTab === 'flashcards' && (
          <div className="p-6">
            <FlashCards documents={documents} questions={questions} />
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="p-6">
            <KnowledgeGraph documents={documents} questions={questions} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-6">
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
              <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Advanced Analytics</h3>
              <p className="text-slate-600 mb-4">Detailed study analytics and performance insights coming soon!</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-primary-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">85%</div>
                  <div className="text-sm text-primary-700">Average Score</div>
                </div>
                <div className="p-4 bg-secondary-50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary-600">12h</div>
                  <div className="text-sm text-secondary-700">Study Time</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudyTools
