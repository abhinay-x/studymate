import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import PageLayout from '../components/layout/PageLayout'
import SmartScheduler from '../components/SmartScheduler'
import { Calendar, Clock, Target, Zap } from 'lucide-react'

const SchedulerPage = () => {
  const { isDark } = useTheme()

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900 transition-all duration-500">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-4">
              Smart Scheduler
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              AI-powered study planning and time management for optimal learning efficiency
            </p>
          </div>

          {/* Features Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 text-center">
              <Clock className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Time Optimization</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Find your peak productivity hours</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 text-center">
              <Target className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Goal Planning</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Break down complex goals into achievable tasks</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 text-center">
              <Zap className="w-8 h-8 text-teal-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Smart Reminders</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Never miss important study sessions</p>
            </div>
          </div>

          {/* Scheduler Interface */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl overflow-hidden animate-fade-in-up">
            <SmartScheduler />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default SchedulerPage
