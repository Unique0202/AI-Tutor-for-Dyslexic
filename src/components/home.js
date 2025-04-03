import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [activePanel, setActivePanel] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your learning assistant. How can I help you today?", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const learningModules = [
    {
      title: "Reading Adventure",
      icon: "📖",
      color: "#FF6B6B",
      description: "Journey through stories with interactive reading support"
    },
    {
      title: "Letter Master",
      icon: "🔠",
      color: "#4ECDC4",
      description: "Master letter recognition with fun challenges"
    },
    {
      title: "Word Builder",
      icon: "🧩",
      color: "#45B7D1",
      description: "Construct words from letters with visual aids"
    },
    {
      title: "Spell Quest",
      icon: "✨",
      color: "#A37EBA",
      description: "Embark on a magical spelling adventure"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    // Add user message
    setMessages([...messages, { text: inputValue, sender: "user" }]);
    setInputValue("");

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses = [
        "That's a great question! I can help explain any of the learning games on this page.",
        "I'm here to help with your learning journey! Which game would you like to know more about?",
        "I'm still learning too! Right now I can tell you about the different learning activities available.",
        "Try clicking on any of the learning games to explore them. I can answer questions about them!",
        "For more detailed help, you might want to ask your teacher about that one."
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      setMessages(prev => [...prev, { 
        text: randomResponse, 
        sender: "bot" 
      }]);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  return (
    <div className="app-container" ref={containerRef}>
      {/* Hero Section with Parallax */}
      <section className="hero">
        <div 
          className="hero-background" 
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">Learn with</span>
            <span className="title-line">Confidence</span>
          </h1>
          <p className="hero-subtitle">Designed for unique minds, built for success</p>
          <Link to="/learning-game" className="hero-cta">
            Start Learning
            <span className="cta-arrow">→</span>
          </Link>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Interactive Learning Modules */}
      <section className="learning-modules">
        <div className="module-selector">
          {learningModules.map((module, index) => (
            <button
              key={index}
              className={`module-tab ${activePanel === index ? 'active' : ''}`}
              onClick={() => setActivePanel(index)}
              style={{ color: module.color }}
            >
              {module.icon} {module.title}
            </button>
          ))}
        </div>
        
        <div className="module-viewport">
          <div 
            className="module-slider"
            style={{ transform: `translateX(-${activePanel * 100}%)` }}
          >
            {learningModules.map((module, index) => (
              <div 
                key={index} 
                className="module-panel"
                style={{ backgroundColor: module.color }}
              >
                <div className="panel-content">
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                  <Link 
                    to="/learning-game" 
                    className="module-cta"
                    style={{ color: module.color }}
                  >
                    Try Now
                  </Link>
                </div>
                <div className="panel-image">
                  <div className="image-placeholder">{module.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Features Section */}
      <section className="features">
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Personalized</h3>
            <p>Adapts to your unique learning style</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Science-Backed</h3>
            <p>Methods proven to help dyslexic learners</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">❤️</div>
            <h3>Stress-Free</h3>
            <p>No pressure, learn at your own pace</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial">
        <div className="testimonial-content">
          <blockquote>
            "This changed how I see learning. For the first time, reading feels possible."
          </blockquote>
          <div className="testimonial-author">
            <div className="author-avatar">👦</div>
            <div className="author-info">
              <p className="author-name">Jamie, 12</p>
              <p className="author-role">Student</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot Components */}
      <div 
        className={`chatbot-icon ${chatOpen ? 'active' : ''}`} 
        onClick={toggleChat}
        aria-label="Chat with learning assistant"
      >
        {chatOpen ? '✕' : '🤖'}
      </div>

      {chatOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Learning Assistant</h3>
            <button onClick={toggleChat} className="close-chat" aria-label="Close chat">
              ✕
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender}`}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="chatbot-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about learning..."
              autoFocus
              aria-label="Type your message"
            />
            <button type="submit" aria-label="Send message">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Home;