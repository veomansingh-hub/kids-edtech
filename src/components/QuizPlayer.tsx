import React, { useState, useEffect } from 'react';
import { 
  QUESTIONS_L1, 
  QUESTIONS_L2, 
  QUESTIONS_L3, 
  QUESTIONS_L4, 
  QUESTIONS_L5, 
  Question 
} from '../data/gkLevels';
import { 
  Trophy, 
  Timer, 
  HelpCircle, 
  ArrowRight, 
  Award, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizPlayerProps {
  levelId: string;
  username: string;
  onQuizFinished: (score: number, xpEarned: number) => void;
  onBackToDashboard: () => void;
  lang: "en" | "hi";
}

export default function QuizPlayer({
  levelId,
  username,
  onQuizFinished,
  onBackToDashboard,
  lang
}: QuizPlayerProps) {
  // Modes: 'setup' | 'playing' | 'result'
  const [quizState, setQuizState] = useState<'setup' | 'playing' | 'result'>('setup');
  const [quizMode, setQuizMode] = useState<'practice' | 'challenge' | 'revision'>('practice');
  
  // Question pools
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  
  // Interaction states
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Timer for Challenge Mode
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(true);

  // Score states
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [wrongQuestionPool, setWrongQuestionPool] = useState<Question[]>([]);

  // Sound chimes
  const playFeedbackSound = (correct: boolean) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      if (correct) {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else {
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      }
    } catch(e){}
  };

  // Build the question subset
  const startQuiz = () => {
    let pool: Question[] = [];
    switch (levelId) {
      case "1": pool = QUESTIONS_L1; break;
      case "2": pool = QUESTIONS_L2; break;
      case "3": pool = QUESTIONS_L3; break;
      case "4": pool = QUESTIONS_L4; break;
      case "5": pool = QUESTIONS_L5; break;
    }

    if (quizMode === 'revision') {
      // Pick questions the child answered incorrectly in past sessions
      const savedWrongs = localStorage.getItem(`curiokids_wrongs_${username}_${levelId}`);
      const wrongIds: string[] = savedWrongs ? JSON.parse(savedWrongs) : [];
      pool = pool.filter(q => wrongIds.includes(q.id));
      
      // If revision pool is empty, fallback to practice
      if (pool.length === 0) {
        switch (levelId) {
          case "1": pool = QUESTIONS_L1; break;
          case "2": pool = QUESTIONS_L2; break;
          case "3": pool = QUESTIONS_L3; break;
          case "4": pool = QUESTIONS_L4; break;
          case "5": pool = QUESTIONS_L5; break;
        }
      }
    }

    // Shuffle and pick 10 questions max
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, 10);
    
    setSelectedQuestions(chosen);
    setCurrentIndex(0);
    setScore(0);
    setQuizState('playing');
    setupQuestion(chosen[0]);
  };

  const setupQuestion = (q: Question) => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowHint(false);
    
    // Shuffle options
    const shuf = [...q.options].sort(() => Math.random() - 0.5);
    setShuffledOptions(shuf);

    // Reset challenge mode timer
    if (quizMode === 'challenge' && timerEnabled) {
      setTimeLeft(15);
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  };

  // Challenge timer ticks
  useEffect(() => {
    if (!timerActive || quizState !== 'playing') return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      handleTimeout();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, quizState]);

  const handleTimeout = () => {
    setSelectedAnswer('');
    setIsAnswered(true);
    playFeedbackSound(false);

    // Add current question to child wrong list
    const currentQ = selectedQuestions[currentIndex];
    saveWrongQuestionId(currentQ.id);
  };

  const saveWrongQuestionId = (id: string) => {
    const key = `curiokids_wrongs_${username}_${levelId}`;
    const saved = localStorage.getItem(key);
    const ids: string[] = saved ? JSON.parse(saved) : [];
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(key, JSON.stringify(ids));
    }
  };

  const removeWrongQuestionId = (id: string) => {
    const key = `curiokids_wrongs_${username}_${levelId}`;
    const saved = localStorage.getItem(key);
    const ids: string[] = saved ? JSON.parse(saved) : [];
    const filtered = ids.filter(x => x !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
  };

  const handleAnswerClick = (option: string) => {
    if (isAnswered) return;
    setTimerActive(false);
    setSelectedAnswer(option);
    setIsAnswered(true);

    const currentQ = selectedQuestions[currentIndex];
    const correct = option === currentQ.answer;
    playFeedbackSound(correct);

    if (correct) {
      setScore(prev => prev + 1);
      removeWrongQuestionId(currentQ.id);
      // Spark confetti for immediate reward
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
    } else {
      saveWrongQuestionId(currentQ.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < selectedQuestions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setupQuestion(selectedQuestions[nextIdx]);
    } else {
      // Calculate XP and switch to result screen
      // Base XP: 10 XP per correct answer
      // Challenge Mode bonus: +15 XP
      const base = score * 10;
      const bonus = quizMode === 'challenge' ? 15 : 0;
      const totalXp = base + bonus;
      
      setXpEarned(totalXp);
      setQuizState('result');

      // Unconditional star/celebration
      if (score >= 5) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
      }
    }
  };

  const labels = {
    en: {
      selectMode: "Choose Quiz Mode",
      practice: "Practice Mode",
      practiceDesc: "Relaxed! No timers or stress.",
      challenge: "Challenge Mode",
      challengeDesc: "15 seconds per question! Earn +15 Bonus XP!",
      revision: "Revision Mode",
      revisionDesc: "Play questions you got wrong last time.",
      startBtn: "Let's Play! 🎲",
      questionProgress: "Question",
      timer: "Timer",
      hint: "Hint",
      correct: "Awesome! Correct!",
      wrong: "Oops! Incorrect.",
      timeout: "Time out!",
      next: "Next Question",
      finished: "Quiz Completed!",
      xp: "XP Earned",
      stars: "Stars Earned",
      backToMap: "Back to Dashboard",
      retry: "Retry Quiz",
      practiceNoTimer: "Practice Mode disables the ticking timer.",
      explanation: "Why this is correct:"
    },
    hi: {
      selectMode: "क्विज़ मोड चुनें",
      practice: "अभ्यास मोड (Practice)",
      practiceDesc: "शांत! कोई टाइमर या तनाव नहीं।",
      challenge: "चुनौती मोड (Challenge)",
      challengeDesc: "प्रति प्रश्न 15 सेकंड! +15 बोनस XP कमाएं!",
      revision: "संशोधन मोड (Revision)",
      revisionDesc: "वही प्रश्न दोहराएं जो पिछली बार गलत हुए थे।",
      startBtn: "क्विज़ खेलें 🎲",
      questionProgress: "प्रश्न",
      timer: "समय",
      hint: "संकेत (Hint)",
      correct: "सही जवाब! 🌟",
      wrong: "ओह! गलत जवाब।",
      timeout: "समय समाप्त!",
      next: "आगे बढ़ें",
      finished: "क्विज़ पूरा हुआ!",
      xp: "अर्जित एक्सपी",
      stars: "अर्जित सितारे",
      backToMap: "पीछे",
      retry: "फिर कोशिश करें",
      practiceNoTimer: "अभ्यास मोड में टाइमर बंद रहता है।",
      explanation: "व्याख्या:"
    }
  };

  const getStars = () => {
    if (score >= 9) return 3;
    if (score >= 7) return 2;
    if (score >= 5) return 1;
    return 0;
  };

  const starsCount = getStars();

  // Screen 1: SETUP/MODE SELECTOR
  if (quizState === 'setup') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white border-4 border-dashed border-primary-pink/30 rounded-3xl p-6 sm:p-8 shadow-md text-center">
          <Trophy size={48} className="mx-auto text-primary-yellow fill-primary-yellow mb-4 animate-bounce" />
          <h2 className="font-kid text-2xl text-slate-800 mb-6">{labels[lang].selectMode}</h2>

          <div className="flex flex-col gap-4 mb-8">
            <button
              onClick={() => setQuizMode('practice')}
              className={`p-4 rounded-2xl border-2 text-left transition ${
                quizMode === 'practice' 
                  ? 'border-primary-pink bg-pink-50/40' 
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <h4 className="font-kid text-lg text-slate-800">{labels[lang].practice}</h4>
              <p className="text-xs text-slate-500 font-body mt-1">{labels[lang].practiceDesc}</p>
            </button>

            <button
              onClick={() => setQuizMode('challenge')}
              className={`p-4 rounded-2xl border-2 text-left transition ${
                quizMode === 'challenge' 
                  ? 'border-primary-pink bg-pink-50/40' 
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <h4 className="font-kid text-lg text-slate-800 flex items-center gap-1.5">
                <span>{labels[lang].challenge}</span>
                <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase">Bonus XP</span>
              </h4>
              <p className="text-xs text-slate-500 font-body mt-1">{labels[lang].challengeDesc}</p>
            </button>

            <button
              onClick={() => setQuizMode('revision')}
              className={`p-4 rounded-2xl border-2 text-left transition ${
                quizMode === 'revision' 
                  ? 'border-primary-pink bg-pink-50/40' 
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <h4 className="font-kid text-lg text-slate-800">{labels[lang].revision}</h4>
              <p className="text-xs text-slate-500 font-body mt-1">{labels[lang].revisionDesc}</p>
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onBackToDashboard}
              className="flex-1 border-2 border-slate-200 text-slate-600 font-kid py-3 rounded-2xl active:scale-95 transition"
            >
              {labels[lang].backToMap}
            </button>
            <button
              onClick={startQuiz}
              className="flex-1 bg-primary-pink text-white font-kid text-lg py-3 rounded-2xl shadow hover:bg-opacity-95 active:scale-95 transition"
            >
              {labels[lang].startBtn}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Screen 3: RESULT SCREEN
  if (quizState === 'result') {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white border-4 border-dashed border-primary-yellow/40 rounded-3xl p-6 sm:p-8 shadow-md text-center">
          <Award size={64} className="mx-auto text-primary-pink fill-primary-pink/10 mb-4 animate-float" />
          <h2 className="font-kid text-3xl text-slate-800 mb-2">{labels[lang].finished}</h2>
          <p className="text-sm font-body text-slate-500 mb-6">Excellent job! Let's check your learning results.</p>

          {/* Stats details */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-body text-slate-500">Correct Answers:</span>
              <span className="font-kid font-bold text-slate-800">{score} / {selectedQuestions.length}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-body text-slate-500">{labels[lang].xp}:</span>
              <span className="font-kid font-bold text-green-600">+{xpEarned} XP</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-slate-500">{labels[lang].stars}:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((num) => (
                  <Star
                    key={num}
                    size={20}
                    className={`${
                      num <= starsCount 
                        ? 'text-yellow-400 fill-yellow-400 animate-pulse' 
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => onQuizFinished(score, xpEarned)}
              className="bg-primary-pink text-white font-kid text-lg py-3 rounded-2xl shadow hover:bg-opacity-95 active:scale-95 transition"
            >
              {labels[lang].backToMap}
            </button>
            <button
              onClick={() => setQuizState('setup')}
              className="flex items-center justify-center gap-1 py-3 text-slate-600 hover:text-slate-800 font-kid transition"
            >
              <RefreshCw size={14} />
              <span>{labels[lang].retry}</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Screen 2: ACTIVE QUESTION SCREEN
  const currentQ = selectedQuestions[currentIndex];
  if (!currentQ) return null;

  const progressPercent = ((currentIndex + 1) / selectedQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Top Nav progress info */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-kid text-slate-500 text-sm">
          {labels[lang].questionProgress} {currentIndex + 1} of {selectedQuestions.length}
        </span>

        {/* Timer UI / Practice text */}
        {quizMode === 'challenge' ? (
          <div className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-full border border-red-100 font-kid text-sm">
            <Timer size={16} className="animate-spin-slow" />
            <span>{timeLeft}s</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-body italic">{labels[lang].practiceNoTimer}</span>
        )}
      </div>

      {/* Progress slider bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-8 border border-slate-200">
        <div 
          className="bg-primary-pink h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white border-4 border-dashed border-primary-pink/30 rounded-3xl p-6 sm:p-8 shadow-md relative min-h-[380px] flex flex-col justify-between">
        
        <div>
          {/* Question Text */}
          <h2 className="font-kid text-xl sm:text-2xl text-slate-800 mb-6 leading-normal">
            {currentQ.question}
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {shuffledOptions.map((opt) => {
              const isSelected = selectedAnswer === opt;
              const isCorrectOpt = opt === currentQ.answer;

              let btnClass = "border-slate-100 bg-white hover:border-slate-200 text-slate-700";
              if (isAnswered) {
                if (isCorrectOpt) {
                  btnClass = "bg-green-50 border-green-500 text-green-700";
                } else if (isSelected) {
                  btnClass = "bg-red-50 border-red-500 text-red-700";
                } else {
                  btnClass = "border-slate-50 bg-slate-50/50 text-slate-400 opacity-60";
                }
              }

              return (
                <button
                  key={opt}
                  disabled={isAnswered}
                  onClick={() => handleAnswerClick(opt)}
                  className={`p-4 border-2 rounded-2xl font-body text-sm font-semibold transition text-left active:scale-98 flex items-center justify-between ${btnClass}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrectOpt && <CheckCircle2 size={16} className="text-green-600 fill-green-50" />}
                  {isAnswered && isSelected && !isCorrectOpt && <XCircle size={16} className="text-red-600 fill-red-50" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation & Hint Section */}
        <div>
          {isAnswered && (
            <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
              <div className="flex items-center gap-1.5 mb-1">
                {selectedAnswer === currentQ.answer ? (
                  <span className="font-kid text-sm text-green-700">{labels[lang].correct}</span>
                ) : (
                  <span className="font-kid text-sm text-red-700">
                    {selectedAnswer === '' ? labels[lang].timeout : labels[lang].wrong}
                  </span>
                )}
              </div>
              <h5 className="font-kid text-xs text-slate-400 mt-2">{labels[lang].explanation}</h5>
              <p className="text-xs text-slate-500 font-body leading-relaxed mt-1">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {/* Hint Button */}
            {!isAnswered ? (
              <div>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-kid bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full transition"
                >
                  <HelpCircle size={14} />
                  <span>{labels[lang].hint}</span>
                </button>
                {showHint && (
                  <p className="absolute left-6 right-6 bottom-16 bg-amber-50 text-amber-800 text-xs p-3 rounded-xl border border-amber-100 z-30 font-body animate-float">
                    💡 {currentQ.hint}
                  </p>
                )}
              </div>
            ) : (
              <div></div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="bg-primary-pink text-white px-5 py-2.5 rounded-2xl font-kid text-sm flex items-center gap-1 shadow hover:bg-opacity-95 active:scale-95 transition"
              >
                <span>{labels[lang].next}</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
