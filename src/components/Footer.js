import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-heading">NeuroLearn</h3>
          <p className="footer-text">
            Empowering dyslexic students to learn in ways that work best for them.
          </p>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/games">Games</a></li>
            <li><a href="/chatbot">AI Helper</a></li>
            <li><a href="/profile">My Profile</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-heading">Resources</h3>
          <ul className="footer-links">
            {/* <li><a href="#about">About Dyslexia</a></li> */}
            {/* <li><a href="#tips">Learning Tips</a></li> */}
            {/* <li><a href="#help">Help & Support</a></li> */}
            <li> <a href="/FAQPage">FAQs</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NeuroLearn. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;