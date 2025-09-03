import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom'
import { 
  GraduationCap, 
  Bot, 
  Calendar, 
  Users, 
  Trophy, 
  Heart, 
  Camera, 
  Zap, 
  Star, 
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles,
  BookOpen,
  Brain,
  Target,
  Clock,
  Mail
} from 'lucide-react'
import LandingHeader from '../components/LandingHeader'
import LandingFooter from '../components/LandingFooter'

const LandingPageWrapper = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeFeature, setActiveFeature] = useState(0)

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleGetStarted = () => {
    navigate('/signup')
  }

  const features = [
    {
      id: 'ai-buddy',
      title: 'AI Study Buddy',
      icon: Bot,
      color: 'from-blue-500 to-cyan-500',
      description: 'Your personal AI companion that understands your learning style, detects stress, and provides 24/7 support.',
      benefits: ['Voice & text interaction', 'Stress detection', 'Personalized guidance', 'Motivational support'],
      demo: 'Chat with AI that adapts to your mood and learning pace'
    },
    {
      id: 'smart-scheduler',
      title: 'Smart Scheduler',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      description: 'AI analyzes your energy patterns and optimizes your study schedule for maximum productivity.',
      benefits: ['Energy-based scheduling', 'Productivity tracking', 'Break optimization', 'Goal management'],
      demo: 'Schedule automatically adapts to your peak performance hours'
    },
    {
      id: 'virtual-classroom',
      title: 'Virtual Classroom',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      description: 'Join live classes, collaborate with peers, and learn together in immersive virtual environments.',
      benefits: ['Live video sessions', 'Real-time collaboration', 'Interactive whiteboards', 'Peer learning'],
      demo: 'Experience college-level education from anywhere in the world'
    },
    {
      id: 'gamification',
      title: 'Gamification Hub',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      description: 'Level up your learning with achievements, leaderboards, and challenges that make studying addictive.',
      benefits: ['XP & level system', 'Achievement badges', 'Global leaderboards', 'Daily challenges'],
      demo: 'Turn studying into an engaging game with rewards and competition'
    },
    {
      id: 'wellness',
      title: 'Mental Health Monitor',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      description: 'AI monitors your wellbeing, suggests breaks, and provides mental health support.',
      benefits: ['Stress monitoring', 'Mood tracking', 'Wellness insights', 'Break reminders'],
      demo: 'Maintain perfect study-life balance with AI wellness coaching'
    },
    {
      id: 'ar-mode',
      title: 'AR Study Mode',
      icon: Camera,
      color: 'from-indigo-500 to-purple-500',
      description: 'Experience immersive learning with augmented reality for complex subjects.',
      benefits: ['3D visualizations', 'Interactive models', 'Virtual experiments', 'Immersive reading'],
      demo: 'Explore molecular structures and historical sites in 3D space'
    }
  ]

  const stats = [
    { label: 'Active Students', value: '50K+', icon: Users },
    { label: 'Study Hours', value: '2M+', icon: Clock },
    { label: 'Success Rate', value: '94%', icon: Target },
    { label: 'Universities', value: '500+', icon: GraduationCap }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Header */}
      <LandingHeader onGetStarted={handleGetStarted} />
      
      {/* Main Content */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Hero Section */}
        <div className="relative z-10" id="home">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-8">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  StudyMate
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
                Your AI-powered learning companion with revolutionary features that make 
                <span className="font-semibold text-cyan-400"> college from home </span>
                not just possible, but better than traditional education.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <button
                  onClick={handleGetStarted}
                  className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-semibold text-lg hover:bg-white/20 hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white/80 rounded-2xl font-semibold text-lg hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                    <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-slate-900/50 backdrop-blur-md relative" id="features">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Revolutionary Features That{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  Change Everything
                </span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Experience the future of education with AI-powered tools designed to solve every student's real-world problems.
              </p>
            </div>

            {/* Feature Showcase */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Feature List */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={feature.id}
                    onClick={() => setActiveFeature(index)}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-md border ${
                      activeFeature === index
                        ? 'bg-white/20 border-white/30 text-white shadow-2xl scale-105 transform'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/90 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        activeFeature === index ? 'bg-white/20' : 'bg-white/10'
                      }`}>
                        <feature.icon className={`w-6 h-6 ${
                          activeFeature === index ? 'text-white' : 'text-cyan-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className={`text-sm ${
                          activeFeature === index ? 'text-white/90' : 'text-white/70'
                        }`}>
                          {feature.description}
                        </p>
                      </div>
                      {activeFeature === index && (
                        <CheckCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature Demo */}
              <div className="lg:sticky lg:top-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${features[activeFeature].color}`}>
                      {React.createElement(features[activeFeature].icon, { className: "w-6 h-6 text-white" })}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{features[activeFeature].title}</h3>
                      <p className="text-slate-300">Interactive Demo</p>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
                    <p className="text-white/80 mb-4">{features[activeFeature].demo}</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {features[activeFeature].benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-white/70">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGetStarted}
                    className="w-full py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-semibold hover:bg-white/30 hover:shadow-2xl transition-all duration-300"
                  >
                    Try {features[activeFeature].title}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-md relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Education?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who are already experiencing the future of learning.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-semibold text-lg hover:bg-white/30 hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
              >
                <Star className="w-5 h-5" />
                <span>Start Learning Now</span>
              </button>
              
              <div className="text-white/80 text-sm">
                ✨ No credit card required • ✨ Free forever • ✨ Setup in 30 seconds
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <LandingFooter onGetStarted={handleGetStarted} />
    </div>
  )
}

export default LandingPageWrapper
