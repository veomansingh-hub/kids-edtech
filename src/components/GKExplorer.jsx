import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Heart, Volume2, HelpCircle, Check, X, Lock, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import './GKExplorer.css';

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

// Bilingual Categories data structure
const GK_CATEGORIES = [
  {
    id: 'animals',
    title: '🦁 Nature & Animals',
    title_hi: '🦁 प्रकृति और जानवर',
    desc: 'Explore the amazing creatures on land and ocean!',
    desc_hi: 'धरती और महासागरों के अद्भुत जीवों के बारे में जानें!',
    premium: false,
    color: 'pink',
    flashcards: [
      { 
        q: "Which animal is the largest on earth?", 
        q_hi: "धरती पर सबसे बड़ा जानवर कौन सा है?",
        a: "The Blue Whale! Its tongue alone weighs as much as an entire elephant!", 
        a_hi: "नीली व्हेल! अकेले इसकी जीभ का वजन एक पूरे हाथी के बराबर होता है!",
        icon: "🐳" 
      },
      { 
        q: "Which land mammal runs the absolute fastest?", 
        q_hi: "धरती का कौन सा स्तनधारी सबसे तेज़ दौड़ता है?",
        a: "The Cheetah! It can go from 0 to 60 miles per hour in just 3 seconds!", 
        a_hi: "चीता! यह मात्र 3 सेकंड में 0 से 60 मील प्रति घंटे की रफ्तार पकड़ सकता है!",
        icon: "🐆" 
      },
      { 
        q: "Which birds can fly backwards?", 
        q_hi: "कौन सा पक्षी पीछे की ओर उड़ सकता है?",
        a: "Hummingbirds! They can also hover in mid-air by flapping wings up to 80 times per second!", 
        a_hi: "हमिंगबर्ड! वे प्रति सेकंड 80 बार पंख फड़फड़ाकर हवा में भी मंडरा सकते हैं!",
        icon: "🐦" 
      },
      { 
        q: "Which mammal sleeps standing up?", 
        q_hi: "कौन सा स्तनधारी खड़े होकर सोता है?",
        a: "Horses and Zebras! They have a locking mechanism in their legs so they don't fall over!", 
        a_hi: "घोड़े और ज़ेबरा! उनके पैरों में एक खास लॉकिंग सिस्टम होता है जिससे वे गिरते नहीं हैं!",
        icon: "🐎" 
      }
    ],
    questions: [
      { 
        q: "How many legs does an octopus have?", 
        q_hi: "एक ऑक्टोपस के कितने पैर होते हैं?",
        options: ["6 legs", "8 legs", "10 legs", "12 legs"], 
        options_hi: ["6 पैर", "8 पैर", "10 पैर", "12 पैर"], 
        correct: 1, 
        explanation: "Octopuses have 8 arms, which are lined with sensitive suction cups!",
        explanation_hi: "ऑक्टोपस के पास 8 भुजाएं होती हैं, जिन पर संवेदनशील सक्शन कप होते हैं!"
      },
      { 
        q: "What is the only mammal that can fly?", 
        q_hi: "उड़ने वाला एकमात्र स्तनधारी कौन सा है?",
        options: ["Flying Squirrel", "Bat", "Eagle", "Pigeon"], 
        options_hi: ["उड़ने वाली गिलहरी", "चमगादड़", "चील", "कबूतर"], 
        correct: 1, 
        explanation: "Bats are the only mammals that are capable of true, sustained flight!",
        explanation_hi: "चमगादड़ ही एकमात्र ऐसे स्तनधारी हैं जो वास्तव में उड़ने में सक्षम हैं!"
      },
      { 
        q: "Which animal sleeps standing up?", 
        q_hi: "कौन सा जानवर खड़े होकर सोता है?",
        options: ["Cat", "Dog", "Lion", "Horse"], 
        options_hi: ["बिल्ली", "कुत्ता", "शेर", "घोड़ा"], 
        correct: 3, 
        explanation: "Horses have special locked-leg joints to sleep safely standing up!",
        explanation_hi: "खड़े होकर सुरक्षित सोने के लिए घोड़ों के पैरों के जोड़ों में विशेष लॉक होते हैं!"
      },
      { 
        q: "Which bird can fly backwards?", 
        q_hi: "कौन सा पक्षी पीछे की ओर उड़ सकता है?",
        options: ["Hummingbird", "Parrot", "Owl", "Penguin"], 
        options_hi: ["हमिंगबर्ड", "तोता", "उल्लू", "पेंगुइन"], 
        correct: 0, 
        explanation: "Hummingbirds can fly forward, backward, sideways, and hover!",
        explanation_hi: "हमिंगबर्ड आगे, पीछे, अगल-बगल उड़ सकते हैं और हवा में तैर सकते हैं!"
      }
    ]
  },
  {
    id: 'space',
    title: '🚀 Space & Planets',
    title_hi: '🚀 अंतरिक्ष और ग्रह',
    desc: 'Take a trip to our solar system and the distant stars!',
    desc_hi: 'हमारे सौर मंडल और दूर के तारों की यात्रा करें!',
    premium: true, 
    color: 'purple',
    flashcards: [
      { 
        q: "Which planet is closest to the Sun?", 
        q_hi: "सूर्य के सबसे निकट का ग्रह कौन सा है?",
        a: "Mercury! Even though it is closest, Venus is actually the hottest planet!", 
        a_hi: "बुध! भले ही यह सबसे करीब है, लेकिन शुक्र वास्तव में सबसे गर्म ग्रह है!",
        icon: "🪐" 
      },
      { 
        q: "Which planet has massive giant rings around it?", 
        q_hi: "किस ग्रह के चारों ओर विशाल छल्ले हैं?",
        a: "Saturn! The rings are made of billions of chunks of ice, rocks, and dust!", 
        a_hi: "शनि! छल्ले अरबों बर्फ, चट्टानों और धूल के टुकड़ों से बने हैं!",
        icon: "🪐" 
      }
    ],
    questions: [
      { 
        q: "Which planet is known as the Red Planet?", 
        q_hi: "किस ग्रह को लाल ग्रह के नाम से जाना जाता है?",
        options: ["Venus", "Mars", "Jupiter", "Neptune"], 
        options_hi: ["शुक्र", "मंगल", "बृहस्पति", "वरुण"], 
        correct: 1, 
        explanation: "Mars is reddish because its dust has lots of iron oxide (rust)!",
        explanation_hi: "मंगल लाल है क्योंकि इसकी धूल में बहुत सारा आयरन ऑक्साइड (जंग) है!"
      },
      { 
        q: "What is the hottest planet in our solar system?", 
        q_hi: "हमारे सौर मंडल का सबसे गर्म ग्रह कौन सा है?",
        options: ["Mercury", "Venus", "Earth", "Saturn"], 
        options_hi: ["बुध", "शुक्र", "पृथ्वी", "शनि"], 
        correct: 1, 
        explanation: "Venus is the hottest because its thick atmosphere traps heat!",
        explanation_hi: "शुक्र सबसे गर्म है क्योंकि इसका घना वायुमंडल गर्मी को सोख लेता है!"
      }
    ]
  }
];

