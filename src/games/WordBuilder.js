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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionsPerLevel, setQuestionsPerLevel] = useState(5);
  const [usedWords, setUsedWords] = useState([]);
  const { speak } = useAccessibility();
  
  const words = {
    1: [
      { word: 'CAT', image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg', hint: 'A furry pet that meows' },
      { word: 'DOG', image: 'https://images.pexels.com/photos/39317/chihuahua-dog-puppy-cute-39317.jpeg', hint: 'A pet that barks' },
      { word: 'SUN', image: 'https://images.pexels.com/photos/301599/pexels-photo-301599.jpeg', hint: 'It shines in the sky during the day' },
      { word: 'HAT', image: 'https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg', hint: 'You wear it on your head' },
      { word: 'BED', image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg', hint: 'You sleep on it' },
      { word: 'CAR', image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg', hint: 'A vehicle with four wheels' },
      { word: 'BAT', image: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg', hint: 'A flying mammal or sports equipment' },
      { word: 'PEN', image: 'https://images.pexels.com/photos/606541/pexels-photo-606541.jpeg', hint: 'Used for writing' }
    ],
    2: [
      { word: 'FISH', image: 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg', hint: 'It lives in water and has fins' },
      { word: 'BOOK', image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg', hint: 'You read stories from it' },
      { word: 'CAKE', image: 'https://images.pexels.com/photos/264939/pexels-photo-264939.jpeg', hint: 'A sweet dessert for birthdays' },
      { word: 'STAR', image: 'https://images.pexels.com/photos/1257860/pexels-photo-1257860.jpeg', hint: 'Twinkles in the night sky' },
      { word: 'BIRD', image: 'https://images.pexels.com/photos/349758/hummingbird-bird-birds-349758.jpeg', hint: 'Flies in the sky with wings' },
      { word: 'FROG', image: 'https://images.pexels.com/photos/45853/grey-crowned-crane-bird-crane-animal-45853.jpeg', hint: 'Jumps and lives near water' },
      { word: 'TREE', image: 'https://images.pexels.com/photos/38136/pexels-photo-38136.jpeg', hint: 'Has leaves and branches' },
      { word: 'RAIN', image: 'https://images.pexels.com/photos/125510/pexels-photo-125510.jpeg', hint: 'Falls from clouds' }
    ],
    3: [
      { word: 'HOUSE', image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg', hint: 'People live in it' },
      { word: 'APPLE', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg', hint: 'A red or green fruit' },
      { word: 'WATER', image: 'https://images.pexels.com/photos/40784/drops-of-water-water-nature-liquid-40784.jpeg', hint: 'You drink it when thirsty' },
      { word: 'BEACH', image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg', hint: 'Sandy place by the ocean' },
      { word: 'TIGER', image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg', hint: 'A big striped cat' },
      { word: 'MUSIC', image: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg', hint: 'Sounds that make songs' },
      { word: 'FLOWER', image: 'https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg', hint: 'Colorful plant that blooms' },
      { word: 'GARDEN', image: 'https://images.pexels.com/photos/236047/pexels-photo-236047.jpeg', hint: 'Where plants and flowers grow' }
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
  
  const getRandomWord = () => {
    const currentLevelWords = words[level] || words[1];
    const availableWords = currentLevelWords.filter(wordData => !usedWords.includes(wordData.word));
    
    if (availableWords.length === 0) {
      // If we've used all words, reset the used words list
      setUsedWords([]);
      return getRandomWord();
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
    
    const wordData = getRandomWord();
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
  
  const changeLevel = (newLevel) => {
    if (newLevel !== level) {
      setLevel(newLevel);
      setCurrentQuestion(0);
      setUsedWords([]);
    }
  };
  
  if (!currentWord) return <div>Loading...</div>;
  
  return (
    <div className="word-builder">
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
      
      <div className="game-status">
        <div className="progress">Question: {currentQuestion + 1} of {questionsPerLevel}</div>
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