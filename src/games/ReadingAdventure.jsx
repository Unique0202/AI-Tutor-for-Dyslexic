import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'
import GameWrapper from '../components/GameWrapper'

const STORIES = {
  1: {
    title: 'The Magic Forest',
    pages: [
      {
        text: 'Once upon a time, there was a magical forest. The trees were tall and green. The flowers were bright and colorful. Animals lived happily in this special place.',
        image: 'https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg',
      },
      {
        text: 'In the middle of the forest, there was a small cottage. A kind wizard named Oliver lived there. He was friendly to all the animals and plants in the forest.',
        image: 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg',
      },
      {
        text: 'Oliver had a magic wand. With his wand, he could make flowers grow bigger and trees grow taller. He used his magic to help the forest stay healthy and happy.',
        image: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg',
      },
      {
        text: 'One morning, Oliver found a scared rabbit. The rabbit\'s home was destroyed by a storm. Oliver waved his wand and made a new burrow for the rabbit.',
        image: 'https://images.pexels.com/photos/45853/grey-crowned-crane-bird-crane-animal-45853.jpeg',
      },
      {
        text: 'As the sun set, all the animals gathered to thank Oliver. The forest was safe and happy because of his kindness. Oliver smiled and promised to always help.',
        image: 'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg',
      },
    ],
  },
  2: {
    title: 'The Brave Explorer',
    pages: [
      {
        text: 'Emma was an adventurous girl who loved exploring. One rainy afternoon, she discovered an ancient map in her grandfather\'s attic. The faded parchment showed a mysterious island.',
        image: 'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg',
      },
      {
        text: 'After weeks of research, Emma decoded the map\'s symbols. It revealed a path through dangerous jungles to a hidden temple. She packed supplies and set sail on her small boat.',
        image: 'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg',
      },
      {
        text: 'The journey was difficult. Emma faced wild animals, steep cliffs, and raging rivers. But she persevered, using her compass and wits to navigate each challenge.',
        image: 'https://images.pexels.com/photos/358457/pexels-photo-358457.jpeg',
      },
      {
        text: 'Deep in the jungle, Emma found the ancient temple covered in vines. The entrance was guarded by stone statues. She carefully solved the puzzle lock to open the heavy doors.',
        image: 'https://images.pexels.com/photos/1054289/pexels-photo-1054289.jpeg',
      },
      {
        text: 'Inside, she found not gold or jewels, but a library of ancient books. Emma realised the real treasure was this forgotten wisdom. She vowed to share it with the world.',
        image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
      },
    ],
  },
  3: {
    title: 'The Cosmic Voyage',
    pages: [
      {
        text: 'Commander Aria adjusted the thrusters as the starship Nebula approached the anomaly. Her crew monitored the energy readings with growing excitement.',
        image: 'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg',
      },
      {
        text: 'The science officer reported unusual emissions. It was a wormhole — unlike anything in their databases. The crew prepared for a historic first contact.',
        image: 'https://images.pexels.com/photos/2156/sky-earth-space-working.jpg',
      },
      {
        text: 'As they crossed into the wormhole, space and time seemed to stretch around them. The viewscreen showed impossible shapes as the ship passed through.',
        image: 'https://images.pexels.com/photos/73871/rocket-launch-rocket-take-off-nasa-73871.jpeg',
      },
      {
        text: 'Emerging in an unknown galaxy, they detected huge structures orbiting a blue star. The massive objects pulsed with energy patterns from an advanced civilization.',
        image: 'https://images.pexels.com/photos/39561/solar-flare-sun-eruption-energy-39561.jpeg',
      },
      {
        text: 'After establishing communication, the aliens shared knowledge of civilization networks spanning many galaxies. Humanity stood at the threshold of a new era.',
        image: 'https://images.pexels.com/photos/355935/pexels-photo-355935.jpeg',
      },
    ],
  },
}

