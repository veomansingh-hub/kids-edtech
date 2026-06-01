import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw, Volume2, Award, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import './NurseryActivities.css';

// Rich SVG Vocabulary Pool for dynamic selections
const ObjectSVGs = {
  lollipop: (color = "#ff6b81", scale = 1) => (
    <svg viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }} className="toddler-card-svg">
      <circle cx="50" cy="40" r="25" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
      <path d="M50 40 C 40 30, 30 50, 50 40 Z" fill={color} opacity="0.3" />
      <circle cx="50" cy="40" r="18" fill="none" stroke={color} strokeWidth="3" strokeDasharray="5,5" />
      <line x1="50" y1="65" x2="50" y2="95" stroke="#747d8c" strokeWidth="6" strokeLinecap="round" />
    </svg>
  ),
  car: (color = "#54a0ff", scale = 1) => (
    <svg viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }} className="toddler-card-svg">
      <path d="M15 65 L85 65 C90 65, 90 55, 85 55 L75 55 L65 30 L35 30 L25 55 L15 55 C10 55, 10 65, 15 65 Z" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35 30 L65 30 L75 55 L25 55 Z" fill={color} opacity="0.2" />
      <circle cx="32" cy="72" r="10" fill="none" stroke="#2f3542" strokeWidth="5" />
      <circle cx="68" cy="72" r="10" fill="none" stroke="#2f3542" strokeWidth="5" />
    </svg>
  ),
  fish: (color = "#ff7f50", scale = 1) => (
    <svg viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }} className="toddler-card-svg">
      <path d="M15 50 C25 25, 65 30, 75 50 C65 70, 25 75, 15 50 Z" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M15 50 C25 25, 65 30, 75 50 C65 70, 25 75, 15 50 Z" fill={color} opacity="0.2" />
      <path d="M75 50 L90 35 L85 50 L90 65 Z" fill="none" stroke={color} strokeWidth="5" strokeLinejoin="round" />
      <circle cx="30" cy="45" r="3" fill="#2f3542" />
    </svg>
  ),
  kite: (color = "#1dd1a1", scale = 1) => (
    <svg viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }} className="toddler-card-svg">
      <path d="M50 10 L80 45 L50 80 L20 45 Z" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 10 L80 45 L50 80 L20 45 Z" fill={color} opacity="0.2" />
      <line x1="50" y1="10" x2="50" y2="80" stroke={color} strokeWidth="3" />
      <line x1="20" y1="45" x2="80" y2="45" stroke={color} strokeWidth="3" />
      <path d="M50 80 Q55 90, 48 98" fill="none" stroke="#ff6b6b" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  bucket: (color = "#9b59b6", scale = 1) => (
    <svg viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }} className="toddler-card-svg">
      <path d="M30 40 L70 40 L62 85 L38 85 Z" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 40 L70 40 L62 85 L38 85 Z" fill={color} opacity="0.2" />
      <path d="M30 40 C30 20, 70 20, 70 40" fill="none" stroke="#747d8c" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  apple: (color = "#ff4757", scale = 1) => (
    <svg viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }} className="toddler-card-svg">
      <path d="M50 30 C30 15, 15 35, 25 65 C35 85, 65 85, 75 65 C85 35, 70 15, 50 30 Z" fill="none" stroke={color} strokeWidth="5" />
      <path d="M50 30 C30 15, 15 35, 25 65 C35 85, 65 85, 75 65 C85 35, 70 15, 50 30 Z" fill={color} opacity="0.2" />
      <path d="M50 30 Q45 15, 55 10" fill="none" stroke="#78e08f" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  balloon: (color = "#ff9ff3", scale = 1) => (
    <svg viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }} className="toddler-card-svg">
      <ellipse cx="50" cy="40" rx="22" ry="28" fill="none" stroke={color} strokeWidth="5" />
      <ellipse cx="50" cy="40" rx="22" ry="28" fill={color} opacity="0.25" />
      <polygon points="50,68 45,75 55,75" fill={color} />
      <path d="M50 75 Q45 85, 53 95" fill="none" stroke="#747d8c" strokeWidth="3" />
    </svg>
  ),
  flower: (color = "#feca57", scale = 1) => (
    <svg viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }} className="toddler-card-svg">
      <circle cx="50" cy="50" r="12" fill="none" stroke="#ff9f43" strokeWidth="4" />
      <circle cx="50" cy="50" r="12" fill="#ff9f43" opacity="0.4" />
      {/* Petals */}
      <circle cx="50" cy="28" r="10" fill="none" stroke={color} strokeWidth="4" />
      <circle cx="50" cy="72" r="10" fill="none" stroke={color} strokeWidth="4" />
      <circle cx="28" cy="50" r="10" fill="none" stroke={color} strokeWidth="4" />
      <circle cx="72" cy="50" r="10" fill="none" stroke={color} strokeWidth="4" />
    </svg>
  ),
  star: (color = "#2ed573", scale = 1) => (
    <svg viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }} className="toddler-card-svg">
      <polygon points="50,10 63,38 93,38 70,57 78,87 50,70 22,87 30,57 7,38 37,38" fill="none" stroke={color} strokeWidth="5" strokeLinejoin="round" />
      <polygon points="50,10 63,38 93,38 70,57 78,87 50,70 22,87 30,57 7,38 37,38" fill={color} opacity="0.2" />
    </svg>
  ),
  umbrella: (color = "#10ac84", scale = 1) => (
    <svg viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }} className="toddler-card-svg">
      <path d="M15 55 C15 25, 85 25, 85 55 Z" fill="none" stroke={color} strokeWidth="5" />
      <path d="M15 55 C15 25, 85 25, 85 55 Z" fill={color} opacity="0.2" />
      <line x1="50" y1="30" x2="50" y2="80" stroke="#747d8c" strokeWidth="4" />
      <path d="M50 80 Q55 85, 60 80" fill="none" stroke="#747d8c" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
};

