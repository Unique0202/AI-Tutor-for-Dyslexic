import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Music } from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'
import GameWrapper from '../components/GameWrapper'

// ─── Question data ─────────────────────────────────────────────────────────
// Each question: phoneme sound, the correct item, and 2 distractors
// Items are emoji + spoken word — no reading required from the student

const LEVELS = {
  1: {
    label: 'Starting Sounds',
    prompt: 'Which one starts with',
    questions: [
      { phoneme: '/b/', ask: 'buh',  correct: { e: '⚽', w: 'ball'       }, distractors: [{ e: '🐱', w: 'cat'  }, { e: '🐟', w: 'fish'  }] },
      { phoneme: '/s/', ask: 'sss',  correct: { e: '☀️', w: 'sun'        }, distractors: [{ e: '🐶', w: 'dog'  }, { e: '🌳', w: 'tree'  }] },
      { phoneme: '/m/', ask: 'mmm',  correct: { e: '🌙', w: 'moon'       }, distractors: [{ e: '🐱', w: 'cat'  }, { e: '🌧️', w: 'rain'  }] },
      { phoneme: '/f/', ask: 'fff',  correct: { e: '🐟', w: 'fish'       }, distractors: [{ e: '🐶', w: 'dog'  }, { e: '⭐', w: 'star'  }] },
      { phoneme: '/d/', ask: 'duh',  correct: { e: '🐶', w: 'dog'        }, distractors: [{ e: '⚽', w: 'ball' }, { e: '🌙', w: 'moon'  }] },
      { phoneme: '/r/', ask: 'rrr',  correct: { e: '🌧️', w: 'rain'      }, distractors: [{ e: '☀️', w: 'sun'  }, { e: '🌳', w: 'tree'  }] },
      { phoneme: '/h/', ask: 'huh',  correct: { e: '🎩', w: 'hat'        }, distractors: [{ e: '🐱', w: 'cat'  }, { e: '⭐', w: 'star'  }] },
      { phoneme: '/t/', ask: 'tuh',  correct: { e: '🌳', w: 'tree'       }, distractors: [{ e: '🌙', w: 'moon' }, { e: '🐶', w: 'dog'   }] },
      { phoneme: '/c/', ask: 'kuh',  correct: { e: '🐱', w: 'cat'        }, distractors: [{ e: '⚽', w: 'ball' }, { e: '🌧️', w: 'rain' }] },
      { phoneme: '/l/', ask: 'lll',  correct: { e: '🦁', w: 'lion'       }, distractors: [{ e: '🐱', w: 'cat'  }, { e: '🐶', w: 'dog'   }] },
    ],
  },
  2: {
    label: 'Ending Sounds',
    prompt: 'Which one ends with',
    questions: [
      { phoneme: '/t/', ask: 'tuh at the end',  correct: { e: '🐱', w: 'cat'  }, distractors: [{ e: '🐶', w: 'dog' }, { e: '☀️', w: 'sun'  }] },
      { phoneme: '/g/', ask: 'guh at the end',  correct: { e: '🐶', w: 'dog'  }, distractors: [{ e: '🐱', w: 'cat' }, { e: '🌙', w: 'moon' }] },
      { phoneme: '/n/', ask: 'nnn at the end',  correct: { e: '☀️', w: 'sun'  }, distractors: [{ e: '🐟', w: 'fish'}, { e: '🌳', w: 'tree' }] },
      { phoneme: '/sh/','ask': 'shh at the end',correct: { e: '🐟', w: 'fish' }, distractors: [{ e: '🐶', w: 'dog' }, { e: '🌳', w: 'tree' }] },
      { phoneme: '/r/', ask: 'rrr at the end',  correct: { e: '⭐', w: 'star' }, distractors: [{ e: '🐱', w: 'cat' }, { e: '🌙', w: 'moon' }] },
      { phoneme: '/k/', ask: 'kuh at the end',  correct: { e: '📚', w: 'book' }, distractors: [{ e: '🌧️', w: 'rain'}, { e: '⭐', w: 'star' }] },
      { phoneme: '/d/', ask: 'duh at the end',  correct: { e: '🐦', w: 'bird' }, distractors: [{ e: '🐱', w: 'cat' }, { e: '☀️', w: 'sun'  }] },
      { phoneme: '/n/', ask: 'nnn at the end',  correct: { e: '🌙', w: 'moon' }, distractors: [{ e: '🐱', w: 'cat' }, { e: '🐟', w: 'fish' }] },
      { phoneme: '/t/', ask: 'tuh at the end',  correct: { e: '🎩', w: 'hat'  }, distractors: [{ e: '🌧️', w: 'rain'}, { e: '🌳', w: 'tree' }] },
      { phoneme: '/g/', ask: 'guh at the end',  correct: { e: '🐸', w: 'frog' }, distractors: [{ e: '🐱', w: 'cat' }, { e: '⭐', w: 'star' }] },
    ],
  },
  3: {
    label: 'Middle Sounds',
    prompt: 'Which one has',
    promptSuffix: 'in the middle',
    questions: [
      { phoneme: '/a/',  ask: 'aah in the middle', correct: { e: '🐱', w: 'cat'  }, distractors: [{ e: '🐶', w: 'dog'  }, { e: '🐟', w: 'fish' }] },
      { phoneme: '/o/',  ask: 'oh in the middle',  correct: { e: '🐶', w: 'dog'  }, distractors: [{ e: '🐱', w: 'cat'  }, { e: '🐟', w: 'fish' }] },
      { phoneme: '/u/',  ask: 'uh in the middle',  correct: { e: '☀️', w: 'sun'  }, distractors: [{ e: '🐱', w: 'cat'  }, { e: '⭐', w: 'star' }] },
      { phoneme: '/i/',  ask: 'ih in the middle',  correct: { e: '🐟', w: 'fish' }, distractors: [{ e: '🐶', w: 'dog'  }, { e: '⚽', w: 'ball' }] },
      { phoneme: '/a/',  ask: 'aah in the middle', correct: { e: '🎩', w: 'hat'  }, distractors: [{ e: '🌙', w: 'moon' }, { e: '🐟', w: 'fish' }] },
      { phoneme: '/oo/', ask: 'oo in the middle',  correct: { e: '🌙', w: 'moon' }, distractors: [{ e: '🐱', w: 'cat'  }, { e: '🐟', w: 'fish' }] },
      { phoneme: '/ee/', ask: 'ee in the middle',  correct: { e: '🌳', w: 'tree' }, distractors: [{ e: '🎩', w: 'hat'  }, { e: '🐶', w: 'dog'  }] },
      { phoneme: '/a/',  ask: 'aah in the middle', correct: { e: '🌧️', w: 'rain'}, distractors: [{ e: '🐱', w: 'cat'  }, { e: '🌳', w: 'tree' }] },
      { phoneme: '/o/',  ask: 'oh in the middle',  correct: { e: '📚', w: 'book' }, distractors: [{ e: '☀️', w: 'sun'  }, { e: '🐱', w: 'cat'  }] },
      { phoneme: '/i/',  ask: 'ih in the middle',  correct: { e: '🐦', w: 'bird' }, distractors: [{ e: '🐶', w: 'dog'  }, { e: '🌙', w: 'moon' }] },
    ],
  },
}

