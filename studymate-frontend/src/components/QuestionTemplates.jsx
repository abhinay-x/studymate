import { useState } from 'react'
import { MessageSquare, BookOpen, Brain, Target, Lightbulb } from 'lucide-react'

function QuestionTemplates({ onSelectTemplate, selectedDocument }) {
  const [selectedCategory, setSelectedCategory] = useState('General')

  const templateCategories = {
    'General': {
      icon: <MessageSquare className="w-4 h-4" />,
      templates: [
        "What are the main concepts in this document?",
        "Can you summarize the key points?",
        "What are the most important takeaways?",
        "Explain this topic in simple terms",
        "What should I focus on when studying this?"
      ]
    },
    'Analysis': {
      icon: <Brain className="w-4 h-4" />,
      templates: [
        "What are the strengths and weaknesses of [concept]?",
        "How does [topic A] compare to [topic B]?",
        "What are the implications of [concept]?",
        "What evidence supports [argument]?",
        "What are the limitations of this approach?"
      ]
    },
    'Application': {
      icon: <Target className="w-4 h-4" />,
      templates: [
        "How can I apply [concept] in real life?",
        "What are some examples of [concept]?",
        "When would I use [method/technique]?",
        "What problems does [solution] solve?",
        "How does this relate to [other topic]?"
      ]
    },
    'Understanding': {
      icon: <Lightbulb className="w-4 h-4" />,
      templates: [
        "Why is [concept] important?",
        "What causes [phenomenon]?",
        "How does [process] work?",
        "What is the purpose of [element]?",
        "What would happen if [scenario]?"
      ]
    },
    'Study': {
      icon: <BookOpen className="w-4 h-4" />,
      templates: [
        "What are the key terms I should memorize?",
        "What questions might appear on an exam?",
        "What are common misconceptions about [topic]?",
        "How should I organize my notes on this topic?",
        "What are the prerequisites for understanding [concept]?"
      ]
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-medium text-slate-900 mb-3">🎯 Question Templates</h3>
        
        {/* Category Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-2">
          {Object.entries(templateCategories).map(([category, data]) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {data.icon}
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 max-h-64 overflow-y-auto">
        <div className="space-y-2">
          {templateCategories[selectedCategory].templates.map((template, index) => (
            <button
              key={index}
              onClick={() => onSelectTemplate(template)}
              className="w-full text-left p-3 text-sm bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-300 rounded-lg transition-colors"
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      {selectedDocument && (
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-600 mb-2">Document-specific suggestions:</p>
          <div className="space-y-1">
            <button
              onClick={() => onSelectTemplate(`What are the main topics covered in ${selectedDocument.name}?`)}
              className="w-full text-left p-2 text-xs bg-white hover:bg-primary-50 border border-slate-200 hover:border-primary-300 rounded transition-colors"
            >
              What are the main topics covered in {selectedDocument.name}?
            </button>
            <button
              onClick={() => onSelectTemplate(`Explain the key concepts from ${selectedDocument.name}`)}
              className="w-full text-left p-2 text-xs bg-white hover:bg-primary-50 border border-slate-200 hover:border-primary-300 rounded transition-colors"
            >
              Explain the key concepts from {selectedDocument.name}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionTemplates
