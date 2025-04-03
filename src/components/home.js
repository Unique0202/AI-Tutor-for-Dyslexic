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

  const [currentTestimonial, setCurrentTestimonial] = useState(0);


  // Function to handle testimonial change
  const testimonials = [
    {
      quote: "This changed how I see learning. For the first time, reading feels possible.",
      name: "Mudit",
      age: 12,
      role: "Student",
      avatar: "👦"
    },
    {
      quote: "The games make learning so much fun! I don't feel stressed anymore.",
      name: "Priya",
      age: 10,
      role: "Student",
      avatar: "👧"
    },
    {
      quote: "As a teacher, I've seen remarkable progress in my students using this platform.",
      name: "Mr. Sharma",
      age: "",
      role: "Teacher",
      avatar: "👨‍🏫"
    },
    {
      quote: "My child's confidence has grown tremendously since using these learning tools.",
      name: "Mrs. Patel",
      age: "",
      role: "Parent",
      avatar: "👩"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        nextTestimonial();
      } else if (e.key === "ArrowLeft") {
        prevTestimonial();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        <div className="testimonial-header">
          <h2>What People Say</h2>
          <div className="testimonial-controls">
            <button 
              className="testimonial-nav prev" 
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              &larr;
            </button>
            <button 
              className="testimonial-nav next" 
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              &rarr;
            </button>
          </div>
        </div>

        <div className="testimonial-carousel-container">
          <div className="testimonial-carousel">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`testimonial-slide ${index === currentTestimonial ? 'active' : ''}`}
                aria-hidden={index !== currentTestimonial}
              >
                <div className="testimonial-content">
                  <blockquote>"{testimonial.quote}"</blockquote>
                  <div className="testimonial-author">
                    <div className="author-avatar">{testimonial.avatar}</div>
                    <div className="author-info">
                      <p className="author-name">
                        {testimonial.name}{testimonial.age && `, ${testimonial.age}`}
                      </p>
                      <p className="author-role">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
          
        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentTestimonial ? 'active' : ''}`}
              onClick={() => setCurrentTestimonial(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
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