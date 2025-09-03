import { useState, useEffect } from 'react'
import { BarChart3, Clock, BookOpen, Target, Trophy, Calendar, Brain, Zap, Users, Settings, TrendingUp, PieChart, Activity, Map, GitBranch, Layers, Eye, Timer, Award, BookMarked } from 'lucide-react'
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
    { id: 'knowledge', name: 'Knowledge Graph', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'mindmap', name: 'Mind Map', icon: <Map className="w-4 h-4" /> },
    { id: 'analytics', name: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'insights', name: 'AI Insights', icon: <Eye className="w-4 h-4" /> }
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header with Tabs */}
      <div className="p-6 border-b border-white/20">
        <h2 className="text-lg font-semibold text-white mb-4">📊 Study Tools</h2>
        
        {/* Tab Navigation - Scrollable */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1 bg-white/20 rounded-lg p-1 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white/30 text-white shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/20'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
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
          <div className="p-6 space-y-6">
            {/* Advanced Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Learning Velocity</h3>
                </div>
                <div className="text-3xl font-bold text-green-400 mb-2">+23%</div>
                <p className="text-white/70 text-sm">Faster than last month</p>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-xs text-white/60">75%</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Knowledge Retention</h3>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">87%</div>
                <p className="text-white/70 text-sm">Long-term memory score</p>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <span className="text-xs text-white/60">87%</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Zap className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Focus Score</h3>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-2">94</div>
                <p className="text-white/70 text-sm">Peak concentration level</p>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                  <span className="text-xs text-white/60">94%</span>
                </div>
              </div>
            </div>

            {/* Study Patterns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-lg border border-white/20 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Activity className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">Study Patterns</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Peak Study Hours</span>
                    <span className="text-cyan-400 font-semibold">2-4 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Optimal Session Length</span>
                    <span className="text-green-400 font-semibold">45 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Break Frequency</span>
                    <span className="text-blue-400 font-semibold">Every 1h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Weekly Goal Progress</span>
                    <span className="text-purple-400 font-semibold">85%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg border border-white/20 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <PieChart className="w-6 h-6 text-orange-400" />
                  <h3 className="text-lg font-semibold text-white">Learning Distribution</h3>
                </div>
                
                <div className="space-y-3">
                  {[
                    { subject: 'Machine Learning', percentage: 35, color: 'bg-green-500' },
                    { subject: 'Data Structures', percentage: 25, color: 'bg-blue-500' },
                    { subject: 'Algorithms', percentage: 20, color: 'bg-purple-500' },
                    { subject: 'Statistics', percentage: 15, color: 'bg-yellow-500' },
                    { subject: 'Other Topics', percentage: 5, color: 'bg-gray-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-white/70 text-sm">{item.subject}</span>
                      </div>
                      <span className="text-white font-semibold text-sm">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Metrics */}
            <div className="bg-white/10 rounded-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-3">
                <Award className="w-6 h-6 text-yellow-400" />
                <span>Performance Insights</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-1">247</div>
                  <div className="text-xs text-white/60">Questions Mastered</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-1">89%</div>
                  <div className="text-xs text-white/60">Average Accuracy</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-1">18h</div>
                  <div className="text-xs text-white/60">This Week</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400 mb-1">12</div>
                  <div className="text-xs text-white/60">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mindmap' && (
          <div className="p-6">
            <div className="bg-white/10 rounded-lg border border-white/20 p-8 text-center">
              <Map className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Interactive Mind Map</h3>
              <p className="text-white/70 mb-6">Visualize connections between concepts and create dynamic mind maps from your study materials.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-white/5 rounded-lg p-6 text-left">
                  <h4 className="font-semibold text-white mb-3 flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-blue-400" />
                    <span>Concept Clustering</span>
                  </h4>
                  <p className="text-white/60 text-sm">Automatically group related topics and identify knowledge gaps in your learning journey.</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-6 text-left">
                  <h4 className="font-semibold text-white mb-3 flex items-center space-x-2">
                    <GitBranch className="w-5 h-5 text-green-400" />
                    <span>Learning Pathways</span>
                  </h4>
                  <p className="text-white/60 text-sm">Discover optimal learning sequences and prerequisite relationships between topics.</p>
                </div>
              </div>
              
              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                Generate Mind Map
              </button>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Eye className="w-6 h-6 text-indigo-400" />
                <h3 className="text-xl font-semibold text-white">AI-Powered Learning Insights</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span>Strength Analysis</span>
                  </h4>
                  <p className="text-white/70 text-sm mb-3">You excel in conceptual understanding and pattern recognition. Your performance in machine learning algorithms is consistently above average.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Supervised Learning</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Neural Networks</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Data Preprocessing</span>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-yellow-400" />
                    <span>Improvement Areas</span>
                  </h4>
                  <p className="text-white/70 text-sm mb-3">Focus on mathematical foundations and statistical concepts. Consider spending more time on probability theory and linear algebra.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">Statistics</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">Linear Algebra</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">Probability</span>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                    <BookMarked className="w-5 h-5 text-blue-400" />
                    <span>Personalized Recommendations</span>
                  </h4>
                  <ul className="text-white/70 text-sm space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Schedule 30-minute statistics review sessions every Tuesday and Thursday</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Practice more hands-on coding exercises for reinforcement learning</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Use spaced repetition for mathematical formulas and theorems</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                    <Timer className="w-5 h-5 text-purple-400" />
                    <span>Optimal Study Schedule</span>
                  </h4>
                  <p className="text-white/70 text-sm mb-3">Based on your performance patterns, here's your personalized study schedule:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-white/5 rounded p-3">
                      <div className="font-medium text-white mb-1">Morning (9-11 AM)</div>
                      <div className="text-white/60">Complex problem solving, algorithms</div>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <div className="font-medium text-white mb-1">Afternoon (2-4 PM)</div>
                      <div className="text-white/60">Theory review, concept mapping</div>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <div className="font-medium text-white mb-1">Evening (7-8 PM)</div>
                      <div className="text-white/60">Practice problems, flashcards</div>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <div className="font-medium text-white mb-1">Night (9-10 PM)</div>
                      <div className="text-white/60">Light review, spaced repetition</div>
                    </div>
                  </div>
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
