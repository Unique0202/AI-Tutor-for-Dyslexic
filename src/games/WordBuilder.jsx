import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Shuffle, RotateCcw } from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'
import GameWrapper from '../components/GameWrapper'

const WORDS = {
  1: [
    { word: 'CAT', emoji: '🐱', hint: 'A furry pet that meows' },
    { word: 'DOG', emoji: '🐶', hint: 'A pet that barks' },
    { word: 'SUN', emoji: '☀️', hint: 'Shines in the sky during the day' },
    { word: 'HAT', emoji: '🎩', hint: 'You wear it on your head' },
    { word: 'BED', emoji: '🛏️', hint: 'You sleep on it' },
    { word: 'CAR', emoji: '🚗', hint: 'A vehicle with four wheels' },
    { word: 'PEN', emoji: '✏️', hint: 'Used for writing' },
    { word: 'BUS', emoji: '🚌', hint: 'A big vehicle that carries many people' },
  ],
  2: [
    { word: 'FISH', emoji: '🐟', hint: 'Lives in water and has fins' },
    { word: 'BOOK', emoji: '📚', hint: 'You read stories from it' },
    { word: 'CAKE', emoji: '🎂', hint: 'A sweet dessert for birthdays' },
    { word: 'STAR', emoji: '⭐', hint: 'Twinkles in the night sky' },
    { word: 'BIRD', emoji: '🐦', hint: 'Flies in the sky with wings' },
    { word: 'FROG', emoji: '🐸', hint: 'Jumps and lives near water' },
    { word: 'TREE', emoji: '🌳', hint: 'Has leaves and branches' },
    { word: 'RAIN', emoji: '🌧️', hint: 'Falls from clouds' },
  ],
  3: [
    { word: 'HOUSE', emoji: '🏠', hint: 'A place where people live' },
    { word: 'APPLE', emoji: '🍎', hint: 'A red or green fruit' },
    { word: 'WATER', emoji: '💧', hint: 'You drink it when thirsty' },
    { word: 'BEACH', emoji: '🏖️', hint: 'Sandy place by the ocean' },
    { word: 'TIGER', emoji: '🐯', hint: 'A big striped cat' },
    { word: 'MUSIC', emoji: '🎵', hint: 'Sounds that make songs' },
    { word: 'SMILE', emoji: '😊', hint: 'What a happy face does' },
    { word: 'CLOUD', emoji: '☁️', hint: 'Floats in the sky' },
  ],
}

const QUESTIONS = 5
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)

const getQueue = (level) =>
  shuffle(WORDS[level] || WORDS[1]).slice(0, QUESTIONS)

