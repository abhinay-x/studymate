import React, { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import PageLayout from '../components/layout/PageLayout'
import { 
  Brain, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  RotateCcw,
  CheckCircle,
  XCircle,
  Shuffle,
  BookOpen,
  Target
} from 'lucide-react'

const FlashcardsPage = () => {
  const { isDark } = useTheme()
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDeck, setSelectedDeck] = useState('all')

  const flashcardDecks = [
    { id: 'math', name: 'Mathematics', count: 45, color: 'from-blue-500 to-indigo-500' },
    { id: 'science', name: 'Science', count: 32, color: 'from-green-500 to-teal-500' },
    { id: 'history', name: 'History', count: 28, color: 'from-purple-500 to-pink-500' },
    { id: 'language', name: 'Languages', count: 67, color: 'from-orange-500 to-red-500' }
  ]

  const sampleCards = [
    { 
      id: 1, 
      question: "What is the derivative of x²?", 
      answer: "2x", 
      deck: 'math',
      difficulty: 'easy',
      lastReviewed: '2 days ago'
    },
    { 
      id: 2, 
      question: "What is photosynthesis?", 
      answer: "The process by which plants convert light energy into chemical energy", 
      deck: 'science',
      difficulty: 'medium',
      lastReviewed: '1 day ago'
    }
  ]

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 transition-all duration-500">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
              Smart Flashcards
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Master any subject with AI-powered spaced repetition and adaptive learning
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Decks & Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search & Filter */}
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search flashcards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                
                <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                  <Plus className="w-4 h-4" />
                  <span>Create New Deck</span>
                </button>
              </div>

              {/* Deck Selection */}
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Study Decks</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedDeck('all')}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedDeck === 'all' 
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 border-2 border-indigo-300 dark:border-indigo-600' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 dark:text-white">All Decks</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">172 cards</span>
                    </div>
                  </button>
                  
                  {flashcardDecks.map((deck) => (
                    <button
                      key={deck.id}
                      onClick={() => setSelectedDeck(deck.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        selectedDeck === deck.id 
                          ? 'bg-indigo-100 dark:bg-indigo-900/50 border-2 border-indigo-300 dark:border-indigo-600' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${deck.color}`}></div>
                          <span className="font-medium text-slate-900 dark:text-white">{deck.name}</span>
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{deck.count} cards</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Study Stats */}
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Today's Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Cards Reviewed</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">24/30</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Accuracy</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Study Time</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">45 min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Flashcard Display */}
            <div className="lg:col-span-2">
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
                {/* Card Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Card {currentCard + 1} of {sampleCards.length}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Difficulty: Medium</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Shuffle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <RotateCcw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Flashcard */}
                <div className="p-8">
                  <div 
                    className="relative w-full h-80 cursor-pointer perspective-1000"
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <div className={`absolute inset-0 w-full h-full transition-transform duration-700 preserve-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}>
                      {/* Front of card */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center p-8 backface-hidden shadow-xl">
                        <div className="text-center">
                          <BookOpen className="w-12 h-12 text-white/80 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-white mb-4">Question</h3>
                          <p className="text-xl text-white/90 leading-relaxed">
                            {sampleCards[currentCard]?.question}
                          </p>
                        </div>
                      </div>

                      {/* Back of card */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center p-8 backface-hidden rotate-y-180 shadow-xl">
                        <div className="text-center">
                          <CheckCircle className="w-12 h-12 text-white/80 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-white mb-4">Answer</h3>
                          <p className="text-xl text-white/90 leading-relaxed">
                            {sampleCards[currentCard]?.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      Click the card to reveal the answer
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setCurrentCard(Math.max(0, currentCard - 1))}
                      disabled={currentCard === 0}
                      className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>

                    {isFlipped && (
                      <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all">
                          <XCircle className="w-4 h-4" />
                          <span>Hard</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-3 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-all">
                          <Clock className="w-4 h-4" />
                          <span>Good</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all">
                          <CheckCircle className="w-4 h-4" />
                          <span>Easy</span>
                        </button>
                      </div>
                    )}

                    <button 
                      onClick={() => setCurrentCard(Math.min(sampleCards.length - 1, currentCard + 1))}
                      disabled={currentCard === sampleCards.length - 1}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default FlashcardsPage
