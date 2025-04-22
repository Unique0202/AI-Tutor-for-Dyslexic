import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import '../styles/LetterMaster.css';

const LetterMaster = () => {
  const [currentLetter, setCurrentLetter] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const { speak } = useAccessibility();
  
  const letters = {
    1: [
      { letter: 'A', image: 'https://images.pexels.com/photos/5946083/pexels-photo-5946083.jpeg', word: 'Apple' },
      { letter: 'B', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg', word: 'Ball' },
      { letter: 'C', image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg', word: 'Cat' },
      { letter: 'D', image: 'https://images.pexels.com/photos/39317/chihuahua-dog-puppy-cute-39317.jpeg', word: 'Dog' },
      { letter: 'E', image: 'https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg', word: 'Elephant' },
      { letter: 'F', image: 'https://images.pexels.com/photos/1418855/pexels-photo-1418855.jpeg', word: 'Fish' }
    ],
    2: [
      { letter: 'G', image: 'https://images.pexels.com/photos/1327405/pexels-photo-1327405.jpeg', word: 'Giraffe' },
      { letter: 'H', image: 'https://images.pexels.com/photos/4939638/pexels-photo-4939638.jpeg', word: 'Hat' },
      { letter: 'I', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', word: 'Ice cream' },
      { letter: 'J', image: 'https://images.pexels.com/photos/4710644/pexels-photo-4710644.jpeg', word: 'Juice' },
      { letter: 'K', image: 'https://images.pexels.com/photos/127027/pexels-photo-127027.jpeg', word: 'Kite' },
      { letter: 'L', image: 'https://images.pexels.com/photos/134074/pexels-photo-134074.jpeg', word: 'Lion' }
    ],
    3: [
      { letter: 'M', image: 'https://images.pexels.com/photos/918288/pexels-photo-918288.jpeg', word: 'Monkey' },
      { letter: 'N', image: 'https://images.pexels.com/photos/73822/walnut-nut-shell-nutrition-food-73822.jpeg', word: 'Nut' },
      { letter: 'O', image: 'https://images.pexels.com/photos/7195133/pexels-photo-7195133.jpeg', word: 'Orange' },
      { letter: 'P', image: 'https://images.pexels.com/photos/5945559/pexels-photo-5945559.jpeg', word: 'Pencil' },
      { letter: 'Q', image: 'https://images.pexels.com/photos/67508/pexels-photo-67508.jpeg', word: 'Queen' },
      { letter: 'R', image: 'https://images.pexels.com/photos/3124079/pexels-photo-3124079.jpeg', word: 'Rabbit' }
    ]
  };
  
  useEffect(() => {
    startRound();
  }, [level]);
  
  const startRound = () => {
    // Get current level letters
    const currentLevelLetters = letters[level] || letters[1];
    
    // Select a random letter as the target
    const randomIndex = Math.floor(Math.random() * currentLevelLetters.length);
    const target = currentLevelLetters[randomIndex];
    setCurrentLetter(target);
    
    // Create options (different for each level)
    let roundOptions = [];
    
    if (level === 1) {
      // Level 1: Choose the correct letter from 3 options
      roundOptions = getRandomLetters(3, target.letter);
    } else if (level === 2) {
      // Level 2: Choose the correct letter from 4 options
      roundOptions = getRandomLetters(4, target.letter);
    } else {
      // Level 3: Choose the correct letter from 5 options with similar-looking letters
      roundOptions = getRandomLetters(5, target.letter, true);
    }
    
    setOptions(roundOptions);
    
    // Speak the instruction
    const instruction = `Find the letter ${target.letter} as in ${target.word}`;
    speak(instruction);
    
    // Reset feedback
    setFeedback(null);
  };
  
  const getRandomLetters = (count, correctLetter, includeSimilar = false) => {
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = [correctLetter];
    
    // Map of similar-looking letters
    const similarLetters = {
      'B': ['D', 'P', 'R'],
      'D': ['B', 'P', 'O'],
      'E': ['F', '3'],
      'I': ['l', '1', 'J'],
      'J': ['I', 'T'],
      'M': ['N', 'W'],
      'N': ['M', 'Z'],
      'P': ['B', 'D', 'R'],
      'Q': ['O', 'G'],
      'R': ['P', 'B'],
      'S': ['5', 'Z'],
      'U': ['V', 'Y'],
      'V': ['U', 'W'],
      'W': ['M', 'V'],
      'Y': ['V', 'U'],
      'Z': ['N', '2']
    };
    
    // Add similar letters if needed
    if (includeSimilar && similarLetters[correctLetter]) {
      const similar = similarLetters[correctLetter];
      for (let i = 0; i < Math.min(similar.length, count - 1); i++) {
        result.push(similar[i]);
      }
    }
    
    // Fill the rest with random letters
    while (result.length < count) {
      const randomLetter = allLetters.charAt(Math.floor(Math.random() * allLetters.length));
      if (!result.includes(randomLetter)) {
        result.push(randomLetter);
      }
    }
    
    // Shuffle the options
    return result.sort(() => Math.random() - 0.5);
  };
  
  const handleLetterClick = (selectedLetter) => {
    if (gameOver) return;
    
    if (selectedLetter === currentLetter.letter) {
      // Correct answer
      setScore(score + (level * 10));
      setFeedback({
        type: 'success',
        message: `Correct! That's the letter ${currentLetter.letter} as in ${currentLetter.word}.`
      });
      speak(`Correct! That's the letter ${currentLetter.letter} as in ${currentLetter.word}.`);
      
      // Check if level should increase
      if (score + (level * 10) >= level * 50 && level < 3) {
        setTimeout(() => {
          setLevel(level + 1);
          speak(`Great job! Moving to level ${level + 1}`);
        }, 1500);
      } else {
        setTimeout(startRound, 1500);
      }
    } else {
      // Wrong answer
      setLives(lives - 1);
      setFeedback({
        type: 'error',
        message: `That's not right. Try again! Look for the letter ${currentLetter.letter}.`
      });
      speak(`That's not right. Try again! Look for the letter ${currentLetter.letter}.`);
      
      // Check if game over
      if (lives <= 1) {
        setGameOver(true);
        speak("Game over! You can try again to improve your score.");
      }
    }
  };
  
  const restartGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    startRound();
  };
  
  const hearLetter = () => {
    speak(`${currentLetter.letter} as in ${currentLetter.word}`);
  };
  
  if (!currentLetter) return <div>Loading...</div>;
  
  return (
    <div className="letter-master">
      <div className="game-stats">
        <div className="level-indicator">Level: {level}</div>
        <div className="score-counter">Score: {score}</div>
        <div className="lives-counter">
          Lives: {Array(lives).fill('❤️').join(' ')}
        </div>
      </div>
      
      {gameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your final score: {score}</p>
          <button className="restart-button" onClick={restartGame}>
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div className="letter-challenge">
            <div className="letter-image-container">
              <img 
                src={currentLetter.image} 
                alt={currentLetter.word}
                className="letter-image" 
              />
              <p className="letter-word">{currentLetter.word}</p>
            </div>
            
            <div className="letter-instructions">
              <h3>Find the letter that starts the word</h3>
              <button className="hear-letter-button" onClick={hearLetter}>
                Hear the Letter
              </button>
            </div>
            
            <div className="letter-options">
              {options.map((letter, index) => (
                <button 
                  key={index}
                  className="letter-option"
                  onClick={() => handleLetterClick(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
          
          {feedback && (
            <div className={`feedback ${feedback.type}`}>
              {feedback.message}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LetterMaster;