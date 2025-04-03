// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

const Card = ({ children }) => <div className="card">{children}</div>;

const Home = () => (
  <div>
    <header className="card">Info (Profile, Logo, etc.)</header>
    <h2>Learning Games</h2>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
      {[...Array(6)].map((_, i) => (
        <Card key={i}>Game {i + 1}</Card>
      ))}
    </div>
  </div>
);

const LearningGame = () => (
  <div>
    <h2>Learning Game</h2>
    <input type="text" placeholder="Search" className="card" />
    <Card>Video</Card>
    {[...Array(4)].map((_, level) => (
      <div key={level}>
        <h3>Level {level + 1}</h3>
        {[...Array(level + 3)].map((_, topic) => (
          <Card key={topic}>Topic {topic + 1}</Card>
        ))}
      </div>
    ))}
  </div>
);

const Profile = () => (
  <div>
    <Card>Profile</Card>
    <button className="card">Info</button>
    <h3>Recently Played</h3>
    <div style={{ display: 'flex', gap: '10px' }}>
      {[...Array(2)].map((_, i) => (
        <Card key={i}>Game {i + 1}</Card>
      ))}
    </div>
    <h3>Topics Finished</h3>
    {[...Array(3)].map((_, i) => (
      <Card key={i}>Topic {i + 1}</Card>
    ))}
  </div>
);

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/learning-game">Learning Game</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learning-game" element={<LearningGame />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
