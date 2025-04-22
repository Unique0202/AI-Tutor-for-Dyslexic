import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Shuffle, Check, ArrowLeft } from 'lucide-react';
import '../styles/WordBuilder.css';

const WordBuilder = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [hints, setHints] = useState(3);
  const { speak } = useAccessibility();
  
  const words = {
    1: [
      { word: 'CAT', image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg', hint: 'A furry pet that meows' },
      { word: 'DOG', image: 'https://images.pexels.com/photos/39317/chihuahua-dog-puppy-cute-39317.jpeg', hint: 'A pet that barks' },
      { word: 'SUN', image: 'https://images.pexels.com/photos/301599/pexels-photo-301599.jpeg', hint: 'It shines in the sky during the day' },
      { word: 'HAT', image: 'https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg', hint: 'You wear it on your head' }
    ],
    2: [
      { word: 'FISH', image: 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg', hint: 'It lives in water and has fins' },
      { word: 'BOOK', image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg', hint: 'You read stories from it' },
      { word: 'CAKE', image: 'https://images.pexels.com/photos/264939/pexels-photo-264939.jpeg', hint: 'A sweet dessert for birthdays' },
      { word: 'STAR', image: 'https://images.pexels.com/photos/1257860/pexels-photo-1257860.jpeg', hint: 'Twinkles in the night sky' }
    ],
    3: [
      { word: 'HOUSE', image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg', hint: 'People live in it' },
      { word: 'APPLE', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg', hint: 'A red or green fruit' },
      { word: 'WATER', image: 'https://images.pexels.com/photos/40784/drops-of-water-water-nature-liquid-40784.jpeg', hint: 'You drink it when thirsty' },
      { word: 'BEACH', image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg', hint: 'Sandy place by the ocean' }
    ]
  };
  
  useEffect(() => {
    startRound();
  }, [level]);
  
  const startRound = () => {
    // Get current level words
    const currentLevelWords = words[level] || words[1];
    
    // Select a random word
    const randomIndex = Math.floor(Math.random() * currentLevelWords.length);
    const wordData = currentLevelWords[randomIndex];
    setCurrentWord(wordData);
    
    // Scramble the letters
    const letters = wordData.word.split('');
    const scrambled = [...letters].sort(() => Math.random() - 0.5);
    
    // Create letter objects with IDs
    const scrambledWithIds = scrambled.map((letter, index) => ({
      id: index,
      letter,
      selected: false
    }));
    
    setScrambledLetters(scrambledWithIds);
    setSelectedLetters([]);
    setFeedback(null);
    
    // Speak the instruction
    speak(`Build the word for this picture. It has ${letters.length} letters.`);
  };
  
  const shuffleLetters = () => {
    setScrambledLetters(prev => [...prev].sort(() => Math.random() - 0.5));
  };
  
  const selectLetter = (letter) => {
    if (letter.selected) return;
    
    // Add to selected letters
    setSelectedLetters(prev => [...prev, letter]);
    
    // Mark as selected in scrambled array
    setScrambledLetters(prev => 
      prev.map(l => l.id === letter.id ? { ...l, selected: true } : l)
    );
    
    // Speak the letter
    speak(letter.letter);
  };
  
  const unselectLetter = (index) => {
    const letter = selectedLetters[index];
    
    // Remove from selected
    setSelectedLetters(prev => prev.filter((_, i) => i !== index));
    
    // Mark as unselected in scrambled array
    setScrambledLetters(prev => 
      prev.map(l => l.id === letter.id ? { ...l, selected: false } : l)
    );
  };
  
  const checkWord = () => {
    const builtWord = selectedLetters.map(l => l.letter).join('');
    
    if (builtWord === currentWord.word) {
      // Correct!
      setFeedback({
        type: 'success',
        message: `Great job! You built the word "${currentWord.word}" correctly!`
      });
      speak(`Great job! You built the word ${currentWord.word} correctly!`);
      setScore(score + (level * 5));
      
      // Check if level should increase
      if (score + (level * 5) >= level * 15 && level < 3) {
        setTimeout(() => {
          setLevel(level + 1);
          speak(`Moving to level ${level + 1}!`);
        }, 2000);
      } else {
        setTimeout(startRound, 2000);
      }
    } else {
      // Incorrect
      setFeedback({
        type: 'error',
        message: `That's not quite right. Try again!`
      });
      speak(`That's not quite right. Try again!`);
      
      // Reset selected letters
      setSelectedLetters([]);
      setScrambledLetters(prev => 
        prev.map(l => ({ ...l, selected: false }))
      );
    }
  };
  
  const useHint = () => {
    if (hints <= 0) return;
    
    setHints(hints - 1);
    speak(currentWord.hint);
    setFeedback({
      type: 'info',
      message: currentWord.hint
    });
  };
  
  const resetSelection = () => {
    setSelectedLetters([]);
    setScrambledLetters(prev => 
      prev.map(l => ({ ...l, selected: false }))
    );
  };
  
  if (!currentWord) return <div>Loading...</div>;
  
  return (
    <div className="word-builder">
      <div className="game-status">
        <div className="level">Level: {level}</div>
        <div className="score">Score: {score}</div>
        <div className="hints">Hints: {hints}</div>
      </div>
      
      <div className="word-challenge">
        <div className="image-container">
          <img src={currentWord.image} alt="Word to build" className="challenge-image" />
        </div>
        
        <div className="word-building-area">
          <div className="selected-letters">
            {selectedLetters.length === 0 ? (
              <div className="empty-selection">Select letters to build the word</div>
            ) : (
              selectedLetters.map((letter, index) => (
                <div 
                  key={`selected-${index}`} 
                  className="selected-letter"
                  onClick={() => unselectLetter(index)}
                >
                  {letter.letter}
                </div>
              ))
            )}
          </div>
          
          <div className="letter-actions">
            <button className="action-button hint-button" onClick={useHint} disabled={hints <= 0}>
              Get Hint
            </button>
            <button className="action-button reset-button" onClick={resetSelection}>
              <ArrowLeft size={20} />
              Reset
            </button>
            <button className="action-button shuffle-button" onClick={shuffleLetters}>
              <Shuffle size={20} />
              Shuffle
            </button>
          </div>
          
          <div className="available-letters">
            {scrambledLetters.map((letter) => (
              <div 
                key={`scrambled-${letter.id}`}
                className={`letter-tile ${letter.selected ? 'used' : ''}`}
                onClick={() => !letter.selected && selectLetter(letter)}
              >
                {letter.selected ? '' : letter.letter}
              </div>
            ))}
          </div>
          
          <button 
            className="check-button"
            onClick={checkWord}
            disabled={selectedLetters.length !== currentWord.word.length}
          >
            <Check size={20} />
            Check Word
          </button>
        </div>
      </div>
      
      {feedback && (
        <div className={`feedback ${feedback.type}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default WordBuilder;