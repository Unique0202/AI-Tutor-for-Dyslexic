import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'
import GameWrapper from '../components/GameWrapper'

const LETTER_DATA = {
  A: { sound: 'ah',  emoji: '🍎', word: 'Apple' },
  B: { sound: 'buh', emoji: '⚽', word: 'Ball' },
  C: { sound: 'kuh', emoji: '🐱', word: 'Cat' },
  D: { sound: 'duh', emoji: '🐶', word: 'Dog' },
  E: { sound: 'eh',  emoji: '🐘', word: 'Elephant' },
  F: { sound: 'fff', emoji: '🐟', word: 'Fish' },
  G: { sound: 'guh', emoji: '🐐', word: 'Goat' },
  H: { sound: 'huh', emoji: '🎩', word: 'Hat' },
  I: { sound: 'ih',  emoji: '🍦', word: 'Ice Cream' },
  J: { sound: 'juh', emoji: '🧃', word: 'Juice' },
  K: { sound: 'kuh', emoji: '🪁', word: 'Kite' },
  L: { sound: 'lll', emoji: '🦁', word: 'Lion' },
  M: { sound: 'mmm', emoji: '🌙', word: 'Moon' },
  N: { sound: 'nnn', emoji: '🪺', word: 'Nest' },
  O: { sound: 'oh',  emoji: '🍊', word: 'Orange' },
  P: { sound: 'puh', emoji: '✏️', word: 'Pencil' },
  Q: { sound: 'kwuh',emoji: '👑', word: 'Queen' },
  R: { sound: 'rrr', emoji: '🐰', word: 'Rabbit' },
  S: { sound: 'sss', emoji: '⭐', word: 'Star' },
  T: { sound: 'tuh', emoji: '🌳', word: 'Tree' },
  U: { sound: 'uh',  emoji: '☂️', word: 'Umbrella' },
  V: { sound: 'vvv', emoji: '🎻', word: 'Violin' },
  W: { sound: 'wuh', emoji: '🍉', word: 'Watermelon' },
  X: { sound: 'ks',  emoji: '🎹', word: 'Xylophone' },
  Y: { sound: 'yuh', emoji: '🦒', word: 'Yak' },
  Z: { sound: 'zzz', emoji: '🦓', word: 'Zebra' },
}

const CONFUSABLE = {
  B: ['D', 'P', 'Q'], D: ['B', 'P', 'Q'], P: ['B', 'D', 'Q'], Q: ['P', 'B', 'D'],
  M: ['N', 'W'], N: ['M', 'U'], U: ['N', 'V'], V: ['U', 'W'], W: ['M', 'V'],
}

const LEVELS = {
  1: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  2: ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
  3: ['U', 'V', 'W', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D'],
}

const QUESTIONS = 5
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)

const getOptions = (correct) => {
  const confusable = CONFUSABLE[correct] || []
  const others = Object.keys(LETTER_DATA).filter(l => l !== correct && !confusable.includes(l))
  const distractors = shuffle([...confusable, ...others]).slice(0, 3)
  return shuffle([correct, ...distractors])
}

