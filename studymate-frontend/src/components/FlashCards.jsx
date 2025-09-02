import { useState, useEffect } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight, Shuffle, BookOpen, Brain, Check, X } from 'lucide-react'

function FlashCards({ documents, questions = [] }) {
  const [cards, setCards] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studyMode, setStudyMode] = useState('review') // review, quiz
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, total: 0 })

  // Generate flashcards from Q&A history
  useEffect(() => {
    const generatedCards = questions.map((q, index) => ({
      id: index,
      question: q.question,
      answer: q.answer,
      source: q.source || 'Generated from Q&A',
      difficulty: q.difficulty || 'medium',
      mastered: false
    }))

    // Add some sample cards if no questions available
    if (generatedCards.length === 0) {
      const sampleCards = [
        {
          id: 1,
          question: "What is machine learning?",
          answer: "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.",
          source: "ML Textbook - Chapter 1",
          difficulty: "easy",
          mastered: false
        },
        {
          id: 2,
          question: "What is overfitting in machine learning?",
          answer: "Overfitting occurs when a model learns the training data too well, including noise and outliers, resulting in poor performance on new, unseen data.",
          source: "ML Textbook - Chapter 5",
          difficulty: "medium",
          mastered: false
        },
        {
          id: 3,
          question: "What is the bias-variance tradeoff?",
          answer: "The bias-variance tradeoff is the balance between a model's ability to minimize bias (error from oversimplifying) and variance (error from sensitivity to small fluctuations in training data).",
          source: "Advanced ML - Chapter 3",
          difficulty: "hard",
          mastered: false
        }
      ]
      setCards(sampleCards)
    } else {
      setCards(generatedCards)
    }
  }, [questions])

  const currentCard = cards[currentCardIndex]

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cards.length)
    setIsFlipped(false)
  }

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length)
    setIsFlipped(false)
  }

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  const markAnswer = (correct) => {
    setStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
      total: prev.total + 1
    }))

    // Update card mastery
    setCards(prev => prev.map(card => 
      card.id === currentCard.id 
        ? { ...card, mastered: correct }
        : card
    ))

    nextCard()
  }

  const resetStats = () => {
    setStats({ correct: 0, incorrect: 0, total: 0 })
    setCards(prev => prev.map(card => ({ ...card, mastered: false })))
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-secondary-100 text-secondary-700'
      case 'medium': return 'bg-accent-100 text-accent-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  if (!currentCard) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Flash Cards Available</h3>
        <p className="text-slate-600 mb-4">Flash cards will be automatically generated from your Q&A sessions.</p>
        <p className="text-sm text-slate-500">Start asking questions about your documents to create flash cards!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary-600" />
            <span>Flash Cards</span>
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setStudyMode(studyMode === 'review' ? 'quiz' : 'review')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                studyMode === 'quiz'
                  ? 'bg-accent-100 text-accent-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {studyMode === 'quiz' ? 'Quiz Mode' : 'Review Mode'}
            </button>
          </div>
        </div>

        {/* Progress and Stats */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">
            Card {currentCardIndex + 1} of {cards.length}
          </span>
          {studyMode === 'quiz' && stats.total > 0 && (
            <div className="flex items-center space-x-4">
              <span className="text-secondary-600">✓ {stats.correct}</span>
              <span className="text-red-600">✗ {stats.incorrect}</span>
              <span className="text-slate-600">
                {Math.round((stats.correct / stats.total) * 100)}% correct
              </span>
            </div>
          )}
        </div>

        <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div 
          className="relative min-h-64 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Front of card (Question) */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6 border-2 border-dashed border-primary-200">
              <div className="flex items-start justify-between mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentCard.difficulty)}`}>
                  {currentCard.difficulty}
                </span>
                <span className="text-xs text-slate-500">Click to flip</span>
              </div>
              
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Question:</h4>
                  <p className="text-slate-700 leading-relaxed">{currentCard.question}</p>
                </div>
              </div>
            </div>

            {/* Back of card (Answer) */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-secondary-50 to-accent-50 rounded-lg p-6 border-2 border-dashed border-secondary-200">
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs text-slate-500">{currentCard.source}</span>
                <span className="text-xs text-slate-500">Click to flip back</span>
              </div>
              
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Answer:</h4>
                  <p className="text-slate-700 leading-relaxed">{currentCard.answer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Mode Controls */}
        {studyMode === 'quiz' && isFlipped && (
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => markAnswer(false)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Incorrect</span>
            </button>
            <button
              onClick={() => markAnswer(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Correct</span>
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <button
            onClick={prevCard}
            className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            <button
              onClick={shuffleCards}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Shuffle cards"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Flip card"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {studyMode === 'quiz' && (
              <button
                onClick={resetStats}
                className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          <button
            onClick={nextCard}
            className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default FlashCards
