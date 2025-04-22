import React, { createContext, useState, useContext, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    dyslexicFont: true,
    highContrast: false,
    largeText: false,
    extraSpacing: false,
    textToSpeechEnabled: true,
    speechToTextEnabled: true,
    readingSpeed: 1.0,
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    
    // Apply settings to body element
    const body = document.body;
    body.classList.toggle('dyslexic-font', settings.dyslexicFont);
    body.classList.toggle('high-contrast', settings.highContrast);
    body.classList.toggle('large-text', settings.largeText);
    body.classList.toggle('extra-spacing', settings.extraSpacing);
  }, [settings]);

  // Function to update settings
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Text-to-Speech function
  const speak = (text, rate = settings.readingSpeed) => {
    if (!settings.textToSpeechEnabled) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <AccessibilityContext.Provider 
      value={{ 
        settings, 
        updateSettings,
        speak,
        stopSpeaking
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;