import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import '../styles/ReadingAdventure.css';
import TextToSpeech from '../components/TextToSpeech'; // Ensure this import exists

const ReadingAdventure = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [highlightedWord, setHighlightedWord] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isReading, setIsReading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { speak, stopSpeaking, settings } = useAccessibility(); // Ensure 'settings' is also in your context
  const textRef = useRef(null);
  const wordRefs = useRef([]);
  const [speechUtterance, setSpeechUtterance] = useState(null); // To manage the current speech

  const stories = {
    1: {
      title: "The Magic Forest (Beginner)",
      pages: [
        {
          text: "Once upon a time, there was a magical forest. The trees were tall and green. The flowers were bright and colorful. Animals lived happily in this special place.",
          image: "https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg"
        },
        {
          text: "In the middle of the forest, there was a small cottage. A kind wizard named Oliver lived there. He was friendly to all the animals and plants in the forest.",
          image: "https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg"
        },
        {
          text: "Oliver had a magic wand. With his wand, he could make flowers grow bigger and trees grow taller. He used his magic to help the forest stay healthy and happy.",
          image: "https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg"
        },
        {
          text: "One morning, Oliver found a scared rabbit. The rabbit's home was destroyed by a storm. Oliver waved his wand and made a new burrow for the rabbit.",
          image: "https://images.pexels.com/photos/45853/grey-crowned-crane-bird-crane-animal-45853.jpeg"
        },
        {
          text: "Later that day, Oliver helped a baby bird learn to fly. He gave the bird courage with his magic. Soon, the bird was flying high in the sky with its family.",
          image: "https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg"
        },
        {
          text: "As the sun set, all the animals gathered to thank Oliver. The forest was safe and happy because of his kindness. Oliver smiled and promised to always help.",
          image: "https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg"
        }
      ]
    },
    2: {
      title: "The Brave Explorer (Intermediate)",
      pages: [
        {
          text: "Emma was an adventurous girl who loved exploring. One rainy afternoon, she discovered an ancient map in her grandfather's attic. The faded parchment showed a mysterious island.",
          image: "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg"
        },
        {
          text: "After weeks of research, Emma decoded the map's symbols. It revealed a path through dangerous jungles to a hidden temple. She packed supplies and set sail on her small boat.",
          image: "https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg"
        },
        {
          text: "The journey was difficult. Emma faced wild animals, steep cliffs, and raging rivers. But she persevered, using her compass and wits to navigate each challenge.",
          image: "https://images.pexels.com/photos/358457/pexels-photo-358457.jpeg"
        },
        {
          text: "Deep in the jungle, Emma found the ancient temple covered in vines. The entrance was guarded by stone statues. She carefully solved the puzzle lock to open the heavy doors.",
          image: "https://images.pexels.com/photos/1054289/pexels-photo-1054289.jpeg"
        },
        {
          text: "Inside, golden light revealed walls covered in strange writings. Emma studied them carefully. They told the story of a lost civilization that valued knowledge above all treasures.",
          image: "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg"
        },
        {
          text: "In the center chamber, Emma found not gold or jewels, but a library of ancient books. She realized the real treasure was this forgotten wisdom. She vowed to share it with the world.",
          image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg"
        }
      ]
    },
    3: {
      title: "The Cosmic Voyage (Advanced)",
      pages: [
        {
          text: "Commander Aria adjusted the quantum thrusters as the starship Nebula approached the anomaly. Her crew monitored the fluctuating energy readings with growing apprehension.",
          image: "https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg"
        },
        {
          text: "The science officer reported unprecedented tachyonic emissions. 'It's a wormhole,' Dr. Chen exclaimed, 'but its quantum signature is unlike anything in our databases.' The crew prepared for first contact protocols.",
          image: "https://images.pexels.com/photos/2156/sky-earth-space-working.jpg"
        },
        {
          text: "As they crossed the event horizon, spacetime distorted around them. The viewscreen showed impossible geometries as the ship transitioned through the interdimensional bridge.",
          image: "https://images.pexels.com/photos/73871/rocket-launch-rocket-take-off-nasa-73871.jpeg"
        },
        {
          text: "Emerging in an unknown galaxy, they detected artificial structures orbiting a blue giant star. The massive installations pulsed with energy patterns suggesting advanced technology.",
          image: "https://images.pexels.com/photos/39561/solar-flare-sun-eruption-energy-39561.jpeg"
        },
        {
          text: "First contact was initiated when crystalline entities boarded the Nebula. They communicated through complex light patterns that the ship's AI struggled to interpret.",
          image: "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg"
        },
        {
          text: "After establishing communication, the aliens shared knowledge of quantum civilization networks spanning multiple dimensions. Humanity stood at the threshold of a new cosmic era.",
          image: "https://images.pexels.com/photos/355935/pexels-photo-355935.jpeg"
        }
      ]
    }
  };
  const currentStory = stories[currentLevel];
  const currentPageData = currentStory.pages[currentPage];

  useEffect(() => {
    // Reset states when changing level or page
    setCurrentPage(0);
    setHighlightedWord(null);
    setCurrentWordIndex(-1);
    setIsReading(false);
    stopSpeaking();
    setSpeechUtterance(null); // Clear any existing utterance
  }, [currentLevel, stopSpeaking]);

  useEffect(() => {
    // Reset states when changing page
    setHighlightedWord(null);
    setCurrentWordIndex(-1);
    setIsReading(false);
    stopSpeaking();
    setSpeechUtterance(null); // Clear any existing utterance
    setProgress(Math.round((currentPage / (currentStory.pages.length - 1)) * 100));
  }, [currentPage, currentStory.pages.length, stopSpeaking]);

  const navigatePage = (direction) => {
    stopReading(); // Stop any ongoing reading when navigating
    if (direction === 'next' && currentPage < currentStory.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const stopReading = () => {
    stopSpeaking();
    setIsReading(false);
    setCurrentWordIndex(-1);
    if (speechUtterance) {
      speechUtterance.onend = null; // Clear the onend handler
      setSpeechUtterance(null);
    }
  };

  const handleWordClick = (word, cleanWord) => {
    stopReading();
    setHighlightedWord(word);
    speak(cleanWord);
  };

  const readPageAloud = () => {
    if (!window.speechSynthesis || !settings?.textToSpeechEnabled) {
      console.error("Web Speech API is not supported or is disabled.");
      return;
    }

    if (isReading) {
      stopReading();
      return;
    }

    setIsReading(true);
    const utterance = new SpeechSynthesisUtterance(currentStory.pages[currentPage].text);
    utterance.rate = settings?.readingSpeed || 1; // Use reading speed from context
    utterance.pitch = settings?.voicePitch || 1;   // Use voice pitch from context
    const voices = window.speechSynthesis.getVoices();
    if (settings?.voice && voices.some(v => v.name === settings.voice)) {
      utterance.voice = voices.find(v => v.name === settings.voice);
    }

    setSpeechUtterance(utterance);

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const word = currentStory.pages[currentPage].text.substring(event.charIndex, event.charIndex + event.length);
        const wordsArray = currentStory.pages[currentPage].text.match(/[\w']+|[.,!?;]/g) || [];
        let currentIndex = 0;
        let charsRead = 0;
        for (let i = 0; i < wordsArray.length; i++) {
          if (charsRead === event.charIndex) {
            setCurrentWordIndex(i);
            if (wordRefs.current[i]) {
              wordRefs.current[i].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
              });
            }
            break;
          }
          charsRead += wordsArray[i].length + 1; // +1 for the space
        }
        setHighlightedWord(word);
      }
    };

    utterance.onend = () => {
      setIsReading(false);
      setCurrentWordIndex(-1);
      setHighlightedWord(null);
      setSpeechUtterance(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const renderTextWithClickableWords = (text) => {
    const words = text.match(/[\w']+|[.,!?;]/g) || [];
    wordRefs.current = words.map((_, i) => wordRefs.current[i] ?? React.createRef());

    return words.map((word, index) => {
      const isPunctuation = /^[.,!?;]$/.test(word);
      const displayWord = isPunctuation ? word : word + " ";
      const isHighlighted = word === highlightedWord;
      const isCurrentlyReading = currentWordIndex === index && isReading;

      if (isPunctuation) {
        return <span key={index}>{displayWord}</span>;
      }

      return (
        <span
          key={index}
          ref={wordRefs.current[index]}
          className={`story-word
            ${isHighlighted ? 'highlighted' : ''}
            ${isCurrentlyReading ? 'reading-highlight' : ''}`}
          onClick={() => handleWordClick(word, word.replace(/[.,!?;]$/, ''))}
          aria-current={isCurrentlyReading ? "true" : undefined}
        >
          {displayWord}
        </span>
      );
    });
  };

  return (
    <div className="reading-adventure">
      <h2>{currentStory.title}</h2>
      <div className="level-buttons">
        {[1, 2, 3].map(level => (
          <button
            key={level}
            className={`level-button ${currentLevel === level ? 'active' : ''}`}
            onClick={() => setCurrentLevel(level)}
            disabled={isReading}
          >
            Level {level}
          </button>
        ))}
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="story-container">
        <div className="story-image-container">
          <img
            src={currentPageData.image}
            alt={`Illustration for page ${currentPage + 1}`}
            className="story-image"
          />
        </div>

        <div className="story-text-container" ref={textRef}>
          <div className="story-text">
            {renderTextWithClickableWords(currentPageData.text)}
          </div>

          <div className="word-help">
            {highlightedWord && (
              <div className="word-definition">
                <p className="focused-word">{highlightedWord}</p>
                <p className="word-hint">Click on any word to hear it pronounced</p>
                <TextToSpeech
                  text={highlightedWord.replace(/[.,!?;]$/, '')}
                  className="speak-word-button"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="controls-container">
        <div className="reading-controls">
          <button
            className={`read-aloud-button ${isReading ? 'stop' : 'play'}`}
            onClick={readPageAloud}
            aria-live="polite"
          >
            {isReading ? (
              <>
                <VolumeX size={18} /> Stop Reading
              </>
            ) : (
              <>
                <Volume2 size={18} /> Read Aloud
              </>
            )}
          </button>
        </div>

        <div className="navigation-controls">
          <button
            className={`nav-button ${currentPage === 0 ? 'disabled' : ''}`}
            onClick={() => navigatePage('prev')}
            disabled={currentPage === 0 || isReading}
          >
            <ChevronLeft size={24} />
            <span>Previous</span>
          </button>

          <div className="page-indicator">
            Page {currentPage + 1} of {currentStory.pages.length}
          </div>

          <button
            className={`nav-button ${currentPage === currentStory.pages.length - 1 ? 'disabled' : ''}`}
            onClick={() => navigatePage('next')}
            disabled={currentPage === currentStory.pages.length - 1 || isReading}
          >
            <span>Next</span>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingAdventure;