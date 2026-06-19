import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Volume2, Star, Zap, Heart, ArrowRight, Headphones, Trophy, Smile } from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.45, ease: 'easeOut' } }),
}

const GAMES = [
  {
    id: 'reading-adventure',
    title: 'Reading Adventure',
    description: 'Listen along as stories come to life. Every word read aloud, one at a time.',
    icon: BookOpen,
    color: '#4F46E5',
    bg: '#EEF2FF',
  },
  {
    id: 'letter-master',
    title: 'Letter Master',
    description: 'Hear each letter sound. Match letters to the sounds you hear.',
    icon: Volume2,
    color: '#0891B2',
    bg: '#ECFEFF',
  },
  {
    id: 'word-builder',
    title: 'Word Builder',
    description: 'Tap letters to build words. Hear each sound as you go.',
    icon: Zap,
    color: '#D97706',
    bg: '#FFFBEB',
  },
  {
    id: 'spell-quest',
    title: 'Spell Quest',
    description: 'Listen to a word, then spell it your way. No rush, no pressure.',
    icon: Star,
    color: '#BE185D',
    bg: '#FDF2F8',
  },
]

const STEPS = [
  {
    num: '1',
    title: 'Pick a game',
    body: 'Choose from games built for the way you learn — sound first, always.',
    icon: BookOpen,
  },
  {
    num: '2',
    title: 'Hear the instructions',
    body: "Every game explains itself out loud. You'll never have to guess what to do.",
    icon: Headphones,
  },
  {
    num: '3',
    title: 'Earn your stars',
    body: 'No scores, no failing. Just stars that show how far you have come.',
    icon: Trophy,
  },
]

const PILLARS = [
  { icon: Volume2, label: 'Sound-first learning', color: '#4F46E5' },
  { icon: Heart, label: 'No penalties, ever', color: '#BE185D' },
  { icon: Smile, label: 'Your pace, always', color: '#059669' },
]

const HeroIllustration = () => (
  <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Background blob */}
    <ellipse cx="160" cy="160" rx="140" ry="120" fill="#E0E7FF" />
    {/* Book */}
    <rect x="90" y="110" width="140" height="100" rx="12" fill="#fff" stroke="#4F46E5" strokeWidth="3" />
    <rect x="90" y="110" width="70" height="100" rx="12" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="3" />
    <line x1="160" y1="113" x2="160" y2="207" stroke="#4F46E5" strokeWidth="3" />
    {/* Lines on right page */}
    <rect x="170" y="135" width="45" height="6" rx="3" fill="#A5B4FC" />
    <rect x="170" y="150" width="38" height="6" rx="3" fill="#A5B4FC" />
    <rect x="170" y="165" width="42" height="6" rx="3" fill="#A5B4FC" />
    <rect x="170" y="180" width="30" height="6" rx="3" fill="#A5B4FC" />
    {/* Lines on left page */}
    <rect x="100" y="135" width="45" height="6" rx="3" fill="#C7D2FE" />
    <rect x="100" y="150" width="38" height="6" rx="3" fill="#C7D2FE" />
    <rect x="100" y="165" width="42" height="6" rx="3" fill="#C7D2FE" />
    {/* Star */}
    <circle cx="240" cy="90" r="22" fill="#FDE68A" />
    <text x="240" y="97" textAnchor="middle" fontSize="20" fill="#D97706">★</text>
    {/* Letter A */}
    <circle cx="75" cy="85" r="22" fill="#C7D2FE" />
    <text x="75" y="92" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#4F46E5">A</text>
    {/* Sound waves */}
    <path d="M258 138 Q266 150 258 162" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M267 130 Q280 150 267 170" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Dots decoration */}
    <circle cx="60" cy="160" r="7" fill="#A5B4FC" />
    <circle cx="50" cy="185" r="5" fill="#FDE68A" />
    <circle cx="270" cy="195" r="8" fill="#FCA5A5" />
    <circle cx="248" cy="215" r="5" fill="#A5B4FC" />
  </svg>
)