// ─── Inner game ────────────────────────────────────────────────────────────
const LetterMasterGame = ({ level, onComplete }) => {
  const [qIndex, setQIndex]     = useState(0)
  const [queue]                 = useState(() => shuffle(LEVELS[level] || LEVELS[1]).slice(0, QUESTIONS))
  const [options, setOptions]   = useState([])
  const [locked, setLocked]     = useState(false)
  const [picked, setPicked]     = useState(null)
  const [wrongCount, setWrongCount] = useState(0)
  const cardControls = useAnimation()
  const mountedRef   = useRef(true)
  const { speak, reducedMotion } = useAccessibility()

  const letter = queue[qIndex]
  const data   = LETTER_DATA[letter] || {}

  // Cancel speech on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      window.speechSynthesis.cancel()
    }
  }, [])

  const setup = useCallback(() => {
    setOptions(getOptions(letter))
    setLocked(false)
    setPicked(null)
    speak(`${data.word}. Which letter does ${data.word} start with?`)
  }, [letter, data.word, speak])

  useEffect(() => { setup() }, [setup])

  const handlePick = async (opt) => {
    if (locked) return
    setLocked(true)
    setPicked(opt)

    if (opt === letter) {
      speak(`Yes! ${letter} is for ${data.word}!`)
      await cardControls.start({ borderColor: '#22C55E', transition: { duration: 0.2 } })
      setTimeout(() => {
        if (!mountedRef.current) return
        if (qIndex + 1 >= QUESTIONS) {
          const stars = wrongCount === 0 ? 3 : wrongCount <= 2 ? 2 : 1
          onComplete(stars, `You matched all ${QUESTIONS} letters! Keep it up!`)
        } else {
          setQIndex(i => i + 1)
        }
      }, 1100)
    } else {
      setWrongCount(w => w + 1)
      speak(`Let's try again. Listen carefully.`)
      if (!reducedMotion) {
        await cardControls.start({ x: [-8, 8, -8, 8, 0], borderColor: '#EF4444', transition: { duration: 0.4 } })
        await cardControls.start({ x: 0, borderColor: 'rgba(79,70,229,0.15)', transition: { duration: 0.2 } })
      }
      if (!mountedRef.current) return
      setLocked(false)
      setPicked(null)
      speak(`${data.word}. Which letter does ${data.word} start with?`)
    }
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-5 py-4">
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
        animate={cardControls}
        className="clay-card p-8 flex flex-col items-center gap-4 text-center"
        style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: 'rgba(79,70,229,0.15)' }}
      >
        <span style={{ fontSize: '5rem', lineHeight: 1 }} aria-hidden="true">{data.emoji}</span>
        <h3 className="text-3xl font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
          {data.word}
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Which letter does <strong>{data.word}</strong> start with?
        </p>
        <button
          onClick={() => speak(`${data.word}. Which letter does ${data.word} start with?`)}
          className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
          style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
        >
          <Volume2 size={14} /> Hear the word again
        </button>
      </motion.div>

      {/* Feedback */}
      <AnimatePresence>
        {picked && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-3 px-5 rounded-2xl font-bold text-sm"
            style={{
              fontFamily: 'var(--font-heading)',
              backgroundColor: picked === letter ? '#DCFCE7' : '#FEF2F2',
              color: picked === letter ? '#16A34A' : '#DC2626',
            }}
          >
            {picked === letter
              ? `Yes! ${letter} is for ${data.word}!`
              : "Let's try again — listen carefully."}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer choices — each is a standalone div (not nested buttons) */}
      <div className="grid grid-cols-2 gap-3">
        {options.map(opt => {
          const isCorrect = picked === letter && opt === letter
          return (
            <motion.div
              key={opt}
              role="button"
              tabIndex={0}
              aria-label={`Choose letter ${opt}`}
              onClick={() => handlePick(opt)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handlePick(opt)}
              className={`clay-card py-5 flex flex-col items-center gap-1 cursor-pointer select-none ${locked && picked !== null ? 'pointer-events-none' : ''}`}
              whileHover={reducedMotion ? {} : { scale: 1.03 }}
              whileTap={reducedMotion ? {} : { scale: 0.97 }}
              style={{
                backgroundColor: isCorrect ? '#DCFCE7' : 'var(--color-bg-card)',
                borderColor: isCorrect ? '#22C55E' : 'rgba(79,70,229,0.15)',
              }}
            >
              <span
                className="text-4xl font-extrabold"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
              >
                {opt}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Hear letter sounds — separated from answer tiles to avoid interaction confusion */}
      <div
        className="flex flex-col gap-2 px-4 py-3 rounded-2xl"
        style={{ backgroundColor: 'var(--color-bg-muted)' }}
      >
        <p className="text-xs font-bold text-center" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)' }}>
          Tap to hear each letter sound
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          {options.map(opt => {
            const optData = LETTER_DATA[opt] || {}
            return (
              <button
                key={opt}
                type="button"
                onClick={() => speak(`${opt}. ${opt} says ${optData.sound || opt}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold cursor-pointer transition-colors duration-100"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.8rem',
                  border: '2px solid rgba(79,70,229,0.15)',
                }}
              >
                <Volume2 size={12} /> {opt}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Public component ──────────────────────────────────────────────────────
const LetterMaster = () => {
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
        title="Letter Master"
        icon={Volume2}
        iconColor="#4F46E5"
        iconBg="#EEF2FF"
        instructions={[
          'You will see a picture and hear a word.',
          'Pick the letter that the word STARTS with.',
          'Tap the sound buttons to hear each letter.',
          'Take your time — there is no rush!',
        ]}
        ttsText="In Letter Master, you will see a picture and hear a word. Pick the letter the word starts with. You can tap any letter button to hear its sound."
      >
        {({ onComplete }) => (
          <LetterMasterGame key={level} level={level} onComplete={onComplete} />
        )}
      </GameWrapper>
    </div>
  )
}

export default LetterMaster
