import React from 'react';
import { VolumeX } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import '../styles/TextToSpeech.css';
import SpeakerIcon from '../assets/speaker-icon.png'; // Import your speaker icon image

const TextToSpeech = ({ text, className }) => {
  const { speak, stopSpeaking, settings } = useAccessibility();
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const handleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      speak(text);
      setIsSpeaking(true);

      // Find the approximate duration based on text length and reading speed
      const wordCount = text.split(/\s+/).length;
      // Average reading speed is ~140 words per minute
      const durationInMs = (wordCount / 140) * 60 * 1000 / settings.readingSpeed;

      // Set speaking state to false after estimated duration
      setTimeout(() => {
        setIsSpeaking(false);
      }, durationInMs);
    }
  };

  if (!settings.textToSpeechEnabled) {
    return null;
  }

  return (
    <button
      className={`text-to-speech-button ${className || ''} ${isSpeaking ? 'speaking' : ''}`}
      onClick={handleSpeech}
      aria-label={isSpeaking ? 'Stop reading' : 'Read text aloud'}
    >
      {isSpeaking ? <VolumeX size={20} /> : <img src={SpeakerIcon} alt="Read Aloud" className="tts-icon" />}
      <span className="tts-tooltip">
        {isSpeaking ? 'Stop reading' : 'Read aloud'}
      </span>
    </button>
  );
};

export default TextToSpeech;