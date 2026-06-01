import React, { useState, useEffect } from 'react';
import { ChildProfile } from './data/users';
import { GKLevel, GK_LEVELS } from './data/gkLevels';
import { 
  getChildProgress, 
  saveChildProgress, 
  getPaidLevels, 
  savePaidLevels 
} from './utils/progressStore';

// Modular Component Imports
import TopNav from './components/TopNav';
import LoginPage from './components/LoginPage';
import GKLevelGrid from './components/GKLevelGrid';
import LearnCards from './components/LearnCards';
import QuizPlayer from './components/QuizPlayer';
import NurseryPlayroom from './components/NurseryPlayroom';
import ParentsHub from './components/ParentsHub';
import UpgradeModal from './components/UpgradeModal';

export default function App() {
  // Navigation & Session States
  const [activeTab, setActiveTab] = useState<string>('gk');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  
  // Authenticated Child Profile
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(() => {
    // 1. Try to get standard session key
    let username = localStorage.getItem('curiokids_active_child_username');
    // 2. Fallback to old session key for backward compatibility
    if (!username) {
      const oldSaved = localStorage.getItem('koa_active_child');
      if (oldSaved) {
        try {
          const parsed = JSON.parse(oldSaved);
          username = parsed.username;
          if (username) {
            localStorage.setItem('curiokids_active_child_username', username);
          }
        } catch (e) {}
      }
    }
    return username ? getChildProgress(username) : null;
  });

  // GK Trivia sub-views state
  const [gkViewMode, setGkViewMode] = useState<'grid' | 'learn' | 'quiz'>('grid');
  const [selectedGKLevelId, setSelectedGKLevelId] = useState<string | null>(null);

  // Upgrade Gate Modal states
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [targetUpgradeLevel, setTargetUpgradeLevel] = useState<GKLevel | null>(null);

  // Background Migration: Safe transfer of statistics from legacy format (koa_child_stats) to curiokids store v2
  useEffect(() => {
    const oldStatsStr = localStorage.getItem('koa_child_stats');
    if (oldStatsStr) {
      try {
        const oldStats = JSON.parse(oldStatsStr);
        Object.keys(oldStats).forEach(username => {
          const stats = oldStats[username];
          const standardProgress = getChildProgress(username);
          const standardSaved = localStorage.getItem(`curiokids_child_progress_v2_${username}`);
          
          if (!standardSaved) {
            standardProgress.xp = stats.xp || standardProgress.xp;
            standardProgress.level = Math.floor(standardProgress.xp / 100) + 1;
            standardProgress.streak = stats.streak || standardProgress.streak;
            standardProgress.unlockedLevels = Array.from(new Set([
              ...standardProgress.unlockedLevels,
              ...(stats.unlocked || [])
            ]));
            standardProgress.completedQuizzes = stats.completedQuizzes || standardProgress.completedQuizzes;
            saveChildProgress(username, standardProgress);
          }
        });
        localStorage.removeItem('koa_child_stats');
      } catch (e) {
        console.error("Backward-compatible stats migration failed:", e);
      }
    }
  }, []);

  // Sync activeChild profile stats from store to handle updates in real-time
  const refreshActiveProfile = () => {
    if (activeChild) {
      setActiveChild(getChildProgress(activeChild.username));
    }
  };

  // Auth Operations
  const handleLoginSuccess = (username: string) => {
    localStorage.setItem('curiokids_active_child_username', username);
    setActiveChild(getChildProgress(username));
    setActiveTab('gk');
    setGkViewMode('grid');
    setSelectedGKLevelId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('curiokids_active_child_username');
    setActiveChild(null);
    setSelectedGKLevelId(null);
    setGkViewMode('grid');
  };

  // GK Quest Navigation
  const handleLearnSelect = (levelId: string) => {
    setSelectedGKLevelId(levelId);
    setGkViewMode('learn');
  };

  const handleQuizSelect = (levelId: string) => {
    setSelectedGKLevelId(levelId);
    setGkViewMode('quiz');
  };

  const handleUnlockClick = (level: GKLevel) => {
    setTargetUpgradeLevel(level);
    setShowUpgradeModal(true);
  };

  // Quiz progression results
  const handleQuizFinished = (score: number, xpEarned: number) => {
    if (!activeChild) return;
    const username = activeChild.username;
    const progress = getChildProgress(username);
    
    progress.xp += xpEarned;
    progress.level = Math.floor(progress.xp / 100) + 1;
    if (selectedGKLevelId) {
      progress.completedQuizzes[selectedGKLevelId] = Math.max(
        progress.completedQuizzes[selectedGKLevelId] || 0,
        score
      );
    }
    
    saveChildProgress(username, progress);
    refreshActiveProfile();
    
    // Reset view back to explorer grid
    setGkViewMode('grid');
    setSelectedGKLevelId(null);
  };

  // Pre-Nursery/Nursery Activity Progression
  const handleWorksheetFinished = (activityId: string, stars: number) => {
    if (!activeChild) return;
    const username = activeChild.username;
    const progress = getChildProgress(username);
    
    if (!progress.completedWorksheets.includes(activityId)) {
      progress.completedWorksheets.push(activityId);
    }
    // Grant XP award: 5 XP per collected star
    progress.xp += stars * 5;
    progress.level = Math.floor(progress.xp / 100) + 1;
    
    saveChildProgress(username, progress);
    refreshActiveProfile();
  };

  // Checkout Upgrade unlocks
  const handleUnlockSimulate = (levelId: string) => {
    if (!activeChild) return;
    const username = activeChild.username;
    let locks = getPaidLevels(username);
    
    if (levelId === 'all') {
      locks = ['3', '4', '5'];
    } else {
      if (!locks.includes(levelId)) {
        locks.push(levelId);
      }
    }
    
    savePaidLevels(username, locks);
    refreshActiveProfile();
    setShowUpgradeModal(false);
  };

  // Unlocked levels status check for navbar crown
  const getIsAllUnlocked = () => {
    if (!activeChild) return false;
    const levels = activeChild.unlockedLevels || [];
    return levels.includes('3') && levels.includes('4') && levels.includes('5');
  };

  // -------------------------------------------------------------
  // RENDER VIEW CHANNELS
  // -------------------------------------------------------------

  // A. Welcome Authentication Guard
  if (!activeChild) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // B. Main Explorer Workspace Frame
  return (
    <div className="app-root-container min-h-screen bg-gradient-to-br from-[#fbf9fe] via-[#f5f0ff] to-[#fbf9fe] font-body flex flex-col justify-between">
      
      {/* Decorative Blur Ambient Bubbles for Premium Visual Depth */}
      <div className="bg-bubble b1"></div>
      <div className="bg-bubble b2"></div>
      <div className="bg-bubble b3"></div>

      {/* Global Interactive Header */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentChild={activeChild}
        onLogout={handleLogout}
        onProfileSwitch={handleLogout}
        lang={lang}
        onUpgradeClick={() => { setTargetUpgradeLevel(null); setShowUpgradeModal(true); }}
        isAllUnlocked={getIsAllUnlocked()}
      />

      {/* Active Tab Router Workspace */}
      <main className="app-main-content flex-grow relative z-10">
        
        {/* Tab 1: General Knowledge (GK) Trivia Quest */}
        {activeTab === 'gk' && (
          <div className="transition-all duration-300">
            {gkViewMode === 'grid' && (
              <GKLevelGrid
                currentChild={activeChild}
                onLearnSelect={handleLearnSelect}
                onQuizSelect={handleQuizSelect}
                onUnlockClick={handleUnlockClick}
                lang={lang}
                setLang={setLang}
              />
            )}

            {gkViewMode === 'learn' && selectedGKLevelId && (
              <LearnCards
                levelId={selectedGKLevelId}
                onBackToDashboard={() => { setGkViewMode('grid'); setSelectedGKLevelId(null); }}
                onStartQuiz={handleQuizSelect}
                lang={lang}
              />
            )}

            {gkViewMode === 'quiz' && selectedGKLevelId && (
              <QuizPlayer
                levelId={selectedGKLevelId}
                username={activeChild.username}
                onQuizFinished={handleQuizFinished}
                onBackToDashboard={() => { setGkViewMode('grid'); setSelectedGKLevelId(null); }}
                lang={lang}
              />
            )}
          </div>
        )}

        {/* Tab 2: Nursery & Pre-Nursery Playroom Worksheets */}
        {activeTab === 'nursery' && (
          <NurseryPlayroom
            username={activeChild.username}
            onWorksheetFinished={handleWorksheetFinished}
            lang={lang}
          />
        )}

        {/* Tab 3: Gated Parent Controls Dashboard */}
        {activeTab === 'parents' && (
          <ParentsHub
            currentChild={activeChild}
            lang={lang}
            onProgressUpdated={refreshActiveProfile}
          />
        )}

      </main>

      {/* Premium Visual Footer Attribution */}
      <footer className="app-footer-bar relative z-10 border-t border-slate-200/50 bg-white/40 backdrop-blur-md">
        <div className="footer-links-row text-xs font-kid text-slate-400">
          <span>© CurioKids Learning Studio</span>
          <span className="dot">•</span>
          <span className="text-primary-pink">Safe Sandbox Environment</span>
          <span className="dot">•</span>
          <span>Made by Aarti Gurjar</span>
        </div>
      </footer>

      {/* Modal Paywall Portal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        targetLevel={targetUpgradeLevel}
        onUnlockSimulate={handleUnlockSimulate}
      />

    </div>
  );
}
export { App };