// ─── Inner reading game ────────────────────────────────────────────────────
const ReadingAdventureGame = ({ level, onComplete }) => {
  const [page, setPage] = useState(0)
  const [highlight, setHighlight] = useState(null)
  const [readingIdx, setReadingIdx] = useState(-1)
  const [isReading, setIsReading] = useState(false)
  const wordRefs  = useRef([])
  const activeUtt = useRef(null) // track current utterance so we can cancel it specifically
  const { speak, settings, reducedMotion } = useAccessibility()

  const story     = STORIES[level]
  const pageData  = story.pages[page]
  const totalPages = story.pages.length
  const isLast    = page === totalPages - 1

  // Cancel speech on unmount (handles navigating away mid-read)
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
      activeUtt.current = null
    }
  }, [])

  // Stop reading on page change
  useEffect(() => {
    window.speechSynthesis.cancel()
    activeUtt.current = null
    setIsReading(false)
    setReadingIdx(-1)
    setHighlight(null)
  }, [page])

  const stopReading = useCallback(() => {
    window.speechSynthesis.cancel()
    activeUtt.current = null
    setIsReading(false)
    setReadingIdx(-1)
  }, [])

  const readAloud = () => {
    if (isReading) { stopReading(); return }
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    setIsReading(true)
    const utt = new SpeechSynthesisUtterance(pageData.text)
    utt.rate = settings?.readingSpeed || 1
    utt.onboundary = (e) => {
      if (e.name === 'word') {
        const words = pageData.text.match(/[\w']+|[.,!?]/g) || []
        let chars = 0
        for (let i = 0; i < words.length; i++) {
          if (chars === e.charIndex) { setReadingIdx(i); setHighlight(words[i]); break }
          chars += words[i].length + 1
        }
      }
    }
    utt.onend = () => {
      activeUtt.current = null
      setIsReading(false)
      setReadingIdx(-1)
      setHighlight(null)
    }
    activeUtt.current = utt
    window.speechSynthesis.speak(utt)
  }

  const words = pageData.text.match(/[\w']+|[.,!?]/g) || []
  wordRefs.current = words.map((_, i) => wordRefs.current[i] ?? React.createRef())

  const progress = Math.round((page / (totalPages - 1)) * 100)

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5 py-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold shrink-0" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-muted)' }}>
          Page {page + 1} of {totalPages}
        </span>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Story content */}
      <div className="clay-card overflow-hidden">
        {/* Image */}
        <div className="w-full h-44 overflow-hidden" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
          <img
            src={pageData.image}
            alt=""
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none' }}
          />
        </div>

        {/* Text */}
        <div className="p-6 flex flex-col gap-4">
          <p
            className="text-lg leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
          >
            {words.map((word, i) => {
              const isPunct = /^[.,!?]$/.test(word)
              const isHighlighted = highlight === word && i === readingIdx
              return (
                <span
                  key={i}
                  ref={wordRefs.current[i]}
                  onClick={() => !isPunct && speak(word.replace(/[.,!?]$/, ''))}
                  className={isPunct ? '' : 'cursor-pointer rounded px-0.5 transition-colors duration-100'}
                  style={{
                    backgroundColor: isHighlighted ? '#FDE68A' : 'transparent',
                    fontWeight: isHighlighted ? 700 : 'inherit',
                  }}
                  aria-current={isHighlighted ? 'true' : undefined}
                >
                  {word}{isPunct ? '' : ' '}
                </span>
              )
            })}
          </p>

          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Tap any word to hear it spoken.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={readAloud}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl font-bold text-sm border-2 cursor-pointer transition-colors duration-150 ${isReading ? 'btn-secondary' : 'btn-primary'}`}
          style={{ minHeight: '48px' }}
        >
          {isReading ? <><VolumeX size={17} /> Stop</> : <><Volume2 size={17} /> Read aloud</>}
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 0 || isReading}
            className="flex items-center gap-1.5 btn-secondary py-2 px-4 text-sm"
            style={{ minHeight: '48px' }}
          >
            <ChevronLeft size={18} /> Back
          </button>

          {isLast ? (
            <button
              onClick={() => onComplete(3, 'You finished the whole story! Fantastic reading!')}
              className="btn-success flex items-center gap-2 py-2 px-5 text-sm"
              style={{ minHeight: '48px' }}
            >
              Finish story
            </button>
          ) : (
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={isReading}
              className="flex items-center gap-1.5 btn-primary py-2 px-4 text-sm"
              style={{ minHeight: '48px' }}
            >
              Next <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Public component ──────────────────────────────────────────────────────
const ReadingAdventure = () => {
  const [level, setLevel] = useState(1)
  const levelLabels = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <div className="flex gap-2 justify-center mb-5">
        {[1, 2, 3].map(l => (
          <button
            key={l}
            onClick={() => { window.speechSynthesis.cancel(); setLevel(l) }}
            className="px-4 py-2 rounded-xl font-bold text-sm border-2 cursor-pointer transition-all duration-150"
            style={{
              fontFamily: 'var(--font-heading)',
              backgroundColor: level === l ? 'var(--color-primary)' : 'var(--color-bg-card)',
              color: level === l ? '#fff' : 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
            }}
          >
            {levelLabels[l]}
          </button>
        ))}
      </div>

      <GameWrapper
        key={level}
        title="Reading Adventure"
        icon={Volume2}
        iconColor="#4F46E5"
        iconBg="#EEF2FF"
        instructions={[
          'Tap "Read aloud" to hear the whole page spoken to you.',
          'Words highlight in yellow as they are read — follow along.',
          'Tap any word on the page to hear just that word.',
          'Go at your own pace — take as long as you need.',
        ]}
        ttsText="In Reading Adventure, tap Read Aloud to hear the page. Words highlight in yellow as they are read. Tap any word to hear it on its own. There is no timer."
      >
        {({ onComplete }) => (
          <ReadingAdventureGame key={level} level={level} onComplete={onComplete} />
        )}
      </GameWrapper>
    </div>
  )
}

export default ReadingAdventure
