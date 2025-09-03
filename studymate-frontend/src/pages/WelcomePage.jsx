import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { 
  MessageSquare, 
  Bot, 
  Calendar, 
  Users, 
  Trophy, 
  Heart, 
  Camera,
  BarChart3,
  BookOpen,
  Target,
  Zap,
  ArrowRight,
  Sparkles,
  Brain,
  Lightbulb,
  TrendingUp,
  Award,
  Clock,
  Star
} from 'lucide-react'

const WelcomePage = () => {
  const { user } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const features = [
    {
      id: 'ai-chat',
      title: 'AI Chat Assistant',
      description: 'Get instant answers and explanations from our advanced AI tutor',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      route: '/ai-chat',
      stats: 'Ask unlimited questions'
    },
    {
      id: 'study-buddy',
      title: 'Study Buddy',
      description: 'Your personal AI companion for focused study sessions',
      icon: Bot,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      route: '/study-buddy',
      stats: '24/7 availability'
    },
    {
      id: 'scheduler',
      title: 'Smart Scheduler',
      description: 'AI-powered study planning and time management',
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      route: '/scheduler',
      stats: 'Optimize your time'
    },
    {
      id: 'classroom',
      title: 'Virtual Classroom',
      description: 'Join live sessions and collaborate with peers',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      route: '/classroom',
      stats: 'Connect with peers'
    },
    {
      id: 'gamification',
      title: 'Gamification Hub',
      description: 'Earn points, badges, and compete with friends',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      route: '/gamification',
      stats: 'Level up your learning'
    },
    {
      id: 'mental-health',
      title: 'Mental Health',
      description: 'Wellness tracking and mindfulness exercises',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      borderColor: 'border-pink-200 dark:border-pink-800',
      route: '/mental-health',
      stats: 'Stay balanced'
    },
    {
      id: 'ar-study',
      title: 'AR Study Mode',
      description: 'Immersive learning with augmented reality',
      icon: Camera,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      route: '/ar-study',
      stats: 'Next-gen learning'
    },
    {
      id: 'analytics',
      title: 'Study Analytics',
      description: 'Track progress with detailed insights and reports',
      icon: BarChart3,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      borderColor: 'border-teal-200 dark:border-teal-800',
      route: '/analytics',
      stats: 'Data-driven insights'
    }
  ]

  const quickStats = [
    { label: 'Study Hours', value: user?.studyHours || '127h', icon: Clock, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Courses', value: user?.courses || '8', icon: BookOpen, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Achievements', value: user?.achievements || '23', icon: Award, color: 'text-yellow-600 dark:text-yellow-400' },
    { label: 'Streak', value: user?.streak || '12 days', icon: Zap, color: 'text-green-600 dark:text-green-400' }
  ]

  const handleFeatureClick = (route) => {
    navigate(route)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 transition-all duration-500">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`}
                alt={user?.name}
                className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-700 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
            Welcome back, {user?.name || 'Student'}! 🎉
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Ready to continue your learning journey? Choose from our powerful study tools designed to accelerate your success.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {quickStats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${features[index % features.length].color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              onClick={() => handleFeatureClick(feature.route)}
              className={`group relative overflow-hidden rounded-2xl ${feature.bgColor} ${feature.borderColor} border-2 p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className="relative z-10 mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Stats Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-500 bg-white/50 dark:bg-slate-700/50 px-3 py-1 rounded-full">
                    {feature.stats}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transform group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center space-x-3">
              <Lightbulb className="w-8 h-8 text-yellow-500" />
              <span>Quick Actions</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Jump into your most used features instantly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => navigate('/ai-chat')}
              className="group p-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <MessageSquare className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg mb-2">Start Learning</h3>
              <p className="text-blue-100 text-sm">Ask AI anything</p>
            </button>

            <button 
              onClick={() => navigate('/analytics')}
              className="group p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <TrendingUp className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg mb-2">View Progress</h3>
              <p className="text-purple-100 text-sm">Track your growth</p>
            </button>

            <button 
              onClick={() => navigate('/study-buddy')}
              className="group p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Brain className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg mb-2">Study Session</h3>
              <p className="text-green-100 text-sm">Focus mode</p>
            </button>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="text-center mt-12 animate-fade-in">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-400/10 dark:to-purple-400/10 rounded-2xl p-8 border border-indigo-200/50 dark:border-indigo-700/50">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
            <blockquote className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
              "The future belongs to those who learn more skills and combine them in creative ways."
            </blockquote>
            <cite className="text-sm text-slate-500 dark:text-slate-400">— Robert Greene</cite>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
