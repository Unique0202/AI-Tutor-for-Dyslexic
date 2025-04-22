import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Award, BookOpen } from 'lucide-react';
import TextToSpeech from '../components/TextToSpeech';
import { useAccessibility } from '../contexts/AccessibilityContext';
import ReadingAdventure from '../games/ReadingAdventure';
import LetterMaster from '../games/LetterMaster';
import WordBuilder from '../games/WordBuilder';
import SpellQuest from '../games/SpellQuest';
import '../styles/GameDetail.css';

const GameDetail = () => {
  const { gameId } = useParams();
  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const { speak } = useAccessibility();
  
  useEffect(() => {
    const games = {
      "reading-adventure": {
        id: "reading-adventure",
        title: "Reading Adventure",
        description: "Journey through stories with interactive reading support. Words are highlighted as they're read aloud, and difficult words can be clicked for help.",
        longDescription: "Reading Adventure is designed to make reading more accessible for students with dyslexia. The game presents stories with words that are highlighted as they're read aloud, helping to reinforce the connection between written words and their sounds. You can click on any difficult word to hear it pronounced clearly and see a visual representation of its meaning. Progress at your own pace and build reading confidence!",
        image: "https://images.pexels.com/photos/256502/pexels-photo-256502.jpeg",
        skills: ["Reading Comprehension", "Vocabulary", "Word Recognition", "Focus"],
        benefits: [
          "Improves reading fluency",
          "Builds vocabulary",
          "Enhances comprehension",
          "Boosts reading confidence"
        ],
        levels: ["Beginner", "Intermediate", "Advanced"],
        component: ReadingAdventure
      },
      "letter-master": {
        id: "letter-master",
        title: "Letter Master",
        description: "Master letter recognition and sounds. This game helps students associate letters with their sounds through interactive exercises.",
        longDescription: "Letter Master helps students master letter recognition and sounds through fun, interactive exercises. The game presents letters in various contexts and asks you to identify them or their sounds. Visual and audio cues provide multi-sensory learning support, making it easier to remember letter shapes and sounds. As you progress, you'll encounter more challenging letter combinations and words.",
        image: "https://images.pexels.com/photos/591652/play-fun-blocks-block-591652.jpeg",
        skills: ["Letter Recognition", "Phonics", "Visual Processing", "Auditory Processing"],
        benefits: [
          "Strengthens letter-sound connections",
          "Improves letter recognition speed",
          "Enhances phonological awareness",
          "Builds foundation for reading"
        ],
        levels: ["Basic Letters", "Letter Combinations", "Challenging Sounds"],
        component: LetterMaster
      },
      "word-builder": {
        id: "word-builder",
        title: "Word Builder",
        description: "Construct words from letters with visual aids. Drag letters to build words, with audio support for letter sounds.",
        longDescription: "In Word Builder, you'll construct words from individual letters, with helpful visual aids to guide you. Drag and drop letters to form words based on pictures, audio cues, or definitions. As you place each letter, you'll hear its sound, reinforcing the connection between letters and sounds. The game adapts to your skill level, starting with simple three-letter words and progressing to more complex vocabulary.",
        image: "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg",
        skills: ["Spelling", "Word Formation", "Letter Sequencing", "Visual-Motor Skills"],
        benefits: [
          "Improves spelling skills",
          "Enhances word formation understanding",
          "Builds letter-sound association",
          "Develops sequencing abilities"
        ],
        levels: ["Simple Words", "Compound Words", "Challenging Vocabulary"],
        component: WordBuilder
      },
      "spell-quest": {
        id: "spell-quest",
        title: "Spell Quest",
        description: "Practice spelling words with audio guidance. Listen to words and spell them correctly to advance on your quest.",
        longDescription: "Spell Quest takes you on an adventure where you'll practice spelling words with helpful audio guidance. Listen to words being pronounced clearly, then spell them correctly to advance on your quest. The game provides immediate feedback and extra support for challenging words. Multi-sensory cues help reinforce spelling patterns, and visual rewards keep motivation high as you master increasingly difficult words.",
        image: "https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg",
        skills: ["Spelling", "Auditory Processing", "Memory", "Phonological Awareness"],
        benefits: [
          "Strengthens spelling abilities",
          "Improves auditory processing",
          "Enhances word memory",
          "Builds confidence in writing"
        ],
        levels: ["Regular Words", "Pattern Words", "Irregular Words"],
        component: SpellQuest
      }
    };
    
    if (games[gameId]) {
      setGameData(games[gameId]);
      setIsLoading(false);
    } else {
      // Handle invalid game ID
      setIsLoading(false);
    }
  }, [gameId]);
  
  const handleStartGame = () => {
    setGameStarted(true);
    speak(`Starting ${gameData.title}. Let's learn and have fun!`);
  };
  
  if (isLoading) {
    return <div className="loading">Loading game details...</div>;
  }
  
  if (!gameData) {
    return (
      <div className="error-container">
        <h2>Game Not Found</h2>
        <p>Sorry, we couldn't find the game you're looking for.</p>
        <Link to="/games" className="btn">Back to Games</Link>
      </div>
    );
  }
  
  const GameComponent = gameData.component;
  
  return (
    <div className="game-detail-page">
      {!gameStarted ? (
        <>
          <div className="game-detail-header">
            <Link to="/games" className="back-link">
              <ArrowLeft size={20} />
              <span>Back to Games</span>
            </Link>
            <h1 className="game-detail-title">
              {gameData.title}
              <TextToSpeech text={`${gameData.title}. ${gameData.longDescription}`} />
            </h1>
          </div>
          
          <div className="game-detail-content">
            <div className="game-detail-image-container">
              <img src={gameData.image} alt={gameData.title} className="game-detail-image" />
            </div>
            
            <div className="game-detail-info">
              <p className="game-detail-description">{gameData.longDescription}</p>
              
              <div className="game-detail-stats">
                <div className="game-stat">
                  <h3 className="stat-title">
                    <BookOpen size={18} />
                    <span>Skills Practiced</span>
                  </h3>
                  <ul className="stat-list">
                    {gameData.skills.map((skill, index) => (
                      <li key={index} className="stat-item">{skill}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="game-stat">
                  <h3 className="stat-title">
                    <Award size={18} />
                    <span>Benefits</span>
                  </h3>
                  <ul className="stat-list">
                    {gameData.benefits.map((benefit, index) => (
                      <li key={index} className="stat-item">{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="game-levels">
                <h3>Game Levels:</h3>
                <div className="level-badges">
                  {gameData.levels.map((level, index) => (
                    <span key={index} className="level-badge">
                      {level}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className="start-game-button" onClick={handleStartGame}>
                <Play size={24} />
                <span>Start Game</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="game-container">
          <div className="game-header">
            <button 
              className="exit-game-button"
              onClick={() => setGameStarted(false)}
            >
              <ArrowLeft size={20} />
              <span>Exit Game</span>
            </button>
            <h2 className="game-playing-title">{gameData.title}</h2>
          </div>
          
          <GameComponent />
        </div>
      )}
    </div>
  );
};

export default GameDetail;