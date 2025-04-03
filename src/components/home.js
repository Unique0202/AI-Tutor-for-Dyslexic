import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container">
      <h1>Home</h1>
      <nav>
        <Link to="/learning-game">Learning Game</Link> | 
        <Link to="/profile">Profile</Link>
      </nav>
      <div className="games">
        <h2>Learning Games</h2>
        <div className="game-grid">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} className="game-box">Game {num}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
