import React from 'react';
import { GKLevel } from '../data/gkLevels';
import { Lock, Play, BookOpen, Star } from 'lucide-react';

interface LevelCardProps {
  level: GKLevel;
  isLocked: boolean;
  progressPercent: number;
  maxScore: number;
  onLearnSelect?: (levelId: string) => void; // Support optional callback names
  onQuizSelect?: (levelId: string) => void;
  onLearnClick?: (levelId: string) => void;  // Support backward compatibility
  onQuizClick?: (levelId: string) => void;
  onUnlockClick: (level: GKLevel) => void;
  lang: "en" | "hi";
}

// 3D Glossy Ball Asset Library representing level icons from screenshot
const LevelGlossyIcons: { [key: string]: () => React.JSX.Element } = {
  "1": () => (
    <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md mx-auto transform group-hover:scale-110 transition duration-300">
      <defs>
        <radialGradient id="greenGlossy" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#a3f7bf" />
          <stop offset="40%" stopColor="#2ed573" />
          <stop offset="100%" stopColor="#1b5a32" />
        </radialGradient>
        <linearGradient id="whiteShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.8" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#greenGlossy)" />
      <ellipse cx="42" cy="30" rx="14" ry="7" fill="url(#whiteShine)" transform="rotate(-30, 42, 30)" />
    </svg>
  ),
  "2": () => (
    <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md mx-auto transform group-hover:scale-110 transition duration-300">
      <defs>
        <radialGradient id="yellowGlossy" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffeaa7" />
          <stop offset="40%" stopColor="#ffa502" />
          <stop offset="100%" stopColor="#b77901" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#yellowGlossy)" />
      <ellipse cx="42" cy="30" rx="14" ry="7" fill="url(#whiteShine)" transform="rotate(-30, 42, 30)" />
    </svg>
  ),
  "3": () => (
    <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md mx-auto transform group-hover:scale-110 transition duration-300">
      <defs>
        <radialGradient id="purpleGlossy" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e8dbfc" />
          <stop offset="40%" stopColor="#9b59b6" />
          <stop offset="100%" stopColor="#4a154b" />
        </radialGradient>
      </defs>
      <path d="M32 80 L68 80 L63 88 L37 88 Z" fill="#d0a85c" />
      <ellipse cx="50" cy="80" rx="18" ry="4" fill="#f39c12" />
      <circle cx="50" cy="46" r="34" fill="url(#purpleGlossy)" />
      <ellipse cx="43" cy="28" rx="11" ry="5.5" fill="url(#whiteShine)" transform="rotate(-30, 43, 28)" />
    </svg>
  ),
  "4": () => (
    <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md mx-auto transform group-hover:scale-110 transition duration-300">
      <path d="M50 12 C65 12, 78 17, 78 45 C78 65, 50 88, 50 88 C50 88, 22 65, 22 45 C22 17, 35 12, 50 12 Z" fill="#ced6e0" stroke="#747d8c" strokeWidth="4" />
      <path d="M50 12 C50 12, 50 88, 50 88 C50 88, 22 65, 22 45 C22 17, 35 12, 50 12 Z" fill="#ff4757" opacity="0.85" />
      <path d="M42 32 L58 32 L50 60 Z" fill="white" />
    </svg>
  ),
  "5": () => (
    <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md mx-auto transform group-hover:scale-110 transition duration-300">
      <circle cx="50" cy="50" r="40" fill="#2e86de" />
      <path d="M25 45 Q35 30, 45 40 T60 30 T75 45 T70 65 T50 75 Z" fill="#2ed573" />
      <path d="M22 62 Q28 65, 35 60 T42 70" fill="none" stroke="#2ed573" strokeWidth="6" strokeLinecap="round" />
      <circle cx="50" cy="50" r="40" fill="url(#whiteShine)" opacity="0.2" />
    </svg>
  )
};

