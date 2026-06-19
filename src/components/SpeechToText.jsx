import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../contexts/AccessibilityContext';
import '../styles/SpeechToText.css';

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const { settings } = useAccessibility();
  const navigate = useNavigate();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        processCommand(transcript);
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.error('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  // Process voice commands
  const processCommand = (text) => {
    if (!text) return;
    
    const command = text.toLowerCase().trim();
    
    // Navigation commands
    if (command.includes('go to home') || command === 'home') {
      navigate('/');
    } else if (command.includes('go to games') || command === 'games') {
      navigate('/games');
    } else if (command.includes('go to chatbot') || command.includes('chat') || command.includes('helper')) {
      navigate('/chatbot');
    } else if (command.includes('go to profile') || command === 'profile') {
      navigate('/profile');
    }
    
    // Reset transcript
    setTranscript('');
  };

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  if (!settings.speechToTextEnabled) {
    return null;
  }

  return (
    <div className="speech-to-text">
      <button 
        className={`mic-button ${isListening ? 'listening' : ''}`}
        onClick={toggleListening}
        aria-label={isListening ? 'Stop listening' : 'Start voice command'}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </button>
      
      {isListening && (
        <div className="listening-indicator">
          <div className="listening-text">Listening...</div>
          <div className="listening-waves">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechToText;