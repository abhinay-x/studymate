import React from 'react'
import PageLayout from '../components/layout/PageLayout'
import StudyBuddy from '../components/StudyBuddy'
import { Bot, Brain, Target, Clock } from 'lucide-react'

const StudyBuddyPage = () => {

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-500">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Bot className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
              Study Buddy
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Your personal AI companion for focused study sessions and productivity
            </p>
          </div>

          {/* Features Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 text-center">
              <Brain className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Focus Mode</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Eliminate distractions and stay on track</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 text-center">
              <Target className="w-8 h-8 text-pink-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Goal Setting</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Set and track your study objectives</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 text-center">
              <Clock className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Time Management</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pomodoro timer and break reminders</p>
            </div>
          </div>

          {/* Study Buddy Interface */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl overflow-hidden animate-fade-in-up">
            <StudyBuddy />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default StudyBuddyPage
