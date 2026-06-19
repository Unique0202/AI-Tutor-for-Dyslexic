import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Play, RotateCcw, CheckCircle } from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'

const StarDisplay = ({ filled }) => (
  <div className="flex justify-center gap-3 my-2" aria-label={`${filled} out of 3 stars`}>
    {[1, 2, 3].map(n => (
      <motion.span
        key={n}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: n * 0.18, type: 'spring', stiffness: 350 }}
        style={{ fontSize: '3rem', color: n <= filled ? '#F59E0B' : '#D1D5DB' }}
        aria-hidden="true"
      >
        ★
      </motion.span>
    ))}
  </div>
)

const GameWrapper = ({ title, icon: Icon, iconColor, iconBg, instructions, ttsText, children }) => {
  const [phase, setPhase] = useState('instruction')
  const [result, setResult] = useState(null)
  const { speak, reducedMotion } = useAccessibility()

  // Cancel speech when GameWrapper itself unmounts (e.g. user navigates away)
  useEffect(() => () => { window.speechSynthesis.cancel() }, [])

  const startGame = () => setPhase('playing')

  const handleComplete = (stars, message) => {
    setResult({ stars, message })
    setPhase('result')
    speak(message)
  }

  const replay = () => {
    window.speechSynthesis.cancel()
    setResult(null)
    setPhase('instruction')
  }

  const resultHeading =
    result?.stars === 3 ? 'Amazing work!' : result?.stars === 2 ? 'Great job!' : 'Well done!'

  return (
    <AnimatePresence mode="wait">
      {phase === 'instruction' && (
        <motion.div
          key="instruction"
          className="max-w-lg mx-auto clay-card p-8 flex flex-col gap-6"
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* Title row */}
          <div className="flex items-center gap-4">
            {Icon && (
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: iconBg }}
                aria-hidden="true"
              >
                <Icon size={28} style={{ color: iconColor }} />
              </div>
            )}
            <div>
              <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)' }}>
                How to play
              </p>
              <h2
                className="text-xl font-extrabold"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
              >
                {title}
              </h2>
            </div>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-2.5">
            {instructions.map((ins, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 rounded-xl"
                style={{ backgroundColor: 'var(--color-bg-muted)' }}
              >
                <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: iconColor || 'var(--color-primary)' }} />
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
                >
                  {ins}
                </p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => speak(ttsText || instructions.join('. '))}
              className="btn-secondary flex items-center gap-2 py-2.5 px-4"
              style={{ minHeight: '48px', fontSize: '0.875rem' }}
            >
              <Volume2 size={16} /> Read to me
            </button>
            <button
              onClick={startGame}
              className="btn-primary flex items-center gap-2 flex-1 justify-center"
              style={{ minHeight: '48px' }}
            >
              <Play size={16} fill="currentColor" /> I am ready!
            </button>
          </div>
        </motion.div>
      )}

      {phase === 'playing' && (
        <motion.div
          key="playing"
          initial={reducedMotion ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.3 }}
        >
          {children({ onComplete: handleComplete })}
        </motion.div>
      )}

      {phase === 'result' && result && (
        <motion.div
          key="result"
          className="max-w-lg mx-auto clay-card p-10 flex flex-col items-center gap-5 text-center"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, type: 'spring', stiffness: 200 }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: iconBg || 'var(--color-bg-muted)' }}
            aria-hidden="true"
          >
            {Icon && <Icon size={32} style={{ color: iconColor || 'var(--color-primary)' }} />}
          </div>

          <h2
            className="text-2xl font-extrabold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            {resultHeading}
          </h2>

          <StarDisplay filled={result.stars} />

          <p style={{ color: 'var(--color-text-muted)', maxWidth: '34ch' }}>
            {result.message}
          </p>

          <button onClick={replay} className="btn-primary flex items-center gap-2 mt-2">
            <RotateCcw size={16} /> Play Again
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GameWrapper
