import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import GamesPage from './pages/GamesPage'
import GameDetail from './pages/GameDetail'
import ChatbotPage from './pages/ChatbotPage'
import ProfilePage from './pages/ProfilePage'
import FAQPage from './components/FAQPage'
import AccessibilityProvider from './contexts/AccessibilityContext'

function App() {
  return (
    <AccessibilityProvider>
      <Router>
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
          <Header />
          <main className="flex-1 pb-16 md:pb-0">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/learn" element={<GamesPage />} />
                <Route path="/learn/:gameId" element={<GameDetail />} />
                <Route path="/help" element={<ChatbotPage />} />
                <Route path="/progress" element={<ProfilePage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/games/:gameId" element={<GameDetail />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </Router>
    </AccessibilityProvider>
  )
}

export default App
