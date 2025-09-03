import React, { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import PageLayout from '../components/layout/PageLayout'
import { 
  Eye, 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb,
  BookOpen,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Zap,
  Users,
  Calendar
} from 'lucide-react'

const AIInsightsPage = () => {
  const { isDark } = useTheme()
  const [selectedInsight, setSelectedInsight] = useState('performance')

  const insightCategories = [
    { id: 'performance', name: 'Performance Analysis', icon: TrendingUp, color: 'from-blue-500 to-indigo-500' },
    { id: 'learning', name: 'Learning Patterns', icon: Brain, color: 'from-purple-500 to-pink-500' },
    { id: 'recommendations', name: 'Recommendations', icon: Lightbulb, color: 'from-yellow-500 to-orange-500' },
    { id: 'predictions', name: 'Future Predictions', icon: Eye, color: 'from-green-500 to-teal-500' }
  ]

  const performanceInsights = [
    {
      type: 'strength',
      title: 'Strong Mathematical Foundation',
      description: 'Your performance in calculus and algebra shows exceptional understanding of core concepts.',
      confidence: 94,
      impact: 'high',
      suggestions: ['Continue with advanced topics', 'Consider tutoring others']
    },
    {
      type: 'improvement',
      title: 'Physics Problem-Solving Speed',
      description: 'Analysis shows you take 23% longer than optimal on physics problems.',
      confidence: 87,
      impact: 'medium',
      suggestions: ['Practice timed exercises', 'Focus on pattern recognition']
    },
    {
      type: 'warning',
      title: 'Declining Engagement in History',
      description: 'Your study time and performance in history has decreased by 15% this week.',
      confidence: 91,
      impact: 'medium',
      suggestions: ['Try interactive content', 'Schedule regular review sessions']
    }
  ]

  const learningPatterns = [
    {
      pattern: 'Peak Performance Time',
      finding: '10:00 AM - 12:00 PM',
      description: 'Your cognitive performance is 34% higher during morning hours',
      recommendation: 'Schedule challenging subjects during this window'
    },
    {
      pattern: 'Optimal Study Duration',
      finding: '45-minute sessions',
      description: 'Retention drops significantly after 45 minutes of continuous study',
      recommendation: 'Use 45-min study blocks with 10-min breaks'
    },
    {
      pattern: 'Learning Style Preference',
      finding: 'Visual + Kinesthetic',
      description: 'You learn 67% faster with visual aids and hands-on practice',
      recommendation: 'Incorporate diagrams, charts, and practical exercises'
    }
  ]

  const recommendations = [
    {
      priority: 'high',
      category: 'Study Schedule',
      title: 'Optimize Your Study Timing',
      description: 'Based on your performance data, studying mathematics between 10-11 AM could improve retention by 28%.',
      timeToImplement: '1 day',
      expectedImpact: '+28% retention'
    },
    {
      priority: 'medium',
      category: 'Content Strategy',
      title: 'Increase Spaced Repetition',
      description: 'Your forgetting curve analysis suggests reviewing flashcards every 3 days instead of weekly.',
      timeToImplement: '3 days',
      expectedImpact: '+15% long-term retention'
    },
    {
      priority: 'low',
      category: 'Social Learning',
      title: 'Join Study Groups',
      description: 'Students with similar learning patterns show 12% better performance in group settings.',
      timeToImplement: '1 week',
      expectedImpact: '+12% engagement'
    }
  ]

  const predictions = [
    {
      subject: 'Mathematics',
      currentGrade: 'A-',
      predictedGrade: 'A+',
      confidence: 89,
      timeframe: '4 weeks',
      factors: ['Consistent practice', 'Strong fundamentals', 'Improving speed']
    },
    {
      subject: 'Physics',
      currentGrade: 'B+',
      predictedGrade: 'A-',
      confidence: 76,
      timeframe: '6 weeks',
      factors: ['Need more practice', 'Good conceptual understanding']
    },
    {
      subject: 'History',
      currentGrade: 'B',
      predictedGrade: 'B-',
      confidence: 82,
      timeframe: '3 weeks',
      factors: ['Declining engagement', 'Missed study sessions']
    }
  ]

  const renderInsightContent = () => {
    switch (selectedInsight) {
      case 'performance':
        return (
          <div className="space-y-6">
            {performanceInsights.map((insight, index) => (
              <div key={index} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {insight.type === 'strength' && <CheckCircle className="w-6 h-6 text-green-500" />}
                    {insight.type === 'improvement' && <Target className="w-6 h-6 text-blue-500" />}
                    {insight.type === 'warning' && <AlertCircle className="w-6 h-6 text-orange-500" />}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{insight.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400">
                          {insight.confidence}% confidence
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          insight.impact === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                          insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {insight.impact} impact
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4">{insight.description}</p>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">Suggestions:</h4>
                  {insight.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )

      case 'learning':
        return (
          <div className="space-y-6">
            {learningPatterns.map((pattern, index) => (
              <div key={index} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{pattern.pattern}</h3>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{pattern.finding}</div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4">{pattern.description}</p>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-300">Recommendation:</span>
                  </div>
                  <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">{pattern.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        )

      case 'recommendations':
        return (
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-500' :
                      rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{rec.title}</h3>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{rec.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">{rec.expectedImpact}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{rec.timeToImplement}</div>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4">{rec.description}</p>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                  <Zap className="w-4 h-4" />
                  <span>Implement Now</span>
                </button>
              </div>
            ))}
          </div>
        )

      case 'predictions':
        return (
          <div className="space-y-6">
            {predictions.map((pred, index) => (
              <div key={index} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{pred.subject}</h3>
                  <div className="text-right">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Prediction Confidence</div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{pred.confidence}%</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Current</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{pred.currentGrade}</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Predicted ({pred.timeframe})</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{pred.predictedGrade}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">Key Factors:</h4>
                  {pred.factors.map((factor, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-slate-900 dark:via-violet-900 dark:to-purple-900 transition-all duration-500">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-violet-400/10 to-purple-400/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-fuchsia-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
              AI Insights
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Discover personalized insights about your learning patterns and get AI-powered recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 sticky top-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Insight Categories</h3>
                <div className="space-y-2">
                  {insightCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedInsight(category.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                        selectedInsight === category.id
                          ? 'bg-violet-100 dark:bg-violet-900/50 border-2 border-violet-300 dark:border-violet-600'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                        <category.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-sm font-medium ${
                        selectedInsight === category.id 
                          ? 'text-violet-900 dark:text-violet-100' 
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {category.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Quick Stats</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 dark:text-slate-400">Insights Generated</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 dark:text-slate-400">Recommendations</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 dark:text-slate-400">Accuracy</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">94%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="animate-fade-in-up">
                {renderInsightContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default AIInsightsPage