// ─── Inner game ────────────────────────────────────────────────────────────
const WordBuilderGame = ({ level, onComplete }) => {
  const [qIndex, setQIndex] = useState(0)
  const [queue] = useState(() => getQueue(level))
  const [tiles, setTiles] = useState([])
  const [picked, setPicked] = useState([])
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong'
  const [wrongCount, setWrongCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const mountedRef = useRef(true)
  const { speak, reducedMotion } = useAccessibility()

  const wordData = queue[qIndex]

  // Cancel speech on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      window.speechSynthesis.cancel()
    }
  }, [])

  const setupRound = useCallback(() => {
    const letters = wordData.word.split('').map((l, i) => ({ id: i, letter: l, used: false }))
    setTiles(shuffle(letters))
    setPicked([])
    setFeedback(null)
    setShowHint(false)
    // Speak word aloud first — phoneme-first approach
    speak(`${wordData.hint}. The word is ${wordData.word}. Tap the letters to build it.`)
  }, [wordData, speak])

  useEffect(() => { setupRound() }, [setupRound])

  const selectTile = (tile) => {
    if (tile.used || feedback === 'correct') return
    const letter = tile.letter
    setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, used: true } : t))
    setPicked(prev => [...prev, tile])
    speak(letter)
  }

  const removePicked = (index) => {
    const tile = picked[index]
    setPicked(prev => prev.filter((_, i) => i !== index))
    setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, used: false } : t))
  }

  const resetPicked = () => {
    setTiles(prev => prev.map(t => ({ ...t, used: false })))
    setPicked([])
  }

  const checkWord = () => {
    const built = picked.map(t => t.letter).join('')
    if (built === wordData.word) {
      setFeedback('correct')
      speak(`${wordData.word}! You got it!`)
      setTimeout(() => {
        if (!mountedRef.current) return
        if (qIndex + 1 >= QUESTIONS) {
          const stars = wrongCount === 0 ? 3 : wrongCount <= 2 ? 2 : 1
          onComplete(stars, `You built all ${QUESTIONS} words! Brilliant!`)
        } else {
          setQIndex(i => i + 1)
        }
      }, 1400)
    } else {
      setWrongCount(w => w + 1)
      setFeedback('wrong')
      speak(`Not quite — let's try again. The word is ${wordData.word}.`)
      setTimeout(() => {
        if (!mountedRef.current) return
        resetPicked()
        setFeedback(null)
      }, 1400)
    }
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-5 py-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-bold shrink-0"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-muted)' }}
        >
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

      {/* Word picture card */}
      <div className="clay-card p-6 flex flex-col items-center gap-3 text-center">
        <span style={{ fontSize: '4.5rem', lineHeight: 1 }}>{wordData.emoji}</span>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{wordData.hint}</p>
        <button
          onClick={() => speak(`The word is ${wordData.word}. ${wordData.hint}`)}
          className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
          style={{
            backgroundColor: 'var(--color-bg-muted)',
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          <Volume2 size={14} /> Hear the word
        </button>
      </div>

      {/* Answer slots */}
      <div>
        <p
          className="text-xs font-bold mb-2 text-center"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-muted)' }}
        >
          Tap letters to build the word
        </p>
        <div
          className="flex justify-center gap-2 min-h-[64px] p-3 rounded-2xl"
          style={{
            backgroundColor: 'var(--color-bg-muted)',
            border: `3px dashed ${feedback === 'correct' ? '#22C55E' : feedback === 'wrong' ? '#EF4444' : 'rgba(79,70,229,0.2)'}`,
          }}
        >
          <AnimatePresence mode="popLayout">
            {picked.map((tile, i) => (
              <motion.button
                key={tile.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => removePicked(i)}
                className="w-12 h-12 rounded-xl font-extrabold text-xl flex items-center justify-center cursor-pointer"
                style={{
                  backgroundColor: feedback === 'correct' ? '#22C55E' : 'var(--color-primary)',
                  color: '#fff',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {tile.letter}
              </motion.button>
            ))}
            {picked.length === 0 && (
              <span className="text-sm self-center" style={{ color: 'var(--color-text-muted)' }}>
                Tap letters below
              </span>
            )}
          </AnimatePresence>
        </div>
      </div>

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
              backgroundColor: feedback === 'correct' ? '#DCFCE7' : '#FEF2F2',
              color: feedback === 'correct' ? '#16A34A' : '#DC2626',
            }}
          >
            {feedback === 'correct'
              ? `${wordData.word}! You got it!`
              : `Not quite — let's try again!`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      {showHint && (
        <div
          className="text-center py-2 px-4 rounded-xl text-sm"
          style={{ backgroundColor: '#FEF9C3', color: '#92400E', fontFamily: 'var(--font-body)' }}
        >
          The word has {wordData.word.length} letters: <strong>{wordData.word[0]}...</strong>
        </div>
      )}

      {/* Available letter tiles */}
      <div className="flex flex-wrap justify-center gap-2">
        {tiles.map(tile => (
          <motion.button
            key={tile.id}
            onClick={() => selectTile(tile)}
            disabled={tile.used || feedback === 'correct'}
            whileHover={reducedMotion ? {} : { scale: tile.used ? 1 : 1.05 }}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
            className="w-12 h-12 rounded-xl font-extrabold text-xl flex items-center justify-center cursor-pointer transition-colors duration-100"
            style={{
              fontFamily: 'var(--font-heading)',
              backgroundColor: tile.used ? 'var(--color-bg-muted)' : 'var(--color-bg-card)',
              color: tile.used ? 'transparent' : 'var(--color-text)',
              border: `3px solid ${tile.used ? 'rgba(79,70,229,0.08)' : 'rgba(79,70,229,0.2)'}`,
              boxShadow: tile.used ? 'none' : 'var(--shadow-clay)',
            }}
          >
            {tile.used ? '' : tile.letter}
          </motion.button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={() => { setShowHint(true); speak(wordData.hint) }}
          className="btn-secondary flex items-center gap-2 py-2 px-4"
          style={{ minHeight: '44px', fontSize: '0.875rem' }}
        >
          Get hint
        </button>
        <button
          onClick={() => setTiles(prev => shuffle([...prev]))}
          className="btn-secondary flex items-center gap-2 py-2 px-4"
          style={{ minHeight: '44px', fontSize: '0.875rem' }}
        >
          <Shuffle size={15} /> Shuffle
        </button>
        <button
          onClick={resetPicked}
          className="btn-secondary flex items-center gap-2 py-2 px-4"
          style={{ minHeight: '44px', fontSize: '0.875rem' }}
        >
          <RotateCcw size={15} /> Clear
        </button>
        <button
          onClick={checkWord}
          disabled={picked.length !== wordData.word.length || feedback === 'correct'}
          className="btn-success flex items-center gap-2 py-2 px-4"
          style={{ minHeight: '44px', fontSize: '0.875rem', opacity: picked.length !== wordData.word.length ? 0.5 : 1 }}
        >
          Check word
        </button>
      </div>
    </div>
  )
}

// ─── Public component ──────────────────────────────────────────────────────
const WordBuilder = () => {
  const [level, setLevel] = useState(1)

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
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
        title="Word Builder"
        icon={Shuffle}
        iconColor="#D97706"
        iconBg="#FFFBEB"
        instructions={[
          'You will see a picture and hear what the word is.',
          'Tap the letters at the bottom to build the word.',
          'Tap a letter you placed to remove it.',
          'Use the hint button anytime — no limit!',
        ]}
        ttsText="In Word Builder, you will see a picture and hear the word. Tap the letters to build the word. Tap any letter you placed to remove it. Use the hint button whenever you need help."
      >
        {({ onComplete }) => (
          <WordBuilderGame key={level} level={level} onComplete={onComplete} />
        )}
      </GameWrapper>
    </div>
  )
}

export default WordBuilder
