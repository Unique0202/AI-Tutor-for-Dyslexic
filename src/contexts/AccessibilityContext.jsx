import React, { createContext, useState, useContext, useEffect } from 'react'

const AccessibilityContext = createContext()

export const useAccessibility = () => useContext(AccessibilityContext)

const DEFAULTS = {
  theme: 'light',           // 'light' | 'dark' | 'high-contrast'
  font: 'default',          // 'default' | 'opendyslexic'
  fontSize: 'normal',       // 'normal' | 'large' | 'xlarge'
  lineSpacing: 'normal',    // 'normal' | 'wide'
  ttsEnabled: true,
  sttEnabled: true,
  readingSpeed: 1.0,
}

const applyBodyClasses = (settings) => {
  const body = document.body

  // Theme
  body.classList.toggle('dark-mode', settings.theme === 'dark')
  body.classList.toggle('high-contrast', settings.theme === 'high-contrast')

  // Font
  body.classList.toggle('font-dyslexic', settings.font === 'opendyslexic')

  // Font size
  body.classList.toggle('font-size-large', settings.fontSize === 'large')
  body.classList.toggle('font-size-xlarge', settings.fontSize === 'xlarge')

  // Line spacing
  body.classList.toggle('line-spacing-wide', settings.lineSpacing === 'wide')
}

const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('neurolearn-accessibility')
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS
    } catch {
      return DEFAULTS
    }
  })

  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    applyBodyClasses(settings)
    try {
      localStorage.setItem('neurolearn-accessibility', JSON.stringify(settings))
    } catch {}
  }, [settings])

  const updateSettings = (patch) =>
    setSettings(prev => ({ ...prev, ...patch }))

  const speak = (text, rate = settings.readingSpeed) => {
    if (!settings.ttsEnabled || !text) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => window.speechSynthesis.cancel()

  return (
    <AccessibilityContext.Provider
      value={{ settings, updateSettings, speak, stopSpeaking, reducedMotion }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export default AccessibilityProvider
