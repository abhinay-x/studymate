import React from 'react'
import { 
  GraduationCap, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone,
  Heart,
  Sparkles,
  ArrowRight,
  Bot,
  Calendar,
  Users,
  Trophy
} from 'lucide-react'

function LandingFooter({ onGetStarted }) {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'AI Study Buddy', href: '#ai-buddy', icon: Bot },
        { label: 'Smart Scheduler', href: '#scheduler', icon: Calendar },
        { label: 'Virtual Classroom', href: '#classroom', icon: Users },
        { label: 'Gamification', href: '#gaming', icon: Trophy }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#about' },
        { label: 'Careers', href: '#careers' },
        { label: 'Press Kit', href: '#press' },
        { label: 'Blog', href: '#blog' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#docs' },
        { label: 'API Reference', href: '#api' },
        { label: 'Tutorials', href: '#tutorials' },
        { label: 'Community', href: '#community' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#help' },
        { label: 'Contact Us', href: '#contact' },
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' }
      ]
    }
  ]

  const socialLinks = [
    { icon: Github, href: '#github', label: 'GitHub' },
    { icon: Twitter, href: '#twitter', label: 'Twitter' },
    { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@studymate.ai', label: 'Email' }
  ]

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900/50 to-indigo-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          {/* Top Section with CTA */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl mb-6 shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already experiencing the future of education with StudyMate.
            </p>
            <button
              onClick={() => onGetStarted?.()}
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 space-x-3"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-white font-semibold text-lg mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group flex items-center text-white/70 hover:text-cyan-400 transition-colors duration-200 text-sm"
                      >
                        {link.icon && (
                          <link.icon className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        )}
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-12">
            <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Headquarters</p>
                  <p className="text-white/70 text-sm">Silicon Valley, CA</p>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Support</p>
                  <p className="text-white/70 text-sm">24/7 Available</p>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-white/70 text-sm">hello@studymate.ai</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
            {/* Logo and Copyright */}
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">StudyMate</h3>
                  <p className="text-white/60 text-xs">AI-Powered Learning Platform</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                  title={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-8 border-t border-white/10 mt-8">
            <p className="text-white/60 text-sm flex items-center justify-center space-x-2">
              <span>© {currentYear} StudyMate. Made with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>for students worldwide.</span>
            </p>
            <p className="text-white/40 text-xs mt-2">
              Revolutionizing education through AI • Empowering students everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter
