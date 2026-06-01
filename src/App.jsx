import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, ShieldCheck, CreditCard, Award, Flame, User, RefreshCw, Edit3 } from 'lucide-react';
import GKExplorer from './components/GKExplorer';
import SubscriptionPaywall from './components/SubscriptionPaywall';
import ParentDashboard from './components/ParentDashboard';
import NurseryActivities from './components/NurseryActivities';
import Login from './components/Login';
import './App.css';

const DEFAULT_PROFILES = [
  { id: 1, name: "Leo 🦁", xp: 0, level: 1, streak: 0 },
  { id: 2, name: "Penny 🐼", xp: 0, level: 1, streak: 0 },
  { id: 3, name: "Bella 🦄", xp: 0, level: 1, streak: 0 },
  { id: 4, name: "Felix 🦊", xp: 0, level: 1, streak: 0 },
  { id: 5, name: "Coco 🐨", xp: 0, level: 1, streak: 0 }
];

export default function App() {
  // Main default active page is now 'gk'
  const [activePage, setActivePage] = useState('gk');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = sessionStorage.getItem('curiokids_logged_in');
    return saved ? JSON.parse(saved) : false;
  });

  const [isPro, setIsPro] = useState(() => {
    const saved = localStorage.getItem('curiokids_pro');
    return saved ? JSON.parse(saved) : false;
  });

  // Profiles management in Local Storage
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('curiokids_profiles');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState(() => {
    const saved = localStorage.getItem('curiokids_active_profile_id');
    return saved ? parseInt(saved) : null;
  });

  const [editingProfileId, setEditingProfileId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Persist profiles and active profile
  useEffect(() => {
    localStorage.setItem('curiokids_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (activeProfileId !== null) {
      localStorage.setItem('curiokids_active_profile_id', activeProfileId.toString());
    } else {
      localStorage.removeItem('curiokids_active_profile_id');
    }
  }, [activeProfileId]);

  // Active daily study-time tracking per kid (increments every 10 seconds when tab is visible)
  useEffect(() => {
    if (!isLoggedIn || activeProfileId === null) return;

    const interval = setInterval(() => {
      if (document.hidden) return; // Bypass if the tab is blurred or minimized

      const today = new Date().toISOString().split('T')[0];
      const savedLog = localStorage.getItem('curiokids_time_log');
      const timeLog = savedLog ? JSON.parse(savedLog) : {};
      const profileIdStr = activeProfileId.toString();

      if (!timeLog[profileIdStr]) {
        timeLog[profileIdStr] = {};
      }
      if (!timeLog[profileIdStr][today]) {
        timeLog[profileIdStr][today] = 0;
      }

      // Add 10 seconds (expressed as minutes: 10 / 60)
      timeLog[profileIdStr][today] += (10 / 60);
      localStorage.setItem('curiokids_time_log', JSON.stringify(timeLog));
    }, 10000); // 10 second polling checks

    return () => clearInterval(interval);
  }, [isLoggedIn, activeProfileId]);

  // Keep hash routes in sync
  useEffect(() => {
    if (!isLoggedIn || activeProfileId === null) return;
    
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['gk', 'nursery', 'parents', 'paywall'].includes(hash)) {
        setActivePage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isLoggedIn, activeProfileId]);

  const handlePageChange = (page) => {
    setActivePage(page);
    window.location.hash = page;
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem('curiokids_logged_in', 'true');
  };

  const selectProfile = (id) => {
    setActiveProfileId(id);
    handlePageChange('gk');
  };

  // Add XP specifically to the active profile
  const addXp = (amount) => {
    if (activeProfileId === null) return;
    setProfiles(prev => prev.map(prof => {
      if (prof.id === activeProfileId) {
        const nextXp = prof.xp + amount;
        const nextLevel = Math.floor(nextXp / 100) + 1;
        return {
          ...prof,
          xp: nextXp,
          level: nextLevel
        };
      }
      return prof;
    }));
  };

  const setProState = (proVal) => {
    setIsPro(proVal);
    localStorage.setItem('curiokids_pro', JSON.stringify(proVal));
  };

  const startEditingProfile = (e, id, name) => {
    e.stopPropagation();
    setEditingProfileId(id);
    setEditingName(name);
  };

  const saveProfileName = (e, id) => {
    e.stopPropagation();
    if (!editingName.trim()) return;
    setProfiles(prev => prev.map(prof => {
      if (prof.id === id) {
        return { ...prof, name: editingName.trim() };
      }
      return prof;
    }));
    setEditingProfileId(null);
  };

  // Get active profile stats
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const currentLevel = activeProfile ? activeProfile.level : 1;
  const xpCount = activeProfile ? activeProfile.xp : 0;
  const xpInCurrentLevel = xpCount % 100;

  // Gate 1: Check general parent login credentials dolsa / dolsa123
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Gate 2: Who is playing today? (Profile Selection Screen)
  if (activeProfileId === null) {
    return (
      <div className="profile-select-container">
        <div className="login-bubble lb1 animate-float"></div>
        <div className="login-bubble lb2 animate-float"></div>

        <div className="profile-select-card card-premium">
          <div className="profile-logo">✨ CurioKids Playground</div>
          <h2>Who is learning today?</h2>
          <p className="profile-select-subtitle">Select your account or ask parents to rename profiles!</p>

          <div className="profiles-grid-selection">
            {profiles.map((prof) => (
              <div 
                key={prof.id} 
                className="profile-box-card animate-float"
                onClick={() => selectProfile(prof.id)}
              >
                <div className="profile-avatar-emoji">
                  {prof.id === 1 && "🦁"}
                  {prof.id === 2 && "🐼"}
                  {prof.id === 3 && "🦄"}
                  {prof.id === 4 && "🦊"}
                  {prof.id === 5 && "🐨"}
                </div>
                
                {editingProfileId === prof.id ? (
                  <div className="edit-name-group" onClick={e => e.stopPropagation()}>
                    <input 
                      type="text" 
                      value={editingName} 
                      onChange={e => setEditingName(e.target.value)}
                      maxLength={14}
                      autoFocus
                    />
                    <button 
                      className="btn-save-edit" 
                      onClick={e => saveProfileName(e, prof.id)}
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <div className="profile-name-holder">
                    <span className="profile-name">{prof.name}</span>
                    <button 
                      className="btn-edit-profile"
                      onClick={e => startEditingProfile(e, prof.id, prof.name)}
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
                
                <div className="profile-xp-pill">
                  Level {prof.level} • {prof.xp} XP
                </div>
              </div>
            ))}
          </div>

          <div className="parent-portal-redirect-badge" onClick={() => setActiveProfileId(profiles[0].id) || handlePageChange('parents')}>
            ⚙️ Enter Parents Portal directly
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root-container">
      {/* Background decoration bubbles */}
      <div className="bg-bubble b1 animate-float"></div>
      <div className="bg-bubble b2 animate-float"></div>
      <div className="bg-bubble b3 animate-float"></div>

      {/* Navigation Header */}
      <header className="app-navbar-header card-premium">
        <div className="nav-logo" onClick={() => handlePageChange('gk')}>
          <span className="logo-sparkle animate-pulse">✨</span>
          <span className="logo-text">CurioKids</span>
        </div>

        <nav className="nav-options-list">
          <button 
            className={`nav-btn ${activePage === 'gk' ? 'active' : ''}`}
            onClick={() => handlePageChange('gk')}
          >
            🧠 GK Trivia Quest
          </button>

          <button 
            className={`nav-btn ${activePage === 'nursery' ? 'active' : ''}`}
            onClick={() => handlePageChange('nursery')}
          >
            🎈 Nursery Playroom
          </button>

          <button 
            className={`nav-btn ${activePage === 'parents' ? 'active' : ''}`}
            onClick={() => handlePageChange('parents')}
          >
            📊 Parents Hub
          </button>
        </nav>

        {/* User stats profile / Account togglers */}
        <div className="nav-profile-section">
          {/* Active Profile Info */}
          <div className="nav-profile-pill" onClick={() => setActiveProfileId(null)}>
            <RefreshCw size={14} className="spin-hover" />
            <span>{activeProfile.name}</span>
          </div>

          <div className="level-progression-bar-wrapper">
            <div className="level-badge">Lvl {currentLevel}</div>
            <div className="xp-loading-rail">
              <div 
                className="xp-fill-slider" 
                style={{ width: `${xpInCurrentLevel}%` }}
              ></div>
            </div>
            <div className="xp-fraction-label">{xpInCurrentLevel}/100 XP</div>
          </div>

          {isPro ? (
            <div className="nav-badge pro-star animate-pulse" onClick={() => handlePageChange('paywall')}>
              👑 PRO
            </div>
          ) : (
            <button 
              className="btn-bouncy pink btn-upgrade-nav animate-float"
              onClick={() => handlePageChange('paywall')}
            >
              🚀 Upgrade
            </button>
          )}
          
          <div className="user-nav-avatar" onClick={() => setActiveProfileId(null)}>
            <span style={{ fontSize: '1.2rem' }}>
              {activeProfile.id === 1 && "🦁"}
              {activeProfile.id === 2 && "🐼"}
              {activeProfile.id === 3 && "🦄"}
              {activeProfile.id === 4 && "🦊"}
              {activeProfile.id === 5 && "🐨"}
            </span>
          </div>
        </div>
      </header>

      {/* Main view screens */}
      <main className="app-main-content">
        {activePage === 'gk' && (
          <GKExplorer addXp={addXp} isPro={isPro} />
        )}
        {activePage === 'nursery' && (
          <NurseryActivities addXp={addXp} isPro={isPro} />
        )}
        {activePage === 'parents' && (
          <ParentDashboard 
            isPro={isPro} 
            setProState={setProState} 
            profiles={profiles}
          />
        )}
        {activePage === 'paywall' && (
          <SubscriptionPaywall isPro={isPro} setProState={setProState} />
        )}
      </main>

      <footer className="app-footer-bar">
        <p>© 2026 CurioKids EdTech Inc. Designed for bright little minds. Vercel & Stripe Certified.</p>
        <div className="footer-links-row">
          <a href="#parents">Parent Dashboard</a>
          <span className="dot">•</span>
          <a href="#paywall">CurioKids Club Pricing</a>
          <span className="dot">•</span>
          <a href="#gk">GK Trivia Quest</a>
        </div>
      </footer>
    </div>
  );
}