// Shape elements dictionary
const ShapeSVGs = {
  triangle: (color = "#9b59b6", scale = 1) => (
    <svg viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }} className="toddler-card-svg">
      <polygon points="50,15 85,80 15,80" fill="none" stroke={color} strokeWidth="6" strokeLinejoin="round" />
      <polygon points="50,15 85,80 15,80" fill={color} opacity="0.15" />
    </svg>
  ),
  circle: (color = "#ff4757", scale = 1) => (
    <svg viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }} className="toddler-card-svg">
      <circle cx="50" cy="50" r="35" fill="none" stroke={color} strokeWidth="6" />
      <circle cx="50" cy="50" r="35" fill={color} opacity="0.15" />
    </svg>
  ),
  square: (color = "#ffa502", scale = 1) => (
    <svg viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }} className="toddler-card-svg">
      <rect x="20" y="20" width="60" height="60" rx="8" fill="none" stroke={color} strokeWidth="6" />
      <rect x="20" y="20" width="60" height="60" rx="8" fill={color} opacity="0.15" />
    </svg>
  ),
  star: (color = "#2ed573", scale = 1) => (
    <svg viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }} className="toddler-card-svg">
      <polygon points="50,10 63,38 93,38 70,57 78,87 50,70 22,87 30,57 7,38 37,38" fill="none" stroke={color} strokeWidth="5" strokeLinejoin="round" />
      <polygon points="50,10 63,38 93,38 70,57 78,87 50,70 22,87 30,57 7,38 37,38" fill={color} opacity="0.15" />
    </svg>
  ),
  rectangle: (color = "#1e90ff", scale = 1) => (
    <svg viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }} className="toddler-card-svg">
      <rect x="15" y="30" width="70" height="40" rx="6" fill="none" stroke={color} strokeWidth="6" />
      <rect x="15" y="30" width="70" height="40" rx="6" fill={color} opacity="0.15" />
    </svg>
  )
};

