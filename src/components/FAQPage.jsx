import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen, HelpCircle, BarChart2, MessageSquare } from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'

const FAQS = [
  {
    q: 'What is NeuroLearn and who is it for?',
    a: 'NeuroLearn is a learning platform built for students with dyslexia, ages 6–16. Every game starts with sound — not text — so you learn in the way that actually works for your brain.',
  },
  {
    q: 'How do the games help with dyslexia?',
    a: 'Our games use a sound-first approach. You hear letters, words, and sounds before you see them. This builds the phoneme awareness that underpins reading — the same approach used in evidence-based Structured Literacy programmes.',
  },
  {
    q: 'Is there any pressure or time limit in the games?',
    a: 'None at all. There are no timers, no lives to lose, and no "wrong" buzzer sounds. If an answer is incorrect, the game simply says "let us try again" and gives you another go.',
  },
  {
    q: 'How does the progress tracking work?',
    a: 'Your progress is shown as stars — not percentages or scores. Three stars means excellent, two means good, one means keep going. All tracked locally on your device for now.',
  },
  {
    q: 'How does the Learning Helper work?',
    a: 'The Learning Helper is a real AI powered by Claude. It can answer questions about dyslexia, give reading tips, explain how games work, and offer encouragement. Ask it anything!',
  },
  {
    q: 'Is NeuroLearn free to use?',
    a: 'Yes — completely free. We believe every dyslexic learner deserves proper support regardless of budget.',
  },
  {
    q: 'How often should my child use NeuroLearn?',
    a: 'Research suggests 15–30 minutes daily, or 3–5 sessions per week. Regular short sessions beat occasional long ones every time.',
  },
  {
    q: 'Can parents or teachers see progress?',
    a: 'A parent and teacher dashboard is coming. For now, the Progress page shows all recent activity and earned badges.',
  },
]

const QUICK_LINKS = [
  { to: '/learn',    icon: BookOpen,     label: 'All Games' },
  { to: '/help',     icon: MessageSquare, label: 'Learning Helper' },
  { to: '/progress', icon: BarChart2,    label: 'Your Progress' },
]

const FAQItem = ({ faq, index, isOpen, onToggle }) => {
  const { speak, settings, reducedMotion } = useAccessibility()

  const handleToggle = () => {
    if (!isOpen && settings.ttsEnabled) speak(faq.a)
    onToggle(index)
  }

  return (
    <div
      className="clay-card overflow-hidden cursor-pointer"
      onClick={handleToggle}
      role="button"
      aria-expanded={isOpen}
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleToggle()}
    >
      <div className="flex items-center justify-between gap-4 p-5">
        <div className="flex items-start gap-3">
          <HelpCircle size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
          <h3
            className="font-bold text-base"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            {faq.q}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={20} style={{ color: 'var(--color-text-muted)' }} />
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p
              className="px-5 pb-5 text-base"
              style={{ color: 'var(--color-text-muted)', paddingLeft: '2.75rem' }}
            >
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null)
  const { reducedMotion } = useAccessibility()

  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i)

  return (
    <div className="max-w-5xl mx-auto px-6 py-10" style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* Header */}
      <motion.div
        className="mb-10"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1
          className="text-3xl md:text-4xl font-extrabold mb-2"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          Frequently asked questions
        </h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '54ch' }}>
          Common questions about how NeuroLearn works and how it helps.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* FAQ list */}
        <div className="flex-1 flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={toggle}
            />
          ))}
        </div>

        {/* Sidebar */}
        <div className="lg:w-64 flex flex-col gap-5">
          <div className="clay-card p-5 flex flex-col gap-3">
            <h3
              className="font-extrabold text-sm"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            >
              Quick links
            </h3>
            {QUICK_LINKS.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 text-sm font-bold no-underline py-2 px-3 rounded-xl transition-colors duration-150"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-primary)',
                  backgroundColor: 'var(--color-bg-muted)',
                }}
              >
                <Icon size={15} /> {label}
              </Link>
            ))}
          </div>

          <div
            className="clay-card p-5 flex flex-col gap-4"
            style={{ backgroundColor: 'var(--color-bg-muted)' }}
          >
            <h3
              className="font-extrabold text-sm"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            >
              Still have questions?
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              The Learning Helper is available 24/7 and always happy to help.
            </p>
            <Link to="/help" className="btn-primary text-sm">
              Ask the Helper
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQPage
