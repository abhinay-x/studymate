import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import PageLayout from '../components/layout/PageLayout'
import { Link } from 'react-router-dom'
import { 
  MessageSquare, 
  BarChart3, 
  Bot, 
  Calendar, 
  Users, 
  Trophy, 
  Heart, 
  Camera,
  BookOpen,
  Target,
  Zap
} from 'lucide-react'

const DashboardPage = () => {
  const { user } = useAuth()
  const { isDark } = useTheme()
  const featureLinks = [
    { path: '/chat', icon: MessageSquare, name: 'AI Chat', desc: 'Ask questions, summarize, and get instant help' },
    { path: '/study-buddy', icon: Bot, name: 'Study Buddy', desc: 'Personalized plans and guidance' },
    { path: '/scheduler', icon: Calendar, name: 'Scheduler', desc: 'Plan your study sessions smartly' },
    { path: '/classroom', icon: Users, name: 'Classroom', desc: 'Collaborate in real-time sessions' },
    { path: '/gamification', icon: Trophy, name: 'Gamification', desc: 'Earn points and badges' },
    { path: '/mental-health', icon: Heart, name: 'Wellness', desc: 'Mindfulness and healthy habits' },
    { path: '/ar-study', icon: Camera, name: 'AR Study', desc: 'Immersive learning experiences' },
    { path: '/analytics', icon: BarChart3, name: 'Analytics', desc: 'Track your progress and insights' }
  ]

  const stats = [
    { label: 'Study Hours', value: '127h', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { label: 'Courses', value: '8', icon: Target, color: 'from-purple-500 to-pink-500' },
    { label: 'Achievements', value: '23', icon: Trophy, color: 'from-yellow-500 to-orange-500' },
    { label: 'Streak', value: '12 days', icon: Zap, color: 'from-green-500 to-emerald-500' }
  ]

  return (
    <div className={isDark ? 'dark' : ''}>
    <PageLayout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Welcome Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="backdrop-blur-xl rounded-3xl border shadow-xl p-4 sm:p-6 lg:p-8 transition-all duration-300 bg-white/70 border-slate-200 shadow-slate-200 dark:bg-white/10 dark:border-white/20 dark:shadow-black/20">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center space-x-4 w-full lg:w-auto">
                <div className="relative">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`}
                    alt={user?.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-indigo-200 dark:border-indigo-700 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                </div>
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Welcome back, {user?.name || 'Student'}! 👋
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-white/70">
                    Ready to continue your learning journey?
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 sm:space-x-6 w-full lg:w-auto justify-between lg:justify-end">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-cyan-400">
                    Level {user?.level || 5}
                  </div>
                  <div className="text-xs sm:text-sm text-white/60">
                    Current Level
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-purple-400">
                    {user?.xp || 2350} XP
                  </div>
                  <div className="text-xs sm:text-sm text-white/60">
                    Total Points
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-600 dark:text-white/70">
                  Progress to Level {(user?.level || 5) + 1}
                </span>
                <span className="text-sm text-slate-600 dark:text-white/70">
                  {((user?.xp || 2350) % 500)}/500 XP
                </span>
              </div>
              <div className="w-full rounded-full h-3 bg-slate-200 dark:bg-white/20">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${(((user?.xp || 2350) % 500) / 500) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group backdrop-blur-xl rounded-2xl border shadow-lg p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/70 border-slate-200 shadow-slate-200 hover:bg-white dark:bg-white/10 dark:border-white/20 dark:shadow-black/20"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-white/70 truncate">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Shortcuts */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2 className="text-slate-800 dark:text-white/90 font-semibold mb-4">Quick access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featureLinks.map((f) => (
              <Link
                key={f.path}
                to={f.path}
                className="group backdrop-blur-xl rounded-2xl border shadow-lg p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-white border-slate-200 shadow-slate-200 hover:bg-slate-50 dark:bg-white/10 dark:border-white/20 dark:shadow-black/20 dark:hover:bg-white/20"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 dark:bg-white/10 dark:border-white/20">
                    <f.icon className="w-6 h-6 text-slate-700 dark:text-white" />
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white font-semibold">{f.name}</div>
                    <div className="text-slate-600 dark:text-white/70 text-sm mt-1">{f.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer spacing for mobile if needed */}
        <div className="h-8" />
      </div>
      {/* Close min-h-screen wrapper */}
    </div>
    </PageLayout>
  </div>
  )
}

export default DashboardPage
