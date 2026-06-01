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
import { BookOpen, Sparkles, Trophy, Users, Award, Play } from 'lucide-react';

export default function App() {
  // Screens: 'homepage' | 'login' | 'dashboard'
  const [currentScreen, setCurrentScreen] = useState<'homepage' | 'login' | 'dashboard'>('homepage');
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
      setCurrentScreen('dashboard');
    } else {
      setCurrentChild(null);
      setCurrentScreen('homepage');
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
    setCurrentScreen('homepage');
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
    
    saveChildProgress(loggedInChild, updated);
    setCurrentChild(updated);
    
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

  const handleQuizFinished = (score: number, xpEarned: number) => {
    if (!loggedInChild || !currentChild) return;

    const completed = { ...currentChild.completedQuizzes };
    const prevMax = completed[selectedLevelId] || 0;
    if (score > prevMax) {
      completed[selectedLevelId] = score;
    }

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

  const handleWorksheetFinished = (activityId: string, starsEarned: number) => {
    if (!loggedInChild || !currentChild) return;

    const worksheets = [...(currentChild.completedWorksheets || [])];
    if (!worksheets.includes(activityId)) {
      worksheets.push(activityId);
    }

    const updated: ChildProfile = {
      ...currentChild,
      xp: currentChild.xp + (starsEarned * 10),
      completedWorksheets: worksheets
    };

    saveChildProgress(loggedInChild, updated);
    setCurrentChild(updated);
    setActiveTab('nursery');
  };

  // Screen 1: MARKETING HOMEPAGE LANDING
  if (currentScreen === 'homepage') {
    return (
      <div className="min-h-screen flex flex-col justify-between font-body bg-gradient-to-br from-indigo-50 via-pink-50 to-amber-50">
        
        {/* Homepage Header */}
        <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 cursor-pointer">
              <span className="text-3xl animate-bounce">✨</span>
              <span className="text-2xl font-kid font-bold text-primary-purple">CurioKids</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 pl-8">Made by Aarti Gurjar</span>
          </div>

          <button
            onClick={() => setCurrentScreen('login')}
            className="bg-primary-purple text-white font-kid text-sm px-6 py-2.5 rounded-full shadow hover:bg-opacity-95 active:scale-95 transition"
          >
            Log In
          </button>
        </header>

        {/* Hero Slogan Section */}
        <div className="max-w-7xl mx-auto px-6 py-12 flex-grow flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
          
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="text-[11px] font-bold uppercase tracking-wider text-primary-pink bg-pink-100/50 px-3 py-1 rounded-full inline-block">
              ✨ Welcome to CurioKids Learning Hub
            </div>
            
            {/* Catchy 3-word slogan */}
            <h1 className="text-5xl sm:text-7xl font-kid leading-none text-slate-800">
              Learn. <span className="text-primary-pink">Create.</span> <span className="text-primary-blue">Play.</span>
            </h1>
            
            <p className="text-slate-500 text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
              CurioKids is a playful, gamified interactive workspace for kids to explore world geography, space systems, coloring worksheets, and trace shapes!
            </p>

            <div className="flex justify-center lg:justify-start gap-4">
              <button
                onClick={() => setCurrentScreen('login')}
                className="bg-primary-pink text-white font-kid text-lg px-8 py-3.5 rounded-2xl shadow-md hover:bg-opacity-90 active:scale-95 transition flex items-center gap-2"
              >
                <Play size={18} fill="white" />
                <span>Start Learning Free</span>
              </button>
            </div>
          </div>

          {/* Right visual picture card */}
          <div className="flex-1 max-w-md bg-white border-4 border-dashed border-primary-blue/30 rounded-[3rem] p-8 shadow-premium relative text-center">
            <div className="absolute -top-6 -left-6 text-4xl animate-bounce">🎨</div>
            <div className="absolute -bottom-6 -right-6 text-4xl animate-bounce animation-delay-2000">🚀</div>

            <div className="flex justify-center gap-3 mb-6">
              <span className="text-5xl">🦁</span>
              <span className="text-5xl">🦋</span>
              <span className="text-5xl">🚀</span>
              <span className="text-5xl">⭐</span>
            </div>

            <h3 className="font-kid text-2xl text-slate-800 mb-2">5 Kids Profile Playgrounds</h3>
            <p className="text-xs text-slate-500 font-body leading-relaxed mb-6">
              Pick your profile, solve daily trivia quizzes, trace raindrop streams, and fill colouring worksheets to earn stars and level up!
            </p>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs font-kid text-slate-500">
              <div>🧠 5 GK Levels</div>
              <div>📍 15 Worksheets</div>
              <div>🗣️ Hindi & English</div>
              <div>🏆 Practice & Challenge</div>
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <section className="bg-white/80 py-12 px-6 border-t border-slate-100">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="font-kid text-3xl text-slate-800 mb-8">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="p-6 border-2 border-slate-100 rounded-3xl hover:border-primary-pink transition duration-200">
                <span className="text-5xl block mb-4">🧠</span>
                <h3 className="font-kid text-xl text-slate-800 mb-2">GK Trivia Quest</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-body">
                  Master Indian nicknames, first prime ministers, rocket space operations, Ashoka monuments, and world records through dynamic shuffled quizzes!
                </p>
              </div>

              <div className="p-6 border-2 border-slate-100 rounded-3xl hover:border-primary-blue transition duration-200">
                <span className="text-5xl block mb-4">🎈</span>
                <h3 className="font-kid text-xl text-slate-800 mb-2">Nursery Worksheets</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-body">
                  Trace dotted shapes, match colors, color outline drawings, separate odd one out, and print direct A4 worksheets for offline learning!
                </p>
              </div>

              <div className="p-6 border-2 border-slate-100 rounded-3xl hover:border-primary-purple transition duration-200">
                <span className="text-5xl block mb-4">📊</span>
                <h3 className="font-kid text-xl text-slate-800 mb-2">Parents Hub</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-body">
                  Review completed quizzes, manual unlock triggers for paid levels, export logs, and configure custom lessons for your little ones!
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 text-center text-xs text-slate-400 font-body border-t border-slate-100 bg-white">
          <p>© 2026 CurioKids Learning Hub. All rights reserved.</p>
        </footer>

      </div>
    );
  }

  // Screen 2: LOGIN GATE
  if (currentScreen === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={(username) => {
          handleLoginSuccess(username);
          setCurrentScreen('dashboard');
        }} 
      />
    );
  }

  const isAllUnlocked = currentChild.unlockedLevels.includes("3") &&
                       currentChild.unlockedLevels.includes("4") &&
                       currentChild.unlockedLevels.includes("5");

  // Screen 3: DASHBOARD WORKSPACE
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-indigo-50 via-pink-50 to-amber-50">
      
      {/* Top Navbar */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setGkView('grid');
        }}
        currentChild={currentChild}
        onLogout={handleLogout}
        onProfileSwitch={() => setCurrentScreen('login')}
        lang={lang}
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
                setLang={setLang}
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
