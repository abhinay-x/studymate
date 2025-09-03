import { useState } from 'react'
import { Camera, Scan, Zap, Eye, Layers, Box, BookOpen, Play, Pause, RotateCcw } from 'lucide-react'

function ARStudyMode({ user }) {
  const [isARActive, setIsARActive] = useState(false)
  const [selectedMode, setSelectedMode] = useState('3d-models')
  const [isScanning, setIsScanning] = useState(false)

  // Mock AR study modes
  const arModes = [
    {
      id: '3d-models',
      title: '3D Model Visualization',
      description: 'View complex structures in 3D space',
      icon: Box,
      subjects: ['Biology', 'Chemistry', 'Physics', 'Anatomy']
    },
    {
      id: 'text-overlay',
      title: 'Smart Text Overlay',
      description: 'Get instant explanations on real objects',
      icon: Eye,
      subjects: ['History', 'Art', 'Geography', 'Literature']
    },
    {
      id: 'virtual-lab',
      title: 'Virtual Laboratory',
      description: 'Conduct experiments safely in AR',
      icon: Layers,
      subjects: ['Chemistry', 'Physics', 'Biology']
    },
    {
      id: 'immersive-reading',
      title: 'Immersive Reading',
      description: 'Transform text into interactive experiences',
      icon: BookOpen,
      subjects: ['Literature', 'History', 'Philosophy']
    }
  ]

  // Mock AR content
  const mockARContent = {
    '3d-models': {
      title: 'Human Heart Anatomy',
      description: 'Explore the cardiovascular system in detail',
      interactions: ['Rotate', 'Zoom', 'Cross-section', 'Animation'],
      currentView: 'External Structure'
    },
    'text-overlay': {
      title: 'Ancient Rome Architecture',
      description: 'Point camera at historical images for details',
      detectedObjects: ['Colosseum', 'Roman Forum', 'Pantheon'],
      currentFocus: 'Colosseum'
    },
    'virtual-lab': {
      title: 'Chemical Reactions Lab',
      description: 'Mix virtual chemicals safely',
      experiments: ['Acid-Base Reactions', 'Combustion', 'Precipitation'],
      currentExperiment: 'Acid-Base Reactions'
    },
    'immersive-reading': {
      title: 'Shakespeare\'s Globe Theatre',
      description: 'Experience Hamlet in its original setting',
      scenes: ['Act 1 Scene 1', 'Balcony Scene', 'Final Duel'],
      currentScene: 'Act 1 Scene 1'
    }
  }

  const startARSession = () => {
    setIsARActive(true)
    setIsScanning(true)
    // Simulate camera initialization
    setTimeout(() => {
      setIsScanning(false)
    }, 2000)
  }

  const stopARSession = () => {
    setIsARActive(false)
    setIsScanning(false)
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-indigo-600" />
              AR Study Mode
            </h3>
            <p className="text-sm text-slate-600">Immersive learning with augmented reality</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-3 py-1 bg-indigo-100 rounded-full">
              <Zap className="w-3 h-3 text-indigo-600" />
              <span className="text-xs font-medium text-indigo-700">AR Powered</span>
            </div>
          </div>
        </div>

        {!isARActive && (
          <div className="grid grid-cols-2 gap-3">
            {arModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedMode === mode.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <mode.icon className={`w-5 h-5 ${
                    selectedMode === mode.id ? 'text-indigo-600' : 'text-slate-600'
                  }`} />
                  <span className="font-medium text-sm text-slate-900">{mode.title}</span>
                </div>
                <p className="text-xs text-slate-600">{mode.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* AR Interface */}
      <div className="flex-1 relative">
        {!isARActive ? (
          // Mode Selection & Setup
          <div className="p-6 h-full flex flex-col justify-center">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {React.createElement(arModes.find(m => m.id === selectedMode)?.icon || Camera, {
                  className: "w-12 h-12 text-indigo-600"
                })}
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">
                {arModes.find(m => m.id === selectedMode)?.title}
              </h4>
              <p className="text-slate-600 mb-4">
                {arModes.find(m => m.id === selectedMode)?.description}
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {arModes.find(m => m.id === selectedMode)?.subjects.map((subject) => (
                  <span key={subject} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={startARSession}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Camera className="w-5 h-5" />
              <span>Start AR Session</span>
            </button>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Eye className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Camera Permission Required</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Allow camera access to enable AR features. Your privacy is protected - no data is stored.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Active AR Session
          <div className="relative h-full bg-black">
            {/* Simulated Camera Feed */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              {isScanning ? (
                <div className="text-center">
                  <div className="w-32 h-32 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white text-lg font-medium">Initializing AR...</p>
                  <p className="text-slate-300 text-sm">Setting up camera and tracking</p>
                </div>
              ) : (
                <div className="text-center">
                  {/* AR Content Overlay */}
                  <div className="relative">
                    <div className="w-64 h-64 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <div className="text-white text-center">
                        <Box className="w-16 h-16 mx-auto mb-2" />
                        <p className="font-semibold">{mockARContent[selectedMode]?.title}</p>
                      </div>
                    </div>
                    
                    {/* AR UI Elements */}
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      TRACKING
                    </div>
                  </div>
                  
                  <div className="text-white mb-4">
                    <h4 className="text-xl font-semibold mb-2">{mockARContent[selectedMode]?.title}</h4>
                    <p className="text-slate-300">{mockARContent[selectedMode]?.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* AR Controls Overlay */}
            {!isScanning && (
              <>
                {/* Top Controls */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <div className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-sm">
                    {mockARContent[selectedMode]?.currentView || 'AR Mode Active'}
                  </div>
                  <button
                    onClick={stopARSession}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Exit AR
                  </button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-center space-x-4 mb-3">
                      <button className="p-3 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-colors">
                        <RotateCcw className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-colors">
                        <Play className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-colors">
                        <Scan className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Interaction Options */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {mockARContent[selectedMode]?.interactions?.map((interaction) => (
                        <button
                          key={interaction}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition-colors"
                        >
                          {interaction}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Side Info Panel */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 backdrop-blur-sm text-white p-4 rounded-lg max-w-xs">
                  <h5 className="font-semibold mb-2">AR Information</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Object Detected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Tracking Stable</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Interactive Mode</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      {!isARActive && (
        <div className="p-4 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <h5 className="font-medium text-slate-900 mb-2">AR Study Tips</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
              <div>• Ensure good lighting for best tracking</div>
              <div>• Use gestures to interact with 3D objects</div>
              <div>• Point camera at textbooks for instant help</div>
              <div>• Voice commands work in AR mode</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ARStudyMode
