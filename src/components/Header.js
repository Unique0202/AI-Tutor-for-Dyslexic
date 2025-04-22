import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mic, Volume2, Settings, Home, BookOpen, MessageSquare, User } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import AccessibilityMenu from './AccessibilityMenu';
import SpeechToText from './SpeechToText';
import '../styles/Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessibilityMenuOpen, setAccessibilityMenuOpen] = useState(false);
  const location = useLocation();
  const { speak, settings } = useAccessibility();
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleAccessibilityMenu = () => setAccessibilityMenuOpen(!accessibilityMenuOpen);
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/games', label: 'Games', icon: <BookOpen size={20} /> },
    { path: '/chatbot', label: 'AI Helper', icon: <MessageSquare size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  // Read the page name when location changes
  React.useEffect(() => {
    const currentPage = navItems.find(item => item.path === location.pathname);
    if (currentPage && settings.textToSpeechEnabled) {
      speak(`${currentPage.label} page`);
    }
  }, [location.pathname, settings.textToSpeechEnabled]);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={() => speak('Home page')}>
          <span className="logo-icon">🧠</span>
          <span className="logo-text">NeuroLearn</span>
        </Link>
        
        <div className="header-buttons">
          <SpeechToText />
          
          <button 
            className="accessibility-button"
            onClick={toggleAccessibilityMenu}
            aria-label="Accessibility Settings"
          >
            <Settings size={24} />
          </button>
          
          <button 
            className="menu-button"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close Menu" : "Open Menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => {
                    speak(`${item.label} page`);
                    setMenuOpen(false);
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {accessibilityMenuOpen && (
        <AccessibilityMenu onClose={toggleAccessibilityMenu} />
      )}
    </header>
  );
};

export default Header;