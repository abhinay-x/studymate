import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'
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
  Trophy,
  ExternalLink
} from 'lucide-react'

const UniversalFooter = () => {
  const { isDark } = useTheme()
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'AI Study Buddy', href: '/features/ai-buddy', icon: Bot },
        { label: 'Smart Scheduler', href: '/features/scheduler', icon: Calendar },
        { label: 'Virtual Classroom', href: '/features/classroom', icon: Users },
        { label: 'Gamification', href: '/features/gaming', icon: Trophy }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press Kit', href: '/press' },
        { label: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'API Reference', href: '/api' },
        { label: 'Tutorials', href: '/tutorials' },
        { label: 'Community', href: '/community' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' }
      ]
    }
  ]

  const socialLinks = [
    { icon: Github, href: 'https://github.com/studymate', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/studymate', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/studymate', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@studymate.ai', label: 'Email' }
  ]

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group flex items-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm"
                    >
                      {link.icon && (
                        <link.icon className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      )}
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.label}
                      </span>
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-12 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start space-y-3 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-medium">Headquarters</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Silicon Valley, CA</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start space-y-3 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-medium">Support</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">24/7 Available</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start space-y-3 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-medium">Email</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">hello@studymate.ai</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
          {/* Logo and Copyright */}
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white font-bold text-lg">StudyMate</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs">AI-Powered Learning Platform</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-110 transition-all duration-300"
                title={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-800 mt-8">
          <p className="text-slate-600 dark:text-slate-400 text-sm flex items-center justify-center space-x-2">
            <span>© {currentYear} StudyMate. Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>for students worldwide.</span>
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-xs mt-2">
            Revolutionizing education through AI • Empowering students everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}

export default UniversalFooter