export default function LevelCard({
  level,
  isLocked,
  maxScore,
  onLearnSelect,
  onQuizSelect,
  onLearnClick,
  onQuizClick,
  onUnlockClick,
  lang
}: LevelCardProps) {
  // Graceful prop redirects
  const handleLearn = () => {
    if (onLearnSelect) onLearnSelect(level.id);
    else if (onLearnClick) onLearnClick(level.id);
  };

  const handleQuiz = () => {
    if (onQuizSelect) onQuizSelect(level.id);
    else if (onQuizClick) onQuizClick(level.id);
  };

  const getStarsCount = () => {
    if (!maxScore) return 0;
    const pct = (maxScore / 10) * 100;
    if (pct >= 90) return 3;
    if (pct >= 75) return 2;
    if (pct >= 50) return 1;
    return 0;
  };

  const starsCount = getStarsCount();

  const labels = {
    en: {
      difficulty: "Difficulty",
      learn: "Study Cards",
      quiz: "Play Quiz",
      locked: "Premium Locked",
      unlock: "Unlock",
      score: "Best Score"
    },
    hi: {
      difficulty: "कठिनाई",
      learn: "सीखें",
      quiz: "क्विज़ खेलें",
      locked: "प्रीमियम बंद है",
      unlock: "अनलॉक करें",
      score: "सर्वोत्तम स्कोर"
    }
  };

  // Border theme based on level index matching reference design
  const getThemeClasses = () => {
    switch (level.id) {
      case "1": return {
        border: "hover:border-emerald-300 hover:ring-4 hover:ring-emerald-50/70",
        bg: "from-emerald-50 to-teal-50/20",
        badge: "bg-emerald-500/10 text-emerald-700 border-emerald-100",
        button: "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-emerald-200/50 hover:from-emerald-500 hover:to-teal-600",
        indicator: "bg-emerald-500"
      };
      case "2": return {
        border: "hover:border-amber-300 hover:ring-4 hover:ring-amber-50/70",
        bg: "from-amber-50 to-orange-50/20",
        badge: "bg-amber-500/10 text-amber-700 border-amber-100",
        button: "bg-gradient-to-r from-amber-400 to-orange-500 shadow-amber-200/50 hover:from-amber-500 hover:to-orange-600",
        indicator: "bg-amber-500"
      };
      case "3": return {
        border: "hover:border-purple-300 hover:ring-4 hover:ring-purple-50/70",
        bg: "from-purple-50 to-indigo-50/20",
        badge: "bg-purple-500/10 text-purple-700 border-purple-100",
        button: "bg-gradient-to-r from-primary-purple to-indigo-600 shadow-purple-200/50 hover:from-purple-600 hover:to-indigo-700",
        indicator: "bg-primary-purple"
      };
      case "4": return {
        border: "hover:border-rose-300 hover:ring-4 hover:ring-rose-50/70",
        bg: "from-rose-50/60 to-pink-50/20",
        badge: "bg-rose-500/10 text-rose-700 border-rose-100",
        button: "bg-gradient-to-r from-pink-400 to-rose-500 shadow-pink-200/50 hover:from-pink-500 hover:to-rose-600",
        indicator: "bg-rose-500"
      };
      case "5": return {
        border: "hover:border-blue-300 hover:ring-4 hover:ring-blue-50/70",
        bg: "from-blue-50 to-indigo-50/15",
        badge: "bg-blue-500/10 text-blue-700 border-blue-100",
        button: "bg-gradient-to-r from-primary-blue to-indigo-500 shadow-blue-200/50 hover:from-blue-600 hover:to-indigo-600",
        indicator: "bg-primary-blue"
      };
      default: return {
        border: "hover:border-slate-300",
        bg: "from-slate-50 to-white",
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        button: "bg-slate-700 hover:bg-slate-800 shadow-slate-200/50",
        indicator: "bg-slate-500"
      };
    }
  };

  const theme = getThemeClasses();

  return (
    <div className={`relative bg-gradient-to-br ${theme.bg} border-2 border-white rounded-[2.5rem] p-6 shadow-sm transition-all duration-300 group ${theme.border} ${
      isLocked ? 'opacity-95' : 'hover:shadow-xl hover:-translate-y-1.5'
    }`}>
      
      {/* Floating Locked badge */}
      {isLocked && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-red-500 border border-red-100 text-[9px] font-kid font-bold px-2.5 py-1 rounded-full flex items-center gap-1 z-20 shadow-sm animate-pulse">
          <Lock size={10} fill="currentColor" className="opacity-70" />
          <span>{labels[lang].locked}</span>
        </div>
      )}

      {/* Centered Glossy Ball Icon */}
      <div className="text-center mb-4 py-2 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/40 filter blur-xl rounded-full pointer-events-none z-0"></div>
        <div className="relative z-10">
          {LevelGlossyIcons[level.id] ? LevelGlossyIcons[level.id]() : <span className="text-5xl">{level.icon}</span>}
        </div>
      </div>

      {/* Title & Info */}
      <div className="text-center mb-2">
        <span className={`inline-block border text-[8px] font-kid uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${theme.badge}`}>
          Level {level.id} • {level.difficulty}
        </span>
        <h3 className="font-kid text-lg text-slate-800 flex items-center justify-center gap-1.5 leading-snug">
          <span className={`w-2.5 h-2.5 rounded-full inline-block ${theme.indicator}`} />
          <span>{level.title}</span>
        </h3>
      </div>

      <p className="text-[11px] text-slate-400 font-body text-center mb-4 min-h-[44px] px-2 leading-relaxed font-medium">
        {level.description}
      </p>

      {/* Stars and score display */}
      <div className="flex justify-between items-center bg-white/70 border border-slate-100 rounded-2xl px-4 py-2.5 mb-6 shadow-sm">
        <div className="flex gap-0.5">
          {[1, 2, 3].map((num) => (
            <Star
              key={num}
              size={14}
              className={`${
                num <= starsCount 
                  ? 'text-yellow-400 fill-yellow-400 animate-pulse' 
                  : 'text-slate-200'
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-kid text-slate-500 font-bold uppercase tracking-wider">
          {labels[lang].score}: <span className="text-slate-800 font-body">{maxScore || 0}/10</span>
        </span>
      </div>

      {/* Action buttons with custom beautiful gradients */}
      <div className="flex gap-2 relative z-25">
        <button
          onClick={handleLearn}
          className="flex-1 flex items-center justify-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-kid text-xs py-3 rounded-2xl active:scale-95 transition shadow-sm cursor-pointer"
        >
          <BookOpen size={13} className="text-slate-400" />
          <span>{labels[lang].learn}</span>
        </button>

        {isLocked ? (
          <button
            onClick={() => onUnlockClick(level)}
            className={`flex-1 flex items-center justify-center gap-1 text-white font-kid text-xs py-3 rounded-2xl active:scale-95 transition shadow-md cursor-pointer ${theme.button}`}
          >
            <Lock size={12} fill="white" className="opacity-80" />
            <span>{labels[lang].unlock}</span>
          </button>
        ) : (
          <button
            onClick={handleQuiz}
            className={`flex-1 flex items-center justify-center gap-1 text-white font-kid text-xs py-3 rounded-2xl active:scale-95 transition shadow-md cursor-pointer ${theme.button}`}
          >
            <Play size={12} fill="white" className="opacity-80" />
            <span>{labels[lang].quiz}</span>
          </button>
        )}
      </div>

    </div>
  );
}
export { LevelCard };
