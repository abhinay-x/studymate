import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import UniversalHeader from './UniversalHeader'
import UniversalFooter from './UniversalFooter'

const PageLayout = ({ 
  children, 
  showHeader = true, 
  showFooter = true, 
  className = '',
  showBackground = true,
  showBlobs = true
}) => {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen ${showBackground ? 'bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-colors' : ''} ${className}`}>
      {/* Animated Background Elements */}
      {showBlobs && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500/10 dark:bg-purple-400/5 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500/10 dark:bg-pink-400/5 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      )}

      {/* Header */}
      {showHeader && <UniversalHeader />}
      
      {/* Main Content */}
      <main className={`relative z-10 ${showHeader ? 'pt-16' : ''}`}>
        {children}
      </main>
      
      {/* Footer */}
      {showFooter && <UniversalFooter />}
    </div>
  )
}

export default PageLayout
