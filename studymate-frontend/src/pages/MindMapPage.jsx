import React, { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import PageLayout from '../components/layout/PageLayout'
import { 
  Map, 
  Plus, 
  Search, 
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  Layers,
  Move,
  Edit3,
  GitBranch,
  Brain,
  Lightbulb,
  Target,
  RotateCcw,
  Sun,
  Moon
} from 'lucide-react'

const MindMapPage = () => {
  const { isDark, toggleTheme } = useTheme()
  const [selectedTool, setSelectedTool] = useState('select')
  const [zoomLevel, setZoomLevel] = useState(100)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [lastTouchDistance, setLastTouchDistance] = useState(0)
  const [isTouch, setIsTouch] = useState(false)

  const mindMapNodes = [
    { id: 1, x: 50, y: 40, text: 'Machine Learning', type: 'main', color: 'from-blue-500 to-indigo-500' },
    { id: 2, x: 20, y: 20, text: 'Supervised Learning', type: 'branch', color: 'from-green-500 to-teal-500' },
    { id: 3, x: 80, y: 20, text: 'Unsupervised Learning', type: 'branch', color: 'from-purple-500 to-pink-500' },
    { id: 4, x: 50, y: 70, text: 'Deep Learning', type: 'branch', color: 'from-orange-500 to-red-500' },
    { id: 5, x: 10, y: 10, text: 'Classification', type: 'leaf', color: 'from-cyan-400 to-blue-400' },
    { id: 6, x: 30, y: 10, text: 'Regression', type: 'leaf', color: 'from-emerald-400 to-green-400' }
  ]

  const tools = [
    { id: 'select', icon: Move, name: 'Select' },
    { id: 'add', icon: Plus, name: 'Add Node' },
    { id: 'edit', icon: Edit3, name: 'Edit' },
    { id: 'connect', icon: GitBranch, name: 'Connect' }
  ]

  // Touch distance calculation
  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Touch center calculation
  const getTouchCenter = (touches) => {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    }
  }

  // Mouse handlers
  const handleMouseDown = (e) => {
    if (selectedTool === 'select' && !isTouch) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging && selectedTool === 'select' && !isTouch) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch handlers
  const handleTouchStart = (e) => {
    e.preventDefault()
    setIsTouch(true)
    
    if (e.touches.length === 1) {
      // Single touch - start panning
      setIsDragging(true)
      setDragStart({ 
        x: e.touches[0].clientX - panOffset.x, 
        y: e.touches[0].clientY - panOffset.y 
      })
    } else if (e.touches.length === 2) {
      // Two touches - start zooming
      setIsDragging(false)
      setLastTouchDistance(getTouchDistance(e.touches))
    }
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    
    if (e.touches.length === 1 && isDragging) {
      // Single touch - panning
      setPanOffset({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      })
    } else if (e.touches.length === 2) {
      // Two touches - zooming
      const currentDistance = getTouchDistance(e.touches)
      const scale = currentDistance / lastTouchDistance
      
      if (Math.abs(scale - 1) > 0.01) {
        setZoomLevel(prev => {
          const newZoom = Math.max(25, Math.min(300, prev * scale))
          setLastTouchDistance(currentDistance)
          return newZoom
        })
      }
    }
  }

  const handleTouchEnd = (e) => {
    e.preventDefault()
    setIsDragging(false)
    setLastTouchDistance(0)
    
    // Reset touch flag after a delay to prevent mouse events
    setTimeout(() => setIsTouch(false), 100)
  }

  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -10 : 10
    setZoomLevel(prev => Math.max(25, Math.min(300, prev + delta)))
  }

  const resetView = () => {
    setZoomLevel(100)
    setPanOffset({ x: 0, y: 0 })
  }

  return (
    <PageLayout showBackground={false} showBlobs={false}>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 transition-colors duration-500">
        {/* Animated Background - themed */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {isDark ? (
            <>
              <div className="absolute -top-10 -left-10 w-96 h-96 bg-gradient-to-br from-emerald-600/15 via-teal-500/10 to-cyan-400/10 rounded-full blur-3xl animate-blob"></div>
              <div className="absolute bottom-10 right-0 w-[28rem] h-[28rem] bg-gradient-to-tr from-teal-500/15 via-emerald-500/10 to-sky-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-gradient-to-r from-emerald-500/10 to-teal-400/10 rounded-full blur-[90px] animate-pulse"></div>
            </>
          ) : (
            <>
              <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-emerald-400/25 to-teal-400/20 rounded-full blur-3xl animate-blob"></div>
              <div className="absolute bottom-24 right-10 w-80 h-80 bg-gradient-to-r from-teal-400/25 to-cyan-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-10 left-1/3 w-[30rem] h-[30rem] bg-gradient-to-tr from-cyan-400/20 to-emerald-400/20 rounded-full blur-[90px] animate-pulse"></div>
            </>
          )}
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Mind Map Studio
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Visualize and organize your knowledge
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {/* Search - Hidden on mobile */}
              <div className="relative hidden md:block flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search nodes..."
                  className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              {/* Zoom Controls - Mobile */}
              <div className="flex lg:hidden items-center space-x-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-lg p-2">
                <button
                  onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <ZoomOut className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
                <span className="text-xs font-medium text-slate-900 dark:text-white min-w-[3rem] text-center">{Math.round(zoomLevel)}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(300, zoomLevel + 25))}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <ZoomIn className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  onClick={resetView}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                  title="Reset View"
                >
                  <RotateCcw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              {/* Action Buttons - Responsive */}
              <button className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-all">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {/* Theme Toggle (header) */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-all"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
                <span className="hidden sm:inline">Theme</span>
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden min-h-0">
            {/* Sidebar - Tools & Properties */}
            <div className="hidden lg:flex lg:flex-col lg:w-80 lg:min-w-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/50 p-4 lg:p-6 space-y-4 lg:space-y-6 overflow-y-auto">
              {/* Tools */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all ${
                        selectedTool === tool.id
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 border-2 border-emerald-300 dark:border-emerald-600'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 border-2 border-transparent'
                      }`}
                    >
                      <tool.icon className={`w-5 h-5 ${
                        selectedTool === tool.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                      }`} />
                      <span className={`text-xs font-medium ${
                        selectedTool === tool.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {tool.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom Controls */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">View</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Zoom</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{zoomLevel}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <ZoomOut className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                        style={{ width: `${zoomLevel}%` }}
                      ></div>
                    </div>
                    <button
                      onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <ZoomIn className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Node Templates */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Templates</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all text-left">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">Main Topic</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Central concept</div>
                    </div>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all text-left">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <GitBranch className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">Subtopic</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Branch concept</div>
                    </div>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all text-left">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">Idea</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Key insight</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Nodes</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">6</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Connections</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Depth</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">3 levels</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Canvas */}
            <div className="flex-1 relative overflow-hidden min-w-0">
              <div className="absolute inset-0 bg-white/30 dark:bg-slate-900/30">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" className="pointer-events-none">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-400 dark:text-slate-600"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Mind Map Canvas */}
                <div 
                  className="relative w-full h-full transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing touch-none"
                  style={{ 
                    transform: `scale(${zoomLevel / 100}) translate(${panOffset.x}px, ${panOffset.y}px)`, 
                    transformOrigin: 'center center',
                    width: '100%',
                    height: '100%',
                    minWidth: '100vw',
                    minHeight: '100vh'
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Connections */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="50" y1="40" x2="20" y2="20" stroke="url(#gradient1)" strokeWidth="0.5" className="drop-shadow-sm" />
                    <line x1="50" y1="40" x2="80" y2="20" stroke="url(#gradient2)" strokeWidth="0.5" className="drop-shadow-sm" />
                    <line x1="50" y1="40" x2="50" y2="70" stroke="url(#gradient3)" strokeWidth="0.5" className="drop-shadow-sm" />
                    <line x1="20" y1="20" x2="10" y2="10" stroke="url(#gradient4)" strokeWidth="0.3" className="drop-shadow-sm" />
                    <line x1="20" y1="20" x2="30" y2="10" stroke="url(#gradient5)" strokeWidth="0.3" className="drop-shadow-sm" />
                    
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                      <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                      <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Nodes */}
                  {mindMapNodes.map((node) => (
                    <div
                      key={node.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group`}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                      <div className={`
                        ${node.type === 'main' ? 'w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32' : node.type === 'branch' ? 'w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24' : 'w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16'}
                        bg-gradient-to-r ${node.color} rounded-2xl flex items-center justify-center shadow-xl
                        hover:scale-110 transition-all duration-300 group-hover:shadow-2xl
                      `}>
                        <div className="text-center p-1 sm:p-2">
                          {node.type === 'main' && <Brain className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white mx-auto mb-1 sm:mb-2" />}
                          {node.type === 'branch' && <GitBranch className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-white mx-auto mb-1" />}
                          {node.type === 'leaf' && <Target className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white mx-auto mb-1" />}
                          <span className={`text-white font-semibold ${
                            node.type === 'main' ? 'text-xs sm:text-sm md:text-base' : node.type === 'branch' ? 'text-xs sm:text-sm' : 'text-xs'
                          } leading-tight`}>
                            {node.text}
                          </span>
                        </div>
                      </div>
                      
                      {/* Node Actions */}
                      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors">
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zoom Controls - Desktop */}
              <div className="hidden lg:flex absolute bottom-6 right-6 flex-col space-y-2">
                <button 
                  onClick={() => setZoomLevel(prev => Math.min(300, prev + 25))}
                  className="w-10 h-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-lg font-bold hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all shadow-lg text-slate-700 dark:text-slate-300"
                >
                  +
                </button>
                <div className="w-10 h-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-lg flex items-center justify-center text-xs font-medium shadow-lg text-slate-700 dark:text-slate-300">
                  {Math.round(zoomLevel)}%
                </div>
                <button 
                  onClick={() => setZoomLevel(prev => Math.max(25, prev - 25))}
                  className="w-10 h-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-lg font-bold hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all shadow-lg text-slate-700 dark:text-slate-300"
                >
                  -
                </button>
                <button 
                  onClick={resetView}
                  className="w-10 h-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-lg text-xs font-medium hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all shadow-lg text-slate-700 dark:text-slate-300"
                  title="Reset View"
                >
                  ⌂
                </button>
              </div>

              {/* Canvas Controls */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <button className="p-2 md:p-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-xl hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all">
                  <Layers className="w-4 h-4 md:w-5 md:h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <button className="p-2 md:p-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-xl hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all">
                  <Move className="w-4 h-4 md:w-5 md:h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              {/* Mobile Tools Panel */}
              <div className="lg:hidden absolute top-4 left-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-xl p-3">
                <div className="flex items-center space-x-2">
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`p-2 rounded-lg transition-all ${
                        selectedTool === tool.id
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <tool.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Theme Toggle (FAB) */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg border border-white/30 dark:border-slate-700/60 backdrop-blur bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 transition-colors"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </button>
      </div>
    </PageLayout>
  )
}

export default MindMapPage
