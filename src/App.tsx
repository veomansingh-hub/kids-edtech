import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import TopNav from './components/TopNav';
import GKLevelGrid from './components/GKLevelGrid';
import LearnCards from './components/LearnCards';
import QuizPlayer from './components/QuizPlayer';
import NurseryPlayroom from './components/NurseryPlayroom';
import ParentsHub from './components/ParentsHub';
import UpgradeModal from './components/UpgradeModal';
import { getChildProgress, saveChildProgress } from './utils/progressStore';
import { ChildProfile, DEMO_USERS } from './data/users';
import { GKLevel } from './data/gkLevels';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('gk');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [loggedInChild, setLoggedInChild] = useState<string | null>(() => {
    return sessionStorage.getItem('curiokids_active_child') || null;
  });

  const [currentChild, setCurrentChild] = useState<ChildProfile | null>(null);

  // Upgrade Modal triggers
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [selectedUpgradeLevel, setSelectedUpgradeLevel] = useState<GKLevel | null>(null);

  // Lesson view triggers: 'grid' | 'learn' | 'quiz'
  const [gkView, setGkView] = useState<'grid' | 'learn' | 'quiz'>('grid');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('1');

  // Load child state upon login
  useEffect(() => {
    if (loggedInChild) {
      const progress = getChildProgress(loggedInChild);
      
      // Calculate daily streaks
      const today = new Date().toDateString();
      const lastLoginDate = localStorage.getItem(`curiokids_last_login_${loggedInChild}`);
      
      if (lastLoginDate && lastLoginDate !== today) {
        // Increment streak if logged in on consecutive days
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (lastLoginDate === yesterday) {
          progress.streak = (progress.streak || 1) + 1;
        } else {
          progress.streak = 1;
        }
      } else if (!lastLoginDate) {
        progress.streak = 1;
      }
      
      localStorage.setItem(`curiokids_last_login_${loggedInChild}`, today);
      saveChildProgress(loggedInChild, progress);
      setCurrentChild(progress);
    } else {
      setCurrentChild(null);
    }
  }, [loggedInChild]);

  const handleLoginSuccess = (username: string) => {
    setLoggedInChild(username);
    sessionStorage.setItem('curiokids_active_child', username);
  };

  const handleLogout = () => {
    setLoggedInChild(null);
    sessionStorage.removeItem('curiokids_active_child');
    setCurrentChild(null);
  };

  const syncChildProgress = () => {
    if (loggedInChild) {
      setCurrentChild(getChildProgress(loggedInChild));
    }
  };

  const handleUpgradeClick = (level?: GKLevel) => {
    if (level) setSelectedUpgradeLevel(level);
    else setSelectedUpgradeLevel(null);
    setIsUpgradeOpen(true);
  };

  const handleUnlockSimulate = (levelId: string) => {
    if (!loggedInChild || !currentChild) return;
    
    let unlocked = [...currentChild.unlockedLevels];
    if (levelId === 'all') {
      unlocked = ["1", "2", "3", "4", "5"];
    } else {
      if (!unlocked.includes(levelId)) {
        unlocked.push(levelId);
      }
    }
    
    const updated = {
      ...currentChild,
      unlockedLevels: unlocked
    };
    
    // Persist unlocks in localStorage
    saveChildProgress(loggedInChild, updated);
    setCurrentChild(updated);
    
    // Also save in paid locks list to maintain persistence across resets
    const paidKey = 'curiokids_paid_locks_v2';
    const savedPaid = localStorage.getItem(`${paidKey}_${loggedInChild}`);
    let list: string[] = savedPaid ? JSON.parse(savedPaid) : [];
    if (levelId === 'all') {
      list = ["3", "4", "5"];
    } else if (!list.includes(levelId)) {
      list.push(levelId);
    }
    localStorage.setItem(`${paidKey}_${loggedInChild}`, JSON.stringify(list));
  };

  // Add XP when children solve quizzes
  const handleQuizFinished = (score: number, xpEarned: number) => {
    if (!loggedInChild || !currentChild) return;

    const completed = { ...currentChild.completedQuizzes };
    const prevMax = completed[selectedLevelId] || 0;
    if (score > prevMax) {
      completed[selectedLevelId] = score;
    }

    // Auto unlock next level if score is 5+ (50%+) and it is Level 1 -> Unlocks Level 2
    let unlocked = [...currentChild.unlockedLevels];
    if (score >= 5) {
      if (selectedLevelId === "1" && !unlocked.includes("2")) {
        unlocked.push("2");
      }
    }

    const updated: ChildProfile = {
      ...currentChild,
      xp: currentChild.xp + xpEarned,
      completedQuizzes: completed,
      unlockedLevels: unlocked
    };

    saveChildProgress(loggedInChild, updated);
    setCurrentChild(updated);
    setGkView('grid');
  };

  // Traced worksheets stars persistence
  const handleWorksheetFinished = (activityId: string, starsEarned: number) => {
    if (!loggedInChild || !currentChild) return;

    const worksheets = [...(currentChild.completedWorksheets || [])];
    if (!worksheets.includes(activityId)) {
      worksheets.push(activityId);
    }

    const updated: ChildProfile = {
      ...currentChild,
      xp: currentChild.xp + (starsEarned * 10), // 10 XP per star earned
      completedWorksheets: worksheets
    };

    saveChildProgress(loggedInChild, updated);
    setCurrentChild(updated);
    setActiveTab('nursery'); // Return to worksheets list
  };

  // Renders login screen if logged out
  if (!loggedInChild || !currentChild) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const isAllUnlocked = currentChild.unlockedLevels.includes("3") &&
                       currentChild.unlockedLevels.includes("4") &&
                       currentChild.unlockedLevels.includes("5");

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      {/* Top Navbar */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setGkView('grid'); // Reset GK view on tab change
        }}
        currentChild={currentChild}
        onLogout={handleLogout}
        lang={lang}
        setLang={setLang}
        onUpgradeClick={() => handleUpgradeClick()}
        isAllUnlocked={isAllUnlocked}
      />

      {/* Main Container Workspace */}
      <main className="flex-grow pb-12">
        
        {/* TABS 1: GK TRIVIA QUEST */}
        {activeTab === 'gk' && (
          <div>
            {gkView === 'grid' && (
              <GKLevelGrid
                currentChild={currentChild}
                onLearnSelect={(levelId) => {
                  setSelectedLevelId(levelId);
                  setGkView('learn');
                }}
                onQuizSelect={(levelId) => {
                  setSelectedLevelId(levelId);
                  setGkView('quiz');
                }}
                onUnlockClick={handleUpgradeClick}
                lang={lang}
              />
            )}

            {gkView === 'learn' && (
              <LearnCards
                levelId={selectedLevelId}
                onBackToDashboard={() => setGkView('grid')}
                onStartQuiz={(levelId) => {
                  setSelectedLevelId(levelId);
                  setGkView('quiz');
                }}
                lang={lang}
              />
            )}

            {gkView === 'quiz' && (
              <QuizPlayer
                levelId={selectedLevelId}
                username={loggedInChild}
                onQuizFinished={handleQuizFinished}
                onBackToDashboard={() => setGkView('grid')}
                lang={lang}
              />
            )}
          </div>
        )}

        {/* TABS 2: NURSERY WORKBOOKS */}
        {activeTab === 'nursery' && (
          <NurseryPlayroom
            username={loggedInChild}
            onWorksheetFinished={handleWorksheetFinished}
            lang={lang}
          />
        )}

        {/* TABS 3: PARENTS SETTINGS PORTAL */}
        {activeTab === 'parents' && (
          <ParentsHub
            currentChild={currentChild}
            lang={lang}
            onProgressUpdated={syncChildProgress}
          />
        )}

      </main>

      {/* Upgrade Payment Modal Gateway */}
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        targetLevel={selectedUpgradeLevel}
        onUnlockSimulate={handleUnlockSimulate}
      />

      {/* Footer copyright */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 font-body print:hidden">
        <p>© 2026 CurioKids Learning Hub Inc. Designed for bright young minds. Vercel & UPI Certified.</p>
      </footer>

    </div>
  );
}
export { App };