const QUESTIONS = 6
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)

const makeQueue = (levelData) =>
  shuffle(levelData.questions).slice(0, QUESTIONS).map(q => ({
    ...q,
    choices: shuffle([q.correct, ...q.distractors]),
  }))

// ─── Inner game ────────────────────────────────────────────────────────────
const WordSoundsGame = ({ level, onComplete }) => {
  const [qIndex, setQIndex] = useState(0)
  const [queue] = useState(() => makeQueue(LEVELS[level]))
  const [picked, setPicked] = useState(null)
  const [locked, setLocked] = useState(false)
  const [wrongCount, setWrongCount] = useState(0)
  const mountedRef = useRef(true)
  const { speak, reducedMotion } = useAccessibility()

  const levelData = LEVELS[level]
  const q = queue[qIndex]

  // Cancel speech on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      window.speechSynthesis.cancel()
    }
  }, [])

  const askQuestion = useCallback(() => {
    setPicked(null)
    setLocked(false)
    const prompt = `${levelData.prompt} ${q.phoneme}? Tap each picture to hear the word.`
    speak(prompt)
  }, [q, levelData.prompt, speak])

  useEffect(() => { askQuestion() }, [askQuestion])

  const handlePick = (choice) => {
    if (locked) return
    speak(choice.w)

    if (choice.w === q.correct.w) {
      setLocked(true)
      setPicked({ ...choice, result: 'correct' })
      speak(`Yes! ${choice.w}. That is right!`)
      setTimeout(() => {
        if (!mountedRef.current) return
        if (qIndex + 1 >= QUESTIONS) {
          const stars = wrongCount === 0 ? 3 : wrongCount <= 2 ? 2 : 1
          onComplete(stars, `Excellent listening! You got ${QUESTIONS} phoneme questions right!`)
        } else {
          setQIndex(i => i + 1)
        }
      }, 1200)
    } else {
      setWrongCount(w => w + 1)
      setPicked({ ...choice, result: 'wrong' })
      speak(`${choice.w} — let's listen again.`)
      setTimeout(() => {
        if (!mountedRef.current) return
        setPicked(null)
        speak(`${levelData.prompt} ${q.phoneme}?`)
      }, 1500)
    }
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6 py-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold shrink-0" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-muted)' }}>
          {qIndex + 1} / {QUESTIONS}
        </span>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: '#7C3AED' }}
            animate={{ width: `${(qIndex / QUESTIONS) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Phoneme prompt */}
      <motion.div
        key={qIndex}
        className="clay-card p-7 flex flex-col items-center gap-4 text-center"
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: '#F5F3FF' }}
        >
          <Music size={36} style={{ color: '#7C3AED' }} />
        </div>
        <h3
          className="text-xl font-extrabold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          {levelData.prompt}{' '}
          <span style={{ color: '#7C3AED' }}>{q.phoneme}</span>
          {levelData.promptSuffix ? ` ${levelData.promptSuffix}` : ''}?
        </h3>
        <button
          onClick={askQuestion}
          className="flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl border-2 cursor-pointer"
          style={{
            fontFamily: 'var(--font-heading)',
            borderColor: '#7C3AED',
            color: '#7C3AED',
            backgroundColor: '#F5F3FF',
          }}
        >
          <Volume2 size={16} /> Hear the sound again
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
              backgroundColor: picked.result === 'correct' ? '#DCFCE7' : '#FEF2F2',
              color: picked.result === 'correct' ? '#16A34A' : '#DC2626',
            }}
          >
            {picked.result === 'correct'
              ? `Yes! ${picked.w.toUpperCase()} is right!`
              : `Not quite — let's listen again.`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Choices — tap to hear, then decide */}
      <div>
        <p
          className="text-xs font-bold text-center mb-3"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-muted)' }}
        >
          Tap a picture to hear it, then tap your answer
        </p>
        <div className="grid grid-cols-3 gap-3">
          {q.choices.map((choice) => {
            const isCorrect = picked?.result === 'correct' && choice.w === q.correct.w
            const isWrong = picked?.result === 'wrong' && picked.w === choice.w
            return (
              <motion.button
                key={choice.w}
                onClick={() => handlePick(choice)}
                disabled={locked}
                whileHover={reducedMotion || locked ? {} : { scale: 1.04 }}
                whileTap={reducedMotion || locked ? {} : { scale: 0.96 }}
                className="clay-card py-5 flex flex-col items-center gap-2 cursor-pointer"
                style={{
                  borderColor: isCorrect ? '#22C55E' : isWrong ? '#EF4444' : 'rgba(79,70,229,0.15)',
                  backgroundColor: isCorrect ? '#DCFCE7' : isWrong ? '#FEF2F2' : 'var(--color-bg-card)',
                }}
              >
                <span style={{ fontSize: '2.8rem', lineHeight: 1 }}>{choice.e}</span>
                <span
                  className="text-xs font-bold"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-muted)' }}
                >
                  <Volume2 size={11} style={{ display: 'inline', marginRight: 2 }} />
                  {choice.w}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Public component ──────────────────────────────────────────────────────
const WordSounds = () => {
  const [level, setLevel] = useState(1)

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      <div className="flex gap-2 justify-center mb-5">
        {[1, 2, 3].map(l => (
          <button
            key={l}
            onClick={() => { window.speechSynthesis.cancel(); setLevel(l) }}
            className="px-4 py-2 rounded-xl font-bold text-sm border-2 cursor-pointer transition-all duration-150"
            style={{
              fontFamily: 'var(--font-heading)',
              backgroundColor: level === l ? '#7C3AED' : 'var(--color-bg-card)',
              color: level === l ? '#fff' : '#7C3AED',
              borderColor: '#7C3AED',
            }}
          >
            {LEVELS[l].label}
          </button>
        ))}
      </div>

      <GameWrapper
        key={level}
        title="Word Sounds"
        icon={Music}
        iconColor="#7C3AED"
        iconBg="#F5F3FF"
        instructions={[
          'Listen to a sound — like "buh" or "sss".',
          'Tap each picture to hear the word out loud.',
          'Pick the picture whose word matches the sound.',
          'No reading needed — just use your ears!',
        ]}
        ttsText="In Word Sounds, you will hear a sound. Tap each picture to hear what it is. Then pick the one whose word matches the sound. No reading needed — just listen!"
      >
        {({ onComplete }) => (
          <WordSoundsGame key={level} level={level} onComplete={onComplete} />
        )}
      </GameWrapper>
    </div>
  )
}

export default WordSounds
