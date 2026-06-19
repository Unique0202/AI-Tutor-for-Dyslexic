import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import '../styles/LetterMaster.css';

const getLetterSound = (letter) => {
  const letterSounds = {
    'A': 'ay as in apple',
    'B': 'buh',
    'C': 'si',
    'D': 'di',
    'E': 'eh',
    'F': 'fff',
    'G': 'guh',
    'H': 'huh',
    'I': 'ih',
    'J': 'juh',
    'K': 'kuh',
    'L': 'lll',
    'M': 'mmm',
    'N': 'nnn',
    'O': 'oh',
    'P': 'puh',
    'Q': 'kwuh',
    'R': 'rrr',
    'S': 'sss',
    'T': 'tuh',
    'U': 'uh',
    'V': 'vvv',
    'W': 'wuh',
    'X': 'ks',
    'Y': 'yuh',
    'Z': 'zzz'
  };
  return letterSounds[letter.toUpperCase()] || `the sound for ${letter}`;
};

const LetterMaster = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const [usedWords, setUsedWords] = useState([]);
  const [questionType, setQuestionType] = useState('letter');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsPerLevel, setQuestionsPerLevel] = useState(5);
  const { speak } = useAccessibility();
  
  const wordBank = {
    1: [
      { letter: 'A', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg', word: 'Apple' },
      { letter: 'B', image: 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg', word: 'Ball' },
      { letter: 'C', image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg', word: 'Cat' },
      { letter: 'D', image: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg', word: 'Dog' },
      { letter: 'E', image: 'https://images.pexels.com/photos/1054666/pexels-photo-1054666.jpeg', word: 'Elephant' },
      { letter: 'F', image: 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg', word: 'Fish' },
      { letter: 'G', image: 'https://images.pexels.com/photos/67552/giraffe-tall-mammal-africa-67552.jpeg', word: 'Giraffe' },
      { letter: 'H', image: 'https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg', word: 'Hat' },
      { letter: 'I', image: 'https://images.pexels.com/photos/1625235/pexels-photo-1625235.jpeg', word: 'Ice cream' },
      { letter: 'J', image: 'https://images.pexels.com/photos/158053/fresh-orange-juice-squeezed-refreshing-citrus-158053.jpeg', word: 'Juice' }
    ],
    2: [
      { letter: 'K', image: 'https://images.pexels.com/photos/2225914/pexels-photo-2225914.jpeg', word: 'Kite' },
      { letter: 'L', image: 'https://images.pexels.com/photos/33045/lion-wild-africa-african.jpg', word: 'Lion' },
      { letter: 'M', image: 'https://images.pexels.com/photos/1670413/pexels-photo-1670413.jpeg', word: 'Monkey' },
      { letter: 'N', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg', word: 'Nut' },
      { letter: 'O', image: 'https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg', word: 'Orange' },
      { letter: 'P', image: 'https://images.pexels.com/photos/109255/pexels-photo-109255.jpeg', word: 'Pencil' },
      { letter: 'Q', image: 'https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg', word: 'Queen' },
      { letter: 'R', image: 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg', word: 'Rabbit' },
      { letter: 'S', image: 'https://images.pexels.com/photos/301599/pexels-photo-301599.jpeg', word: 'Sun' },
      { letter: 'T', image: 'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg', word: 'Tree' }
    ],
    3: [
      { letter: 'U', image: 'https://images.pexels.com/photos/347735/pexels-photo-347735.jpeg', word: 'Umbrella' },
      { letter: 'V', image: 'https://images.pexels.com/photos/34221/violin-musical-instrument-music-sound.jpg', word: 'Violin' },
      { letter: 'W', image: 'https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg', word: 'Watermelon' },
      { letter: 'X', image: 'https://images.pexels.com/photos/165972/pexels-photo-165972.jpeg', word: 'Xylophone' },
      { letter: 'Y', image: 'https://images.pexels.com/photos/51952/cow-bull-horns-coat-51952.jpeg', word: 'Yak' },
      { letter: 'Z', image: 'https://images.pexels.com/photos/750539/pexels-photo-750539.jpeg', word: 'Zebra' },
      { letter: 'A', image: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg', word: 'Airplane' },
      { letter: 'B', image: 'https://images.pexels.com/photos/2280926/pexels-photo-2280926.jpeg', word: 'Banana' },
      { letter: 'C', image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg', word: 'Camera' },
      { letter: 'D', image: 'https://images.pexels.com/photos/64219/dolphin-marine-mammals-water-sea-64219.jpeg', word: 'Dolphin' }
    ]
  };
  
  // Question types with weights (more weight = more frequent)
  const questionTypes = [
    { type: 'letter', weight: 3, description: 'Identify the starting letter' },
    { type: 'sound', weight: 2, description: 'Identify the letter that makes this sound' },
    { type: 'word', weight: 2, description: 'Which word starts with this letter?' },
    { type: 'uppercase', weight: 1, description: 'Match uppercase to lowercase' },
    { type: 'missing', weight: 1, description: 'Fill in the missing letter' }
  ];

  useEffect(() => {
    // Reset when level changes
    setCurrentQuestionIndex(0);
    setUsedWords([]);
    startRound();
  }, [level]);

  useEffect(() => {
    // Start a new round when current question changes
    if (currentQuestionIndex < questionsPerLevel) {
      startRound();
    }
  }, [currentQuestionIndex]);

  const getRandomQuestionType = () => {
    const totalWeight = questionTypes.reduce((sum, type) => sum + type.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const type of questionTypes) {
      if (random < type.weight) {
        return type.type;
      }
      random -= type.weight;
    }
    
    return questionTypes[0].type; // fallback
  };

  const getUnusedWord = (level) => {
    const availableWords = wordBank[level].filter(word => !usedWords.includes(word.word));
    
    if (availableWords.length === 0) {
      // If all words have been used, reset the used words list
      setUsedWords([]);
      return wordBank[level][Math.floor(Math.random() * wordBank[level].length)];
    }
    
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selectedWord = availableWords[randomIndex];
    setUsedWords([...usedWords, selectedWord.word]);
    return selectedWord;
  };

  const startRound = () => {
    if (currentQuestionIndex >= questionsPerLevel) {
      // Move to next level if we've completed all questions
      if (level < 3) {
        setLevel(level + 1);
        speak(`Moving to level ${level + 1}!`);
      }
      return;
    }
    
    const newQuestionType = getRandomQuestionType();
    setQuestionType(newQuestionType);
    
    const targetWord = getUnusedWord(level);
    let questionData = { ...targetWord, type: newQuestionType };
    let roundOptions = [];
    let instruction = '';
    
    switch (newQuestionType) {
      case 'letter':
        instruction = `Find the letter ${targetWord.letter} as in ${targetWord.word}`;
        roundOptions = generateLetterOptions(3 + level, targetWord.letter);
        break;
        
      case 'sound':
        instruction = `Which letter makes the sound ${getLetterSound(targetWord.letter)}?`;
        roundOptions = generateLetterOptions(3 + level, targetWord.letter);
        break;
        
      case 'word':
        instruction = `Which word starts with the letter ${targetWord.letter}?`;
        const correctWord = targetWord.word;
        const otherWords = wordBank[level]
          .filter(w => w.word !== correctWord)
          .map(w => w.word);
        roundOptions = [correctWord, ...getRandomItems(otherWords, 2 + level)];
        roundOptions = shuffleArray(roundOptions);
        questionData.correctAnswer = correctWord;
        break;
        
      case 'uppercase':
        instruction = `Find the lowercase version of ${targetWord.letter}`;
        roundOptions = generateLetterOptions(3 + level, targetWord.letter.toLowerCase(), true);
        questionData.correctAnswer = targetWord.letter.toLowerCase();
        break;
        
      case 'missing':
        const wordWithMissing = targetWord.word.replace(new RegExp(`^${targetWord.letter}`, 'i'), '_');
        instruction = `Fill in the missing letter: ${wordWithMissing}`;
        roundOptions = generateLetterOptions(3 + level, targetWord.letter);
        questionData.wordWithMissing = wordWithMissing;
        break;
    }
    
    setCurrentQuestion(questionData);
    setOptions(roundOptions);
    speak(instruction);
    setFeedback(null);
  };

  const generateLetterOptions = (count, correctLetter, lowercase = false) => {
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = [correctLetter];
    
    while (result.length < count) {
      const randomLetter = allLetters.charAt(Math.floor(Math.random() * allLetters.length));
      const formattedLetter = lowercase ? randomLetter.toLowerCase() : randomLetter;
      if (!result.includes(formattedLetter)) {
        result.push(formattedLetter);
      }
    }
    
    return shuffleArray(result);
  };

  const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count - 1, shuffled.length));
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleOptionClick = (selectedOption) => {
    if (gameOver) return;
    
    let isCorrect = false;
    let correctAnswer = currentQuestion.letter;
    
    if (questionType === 'word') {
      isCorrect = selectedOption === currentQuestion.correctAnswer;
      correctAnswer = currentQuestion.correctAnswer;
    } else if (questionType === 'uppercase') {
      isCorrect = selectedOption === currentQuestion.correctAnswer;
      correctAnswer = currentQuestion.correctAnswer;
    } else {
      isCorrect = selectedOption === correctAnswer;
    }
    
    if (isCorrect) {
      const pointsEarned = level * 10;
      setScore(score + pointsEarned);
      setFeedback({
        type: 'success',
        message: `Correct! ${getSuccessMessage(currentQuestion)}`
      });
      speak(`Correct! ${getSuccessMessage(currentQuestion)}`);
      
      // Check if we've completed all questions for this level
      if (currentQuestionIndex + 1 >= questionsPerLevel) {
        if (level < 3) {
          setTimeout(() => {
            setLevel(level + 1);
            setCurrentQuestionIndex(0);
            setUsedWords([]);
            speak(`Great job! Moving to level ${level + 1}`);
          }, 1500);
        } else {
          setTimeout(() => {
            setFeedback({
              type: 'success',
              message: "Congratulations! You've completed all levels!"
            });
            speak("Congratulations! You've completed all levels!");
          }, 1500);
        }
      } else {
        // Move to next question
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
        }, 1500);
      }
    } else {
      setLives(lives - 1);
      setFeedback({
        type: 'error',
        message: `That's not right. The correct answer is ${correctAnswer}. Try again!`
      });
      speak(`That's not right. The correct answer is ${correctAnswer}. Try again!`);
      
      if (lives <= 1) {
        setGameOver(true);
        speak("Game over! You can try again to improve your score.");
      }
    }
  };

  const getSuccessMessage = (question) => {
    switch (question.type) {
      case 'letter':
        return `That's the letter ${question.letter} as in ${question.word}.`;
      case 'sound':
        return `${question.letter} makes the sound ${getLetterSound(question.letter)}.`;
      case 'word':
        return `${question.word} starts with the letter ${question.letter}.`;
      case 'uppercase':
        return `${question.letter.toUpperCase()} matches with ${question.letter.toLowerCase()}.`;
      case 'missing':
        return `The word is ${question.word} which starts with ${question.letter}.`;
      default:
        return 'Great job!';
    }
  };

  const restartGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setCurrentQuestionIndex(0);
    setGameOver(false);
    setUsedWords([]);
    startRound();
  };

  const hearQuestion = () => {
    switch (questionType) {
      case 'letter':
        speak(`Find the letter ${currentQuestion.letter} as in ${currentQuestion.word}`);
        break;
      case 'sound':
        speak(`Which letter makes the sound ${getLetterSound(currentQuestion.letter)}?`);
        break;
      case 'word':
        speak(`Which word starts with the letter ${currentQuestion.letter}?`);
        break;
      case 'uppercase':
        speak(`Find the lowercase version of ${currentQuestion.letter}`);
        break;
      case 'missing':
        speak(`Fill in the missing letter: ${currentQuestion.wordWithMissing}`);
        break;
    }
  };

  const changeLevel = (newLevel) => {
    if (newLevel !== level) {
      setLevel(newLevel);
      setCurrentQuestionIndex(0);
      setUsedWords([]);
    }
  };

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="letter-master">
      <div className="level-buttons">
        {[1, 2, 3].map(lvl => (
          <button
            key={lvl}
            className={`level-button ${level === lvl ? 'active' : ''}`}
            onClick={() => changeLevel(lvl)}
            disabled={gameOver}
          >
            Level {lvl}
          </button>
        ))}
      </div>
      
      <div className="game-stats">
        <div className="progress">Question: {currentQuestionIndex + 1} of {questionsPerLevel}</div>
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
            <div className="question-container">
              {questionType === 'letter' || questionType === 'sound' || questionType === 'missing' ? (
                <div className="letter-image-container">
                  <img 
                    src={currentQuestion.image} 
                    alt={currentQuestion.word}
                    className="letter-image" 
                  />
                  {questionType === 'missing' ? (
                    <p className="letter-word">{currentQuestion.wordWithMissing}</p>
                  ) : (
                    <p className="letter-word">{currentQuestion.word}</p>
                  )}
                </div>
              ) : null}
              
              <div className="question-instructions">
                <h3>{getQuestionText(currentQuestion)}</h3>
                <button className="hear-question-button" onClick={hearQuestion}>
                  Hear Question Again
                </button>
              </div>
            </div>
            
            <div className="options-grid">
              {options.map((option, index) => (
                <button 
                  key={index}
                  className="option-button"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
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

const getQuestionText = (question) => {
  switch (question.type) {
    case 'letter':
      return `Find the letter that starts the word:`;
    case 'sound':
      return `Which letter makes this sound: ${getLetterSound(question.letter)}?`;
    case 'word':
      return `Which word starts with the letter ${question.letter}?`;
    case 'uppercase':
      return `Match the lowercase letter for: ${question.letter}`;
    case 'missing':
      return `Fill in the missing letter: ${question.wordWithMissing}`;
    default:
      return 'Select the correct answer:';
  }
};

export default LetterMaster;