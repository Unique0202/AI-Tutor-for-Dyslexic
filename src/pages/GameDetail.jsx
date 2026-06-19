import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Play, CheckCircle, BookOpen, Volume2, Zap, Star, Music } from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'
import ReadingAdventure from '../games/ReadingAdventure'
import LetterMaster from '../games/LetterMaster'
import WordBuilder from '../games/WordBuilder'
import SpellQuest from '../games/SpellQuest'
import WordSounds from '../games/WordSounds'

const GAME_DATA = {
  'reading-adventure': {
    title: 'Reading Adventure',
    tagline: 'Listen first. Read along. Go at your own pace.',
    description: 'Stories come to life with words highlighted as they are read aloud. Tap any word to hear it again. Three levels — start wherever feels right.',
    icon: BookOpen,
    iconColor: '#4F46E5',
    iconBg: '#EEF2FF',
    skills: ['Reading fluency', 'Word recognition', 'Listening comprehension', 'Vocabulary'],
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    component: ReadingAdventure,
  },
  'letter-master': {
    title: 'Letter Master',
    tagline: 'Hear a sound. Find the letter. Build the connection.',
    description: 'Letters are shown with their sounds — always audio first. Five question types across three levels to build solid letter-sound knowledge.',
    icon: Volume2,
    iconColor: '#0891B2',
    iconBg: '#ECFEFF',
    skills: ['Letter-sound connections', 'Phonics', 'Letter recognition', 'Auditory processing'],
    levels: ['Basic Letters', 'Letter Combinations', 'Challenging Sounds'],
    component: LetterMaster,
  },
  'word-builder': {
    title: 'Word Builder',
    tagline: 'Tap letters. Hear sounds. Build words.',
    description: 'Scrambled letters, a picture for context, and audio guidance. Tap each letter to hear its sound as you build the word.',
    icon: Zap,
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    skills: ['Spelling', 'Letter sequencing', 'Sound-to-letter mapping', 'Word formation'],
    levels: ['Simple Words', 'Compound Words', 'Challenging Vocabulary'],
    component: WordBuilder,
  },
  'spell-quest': {
    title: 'Spell Quest',
    tagline: 'Listen carefully. Spell it your way. Hints are always there.',
    description: 'A word plays out loud — your job is to spell it. Three hints available, no time pressure, and the word replays whenever you need.',
    icon: Star,
    iconColor: '#BE185D',
    iconBg: '#FDF2F8',
    skills: ['Spelling accuracy', 'Phonological awareness', 'Word memory', 'Auditory processing'],
    levels: ['Regular Words', 'Pattern Words', 'Irregular Words'],
    component: SpellQuest,
  },
  'word-sounds': {
    title: 'Word Sounds',
    tagline: 'Just listen. No reading needed.',
    description: 'A sound plays — you pick which word starts (or ends, or contains) that sound. Pure phoneme awareness. No letters, no reading, just listening.',
    icon: Music,
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
    skills: ['Phoneme awareness', 'Initial sounds', 'Ending sounds', 'Middle sounds'],
    levels: ['Initial Sounds', 'Ending Sounds', 'Middle Sounds'],
    component: WordSounds,
  },
}

const GameDetail = () => {
  const { gameId } = useParams()
  const [started, setStarted] = useState(false)
  const { speak, settings, reducedMotion } = useAccessibility()

  const game = GAME_DATA[gameId]

  if (!game) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col items-center gap-6 text-center">
        <h2 className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
          Game not found
        </h2>
        <p style={{ color: 'var(--color-text-muted)' }}>We could not find that game. Try going back to the games list.</p>
        <Link to="/learn" className="btn-primary">Back to Games</Link>
      </div>
    )
  }

  const Icon = game.icon
  const GameComponent = game.component

  const handleStart = () => {
    if (settings.ttsEnabled) speak(`Starting ${game.title}. Let us learn!`)
    setStarted(true)
  }

  return (
    <AnimatePresence mode="wait">
      {!started ? (
        <motion.div
          key="detail"
          className="max-w-5xl mx-auto px-6 py-10"
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
        >
          {/* Back link */}
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 text-sm font-bold mb-8 no-underline"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)' }}
          >
            <ArrowLeft size={16} /> Back to games
          </Link>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left — info */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Title block */}
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: game.iconBg }}
                >
                  <Icon size={28} style={{ color: game.iconColor }} />
                </div>
                <div>
                  <h1
                    className="text-2xl md:text-3xl font-extrabold leading-tight"
                    style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
                  >
                    {game.title}
                  </h1>
                  <p className="text-sm font-bold mt-1" style={{ color: game.iconColor, fontFamily: 'var(--font-heading)' }}>
                    {game.tagline}
                  </p>
                </div>
              </div>

              <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-muted)', maxWidth: '56ch' }}>
                {game.description}
              </p>

              {/* Skills */}
              <div className="clay-card p-5 flex flex-col gap-3">
                <h3 className="font-extrabold text-sm" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                  What you will practise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {game.skills.map(s => (
                    <span
                      key={s}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        backgroundColor: game.iconBg,
                        color: game.iconColor,
                      }}
                    >
                      <CheckCircle size={12} /> {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Levels */}
              <div className="flex flex-col gap-2">
                <h3 className="font-extrabold text-sm" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                  Levels
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {game.levels.map((lvl, i) => (
                    <span
                      key={lvl}
                      className="px-4 py-2 rounded-xl text-sm font-bold border-2"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        borderColor: game.iconColor,
                        color: game.iconColor,
                        backgroundColor: i === 0 ? game.iconBg : '#fff',
                      }}
                    >
                      {lvl}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — CTA card */}
            <div className="lg:w-72 flex flex-col">
              <div className="clay-card p-7 flex flex-col gap-5 sticky top-24">
                <div
                  className="w-full h-32 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: game.iconBg }}
                >
                  <Icon size={56} style={{ color: game.iconColor, opacity: 0.6 }} />
                </div>

                {GameComponent ? (
                  <button
                    onClick={handleStart}
                    className="btn-success flex items-center justify-center gap-2 w-full"
                  >
                    <Play size={18} fill="currentColor" /> Start Game
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div
                      className="text-center py-3 px-4 rounded-xl text-sm font-bold"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        backgroundColor: 'var(--color-bg-muted)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      Coming soon!
                    </div>
                    <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
                      This game is being built right now.
                    </p>
                  </div>
                )}

                <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
                  No sign-in needed. Progress is saved on this device.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="playing"
          initial={reducedMotion ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Game top bar */}
          <div
            className="sticky top-0 z-20 px-6 py-3 flex items-center gap-4 border-b"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'rgba(79,70,229,0.12)',
            }}
          >
            <button
              onClick={() => { window.speechSynthesis.cancel(); setStarted(false) }}
              className="btn-secondary flex items-center gap-2 py-2 px-4"
              style={{ minHeight: '40px', fontSize: '0.875rem' }}
            >
              <ArrowLeft size={15} /> Exit Game
            </button>
            <h2
              className="font-extrabold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            >
              {game.title}
            </h2>
          </div>

          <div className="max-w-5xl mx-auto px-4 py-6">
            <GameComponent />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GameDetail
