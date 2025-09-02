import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'

function VoiceInput({ onTranscript, onToggle, isListening }) {
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(finalTranscript + interimTranscript)
        if (finalTranscript) {
          onTranscript(finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        onToggle(false)
      }

      recognitionRef.current.onend = () => {
        onToggle(false)
      }
    }
  }, [onTranscript, onToggle])

  useEffect(() => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.start()
    } else if (!isListening && recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  const handleToggle = () => {
    if (isSupported) {
      onToggle(!isListening)
    }
  }

  if (!isSupported) {
    return (
      <button
        disabled
        className="p-3 text-slate-400 cursor-not-allowed rounded-lg"
        title="Speech recognition not supported in this browser"
      >
        <MicOff className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className={`p-3 rounded-lg transition-colors ${
          isListening
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
      </button>

      {isListening && (
        <div className="absolute bottom-full right-0 mb-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Listening... Speak your question
        </div>
      )}
    </div>
  )
}

export default VoiceInput
