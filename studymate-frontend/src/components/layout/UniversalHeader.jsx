import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Settings, 
  Bell,
  Menu,
  X,
  Home,
  MessageSquare,
  BarChart3,
  Calendar,
  Users,
  Trophy,
  Heart,
  Camera,
  BookOpen,
  Brain,
  Map,
  Eye,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react'

const UniversalHeader = () => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const headerRef = useRef(null)
  const moreMenuRef = useRef(null)

  const mainNavItems = [
    { path: '/dashboard', name: 'Dashboard', icon: Home },
    { path: '/chat', name: 'AI Chat', icon: MessageSquare },
    { path: '/flashcards', name: 'Flashcards', icon: Brain },
    { path: '/analytics', name: 'Analytics', icon: BarChart3 },
    { path: '/mindmap', name: 'Mind Map', icon: Map }
  ]

  const moreNavItems = [
    { path: '/ai-insights', name: 'AI Insights', icon: Eye },
    { path: '/study-buddy', name: 'Study Buddy', icon: Users },
    { path: '/scheduler', name: 'Scheduler', icon: Calendar },
    { path: '/classroom', name: 'Virtual Classroom', icon: Users },
    { path: '/gamification', name: 'Gamification', icon: Trophy },
    { path: '/mental-health', name: 'Mental Health', icon: Heart },
    { path: '/ar-study', name: 'AR Study', icon: Camera },
    { path: '/documents', name: 'Documents', icon: BookOpen }
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Close menus on click outside and ESC
  useEffect(() => {
    const onClick = (e) => {
      if (isProfileMenuOpen && profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false)
      }
      if (isMobileMenuOpen && headerRef.current && !headerRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false)
      }
      if (isMoreOpen && moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setIsMoreOpen(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsProfileMenuOpen(false)
        setIsMobileMenuOpen(false)
        setIsMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [isProfileMenuOpen, isMobileMenuOpen, isMoreOpen])

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 dark:border-slate-800/70">
      {/* Solid Background for Better Contrast */}
      <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/20 dark:from-slate-800/30 dark:via-slate-800/20 dark:to-slate-800/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-sm">SM</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StudyMate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-600 shadow-sm border border-blue-500/30'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            
            {/* More Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isMoreOpen 
                    ? 'bg-blue-500/20 text-blue-600 shadow-sm border border-blue-500/30' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                <MoreHorizontal className="w-4 h-4" />
                <span>More</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-xl">
                  <div className="py-2">
                    {moreNavItems.map((item) => {
                      const isActive = location.pathname === item.path
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMoreOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-500/10 text-blue-600 border-r-2 border-blue-500'
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <button className="hidden md:flex p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            </button>

            {/* Theme Toggle (icon reflects current state) */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
            >
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Profile Menu - Desktop */}
            <div className="relative hidden md:block" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-blue-50/50 transition-all duration-200"
              >
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=3b82f6&color=fff`}
                  alt={user?.name}
                  className="w-8 h-8 rounded-lg border-2 border-blue-200/50"
                />
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-xl">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-200/50">
                      <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    
                    <div className="border-t border-gray-200/50 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute left-4 right-4 top-16 z-50 bg-white/95 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-xl">
            <div className="py-4">
              {/* User Profile Section - Mobile */}
              <div className="px-4 pb-4 border-b border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=3b82f6&color=fff`}
                    alt={user?.name}
                    className="w-10 h-10 rounded-lg border-2 border-blue-200/50"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500">Level {user?.level || 5}</div>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="py-2">
                {[...mainNavItems, ...moreNavItems].map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-500/10 text-blue-600 border-r-2 border-blue-500'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile Actions */}
              <div className="px-4 pt-4 border-t border-gray-200/50">
                <div className="flex items-center justify-between">
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                  >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default UniversalHeader
