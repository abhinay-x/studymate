import React, { useState } from 'react'
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
import LandingHeader from './LandingHeader'
import LandingFooter from './LandingFooter'

function LandingPage({ onGetStarted }) {
  const [activeFeature, setActiveFeature] = useState(0)

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
      <LandingHeader onGetStarted={onGetStarted} />
      
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
                onClick={() => onGetStarted?.(features[activeFeature].id)}
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
                  onClick={() => onGetStarted?.(features[activeFeature].id)}
                  className="w-full py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-semibold hover:bg-white/30 hover:shadow-2xl transition-all duration-300"
                >
                  Try {features[activeFeature].title}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20 bg-slate-800/50 backdrop-blur-md relative" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why StudyMate Will{' '}
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Win the Hackathon
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI-First Approach',
                description: 'Every feature is powered by advanced AI that learns and adapts to each student\'s unique needs.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Target,
                title: 'Real Problem Solving',
                description: 'Addresses actual student pain points: stress, scheduling, motivation, and remote learning challenges.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Zap,
                title: 'Revolutionary Features',
                description: 'AR learning, mental health monitoring, and gamification - features that don\'t exist elsewhere.',
                color: 'from-yellow-500 to-orange-500'
              }
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-white/80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-gradient-to-br from-slate-900 via-indigo-900/50 to-purple-900/50 backdrop-blur-md relative" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple{' '}
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Choose the perfect plan for your learning journey. Start free and upgrade as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <div className="text-4xl font-bold text-cyan-400 mb-6">$0<span className="text-lg text-white/60">/month</span></div>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Basic AI Study Buddy
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    5 Documents Upload
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Basic Analytics
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Community Support
                  </li>
                </ul>
                <button
                  onClick={() => onGetStarted?.()}
                  className="w-full py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300"
                >
                  Get Started Free
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-cyan-500/20 to-purple-600/20 backdrop-blur-md rounded-3xl border border-cyan-400/30 p-8 hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="text-4xl font-bold text-cyan-400 mb-6">$19<span className="text-lg text-white/60">/month</span></div>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Advanced AI Study Buddy
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Unlimited Documents
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    AR Study Mode
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Mental Health Monitor
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Priority Support
                  </li>
                </ul>
                <button
                  onClick={() => onGetStarted?.()}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                >
                  Start Pro Trial
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-cyan-400 mb-6">$99<span className="text-lg text-white/60">/month</span></div>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Virtual Classrooms
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Advanced Analytics
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Custom Integrations
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    24/7 Dedicated Support
                  </li>
                </ul>
                <button
                  onClick={() => onGetStarted?.()}
                  className="w-full py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-slate-900/50 backdrop-blur-md relative" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get in{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                Touch
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-cyan-400 transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-cyan-400 transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Message</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Send Message</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Email</p>
                      <p className="text-white/70">hello@studymate.ai</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Community</p>
                      <p className="text-white/70">Join our Discord server</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Support</p>
                      <p className="text-white/70">24/7 customer support</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Office Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/80">Monday - Friday</span>
                    <span className="text-white">9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Saturday</span>
                    <span className="text-white">10:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Sunday</span>
                    <span className="text-white">Closed</span>
                  </div>
                </div>
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
              onClick={onGetStarted}
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
      <LandingFooter onGetStarted={onGetStarted} />
    </div>
  )
}

export default LandingPage
