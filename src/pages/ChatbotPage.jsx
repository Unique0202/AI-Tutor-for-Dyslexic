import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff, RefreshCw, Brain, User, WifiOff } from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'
import { sendMessage } from '../chatbotService'

const SUGGESTIONS = [
  'What is dyslexia?',
  'Give me a reading tip',
  'How do I improve my spelling?',
  'How does Spell Quest work?',
  'Why is reading hard for me?',
  'Tell me about Word Sounds',
]

const WELCOME = "Hi! I am your Learning Helper. I can answer questions about dyslexia, reading, spelling, and the NeuroLearn games. What would you like to know?"

const TypingDots = () => (
  <div className="flex items-center gap-1 px-1">
    {[0, 1, 2].map(i => (
      <motion.span
        key={i}
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: 'var(--color-primary)' }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
      />
    ))}
  </div>
)

const ChatbotPage = () => {
  const [messages, setMessages] = useState([{ role: 'bot', content: WELCOME, time: new Date() }])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [listening, setListening] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const { speak, settings, reducedMotion } = useAccessibility()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [messages, thinking])

  const addMessage = (role, content) =>
    setMessages(prev => [...prev, { role, content, time: new Date() }])

  const handleSubmit = async (e) => {
    e?.preventDefault()
    const text = input.trim()
    if (!text || thinking) return

    addMessage('user', text)
    setInput('')
    setThinking(true)

    try {
      const { text: reply, offline } = await sendMessage(text, messages)
      setIsOffline(offline)
      addMessage('bot', reply)
      if (settings.ttsEnabled) speak(reply)
    } catch {
      addMessage('bot', "Sorry, I could not connect right now. Please try again in a moment.")
    } finally {
      setThinking(false)
      inputRef.current?.focus()
    }
  }

  const handleSuggestion = (s) => {
    setInput(s)
    inputRef.current?.focus()
  }

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.lang = 'en-US'
    rec.onstart = () => setListening(true)
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    rec.onresult = e => setInput(e.results[0][0].transcript)
    rec.start()
  }

  const reset = () => {
    setMessages([{ role: 'bot', content: WELCOME, time: new Date() }])
    setInput('')
    setIsOffline(false)
  }

  const fmt = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-8 flex flex-col"
      style={{ minHeight: 'calc(100vh - 5rem)', backgroundColor: 'var(--color-bg)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1
            className="text-2xl md:text-3xl font-extrabold mb-1"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            Learning Helper
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Ask about dyslexia, reading, spelling, or the games
          </p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border-2 cursor-pointer transition-colors duration-150"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-muted)',
            borderColor: 'rgba(79,70,229,0.2)',
            backgroundColor: '#fff',
          }}
          aria-label="Reset conversation"
        >
          <RefreshCw size={13} /> New chat
        </button>
      </div>

      {/* Offline banner */}
      {isOffline && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-4 text-sm font-bold"
          style={{ backgroundColor: '#FEF9C3', color: '#92400E', border: '2px solid #FDE68A' }}
        >
          <WifiOff size={15} />
          AI is offline — run <code className="mx-1 px-1.5 py-0.5 rounded" style={{ backgroundColor: '#FDE68A' }}>npm run dev</code> in your terminal to connect the AI server.
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 clay-card p-5 flex flex-col gap-4 overflow-y-auto mb-5"
        style={{ minHeight: '380px', maxHeight: '56vh' }}
        aria-live="polite"
        aria-label="Conversation"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isBot = msg.role === 'bot'
            return (
              <motion.div
                key={i}
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-end gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: isBot ? 'var(--color-primary)' : 'var(--color-bg-muted)' }}
                  aria-hidden="true"
                >
                  {isBot
                    ? <Brain size={15} color="#fff" />
                    : <User size={15} style={{ color: 'var(--color-text-muted)' }} />
                  }
                </div>

                {/* Bubble */}
                <div className={`flex flex-col gap-1 max-w-[80%] ${isBot ? 'items-start' : 'items-end'}`}>
                  <div
                    className="px-4 py-3 rounded-2xl text-base leading-relaxed"
                    style={{
                      backgroundColor: isBot ? 'var(--color-bg-muted)' : 'var(--color-primary)',
                      color: isBot ? 'var(--color-text)' : '#fff',
                      borderBottomLeftRadius: isBot ? '4px' : '1rem',
                      borderBottomRightRadius: isBot ? '1rem' : '4px',
                    }}
                  >
                    {msg.content}
                  </div>
                  <span className="text-xs px-1" style={{ color: 'var(--color-text-muted)' }}>
                    {fmt(msg.time)}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        {thinking && (
          <motion.div
            className="flex items-end gap-3"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--color-primary)' }}
              aria-hidden="true"
            >
              <Brain size={15} color="#fff" />
            </div>
            <div
              className="px-4 py-3 rounded-2xl"
              style={{ backgroundColor: 'var(--color-bg-muted)', borderBottomLeftRadius: '4px' }}
            >
              <TypingDots />
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => handleSuggestion(s)}
            className="text-xs font-bold px-3 py-2 rounded-xl border-2 cursor-pointer transition-all duration-150"
            style={{
              fontFamily: 'var(--font-heading)',
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              backgroundColor: '#fff',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 clay-card px-4 py-3"
      >
        {settings.sttEnabled && (
          <button
            type="button"
            onClick={startListening}
            aria-label={listening ? 'Stop listening' : 'Start voice input'}
            className="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer transition-colors duration-150 shrink-0"
            style={{
              backgroundColor: listening ? 'var(--color-danger)' : 'var(--color-bg-muted)',
              color: listening ? '#fff' : 'var(--color-text-muted)',
            }}
          >
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        )}

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          placeholder="Ask about reading, spelling, or dyslexia..."
          disabled={thinking}
          className="flex-1 bg-transparent outline-none text-base"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
          aria-label="Your message"
        />

        <button
          type="submit"
          disabled={!input.trim() || thinking}
          aria-label="Send message"
          className="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-150 shrink-0"
          style={{
            backgroundColor: input.trim() && !thinking ? 'var(--color-primary)' : 'var(--color-bg-muted)',
            color: input.trim() && !thinking ? '#fff' : 'var(--color-text-muted)',
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}

export default ChatbotPage
