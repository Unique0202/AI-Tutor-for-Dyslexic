import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, BookOpen, MessageSquare, Award } from 'lucide-react';
import TextToSpeech from './TextToSpeech';
import { useAccessibility } from '../contexts/AccessibilityContext';
import '../styles/FAQPage.css';

const FAQPage = () => {
  const { speak } = useAccessibility();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const gameCards = [
    {
      id: "reading-adventure",
      title: "Reading Adventure",
      description: "Interactive stories with reading support",
      color: "#4a6fa5"
    },
    {
      id: "letter-master",
      title: "Letter Master",
      description: "Letter recognition and sounds",
      color: "#06d6a0"
    },
    {
      id: "word-builder",
      title: "Word Builder",
      description: "Construct words with visual aids",
      color: "#ffd166"
    },
    {
      id: "spell-quest",
      title: "Spell Quest",
      description: "Spelling practice with audio",
      color: "#ef476f"
    }
  ];

  const faqs = [
    {
      question: "What is NeuroLearn and who is it for?",
      answer: "NeuroLearn is an educational platform designed specifically for students with dyslexia. Our interactive games and tools help make learning to read, write, and spell more accessible and enjoyable."
    },
    {
      question: "How do the games help with dyslexia?",
      answer: "Our games use multi-sensory approaches (visual, auditory, and kinesthetic) that research shows are effective for dyslexic learners. Features include: text highlighting with audio, letter-sound reinforcement, and visual word-building."
    },
    {
      question: "Is NeuroLearn suitable for all age groups?",
      answer: "Yes! Our games are designed for children ages 6-16, with adjustable difficulty levels to suit different skill levels. The AI helper is useful for learners of all ages."
    },
    {
      question: "How does the progress tracking work?",
      answer: "We track: words mastered, reading speed improvements, game completion rates, and confidence levels. You can view your progress in the Profile section."
    },
    {
      question: "Can I use NeuroLearn on multiple devices?",
      answer: "Yes, your account and progress sync across devices. Just log in on any supported browser."
    },
    {
      question: "How does the AI Helper work?",
      answer: "Our AI Helper can: explain difficult words, rephrase questions, suggest learning strategies, and recommend games based on your challenges."
    },
    {
      question: "Are there any costs to use NeuroLearn?",
      answer: "NeuroLearn is currently completely free to use. We believe in making dyslexia support accessible to everyone."
    },
    {
      question: "How often should my child use NeuroLearn?",
      answer: "We recommend 15-30 minutes daily, or 3-5 sessions per week for best results. Regular short sessions are more effective than occasional long ones."
    }
  ];

  return (
    <div className="faq-page">
      <section className="faq-hero">
        <div className="faq-hero-content">
          <h1 className="faq-title">
            Frequently Asked Questions
            <TextToSpeech text="Frequently Asked Questions about NeuroLearn" />
          </h1>
          <p className="faq-subtitle">
            Find answers to common questions about how NeuroLearn works and how it can help with dyslexia.
          </p>
        </div>
      </section>

      <section className="faq-main">
        <div className="faq-container">
          <h2 className="section-title">
            General Questions
            <TextToSpeech text="General Questions about NeuroLearn" />
          </h2>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  <HelpCircle size={20} className="faq-icon" />
                  <h3>{faq.question}</h3>
                  <ChevronDown 
                    size={24} 
                    className={`faq-arrow ${activeIndex === index ? 'rotate' : ''}`} 
                  />
                </div>
                {activeIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="faq-sidebar">
          <div className="sidebar-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/games">
                  <BookOpen size={16} />
                  All Games
                </Link>
              </li>
              <li>
                <Link to="/chatbot">
                  <MessageSquare size={16} />
                  AI Helper
                </Link>
              </li>
              <li>
                <Link to="/profile">
                  <Award size={16} />
                  Your Progress
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Our Games</h3>
            <div className="sidebar-games">
              {gameCards.map(game => (
                <Link 
                  to={`/games/${game.id}`} 
                  key={game.id}
                  className="sidebar-game-card"
                  style={{ borderLeft: `4px solid ${game.color}` }}
                >
                  <h4>{game.title}</h4>
                  <p>{game.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="faq-support">
        <h2>Still have questions?</h2>
        <p>Our AI Helper is available 24/7 to answer any questions about using NeuroLearn.</p>
        <Link to="/chatbot" className="btn btn-primary">
          Ask the AI Helper
        </Link>
      </section>
    </div>
  );
};

export default FAQPage;