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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionsPerLevel, setQuestionsPerLevel] = useState(5);
  const [usedWords, setUsedWords] = useState([]);
  const { speak } = useAccessibility();
  const inputRef = useRef(null);
  
  const words = {
    1: [
      { word: 'cat', definition: 'A small furry animal with whiskers', hint: 'Begins with C, has 3 letters' },
      { word: 'dog', definition: 'A pet that barks', hint: 'Begins with D, has 3 letters' },
      { word: 'sun', definition: 'It shines in the sky during the day', hint: 'Begins with S, has 3 letters' },
      { word: 'hat', definition: 'You wear it on your head', hint: 'Begins with H, has 3 letters' },
      { word: 'bed', definition: 'You sleep on it', hint: 'Begins with B, has 3 letters' },
      { word: 'pen', definition: 'Used for writing', hint: 'Begins with P, has 3 letters' },
      { word: 'cup', definition: 'You drink from it', hint: 'Begins with C, has 3 letters' },
      { word: 'key', definition: 'Opens locks', hint: 'Begins with K, has 3 letters' }
    ],
    2: [
      { word: 'fish', definition: 'Lives in water and has fins', hint: 'Begins with F, has 4 letters' },
      { word: 'book', definition: 'You read stories in it', hint: 'Begins with B, has 4 letters' },
      { word: 'cake', definition: 'A sweet dessert for birthdays', hint: 'Begins with C, has 4 letters' },
      { word: 'star', definition: 'Twinkles in the night sky', hint: 'Begins with S, has 4 letters' },
      { word: 'rain', definition: 'Falls from clouds', hint: 'Begins with R, has 4 letters' },
      { word: 'bird', definition: 'Flies with wings', hint: 'Begins with B, has 4 letters' },
      { word: 'moon', definition: 'Shines at night', hint: 'Begins with M, has 4 letters' },
      { word: 'tree', definition: 'Has leaves and branches', hint: 'Begins with T, has 4 letters' }
    ],
    3: [
      { word: 'house', definition: 'A place where people live', hint: 'Begins with H, has 5 letters' },
      { word: 'apple', definition: 'A red or green fruit', hint: 'Begins with A, has 5 letters' },
      { word: 'water', definition: 'You drink it when thirsty', hint: 'Begins with W, has 5 letters' },
      { word: 'beach', definition: 'Sandy place by the ocean', hint: 'Begins with B, has 5 letters' },
      { word: 'tiger', definition: 'A big striped cat', hint: 'Begins with T, has 5 letters' },
      { word: 'music', definition: 'Sounds that make songs', hint: 'Begins with M, has 5 letters' },
      { word: 'happy', definition: 'Feeling of joy', hint: 'Begins with H, has 5 letters' },
      { word: 'cloud', definition: 'Floats in the sky', hint: 'Begins with C, has 5 letters' }
    ]
  };
  
  useEffect(() => {
    // Reset when level changes
    setCurrentQuestion(0);
    setUsedWords([]);
    startRound();
  }, [level]);
  
  useEffect(() => {
    // Start a new round when current question changes
    if (currentQuestion < questionsPerLevel) {
      startRound();
    }
  }, [currentQuestion]);
  
  useEffect(() => {
    // Focus on input field when component mounts or when a new word is presented
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWord]);
  
  const getUnusedWord = () => {
    const currentLevelWords = words[level] || words[1];
    const availableWords = currentLevelWords.filter(wordData => !usedWords.includes(wordData.word));
    
    if (availableWords.length === 0) {
      // If we've used all words, reset the used words list
      setUsedWords([]);
      return getUnusedWord();
    }
    
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const wordData = availableWords[randomIndex];
    setUsedWords(prev => [...prev, wordData.word]);
    return wordData;
  };
  
  const startRound = () => {
    if (currentQuestion >= questionsPerLevel) {
      // Move to next level if we've completed all questions
      if (level < 3) {
        setLevel(level + 1);
        speak(`Moving to level ${level + 1}!`);
      }
      return;
    }
    
    const wordData = getUnusedWord();
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
      
      // Check if we've completed all questions for this level
      if (currentQuestion + 1 >= questionsPerLevel) {
        if (level < 3) {
          setTimeout(() => {
            setLevel(level + 1);
            setCurrentQuestion(0);
            setUsedWords([]);
            speak(`Moving to level ${level + 1}!`);
          }, 2000);
        } else {
          setTimeout(() => {
            setFeedback({
              type: 'success',
              message: "Congratulations! You've completed all levels!"
            });
            speak("Congratulations! You've completed all levels!");
          }, 2000);
        }
      } else {
        // Move to next question
        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
        }, 2000);
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
  
  const changeLevel = (newLevel) => {
    if (newLevel !== level) {
      setLevel(newLevel);
      setCurrentQuestion(0);
      setUsedWords([]);
    }
  };
  
  const skipToNextWord = () => {
    if (currentQuestion + 1 >= questionsPerLevel) {
      if (level < 3) {
        setLevel(level + 1);
        speak(`Moving to level ${level + 1}!`);
      }
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };
  
  if (!currentWord) return <div>Loading...</div>;
  
  return (
    <div className="spell-quest">
      <div className="level-buttons">
        {[1, 2, 3].map(lvl => (
          <button
            key={lvl}
            className={`level-button ${level === lvl ? 'active' : ''}`}
            onClick={() => changeLevel(lvl)}
          >
            Level {lvl}
          </button>
        ))}
      </div>
      
      <div className="game-info">
        <div className="progress">Question: {currentQuestion + 1} of {questionsPerLevel}</div>
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
        
        <button className="next-word-button" onClick={skipToNextWord}>
          <RefreshCw size={16} />
          Skip to Next Word
        </button>
      </div>
    </div>
  );
};

export default SpellQuest;