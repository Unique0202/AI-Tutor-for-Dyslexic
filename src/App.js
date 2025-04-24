import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import GameDetail from './pages/GameDetail';
import ChatbotPage from './pages/ChatbotPage';
import ProfilePage from './pages/ProfilePage';
import AccessibilityProvider from './contexts/AccessibilityContext';
import FAQPage from './components/FAQPage';
import 'regenerator-runtime/runtime';

function App() {
  return (
    <AccessibilityProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/games/:gameId" element={<GameDetail />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/FAQPage" element={<FAQPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AccessibilityProvider>
  );
}

export default App;