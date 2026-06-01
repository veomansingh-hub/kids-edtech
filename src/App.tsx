import React, { useState, useEffect } from 'react';
import { ChildProfile, DEMO_USERS } from './data/users';

export default function App() {
  // Authentication & Progress State
  const [selectedUsername, setSelectedUsername] = useState<string>("aanya");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(() => {
    const saved = localStorage.getItem('koa_active_child');
    return saved ? JSON.parse(saved) : null;
  });
  const [childStats, setChildStats] = useState<{[username: string]: any}>(() => {
    const saved = localStorage.getItem('koa_child_stats');
    if (saved) return JSON.parse(saved);
    
    // Seed initial stats from DEMO_USERS
    const initial: {[username: string]: any} = {};
    DEMO_USERS.forEach(u => {
      initial[u.username] = {
        xp: u.xp || 100,
        unlocked: ["1", "2"], // 1 and 2 are free/unlocked
        completedQuizzes: {},
        stars: Math.floor((u.xp || 100) / 10),
        streak: u.streak || 1
      };
    });
    return initial;
  });

  // Current Modal / Popup States
  const [activeModal, setActiveModal] = useState<'gk' | 'nursery' | 'parents' | null>(null);
  const [showPremium, setShowPremium] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Quiz / Learn Sub-states inside GK
  const [gkView, setGkView] = useState<{levelId: string; mode: 'learn' | 'quiz'} | null>(null);
  const [currentLearnCardIndex, setCurrentLearnCardIndex] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);

  // Nursery Activity Sub-states
  const [nurseryView, setNurseryView] = useState<{levelId: string} | null>(null);
  const [alphabetAudioLetter, setAlphabetAudioLetter] = useState<string>("");
  const [starsToCount, setStarsToCount] = useState<number>(5);
  const [userStarCountInput, setUserStarCountInput] = useState<number | null>(null);
  const [countingFeedback, setCountingFeedback] = useState<string>("");

  // Save state helpers
  useEffect(() => {
    localStorage.setItem('koa_child_stats', JSON.stringify(childStats));
  }, [childStats]);

  useEffect(() => {
    if (activeChild) {
      localStorage.setItem('koa_active_child', JSON.stringify(activeChild));
    } else {
      localStorage.removeItem('koa_active_child');
    }
  }, [activeChild]);

  // Login handler
  const handleLogin = () => {
    const user = DEMO_USERS.find(u => u.username === selectedUsername);
    if (!user) return;

    if (passwordInput === user.password) {
      setErrorMsg("");
      const currentStats = childStats[selectedUsername] || {
        xp: user.xp,
        unlocked: ["1", "2"],
        completedQuizzes: {},
        stars: Math.floor(user.xp / 10),
        streak: user.streak
      };
      
      const profile: ChildProfile = {
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        xp: currentStats.xp,
        level: Math.floor(currentStats.xp / 100) + 1,
        streak: currentStats.streak,
        unlockedLevels: currentStats.unlocked,
        completedQuizzes: currentStats.completedQuizzes,
        completedWorksheets: []
      };

      setActiveChild(profile);
      setPasswordInput("");
    } else {
      setErrorMsg("Oops! Try again! 🤫");
    }
  };

  const handleLogout = () => {
    setActiveChild(null);
    setPasswordInput("");
    setActiveModal(null);
    setGkView(null);
    setNurseryView(null);
  };

  // Mock GK Trivia content
  const gkLevels = [
    { id: "1", title: "Indian Cities", icon: "🏙️", desc: "Pink City, Lake City & Nicknames" },
    { id: "2", title: "First Leaders", icon: "🇮🇳", desc: "PMs, national animals & monuments" },
    { id: "3", title: "Space Operations", icon: "🚀", desc: "Solar system & rocket science" },
    { id: "4", title: "Ashoka Monuments", icon: "🏰", desc: "Emperors, history & fortresses" },
    { id: "5", title: "World Records", icon: "🌍", desc: "Mountains, oceans & world extremes" },
  ];

  const learnData: {[key: string]: {title: string; fact: string}[]} = {
    "1": [
      { title: "Jaipur - The Pink City 🌸", fact: "Jaipur was painted pink in 1876 to welcome royal guests!" },
      { title: "Udaipur - The Lake City 💧", fact: "Udaipur is famous for its marble palaces built inside lakes!" },
      { title: "Bengaluru - Silicon Valley 💻", fact: "Bengaluru is India's tech hub with gorgeous parks!" }
    ],
    "2": [
      { title: "First PM of India 🇮🇳", fact: "Pandit Jawaharlal Nehru was India's first PM. Kids called him Chacha Nehru!" },
      { title: "National Bird 🦚", fact: "The beautiful Indian Peacock is the national bird of India!" },
      { title: "National Animal 🐅", fact: "The Royal Bengal Tiger is India's magnificent national animal!" }
    ]
  };

  const quizData: {[key: string]: {q: string; opt: string[]; ans: string}[]} = {
    "1": [
      { q: "Which city is known as the Pink City?", opt: ["Delhi", "Jaipur", "Mumbai"], ans: "Jaipur" },
      { q: "Which city is known as the Lake City?", opt: ["Udaipur", "Goa", "Kolkata"], ans: "Udaipur" },
      { q: "What color represents Bengaluru's Silicon Valley?", opt: ["Computers/Tech", "Farming", "Mining"], ans: "Computers/Tech" }
    ],
    "2": [
      { q: "Who was the first Prime Minister of India?", opt: ["Jawaharlal Nehru", "Mahatma Gandhi", "Dr. Kalam"], ans: "Jawaharlal Nehru" },
      { q: "What is India's national animal?", opt: ["Tiger", "Lion", "Elephant"], ans: "Tiger" },
      { q: "What is the national bird of India?", opt: ["Peacock", "Sparrow", "Eagle"], ans: "Peacock" }
    ]
  };

  const triggerGkLevel = (levelId: string) => {
    const isUnlocked = activeChild?.unlockedLevels.includes(levelId) || Number(levelId) <= 2;
    if (!isUnlocked) {
      setShowPremium(true);
    } else {
      setGkView({ levelId, mode: 'learn' });
      setCurrentLearnCardIndex(0);
      setCurrentQuestionIndex(0);
      setQuizScore(0);
      setShowQuizResult(false);
    }
  };

  const submitQuizAnswer = (selected: string) => {
    const levelId = gkView?.levelId || "1";
    const questions = quizData[levelId] || [];
    const correct = questions[currentQuestionIndex].ans === selected;
    
    if (correct) {
      setQuizScore(prev => prev + 1);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Completed Quiz! Earn XP
      const earnedXp = (quizScore + (correct ? 1 : 0)) * 10;
      if (activeChild) {
        const updatedStats = { ...childStats };
        const userStats = updatedStats[activeChild.username];
        userStats.xp += earnedXp;
        userStats.stars = Math.floor(userStats.xp / 10);
        userStats.completedQuizzes[levelId] = Math.max(userStats.completedQuizzes[levelId] || 0, quizScore + (correct ? 1 : 0));
        
        setChildStats(updatedStats);
        setActiveChild({
          ...activeChild,
          xp: userStats.xp,
          level: Math.floor(userStats.xp / 100) + 1,
          completedQuizzes: userStats.completedQuizzes
        });
      }
      setShowQuizResult(true);
    }
  };

  // Nursery Activity triggering
  const triggerNurseryLevel = (levelId: string) => {
    const isUnlocked = activeChild?.unlockedLevels.includes(levelId) || Number(levelId) <= 2;
    if (!isUnlocked) {
      setShowPremium(true);
    } else {
      setNurseryView({ levelId });
      setAlphabetAudioLetter("");
      setUserStarCountInput(null);
      setCountingFeedback("");
      setStarsToCount(Math.floor(Math.random() * 5) + 3);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Simulate Premium Unlock
  const handleUnlockAll = () => {
    if (activeChild) {
      const updatedStats = { ...childStats };
      updatedStats[activeChild.username].unlocked = ["1", "2", "3", "4", "5"];
      setChildStats(updatedStats);
      setActiveChild({
        ...activeChild,
        unlockedLevels: ["1", "2", "3", "4", "5"]
      });
      setShowPremium(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#e2dbfc] font-body text-slate-800 flex flex-col justify-between p-4 md:p-6 select-none">
      
      {/* Low opacity repeated watermark text background overlay */}
      <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-6 grid-rows-6 opacity-[0.03] pointer-events-none select-none text-slate-800 text-[10px] sm:text-xs font-black rotate-12 transform scale-110">
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center whitespace-nowrap">
            Made by Aarti
          </div>
        ))}
      </div>

      {/* ZONE 1 — TOP BAR */}
      <header className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-6 bg-white/70 backdrop-blur-md rounded-2xl p-3 border-2 border-slate-700 shadow-sm max-h-[80px]">
        {/* Left branding */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐻</span>
          <div className="flex flex-col text-left leading-tight">
            <span className="font-black text-xl tracking-wider text-slate-800">KOA</span>
            <span className="text-[9px] font-bold text-slate-400">Made by Aarti</span>
          </div>
        </div>

        {/* Center Title */}
        <h1 className="font-black text-xs sm:text-sm md:text-base lg:text-lg tracking-wide uppercase text-slate-800 text-center flex-grow">
          KIDS' WELLNESS MADE WONDERFUL
        </h1>

        {/* Right Nav buttons */}
        <div className="flex items-center gap-2">
          <button 
            disabled={!activeChild}
            onClick={() => { setActiveModal('gk'); setGkView(null); }}
            className={`font-black text-[10px] sm:text-xs px-3 py-1.5 rounded-xl border-2 border-slate-800 shadow-[2px_2px_0px_#2d3748] transition transform active:scale-95 ${activeChild ? 'bg-[#ffda79] hover:bg-[#ffeaa7]' : 'bg-slate-200 opacity-60 cursor-not-allowed'}`}
          >
            🧠 GK Trivia
          </button>
          <button 
            disabled={!activeChild}
            onClick={() => { setActiveModal('nursery'); setNurseryView(null); }}
            className={`font-black text-[10px] sm:text-xs px-3 py-1.5 rounded-xl border-2 border-slate-800 shadow-[2px_2px_0px_#2d3748] transition transform active:scale-95 ${activeChild ? 'bg-[#ffabe7] hover:bg-[#ffc6f0]' : 'bg-slate-200 opacity-60 cursor-not-allowed'}`}
          >
            🎈 Playroom
          </button>
          <button 
            disabled={!activeChild}
            onClick={() => setActiveModal('parents')}
            className={`font-black text-[10px] sm:text-xs px-3 py-1.5 rounded-xl border-2 border-slate-800 shadow-[2px_2px_0px_#2d3748] transition transform active:scale-95 ${activeChild ? 'bg-[#81ecec] hover:bg-[#aeffff]' : 'bg-slate-200 opacity-60 cursor-not-allowed'}`}
          >
            📊 Parents Hub
          </button>
        </div>
      </header>

      {/* ZONE 2 — MAIN HERO CONTAINER */}
      <main className="relative z-10 flex-grow my-4 flex items-center justify-center max-h-[calc(100vh-170px)]">
        
        {/* Main Rounded Box with Dark thick Outline */}
        <div className="w-full max-w-5xl h-full bg-[#fdfaf4] border-4 border-slate-800 rounded-[2.5rem] p-6 shadow-[8px_8px_0px_#2f3542] flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          
          {/* Inner Scalloped/Dashed Ring Border */}
          <div className="absolute inset-2 border-2 border-dashed border-slate-700/20 rounded-[2rem] pointer-events-none"></div>

          {/* Left Hero Area: Emojis/Characters & Learning Cards */}
          <div className="flex-grow w-full lg:w-[65%] h-full flex flex-col justify-between gap-4 relative z-10">
            
            {/* Mascot Characters Zone */}
            <div className="flex-grow flex items-center justify-center gap-12 relative min-h-[160px]">
              {/* Baby Teddy 🧸 */}
              <div className="flex flex-col items-center animate-bounce duration-1000">
                <span className="text-6xl sm:text-7xl drop-shadow-md">🧸</span>
                <span className="bg-amber-100 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 text-amber-800 shadow-sm">Baby Teddy</span>
              </div>

              {/* Big Happy Panda ⭐ */}
              <div className="flex flex-col items-center transform scale-110 relative">
                <span className="absolute -top-3 -right-2 text-2xl animate-pulse">⭐</span>
                <span className="text-7xl sm:text-8xl drop-shadow-lg">🐼</span>
                <span className="bg-slate-100 border border-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 text-slate-800 shadow-sm">Super Panda</span>
              </div>

              {/* Graduate Teddy 🎓 */}
              <div className="flex flex-col items-center">
                <span className="text-6xl sm:text-7xl drop-shadow-md relative">
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-2xl">🎓</span>
                  🐻
                </span>
                <span className="bg-blue-100 border border-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 text-blue-800 shadow-sm">Dr. Bear</span>
              </div>
            </div>

            {/* 5 Small Visual Learning Cards Arranged neatly */}
            <div className="grid grid-cols-5 gap-2 w-full max-h-[75px] mt-auto">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2 flex flex-col items-center justify-center shadow-sm hover:scale-105 transition duration-200">
                <span className="text-lg sm:text-xl">🌍</span>
                <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider">GK Fun</span>
              </div>
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-2 flex flex-col items-center justify-center shadow-sm hover:scale-105 transition duration-200">
                <span className="text-lg sm:text-xl">🔤</span>
                <span className="text-[9px] font-bold text-sky-800 uppercase tracking-wider">ABC Play</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2 flex flex-col items-center justify-center shadow-sm hover:scale-105 transition duration-200">
                <span className="text-lg sm:text-xl">🔢</span>
                <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider">123 Count</span>
              </div>
              <div className="bg-pink-50 border border-pink-200 rounded-2xl p-2 flex flex-col items-center justify-center shadow-sm hover:scale-105 transition duration-200">
                <span className="text-lg sm:text-xl">🎨</span>
                <span className="text-[9px] font-bold text-pink-800 uppercase tracking-wider">Colors</span>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-2 flex flex-col items-center justify-center shadow-sm hover:scale-105 transition duration-200">
                <span className="text-lg sm:text-xl">🌟</span>
                <span className="text-[9px] font-bold text-purple-800 uppercase tracking-wider">Stars</span>
              </div>
            </div>

          </div>

          {/* Right Side: LOGIN CARD panel */}
          <div className="w-full lg:w-[32%] bg-white border-3 border-slate-800 rounded-3xl p-5 shadow-[4px_4px_0px_#2f3542] flex flex-col justify-between min-h-[260px] lg:h-full relative z-10">
            
            {!activeChild ? (
              // Locked/Logout State -> Form
              <div className="flex flex-col justify-between h-full w-full gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="text-4xl p-2 bg-purple-50 rounded-2xl border border-purple-100">🐻</div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-wider text-slate-800">Child Portal</h4>
                    <p className="text-[9px] font-bold text-slate-400">Unlock your learning desk</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500">Who are you?</label>
                  <select 
                    value={selectedUsername} 
                    onChange={(e) => setSelectedUsername(e.target.value)}
                    className="w-full border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-purple-400 bg-slate-50"
                  >
                    <option value="aanya">🐻 Aanya</option>
                    <option value="aarav">🐼 Aarav</option>
                    <option value="myra">🐨 Myra</option>
                    <option value="vihaan">⭐ Vihaan</option>
                    <option value="kiaan">🎮 Kiaan</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500">Secret Key</label>
                  <input 
                    type="password" 
                    placeholder="Enter password..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-purple-400 text-center"
                  />
                  {errorMsg && <p className="text-[9px] font-black text-red-500 text-center">{errorMsg}</p>}
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full bg-[#a29bfe] hover:bg-[#8178fc] text-white font-black text-xs py-2.5 rounded-xl border-2 border-slate-800 shadow-[2px_2px_0px_#2d3748] transition transform active:scale-95 text-center uppercase tracking-wider"
                >
                  Enter Playroom 🚀
                </button>

                <p className="text-[8px] font-bold text-slate-400 text-center italic">
                  Hint: Aanya (Teddy123), Aarav (Panda234), Myra (Cub345)
                </p>
              </div>
            ) : (
              // Logged In Dashboard status inside hero
              <div className="flex flex-col justify-between h-full w-full gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="text-5xl p-2 bg-amber-50 rounded-2xl border-2 border-amber-200 animate-bounce">{activeChild.avatar}</div>
                  <div>
                    <h4 className="font-black text-base uppercase text-slate-800 leading-tight">Hi, {activeChild.displayName}!</h4>
                    <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Level {activeChild.level} Explorer</span>
                  </div>
                </div>

                <div className="bg-[#fcfbf9] border border-slate-200 rounded-2xl p-3 flex items-center justify-between text-center shadow-inner">
                  <div>
                    <span className="text-xl">⭐</span>
                    <p className="text-[8px] font-black text-slate-400 uppercase mt-0.5">Stars</p>
                    <p className="text-xs font-black text-slate-800">{childStats[activeChild.username]?.stars || 0}</p>
                  </div>
                  <div className="border-r border-slate-200 h-8"></div>
                  <div>
                    <span className="text-xl">⚡</span>
                    <p className="text-[8px] font-black text-slate-400 uppercase mt-0.5">XP Earned</p>
                    <p className="text-xs font-black text-slate-800">{activeChild.xp} XP</p>
                  </div>
                  <div className="border-r border-slate-200 h-8"></div>
                  <div>
                    <span className="text-xl">🔥</span>
                    <p className="text-[8px] font-black text-slate-400 uppercase mt-0.5">Streak</p>
                    <p className="text-xs font-black text-slate-800">{activeChild.streak} Days</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase">
                    <span>XP Target</span>
                    <span>{activeChild.xp % 100} / 100</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3.5 rounded-full border border-slate-300 overflow-hidden relative shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${activeChild.xp % 100}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-400 hover:bg-red-500 text-white font-black text-[10px] py-2 rounded-xl border-2 border-slate-800 shadow-[2px_2px_0px_#2d3748] transition transform active:scale-95 text-center uppercase tracking-wider"
                >
                  Log Out 🚪
                </button>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* ZONE 3 — BOTTOM COMPACT PANEL */}
      <footer className="relative z-10 flex items-center justify-between bg-slate-800 text-white/90 rounded-2xl px-6 py-2 border-2 border-slate-700/80 shadow-md text-xs font-black uppercase tracking-wider max-h-[44px]">
        <span>© KOA Kids Studio</span>
        <span className="text-[9px] text-slate-400">Pure Offline Safe Sandbox • No External Ads</span>
        <span>Aarti Gurjar</span>
      </footer>

      {/* MODAL 1: GK TRIVIA QUEST */}
      {activeModal === 'gk' && activeChild && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fcfbf9] border-4 border-slate-800 rounded-[2.5rem] p-6 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col justify-between relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🧠</span>
                <div className="text-left">
                  <h3 className="font-black text-lg uppercase text-slate-800">GK Trivia Quest</h3>
                  <p className="text-[9px] font-bold text-slate-400">Challenge your mind & gather stars</p>
                </div>
              </div>
              <button 
                onClick={() => { setActiveModal(null); setGkView(null); }}
                className="w-8 h-8 rounded-full bg-red-100 border-2 border-slate-800 text-slate-800 flex items-center justify-center font-black hover:bg-red-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Content Switcher */}
            {!gkView ? (
              // Level cards list
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 overflow-y-auto pr-1 flex-grow py-2">
                {gkLevels.map(level => {
                  const isUnlocked = activeChild.unlockedLevels.includes(level.id) || Number(level.id) <= 2;
                  return (
                    <div 
                      key={level.id} 
                      onClick={() => triggerGkLevel(level.id)}
                      className={`border-2 border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-between text-center relative cursor-pointer shadow-[2px_2px_0px_#2f3542] hover:-translate-y-1 transition ${isUnlocked ? 'bg-white hover:border-amber-400' : 'bg-slate-100 opacity-70'}`}
                    >
                      <span className="text-4xl mb-2">{level.icon}</span>
                      <h4 className="font-black text-xs uppercase leading-tight">{level.title}</h4>
                      <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Level {level.id}</p>
                      
                      {!isUnlocked && (
                        <span className="absolute top-2 right-2 bg-red-100 border border-red-300 text-red-700 text-[8px] font-black px-1.5 py-0.5 rounded-md">
                          🔒 Premium
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : gkView.mode === 'learn' ? (
              // Learn Cards Flow
              <div className="flex-grow flex flex-col justify-between py-2 min-h-[300px]">
                <div className="bg-white border-2 border-slate-800 rounded-3xl p-6 text-center shadow-inner relative flex-grow flex flex-col justify-center items-center gap-4">
                  <div className="text-5xl animate-bounce">
                    {learnData[gkView.levelId]?.[currentLearnCardIndex]?.title.split(' ')[0] || "📚"}
                  </div>
                  <h4 className="font-black text-lg text-slate-800">
                    {learnData[gkView.levelId]?.[currentLearnCardIndex]?.title || "Flashcard"}
                  </h4>
                  <p className="text-sm font-semibold font-body max-w-md text-slate-600">
                    {learnData[gkView.levelId]?.[currentLearnCardIndex]?.fact || "Learn facts about India!"}
                  </p>
                  
                  <button
                    onClick={() => handleSpeak(learnData[gkView.levelId]?.[currentLearnCardIndex]?.fact || "")}
                    className="bg-amber-100 hover:bg-amber-200 border-2 border-slate-800 text-slate-800 text-[10px] font-black px-4 py-1 rounded-xl shadow-[2px_2px_0px_#2d3748]"
                  >
                    🔊 Speak Fact
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <button 
                    disabled={currentLearnCardIndex === 0}
                    onClick={() => setCurrentLearnCardIndex(prev => prev - 1)}
                    className="bg-slate-200 hover:bg-slate-300 border-2 border-slate-800 text-slate-800 text-xs font-black px-4 py-2 rounded-xl disabled:opacity-50"
                  >
                    ◀ Prev
                  </button>
                  <span className="text-xs font-black uppercase text-slate-400">
                    Card {currentLearnCardIndex + 1} of {learnData[gkView.levelId]?.length || 3}
                  </span>
                  {currentLearnCardIndex + 1 < (learnData[gkView.levelId]?.length || 3) ? (
                    <button 
                      onClick={() => setCurrentLearnCardIndex(prev => prev + 1)}
                      className="bg-slate-200 hover:bg-slate-300 border-2 border-slate-800 text-slate-800 text-xs font-black px-4 py-2 rounded-xl"
                    >
                      Next ▶
                    </button>
                  ) : (
                    <button 
                      onClick={() => setGkView({ levelId: gkView.levelId, mode: 'quiz' })}
                      className="bg-emerald-400 hover:bg-emerald-500 border-2 border-slate-800 text-white text-xs font-black px-4 py-2 rounded-xl shadow-[2px_2px_0px_#2d3748]"
                    >
                      Start Quiz 🚀
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // Quiz Flow
              <div className="flex-grow flex flex-col justify-between py-2 min-h-[300px]">
                {!showQuizResult ? (
                  <div className="bg-white border-2 border-slate-800 rounded-3xl p-6 shadow-inner flex-grow flex flex-col justify-center gap-4">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block text-center">
                      Question {currentQuestionIndex + 1} of {quizData[gkView.levelId]?.length || 3}
                    </span>
                    <h4 className="font-black text-base sm:text-lg text-slate-800 text-center">
                      {quizData[gkView.levelId]?.[currentQuestionIndex]?.q}
                    </h4>

                    <div className="flex flex-col gap-2 mt-2">
                      {quizData[gkView.levelId]?.[currentQuestionIndex]?.opt.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => submitQuizAnswer(opt)}
                          className="w-full bg-slate-50 hover:bg-amber-100 border-2 border-slate-800 rounded-xl py-2.5 px-4 text-xs font-black text-left transition"
                        >
                          {i + 1}. {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Quiz Finish Card
                  <div className="bg-white border-2 border-slate-800 rounded-3xl p-6 text-center shadow-inner flex-grow flex flex-col justify-center items-center gap-4">
                    <span className="text-6xl animate-bounce">🏆</span>
                    <h4 className="font-black text-xl text-slate-800 uppercase">Quiz Complete!</h4>
                    <p className="text-sm font-semibold font-body text-slate-600">
                      You scored {quizScore} out of {quizData[gkView.levelId]?.length || 3}!
                    </p>
                    <p className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-black px-4 py-2 rounded-2xl">
                      🎉 Double Stars & XP Saved Successfully!
                    </p>
                    
                    <button 
                      onClick={() => setGkView(null)}
                      className="bg-[#a29bfe] hover:bg-[#8178fc] text-white border-2 border-slate-800 text-xs font-black px-6 py-2.5 rounded-xl shadow-[3px_3px_0px_#2f3542]"
                    >
                      Back to Level Grid 🎒
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL 2: NURSERY PLAYROOM */}
      {activeModal === 'nursery' && activeChild && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fcfbf9] border-4 border-slate-800 rounded-[2.5rem] p-6 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col justify-between relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🎈</span>
                <div className="text-left">
                  <h3 className="font-black text-lg uppercase text-slate-800">Nursery Playroom</h3>
                  <p className="text-[9px] font-bold text-slate-400">Playful worksheets & speech sandbox</p>
                </div>
              </div>
              <button 
                onClick={() => { setActiveModal(null); setNurseryView(null); }}
                className="w-8 h-8 rounded-full bg-red-100 border-2 border-slate-800 text-slate-800 flex items-center justify-center font-black hover:bg-red-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Content Switcher */}
            {!nurseryView ? (
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 overflow-y-auto py-2">
                {[
                  { id: "1", title: "Alphabet Sound", icon: "🔤", desc: "Hear and repeat letters" },
                  { id: "2", title: "Star Counter", icon: "🔢", desc: "Count bright golden stars" },
                  { id: "3", title: "Color Match", icon: "🎨", desc: "Tap matching shades" },
                  { id: "4", title: "Rhymes Sing", icon: "🎵", desc: "Twinkle twinkle speaker" },
                  { id: "5", title: "Memory Cards", icon: "🧸", desc: "Match animal pairs" }
                ].map(level => {
                  const isUnlocked = activeChild.unlockedLevels.includes(level.id) || Number(level.id) <= 2;
                  return (
                    <div 
                      key={level.id}
                      onClick={() => triggerNurseryLevel(level.id)}
                      className={`border-2 border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-between text-center cursor-pointer shadow-[2px_2px_0px_#2f3542] hover:-translate-y-1 transition ${isUnlocked ? 'bg-white hover:border-pink-400' : 'bg-slate-100 opacity-70'}`}
                    >
                      <span className="text-4xl mb-2">{level.icon}</span>
                      <h4 className="font-black text-xs uppercase leading-tight">{level.title}</h4>
                      <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Activity {level.id}</p>
                      
                      {!isUnlocked && (
                        <span className="absolute top-2 right-2 bg-red-100 border border-red-300 text-red-700 text-[8px] font-black px-1.5 py-0.5 rounded-md">
                          🔒 Premium
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : nurseryView.levelId === "1" ? (
              // Alphabet Audio Activity
              <div className="flex-grow flex flex-col items-center justify-center gap-4 py-4 min-h-[300px]">
                <h4 className="font-black text-base text-slate-800">Tap a letter to hear its sound! 🔊</h4>
                <div className="grid grid-cols-6 gap-2 max-w-md w-full">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].map(letter => (
                    <button
                      key={letter}
                      onClick={() => {
                        setAlphabetAudioLetter(letter);
                        handleSpeak(letter);
                      }}
                      className="bg-white hover:bg-pink-100 border-2 border-slate-800 rounded-xl py-3 text-lg font-black transition active:scale-90"
                    >
                      {letter}
                    </button>
                  ))}
                </div>

                {alphabetAudioLetter && (
                  <p className="text-xl font-black text-pink-500 uppercase tracking-widest mt-2">
                    🔈 {alphabetAudioLetter} says: "{alphabetAudioLetter === 'A' ? 'Apple' : alphabetAudioLetter === 'B' ? 'Ball' : 'Cat'}!"
                  </p>
                )}

                <button 
                  onClick={() => setNurseryView(null)}
                  className="bg-slate-200 hover:bg-slate-300 border-2 border-slate-800 text-slate-800 text-xs font-black px-6 py-2 rounded-xl mt-4"
                >
                  ◀ Back to Activities
                </button>
              </div>
            ) : (
              // Star Counter Level 2
              <div className="flex-grow flex flex-col items-center justify-center gap-4 py-4 min-h-[300px]">
                <h4 className="font-black text-base text-slate-800">How many golden stars can you see? 🌟</h4>
                
                <div className="flex gap-2 flex-wrap items-center justify-center bg-white border-2 border-slate-800 rounded-2xl p-6 shadow-inner w-full max-w-sm">
                  {Array.from({ length: starsToCount }).map((_, idx) => (
                    <span key={idx} className="text-3xl animate-pulse">⭐</span>
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  {[3, 4, 5, 6, 7, 8].map(num => (
                    <button
                      key={num}
                      onClick={() => {
                        setUserStarCountInput(num);
                        if (num === starsToCount) {
                          setCountingFeedback("Correct! You are a superstar! 🌈");
                          // Earn Stars
                          const updatedStats = { ...childStats };
                          updatedStats[activeChild.username].stars += 5;
                          setChildStats(updatedStats);
                        } else {
                          setCountingFeedback("Almost there! Try counting again. ✏️");
                        }
                      }}
                      className="bg-amber-100 hover:bg-amber-200 border-2 border-slate-800 rounded-xl w-10 h-10 flex items-center justify-center text-xs font-black"
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {countingFeedback && (
                  <p className={`text-xs font-black uppercase mt-2 ${countingFeedback.includes("Correct") ? 'text-emerald-600' : 'text-red-500'}`}>
                    {countingFeedback}
                  </p>
                )}

                <button 
                  onClick={() => {
                    setStarsToCount(Math.floor(Math.random() * 5) + 3);
                    setCountingFeedback("");
                  }}
                  className="bg-amber-400 hover:bg-amber-500 border-2 border-slate-800 text-slate-800 text-[10px] font-black px-4 py-1.5 rounded-xl shadow-[2px_2px_0px_#2d3748]"
                >
                  🔄 Shuffle Stars
                </button>

                <button 
                  onClick={() => setNurseryView(null)}
                  className="bg-slate-200 hover:bg-slate-300 border-2 border-slate-800 text-slate-800 text-xs font-black px-6 py-2 rounded-xl mt-4"
                >
                  ◀ Back to Activities
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL 3: PARENTS HUB */}
      {activeModal === 'parents' && activeChild && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fcfbf9] border-4 border-slate-800 rounded-[2.5rem] p-6 shadow-2xl max-w-md w-full relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">📊</span>
                <div className="text-left">
                  <h3 className="font-black text-base uppercase text-slate-800">Parents Control</h3>
                  <p className="text-[8px] font-bold text-slate-400">Configure locks & track progress</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-red-100 border-2 border-slate-800 text-slate-800 flex items-center justify-center font-black hover:bg-red-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Content stats */}
            <div className="flex flex-col gap-4 text-left">
              <div className="bg-white border-2 border-slate-800 rounded-2xl p-4 shadow-sm">
                <h4 className="font-black text-xs uppercase text-slate-400 tracking-wider">Active Profile</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-3xl">{activeChild.avatar}</span>
                  <span className="font-black text-sm text-slate-800">{activeChild.displayName}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Authenticated</span>
                </div>
              </div>

              {/* Progress bars */}
              <div className="bg-white border-2 border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                <h4 className="font-black text-xs uppercase text-slate-800 tracking-wider">Learning Metrics</h4>
                
                <div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase mb-1">
                    <span>GK Quiz Levels Done</span>
                    <span>{Object.keys(activeChild.completedQuizzes || {}).length} / 5</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${(Object.keys(activeChild.completedQuizzes || {}).length / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase mb-1">
                    <span>Stars Collected</span>
                    <span>{childStats[activeChild.username]?.stars || 0} Stars</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${Math.min(((childStats[activeChild.username]?.stars || 0) / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Administrative Lock Switches */}
              <div className="bg-white border-2 border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                <h4 className="font-black text-xs uppercase text-slate-800 tracking-wider">Manual Level Overrides</h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-500">All Levels Unlocked</span>
                  <button
                    onClick={handleUnlockAll}
                    disabled={activeChild.unlockedLevels.includes("3")}
                    className={`text-[9px] font-black px-3 py-1 rounded-lg border-2 border-slate-800 transition ${activeChild.unlockedLevels.includes("3") ? 'bg-slate-100 text-slate-400 border-slate-300' : 'bg-[#ffeaa7] hover:bg-[#ffd32a]'}`}
                  >
                    {activeChild.unlockedLevels.includes("3") ? "Already Unlocked" : "Unlock All levels (Simulate)"}
                  </button>
                </div>
              </div>

              <p className="text-[8px] font-bold text-slate-400 italic text-center">
                System Log: All stats are persistent in child profile cache.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: PREMIUM UPGRADE GATE */}
      {showPremium && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
          <div className="bg-white border-4 border-slate-800 rounded-[2.5rem] p-6 shadow-2xl max-w-sm w-full text-center relative flex flex-col gap-4">
            
            <span className="text-6xl animate-bounce">🌟</span>
            <h3 className="font-black text-lg uppercase text-slate-800">Unlock Levels 3–5 to keep learning!</h3>
            
            <p className="text-xs font-semibold text-slate-500 font-body">
              Get access to Space Explorations, World Geography, colors matching, interactive sounds & badges!
            </p>

            <div className="bg-[#fcfbf9] border-2 border-dashed border-slate-300 rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 shadow-inner">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Instant UPI Payment</span>
              <span className="text-xs font-black text-slate-800">6375367713@upi</span>
              <span className="text-[10px] font-black text-[#ff6f3c]">Price: ₹99 only</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleUnlockAll}
                className="flex-grow bg-[#ffeaa7] hover:bg-[#ffd32a] text-slate-800 font-black text-xs py-2.5 rounded-xl border-2 border-slate-800 shadow-[2px_2px_0px_#2d3748] transition transform active:scale-95"
              >
                Unlock Instantly 🚀
              </button>
              <button
                onClick={() => setShowPremium(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs px-4 rounded-xl border-2 border-slate-800"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
export { App };
