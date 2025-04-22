import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MessageSquare, Settings, Award } from 'lucide-react';
import TextToSpeech from '../components/TextToSpeech';
import { useAccessibility } from '../contexts/AccessibilityContext';
import '../styles/HomePage.css';

const HomePage = () => {
  const { speak, settings } = useAccessibility();
  
  useEffect(() => {
    // Automatically read welcome message when page loads
    if (settings.textToSpeechEnabled) {
      const welcomeText = "Welcome to NeuroLearn. Your learning journey starts here!";
      speak(welcomeText);
    }
  }, []);

  const features = [
    {
      icon: <BookOpen size={32} />,
      title: "Interactive Games",
      description: "Fun word games designed to improve reading and writing skills.",
      link: "/games"
    },
    {
      icon: <MessageSquare size={32} />,
      title: "AI Helper",
      description: "Get answers to your questions about learning and using this website.",
      link: "/chatbot"
    },
    {
      icon: <Settings size={32} />,
      title: "Personalized Settings",
      description: "Customize the website to work best for your unique learning style.",
      link: "/profile"
    },
    {
      icon: <Award size={32} />,
      title: "Track Progress",
      description: "See how your skills improve as you practice with our games.",
      link: "/profile"
    }
  ];

  const gameCards = [
    {
      id: "reading-adventure",
      icon: "📚",
      title: "Reading Adventure",
      description: "Journey through stories with interactive reading support",
      color: "#4a6fa5"
    },
    {
      id: "letter-master",
      icon: "🔤",
      title: "Letter Master",
      description: "Learn to recognize letters and their sounds",
      color: "#06d6a0"
    },
    {
      id: "word-builder",
      icon: "🧩",
      title: "Word Builder",
      description: "Construct words from letters with visual aids",
      color: "#ffd166"
    },
    {
      id: "spell-quest",
      icon: "✨",
      title: "Spell Quest",
      description: "Practice spelling words with multi-sensory support",
      color: "#ef476f"
    }
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Learning Made for You
            <TextToSpeech 
              text="Learning Made for You. Welcome to NeuroLearn, where we make learning fun and accessible for students with dyslexia."
              className="hero-tts"
            />
          </h1>
          <p className="hero-text">
            Welcome to NeuroLearn, where we make learning fun and accessible for students with dyslexia.
          </p>
          <div className="hero-buttons">
            <Link to="/games" className="btn btn-primary">
              Start Playing
            </Link>
            <Link to="/chatbot" className="btn btn-secondary">
              Ask AI Helper
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.pexels.com/photos/4145355/pexels-photo-4145355.jpeg" 
            alt="Student enjoying learning"
            className="rounded-image" 
          />
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">
          Our Features
          <TextToSpeech text="Our Features" />
        </h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link to={feature.link} key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="games-section">
        <h2 className="section-title">
          Popular Games
          <TextToSpeech text="Popular Games" />
        </h2>
        <div className="games-grid">
          {gameCards.map((game) => (
            <Link to={`/games/${game.id}`} key={game.id} className="game-card" style={{ borderColor: game.color }}>
              <div className="game-icon" style={{ backgroundColor: game.color }}>{game.icon}</div>
              <h3 className="game-title">{game.title}</h3>
              <p className="game-description">{game.description}</p>
            </Link>
          ))}
        </div>
        <div className="games-more">
          <Link to="/games" className="btn btn-outline">
            View All Games
          </Link>
        </div>
      </section>

      <section className="testimonial-section">
        <h2 className="section-title">
          Student Success Stories
          <TextToSpeech text="Student Success Stories" />
        </h2>
        <div className="testimonial-card">
          <div className="testimonial-content">
            <p className="testimonial-text">
              "The games on NeuroLearn have helped me improve my reading so much! I used to struggle with words, but now I feel more confident."
            </p>
            <div className="testimonial-author">
              <p className="author-name">Jamie, Age 12</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2 className="cta-title">Ready to start your learning journey?</h2>
        <p className="cta-text">Choose from our collection of games designed specifically for dyslexic students.</p>
        <Link to="/games" className="btn btn-large">
          Get Started Now
        </Link>
      </section>
    </div>
  );
};

export default HomePage;