export default function NurseryActivities({ addXp, isPro }) {
  const [currentPage, setCurrentPage] = useState(1); // Supports levels 1 to 20
  const [activeSubGame, setActiveSubGame] = useState('match'); // rotates: 'match', 'shapes', 'tracing'
  
  // Game state
  const [itemsLeft, setItemsLeft] = useState([]);
  const [itemsRight, setItemsRight] = useState([]);
  const [matches, setMatches] = useState({});
  const [selected, setSelected] = useState(null);
  const [lines, setLines] = useState([]);
  
  const containerRef = useRef(null);

  // Encouraging warm phrases for human speaking tone
  const humanPhrases = [
    "Oh beautiful! Let's solve this lovely puzzle together!",
    "Amazing work, little superstar! That's absolute perfection!",
    "Wow! You did it! You have such wonderful sharp eyes!",
    "Super-duper! Let's step up to the next playful page!",
    "Perfect match! You are a brilliant little explorer!",
    "Outstanding! You filled all those cups with refreshing water!"
  ];

  // More natural browser voice selector
  const speakText = (text) => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Select the absolute best high quality natural sounding voice if available
      const voices = window.speechSynthesis.getVoices();
      const premiumVoice = voices.find(v => 
        (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Zira")) && v.lang.startsWith("en")
      );
      
      if (premiumVoice) {
        utterance.voice = premiumVoice;
      }
      
      // Slow, warm, high-pitched kid-loving voice params
      utterance.rate = 0.85; 
      utterance.pitch = 1.15; 
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log("Speech blocked");
    }
  };

  const playMatchSound = (isCorrect) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      if (isCorrect) {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(160, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      }
    } catch(e){}
  };

  // Generates randomized level puzzle state dynamically
  const setupLevel = (pageNo) => {
    setMatches({});
    setSelected(null);
    setLines([]);

    // Rotates game mode depending on page number
    const mode = pageNo % 3 === 1 ? 'match' : (pageNo % 3 === 2 ? 'shapes' : 'tracing');
    setActiveSubGame(mode);

    if (mode === 'match') {
      // Pick 4 random toys from vocab pool
      const pool = ['lollipop', 'car', 'fish', 'kite', 'bucket', 'apple', 'balloon', 'flower', 'star', 'umbrella'];
      const chosen = [...pool].sort(() => Math.random() - 0.5).slice(0, 4);

      // Sizes randomization automatically
      const leftItems = chosen.map(id => ({
        id,
        color: getRandomColor(),
        scale: 0.7 + Math.random() * 0.5 // Random scaling between 0.7x and 1.2x
      }));

      // Shuffled right
      const rightItems = [...leftItems].sort(() => Math.random() - 0.5);

      setItemsLeft(leftItems);
      setItemsRight(rightItems);

      setTimeout(() => {
        speakText("Oh wow! Level " + pageNo + ". Let's match these beautiful toys side by side!");
      }, 500);

    } else if (mode === 'shapes') {
      const shapeList = ['triangle', 'circle', 'square', 'star', 'rectangle'];
      const chosenShapes = [...shapeList].sort(() => Math.random() - 0.5).slice(0, 4);

      // Random sizes tags to teach spatial dimensions!
      const sizeLabels = ['Tiny', 'Small', 'Medium', 'Big'];
      const sizeScales = { 'Tiny': 0.6, 'Small': 0.8, 'Medium': 1.0, 'Big': 1.25 };

      const leftItems = chosenShapes.map((id, index) => {
        const sizeTag = sizeLabels[index % sizeLabels.length];
        return {
          id: `${sizeTag}-${id}`,
          originalId: id,
          color: getRandomColor(),
          scale: sizeScales[sizeTag],
          label: `${sizeTag} ${id.toUpperCase()}`
        };
      });

      const rightItems = [...leftItems].sort(() => Math.random() - 0.5);

      setItemsLeft(leftItems);
      setItemsRight(rightItems);

      setTimeout(() => {
        speakText("Aha! Level " + pageNo + ". Look at those shapes in different sizes! Let's match the same shapes together!");
      }, 500);

    } else {
      // Tracing cloud puzzle
      setTracedMugs({});
      setTimeout(() => {
        speakText("It's raining! Level " + pageNo + ". Tap those floating raindrops to water the cups!");
      }, 500);
    }
  };

  const getRandomColor = () => {
    const list = ['#ff6b6b', '#54a0ff', '#1dd1a1', '#feca57', '#9b59b6', '#ff9ff3', '#ff7f50'];
    return list[Math.floor(Math.random() * list.length)];
  };

  // Tracing State
  const [tracedMugs, setTracedMugs] = useState({});

  const handleMugTrace = (index) => {
    if (tracedMugs[index]) return;
    playMatchSound(true);
    setTracedMugs(prev => {
      const next = { ...prev, [index]: true };
      addXp(10);
      if (Object.keys(next).length === 5) {
        handleLevelComplete();
      }
      return next;
    });
  };

  const handleCardClick = (id, side) => {
    if (side === 'left' && matches[id]) return;
    if (side === 'right' && Object.values(matches).includes(id)) return;

    playMatchSound(false);

    if (!selected) {
      setSelected({ id, side });
      return;
    }

    if (selected.side === side) {
      setSelected({ id, side });
    } else {
      const leftId = side === 'left' ? id : selected.id;
      const rightId = side === 'right' ? id : selected.id;

      if (leftId === rightId) {
        // Correct Match!
        const newMatches = { ...matches, [leftId]: rightId };
        setMatches(newMatches);
        setSelected(null);
        playMatchSound(true);
        addXp(10);

        if (Object.keys(newMatches).length === itemsLeft.length) {
          handleLevelComplete();
        }
      } else {
        setSelected(null);
      }
    }
  };

  const handleLevelComplete = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    
    const randomCongratulations = humanPhrases[Math.floor(Math.random() * humanPhrases.length)];
    speakText(randomCongratulations + " You finished page " + currentPage + "!");

    setTimeout(() => {
      if (currentPage < 20) {
        const next = currentPage + 1;
        setCurrentPage(next);
        setupLevel(next);
      } else {
        speakText("Wow! You completed all twenty levels! You are an amazing pre-nursery champion!");
      }
    }, 2500);
  };

  const recalculateOverlayLines = () => {
    if (!containerRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const tempCoords = [];

    Object.entries(matches).forEach(([leftId, rightId]) => {
      const leftEl = document.getElementById(`left-${leftId}`);
      const rightEl = document.getElementById(`right-${rightId}`);
      if (leftEl && rightEl) {
        const lRect = leftEl.getBoundingClientRect();
        const rRect = rightEl.getBoundingClientRect();

        const x1 = lRect.right - parentRect.left;
        const y1 = lRect.top + lRect.height / 2 - parentRect.top;
        const x2 = rRect.left - parentRect.left;
        const y2 = rRect.top + rRect.height / 2 - parentRect.top;

        tempCoords.push({ leftId, x1, y1, x2, y2 });
      }
    });

    setLines(tempCoords);
  };

  useEffect(() => {
    setupLevel(currentPage);
  }, []);

  useEffect(() => {
    recalculateOverlayLines();
    window.addEventListener('resize', recalculateOverlayLines);
    return () => window.removeEventListener('resize', recalculateOverlayLines);
  }, [matches, activeSubGame]);

  return (
    <div className="nursery-activities-container">
      {/* Dynamic Progress Card */}
      <div className="toddler-header-card card-premium">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ background: '#ffa502', color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '0.9rem', fontWeight: 'bold' }}>
              Level {currentPage}/20
            </span>
            <h1 className="toddler-title" style={{ marginTop: '0.5rem', fontSize: '2.2rem' }}>🎈 Pre-Nursery Playroom</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="toddler-tab-btn pink" style={{ padding: '8px 16px', fontSize: '1rem' }} onClick={() => { if(currentPage > 1) { setCurrentPage(c => c-1); setupLevel(currentPage - 1); } }}>
              <ChevronLeft size={16} /> Back
            </button>
            <button className="toddler-tab-btn green" style={{ padding: '8px 16px', fontSize: '1rem' }} onClick={() => { if(currentPage < 20) { setCurrentPage(c => c+1); setupLevel(currentPage + 1); } }}>
              Skip <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Dynamic Level Progress Bar Indicator */}
        <div style={{ background: '#e1f5fe', height: '14px', borderRadius: '99px', marginTop: '1rem', overflow: 'hidden', border: '2px solid #0288d1' }}>
          <div style={{ background: 'linear-gradient(90deg, #ff4757, #ffa502, #2ed573)', width: `${(currentPage / 20) * 100}%`, height: '100%', transition: 'all 0.4s ease' }}></div>
        </div>
      </div>

      {/* Main Drawing Area */}
      <div ref={containerRef} id="playboard-container" className="toddler-playboard-paper">
        {/* Play Sound Button */}
        <button 
          className="btn-bouncy purple animate-float" 
          style={{ position: 'absolute', top: '15px', right: '15px', padding: '8px 16px', fontSize: '0.9rem' }}
          onClick={() => {
            if (activeSubGame === 'match') speakText("Click matching toys on both sides!");
            if (activeSubGame === 'shapes') speakText("Match the geometry shapes! Pay attention to their different sizes!");
            if (activeSubGame === 'tracing') speakText("Guide the raindrops down to water the mugs!");
          }}
        >
          <Volume2 size={16} /> Read for me!
        </button>

        {/* GAME MODE 1: MATCH DYNAMIC OBJECTS */}
        {activeSubGame === 'match' && (
          <div>
            <div className="tracing-instructions">
              🧸 Click matching toys of different sizes!
            </div>
            
            <div className="match-columns-grid">
              <div className="match-column">
                {itemsLeft.map(item => (
                  <div 
                    key={item.id}
                    id={`left-${item.id}`}
                    className={`toddler-card ${selected?.id === item.id && selected?.side === 'left' ? 'selected' : ''} ${matches[item.id] ? 'matched' : ''}`}
                    onClick={() => handleCardClick(item.id, 'left')}
                  >
                    {ObjectSVGs[item.id](item.color, item.scale)}
                    <span className="toddler-card-label" style={{ textTransform: 'capitalize' }}>{item.id}</span>
                  </div>
                ))}
              </div>

              <div></div>

              <div className="match-column">
                {itemsRight.map(item => (
                  <div 
                    key={item.id}
                    id={`right-${item.id}`}
                    className={`toddler-card ${selected?.id === item.id && selected?.side === 'right' ? 'selected' : ''} ${Object.values(matches).includes(item.id) ? 'matched' : ''}`}
                    onClick={() => handleCardClick(item.id, 'right')}
                  >
                    {ObjectSVGs[item.id](item.color, item.scale)}
                    <span className="toddler-card-label" style={{ textTransform: 'capitalize' }}>{item.id}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Render Connection Lines overlay */}
            <svg className="matching-svg-overlay">
              {lines.map(line => (
                <path 
                  key={line.leftId}
                  d={`M ${line.x1} ${line.y1} C ${(line.x1 + line.x2)/2} ${line.y1}, ${(line.x1 + line.x2)/2} ${line.y2}, ${line.x2} ${line.y2}`}
                  stroke="#ff4757"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="4,4"
                />
              ))}
            </svg>
          </div>
        )}

        {/* GAME MODE 2: SHAPES & AUTOMATIC SIZES */}
        {activeSubGame === 'shapes' && (
          <div>
            <div className="tracing-instructions">
              📐 Match the shapes! Look closely at the Tiny, Small, and Big sizes!
            </div>
            
            <div className="match-columns-grid">
              <div className="match-column">
                {itemsLeft.map(item => (
                  <div 
                    key={item.id}
                    id={`left-${item.id}`}
                    className={`toddler-card ${selected?.id === item.id && selected?.side === 'left' ? 'selected' : ''} ${matches[item.id] ? 'matched' : ''}`}
                    onClick={() => handleCardClick(item.id, 'left')}
                  >
                    {ShapeSVGs[item.originalId](item.color, item.scale)}
                    <span className="toddler-card-label" style={{ fontWeight: 'bold' }}>{item.label}</span>
                  </div>
                ))}
              </div>

              <div></div>

              <div className="match-column">
                {itemsRight.map(item => (
                  <div 
                    key={item.id}
                    id={`right-${item.id}`}
                    className={`toddler-card ${selected?.id === item.id && selected?.side === 'right' ? 'selected' : ''} ${Object.values(matches).includes(item.id) ? 'matched' : ''}`}
                    onClick={() => handleCardClick(item.id, 'right')}
                  >
                    {ShapeSVGs[item.originalId](item.color, item.scale)}
                    <span className="toddler-card-label" style={{ fontWeight: 'bold' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connection overlay */}
            <svg className="matching-svg-overlay">
              {lines.map(line => (
                <path 
                  key={line.leftId}
                  d={`M ${line.x1} ${line.y1} C ${(line.x1 + line.x2)/2} ${line.y1}, ${(line.x1 + line.x2)/2} ${line.y2}, ${line.x2} ${line.y2}`}
                  stroke="#2ed573"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </div>
        )}

        {/* GAME MODE 3: TRACING FUN */}
        {activeSubGame === 'tracing' && (
          <div className="tracing-container">
            <div className="tracing-instructions">
              🌧️ Guide the raindrops down to water the mugs!
            </div>

            <div className="cloud-svg-wrapper">
              <svg viewBox="0 0 200 100" style={{ width: '200px', height: '100px' }}>
                <path d="M 30 70 A 30 30 0 0 1 50 20 A 35 35 0 0 1 100 10 A 35 35 0 0 1 150 25 A 30 30 0 0 1 170 70 Z" fill="#7ed6df" opacity="0.95" />
                <circle cx="85" cy="55" r="4" fill="#2f3542" />
                <circle cx="115" cy="55" r="4" fill="#2f3542" />
                <path d="M 94 65 Q 100 70, 106 65" fill="none" stroke="#2f3542" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>

            <div className="tracing-interactive-canvas-area" style={{ height: '320px' }}>
              <svg className="tracing-svg-canvas">
                <line x1="10%" y1="10" x2="10%" y2="240" stroke="#ff6b6b" strokeWidth="5" strokeDasharray="8,8" opacity={tracedMugs[0] ? 1 : 0.4} />
                <line x1="30%" y1="10" x2="30%" y2="240" stroke="#ffa502" strokeWidth="5" strokeDasharray="8,8" opacity={tracedMugs[1] ? 1 : 0.4} />
                <line x1="50%" y1="10" x2="50%" y2="240" stroke="#2ed573" strokeWidth="5" strokeDasharray="8,8" opacity={tracedMugs[2] ? 1 : 0.4} />
                <line x1="70%" y1="10" x2="70%" y2="240" stroke="#1e90ff" strokeWidth="5" strokeDasharray="8,8" opacity={tracedMugs[3] ? 1 : 0.4} />
                <line x1="90%" y1="10" x2="90%" y2="240" stroke="#9b59b6" strokeWidth="5" strokeDasharray="8,8" opacity={tracedMugs[4] ? 1 : 0.4} />
              </svg>

              {/* Raindrops clickable triggers */}
              {[0, 1, 2, 3, 4].map(idx => {
                const offsets = ['8%', '28%', '48%', '68%', '88%'];
                const colors = ['#ff6b6b', '#ffa502', '#2ed573', '#1e90ff', '#9b59b6'];
                return (
                  <div 
                    key={idx}
                    style={{ position: 'absolute', top: '10px', left: offsets[idx], cursor: 'pointer' }}
                    onClick={() => handleMugTrace(idx)}
                  >
                    <svg width="25" height="35" viewBox="0 0 30 40">
                      <path d="M15 3 C15 3, 27 20, 27 28 C27 34, 21 40, 15 40 C9 40, 3 34, 3 28 C3 20, 15 3, 15 3 Z" fill={colors[idx]} />
                    </svg>
                  </div>
                );
              })}

              {/* Mugs Row */}
              <div className="tracing-mugs-row" style={{ bottom: '10px' }}>
                {[0, 1, 2, 3, 4].map(idx => {
                  const colors = ['#ff6b6b', '#ffa502', '#2ed573', '#1e90ff', '#9b59b6'];
                  const labels = ['Red', 'Orange', 'Green', 'Blue', 'Purple'];
                  return (
                    <div 
                      key={idx} 
                      className={`mug-item ${tracedMugs[idx] ? 'filled' : ''}`}
                      onClick={() => handleMugTrace(idx)}
                      style={{ width: '50px' }}
                    >
                      <svg className="mug-svg" viewBox="0 0 100 100">
                        <path d="M25 35 L75 35 L70 90 L30 90 Z" fill={tracedMugs[idx] ? colors[idx] : "none"} stroke={colors[idx]} strokeWidth="6" />
                        <path d="M73 45 Q88 45, 71 70" fill="none" stroke={colors[idx]} strokeWidth="6" />
                      </svg>
                      <span style={{ fontSize: '0.8rem', color: colors[idx], fontWeight: 'bold' }}>{labels[idx]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
