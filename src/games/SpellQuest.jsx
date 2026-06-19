import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Star } from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'
import GameWrapper from '../components/GameWrapper'

const WORDS = {
  1: [
    { word: 'cat', hint: 'A furry pet that meows', emoji: '🐱' },
    { word: 'dog', hint: 'A pet that barks',       emoji: '🐶' },
    { word: 'sun', hint: 'Shines in the day sky',  emoji: '☀️' },
    { word: 'hat', hint: 'Worn on your head',       emoji: '🎩' },
    { word: 'bed', hint: 'You sleep on it',         emoji: '🛏️' },
    { word: 'pen', hint: 'Used for writing',        emoji: '✏️' },
    { word: 'cup', hint: 'You drink from it',       emoji: '☕' },
    { word: 'bus', hint: 'A big vehicle',           emoji: '🚌' },
  ],
  2: [
    { word: 'fish', hint: 'Lives in water, has fins', emoji: '🐟' },
    { word: 'book', hint: 'You read stories in it',   emoji: '📚' },
    { word: 'cake', hint: 'Sweet dessert for birthdays', emoji: '🎂' },
    { word: 'star', hint: 'Twinkles in the night sky',  emoji: '⭐' },
    { word: 'rain', hint: 'Falls from clouds',          emoji: '🌧️' },
    { word: 'bird', hint: 'Flies with wings',           emoji: '🐦' },
    { word: 'moon', hint: 'Shines at night',            emoji: '🌙' },
    { word: 'tree', hint: 'Has leaves and branches',    emoji: '🌳' },
  ],
  3: [
    { word: 'house',  hint: 'Where people live',       emoji: '🏠' },
    { word: 'apple',  hint: 'A red or green fruit',    emoji: '🍎' },
    { word: 'water',  hint: 'You drink it when thirsty', emoji: '💧' },
    { word: 'beach',  hint: 'Sandy place by the ocean', emoji: '🏖️' },
    { word: 'tiger',  hint: 'A big striped cat',       emoji: '🐯' },
    { word: 'music',  hint: 'Sounds that make songs',  emoji: '🎵' },
    { word: 'happy',  hint: 'A feeling of joy',        emoji: '😊' },
    { word: 'cloud',  hint: 'Floats in the sky',       emoji: '☁️' },
  ],
}

const QUESTIONS = 5
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)

const letterMatch = (typed, target) => {
  let hits = 0
  for (let i = 0; i < Math.min(typed.length, target.length); i++) {
    if (typed[i] === target[i]) hits++
  }
  return hits
}

// ─── Letter feedback row ────────────────────────────────────────────────────
const LetterBoxes = ({ word, typed }) => (
  <div className="flex justify-center gap-2 my-2">
    {word.split('').map((ch, i) => {
      const userCh = typed[i] || ''
      const filled = userCh !== ''
      const correct = userCh === ch
      return (
        <div
          key={i}
          className="w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-lg border-2"
          style={{
            fontFamily: 'var(--font-heading)',
            borderColor: !filled ? 'rgba(79,70,229,0.2)'
              : correct ? '#22C55E' : '#EF4444',
            backgroundColor: !filled ? 'var(--color-bg-muted)'
              : correct ? '#DCFCE7' : '#FEF2F2',
            color: filled ? (correct ? '#16A34A' : '#DC2626') : 'var(--color-text-muted)',
          }}
        >
          {userCh.toUpperCase()}
        </div>
      )
    })}
  </div>
)

