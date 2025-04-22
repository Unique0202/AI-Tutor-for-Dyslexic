import React, { useState } from 'react';
import { Calendar, BarChart2, Award, Clock, Settings } from 'lucide-react';
import TextToSpeech from '../components/TextToSpeech';
import { useAccessibility } from '../contexts/AccessibilityContext';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('progress');
  const { settings, updateSettings } = useAccessibility();
  
  const progressData = {
    recentGames: [
      { name: 'Reading Adventure', score: 85, date: '2025-05-10', duration: '15 mins' },
      { name: 'Letter Master', score: 92, date: '2025-05-09', duration: '12 mins' },
      { name: 'Word Builder', score: 78, date: '2025-05-08', duration: '18 mins' },
      { name: 'Spell Quest', score: 80, date: '2025-05-07', duration: '10 mins' }
    ],
    achievements: [
      { title: 'Reading Rookie', description: 'Completed first Reading Adventure', icon: '📚', date: '2025-05-03' },
      { title: 'Letter Legend', description: 'Mastered Level 3 in Letter Master', icon: '🔤', date: '2025-05-06' },
      { title: 'Word Wizard', description: 'Built 20 words correctly', icon: '🧩', date: '2025-05-08' },
      { title: 'Spelling Star', description: 'Perfect score in Spell Quest', icon: '✨', date: '2025-05-09' }
    ],
    skillLevels: [
      { skill: 'Reading', level: 4, max: 5 },
      { skill: 'Letter Recognition', level: 5, max: 5 },
      { skill: 'Spelling', level: 3, max: 5 },
      { skill: 'Vocabulary', level: 4, max: 5 }
    ],
    streak: 5
  };
  
  const handleFontChange = (e) => {
    updateSettings({ dyslexicFont: e.target.checked });
  };
  
  const handleContrastChange = (e) => {
    updateSettings({ highContrast: e.target.checked });
  };
  
  const handleTextSizeChange = (e) => {
    updateSettings({ largeText: e.target.checked });
  };
  
  const handleSpacingChange = (e) => {
    updateSettings({ extraSpacing: e.target.checked });
  };
  
  const handleReadingSpeedChange = (e) => {
    updateSettings({ readingSpeed: parseFloat(e.target.value) });
  };
  
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <span>👤</span>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">
            Student Profile
            <TextToSpeech text="Student Profile" />
          </h1>
          <p className="profile-stats">
            <span className="streak">
              <Calendar size={16} />
              {progressData.streak} Day Streak
            </span>
            <span className="total-games">
              <BarChart2 size={16} />
              12 Games Played
            </span>
          </p>
        </div>
      </div>
      
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <BarChart2 size={20} />
          <span>Progress</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          <Award size={20} />
          <span>Achievements</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
      
      <div className="profile-content">
        {activeTab === 'progress' && (
          <div className="progress-section">
            <div className="skill-levels">
              <h2 className="section-title">
                Your Skills
                <TextToSpeech text="Your Skills" />
              </h2>
              
              <div className="skills-grid">
                {progressData.skillLevels.map((skill, index) => (
                  <div key={index} className="skill-card">
                    <h3 className="skill-name">{skill.skill}</h3>
                    <div className="skill-level">
                      <div className="level-indicator">
                        {Array(skill.max).fill().map((_, i) => (
                          <span 
                            key={i} 
                            className={`level-star ${i < skill.level ? 'filled' : ''}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div className="level-text">Level {skill.level}/{skill.max}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="recent-activity">
              <h2 className="section-title">
                Recent Activity
                <TextToSpeech text="Recent Activity" />
              </h2>
              
              <div className="activity-list">
                {progressData.recentGames.map((game, index) => (
                  <div key={index} className="activity-card">
                    <div className="activity-header">
                      <div className="activity-name">{game.name}</div>
                      <div className="activity-score">{game.score}%</div>
                    </div>
                    <div className="activity-details">
                      <div className="activity-date">
                        <Calendar size={14} />
                        {new Date(game.date).toLocaleDateString()}
                      </div>
                      <div className="activity-duration">
                        <Clock size={14} />
                        {game.duration}
                      </div>
                    </div>
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ width: `${game.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'achievements' && (
          <div className="achievements-section">
            <h2 className="section-title">
              Your Achievements
              <TextToSpeech text="Your Achievements" />
            </h2>
            
            <div className="achievements-grid">
              {progressData.achievements.map((achievement, index) => (
                <div key={index} className="achievement-card">
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-info">
                    <h3 className="achievement-title">{achievement.title}</h3>
                    <p className="achievement-description">{achievement.description}</p>
                    <div className="achievement-date">
                      <Calendar size={14} />
                      {new Date(achievement.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="locked-achievements">
              <h3>Coming Soon</h3>
              <div className="locked-grid">
                <div className="locked-achievement">
                  <div className="locked-icon">🔒</div>
                  <div>Spelling Champion</div>
                </div>
                <div className="locked-achievement">
                  <div className="locked-icon">🔒</div>
                  <div>Reading Master</div>
                </div>
                <div className="locked-achievement">
                  <div className="locked-icon">🔒</div>
                  <div>10-Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="settings-section">
            <h2 className="section-title">
              Accessibility Settings
              <TextToSpeech text="Accessibility Settings" />
            </h2>
            
            <div className="settings-grid">
              <div className="setting-card">
                <div className="setting-header">
                  <h3>Display Settings</h3>
                </div>
                
                <div className="setting-options">
                  <div className="setting-option">
                    <label className="setting-label">
                      <input
                        type="checkbox"
                        checked={settings.dyslexicFont}
                        onChange={handleFontChange}
                      />
                      <span>Use Dyslexia-friendly Font</span>
                    </label>
                  </div>
                  
                  <div className="setting-option">
                    <label className="setting-label">
                      <input
                        type="checkbox"
                        checked={settings.highContrast}
                        onChange={handleContrastChange}
                      />
                      <span>High Contrast Mode</span>
                    </label>
                  </div>
                  
                  <div className="setting-option">
                    <label className="setting-label">
                      <input
                        type="checkbox"
                        checked={settings.largeText}
                        onChange={handleTextSizeChange}
                      />
                      <span>Larger Text Size</span>
                    </label>
                  </div>
                  
                  <div className="setting-option">
                    <label className="setting-label">
                      <input
                        type="checkbox"
                        checked={settings.extraSpacing}
                        onChange={handleSpacingChange}
                      />
                      <span>Extra Spacing Between Letters</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="setting-card">
                <div className="setting-header">
                  <h3>Text-to-Speech Settings</h3>
                </div>
                
                <div className="setting-options">
                  <div className="setting-option">
                    <label className="setting-label">
                      <input
                        type="checkbox"
                        checked={settings.textToSpeechEnabled}
                        onChange={(e) => updateSettings({ textToSpeechEnabled: e.target.checked })}
                      />
                      <span>Enable Text-to-Speech</span>
                    </label>
                  </div>
                  
                  <div className="setting-option">
                    <label className="setting-label">
                      <input
                        type="checkbox"
                        checked={settings.speechToTextEnabled}
                        onChange={(e) => updateSettings({ speechToTextEnabled: e.target.checked })}
                      />
                      <span>Enable Speech-to-Text</span>
                    </label>
                  </div>
                  
                  <div className="setting-option reading-speed">
                    <label className="setting-label">Reading Speed: {settings.readingSpeed}x</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={settings.readingSpeed}
                      onChange={handleReadingSpeedChange}
                      className="reading-speed-slider"
                    />
                    <div className="speed-labels">
                      <span>Slower</span>
                      <span>Faster</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-save">
              <button className="save-button">Save Settings</button>
              <p className="settings-note">Settings are automatically saved and applied across the site.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;