import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, BookOpen, Volume2, Zap, Star, Music, ArrowRight, X } from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'

const GAMES = [
  {
    id: 'reading-adventure',
    title: 'Reading Adventure',
    description: 'Listen along as stories come to life. Words highlight as they are read aloud — click any word to hear it again.',
    category: 'reading',
    difficulty: 'All Levels',
    difficultyColor: '#4F46E5',
    icon: BookOpen,
    iconColor: '#4F46E5',
    iconBg: '#EEF2FF',
  },
  {
    id: 'letter-master',
    title: 'Letter Master',
    description: 'Hear each letter sound and match it to the right letter. Audio comes first — always.',
    category: 'letters',
    difficulty: 'Beginner',
    difficultyColor: '#059669',
    icon: Volume2,
    iconColor: '#0891B2',
    iconBg: '#ECFEFF',
  },
  {
    id: 'word-builder',
    title: 'Word Builder',
    description: 'Tap letters to build words. Hear each sound as you place it. Start simple, grow strong.',
    category: 'spelling',
    difficulty: 'Intermediate',
    difficultyColor: '#D97706',
    icon: Zap,
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
  },
  {
    id: 'spell-quest',
    title: 'Spell Quest',
    description: 'Listen to a word, then spell it. Hints are always there when you need them.',
    category: 'spelling',
    difficulty: 'Intermediate',
    difficultyColor: '#D97706',
    icon: Star,
    iconColor: '#BE185D',
    iconBg: '#FDF2F8',
  },
  {
    id: 'word-sounds',
    title: 'Word Sounds',
    description: 'Hear a sound, pick the right word. Pure phoneme awareness — no reading required at all.',
    category: 'phonics',
    difficulty: 'Beginner',
    difficultyColor: '#059669',
    icon: Music,
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
  },
]

const FILTERS = [
  { value: 'all', label: 'All Games' },
  { value: 'reading', label: 'Reading' },
  { value: 'spelling', label: 'Spelling' },
  { value: 'letters', label: 'Letters' },
  { value: 'phonics', label: 'Phonics' },
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
}

const GamesPage = () => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const { speak, settings, reducedMotion } = useAccessibility()

  const filtered = GAMES.filter(g => {
    const matchSearch =
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || g.category === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="max-w-5xl mx-auto px-6 py-10" style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* Header */}
      <motion.div
        className="mb-8"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1
          className="text-3xl md:text-4xl font-extrabold mb-2"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          Choose a game
        </h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '52ch' }}>
          Every game starts with sound. Pick one and begin — no setup needed.
        </p>
      </motion.div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div
          className="flex items-center gap-3 px-4 rounded-2xl border-2 flex-1"
          style={{
            backgroundColor: '#fff',
            borderColor: 'rgba(79,70,229,0.2)',
            boxShadow: 'var(--shadow-clay)',
          }}
        >
          <Search size={18} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 py-3 bg-transparent outline-none text-base"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
            aria-label="Search games"
          />
          {search && (
            <button onClick={() => setSearch('')} aria-label="Clear search" className="cursor-pointer">
              <X size={16} style={{ color: 'var(--color-text-muted)' }} />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all duration-150 cursor-pointer min-h-[44px]"
              style={{
                fontFamily: 'var(--font-heading)',
                backgroundColor: filter === f.value ? 'var(--color-primary)' : '#fff',
                color: filter === f.value ? '#fff' : 'var(--color-primary)',
                borderColor: 'var(--color-primary)',
                boxShadow: filter === f.value ? 'var(--shadow-clay)' : 'none',
              }}
              aria-pressed={filter === f.value}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Game grid */}
      {filtered.length === 0 ? (
        <div className="clay-card p-10 flex flex-col items-center gap-4 text-center">
          <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            No games match that search.
          </p>
          <button
            onClick={() => { setSearch(''); setFilter('all') }}
            className="btn-secondary"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((game, i) => {
            const Icon = game.icon
            return (
              <motion.div
                key={game.id}
                custom={i}
                variants={reducedMotion ? {} : cardVariants}
                initial="hidden"
                animate="show"
              >
                <Link
                  to={`/learn/${game.id}`}
                  className="clay-card p-6 flex flex-col gap-4 h-full no-underline block"
                  onClick={() => settings.ttsEnabled && speak(`${game.title}. ${game.description}`)}
                >
                  {/* Icon + difficulty */}
                  <div className="flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: game.iconBg }}
                    >
                      <Icon size={24} style={{ color: game.iconColor }} />
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        backgroundColor: game.iconBg,
                        color: game.difficultyColor,
                      }}
                    >
                      {game.difficulty}
                    </span>
                  </div>

                  {/* Title + description */}
                  <div className="flex-1">
                    <h2
                      className="text-lg font-extrabold mb-1"
                      style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
                    >
                      {game.title}
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                      {game.description}
                    </p>
                  </div>

                  {/* Play link */}
                  <span
                    className="flex items-center gap-1 text-sm font-bold mt-2"
                    style={{ color: game.iconColor, fontFamily: 'var(--font-heading)' }}
                  >
                    Play now <ArrowRight size={13} />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default GamesPage
