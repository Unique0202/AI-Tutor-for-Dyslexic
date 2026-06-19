import React from 'react'
import { Link } from 'react-router-dom'
import { Brain, Heart } from 'lucide-react'

const Footer = () => {
  const links = [
    { to: '/',         label: 'Home' },
    { to: '/learn',    label: 'Learn' },
    { to: '/progress', label: 'Progress' },
    { to: '/help',     label: 'Help' },
    { to: '/faq',      label: 'FAQ' },
  ]

  return (
    <footer
      className="border-t mt-auto pb-16 md:pb-0"
      style={{ backgroundColor: 'var(--color-bg)', borderColor: 'rgba(79,70,229,0.12)' }}
    >
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary)' }}>
              <Brain size={20} color="#fff" />
            </span>
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              NeuroLearn
            </span>
          </Link>
          <p className="text-sm text-center md:text-left" style={{ color: 'var(--color-text-muted)', maxWidth: '22ch' }}>
            Learning that actually works for dyslexic students.
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2" aria-label="Footer navigation">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-sm font-bold no-underline transition-colors duration-150 hover:underline"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-muted)' }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t px-6 py-4 flex items-center justify-center gap-1 text-xs"
        style={{ borderColor: 'rgba(79,70,229,0.08)', color: 'var(--color-text-muted)' }}
      >
        <span>© {new Date().getFullYear()} NeuroLearn — made with</span>
        <Heart size={12} className="inline" style={{ color: 'var(--color-danger)' }} fill="currentColor" />
        <span>for every learner</span>
      </div>
    </footer>
  )
}

export default Footer