export default function GKExplorer({ addXp, isPro }) {
  const [activeCategory, setActiveCategory] = useState('animals');
  const [activeView, setActiveView] = useState('menu'); 
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  
  // Voice Synthesis settings
  const [speakLang, setSpeakLang] = useState('en'); // 'en' or 'hi'
  
  // Quiz states
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);

  const category = GK_CATEGORIES.find(c => c.id === activeCategory) || GK_CATEGORIES[0];

  // Stop active speech on component switch
  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis.cancel();
      } catch(e) {}
    };
  }, [activeView, quizIdx, flashcardIdx]);

  // Voice Speech Synthesizer API
  const handleReadAloud = (textToSpeak, customLang = speakLang) => {
    try {
      window.speechSynthesis.cancel(); // Stop prior audio
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = customLang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.85; // Slower cadence for kids
      utterance.pitch = 1.1; // Slightly cuter high-pitched profile
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log("Speech synthesis error or blocked");
    }
  };

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
      addXp(15 + (streak > 2 ? 5 : 0)); 
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
      addXp(50); 
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
      {/* Dynamic Bilingual Language Switch Header Tab */}
      <div className="language-selector-tab-header">
        <span className="lang-label-prefix">🗣️ Reader Language: </span>
        <button 
          className={`lang-pill-btn ${speakLang === 'en' ? 'active' : ''}`}
          onClick={() => { setSpeakLang('en'); try { window.speechSynthesis.cancel(); } catch(e){} }}
        >
          🇬🇧 English
        </button>
        <button 
          className={`lang-pill-btn ${speakLang === 'hi' ? 'active' : ''}`}
          onClick={() => { setSpeakLang('hi'); try { window.speechSynthesis.cancel(); } catch(e){} }}
        >
          🇮🇳 हिंदी (Hindi)
        </button>
      </div>

      {activeView === 'menu' && (
        <div className="gk-header">
          <h1 className="gk-title">
            <span className="text-gradient-purple">
              {speakLang === 'hi' ? "जीके ब्रायनी एक्सप्लोरर" : "GK Brainy Explorer"}
            </span> 🧠
          </h1>
          <p className="gk-subtitle">
            {speakLang === 'hi' 
              ? "मज़ेदार इंटरैक्टिव क्विज़ और गेम के साथ अपने ज्ञान को बढ़ाएं!" 
              : "Level up your General Knowledge with fun interactive trivia and games!"}
          </p>
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
                <div className="gk-cat-icon">{cat.id === 'animals' ? '🦁' : '🚀'}</div>
                <h3>{speakLang === 'hi' ? cat.title_hi : cat.title}</h3>
                <p>{speakLang === 'hi' ? cat.desc_hi : cat.desc}</p>
                
                <div className="gk-card-actions">
                  <button 
                    className="btn-bouncy blue btn-gk"
                    onClick={() => startFlashcards(cat.id)}
                  >
                    {speakLang === 'hi' ? "📖 फ्लैशकार्ड्स" : "📖 Learn Cards"}
                  </button>
                  <button 
                    className={`btn-bouncy ${cat.color} btn-gk`}
                    onClick={() => startQuiz(cat.id)}
                  >
                    {isLocked 
                      ? (speakLang === 'hi' ? "🔒 क्विज़ खेलें" : "🔒 Play Quiz") 
                      : (speakLang === 'hi' ? "🏆 क्विज़ खेलें" : "🏆 Play Quiz")}
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
            {speakLang === 'hi' ? "← श्रेणियों पर वापस जाएं" : "← Back to Categories"}
          </button>
          
          <div className="flashcard-arena">
            <div className="flashcard-counter">
              {speakLang === 'hi' 
                ? `कार्ड ${flashcardIdx + 1} का ${category.flashcards.length}`
                : `Card ${flashcardIdx + 1} of ${category.flashcards.length}`}
            </div>

            <div 
              className={`flashcard-wrapper ${cardFlipped ? 'flipped' : ''}`}
              onClick={() => setCardFlipped(!cardFlipped)}
            >
              {/* Card Front */}
              <div className="flashcard-face flashcard-front">
                <div className="card-deco-stars">✨ ⭐</div>
                <div className="flashcard-icon-big">{category.flashcards[flashcardIdx].icon}</div>
                <h2 className="flashcard-question-text">
                  {speakLang === 'hi' ? category.flashcards[flashcardIdx].q_hi : category.flashcards[flashcardIdx].q}
                </h2>
                
                {/* Speaker reading button */}
                <button 
                  className="btn-audio-speak-round"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadAloud(
                      speakLang === 'hi' 
                        ? category.flashcards[flashcardIdx].q_hi 
                        : category.flashcards[flashcardIdx].q
                    );
                  }}
                >
                  <Volume2 size={16} />
                </button>

                <div className="click-hint-badge">
                  {speakLang === 'hi' ? "👆 जवाब देखने के लिए टैप करें!" : "👆 Tap to flip and find out!"}
                </div>
              </div>
              
              {/* Card Back */}
              <div className="flashcard-face flashcard-back">
                <div className="card-deco-stars">💡 🎉</div>
                <h3>{speakLang === 'hi' ? "रोचक तथ्य:" : "Interesting Fact:"}</h3>
                <p className="flashcard-answer-text">
                  {speakLang === 'hi' ? category.flashcards[flashcardIdx].a_hi : category.flashcards[flashcardIdx].a}
                </p>

                {/* Speaker back reading button */}
                <button 
                  className="btn-audio-speak-round back-audio"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadAloud(
                      speakLang === 'hi' 
                        ? category.flashcards[flashcardIdx].a_hi 
                        : category.flashcards[flashcardIdx].a
                    );
                  }}
                >
                  <Volume2 size={16} />
                </button>

                <div className="click-hint-badge">
                  {speakLang === 'hi' ? "🔄 पीछे वापस जाने के लिए टैप करें" : "🔄 Tap to flip back"}
                </div>
              </div>
            </div>

            <div className="flashcard-navigation">
              <button 
                className="btn-bouncy blue"
                disabled={flashcardIdx === 0}
                onClick={() => { setFlashcardIdx(i => i - 1); setCardFlipped(false); }}
              >
                {speakLang === 'hi' ? "पीछे" : "Previous"}
              </button>
              
              {flashcardIdx < category.flashcards.length - 1 ? (
                <button 
                  className="btn-bouncy purple"
                  onClick={() => { setFlashcardIdx(i => i + 1); setCardFlipped(false); }}
                >
                  {speakLang === 'hi' ? "अगला तथ्य 📖" : "Next Fact 📖"}
                </button>
              ) : (
                <button 
                  className="btn-bouncy green animate-pulse"
                  onClick={() => startQuiz(category.id)}
                >
                  {speakLang === 'hi' ? "🎯 चलो क्विज़ खेलें!" : "🎯 Let's Play the Quiz!"}
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
              {speakLang === 'hi' ? "🚪 बाहर" : "🚪 Exit"}
            </button>
            <div className="quiz-category-badge">
              {speakLang === 'hi' ? category.title_hi : category.title}
            </div>
            
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
              
              {streak >= 2 && (
                <div className="streak-indicator animate-float">
                  <Flame size={20} fill="#ff7f50" color="#ff4757" />
                  <span>{streak}x {speakLang === 'hi' ? "लगातार!" : "Streak!"}</span>
                </div>
              )}

              <div className="xp-score-pill">
                ⭐ {score} Pts
              </div>
            </div>
          </div>

          {/* Quiz Interface Container */}
          {!quizOver && !quizSuccess ? (
            <div className="card-premium quiz-card animate-float">
              <div className="quiz-progress-bar-container">
                <div 
                  className="quiz-progress-bar"
                  style={{ width: `${((quizIdx + (isAnswered ? 1 : 0)) / category.questions.length) * 100}%` }}
                ></div>
              </div>

              <div className="quiz-question-header">
                <span className="question-number">
                  {speakLang === 'hi' 
                    ? `प्रश्न ${quizIdx + 1} का ${category.questions.length}` 
                    : `Question ${quizIdx + 1} of ${category.questions.length}`}
                </span>
                
                {/* Question Row with Speaker reader */}
                <div className="quiz-question-voice-row">
                  <h2>
                    {speakLang === 'hi' ? category.questions[quizIdx].q_hi : category.questions[quizIdx].q}
                  </h2>
                  <button 
                    className="btn-audio-speak-round inline-speak"
                    onClick={() => {
                      handleReadAloud(
                        speakLang === 'hi' 
                          ? category.questions[quizIdx].q_hi 
                          : category.questions[quizIdx].q
                      );
                    }}
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
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

                  const optionText = speakLang === 'hi' 
                    ? category.questions[quizIdx].options_hi[optIdx] 
                    : option;

                  return (
                    <button 
                      key={optIdx}
                      className={`quiz-option-btn ${optClass}`}
                      disabled={isAnswered}
                      onClick={() => handleAnswerClick(optIdx)}
                    >
                      <span className="option-index">{['A', 'B', 'C', 'D'][optIdx]}</span>
                      <span className="option-text">{optionText}</span>
                      {isAnswered && optIdx === category.questions[quizIdx].correct && <Check size={20} className="status-indicator-icon" />}
                      {isAnswered && selectedOption === optIdx && optIdx !== category.questions[quizIdx].correct && <X size={20} className="status-indicator-icon" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {isAnswered && (
                <div className={`explanation-box animate-float ${selectedOption === category.questions[quizIdx].correct ? 'correct' : 'wrong'}`}>
                  💡 <strong>{speakLang === 'hi' ? "क्या आप जानते थे?" : "Did You Know?"}</strong>{' '}
                  {speakLang === 'hi' ? category.questions[quizIdx].explanation_hi : category.questions[quizIdx].explanation}
                  
                  {/* Speaker reading explanation */}
                  <button 
                    className="btn-speak-explanation-inline"
                    onClick={() => {
                      handleReadAloud(
                        speakLang === 'hi' 
                          ? category.questions[quizIdx].explanation_hi 
                          : category.questions[quizIdx].explanation
                      );
                    }}
                  >
                    🔊 {speakLang === 'hi' ? "बोलकर बताएं" : "Read Aloud"}
                  </button>
                </div>
              )}

              {isAnswered && (
                <button 
                  className="btn-bouncy purple btn-quiz-next animate-pulse"
                  onClick={handleNextQuestion}
                >
                  {quizIdx < category.questions.length - 1 
                    ? (speakLang === 'hi' ? "अगला प्रश्न" : "Next Question") 
                    : (speakLang === 'hi' ? "परिणाम देखें" : "View Results")}
                </button>
              )}
            </div>
          ) : quizOver ? (
            <div className="card-premium quiz-result-card fail-state">
              <div className="result-icon-face">😢</div>
              <h2>{speakLang === 'hi' ? "ओह नहीं! सारे दिल खत्म हो गए!" : "Oh No! Out of Lives!"}</h2>
              <p>
                {speakLang === 'hi' 
                  ? "आपने शानदार प्रयास किया, लेकिन सभी दिल खत्म हो गए। चलो फिर से कोशिश करें!"
                  : "You did a great job trying, but you ran out of hearts. Let's give it another shot!"}
              </p>
              
              <div className="score-summary-pill">
                {speakLang === 'hi' ? `आपका स्कोर: ${score} अंक` : `You Scored: ${score} Points`}
              </div>
              
              <button 
                className="btn-bouncy pink btn-retry-quiz"
                onClick={() => startQuiz(category.id)}
              >
                🔄 {speakLang === 'hi' ? "फिर से खेलें" : "Retry Quiz"}
              </button>
            </div>
          ) : (
            <div className="card-premium quiz-result-card success-state">
              <div className="result-icon-face">🏆</div>
              <h2>
                {speakLang === 'hi' ? "अद्भुत! क्विज़ पूरा हुआ!" : "Spectacular! Quiz Completed!"}
              </h2>
              <p>
                {speakLang === 'hi' 
                  ? "आप एक सच्चे जीके जीनियस हैं! आपने इस विषय में महारत हासिल कर ली!"
                  : "You are a true GK Genius! You mastered this entire topic!"}
              </p>
              
              <div className="stats-results-row">
                <div className="stat-result-box">
                  <span className="label">{speakLang === 'hi' ? "अर्जित अंक" : "Points Earned"}</span>
                  <span className="val">⭐ {score}</span>
                </div>
                <div className="stat-result-box">
                  <span className="label">{speakLang === 'hi' ? "प्राप्त एक्सपी" : "XP Gained"}</span>
                  <span className="val">🚀 +50 XP</span>
                </div>
                <div className="stat-result-box">
                  <span className="label">{speakLang === 'hi' ? "बचे हुए दिल" : "Remaining Lives"}</span>
                  <span className="val">💖 {lives}/3</span>
                </div>
              </div>
              
              <div className="reward-congrats-message">
                {speakLang === 'hi' 
                  ? "🎉 बधाई हो! लेवल पुरस्कार आपके एक्सप्लोरर डैशबोर्ड में जोड़ दिए गए हैं!"
                  : "🎉 Congratulations! Level rewards have been added to your explorer dashboard!"}
              </div>

              <div className="result-actions">
                <button 
                  className="btn-bouncy blue"
                  onClick={() => setActiveView('menu')}
                >
                  {speakLang === 'hi' ? "विषयों पर वापस जाएं" : "Back to Topics"}
                </button>
                <button 
                  className="btn-bouncy purple animate-pulse"
                  onClick={() => {
                    if (category.id === 'animals' && !isPro) {
                      window.location.hash = '#paywall';
                    } else if (category.id === 'animals') {
                      startQuiz('space');
                    } else {
                      setActiveView('menu');
                    }
                  }}
                >
                  {category.id === 'animals' && !isPro 
                    ? (speakLang === 'hi' ? "🚀 स्पेस क्विज़ खोलें" : "🚀 Unlock Space Quiz") 
                    : (speakLang === 'hi' ? "अगला विषय →" : "Next Topic →")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
