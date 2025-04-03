import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const gameIcons = [
    "📚", "🔤", "✍️", "🧩", "🎮", "🏆"
  ];
  
  const gameNames = [
    "Reading Adventure",
    "Letter Master",
    "Word Builder",
    "Puzzle Challenge",
    "Spell Quest",
    "Memory Match"
  ];

  return (
    <div className="container">
      <header className="header">
        <h1 className="main-title">Welcome to LearnEasy</h1>
        <p className="subtitle">Fun learning games designed for you</p>
      </header>
      
      <nav className="main-nav">
        <Link to="/learning-game" className="nav-link">
          <span className="nav-icon">🎮</span> Learning Games
        </Link>
        <Link to="/profile" className="nav-link">
          <span className="nav-icon">👤</span> My Profile
        </Link>
      </nav>
      
      <div className="games-section">
        <h2 className="section-title">Choose Your Learning Adventure</h2>
        <div className="game-grid">
          {[0, 1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="game-card">
              <div className="game-icon">{gameIcons[num]}</div>
              <h3 className="game-title">{gameNames[num]}</h3>
            </div>
          ))}
        </div>
      </div>
      
      <div className="motivation">
        <p>You're doing great! Every challenge makes you stronger.</p>
      </div>
    </div>
  );
}

export default Home;