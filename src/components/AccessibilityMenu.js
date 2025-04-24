import React from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { X, Type, Sun, CircleOff} from 'lucide-react';
import '../styles/AccessibilityMenu.css';

const LetterSpacing = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5V19M9 8L6 5L3 8M9 16L6 19L3 16M21 8L18 5L15 8M21 16L18 19L15 16" />
  </svg>
);

const AccessibilityMenu = ({ onClose }) => {
  const { settings, updateSettings } = useAccessibility();

  const handleChange = (setting) => {
    updateSettings({ [setting]: !settings[setting] });
  };

  const handleSliderChange = (e) => {
    updateSettings({ readingSpeed: parseFloat(e.target.value) });
  };

  return (
    <div className="accessibility-menu">
      <div className="accessibility-header">
        <h2>Accessibility Settings</h2>
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      
      <div className="accessibility-options">
        <div className="option">
          <div className="option-label">
            <Type size={20} />
            <span>Dyslexia-friendly Font</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.dyslexicFont}
              onChange={() => handleChange('dyslexicFont')}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="option">
          <div className="option-label">
            <Sun size={20} />
            <span>High Contrast</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={() => handleChange('highContrast')}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="option">
          <div className="option-label">
            <Type size={20} />
            <span>Larger Text</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.largeText}
              onChange={() => handleChange('largeText')}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="option">
          <div className="option-label">
            <LetterSpacing size={20} />
            <span>Extra Spacing</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.extraSpacing}
              onChange={() => handleChange('extraSpacing')}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="option">
          <div className="option-label">
            <CircleOff size={20} />
            <span>Text-to-Speech</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.textToSpeechEnabled}
              onChange={() => handleChange('textToSpeechEnabled')}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="option">
          <div className="option-label">
            <CircleOff size={20} />
            <span>Speech-to-Text</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.speechToTextEnabled}
              onChange={() => handleChange('speechToTextEnabled')}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="option option-slider">
          <div className="option-label">
            <span>Reading Speed: {settings.readingSpeed}x</span>
          </div>
          <inputs
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.readingSpeed}
            onChange={handleSliderChange}
            className="range-slider"
          />
          <div className="range-labels">
            <span>Slower</span>
            <span>Faster</span>
          </div>
        </div>
      </div>
      
      <div className="accessibility-footer">
        <button className="btn" onClick={onClose}>
          Save & Close
        </button>
      </div>
    </div>
  );
};

export default AccessibilityMenu;