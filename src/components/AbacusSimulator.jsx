import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, HelpCircle, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import './AbacusSimulator.css';

// Synthesize a beautiful clack sound using Web Audio API to prevent external file dependencies
const playClackSound = (pitch = 1.0) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    // Base pitch modified slightly by action
    osc.frequency.setValueAtTime(400 * pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100 * pitch, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Web audio might be blocked or unsupported
  }
};

const playSuccessSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.4);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
};

const CHALLENGES = [
  { id: 1, type: 'match', target: 3, title: 'Slide up 3 beads on the ONES column!', desc: 'Use the bottom beads on the far-right column (Ones).', col: 'ones' },
  { id: 2, type: 'match', target: 5, title: 'Slide down the top bead on the ONES column!', desc: 'The top bead represents 5!', col: 'ones' },
  { id: 3, type: 'match', target: 8, title: 'Let\'s show the number 8!', desc: 'Slide down the top bead (5) and slide up 3 bottom beads (3). 5 + 3 = 8!', col: 'ones' },
  { id: 4, type: 'match', target: 20, title: 'Show 20 on the Abacus!', desc: 'Slide up 2 bottom beads on the TENS column (the second column from the right).', col: 'tens' },
  { id: 5, type: 'match', target: 57, title: 'Can you show 57?', desc: 'Show 50 on the TENS column (top bead) and 7 on the ONES column (top bead + 2 bottom beads).', col: 'both' },
  { id: 6, type: 'math', query: '2 + 2 = ?', steps: ['Show 2 on the ones column', 'Slide up 2 more bottom beads'], target: 4, title: 'Addition Fun: 2 + 2', desc: 'Slide up 2 bottom beads, then slide up 2 more. How many beads are touching the beam?' },
  { id: 7, type: 'math', query: '4 + 5 = ?', steps: ['Show 4 on the ones column', 'Slide down the top bead (5)'], target: 9, title: 'Addition Fun: 4 + 5', desc: 'Slide up 4 bottom beads, then slide down the top bead (5). What is the total?' },
  { id: 8, type: 'math', query: '15 - 5 = ?', steps: ['Show 15 (1 ten + 5 ones)', 'Slide the ones top bead (5) back up'], target: 10, title: 'Subtraction Fun: 15 - 5', desc: 'Set 15: 1 on TENS column, 5 on ONES column. Now subtract 5 by sliding the ones top bead away. What is left?' }
];

