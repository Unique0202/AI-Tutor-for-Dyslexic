import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import TextToSpeech from '../components/TextToSpeech';
import '../styles/ReadingAdventure.css';

const ReadingAdventure = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [highlightedWord, setHighlightedWord] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { speak, stopSpeaking } = useAccessibility();
  const textRef = useRef(null);
  
  const story = {
    title: "The Magic Forest",
    pages: [
      {
        text: "Once upon a time, there was a magical forest. The trees were tall and green. The flowers were bright and colorful. Animals lived happily in this special place.",
        image: "https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg"
      },
      {
        text: "In the middle of the forest, there was a small cottage. A wizard named Oliver lived there. He was kind and friendly to all the animals and plants.",
        image: "https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg"
      },
      {
        text: "Oliver had a magic wand. With his wand, he could make the flowers grow bigger and the trees grow taller. He used his magic to help the forest thrive.",
        image: "https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg"
      },
      {
        text: "One day, dark clouds appeared over the forest. Thunder boomed and lightning flashed. The animals were scared and ran to hide.",
        image: "https://images.pexels.com/photos/2531709/pexels-photo-2531709.jpeg"
      },
      {
        text: "Oliver wasn't afraid. He stepped outside with his magic wand. He waved it in the air and said some special words. Suddenly, the dark clouds began to move away.",
        image: "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg"
      },
      {
        text: "The sun came out again, shining brightly. The animals came out of hiding. They were happy and thankful. Oliver had saved the day with his kindness and courage.",
        image: "https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg"
      }
    ]
  };
  
  useEffect(() => {
    // Reset highlighted word when changing pages
    setHighlightedWord(null);
    setProgress(Math.round((currentPage / (story.pages.length - 1)) * 100));
  }, [currentPage]);
  
  const navigatePage = (direction) => {
    // Stop any ongoing reading when changing pages
    if (isReading) {
      stopSpeaking();
      setIsReading(false);
    }
    
    if (direction === 'next' && currentPage < story.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleWordClick = (word, cleanWord) => {
    // Stop any ongoing reading
    stopSpeaking();
    setIsReading(false);
    
    // Highlight and speak the selected word
    setHighlightedWord(word);
    speak(cleanWord);
  };
  
  const readPageAloud = () => {
    if (isReading) {
      stopSpeaking();
      setIsReading(false);
      return;
    }
    
    setIsReading(true);
    speak(story.pages[currentPage].text);
    
    // Reset reading state after approximate reading time
    const wordCount = story.pages[currentPage].text.split(/\s+/).length;
    // Average reading speed is ~140 words per minute
    const durationInMs = (wordCount / 140) * 60 * 1000;
    
    setTimeout(() => {
      setIsReading(false);
    }, durationInMs);
  };
  
  const renderTextWithClickableWords = (text) => {
    // Split text by spaces and punctuation but keep the punctuation
    const words = text.match(/[\w']+|[.,!?;]/g);
    
    return words.map((word, index) => {
      const isPunctuation = /^[.,!?;]$/.test(word);
      const displayWord = isPunctuation ? word : word + " ";
      const isHighlighted = word === highlightedWord;
      
      if (isPunctuation) {
        return <span key={index}>{displayWord}</span>;
      }
      
      return (
        <span
          key={index}
          className={`story-word ${isHighlighted ? 'highlighted' : ''}`}
          onClick={() => handleWordClick(word, word.replace(/[.,!?;]$/, ''))}
        >
          {displayWord}
        </span>
      );
    });
  };
  
  const currentPageData = story.pages[currentPage];
  
  return (
    <div className="reading-adventure">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="story-container">
        <div className="story-image-container">
          <img src={currentPageData.image} alt="Story illustration" className="story-image" />
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
              </div>
            )}
          </div>
          
          <div className="reading-controls">
            <button 
              className="read-aloud-button"
              onClick={readPageAloud}
            >
              {isReading ? "Stop Reading" : "Read Aloud"}
            </button>
          </div>
        </div>
      </div>
      
      <div className="navigation-controls">
        <button 
          className={`nav-button ${currentPage === 0 ? 'disabled' : ''}`}
          onClick={() => navigatePage('prev')}
          disabled={currentPage === 0}
        >
          <ChevronLeft size={24} />
          <span>Previous</span>
        </button>
        
        <div className="page-indicator">
          Page {currentPage + 1} of {story.pages.length}
        </div>
        
        <button 
          className={`nav-button ${currentPage === story.pages.length - 1 ? 'disabled' : ''}`}
          onClick={() => navigatePage('next')}
          disabled={currentPage === story.pages.length - 1}
        >
          <span>Next</span>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default ReadingAdventure;