// ─── Inner game ────────────────────────────────────────────────────────────
const SpellQuestGame = ({ level, onComplete }) => {
  const [qIndex, setQIndex] = useState(0)
  const [queue] = useState(() => shuffle(WORDS[level] || WORDS[1]).slice(0, QUESTIONS))
  const [typed, setTyped] = useState('')
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong' | 'hint'
  const [hintShown, setHintShown] = useState(false)
  const [wrongCount, setWrongCount] = useState(0)
  const inputRef = useRef(null)
  const mountedRef = useRef(true)
  const { speak, reducedMotion } = useAccessibility()

  // Cancel speech on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      window.speechSynthesis.cancel()
    }
  }, [])

  const wordData = queue[qIndex]

  const speakWord = useCallback(() => {
    speak(wordData.word)
  }, [wordData.word, speak])

  // Auto-play audio when word changes — phoneme-first
  useEffect(() => {
    setTyped('')
    setFeedback(null)
    setHintShown(false)
    speak(`Spell the word: ${wordData.hint}. Listen carefully…`)
    const timer = setTimeout(speakWord, 1800)
    inputRef.current?.focus()
    return () => clearTimeout(timer)
  }, [qIndex, wordData.hint, speak, speakWord])

  const handleCheck = () => {
    if (!typed.trim()) return
    const cleaned = typed.trim().toLowerCase()
    if (cleaned === wordData.word) {
      setFeedback('correct')
      speak(`${wordData.word}! Correct! Well done!`)
      setTimeout(() => {
        if (!mountedRef.current) return
        if (qIndex + 1 >= QUESTIONS) {
          const stars = wrongCount === 0 ? 3 : wrongCount <= 2 ? 2 : 1
          onComplete(stars, `You spelled all ${QUESTIONS} words! Fantastic!`)
        } else {
          setQIndex(i => i + 1)
        }
      }, 1500)
    } else {
      setWrongCount(w => w + 1)
      const hits = letterMatch(cleaned, wordData.word)
      const msg = hits > 0
        ? `Almost! ${hits} letter${hits > 1 ? 's' : ''} in the right place. Try again!`
        : `Not quite — try again. Listen to the word.`
      setFeedback('wrong')
      speak(msg)
      setTimeout(() => {
        if (!mountedRef.current) return
        setFeedback(null)
        setTyped('')
        speakWord()
        inputRef.current?.focus()
      }, 2000)
    }
  }

  const showHint = () => {
    setHintShown(true)
    speak(`Hint: ${wordData.hint}. The word starts with ${wordData.word[0].toUpperCase()}.`)
    setFeedback('hint')
  }

  return (
    <div className="max-w-md mx-auto flex flex-col gap-5 py-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold shrink-0" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-muted)' }}>
          {qIndex + 1} / {QUESTIONS}
        </span>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
            animate={{ width: `${(qIndex / QUESTIONS) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Word card */}
      <motion.div
        key={qIndex}
        className="clay-card p-7 flex flex-col items-center gap-4 text-center"
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span style={{ fontSize: '4rem', lineHeight: 1 }}>{wordData.emoji}</span>
        <p className="text-base" style={{ color: 'var(--color-text-muted)', maxWidth: '30ch' }}>
          {wordData.hint}
        </p>
        <button
          onClick={speakWord}
          className="btn-primary flex items-center gap-2 py-3 px-6"
        >
          <Volume2 size={18} /> Listen to the word
        </button>
      </motion.div>

      {/* Letter boxes */}
      <LetterBoxes word={wordData.word} typed={typed} />

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={typed}
        onChange={e => setTyped(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleCheck()}
        placeholder={`Type the word (${wordData.word.length} letters)`}
        maxLength={wordData.word.length + 3}
        disabled={feedback === 'correct'}
        className="w-full text-center text-2xl font-extrabold py-4 px-5 rounded-2xl border-3 outline-none"
        style={{
          fontFamily: 'var(--font-heading)',
          backgroundColor: 'var(--color-bg-card)',
          border: '3px solid rgba(79,70,229,0.2)',
          color: 'var(--color-text)',
          letterSpacing: '0.15em',
        }}
        aria-label="Type your spelling here"
      />

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-3 px-5 rounded-2xl font-bold text-sm"
            style={{
              fontFamily: 'var(--font-heading)',
              backgroundColor: feedback === 'correct' ? '#DCFCE7'
                : feedback === 'hint' ? '#FEF9C3'
                : '#FEF2F2',
              color: feedback === 'correct' ? '#16A34A'
                : feedback === 'hint' ? '#92400E'
                : '#DC2626',
            }}
          >
            {feedback === 'correct' && `${wordData.word.toUpperCase()}! Correct!`}
            {feedback === 'wrong' && `Not quite — listen again and try!`}
            {feedback === 'hint' && `Hint: starts with ${wordData.word[0].toUpperCase()} — ${wordData.word.length} letters`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      {hintShown && feedback !== 'hint' && (
        <div
          className="text-center py-2 px-4 rounded-xl text-sm"
          style={{ backgroundColor: '#FEF9C3', color: '#92400E', fontFamily: 'var(--font-body)' }}
        >
          Starts with <strong>{wordData.word[0].toUpperCase()}</strong> — {wordData.word.length} letters total
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={showHint}
          className="btn-secondary flex items-center gap-2 py-2 px-4"
          style={{ minHeight: '44px', fontSize: '0.875rem' }}
        >
          <Star size={15} /> Get a hint
        </button>
        <button
          onClick={handleCheck}
          disabled={!typed.trim() || feedback === 'correct'}
          className="btn-primary py-2 px-6"
          style={{ minHeight: '44px', fontSize: '0.875rem' }}
        >
          Check spelling
        </button>
      </div>
    </div>
  )
}

// ─── Public component ──────────────────────────────────────────────────────
const SpellQuest = () => {
  const [level, setLevel] = useState(1)

  return (
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="flex gap-2 justify-center mb-5">
        {[1, 2, 3].map(l => (
          <button
            key={l}
            onClick={() => { window.speechSynthesis.cancel(); setLevel(l) }}
            className="px-5 py-2 rounded-xl font-bold text-sm border-2 cursor-pointer transition-all duration-150"
            style={{
              fontFamily: 'var(--font-heading)',
              backgroundColor: level === l ? 'var(--color-primary)' : 'var(--color-bg-card)',
              color: level === l ? '#fff' : 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
            }}
          >
            Level {l}
          </button>
        ))}
      </div>

      <GameWrapper
        key={level}
        title="Spell Quest"
        icon={Volume2}
        iconColor="#BE185D"
        iconBg="#FDF2F8"
        instructions={[
          'A word will be read out loud automatically.',
          'Tap the big "Listen" button to hear it again anytime.',
          'Type the spelling and tap Check.',
          'Use the Hint button if you need help — no penalty!',
        ]}
        ttsText="In Spell Quest, the word plays automatically. Tap Listen to hear it again. Then type the spelling and tap Check. You can use the hint button whenever you need it."
      >
        {({ onComplete }) => (
          <SpellQuestGame key={level} level={level} onComplete={onComplete} />
        )}
      </GameWrapper>
    </div>
  )
}

export default SpellQuest
