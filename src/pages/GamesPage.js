import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import TextToSpeech from '../components/TextToSpeech';
import { useAccessibility } from '../contexts/AccessibilityContext';
import '../styles/GamesPage.css';

const GamesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const { speak } = useAccessibility();

  const games = [
    {
      id: "reading-adventure",
      title: "Reading Adventure",
      description: "Journey through stories with interactive reading support. Words are highlighted as they're read aloud, and difficult words can be clicked for help.",
      image: "https://images.pexels.com/photos/3661193/pexels-photo-3661193.jpeg",
      category: "reading",
      difficulty: "all-levels",
      icon: "📚"
    },
    {
      id: "letter-master",
      title: "Letter Master",
      description: "Master letter recognition and sounds. This game helps students associate letters with their sounds through interactive exercises.",
      image: "https://images.pexels.com/photos/591652/play-fun-blocks-block-591652.jpeg",
      category: "letters",
      difficulty: "beginner",
      icon: "🔤"
    },
    {
      id: "word-builder",
      title: "Word Builder",
      description: "Construct words from letters with visual aids. Drag letters to build words, with audio support for letter sounds.",
      image: "https://images.pexels.com/photos/5912582/pexels-photo-5912582.jpeg",
      category: "spelling",
      difficulty: "intermediate",
      icon: "🧩"
    },
    {
      id: "spell-quest",
      title: "Spell Quest",
      description: "Practice spelling words with audio guidance. Listen to words and spell them correctly to advance on your quest.",
      image: "https://images.pexels.com/photos/1153929/pexels-photo-1153929.jpeg",
      category: "spelling",
      difficulty: "advanced",
      icon: "✨"
    },
    {
      id: "grammar-galaxy",
      title: "Grammar Galaxy",
      description: "Explore the galaxy of grammar rules through fun, interactive challenges. Learn sentence structure and punctuation.",
      image: "https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg",
      category: "grammar",
      difficulty: "intermediate",
      icon: "🌌"
    },
    {
      id: "word-detective",
      title: "Word Detective",
      description: "Solve word mysteries by finding patterns and meanings. Improve vocabulary and word recognition skills.",
      image: "https://images.pexels.com/photos/6446709/pexels-photo-6446709.jpeg",
      category: "reading",
      difficulty: "advanced",
      icon: "🔍"
    }
  ];

  // Filter games based on search term and category filter
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || game.category === filter;
    return matchesSearch && matchesFilter;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const readGameInfo = (game) => {
    speak(`${game.title}. ${game.description}`);
  };

  return (
    <div className="games-page">
      <section className="games-header">
        <h1 className="games-title">
          Learning Games
          <TextToSpeech text="Learning Games. Choose from our collection of interactive games designed to help with reading, spelling, and more." />
        </h1>
        <p className="games-subtitle">
          Choose from our collection of interactive games designed to help with reading, spelling, and more.
        </p>
      </section>

      <section className="games-filters">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search for games..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="filter-dropdown">
          <Filter size={20} className="filter-icon" />
          <select
            value={filter}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="reading">Reading</option>
            <option value="spelling">Spelling</option>
            <option value="grammar">Grammar</option>
            <option value="letters">Letters</option>
          </select>
        </div>
      </section>

      {filteredGames.length === 0 ? (
        <div className="no-games">
          <p>No games found matching your search.</p>
          <button className="btn" onClick={() => {setSearchTerm(''); setFilter('all');}}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="games-list">
          {filteredGames.map((game) => (
            <Link 
              to={`/games/${game.id}`} 
              key={game.id} 
              className="game-item"
              onMouseEnter={() => readGameInfo(game)}
            >
              <div className="game-preview">
                <img src={game.image} alt={game.title} className="game-image" />
                <div className="game-icon-overlay">{game.icon}</div>
              </div>
              <div className="game-details">
                <h2 className="game-item-title">{game.title}</h2>
                <p className="game-item-description">{game.description}</p>
                <div className="game-meta">
                  <span className={`game-tag category-${game.category}`}>
                    {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
                  </span>
                  <span className={`game-tag difficulty-${game.difficulty}`}>
                    {game.difficulty === 'all-levels' ? 'All Levels' : 
                     game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamesPage;