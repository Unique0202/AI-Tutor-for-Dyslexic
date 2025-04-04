import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../profile.css"; 

function Profile() {
  const [activeTab, setActiveTab] = useState("progress");
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "👨‍🎓",
    joinDate: "January 2023",
    learningStyle: "Visual Learner",
    readingLevel: "Intermediate",
    achievements: 15,
    streak: 7
  });
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...userData });
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate fetching user progress data
    const fetchProgressData = async () => {
      try {
        // In a real app, you would fetch from your API
        const mockData = [
          { id: 1, module: "Reading Adventure", progress: 75, lastAccessed: "2 days ago", icon: "📖" },
          { id: 2, module: "Letter Master", progress: 90, lastAccessed: "1 day ago", icon: "🔠" },
          { id: 3, module: "Word Builder", progress: 50, lastAccessed: "1 week ago", icon: "🧩" },
          { id: 4, module: "Spell Quest", progress: 30, lastAccessed: "3 weeks ago", icon: "✨" },
        ];
        setProgressData(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching progress data:", error);
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData(formData);
    setEditMode(false);
    // In a real app, you would save to the API here
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const filteredProgress = progressData.filter(item =>
    item.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="taskbar">
        <div className="taskbar-container">
          <Link to="/" className="taskbar-brand">
            <span className="logo-icon">📚</span>
            <span className="logo-text">NeuroLearn</span>
          </Link>

          <button 
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <div className={`taskbar-links ${mobileMenuOpen ? 'open' : ''}`}>
            <Link to="/learning-games" className="taskbar-link">Learning Games</Link>
            <Link to="/progress" className="taskbar-link">My Progress</Link>
            <Link to="/resources" className="taskbar-link">Resources</Link>
            <Link to="/about" className="taskbar-link">About</Link>
          </div>

          <form onSubmit={handleSearch} className="taskbar-search">
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
            <button type="submit" aria-label="Search">
              🔍
            </button>
          </form>

          <div className="taskbar-user">
            <button 
              className="user-button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-label="User menu"
            >
              <span className="user-avatar">{userData.avatar}</span>
            </button>
            
            {userMenuOpen && (
              <div className="user-menu">
                <Link to="/profile" className="user-menu-item">My Profile</Link>
                <Link to="/settings" className="user-menu-item">Settings</Link>
                <div className="user-menu-divider"></div>
                <button className="user-menu-item">Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Header */}
      <section className="profile-header">
        <div className="profile-avatar-container">
          <div className="profile-avatar">{userData.avatar}</div>
          {editMode && (
            <select
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
              className="avatar-selector"
            >
              <option value="👦">👦 Boy</option>
              <option value="👧">👧 Girl</option>
              <option value="👨">👨 Man</option>
              <option value="👩">👩 Woman</option>
              <option value="👨‍🎓">👨‍🎓 Student</option>
              <option value="👩‍🏫">👩‍🏫 Teacher</option>
            </select>
          )}
        </div>
        
        <div className="profile-info">
          {editMode ? (
            <form onSubmit={handleSubmit} className="profile-edit-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="learningStyle">Learning Style</label>
                <select
                  id="learningStyle"
                  name="learningStyle"
                  value={formData.learningStyle}
                  onChange={handleInputChange}
                >
                  <option value="Visual Learner">Visual Learner</option>
                  <option value="Auditory Learner">Auditory Learner</option>
                  <option value="Kinesthetic Learner">Kinesthetic Learner</option>
                  <option value="Multimodal Learner">Multimodal Learner</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="readingLevel">Reading Level</label>
                <select
                  id="readingLevel"
                  name="readingLevel"
                  value={formData.readingLevel}
                  onChange={handleInputChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="form-buttons">
                <button type="submit" className="save-button">Save Changes</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1>{userData.name}</h1>
              <p className="profile-email">{userData.email}</p>
              <div className="profile-meta">
                <span>Member since {userData.joinDate}</span>
                <span>{userData.learningStyle}</span>
                <span>Reading: {userData.readingLevel}</span>
              </div>
              <div className="profile-stats">
                <div className="stat-card">
                  <div className="stat-value">{userData.achievements}</div>
                  <div className="stat-label">Achievements</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{userData.streak}</div>
                  <div className="stat-label">Day Streak</div>
                </div>
              </div>
              <button 
                onClick={() => setEditMode(true)}
                className="edit-profile-button"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </section>

      {/* Profile Content Tabs */}
      <section className="profile-tabs">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            My Progress
          </button>
          <button
            className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
          <button
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'progress' && (
            <div className="progress-tab">
              <div className="search-container">
                <form onSubmit={handleSearch} className="progress-search">
                  <input
                    type="text"
                    placeholder="Search your progress..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search progress"
                  />
                  <button type="submit" aria-label="Search">
                    🔍
                  </button>
                </form>
              </div>
              
              {loading ? (
                <div className="loading-spinner">Loading your progress...</div>
              ) : (
                <div className="progress-grid">
                  {filteredProgress.map(item => (
                    <div key={item.id} className="progress-card">
                      <div className="progress-icon">{item.icon}</div>
                      <h3>{item.module}</h3>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                        <span className="progress-percent">{item.progress}%</span>
                      </div>
                      <p className="last-accessed">Last accessed: {item.lastAccessed}</p>
                      <Link 
                        to={`/learning-games/${item.module.toLowerCase().replace(' ', '-')}`}
                        className="continue-button"
                      >
                        Continue
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="achievements-tab">
              <h2>Your Learning Achievements</h2>
              <div className="achievements-grid">
                <div className="achievement-card">
                  <div className="achievement-icon">🏆</div>
                  <h3>Reading Explorer</h3>
                  <p>Completed 10 reading exercises</p>
                  <div className="achievement-date">Earned: Feb 15, 2023</div>
                </div>
                <div className="achievement-card">
                  <div className="achievement-icon">⭐</div>
                  <h3>Letter Master</h3>
                  <p>Recognized all letters of the alphabet</p>
                  <div className="achievement-date">Earned: Jan 28, 2023</div>
                </div>
                <div className="achievement-card">
                  <div className="achievement-icon">🎯</div>
                  <h3>7-Day Streak</h3>
                  <p>Practiced for 7 consecutive days</p>
                  <div className="achievement-date">Earned: Today</div>
                </div>
                <div className="achievement-card locked">
                  <div className="achievement-icon">🔒</div>
                  <h3>Word Wizard</h3>
                  <p>Spell 50 words correctly</p>
                  <div className="progress-to-unlock">25/50 completed</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-tab">
              <h2>Account Settings</h2>
              
              <div className="settings-section">
                <h3>Notification Preferences</h3>
                <div className="setting-option">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Daily reminder notifications
                  </label>
                </div>
                <div className="setting-option">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Weekly progress reports
                  </label>
                </div>
                <div className="setting-option">
                  <label>
                    <input type="checkbox" />
                    New feature announcements
                  </label>
                </div>
              </div>
              
              <div className="settings-section">
                <h3>Accessibility</h3>
                <div className="setting-option">
                  <label>
                    Dyslexia-friendly font
                    <select defaultValue="enabled">
                      <option value="enabled">Enabled</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </label>
                </div>
                <div className="setting-option">
                  <label>
                    Text size
                    <select defaultValue="medium">
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </label>
                </div>
                <div className="setting-option">
                  <label>
                    Color theme
                    <select defaultValue="default">
                      <option value="default">Default</option>
                      <option value="high-contrast">High Contrast</option>
                      <option value="dark">Dark Mode</option>
                    </select>
                  </label>
                </div>
              </div>
              
              <div className="settings-actions">
                <button className="save-settings">Save Settings</button>
                <button className="danger-button">Delete Account</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Profile;