export default function AbacusSimulator({ addXp, isPro }) {
  // Column bead states (Soroban Abacus: 1 upper bead worth 5, 4 lower beads worth 1)
  // Columns: Thousands (1000s), Hundreds (100s), Tens (10s), Ones (1s)
  const [abacusState, setAbacusState] = useState({
    thousands: { upper: false, lower: 0 },
    hundreds: { upper: false, lower: 0 },
    tens: { upper: false, lower: 0 },
    ones: { upper: false, lower: 0 }
  });

  const [currentValue, setCurrentValue] = useState(0);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('free'); // 'free' or 'challenges'
  const [hintVisible, setHintVisible] = useState(false);

  // Recalculate total value on state change
  useEffect(() => {
    const calcCol = (col) => (col.upper ? 5 : 0) + col.lower;
    const val = 
      calcCol(abacusState.thousands) * 1000 +
      calcCol(abacusState.hundreds) * 100 +
      calcCol(abacusState.tens) * 10 +
      calcCol(abacusState.ones);
    
    setCurrentValue(val);
  }, [abacusState]);

  // Check challenge completion
  useEffect(() => {
    if (activeTab === 'challenges') {
      const activeChallenge = CHALLENGES[challengeIdx];
      if (currentValue === activeChallenge.target && !challengeCompleted) {
        setChallengeCompleted(true);
        playSuccessSound();
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ff4b82', '#00d2ff', '#ffd200', '#9d4edd']
        });
        addXp(25); // Add 25 XP
      }
    }
  }, [currentValue, challengeIdx, activeTab]);

  const toggleUpperBead = (colName) => {
    setAbacusState(prev => {
      const isUp = !prev[colName].upper;
      playClackSound(isUp ? 1.2 : 0.95);
      return {
        ...prev,
        [colName]: {
          ...prev[colName],
          upper: isUp
        }
      };
    });
  };

  const setLowerBeads = (colName, count) => {
    setAbacusState(prev => {
      // If they click on already set beads, we slide them down.
      // E.g. clicking bead 2 when lower count is 2 will set it to 1.
      const prevCount = prev[colName].lower;
      const newCount = prevCount === count ? count - 1 : count;
      playClackSound(0.8 + (newCount * 0.1));
      return {
        ...prev,
        [colName]: {
          ...prev[colName],
          lower: newCount
        }
      };
    });
  };

  const resetAbacus = () => {
    playClackSound(0.7);
    setAbacusState({
      thousands: { upper: false, lower: 0 },
      hundreds: { upper: false, lower: 0 },
      tens: { upper: false, lower: 0 },
      ones: { upper: false, lower: 0 }
    });
    setChallengeCompleted(false);
    setHintVisible(false);
  };

  const handleNextChallenge = () => {
    if (challengeIdx < CHALLENGES.length - 1) {
      // Level check for free tier: Challenges 5+ are premium
      if (challengeIdx >= 3 && !isPro) {
        // Redirect or show premium lock
        alert("🔒 Unlock Challenges 5 to 8 by joining the CurioKids Club! (Click upgrade on the top right)");
        return;
      }
      setChallengeIdx(prev => prev + 1);
      resetAbacus();
    } else {
      alert("🎉 Incredible! You've mastered all the abacus challenges!");
      setChallengeIdx(0);
      resetAbacus();
    }
  };

  const activeChallenge = CHALLENGES[challengeIdx];

  return (
    <div className="abacus-container">
      <div className="abacus-header">
        <div>
          <h1 className="abacus-title"><span className="text-gradient-blue">AbacuStart Simulator</span> 🧮</h1>
          <p className="abacus-subtitle">Slide beads to count and solve super math puzzles!</p>
        </div>
        <div className="abacus-mode-selector">
          <button 
            className={`mode-tab ${activeTab === 'free' ? 'active' : ''}`}
            onClick={() => { setActiveTab('free'); resetAbacus(); }}
          >
            🎨 Free Play
          </button>
          <button 
            className={`mode-tab ${activeTab === 'challenges' ? 'active' : ''}`}
            onClick={() => { setActiveTab('challenges'); resetAbacus(); }}
          >
            🏆 Fun Challenges
            {activeChallenge.id >= 5 && !isPro && <span className="premium-star-badge">PRO</span>}
          </button>
        </div>
      </div>

      <div className="abacus-layout">
        {/* Left Side: The Interactive Soroban Abacus */}
        <div className="abacus-board-wrapper">
          {/* Digital Indicator Display */}
          <div className="digital-display-panel">
            <div className="digital-label">CURRENT NUMBER</div>
            <div className="digital-value animate-bounce-slow">{currentValue}</div>
          </div>

          <div className="abacus-board">
            {/* Wooden Frame Outer */}
            <div className="abacus-frame">
              <div className="abacus-corner top-left"></div>
              <div className="abacus-corner top-right"></div>
              <div className="abacus-corner bottom-left"></div>
              <div className="abacus-corner bottom-right"></div>
              
              {/* Columns Header (Place Values) */}
              <div className="abacus-headers">
                <span className="col-header">1,000s</span>
                <span className="col-header">100s</span>
                <span className="col-header">10s</span>
                <span className="col-header">1s</span>
              </div>

              {/* The rods and beads */}
              <div className="abacus-interior">
                {Object.keys(abacusState).map((colName) => {
                  const col = abacusState[colName];
                  return (
                    <div className="abacus-column" key={colName}>
                      {/* Metal Rod background */}
                      <div className="metal-rod"></div>

                      {/* Upper Deck (Above beam): 1 bead representing 5 */}
                      <div className="upper-deck">
                        <div 
                          className={`bead upper-bead ${col.upper ? 'active' : ''}`}
                          onClick={() => toggleUpperBead(colName)}
                        >
                          <div className="bead-highlight"></div>
                        </div>
                      </div>

                      {/* Horizontal Beam Separator */}
                      <div className="separator-beam">
                        <div className="beam-dot"></div>
                      </div>

                      {/* Lower Deck (Below beam): 4 beads representing 1 each */}
                      <div className="lower-deck">
                        {[1, 2, 3, 4].map((beadNum) => {
                          const isSlidUp = col.lower >= beadNum;
                          return (
                            <div 
                              key={beadNum}
                              className={`bead lower-bead bead-${beadNum} ${isSlidUp ? 'active' : ''}`}
                              style={{
                                transform: isSlidUp 
                                  ? `translateY(-${(4 - beadNum) * 5 + 45}px)` 
                                  : `translateY(0px)`
                              }}
                              onClick={() => setLowerBeads(colName, beadNum)}
                            >
                              <div className="bead-highlight"></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <button className="btn-reset-abacus" onClick={resetAbacus}>
            <RotateCcw size={18} /> Clear Board
          </button>
        </div>

        {/* Right Side: Lessons & Challenge Instructions */}
        <div className="abacus-sidebar">
          {activeTab === 'free' ? (
            <div className="card-premium sidebar-card">
              <div className="sidebar-card-header pink-accent">
                <Sparkles size={24} className="sidebar-icon animate-float" />
                <h3>Let\'s Play & Learn!</h3>
              </div>
              <div className="sidebar-card-content">
                <p>Welcome to the digital **Soroban Abacus**! Here is how it works:</p>
                <ul className="abacus-instructions-list">
                  <li>
                    <span className="bullet red">🔴</span>
                    <strong>Place Values</strong>: The columns from right to left represent <strong>Ones</strong>, <strong>Tens</strong>, <strong>Hundreds</strong>, and <strong>Thousands</strong>.
                  </li>
                  <li>
                    <span className="bullet blue">🔵</span>
                    <strong>Upper Bead (Heaven)</strong>: Worth <strong>5</strong>! Slide it down to the beam to add 5.
                  </li>
                  <li>
                    <span className="bullet yellow">🟡</span>
                    <strong>Lower Beads (Earth)</strong>: Worth <strong>1</strong> each! Slide them up to the beam to count 1, 2, 3, and 4.
                  </li>
                  <li>
                    <span className="bullet purple">🟣</span>
                    Try creating <strong>7</strong>: Slide down the upper bead (5) and slide up 2 lower beads (2) on the Ones column!
                  </li>
                </ul>
                <div className="fun-tip-box">
                  💡 <strong>Did you know?</strong> An abacus lets you calculate math problems faster than a calculator once you practice!
                </div>
              </div>
            </div>
          ) : (
            <div className="card-premium sidebar-card challenge-mode-card">
              {/* Challenge Lock Overlay */}
              {activeChallenge.id >= 5 && !isPro && (
                <div className="premium-lock-overlay">
                  <div className="lock-box">
                    <span className="lock-icon">🔒</span>
                    <h3>CurioKids Club Exclusive</h3>
                    <p>Unlock challenges 5 through 8, advanced arithmetic lessons, and gain full parent dashboard insights!</p>
                    <button 
                      className="btn-bouncy pink animate-pulse"
                      onClick={() => window.location.hash = '#paywall'} // Navigation trigger handled by parent
                    >
                      🚀 Join Pro Club
                    </button>
                  </div>
                </div>
              )}

              <div className="sidebar-card-header purple-accent">
                <Trophy size={24} className="sidebar-icon trophy-icon" />
                <h3>Challenge #{activeChallenge.id} of {CHALLENGES.length}</h3>
              </div>
              
              <div className="sidebar-card-content">
                <h4 className="challenge-title">{activeChallenge.title}</h4>
                <p className="challenge-desc">{activeChallenge.desc}</p>
                
                {activeChallenge.type === 'math' && (
                  <div className="math-query-badge">
                    {activeChallenge.query}
                  </div>
                )}

                {/* Progress Indicators */}
                <div className="challenge-status-indicator">
                  {challengeCompleted ? (
                    <div className="success-banner animate-bounce-slow">
                      <CheckCircle2 size={24} color="#8e44ad" />
                      <div>
                        <strong>Awesome Job! +25 XP</strong>
                        <p>You matched the number perfectly!</p>
                      </div>
                    </div>
                  ) : (
                    <div className="pending-banner">
                      <span className="spinner-dots"></span>
                      <span>Waiting for the correct bead combination...</span>
                    </div>
                  )}
                </div>

                <div className="sidebar-actions">
                  <button 
                    className="btn-hint"
                    onClick={() => setHintVisible(p => !p)}
                  >
                    <HelpCircle size={18} /> {hintVisible ? "Hide Hint" : "Need a Hint?"}
                  </button>

                  {challengeCompleted && (
                    <button 
                      className="btn-bouncy green btn-next-challenge"
                      onClick={handleNextChallenge}
                    >
                      Next Challenge <ArrowRight size={18} />
                    </button>
                  )}
                </div>

                {hintVisible && (
                  <div className="hint-reveal-box animate-float">
                    🔑 <strong>Hint:</strong> {
                      activeChallenge.id === 1 && "On the far right column, click the third bead from the bottom to slide three beads up."
                    }
                    {
                      activeChallenge.id === 2 && "On the far right column, click the lone bead at the very top to slide it down to the center beam."
                    }
                    {
                      activeChallenge.id === 3 && "Slide the upper bead down (5) and slide 3 lower beads up (3). Active value on Ones column will equal 8!"
                    }
                    {
                      activeChallenge.id === 4 && "Look at the TENS column (second from the right). Slide up 2 lower beads so they touch the beam."
                    }
                    {
                      activeChallenge.id === 5 && "Set 50 by sliding down TENS upper bead. Set 7 by sliding down ONES upper bead and sliding up 2 ONES lower beads."
                    }
                    {
                      activeChallenge.id >= 6 && `Make the target number: ${activeChallenge.target} on the abacus board.`
                    }
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
