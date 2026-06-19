import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, BookOpen, BarChart2, HelpCircle, Settings, Brain } from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'
import AccessibilityMenu from './AccessibilityMenu'

const NAV_ITEMS = [
  { path: '/',         label: 'Home',     icon: Home },
  { path: '/learn',    label: 'Learn',    icon: BookOpen },
  { path: '/progress', label: 'Progress', icon: BarChart2 },
  { path: '/help',     label: 'Help',     icon: HelpCircle },
]

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { speak, settings } = useAccessibility()

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const handleNav = (label) => {
    if (settings.ttsEnabled) speak(label)
  }

  return (
    <>
      {/* ── Desktop header ─────────────────────────────────── */}
      <header
        className="hidden md:block sticky top-0 z-30 border-b"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderColor: 'rgba(79,70,229,0.12)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl no-underline"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
            onClick={() => handleNav('Home')}
          >
            <span className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary)' }}>
              <Brain size={20} color="#fff" />
            </span>
            NeuroLearn
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const active = isActive(path)
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => handleNav(label)}
                  className="relative flex items-center gap-2 px-4 min-h-[48px] rounded-xl text-sm font-bold transition-colors duration-150 no-underline"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    backgroundColor: active ? 'var(--color-bg-muted)' : 'transparent',
                  }}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={18} />
                  {label}
                  {active && (
                    <motion.span
                      layoutId="desktop-nav-indicator"
                      className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Accessibility button */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open display settings"
            className="w-11 h-11 flex items-center justify-center rounded-xl border-2 transition-colors duration-150 cursor-pointer"
            style={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              backgroundColor: 'transparent',
            }}
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* ── Mobile top bar (logo + settings only) ──────────── */}
      <header
        className="md:hidden sticky top-0 z-30 border-b px-4 flex items-center justify-between h-14"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderColor: 'rgba(79,70,229,0.12)',
        }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg no-underline"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          <span className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary)' }}>
            <Brain size={16} color="#fff" />
          </span>
          NeuroLearn
        </Link>
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open display settings"
          className="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer"
          style={{ color: 'var(--color-primary)' }}
        >
          <Settings size={20} />
        </button>
      </header>

      {/* ── Mobile bottom tab bar ───────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t flex items-center justify-around h-16 safe-area-inset-bottom"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderColor: 'rgba(79,70,229,0.12)',
        }}
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const active = isActive(path)
          return (
            <Link
              key={path}
              to={path}
              onClick={() => handleNav(label)}
              className="flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-xl transition-colors duration-150 no-underline"
              style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
              aria-current={active ? 'page' : undefined}
              aria-label={label}
            >
              <Icon size={22} />
              <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {label}
              </span>
              {active && (
                <motion.span
                  layoutId="mobile-nav-indicator"
                  className="absolute bottom-1 w-1 h-1 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Accessibility slide-out panel */}
      <AccessibilityMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

export default Header
