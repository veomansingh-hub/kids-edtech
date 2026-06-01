import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Heart, Volume2, HelpCircle, Check, X, Lock, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import './GKExplorer.css';

// Web audio synthezier for fun gamified sound effects
const playSoundEffect = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (e) {}
};

const GK_CATEGORIES = [
  {
    id: 'animals',
    title: '🦁 Nature & Animals',
    desc: 'Explore the amazing creatures on land and ocean!',
    premium: false,
    color: 'pink',
    flashcards: [
      { q: "Which animal is the largest on earth?", a: "The Blue Whale! Its tongue alone weighs as much as an entire elephant!", icon: "🐳" },
      { q: "Which land mammal runs the absolute fastest?", a: "The Cheetah! It can go from 0 to 60 miles per hour in just 3 seconds!", icon: "🐆" },
      { q: "Which birds can fly backwards?", a: "Hummingbirds! They can also hover in mid-air by flapping their wings up to 80 times per second!", icon: "🐦" },
      { q: "Which mammal sleeps standing up?", a: "Horses and Zebras! They have a special locking mechanism in their legs so they don't fall over!", icon: "🐎" }
    ],
    questions: [
      { q: "How many legs does an octopus have?", options: ["6 legs", "8 legs", "10 legs", "12 legs"], correct: 1, explanation: "Octopuses have 8 arms, which are lined with sensitive suction cups!" },
      { q: "What is the only mammal that can fly?", options: ["Flying Squirrel", "Bat", "Eagle", "Pigeon"], correct: 1, explanation: "Bats are the only mammals that are capable of true, sustained flight!" },
      { q: "Which animal sleeps standing up?", options: ["Cat", "Dog", "Lion", "Horse"], correct: 3, explanation: "Horses have a special locked-leg joints system to sleep safely standing up!" },
      { q: "Which bird can fly backwards?", options: ["Hummingbird", "Parrot", "Owl", "Penguin"], correct: 0, explanation: "Hummingbirds can fly forward, backward, sideways, and hover!" }
    ]
  },
  {
    id: 'space',
    title: '🚀 Space & Planets',
    desc: 'Take a trip to our solar system and the distant stars!',
    premium: true, // Preview available, quiz requires pro
    color: 'purple',
    flashcards: [
      { q: "Which planet is closest to the Sun?", a: "Mercury! Even though it is closest, Venus is actually the hottest planet due to thick clouds!", icon: "🪐" },
      { q: "Which planet has massive giant rings around it?", a: "Saturn! The rings are made of billions of chunks of ice, rocks, and dust!", icon: "🪐" },
      { q: "What is the Sun made of?", a: "It is a giant ball of burning hot gases, mostly Hydrogen and Helium!", icon: "☀️" },
      { q: "Why is Mars called the Red Planet?", a: "Because its surface is covered in iron oxide, which is basically rust!", icon: "🔴" }
    ],
    questions: [
      { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Neptune"], correct: 1, explanation: "Mars is reddish because its dust has lots of iron oxide (rust)!" },
      { q: "What is the hottest planet in our solar system?", options: ["Mercury", "Venus", "Earth", "Saturn"], correct: 1, explanation: "Venus is the hottest because its thick atmosphere traps heat like a greenhouse!" },
      { q: "Which is the largest planet in our solar system?", options: ["Earth", "Mars", "Jupiter", "Uranus"], correct: 2, explanation: "Jupiter is so huge that over 1,300 Earths could fit inside it!" },
      { q: "How long does it take for light from the Sun to reach Earth?", options: ["8 seconds", "8 minutes", "8 hours", "Immediate"], correct: 1, explanation: "Since the Sun is 93 million miles away, light takes about 8 minutes to travel here!" }
    ]
  },
  {
    id: 'geography',
    title: '🗺️ Earth & Geography',
    desc: 'Discover continents, massive mountains, and hidden rivers!',
    premium: true, // Fully locked
    color: 'blue',
    flashcards: [
      { q: "What is the tallest mountain above sea level?", a: "Mount Everest! It stands at 29,031 feet high in the Himalayas!", icon: "🏔️" },
      { q: "Which river is the longest in the world?", a: "The Nile River in Africa! It stretches over 4,130 miles!", icon: "🌊" },
      { q: "How many oceans are on Planet Earth?", a: "5 Oceans: Pacific, Atlantic, Indian, Southern, and Arctic oceans!", icon: "🌎" },
      { q: "Which is the largest hot desert in the world?", a: "The Sahara Desert! It covers almost the entire northern half of Africa!", icon: "🌵" }
    ],
    questions: [
      { q: "Which country is home to the Eiffel Tower?", options: ["Italy", "Germany", "France", "Spain"], correct: 2, explanation: "The Eiffel Tower is located in Paris, the capital city of France!" },
      { q: "Which is the largest continent on Earth?", options: ["North America", "Africa", "Europe", "Asia"], correct: 3, explanation: "Asia is the largest continent in both size and population!" },
      { q: "What is the capital of the United States?", options: ["New York", "Los Angeles", "Washington, D.C.", "Chicago"], correct: 2, explanation: "Washington, D.C. is the capital and where the President lives!" },
      { q: "Which ocean is the largest on Earth?", options: ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Arctic Ocean"], correct: 1, explanation: "The Pacific Ocean covers more than 30% of the Earth's surface!" }
    ]
  }
];

export default function GKExplorer({ addXp, isPro }) {
  const [activeCategory, setActiveCategory] = useState('animals');
  const [activeView, setActiveView] = useState('menu'); // 'menu', 'flashcards', 'quiz'
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  
  // Quiz states
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);

  const category = GK_CATEGORIES.find(c => c.id === activeCategory);

  const startQuiz = (catId) => {
    const targetCat = GK_CATEGORIES.find(c => c.id === catId);
    if (targetCat.premium && !isPro) {
      window.location.hash = '#paywall';
      return;
    }
    setActiveCategory(catId);
    setActiveView('quiz');
    setQuizIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setLives(3);
    setScore(0);
    setStreak(0);
    setQuizOver(false);
    setQuizSuccess(false);
  };

  const startFlashcards = (catId) => {
    setActiveCategory(catId);
    setActiveView('flashcards');
    setFlashcardIdx(0);
    setCardFlipped(false);
  };

  const handleAnswerClick = (optionIdx) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
    setIsAnswered(true);

    const activeQuestion = category.questions[quizIdx];
    if (optionIdx === activeQuestion.correct) {
      playSoundEffect('correct');
      setScore(s => s + 10);
      setStreak(st => st + 1);
      addXp(15 + (streak > 2 ? 5 : 0)); // XP and Streak bonus
    } else {
      playSoundEffect('wrong');
      setLives(l => {
        const remaining = l - 1;
        if (remaining <= 0) {
          setQuizOver(true);
        }
        return remaining;
      });
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (quizIdx < category.questions.length - 1) {
      setQuizIdx(idx => idx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizSuccess(true);
      playQuizEndConfetti();
      addXp(50); // Massive XP reward
    }
  };

  const playQuizEndConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="gk-container">
      {/* GK Header */}
      {activeView === 'menu' && (
        <div className="gk-header">
          <h1 className="gk-title"><span className="text-gradient-purple">GK Brainy Explorer</span> 🧠</h1>
          <p className="gk-subtitle">Level up your General Knowledge with fun interactive trivia and games!</p>
        </div>
      )}

      {/* VIEW: MAIN CATEGORY SELECTION */}
      {activeView === 'menu' && (
        <div className="gk-grid">
          {GK_CATEGORIES.map((cat) => {
            const isLocked = cat.premium && !isPro;
            return (
              <div 
                key={cat.id} 
                className={`card-premium gk-category-card ${cat.color} ${isLocked ? 'locked' : ''}`}
              >
                {isLocked && (
                  <div className="card-lock-badge">
                    <Lock size={16} /> Locked
                  </div>
                )}
                <div className="gk-cat-icon">{cat.id === 'animals' ? '🦁' : cat.id === 'space' ? '🚀' : '🗺️'}</div>
                <h3>{cat.title}</h3>
                <p>{cat.desc}</p>
                
                <div className="gk-card-actions">
                  <button 
                    className="btn-bouncy blue btn-gk"
                    onClick={() => startFlashcards(cat.id)}
                  >
                    📖 Learn Cards
                  </button>
                  <button 
                    className={`btn-bouncy ${cat.color} btn-gk`}
                    onClick={() => startQuiz(cat.id)}
                  >
                    {isLocked ? "🔒 Play Quiz" : "🏆 Play Quiz"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: INTERACTIVE FLASHCARDS */}
      {activeView === 'flashcards' && (
        <div className="gk-flashcards-pane">
          <button className="btn-back-menu" onClick={() => setActiveView('menu')}>
            ← Back to Categories
          </button>
          
          <div className="flashcard-arena">
            <div className="flashcard-counter">
              Card {flashcardIdx + 1} of {category.flashcards.length}
            </div>

            <div 
              className={`flashcard-wrapper ${cardFlipped ? 'flipped' : ''}`}
              onClick={() => setCardFlipped(!cardFlipped)}
            >
              <div className="flashcard-face flashcard-front">
                <div className="card-deco-stars">✨ ⭐</div>
                <div className="flashcard-icon-big">{category.flashcards[flashcardIdx].icon}</div>
                <h2 className="flashcard-question-text">{category.flashcards[flashcardIdx].q}</h2>
                <div className="click-hint-badge">👆 Tap to flip and find out!</div>
              </div>
              
              <div className="flashcard-face flashcard-back">
                <div className="card-deco-stars">💡 🎉</div>
                <h3>Interesting Fact:</h3>
                <p className="flashcard-answer-text">{category.flashcards[flashcardIdx].a}</p>
                <div className="click-hint-badge">🔄 Tap to flip back</div>
              </div>
            </div>

            <div className="flashcard-navigation">
              <button 
                className="btn-bouncy blue"
                disabled={flashcardIdx === 0}
                onClick={() => { setFlashcardIdx(i => i - 1); setCardFlipped(false); }}
              >
                Previous
              </button>
              
              {flashcardIdx < category.flashcards.length - 1 ? (
                <button 
                  className="btn-bouncy purple"
                  onClick={() => { setFlashcardIdx(i => i + 1); setCardFlipped(false); }}
                >
                  Next Fact 📖
                </button>
              ) : (
                <button 
                  className="btn-bouncy green animate-pulse"
                  onClick={() => startQuiz(category.id)}
                >
                  🎯 Let's Play the Quiz!
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: GAMIFIED QUIZ ARENA */}
      {activeView === 'quiz' && (
        <div className="gk-quiz-pane">
          {/* Quiz Top Bar */}
          <div className="quiz-top-bar">
            <button className="btn-exit-quiz" onClick={() => setActiveView('menu')}>
              🚪 Exit
            </button>
            <div className="quiz-category-badge">{category.title}</div>
            
            {/* Lives counter */}
            <div className="quiz-stats-group">
              <div className="lives-holder">
                {[1, 2, 3].map((heartIdx) => (
                  <Heart 
                    key={heartIdx} 
                    size={24} 
                    className={`heart-icon ${heartIdx <= lives ? 'alive' : 'dead'}`} 
                  />
                ))}
              </div>
              
              {/* Streak Tracker */}
              {streak >= 2 && (
                <div className="streak-indicator animate-float">
                  <Flame size={20} fill="#ff7f50" color="#ff4757" />
                  <span>{streak}x Streak!</span>
                </div>
              )}

              {/* XP score */}
              <div className="xp-score-pill">
                ⭐ {score} Pts
              </div>
            </div>
          </div>

          {/* Quiz Interface Container */}
          {!quizOver && !quizSuccess ? (
            <div className="card-premium quiz-card animate-float">
              {/* Progress Bar */}
              <div className="quiz-progress-bar-container">
                <div 
                  className="quiz-progress-bar"
                  style={{ width: `${((quizIdx + (isAnswered ? 1 : 0)) / category.questions.length) * 100}%` }}
                ></div>
              </div>

              <div className="quiz-question-header">
                <span className="question-number">Question {quizIdx + 1} of {category.questions.length}</span>
                <h2>{category.questions[quizIdx].q}</h2>
              </div>

              <div className="quiz-options-list">
                {category.questions[quizIdx].options.map((option, optIdx) => {
                  let optClass = '';
                  if (isAnswered) {
                    if (optIdx === category.questions[quizIdx].correct) {
                      optClass = 'correct';
                    } else if (selectedOption === optIdx) {
                      optClass = 'wrong';
                    } else {
                      optClass = 'disabled';
                    }
                  } else if (selectedOption === optIdx) {
                    optClass = 'selected';
                  }

                  return (
                    <button 
                      key={optIdx}
                      className={`quiz-option-btn ${optClass}`}
                      disabled={isAnswered}
                      onClick={() => handleAnswerClick(optIdx)}
                    >
                      <span className="option-index">{['A', 'B', 'C', 'D'][optIdx]}</span>
                      <span className="option-text">{option}</span>
                      {isAnswered && optIdx === category.questions[quizIdx].correct && <Check size={20} className="status-indicator-icon" />}
                      {isAnswered && selectedOption === optIdx && optIdx !== category.questions[quizIdx].correct && <X size={20} className="status-indicator-icon" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {isAnswered && (
                <div className={`explanation-box animate-float ${selectedOption === category.questions[quizIdx].correct ? 'correct' : 'wrong'}`}>
                  💡 <strong>Did You Know?</strong> {category.questions[quizIdx].explanation}
                </div>
              )}

              {/* Bottom Actions */}
              {isAnswered && (
                <button 
                  className="btn-bouncy purple btn-quiz-next animate-pulse"
                  onClick={handleNextQuestion}
                >
                  {quizIdx < category.questions.length - 1 ? "Next Question" : "View Results"}
                </button>
              )}
            </div>
          ) : quizOver ? (
            /* QUIZ STATE: GAME OVER */
            <div className="card-premium quiz-result-card fail-state">
              <div className="result-icon-face">😢</div>
              <h2>Oh No! Out of Lives!</h2>
              <p>You did a great job trying, but you ran out of hearts. Let's give it another shot!</p>
              
              <div className="score-summary-pill">
                You Scored: {score} Points
              </div>
              
              <button 
                className="btn-bouncy pink btn-retry-quiz"
                onClick={() => startQuiz(category.id)}
              >
                🔄 Retry Quiz
              </button>
            </div>
          ) : (
            /* QUIZ STATE: SUCCESS EXCELLENT */
            <div className="card-premium quiz-result-card success-state">
              <div className="result-icon-face">🏆</div>
              <h2>Spectacular! Quiz Completed!</h2>
              <p>You are a true **GK Genius**! You mastered this entire topic!</p>
              
              <div className="stats-results-row">
                <div className="stat-result-box">
                  <span className="label">Points Earned</span>
                  <span className="val">⭐ {score}</span>
                </div>
                <div className="stat-result-box">
                  <span className="label">XP Gained</span>
                  <span className="val">🚀 +50 XP</span>
                </div>
                <div className="stat-result-box">
                  <span className="label">Remaining Lives</span>
                  <span className="val">💖 {lives}/3</span>
                </div>
              </div>
              
              <div className="reward-congrats-message">
                🎉 Congratulations! Level rewards have been added to your explorer dashboard!
              </div>

              <div className="result-actions">
                <button 
                  className="btn-bouncy blue"
                  onClick={() => setActiveView('menu')}
                >
                  Back to Topics
                </button>
                <button 
                  className="btn-bouncy purple animate-pulse"
                  onClick={() => {
                    if (category.id === 'animals' && !isPro) {
                      window.location.hash = '#paywall';
                    } else if (category.id === 'animals') {
                      startQuiz('space');
                    } else if (category.id === 'space') {
                      startQuiz('geography');
                    } else {
                      setActiveView('menu');
                    }
                  }}
                >
                  {category.id === 'animals' && !isPro ? "🚀 Unlock Space Quiz" : "Next Topic →"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
