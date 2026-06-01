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
    
    // Seed initial stats
    const initial: {[username: string]: any} = {};
    DEMO_USERS.forEach(u => {
      initial[u.username] = {
        xp: u.xp || 120,
        unlocked: ["1", "2"], // Free levels
        completedQuizzes: {},
        stars: Math.floor((u.xp || 120) / 10),
        streak: u.streak || 2
      };
    });
    return initial;
  });

  // Modal / Popup States
  const [activeModal, setActiveModal] = useState<'gk' | 'nursery' | 'parents' | null>(null);
  const [showPremium, setShowPremium] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Quiz / Learn states
  const [gkView, setGkView] = useState<{levelId: string; mode: 'learn' | 'quiz'} | null>(null);
  const [currentLearnCardIndex, setCurrentLearnCardIndex] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);

  // Nursery states
  const [nurseryView, setNurseryView] = useState<{levelId: string} | null>(null);
  const [alphabetAudioLetter, setAlphabetAudioLetter] = useState<string>("");
  const [starsToCount, setStarsToCount] = useState<number>(5);
  const [countingFeedback, setCountingFeedback] = useState<string>("");

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

  // Login execution
  const handleLogin = () => {
    const user = DEMO_USERS.find(u => u.username === selectedUsername);
    if (!user) return;

    if (passwordInput.trim() === user.password) {
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
      setErrorMsg("Wrong code! Try again! 🤫");
    }
  };

  const handleLogout = () => {
    setActiveChild(null);
    setPasswordInput("");
    setActiveModal(null);
    setGkView(null);
    setNurseryView(null);
  };

  // Mock Data definitions
  const gkLevels = [
    { id: "1", title: "Indian Cities", icon: "🏙️", desc: "Pink City & Lake City names" },
    { id: "2", title: "First Leaders", icon: "🇮🇳", desc: "First prime ministers & monuments" },
    { id: "3", title: "Space Operations", icon: "🚀", desc: "Solar system orbit & rockets" },
    { id: "4", title: "Ashoka Monuments", icon: "🏰", desc: "Monuments & Indian kings" },
    { id: "5", title: "World Records", icon: "🌍", desc: "Highest peaks & deep oceans" },
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
      const finalScore = quizScore + (correct ? 1 : 0);
      const earnedXp = finalScore * 15;
      if (activeChild) {
        const updatedStats = { ...childStats };
        const userStats = updatedStats[activeChild.username];
        userStats.xp += earnedXp;
        userStats.stars = Math.floor(userStats.xp / 10);
        userStats.completedQuizzes[levelId] = Math.max(userStats.completedQuizzes[levelId] || 0, finalScore);
        
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

  const triggerNurseryLevel = (levelId: string) => {
    const isUnlocked = activeChild?.unlockedLevels.includes(levelId) || Number(levelId) <= 2;
    if (!isUnlocked) {
      setShowPremium(true);
    } else {
      setNurseryView({ levelId });
      setAlphabetAudioLetter("");
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

      {/* HEADER BAR */}
      <header className="relative z-10 flex flex-row items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl p-3 border-2 border-slate-800 shadow-sm max-h-[70px]">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐻</span>
          <div className="flex flex-col text-left leading-tight">
            <span className="font-black text-lg tracking-wider text-slate-800">KOA</span>
            <span className="text-[9px] font-bold text-slate-400">Made by Aarti</span>
          </div>
        </div>

        <h1 className="font-black text-xs sm:text-sm tracking-wide uppercase text-slate-800 text-center flex-grow">
          {activeChild ? `Welcome Back, ${activeChild.displayName}! 🌟` : "KIDS' WELLNESS MADE WONDERFUL"}
        </h1>

        {activeChild && (
          <button 
            onClick={handleLogout}
            className="font-black text-[10px] sm:text-xs px-3 py-1.5 bg-red-400 hover:bg-red-500 text-white rounded-xl border-2 border-slate-800 shadow-[2px_2px_0px_#2d3748] transition transform active:scale-95"
          >
            Log Out 🚪
          </button>
        )}
      </header>

      {/* MAIN VIEW AREA */}
      <main className="relative z-10 flex-grow my-4 flex items-center justify-center max-h-[calc(100vh-140px)]">
        
        {!activeChild ? (
          // VIEW 1: HOME PAGE LOGIN ONLY GATE
          <div className="w-full max-w-lg bg-white border-4 border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-[8px_8px_0px_#2f3542] flex flex-col justify-between gap-5 relative overflow-hidden">
            <div className="absolute inset-2 border-2 border-dashed border-slate-700/20 rounded-[2rem] pointer-events-none"></div>

            {/* Lively mascot illustrations */}
            <div className="flex items-center justify-center gap-6 py-2 border-b-2 border-dashed border-slate-200">
              <span className="text-5xl animate-bounce">🧸</span>
              <span className="text-6xl animate-pulse">🐼</span>
              <span className="text-5xl">🐻🎓</span>
            </div>

            <div className="text-center">
              <h2 className="font-black text-lg sm:text-xl uppercase text-slate-800">Select Your Kid Avatar</h2>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">Please choose your name & enter the secret key</p>
            </div>

            {/* Avatar Select */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black uppercase text-slate-400 text-left">Choose Child Account</label>
              <select 
                value={selectedUsername} 
                onChange={(e) => setSelectedUsername(e.target.value)}
                className="w-full border-2 border-slate-300 rounded-2xl px-4 py-2.5 text-xs font-black focus:outline-none focus:border-purple-400 bg-slate-50 cursor-pointer"
              >
                <option value="aanya">🐻 Aanya</option>
                <option value="aarav">🐼 Aarav</option>
                <option value="myra">🐨 Myra</option>
                <option value="vihaan">⭐ Vihaan</option>
                <option value="kiaan">🎮 Kiaan</option>
              </select>
            </div>

            {/* Secret key */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black uppercase text-slate-400 text-left">Enter 4-Digit Password</label>
              <input 
                type="password" 
                placeholder="••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full border-2 border-slate-300 rounded-2xl px-4 py-2.5 text-xs font-black focus:outline-none focus:border-purple-400 text-center tracking-widest"
              />
              {errorMsg && <p className="text-[10px] font-black text-red-500 text-center animate-shake">{errorMsg}</p>}
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-[#a29bfe] hover:bg-[#8178fc] text-white font-black text-sm py-3 rounded-2xl border-2 border-slate-800 shadow-[3px_3px_0px_#2f3542] transition transform active:scale-95 text-center uppercase tracking-wider"
            >
              Enter Playroom 🚀
            </button>

            <p className="text-[9px] font-bold text-slate-400 text-center italic leading-tight">
              Credentials: Aanya / Teddy123 • Aarav / Panda234 • Myra / Cub345
            </p>
          </div>
        ) : (
          // VIEW 2: LOGGED IN INTERACTIVE DASHBOARD (3 TOUCH-FRIENDLY BLOCKS)
          <div className="w-full max-w-5xl h-full flex flex-col md:flex-row items-stretch gap-6">
            
            {/* Block 1: GK Trivia Quest */}
            <button 
              onClick={() => { setActiveModal('gk'); setGkView(null); }}
              className="flex-1 bg-white hover:bg-amber-50/50 border-4 border-slate-800 rounded-[2.5rem] p-6 shadow-[6px_6px_0px_#2d3748] flex flex-col justify-between text-left transition transform active:scale-98 group cursor-pointer hover:border-amber-400"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-5xl group-hover:scale-110 transition duration-300">🧠</span>
                <span className="bg-amber-100 text-amber-800 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">LEVEL 1 TO 5 QUIZZES</span>
              </div>
              <div className="my-4 flex-grow flex flex-col justify-center">
                <h3 className="font-black text-lg sm:text-xl text-slate-800 uppercase tracking-wide">GK Trivia Quest</h3>
                <p className="text-xs text-slate-500 font-body leading-relaxed mt-2 font-semibold">
                  Master Indian nicknames, first prime ministers, rocket space operations, Ashoka monuments, and world records through dynamic shuffled quizzes!
                </p>
              </div>
              <div className="w-full bg-[#fcfbf9] border-2 border-slate-800 rounded-2xl py-2 px-4 flex items-center justify-between text-xs font-black text-slate-800 mt-2">
                <span>Start Quiz Quest</span>
                <span className="text-[#ff6f3c] text-sm">↗</span>
              </div>
            </button>

            {/* Block 2: Nursery Worksheets */}
            <button 
              onClick={() => { setActiveModal('nursery'); setNurseryView(null); }}
              className="flex-1 bg-white hover:bg-pink-50/50 border-4 border-slate-800 rounded-[2.5rem] p-6 shadow-[6px_6px_0px_#2d3748] flex flex-col justify-between text-left transition transform active:scale-98 group cursor-pointer hover:border-pink-400"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-5xl group-hover:scale-110 transition duration-300">🎈</span>
                <span className="bg-pink-100 text-pink-800 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">15 ACTIVITY WORKSHEETS</span>
              </div>
              <div className="my-4 flex-grow flex flex-col justify-center">
                <h3 className="font-black text-lg sm:text-xl text-slate-800 uppercase tracking-wide">Nursery Worksheets</h3>
                <p className="text-xs text-slate-500 font-body leading-relaxed mt-2 font-semibold">
                  Trace dotted shapes, match colors, color outline drawings, separate odd one out, and print direct A4 worksheets for offline learning!
                </p>
              </div>
              <div className="w-full bg-[#fcfbf9] border-2 border-slate-800 rounded-2xl py-2 px-4 flex items-center justify-between text-xs font-black text-slate-800 mt-2">
                <span>Start Worksheets</span>
                <span className="text-[#ff6f3c] text-sm">↗</span>
              </div>
            </button>

            {/* Block 3: Parents Hub */}
            <button 
              onClick={() => setActiveModal('parents')}
              className="flex-1 bg-white hover:bg-sky-50/50 border-4 border-slate-800 rounded-[2.5rem] p-6 shadow-[6px_6px_0px_#2d3748] flex flex-col justify-between text-left transition transform active:scale-98 group cursor-pointer hover:border-sky-400"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-5xl group-hover:scale-110 transition duration-300">📊</span>
                <span className="bg-sky-100 text-sky-800 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">UNLOCKED LEVELS & STATS</span>
              </div>
              <div className="my-4 flex-grow flex flex-col justify-center">
                <h3 className="font-black text-lg sm:text-xl text-slate-800 uppercase tracking-wide">Parents Hub</h3>
                <p className="text-xs text-slate-500 font-body leading-relaxed mt-2 font-semibold">
                  Review completed quizzes, manual unlock triggers for paid levels, export logs, and configure custom lessons for your little ones!
                </p>
              </div>
              <div className="w-full bg-[#fcfbf9] border-2 border-slate-800 rounded-2xl py-2 px-4 flex items-center justify-between text-xs font-black text-slate-800 mt-2">
                <span>Open Parents Portal</span>
                <span className="text-[#ff6f3c] text-sm">↗</span>
              </div>
            </button>

          </div>
        )}

      </main>

      {/* FOOTER BAR */}
      <footer className="relative z-10 flex items-center justify-between bg-slate-800 text-white/90 rounded-2xl px-6 py-2 border-2 border-slate-700/80 shadow-md text-xs font-black uppercase tracking-wider max-h-[44px]">
        <span>© KOA Kids Learning Hub</span>
        <span className="text-[9px] text-slate-400">Pure Offline Safe Sandbox • No External Ads</span>
        <span>Aarti Gurjar</span>
      </footer>

      {/* MODAL 1: GK TRIVIA QUEST DETAILS */}
      {activeModal === 'gk' && activeChild && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fcfbf9] border-4 border-slate-800 rounded-[2.5rem] p-6 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col justify-between relative">
            <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🧠</span>
                <div className="text-left">
                  <h3 className="font-black text-lg uppercase text-slate-800">GK Trivia Quest</h3>
                  <p className="text-[9px] font-bold text-slate-400">Level 1 to 5 Shuffled Quizzes</p>
                </div>
              </div>
              <button 
                onClick={() => { setActiveModal(null); setGkView(null); }}
                className="w-8 h-8 rounded-full bg-red-100 border-2 border-slate-800 text-slate-800 flex items-center justify-center font-black hover:bg-red-200 transition"
              >
                ✕
              </button>
            </div>

            {!gkView ? (
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 overflow-y-auto py-2">
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
              <div className="flex-grow flex flex-col justify-between py-2 min-h-[300px]">
                <div className="bg-white border-2 border-slate-800 rounded-3xl p-6 text-center shadow-inner flex-grow flex flex-col justify-center items-center gap-4">
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
                    className="bg-amber-100 hover:bg-amber-200 border-2 border-slate-800 text-slate-800 text-[10px] font-black px-4 py-1.5 rounded-xl shadow-[2px_2px_0px_#2d3748]"
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
                  <div className="bg-white border-2 border-slate-800 rounded-3xl p-6 text-center shadow-inner flex-grow flex flex-col justify-center items-center gap-4">
                    <span className="text-6xl animate-bounce">🏆</span>
                    <h4 className="font-black text-xl text-slate-800 uppercase">Quiz Complete!</h4>
                    <p className="text-sm font-semibold font-body text-slate-600">
                      You scored {quizScore} out of {quizData[gkView.levelId]?.length || 3}!
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

      {/* MODAL 2: NURSERY WORKSHEETS DETAILS */}
      {activeModal === 'nursery' && activeChild && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fcfbf9] border-4 border-slate-800 rounded-[2.5rem] p-6 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col justify-between relative">
            <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🎈</span>
                <div className="text-left">
                  <h3 className="font-black text-lg uppercase text-slate-800">Nursery Worksheets</h3>
                  <p className="text-[9px] font-bold text-slate-400">15 Interactive printable worksheets</p>
                </div>
              </div>
              <button 
                onClick={() => { setActiveModal(null); setNurseryView(null); }}
                className="w-8 h-8 rounded-full bg-red-100 border-2 border-slate-800 text-slate-800 flex items-center justify-center font-black hover:bg-red-200 transition"
              >
                ✕
              </button>
            </div>

            {!nurseryView ? (
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 overflow-y-auto py-2">
                {[
                  { id: "1", title: "Alphabet Sound", icon: "🔤" },
                  { id: "2", title: "Star Counter", icon: "🔢" },
                  { id: "3", title: "Color Match", icon: "🎨" },
                  { id: "4", title: "Rhymes Sing", icon: "🎵" },
                  { id: "5", title: "Memory Cards", icon: "🧸" }
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
                        if (num === starsToCount) {
                          setCountingFeedback("Correct! You are a superstar! 🌈");
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

      {/* MODAL 3: PARENTS CONTROL DETAILS */}
      {activeModal === 'parents' && activeChild && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fcfbf9] border-4 border-slate-800 rounded-[2.5rem] p-6 shadow-2xl max-w-md w-full relative">
            <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">📊</span>
                <div className="text-left">
                  <h3 className="font-black text-base uppercase text-slate-800">Parents Control Portal</h3>
                  <p className="text-[8px] font-bold text-slate-400">Review scores & unlocked triggers</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-red-100 border-2 border-slate-800 text-slate-800 flex items-center justify-center font-black hover:bg-red-200 transition"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4 text-left">
              <div className="bg-white border-2 border-slate-800 rounded-2xl p-4 shadow-sm">
                <h4 className="font-black text-xs uppercase text-slate-400 tracking-wider">Active Explorer Profile</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-3xl">{activeChild.avatar}</span>
                  <span className="font-black text-sm text-slate-800">{activeChild.displayName}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Authenticated</span>
                </div>
              </div>

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
