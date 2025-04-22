import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Volume2, Check, RefreshCw } from 'lucide-react';
import '../styles/SpellQuest.css';

const SpellQuest = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const { speak } = useAccessibility();
  const inputRef = useRef(null);
  
  const words = {
    1: [
      { word: 'cat', definition: 'A small furry animal with whiskers', hint: 'Begins with C, has 3 letters' },
      { word: 'dog', definition: 'A pet that barks', hint: 'Begins with D, has 3 letters' },
      { word: 'sun', definition: 'It shines in the sky during the day', hint: 'Begins with S, has 3 letters' },
      { word: 'hat', definition: 'You wear it on your head', hint: 'Begins with H, has 3 letters' }
    ],
    2: [
      { word: 'fish', definition: 'Lives in water and has fins', hint: 'Begins with F, has 4 letters' },
      { word: 'book', definition: 'You read stories in it', hint: 'Begins with B, has 4 letters' },
      { word: 'cake', definition: 'A sweet dessert for birthdays', hint: 'Begins with C, has 4 letters' },
      { word: 'star', definition: 'Twinkles in the night sky', hint: 'Begins with S, has 4 letters' }
    ],
    3: [
      { word: 'house', definition: 'A place where people live', hint: 'Begins with H, has 5 letters' },
      { word: 'apple', definition: 'A red or green fruit', hint: 'Begins with A, has 5 letters' },
      { word: 'water', definition: 'You drink it when thirsty', hint: 'Begins with W, has 5 letters' },
      { word: 'beach', definition: 'Sandy place by the ocean', hint: 'Begins with B, has 5 letters' }
    ]
  };
  
  useEffect(() => {
    startRound();
  }, [level]);
  
  useEffect(() => {
    // Focus on input field when component mounts or when a new word is presented
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWord]);
  
  const startRound = () => {
    // Get current level words
    const currentLevelWords = words[level] || words[1];
    
    // Select a random word
    const randomIndex = Math.floor(Math.random() * currentLevelWords.length);
    const wordData = currentLevelWords[randomIndex];
    setCurrentWord(wordData);
    
    // Reset states
    setUserInput('');
    setFeedback(null);
    setAttempts(0);
    setShowHint(false);
    
    // Speak the instruction with the definition
    speak(`Spell the word that means: ${wordData.definition}`);
  };
  
  const playWordAudio = () => {
    if (!currentWord) return;
    
    speak(currentWord.word);
  };
  
  const handleInputChange = (e) => {
    setUserInput(e.target.value.toLowerCase());
  };
  
  const showWordHint = () => {
    if (hints <= 0) return;
    
    setHints(hints - 1);
    setShowHint(true);
    speak(currentWord.hint);
  };
  
  const checkSpelling = () => {
    if (!userInput) return;
    
    if (userInput === currentWord.word) {
      // Correct!
      setFeedback({
        type: 'success',
        message: `Great job! "${currentWord.word}" is correct!`
      });
      speak(`Great job! ${currentWord.word} is correct!`);
      
      const attemptsBonus = attempts === 0 ? 10 : 5;
      const pointsEarned = (level * 5) + attemptsBonus;
      setScore(score + pointsEarned);
      
      // Check if level should increase
      if (score + pointsEarned >= level * 15 && level < 3) {
        setTimeout(() => {
          setLevel(level + 1);
          speak(`Moving to level ${level + 1}!`);
        }, 2000);
      } else {
        setTimeout(startRound, 2000);
      }
    } else {
      // Incorrect
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      // Check letter by letter to give feedback
      let correctCount = 0;
      for (let i = 0; i < userInput.length && i < currentWord.word.length; i++) {
        if (userInput[i] === currentWord.word[i]) {
          correctCount++;
        }
      }
      
      if (newAttempts >= 2) {
        // Show hint after 2 unsuccessful attempts
        setShowHint(true);
      }
      
      if (correctCount > 0) {
        setFeedback({
          type: 'warning',
          message: `Almost there! You got ${correctCount} letter${correctCount > 1 ? 's' : ''} right. Try again.`
        });
        speak(`Almost there! You got ${correctCount} letter${correctCount > 1 ? 's' : ''} right. Try again.`);
      } else {
        setFeedback({
          type: 'error',
          message: `That's not right. Try again!`
        });
        speak(`That's not right. Try again!`);
      }
      
      // Clear input after 3 attempts and provide more help
      if (newAttempts >= 3) {
        setUserInput('');
        setFeedback({
          type: 'info',
          message: `The word starts with "${currentWord.word[0]}". Listen to the word again.`
        });
        speak(`The word starts with ${currentWord.word[0]}. Listen to the word again.`);
        setTimeout(playWordAudio, 1500);
      }
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      checkSpelling();
    }
  };
  
  if (!currentWord) return <div>Loading...</div>;
  
  return (
    <div className="spell-quest">
      <div className="game-info">
        <div className="level-display">Level: {level}</div>
        <div className="score-display">Score: {score}</div>
        <div className="hints-display">Hints: {hints}</div>
      </div>
      
      <div className="spell-challenge">
        <div className="challenge-header">
          <h2>Spell the word</h2>
          <p className="word-definition">{currentWord.definition}</p>
        </div>
        
        <div className="audio-player">
          <button className="audio-button" onClick={playWordAudio}>
            <Volume2 size={20} />
            <span>Listen to the Word</span>
          </button>
        </div>
        
        <div className="spelling-input">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your spelling here..."
            maxLength={currentWord.word.length + 2}
            className="word-input"
          />
          
          <div className="input-actions">
            <button 
              className="hint-button"
              onClick={showWordHint}
              disabled={hints <= 0 || showHint}
            >
              Get Hint
            </button>
            
            <button 
              className="check-button"
              onClick={checkSpelling}
              disabled={!userInput}
            >
              <Check size={20} />
              Check
            </button>
          </div>
        </div>
        
        {showHint && (
          <div className="hint-display">
            <p><strong>Hint:</strong> {currentWord.hint}</p>
          </div>
        )}
        
        {feedback && (
          <div className={`feedback ${feedback.type}`}>
            {feedback.message}
          </div>
        )}
        
        <div className="attempts-counter">
          Attempts: {attempts} / 3
        </div>
        
        <button className="next-word-button" onClick={startRound}>
          <RefreshCw size={16} />
          Skip to Next Word
        </button>
      </div>
    </div>
  );
};

export default SpellQuest;