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
      <div className="min-h-screen flex flex-col justify-between font-body bg-[#e2dbfc]">
        
        {/* Homepage Header */}
        <header className="px-6 py-4 max-w-7xl mx-auto w-full flex items-center justify-between relative z-30">
          <div className="flex items-center gap-4">
            {/* Circular Back Arrow */}
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center cursor-pointer bg-white hover:bg-slate-50 transition active:scale-90" onClick={() => setCurrentScreen('login')}>
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </div>
            {/* Brand Logo */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setCurrentScreen('login')}>
                <span className="text-3xl animate-bounce">🐻</span>
                <span className="text-2xl font-black text-slate-800 tracking-wider">KOA</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 tracking-wider">Made by Aarti Gurjar</span>
            </div>
          </div>

          {/* Center Navigation Pills */}
          <nav className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-widest font-black text-slate-700">
            <a href="#shop-all" onClick={() => setCurrentScreen('login')} className="hover:text-[#ff6f3c] transition">Shop All</a>
            <a href="#starter-kit" onClick={() => setCurrentScreen('login')} className="hover:text-[#ff6f3c] transition">Starter Kit</a>
            <a href="#multivitamin" onClick={() => setCurrentScreen('login')} className="hover:text-[#ff6f3c] transition">Multivitamin</a>
            <a href="#immunity" onClick={() => setCurrentScreen('login')} className="hover:text-[#ff6f3c] transition">Immunity</a>
            <a href="#pre-probiotic" onClick={() => setCurrentScreen('login')} className="hover:text-[#ff6f3c] transition">Pre-Probiotic</a>
          </nav>

          {/* Top Right Controls */}
          <div className="flex items-center gap-4 text-slate-600">
            <button onClick={() => setCurrentScreen('login')} className="hover:text-slate-900 transition p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            <button onClick={() => setCurrentScreen('login')} className="hover:text-slate-900 transition p-1 flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>
            <button onClick={() => setCurrentScreen('login')} className="relative hover:text-slate-900 transition p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span className="absolute -top-2 -right-2 bg-[#ff6f3c] text-white rounded-full w-4 h-4 text-[9px] font-bold flex items-center justify-center">0</span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-6 flex-grow flex flex-col items-center justify-center text-center gap-6 w-full relative">
          
          <h1 className="text-5xl sm:text-7xl font-black leading-none text-slate-800 uppercase tracking-tighter max-w-4xl z-10 relative mt-4 select-none">
            KIDS' WELLNESS <br/>
            <span className="text-slate-800">MADE WONDERFUL</span>
          </h1>

          {/* Two-Column split screen container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full max-w-6xl mt-4 z-10 relative">
            
            {/* Left Column: Hands holding Bear */}
            <div className="lg:col-span-5 relative rounded-[3rem] overflow-hidden shadow-2xl border-[6px] border-white group bg-purple-100 flex flex-col min-h-[350px] lg:min-h-0 justify-between">
              <img 
                src="/hero_hands_bear.png" 
                alt="Hands and bear toy" 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-105" 
              />
              {/* Grab My Starter Kit Yellow Button overlaid exactly */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
                <button
                  onClick={() => setCurrentScreen('login')}
                  className="bg-[#fbec5d] hover:bg-[#f6e03f] text-slate-800 font-black text-xs md:text-sm tracking-wide px-6 py-3 rounded-full border-2 border-slate-800 shadow-[3px_3px_0px_#2f3542] flex items-center gap-3 transition transform active:scale-95 whitespace-nowrap"
                >
                  Grab My Starter Kit — 50% Off 
                  <span className="bg-[#ff6f3c] text-white p-1 rounded-full flex items-center justify-center w-5 h-5 text-xs font-bold">↗</span>
                </button>
              </div>
            </div>

            {/* Right Column: What We Do */}
            <div className="lg:col-span-7 flex flex-col text-left">
              <div className="bg-[#fcfbf9] border-[3px] border-[#2f3542] rounded-[2.5rem] p-6 sm:p-8 flex flex-col gap-6 shadow-[8px_8px_0px_rgba(47,53,66,0.15)] h-full justify-between">
                
                <h2 className="text-center font-black text-2xl uppercase tracking-wider text-slate-800 border-b-2 border-dashed border-slate-200 pb-3">What We Do</h2>
                
                {/* GK Trivia Quest Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-amber-300 transition duration-300">
                  <div className="text-4xl p-2 bg-amber-50 rounded-xl select-none">🧠</div>
                  <div className="flex-grow w-full">
                    <div className="flex items-center gap-2 justify-between flex-wrap">
                      <h3 className="font-black text-slate-800 text-sm sm:text-base uppercase">GK Trivia Quest</h3>
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Level 1 to 5 Quizzes</span>
                    </div>
                    <p className="text-xs text-slate-600 font-body mt-1 leading-relaxed">
                      Master Indian nicknames, first prime ministers, rocket space operations, Ashoka monuments, and world records through dynamic shuffled quizzes!
                    </p>
                    <button 
                      onClick={() => setCurrentScreen('login')}
                      className="mt-2 text-xs font-black text-[#ff6f3c] hover:underline flex items-center gap-1"
                    >
                      Start Quiz Quest ↗
                    </button>
                  </div>
                </div>

                {/* Nursery Worksheets Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-pink-300 transition duration-300">
                  <div className="text-4xl p-2 bg-pink-50 rounded-xl select-none">🎈</div>
                  <div className="flex-grow w-full">
                    <div className="flex items-center gap-2 justify-between flex-wrap">
                      <h3 className="font-black text-slate-800 text-sm sm:text-base uppercase">Nursery Worksheets</h3>
                      <span className="bg-pink-100 text-pink-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">15 Activity Worksheets</span>
                    </div>
                    <p className="text-xs text-slate-600 font-body mt-1 leading-relaxed">
                      Trace dotted shapes, match colors, color outline drawings, separate odd one out, and print direct A4 worksheets for offline learning!
                    </p>
                    <button 
                      onClick={() => setCurrentScreen('login')}
                      className="mt-2 text-xs font-black text-[#ff6f3c] hover:underline flex items-center gap-1"
                    >
                      Start Worksheets ↗
                    </button>
                  </div>
                </div>

                {/* Parents Hub Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-300 transition duration-300">
                  <div className="text-4xl p-2 bg-indigo-50 rounded-xl select-none">📊</div>
                  <div className="flex-grow w-full">
                    <div className="flex items-center gap-2 justify-between flex-wrap">
                      <h3 className="font-black text-slate-800 text-sm sm:text-base uppercase">Parents Hub</h3>
                      <span className="bg-indigo-100 text-indigo-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Unlocked Levels & Stats</span>
                    </div>
                    <p className="text-xs text-slate-600 font-body mt-1 leading-relaxed">
                      Review completed quizzes, manual unlock triggers for paid levels, export logs, and configure custom lessons for your little ones!
                    </p>
                    <button 
                      onClick={() => setCurrentScreen('login')}
                      className="mt-2 text-xs font-black text-[#ff6f3c] hover:underline flex items-center gap-1"
                    >
                      Open Parents Portal ↗
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Cloud Scalloped Card Container resembling 'Shop Vitamins' reference */}
          <div className="w-full max-w-4xl bg-white border-[3px] border-[#2f3542] rounded-[3rem] p-8 md:p-12 shadow-[10px_10px_0px_rgba(47,53,66,0.15)] relative mt-12 overflow-hidden">
            {/* Scalloped edge design inside */}
            <div className="absolute inset-2 border-2 border-dashed border-[#2f3542]/20 rounded-[2.5rem] pointer-events-none"></div>

            <h2 className="font-black text-3xl text-slate-800 mb-10 uppercase tracking-wide text-center">SHOP VITAMINS</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              
              {/* Product 1: Starter Kit */}
              <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 flex flex-col items-center justify-between text-center relative group hover:shadow-lg hover:border-amber-300 transition duration-300">
                <div className="h-36 flex items-center justify-center w-full mb-3">
                  <img src="/yellow_bear_toy.png" alt="Starter Kit" className="h-28 object-contain transition duration-300 group-hover:scale-110" />
                </div>
                <div>
                  <h3 className="font-black text-[#2f3542] text-sm uppercase tracking-wide">STARTER KIT</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-4 mt-1">ALL 3 VITAMINS</span>
                </div>
                <button 
                  onClick={() => setCurrentScreen('login')}
                  className="w-full bg-[#f8f9fa] text-slate-700 font-black text-xs py-2.5 px-4 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition active:scale-95"
                >
                  Shop Now
                  <span className="bg-[#ff6f3c] text-white p-1 rounded-lg flex items-center justify-center w-5 h-5 text-xs font-bold">↗</span>
                </button>
              </div>

              {/* Product 2: Grow + Thrive */}
              <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 flex flex-col items-center justify-between text-center relative group hover:shadow-lg hover:border-emerald-300 transition duration-300">
                <div className="h-36 flex items-center justify-center w-full mb-3">
                  <img src="/yellow_bear_toy.png" alt="Grow + Thrive" className="h-28 object-contain hue-rotate-[120deg] transition duration-300 group-hover:scale-110" />
                </div>
                <div>
                  <h3 className="font-black text-[#2f3542] text-sm uppercase tracking-wide">GROW+THRIVE</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-4 mt-1">MULTI-VITAMIN</span>
                </div>
                <button 
                  onClick={() => setCurrentScreen('login')}
                  className="w-full bg-[#f8f9fa] text-slate-700 font-black text-xs py-2.5 px-4 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition active:scale-95"
                >
                  Shop Now
                  <span className="bg-[#ff6f3c] text-white p-1 rounded-lg flex items-center justify-center w-5 h-5 text-xs font-bold">↗</span>
                </button>
              </div>

              {/* Product 3: Boost */}
              <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 flex flex-col items-center justify-between text-center relative group hover:shadow-lg hover:border-pink-300 transition duration-300">
                <div className="h-36 flex items-center justify-center w-full mb-3">
                  <img src="/yellow_bear_toy.png" alt="Boost" className="h-28 object-contain hue-rotate-[320deg] transition duration-300 group-hover:scale-110" />
                </div>
                <div>
                  <h3 className="font-black text-[#2f3542] text-sm uppercase tracking-wide">BOOST</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-4 mt-1">IMMUNITY</span>
                </div>
                <button 
                  onClick={() => setCurrentScreen('login')}
                  className="w-full bg-[#f8f9fa] text-slate-700 font-black text-xs py-2.5 px-4 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition active:scale-95"
                >
                  Shop Now
                  <span className="bg-[#ff6f3c] text-white p-1 rounded-lg flex items-center justify-center w-5 h-5 text-xs font-bold">↗</span>
                </button>
              </div>

              {/* Product 4: Tummy Time */}
              <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 flex flex-col items-center justify-between text-center relative group hover:shadow-lg hover:border-yellow-300 transition duration-300">
                <div className="h-36 flex items-center justify-center w-full mb-3">
                  <img src="/yellow_bear_toy.png" alt="Tummy Time" className="h-28 object-contain brightness-95 transition duration-300 group-hover:scale-110" />
                </div>
                <div>
                  <h3 className="font-black text-[#2f3542] text-sm uppercase tracking-wide">TUMMY TIME</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-4 mt-1">PRE + PROBIOTICS</span>
                </div>
                <button 
                  onClick={() => setCurrentScreen('login')}
                  className="w-full bg-[#f8f9fa] text-slate-700 font-black text-xs py-2.5 px-4 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition active:scale-95"
                >
                  Shop Now
                  <span className="bg-[#ff6f3c] text-white p-1 rounded-lg flex items-center justify-center w-5 h-5 text-xs font-bold">↗</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Tilted Yellow slogan ribbon banner */}
        <div className="w-full bg-[#feca57] text-[#2f3542] py-4 -rotate-1 transform font-black text-sm tracking-wider text-center border-y-4 border-[#2f3542] uppercase flex items-center justify-around flex-wrap gap-4 select-none my-12">
          <span>Backed by Science 🌼</span>
          <span>Loved by Kids 😊</span>
          <span>Made by Aarti Gurjar 🌟</span>
        </div>

        {/* Bottom promo banner matching the orange/red layout in screenshot */}
        <div className="w-full bg-[#ff7f50] text-white py-16 px-6 relative overflow-hidden">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            {/* Box mockup / details */}
            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 w-full md:w-1/2 flex items-center justify-center">
              <img src="/yellow_bear_toy.png" alt="All in one place" className="h-44 object-contain animate-pulse" />
              <div className="absolute top-4 right-4 bg-yellow-400 text-slate-800 text-xs font-black uppercase px-3 py-1 rounded-full rotate-12">
                WINNER
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-4 text-left">
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight">
                ALL THE GOODNESS KIDS NEED, ALL IN ONE PLACE
              </h2>
              <p className="text-white/90 text-sm font-semibold tracking-wide">
                Engineered for kids. Approved by parents. 100% fun guaranteed.
              </p>
              <button
                onClick={() => setCurrentScreen('login')}
                className="bg-white text-slate-800 font-black text-sm px-6 py-3.5 rounded-2xl shadow hover:bg-slate-50 transition active:scale-95 w-fit mt-2"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 text-center text-xs text-slate-500 font-body border-t border-slate-300 bg-white/20 print:hidden">
          <p>© 2026 CurioKids Learning Hub Inc. All rights reserved.</p>
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
