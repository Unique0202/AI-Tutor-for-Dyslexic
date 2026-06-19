import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, BarChart2, Award, Clock, Lock } from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'

const MOCK = {
  name: 'Your Progress',
  streak: 5,
  gamesPlayed: 12,
  recentGames: [
    { name: 'Reading Adventure', stars: 3, date: '2025-05-10', duration: '15 min', pct: 85 },
    { name: 'Letter Master',     stars: 3, date: '2025-05-09', duration: '12 min', pct: 92 },
    { name: 'Word Builder',      stars: 2, date: '2025-05-08', duration: '18 min', pct: 78 },
    { name: 'Spell Quest',       stars: 2, date: '2025-05-07', duration: '10 min', pct: 80 },
  ],
  achievements: [
    { title: 'Reading Rookie',  desc: 'Finished your first Reading Adventure',    icon: '📖', date: '2025-05-03' },
    { title: 'Letter Legend',   desc: 'Reached Level 3 in Letter Master',          icon: '🔤', date: '2025-05-06' },
    { title: 'Word Wizard',     desc: 'Built 20 words correctly in Word Builder',  icon: '🧩', date: '2025-05-08' },
    { title: 'Spelling Star',   desc: 'Got a perfect star score in Spell Quest',   icon: '⭐', date: '2025-05-09' },
  ],
  locked: [
    { title: 'Spelling Champion', icon: '🏆' },
    { title: 'Reading Master',    icon: '📚' },
    { title: '10-Day Streak',     icon: '🔥' },
  ],
  skills: [
    { skill: 'Reading',            stars: 4, max: 5 },
    { skill: 'Letter Recognition', stars: 5, max: 5 },
    { skill: 'Spelling',           stars: 3, max: 5 },
    { skill: 'Phonics',            stars: 2, max: 5 },
  ],
}

const StarRow = ({ filled, max }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <span key={i} style={{ color: i < filled ? '#F59E0B' : '#D1D5DB', fontSize: '1.1rem' }}>★</span>
    ))}
  </div>
)

const TABS = [
  { id: 'progress',     label: 'Progress',      icon: BarChart2 },
  { id: 'achievements', label: 'Achievements',  icon: Award },
]

const ProfilePage = () => {
  const [tab, setTab] = useState('progress')
  const { reducedMotion } = useAccessibility()

  return (
    <div className="max-w-5xl mx-auto px-6 py-10" style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* Header */}
      <motion.div
        className="clay-card p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
          style={{ backgroundColor: 'var(--color-bg-muted)' }}
          aria-hidden="true"
        >
          🌟
        </div>
        <div className="flex-1">
          <h1
            className="text-2xl font-extrabold mb-1"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            {MOCK.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span className="flex items-center gap-1.5 font-bold">
              <Calendar size={15} />
              {MOCK.streak}-day streak
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <BarChart2 size={15} />
              {MOCK.gamesPlayed} games played
            </span>
          </div>
        </div>
        <div
          className="text-xs px-3 py-1.5 rounded-full font-bold"
          style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)' }}
        >
          Demo data — sign-in coming soon
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b" style={{ borderColor: 'rgba(79,70,229,0.12)' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-colors duration-150 cursor-pointer -mb-px"
            style={{
              fontFamily: 'var(--font-heading)',
              borderColor: tab === id ? 'var(--color-primary)' : 'transparent',
              color: tab === id ? 'var(--color-primary)' : 'var(--color-text-muted)',
              backgroundColor: 'transparent',
            }}
            aria-selected={tab === id}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Progress Tab */}
      {tab === 'progress' && (
        <motion.div
          key="progress"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-10"
        >
          {/* Skill stars */}
          <div>
            <h2
              className="text-xl font-extrabold mb-5"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            >
              Your skills
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {MOCK.skills.map((s, i) => (
                <motion.div
                  key={s.skill}
                  className="clay-card p-5 flex items-center justify-between"
                  initial={reducedMotion ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                >
                  <span className="font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                    {s.skill}
                  </span>
                  <StarRow filled={s.stars} max={s.max} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div>
            <h2
              className="text-xl font-extrabold mb-5"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            >
              Recent activity
            </h2>
            <div className="flex flex-col gap-4">
              {MOCK.recentGames.map((g, i) => (
                <motion.div
                  key={i}
                  className="clay-card p-5 flex flex-col gap-3"
                  initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                      {g.name}
                    </span>
                    <StarRow filled={g.stars} max={3} />
                  </div>
                  <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(g.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {g.duration}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${g.pct}%` }}
                      transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Achievements Tab */}
      {tab === 'achievements' && (
        <motion.div
          key="achievements"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-10"
        >
          <div>
            <h2
              className="text-xl font-extrabold mb-5"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            >
              Earned badges
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {MOCK.achievements.map((a, i) => (
                <motion.div
                  key={i}
                  className="clay-card p-5 flex items-start gap-4"
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: 'var(--color-bg-muted)' }}
                    aria-hidden="true"
                  >
                    {a.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                      {a.title}
                    </h3>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{a.desc}</p>
                    <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                      <Calendar size={11} /> {new Date(a.date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Locked */}
          <div>
            <h2
              className="text-xl font-extrabold mb-5"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            >
              Coming up
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {MOCK.locked.map((l, i) => (
                <div
                  key={i}
                  className="clay-card p-5 flex flex-col items-center gap-3 opacity-60"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-bg-muted)' }}
                  >
                    <Lock size={20} style={{ color: 'var(--color-text-muted)' }} />
                  </div>
                  <p className="text-sm font-bold text-center" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-muted)' }}>
                    {l.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ProfilePage
