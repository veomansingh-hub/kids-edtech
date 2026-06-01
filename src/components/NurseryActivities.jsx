import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw, Volume2, Award, Heart, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import './NurseryActivities.css';

// SVG Assets for Activity 1 (Objects)
const ObjectSVGs = {
  lollipop: (color = "#ff6b81") => (
    <svg viewBox="0 0 100 100" className="toddler-card-svg">
      <circle cx="50" cy="40" r="25" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
      <path d="M50 40 C 40 30, 30 50, 50 40 Z" fill={color} opacity="0.3" />
      <circle cx="50" cy="40" r="18" fill="none" stroke={color} strokeWidth="3" strokeDasharray="5,5" />
      <line x1="50" y1="65" x2="50" y2="95" stroke="#747d8c" strokeWidth="6" strokeLinecap="round" />
    </svg>
  ),
  car: (color = "#54a0ff") => (
    <svg viewBox="0 0 100 100" className="toddler-card-svg">
      <path d="M15 65 L85 65 C90 65, 90 55, 85 55 L75 55 L65 30 L35 30 L25 55 L15 55 C10 55, 10 65, 15 65 Z" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35 30 L65 30 L75 55 L25 55 Z" fill={color} opacity="0.2" />
      <circle cx="32" cy="72" r="10" fill="none" stroke="#2f3542" strokeWidth="5" />
      <circle cx="32" cy="72" r="4" fill="#2f3542" />
      <circle cx="68" cy="72" r="10" fill="none" stroke="#2f3542" strokeWidth="5" />
      <circle cx="68" cy="72" r="4" fill="#2f3542" />
    </svg>
  ),
  fish: (color = "#ff7f50") => (
    <svg viewBox="0 0 100 100" className="toddler-card-svg">
      <path d="M15 50 C25 25, 65 30, 75 50 C65 70, 25 75, 15 50 Z" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M15 50 C25 25, 65 30, 75 50 C65 70, 25 75, 15 50 Z" fill={color} opacity="0.2" />
      <path d="M75 50 L90 35 L85 50 L90 65 Z" fill="none" stroke={color} strokeWidth="5" strokeLinejoin="round" />
      <circle cx="30" cy="45" r="3" fill="#2f3542" />
      <path d="M50 38 C52 45, 52 55, 50 62" fill="none" stroke={color} strokeWidth="3" />
    </svg>
  ),
  kite: (color = "#1dd1a1") => (
    <svg viewBox="0 0 100 100" className="toddler-card-svg">
      <path d="M50 10 L80 45 L50 80 L20 45 Z" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 10 L80 45 L50 80 L20 45 Z" fill={color} opacity="0.2" />
      <line x1="50" y1="10" x2="50" y2="80" stroke={color} strokeWidth="3" />
      <line x1="20" y1="45" x2="80" y2="45" stroke={color} strokeWidth="3" />
      <path d="M50 80 Q55 90, 48 98" fill="none" stroke="#ff6b6b" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  bucket: (color = "#9b59b6") => (
    <svg viewBox="0 0 100 100" className="toddler-card-svg">
      <path d="M30 40 L70 40 L62 85 L38 85 Z" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 40 L70 40 L62 85 L38 85 Z" fill={color} opacity="0.2" />
      <path d="M30 40 C30 20, 70 20, 70 40" fill="none" stroke="#747d8c" strokeWidth="4" strokeLinecap="round" />
      <line x1="33" y1="52" x2="67" y2="52" stroke={color} strokeWidth="3" />
    </svg>
  )
};

// SVG Assets for Activity 2 (Shapes & Real Objects)
const ShapeSVGs = {
  triangle: () => (
    <svg viewBox="0 0 100 100" className="toddler-card-svg">
      <polygon points="50,15 85,80 15,80" fill="none" stroke="#9b59b6" strokeWidth="6" strokeLinejoin="round" />
      <polygon points="50,15 85,80 15,80" fill="#9b59b6" opacity="0.15" />
    </svg>
  ),
  circle: () => (
    <svg viewBox="0 0 100 100" className="toddler-card-svg">
      <circle cx="50" cy="50" r="35" fill="none" stroke="#ff4757" strokeWidth="6" />
      <circle cx="50" cy="50" r="35" fill="#ff4757" opacity="0.15" />
    </svg>
  ),
  square: () => (
    <svg viewBox="0 0 100 100" className="toddler-card-svg">
      <rect x="20" y="20" width="60" height="60" rx="8" fill="none" stroke="#ffa502" strokeWidth="6" />
      <rect x="20" y="20" width="60" height="60" rx="8" fill="#ffa502" opacity="0.15" />
    </svg>
  ),
  star: () => (
    <svg viewBox="0 0 100 100" className="toddler-card-svg">
      <polygon points="50,10 63,38 93,38 70,57 78,87 50,70 22,87 30,57 7,38 37,38" fill="none" stroke="#2ed573" strokeWidth="5" strokeLinejoin="round" />
      <polygon points="50,10 63,38 93,38 70,57 78,87 50,70 22,87 30,57 7,38 37,38" fill="#2ed573" opacity="0.15" />
    </svg>
  ),
  rectangle: () => (
    <svg viewBox="0 0 100 100" className="toddler-card-svg">
      <rect x="15" y="30" width="70" height="40" rx="6" fill="none" stroke="#1e90ff" strokeWidth="6" />
      <rect x="15" y="30" width="70" height="40" rx="6" fill="#1e90ff" opacity="0.15" />
    </svg>
  ),

  // Real world equivalents
  caution_sign: () => (
    <svg viewBox="0 0 100 100" className="toddler-card-svg">
      <polygon points="50,15 85,80 15,80" fill="none" stroke="#e67e22" strokeWidth="5" strokeLinejoin="round" />
      <polygon points="50,15 85,80 15,80" fill="#f1c40f" opacity="0.3" />
      <text x="47" y="65" fill="#e67e22" fontSize="32" fontWeight="bold" fontFamily="sans-serif">!</text>
    </svg>
  ),
  crater_ball: () => (
    <svg viewBox="0 0 100 100" className="toddler-card-svg">
      <circle cx="50" cy="50" r="35" fill="none" stroke="#ff4757" strokeWidth="5" />
      <circle cx="50" cy="50" r="35" fill="#ff6b81" opacity="0.2" />
      <circle cx="40" cy="40" r="6" fill="none" stroke="#ff4757" strokeWidth="3" />
      <circle cx="65" cy="45" r="5" fill="none" stroke="#ff4757" strokeWidth="3" />
      <circle cx="50" cy="65" r="7" fill="none" stroke="#ff4757" strokeWidth="3" />
    </svg>
  ),
  clock: () => (
    <svg viewBox="0 0 100 100" className="toddler-card-svg">
      <rect x="20" y="20" width="60" height="60" rx="8" fill="none" stroke="#ffa502" strokeWidth="5" />
      <circle cx="50" cy="50" r="22" fill="none" stroke="#ffa502" strokeWidth="3" />
      <line x1="50" y1="50" x2="50" y2="35" stroke="#2f3542" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="50" x2="62" y2="50" stroke="#2f3542" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  starfish: () => (
    <svg viewBox="0 0 100 100" className="toddler-card-svg">
      <polygon points="50,10 63,38 93,38 70,57 78,87 50,70 22,87 30,57 7,38 37,38" fill="none" stroke="#2ed573" strokeWidth="5" strokeLinejoin="round" />
      <polygon points="50,10 63,38 93,38 70,57 78,87 50,70 22,87 30,57 7,38 37,38" fill="#2ed573" opacity="0.3" />
      <circle cx="43" cy="45" r="3" fill="#2f3542" />
      <circle cx="57" cy="45" r="3" fill="#2f3542" />
      <path d="M47 52 Q50 55, 53 52" fill="none" stroke="#2f3542" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  tv: () => (
    <svg viewBox="0 0 100 100" className="toddler-card-svg">
      <rect x="15" y="30" width="70" height="40" rx="6" fill="none" stroke="#1e90ff" strokeWidth="5" />
      <rect x="20" y="34" width="60" height="32" fill="#dfe4ea" opacity="0.3" />
      <line x1="35" y1="70" x2="25" y2="85" stroke="#1e90ff" strokeWidth="4" />
      <line x1="65" y1="70" x2="75" y2="85" stroke="#1e90ff" strokeWidth="4" />
      <line x1="40" y1="30" x2="30" y2="15" stroke="#2f3542" strokeWidth="3" />
      <line x1="60" y1="30" x2="70" y2="15" stroke="#2f3542" strokeWidth="3" />
    </svg>
  )
};

export default function NurseryActivities({ addXp, isPro }) {
  const [activeTab, setActiveTab] = useState('match_objects');
  const [speaking, setSpeaking] = useState(false);
  const containerRef = useRef(null);

  // Sound Synth Synthesizer Tone Player for instant sound effects
  const playMatchSound = (isCorrect) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isCorrect) {
        // High cheery happy chirp
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else {
        // Soft click
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      }
    } catch (e) {
      console.log("Audio Context blocked");
    }
  };

  const playSuccessCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    // Multi tone high chord
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const tones = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      tones.forEach((t, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(t, audioCtx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.08 + 0.4);
        osc.start(audioCtx.currentTime + i * 0.08);
        osc.stop(audioCtx.currentTime + i * 0.08 + 0.4);
      });
    } catch(e){}
  };

  // Speaks aloud instructions
  const speakText = (text) => {
    if (speaking) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.2; // High happy pitch for kids
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log("Speech synthesize blocked");
    }
  };

  // -----------------------------------------------------------------
  // STATE & MECHANICS: ACTIVITY 1 (MATCH SAME OBJECT)
  // -----------------------------------------------------------------
  const [act1Matches, setAct1Matches] = useState({}); // { leftId: rightId }
  const [act1Selected, setAct1Selected] = useState(null); // { id: 'lollipop', side: 'left' }
  const [leftOrder1, setLeftOrder1] = useState(['lollipop', 'car', 'fish', 'kite', 'bucket']);
  const [rightOrder1, setRightOrder1] = useState(['bucket', 'lollipop', 'fish', 'kite', 'car']); // Shuffled
  const [lineCoords1, setLineCoords1] = useState([]);

  const resetAct1 = () => {
    setAct1Matches({});
    setAct1Selected(null);
    setLineCoords1([]);
    // Reshuffle right order
    setRightOrder1([...['bucket', 'lollipop', 'fish', 'kite', 'car']].sort(() => Math.random() - 0.5));
  };

  const handleAct1CardClick = (id, side) => {
    if (speaking) return;
    
    // If already matched, ignore
    if (side === 'left' && act1Matches[id]) return;
    if (side === 'right' && Object.values(act1Matches).includes(id)) return;

    playMatchSound(false);

    if (!act1Selected) {
      setAct1Selected({ id, side });
      return;
    }

    if (act1Selected.side === side) {
      // Switch selection to current
      setAct1Selected({ id, side });
    } else {
      // Attempting match
      const leftId = side === 'left' ? id : act1Selected.id;
      const rightId = side === 'right' ? id : act1Selected.id;

      if (leftId === rightId) {
        // SUCCESS! Perfect Match!
        const newMatches = { ...act1Matches, [leftId]: rightId };
        setAct1Matches(newMatches);
        setAct1Selected(null);
        playMatchSound(true);
        addXp(10);

        // Check if all matched
        if (Object.keys(newMatches).length === 5) {
          setTimeout(() => {
            playSuccessCelebration();
            speakText("Amazing job! You matched all the toys!");
          }, 400);
        }
      } else {
        // Mis-match, reset selection
        setAct1Selected(null);
      }
    }
  };

  // Recalculate line offsets on render or window resize
  const recalculateLines1 = () => {
    if (!containerRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const tempCoords = [];

    Object.entries(act1Matches).forEach(([leftId, rightId]) => {
      const leftEl = document.getElementById(`act1-left-${leftId}`);
      const rightEl = document.getElementById(`act1-right-${rightId}`);
      if (leftEl && rightEl) {
        const lRect = leftEl.getBoundingClientRect();
        const rRect = rightEl.getBoundingClientRect();

        // Calculate center-right of left card, center-left of right card
        const x1 = lRect.right - parentRect.left;
        const y1 = lRect.top + lRect.height / 2 - parentRect.top;
        const x2 = rRect.left - parentRect.left;
        const y2 = rRect.top + rRect.height / 2 - parentRect.top;

        tempCoords.push({ leftId, x1, y1, x2, y2, color: getThemeColor(leftId) });
      }
    });

    setLineCoords1(tempCoords);
  };

  const getThemeColor = (id) => {
    switch (id) {
      case 'lollipop': return '#ff6b81';
      case 'car': return '#2e86de';
      case 'fish': return '#ff9f43';
      case 'kite': return '#1dd1a1';
      case 'bucket': return '#9b59b6';
      default: return '#747d8c';
    }
  };

  // -----------------------------------------------------------------
  // STATE & MECHANICS: ACTIVITY 2 (SHAPE MATCHING)
  // -----------------------------------------------------------------
  const [act2Matches, setAct2Matches] = useState({}); // { shapeId: realWorldId }
  const [act2Selected, setAct2Selected] = useState(null); // { id, side }
  const [leftOrder2, setLeftOrder2] = useState(['triangle', 'circle', 'square', 'star', 'rectangle']);
  const [rightOrder2, setRightOrder2] = useState(['caution_sign', 'crater_ball', 'tv', 'clock', 'starfish']); // Shuffled
  const [lineCoords2, setLineCoords2] = useState([]);

  const shapeMapping = {
    triangle: 'caution_sign',
    circle: 'crater_ball',
    square: 'clock',
    star: 'starfish',
    rectangle: 'tv'
  };

  const resetAct2 = () => {
    setAct2Matches({});
    setAct2Selected(null);
    setLineCoords2([]);
    setRightOrder2([...['caution_sign', 'crater_ball', 'tv', 'clock', 'starfish']].sort(() => Math.random() - 0.5));
  };

  const handleAct2CardClick = (id, side) => {
    if (speaking) return;

    if (side === 'left' && act2Matches[id]) return;
    if (side === 'right' && Object.values(act2Matches).includes(id)) return;

    playMatchSound(false);

    if (!act2Selected) {
      setAct2Selected({ id, side });
      return;
    }

    if (act2Selected.side === side) {
      setAct2Selected({ id, side });
    } else {
      const leftId = side === 'left' ? id : act2Selected.id;
      const rightId = side === 'right' ? id : act2Selected.id;

      if (shapeMapping[leftId] === rightId) {
        const newMatches = { ...act2Matches, [leftId]: rightId };
        setAct2Matches(newMatches);
        setAct2Selected(null);
        playMatchSound(true);
        addXp(10);

        if (Object.keys(newMatches).length === 5) {
          setTimeout(() => {
            playSuccessCelebration();
            speakText("Sensational! You connected all correct shapes!");
          }, 400);
        }
      } else {
        setAct2Selected(null);
      }
    }
  };

  const recalculateLines2 = () => {
    if (!containerRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const tempCoords = [];

    Object.entries(act2Matches).forEach(([leftId, rightId]) => {
      const leftEl = document.getElementById(`act2-left-${leftId}`);
      const rightEl = document.getElementById(`act2-right-${rightId}`);
      if (leftEl && rightEl) {
        const lRect = leftEl.getBoundingClientRect();
        const rRect = rightEl.getBoundingClientRect();

        const x1 = lRect.right - parentRect.left;
        const y1 = lRect.top + lRect.height / 2 - parentRect.top;
        const x2 = rRect.left - parentRect.left;
        const y2 = rRect.top + rRect.height / 2 - parentRect.top;

        tempCoords.push({ leftId, x1, y1, x2, y2, color: getShapeColor(leftId) });
      }
    });

    setLineCoords2(tempCoords);
  };

  const getShapeColor = (id) => {
    switch (id) {
      case 'triangle': return '#9b59b6';
      case 'circle': return '#ff4757';
      case 'square': return '#ffa502';
      case 'star': return '#2ed573';
      case 'rectangle': return '#1e90ff';
      default: return '#747d8c';
    }
  };

  // -----------------------------------------------------------------
  // STATE & MECHANICS: ACTIVITY 3 (LINE TRACING)
  // -----------------------------------------------------------------
  const [tracedMugs, setTracedMugs] = useState({}); // { mugIndex: true }
  
  const resetAct3 = () => {
    setTracedMugs({});
  };

  const handleMugClick = (index, label) => {
    if (tracedMugs[index]) return;
    playMatchSound(true);
    setTracedMugs(prev => {
      const next = { ...prev, [index]: true };
      addXp(10);
      if (Object.keys(next).length === 6) {
        setTimeout(() => {
          playSuccessCelebration();
          speakText("Fantastic tracing! You filled all colorful cups with fresh water!");
        }, 400);
      }
      return next;
    });
  };

  // Re-run SVG updates on active views or resizes
  useEffect(() => {
    recalculateLines1();
    recalculateLines2();

    window.addEventListener('resize', recalculateLines1);
    window.addEventListener('resize', recalculateLines2);

    return () => {
      window.removeEventListener('resize', recalculateLines1);
      window.removeEventListener('resize', recalculateLines2);
    };
  }, [act1Matches, act2Matches, activeTab]);

  return (
    <div className="nursery-activities-container">
      {/* Title block */}
      <div className="toddler-header-card card-premium">
        <h1 className="toddler-title">🎈 Toddler Playroom</h1>
        <p className="toddler-subtitle">
          Interactive Pre-Nursery Activities for Age 2+. Complete and collect shiny stars! ✨
        </p>

        {/* Crayon Styled Mode Selectors */}
        <div className="toddler-tabs-row" style={{ marginTop: '1.5rem' }}>
          <button 
            className={`toddler-tab-btn pink ${activeTab === 'match_objects' ? 'active' : ''}`}
            onClick={() => { setActiveTab('match_objects'); speakText("Match the same objects!"); }}
          >
            🧸 Match Same Object
          </button>
          <button 
            className={`toddler-tab-btn active ${activeTab === 'shape_matching' ? 'active' : ''}`}
            onClick={() => { setActiveTab('shape_matching'); speakText("Connect correct shapes!"); }}
          >
            📐 Shape Matching
          </button>
          <button 
            className={`toddler-tab-btn green ${activeTab === 'line_tracing' ? 'active' : ''}`}
            onClick={() => { setActiveTab('line_tracing'); speakText("Help the raindrops slide into colorful cups!"); }}
          >
            🌧️ Raindrop Tracing
          </button>
        </div>
      </div>

      {/* Main Drawing Canvas Paper */}
      <div 
        ref={containerRef} 
        id="playboard-container" 
        className="toddler-playboard-paper"
      >
        {/* SPEAK INSTRUCTION VOICE BUTTON */}
        <button 
          className="btn-bouncy purple" 
          style={{ position: 'absolute', top: '15px', right: '15px', padding: '8px 16px', fontSize: '0.9rem' }}
          onClick={() => {
            if (activeTab === 'match_objects') speakText("Click matching cards from left and right side!");
            if (activeTab === 'shape_matching') speakText("Connect the geometry shapes with real objects!");
            if (activeTab === 'line_tracing') speakText("Tap on the colored raindrops to slide down and fill the mugs!");
          }}
        >
          <Volume2 size={16} /> Let's Read!
        </button>

        {/* -----------------------------------------------------------
            TAB 1: MATCH SAME OBJECTS
           ----------------------------------------------------------- */}
        {activeTab === 'match_objects' && (
          <div>
            <div className="tracing-instructions">
              👉 Click matching cards on left and right sides!
            </div>

            <div className="match-columns-grid">
              {/* Left column */}
              <div className="match-column">
                {leftOrder1.map(id => (
                  <div 
                    key={id}
                    id={`act1-left-${id}`}
                    className={`toddler-card ${act1Selected?.id === id && act1Selected?.side === 'left' ? 'selected' : ''} ${act1Matches[id] ? 'matched' : ''}`}
                    onClick={() => handleAct1CardClick(id, 'left')}
                  >
                    {ObjectSVGs[id]()}
                    <div className="toddler-card-label" style={{textTransform: 'capitalize'}}>{id}</div>
                  </div>
                ))}
              </div>

              {/* Middle gap spacer */}
              <div></div>

              {/* Right column */}
              <div className="match-column">
                {rightOrder1.map(id => (
                  <div 
                    key={id}
                    id={`act1-right-${id}`}
                    className={`toddler-card ${act1Selected?.id === id && act1Selected?.side === 'right' ? 'selected' : ''} ${Object.values(act1Matches).includes(id) ? 'matched' : ''}`}
                    onClick={() => handleAct1CardClick(id, 'right')}
                  >
                    {ObjectSVGs[id]()}
                    <div className="toddler-card-label" style={{textTransform: 'capitalize'}}>{id}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Drawn SVG Lines Overlay */}
            <svg className="matching-svg-overlay">
              {lineCoords1.map(line => (
                <path 
                  key={line.leftId}
                  d={`M ${line.x1} ${line.y1} C ${(line.x1 + line.x2)/2} ${line.y1}, ${(line.x1 + line.x2)/2} ${line.y2}, ${line.x2} ${line.y2}`}
                  stroke={line.color}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="1,2"
                  style={{ filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.05))' }}
                />
              ))}
            </svg>

            {Object.keys(act1Matches).length === 5 && (
              <div className="playroom-complete-banner">
                <h3>🎈 Yay! You Completed it!</h3>
                <p>Enjoy +50 XP and a shiny golden star! Let's keep exploring.</p>
                <button className="btn-bouncy blue playroom-reset-btn" onClick={resetAct1}>
                  <RefreshCw size={16} /> Play Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* -----------------------------------------------------------
            TAB 2: SHAPE MATCHING
           ----------------------------------------------------------- */}
        {activeTab === 'shape_matching' && (
          <div>
            <div className="tracing-instructions">
              👉 Match the basic geometry shapes on left with household items!
            </div>

            <div className="match-columns-grid">
              {/* Left shapes */}
              <div className="match-column">
                {leftOrder2.map(id => (
                  <div 
                    key={id}
                    id={`act2-left-${id}`}
                    className={`toddler-card ${act2Selected?.id === id && act2Selected?.side === 'left' ? 'selected' : ''} ${act2Matches[id] ? 'matched' : ''}`}
                    onClick={() => handleAct2CardClick(id, 'left')}
                  >
                    {ShapeSVGs[id]()}
                    <div className="toddler-card-label" style={{textTransform: 'capitalize'}}>{id}</div>
                  </div>
                ))}
              </div>

              {/* Middle gap spacer */}
              <div></div>

              {/* Right Objects */}
              <div className="match-column">
                {rightOrder2.map(id => {
                  const label = id.replace('_', ' ');
                  return (
                    <div 
                      key={id}
                      id={`act2-right-${id}`}
                      className={`toddler-card ${act2Selected?.id === id && act2Selected?.side === 'right' ? 'selected' : ''} ${Object.values(act2Matches).includes(id) ? 'matched' : ''}`}
                      onClick={() => handleAct2CardClick(id, 'right')}
                    >
                      {ShapeSVGs[id]()}
                      <div className="toddler-card-label" style={{textTransform: 'capitalize'}}>{label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shape Connections Overlay */}
            <svg className="matching-svg-overlay">
              {lineCoords2.map(line => (
                <path 
                  key={line.leftId}
                  d={`M ${line.x1} ${line.y1} C ${(line.x1 + line.x2)/2} ${line.y1}, ${(line.x1 + line.x2)/2} ${line.y2}, ${line.x2} ${line.y2}`}
                  stroke={line.color}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.05))' }}
                />
              ))}
            </svg>

            {Object.keys(act2Matches).length === 5 && (
              <div className="playroom-complete-banner">
                <h3>📐 Geometry Master!</h3>
                <p>Outstanding logical skills unlocked! Collect +50 XP!</p>
                <button className="btn-bouncy blue playroom-reset-btn" onClick={resetAct2}>
                  <RefreshCw size={16} /> Play Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* -----------------------------------------------------------
            TAB 3: RAINDROP TRACING
           ----------------------------------------------------------- */}
        {activeTab === 'line_tracing' && (
          <div className="tracing-container">
            <div className="tracing-instructions">
              🌧️ Guide cute colored raindrops from the clouds into their matching cups!
            </div>

            {/* Giant Fluffy Smiling Cloud */}
            <div className="cloud-svg-wrapper" onClick={() => speakText("I am a happy blue cloud! Make me rain!")}>
              <svg viewBox="0 0 200 100" style={{ width: '220px', height: '110px' }}>
                <path d="M 30 70 A 30 30 0 0 1 50 20 A 35 35 0 0 1 100 10 A 35 35 0 0 1 150 25 A 30 30 0 0 1 170 70 Z" fill="#7ed6df" opacity="0.9" />
                {/* Fluffy white highlights */}
                <path d="M 35 60 A 25 25 0 0 1 52 25 A 30 30 0 0 1 95 18" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
                {/* Smiling eyes */}
                <circle cx="85" cy="55" r="4" fill="#2f3542" />
                <circle cx="115" cy="55" r="4" fill="#2f3542" />
                {/* Sweet smile */}
                <path d="M 94 65 Q 100 70, 106 65" fill="none" stroke="#2f3542" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>

            {/* Interactive Tracing Ground */}
            <div className="tracing-interactive-canvas-area">
              {/* Rain Tracing SVG Dotted Lines */}
              <svg className="tracing-svg-canvas">
                {/* Line 1: Purple */}
                <line x1="7%" y1="10" x2="7%" y2="300" stroke="#9b59b6" strokeWidth="5" strokeDasharray="8,8" opacity={tracedMugs[0] ? 1 : 0.4} />
                {/* Line 2: Green */}
                <line x1="25%" y1="10" x2="25%" y2="300" stroke="#1dd1a1" strokeWidth="5" strokeDasharray="8,8" opacity={tracedMugs[1] ? 1 : 0.4} />
                {/* Line 3: Yellow */}
                <line x1="43%" y1="10" x2="43%" y2="300" stroke="#feca57" strokeWidth="5" strokeDasharray="8,8" opacity={tracedMugs[2] ? 1 : 0.4} />
                {/* Line 4: Orange */}
                <line x1="60%" y1="10" x2="60%" y2="300" stroke="#ff9f43" strokeWidth="5" strokeDasharray="8,8" opacity={tracedMugs[3] ? 1 : 0.4} />
                {/* Line 5: Pink */}
                <line x1="77%" y1="10" x2="77%" y2="300" stroke="#ff6b6b" strokeWidth="5" strokeDasharray="8,8" opacity={tracedMugs[4] ? 1 : 0.4} />
                {/* Line 6: Blue */}
                <line x1="93%" y1="10" x2="93%" y2="300" stroke="#54a0ff" strokeWidth="5" strokeDasharray="8,8" opacity={tracedMugs[5] ? 1 : 0.4} />
              </svg>

              {/* Clickable raindrop overlay to slide down easily */}
              <div 
                style={{ position: 'absolute', top: '10px', left: '4%', cursor: 'pointer' }}
                onClick={() => handleMugClick(0)}
              >
                <svg width="30" height="40" viewBox="0 0 30 40">
                  <path d="M15 3 C15 3, 27 20, 27 28 C27 34, 21 40, 15 40 C9 40, 3 34, 3 28 C3 20, 15 3, 15 3 Z" fill="#9b59b6" />
                </svg>
              </div>

              <div 
                style={{ position: 'absolute', top: '10px', left: '22%', cursor: 'pointer' }}
                onClick={() => handleMugClick(1)}
              >
                <svg width="30" height="40" viewBox="0 0 30 40">
                  <path d="M15 3 C15 3, 27 20, 27 28 C27 34, 21 40, 15 40 C9 40, 3 34, 3 28 C3 20, 15 3, 15 3 Z" fill="#1dd1a1" />
                </svg>
              </div>

              <div 
                style={{ position: 'absolute', top: '10px', left: '40%', cursor: 'pointer' }}
                onClick={() => handleMugClick(2)}
              >
                <svg width="30" height="40" viewBox="0 0 30 40">
                  <path d="M15 3 C15 3, 27 20, 27 28 C27 34, 21 40, 15 40 C9 40, 3 34, 3 28 C3 20, 15 3, 15 3 Z" fill="#feca57" />
                </svg>
              </div>

              <div 
                style={{ position: 'absolute', top: '10px', left: '57%', cursor: 'pointer' }}
                onClick={() => handleMugClick(3)}
              >
                <svg width="30" height="40" viewBox="0 0 30 40">
                  <path d="M15 3 C15 3, 27 20, 27 28 C27 34, 21 40, 15 40 C9 40, 3 34, 3 28 C3 20, 15 3, 15 3 Z" fill="#ff9f43" />
                </svg>
              </div>

              <div 
                style={{ position: 'absolute', top: '10px', left: '74%', cursor: 'pointer' }}
                onClick={() => handleMugClick(4)}
              >
                <svg width="30" height="40" viewBox="0 0 30 40">
                  <path d="M15 3 C15 3, 27 20, 27 28 C27 34, 21 40, 15 40 C9 40, 3 34, 3 28 C3 20, 15 3, 15 3 Z" fill="#ff6b6b" />
                </svg>
              </div>

              <div 
                style={{ position: 'absolute', top: '10px', left: '90%', cursor: 'pointer' }}
                onClick={() => handleMugClick(5)}
              >
                <svg width="30" height="40" viewBox="0 0 30 40">
                  <path d="M15 3 C15 3, 27 20, 27 28 C27 34, 21 40, 15 40 C9 40, 3 34, 3 28 C3 20, 15 3, 15 3 Z" fill="#54a0ff" />
                </svg>
              </div>

              {/* Six Colorful Cups Row */}
              <div className="tracing-mugs-row">
                {/* Cup 1: Purple */}
                <div className={`mug-item ${tracedMugs[0] ? 'filled' : ''}`} onClick={() => handleMugClick(0)}>
                  <svg className="mug-svg" viewBox="0 0 100 100">
                    <path d="M25 35 L75 35 L70 90 L30 90 Z" fill={tracedMugs[0] ? "#9b59b6" : "none"} stroke="#9b59b6" strokeWidth="6" strokeLinecap="round" />
                    <path d="M73 45 Q88 45, 71 70" fill="none" stroke="#9b59b6" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: '0.8rem', color: '#9b59b6', fontWeight: 'bold' }}>Purple</span>
                </div>

                {/* Cup 2: Green */}
                <div className={`mug-item ${tracedMugs[1] ? 'filled' : ''}`} onClick={() => handleMugClick(1)}>
                  <svg className="mug-svg" viewBox="0 0 100 100">
                    <path d="M25 35 L75 35 L70 90 L30 90 Z" fill={tracedMugs[1] ? "#1dd1a1" : "none"} stroke="#1dd1a1" strokeWidth="6" strokeLinecap="round" />
                    <path d="M73 45 Q88 45, 71 70" fill="none" stroke="#1dd1a1" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: '0.8rem', color: '#1dd1a1', fontWeight: 'bold' }}>Green</span>
                </div>

                {/* Cup 3: Yellow */}
                <div className={`mug-item ${tracedMugs[2] ? 'filled' : ''}`} onClick={() => handleMugClick(2)}>
                  <svg className="mug-svg" viewBox="0 0 100 100">
                    <path d="M25 35 L75 35 L70 90 L30 90 Z" fill={tracedMugs[2] ? "#feca57" : "none"} stroke="#feca57" strokeWidth="6" strokeLinecap="round" />
                    <path d="M73 45 Q88 45, 71 70" fill="none" stroke="#feca57" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: '0.8rem', color: '#feca57', fontWeight: 'bold' }}>Yellow</span>
                </div>

                {/* Cup 4: Orange */}
                <div className={`mug-item ${tracedMugs[3] ? 'filled' : ''}`} onClick={() => handleMugClick(3)}>
                  <svg className="mug-svg" viewBox="0 0 100 100">
                    <path d="M25 35 L75 35 L70 90 L30 90 Z" fill={tracedMugs[3] ? "#ff9f43" : "none"} stroke="#ff9f43" strokeWidth="6" strokeLinecap="round" />
                    <path d="M73 45 Q88 45, 71 70" fill="none" stroke="#ff9f43" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: '0.8rem', color: '#ff9f43', fontWeight: 'bold' }}>Orange</span>
                </div>

                {/* Cup 5: Pink */}
                <div className={`mug-item ${tracedMugs[4] ? 'filled' : ''}`} onClick={() => handleMugClick(4)}>
                  <svg className="mug-svg" viewBox="0 0 100 100">
                    <path d="M25 35 L75 35 L70 90 L30 90 Z" fill={tracedMugs[4] ? "#ff6b6b" : "none"} stroke="#ff6b6b" strokeWidth="6" strokeLinecap="round" />
                    <path d="M73 45 Q88 45, 71 70" fill="none" stroke="#ff6b6b" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: '0.8rem', color: '#ff6b6b', fontWeight: 'bold' }}>Pink</span>
                </div>

                {/* Cup 6: Blue */}
                <div className={`mug-item ${tracedMugs[5] ? 'filled' : ''}`} onClick={() => handleMugClick(5)}>
                  <svg className="mug-svg" viewBox="0 0 100 100">
                    <path d="M25 35 L75 35 L70 90 L30 90 Z" fill={tracedMugs[5] ? "#54a0ff" : "none"} stroke="#54a0ff" strokeWidth="6" strokeLinecap="round" />
                    <path d="M73 45 Q88 45, 71 70" fill="none" stroke="#54a0ff" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: '0.8rem', color: '#54a0ff', fontWeight: 'bold' }}>Blue</span>
                </div>
              </div>

            </div>

            {Object.keys(tracedMugs).length === 6 && (
              <div className="playroom-complete-banner" style={{ width: '100%' }}>
                <h3>🌧️ Water Party Success!</h3>
                <p>You traced beautifully and watered all 6 cute mugs! Enjoy +60 XP!</p>
                <button className="btn-bouncy blue playroom-reset-btn" onClick={resetAct3}>
                  <RefreshCw size={16} /> Trace Again
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
