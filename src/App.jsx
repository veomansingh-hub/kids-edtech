import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, ShieldCheck, CreditCard, Award, Flame, User } from 'lucide-react';
import AbacusSimulator from './components/AbacusSimulator';
import GKExplorer from './components/GKExplorer';
import SubscriptionPaywall from './components/SubscriptionPaywall';
import ParentDashboard from './components/ParentDashboard';
import Login from './components/Login';
import './App.css';

export default function App() {
  // Navigation active tab page ('abacus', 'gk', 'parents', 'paywall')
  const [activePage, setActivePage] = useState('abacus');
  
  // High fidelity persistable states in Local Storage
  const [isPro, setIsPro] = useState(() => {
    const saved = localStorage.getItem('curiokids_pro');
    return saved ? JSON.parse(saved) : false;
  });

  const [xpCount, setXpCount] = useState(() => {
    const saved = localStorage.getItem('curiokids_xp');
    return saved ? parseInt(saved) : 0;
  });

  // Login authentication state synchronized with sessionStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = sessionStorage.getItem('curiokids_logged_in');
    return saved ? JSON.parse(saved) : false;
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem('curiokids_logged_in', 'true');
  };

  // Keep hash routes in sync for internal link anchors (e.g. going to paywall from quiz)
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['abacus', 'gk', 'parents', 'paywall'].includes(hash)) {
        setActivePage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isLoggedIn]);

  // Update URL hash when page changes
  const handlePageChange = (page) => {
    setActivePage(page);
    window.location.hash = page;
  };

  const addXp = (amount) => {
    setXpCount(prev => {
      const nextXp = prev + amount;
      localStorage.setItem('curiokids_xp', nextXp.toString());
      return nextXp;
    });
  };

  const setProState = (proVal) => {
    setIsPro(proVal);
    localStorage.setItem('curiokids_pro', JSON.stringify(proVal));
  };

  // XP Gamified Level calculation
  // Level increases every 100 XP points
  const currentLevel = Math.floor(xpCount / 100) + 1;
  const xpInCurrentLevel = xpCount % 100;

  // Gate app behind Login authentication
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-root-container">
      {/* Magical floating bubbles background decorations */}
      <div className="bg-bubble b1 animate-float"></div>
      <div className="bg-bubble b2 animate-float"></div>
      <div className="bg-bubble b3 animate-float"></div>

      {/* Modern Glowing Navigation Header */}
      <header className="app-navbar-header card-premium">
        <div className="nav-logo" onClick={() => handlePageChange('abacus')}>
          <span className="logo-sparkle animate-pulse">✨</span>
          <span className="logo-text">CurioKids</span>
        </div>

        {/* Dynamic Navigation Options */}
        <nav className="nav-options-list">
          <button 
            className={`nav-btn ${activePage === 'abacus' ? 'active' : ''}`}
            onClick={() => handlePageChange('abacus')}
          >
            🧮 Abacus rods
          </button>
          
          <button 
            className={`nav-btn ${activePage === 'gk' ? 'active' : ''}`}
            onClick={() => handlePageChange('gk')}
          >
            🧠 GK Trivia
          </button>

          <button 
            className={`nav-btn ${activePage === 'parents' ? 'active' : ''}`}
            onClick={() => handlePageChange('parents')}
          >
            📊 Parents Hub
          </button>
        </nav>

        {/* User Stats/Profile Section */}
        <div className="nav-profile-section">
          {/* Level Progression Indicator */}
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

          {/* Subscription State Badge */}
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
          
          {/* User Avatar decoration */}
          <div className="user-nav-avatar">
            <User size={18} />
          </div>
        </div>
      </header>

      {/* Main Content Arena with transition switches */}
      <main className="app-main-content">
        {activePage === 'abacus' && (
          <AbacusSimulator addXp={addXp} isPro={isPro} />
        )}
        {activePage === 'gk' && (
          <GKExplorer addXp={addXp} isPro={isPro} />
        )}
        {activePage === 'parents' && (
          <ParentDashboard isPro={isPro} setProState={setProState} xpCount={xpCount} />
        )}
        {activePage === 'paywall' && (
          <SubscriptionPaywall isPro={isPro} setProState={setProState} />
        )}
      </main>

      {/* Playful Interactive Footer */}
      <footer className="app-footer-bar">
        <p>© 2026 CurioKids EdTech Inc. Designed for bright little minds. Vercel & Stripe Certified.</p>
        <div className="footer-links-row">
          <a href="#parents">Parent Dashboard</a>
          <span className="dot">•</span>
          <a href="#paywall">CurioKids Club Pricing</a>
          <span className="dot">•</span>
          <a href="#abacus">AbacuStart Playground</a>
        </div>
      </footer>
    </div>
  );
}