const HomePage = () => {
  const { speak, settings, reducedMotion } = useAccessibility()
  const motion_props = reducedMotion ? {} : undefined

  return (
    <div style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-16 flex flex-col md:flex-row items-center gap-10">
        <motion.div
          className="flex-1 flex flex-col gap-6"
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold w-fit"
            style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
          >
            <Headphones size={14} /> Built for dyslexic learners
          </span>

          <h1
            className="text-4xl md:text-5xl font-extrabold leading-tight"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            Learning that works{' '}
            <span style={{ color: 'var(--color-primary)' }}>the way your brain does</span>
          </h1>

          <p className="text-lg" style={{ color: 'var(--color-text-muted)', maxWidth: '48ch' }}>
            Sound-first games, zero pressure, and immediate encouragement — built around how dyslexic students actually learn.
          </p>

          <div className="flex flex-wrap gap-3 mt-2">
            <Link to="/learn" className="btn-primary flex items-center gap-2">
              Start Learning <ArrowRight size={16} />
            </Link>
            <Link to="/help" className="btn-secondary">
              Ask for Help
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 flex justify-center"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
          aria-hidden="true"
        >
          <div className="w-full max-w-xs md:max-w-sm">
            <HeroIllustration />
          </div>
        </motion.div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section
        className="py-16 border-t border-b"
        style={{ borderColor: 'rgba(79,70,229,0.1)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            className="text-2xl md:text-3xl font-extrabold mb-10"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            How it works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.num}
                  className="clay-card p-6 flex flex-col gap-4"
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-base shrink-0"
                      style={{ backgroundColor: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
                    >
                      {step.num}
                    </span>
                    <Icon size={20} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)', maxWidth: '32ch' }}>
                    {step.body}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Games showcase ────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <motion.h2
            className="text-2xl md:text-3xl font-extrabold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Choose your game
          </motion.h2>
          <Link
            to="/learn"
            className="text-sm font-bold flex items-center gap-1 no-underline"
            style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
          >
            See all games <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {GAMES.map((game, i) => {
            const Icon = game.icon
            return (
              <motion.div
                key={game.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Link
                  to={`/learn/${game.id}`}
                  className="clay-card p-5 flex flex-col gap-4 h-full no-underline group block"
                  style={{ textDecoration: 'none' }}
                  onClick={() => settings.ttsEnabled && speak(game.title)}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: game.bg }}
                  >
                    <Icon size={24} style={{ color: game.color }} />
                  </div>
                  <div>
                    <h3
                      className="font-extrabold mb-1"
                      style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)', fontSize: '1rem' }}
                    >
                      {game.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)', maxWidth: '28ch' }}>
                      {game.description}
                    </p>
                  </div>
                  <span
                    className="mt-auto text-sm font-bold flex items-center gap-1"
                    style={{ color: game.color, fontFamily: 'var(--font-heading)' }}
                  >
                    Play now <ArrowRight size={13} />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── Why it's different ────────────────────────────── */}
      <section
        className="py-14 border-t"
        style={{ borderColor: 'rgba(79,70,229,0.1)', backgroundColor: 'var(--color-bg-muted)' }}
      >
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center gap-8">
          <motion.h2
            className="text-2xl md:text-3xl font-extrabold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Built differently — on purpose
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-4">
            {PILLARS.map((p, i) => {
              const Icon = p.icon
              return (
                <motion.div
                  key={p.label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl border-2 font-bold text-sm"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    backgroundColor: '#fff',
                    borderColor: p.color,
                    color: p.color,
                  }}
                >
                  <Icon size={18} />
                  {p.label}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16 flex flex-col items-center text-center gap-6">
        <motion.h2
          className="text-2xl md:text-3xl font-extrabold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Ready to start?
        </motion.h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '44ch' }}>
          Pick any game and begin right now. No sign-up, no setup — just learning.
        </p>
        <Link to="/learn" className="btn-success flex items-center gap-2">
          Start Learning <ArrowRight size={16} />
        </Link>
      </section>

    </div>
  )
}

export default HomePage
