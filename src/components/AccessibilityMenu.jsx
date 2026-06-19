import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Type, Moon, Sun, Contrast, AlignLeft,
  Volume2, VolumeX, Mic, MicOff, ZoomIn
} from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'

const Toggle = ({ enabled, onToggle, label, iconOn, iconOff }) => (
  <div className="flex items-center justify-between py-3 border-b border-indigo-50">
    <div className="flex items-center gap-3">
      <span className="text-indigo-400">{enabled ? iconOn : iconOff}</span>
      <span className="font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        {label}
      </span>
    </div>
    <button
      onClick={onToggle}
      aria-label={`${label}: ${enabled ? 'on' : 'off'}`}
      className="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      style={{ backgroundColor: enabled ? 'var(--color-primary)' : '#D1D5DB' }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
        style={{ transform: enabled ? 'translateX(24px)' : 'translateX(0)' }}
      />
    </button>
  </div>
)

const OptionGroup = ({ label, options, current, onChange }) => (
  <div className="py-3 border-b border-indigo-50">
    <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)' }}>
      {label}
    </p>
    <div className="flex gap-2 flex-wrap">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all duration-150 cursor-pointer"
          style={{
            backgroundColor: current === opt.value ? 'var(--color-primary)' : '#fff',
            color: current === opt.value ? '#fff' : 'var(--color-primary)',
            borderColor: 'var(--color-primary)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
)

const AccessibilityMenu = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useAccessibility()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-full flex flex-col shadow-2xl"
            style={{ backgroundColor: 'var(--color-bg)', borderLeft: 'var(--border-card)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-100">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                Display Settings
              </h2>
              <button
                onClick={onClose}
                aria-label="Close settings"
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-indigo-50 transition-colors cursor-pointer"
                style={{ color: 'var(--color-text)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Controls */}
            <div className="flex-1 overflow-y-auto px-6 py-2">

              <OptionGroup
                label="Theme"
                current={settings.theme}
                onChange={v => updateSettings({ theme: v })}
                options={[
                  { value: 'light', label: '☀️ Light' },
                  { value: 'dark', label: '🌙 Dark' },
                  { value: 'high-contrast', label: '⬛ Contrast' },
                ]}
              />

              <OptionGroup
                label="Font"
                current={settings.font}
                onChange={v => updateSettings({ font: v })}
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'opendyslexic', label: 'OpenDyslexic' },
                ]}
              />

              <OptionGroup
                label="Text Size"
                current={settings.fontSize}
                onChange={v => updateSettings({ fontSize: v })}
                options={[
                  { value: 'normal', label: 'Normal' },
                  { value: 'large', label: 'Large' },
                  { value: 'xlarge', label: 'X-Large' },
                ]}
              />

              <OptionGroup
                label="Line Spacing"
                current={settings.lineSpacing}
                onChange={v => updateSettings({ lineSpacing: v })}
                options={[
                  { value: 'normal', label: 'Normal' },
                  { value: 'wide', label: 'Wide' },
                ]}
              />

              <Toggle
                label="Read Aloud"
                enabled={settings.ttsEnabled}
                onToggle={() => updateSettings({ ttsEnabled: !settings.ttsEnabled })}
                iconOn={<Volume2 size={18} />}
                iconOff={<VolumeX size={18} />}
              />

              <Toggle
                label="Voice Input"
                enabled={settings.sttEnabled}
                onToggle={() => updateSettings({ sttEnabled: !settings.sttEnabled })}
                iconOn={<Mic size={18} />}
                iconOff={<MicOff size={18} />}
              />

              {/* Reading speed */}
              <div className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)' }}>
                    Reading Speed
                  </p>
                  <span className="text-sm font-bold px-2 py-0.5 rounded-lg"
                    style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                    {settings.readingSpeed}×
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.readingSpeed}
                  onChange={e => updateSettings({ readingSpeed: parseFloat(e.target.value) })}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: 'var(--color-primary)' }}
                  aria-label="Reading speed"
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  <span>Slower</span>
                  <span>Faster</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-indigo-100">
              <button onClick={onClose} className="btn-primary w-full">
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AccessibilityMenu
