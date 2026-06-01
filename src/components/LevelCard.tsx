import React from 'react';
import { GKLevel } from '../data/gkLevels';
import { Lock, Play, BookOpen, Star } from 'lucide-react';

interface LevelCardProps {
  level: GKLevel;
  isLocked: boolean;
  progressPercent: number;
  maxScore: number;
  onLearnClick: (levelId: string) => void;
  onQuizClick: (levelId: string) => void;
  onUnlockClick: (level: GKLevel) => void;
  lang: "en" | "hi";
}

// 3D Glossy Ball Asset Library representing level icons from screenshot
const LevelGlossyIcons: { [key: string]: () => React.JSX.Element } = {
  "1": () => (
    <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md mx-auto">
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
    <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md mx-auto">
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
    <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md mx-auto">
      <defs>
        <radialGradient id="purpleGlossy" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e8dbfc" />
          <stop offset="40%" stopColor="#9b59b6" />
          <stop offset="100%" stopColor="#4a154b" />
        </radialGradient>
      </defs>
      {/* Base stand */}
      <path d="M32 80 L68 80 L63 88 L37 88 Z" fill="#d0a85c" />
      <ellipse cx="50" cy="80" rx="18" ry="4" fill="#f39c12" />
      <circle cx="50" cy="46" r="34" fill="url(#purpleGlossy)" />
      <ellipse cx="43" cy="28" rx="11" ry="5.5" fill="url(#whiteShine)" transform="rotate(-30, 43, 28)" />
    </svg>
  ),
  "4": () => (
    <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md mx-auto">
      <path d="M50 12 C65 12, 78 17, 78 45 C78 65, 50 88, 50 88 C50 88, 22 65, 22 45 C22 17, 35 12, 50 12 Z" fill="#ced6e0" stroke="#747d8c" strokeWidth="4" />
      <path d="M50 12 C50 12, 50 88, 50 88 C50 88, 22 65, 22 45 C22 17, 35 12, 50 12 Z" fill="#ff4757" opacity="0.85" />
      <path d="M42 32 L58 32 L50 60 Z" fill="white" />
    </svg>
  ),
  "5": () => (
    <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md mx-auto">
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
  onLearnClick,
  onQuizClick,
  onUnlockClick,
  lang
}: LevelCardProps) {
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
      learn: "Learn Cards",
      quiz: "Play Quiz",
      locked: "Locked",
      unlock: "Unlock Level",
      score: "Best Score"
    },
    hi: {
      difficulty: "कठिनाई",
      learn: "सीखें",
      quiz: "क्विज़ खेलें",
      locked: "बंद है",
      unlock: "अनलॉक करें",
      score: "सर्वोत्तम स्कोर"
    }
  };

  // Border theme based on level index matching reference design
  const getBorderColor = () => {
    switch (level.id) {
      case "1": return "hover:border-sky-300 hover:ring-8 hover:ring-sky-50/50";
      case "2": return "hover:border-yellow-300 hover:ring-8 hover:ring-yellow-50/50";
      case "3": return "hover:border-purple-300 hover:ring-8 hover:ring-purple-50/50";
      case "4": return "hover:border-red-300 hover:ring-8 hover:ring-red-50/50";
      case "5": return "hover:border-blue-300 hover:ring-8 hover:ring-blue-50/50";
      default: return "hover:border-slate-300";
    }
  };

  return (
    <div className={`relative bg-white border-2 border-slate-100 rounded-[2.5rem] p-6 shadow-sm transition-all duration-300 ${getBorderColor()} ${
      isLocked ? 'opacity-90' : 'hover:shadow-md hover:-translate-y-1'
    }`}>
      
      {/* Floating Locked badge on top-right */}
      {isLocked && (
        <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-kid font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-20">
          <Lock size={10} />
          <span>{labels[lang].locked}</span>
        </div>
      )}

      {/* Centered Glossy Ball Icon */}
      <div className="text-center mb-4 py-2">
        {LevelGlossyIcons[level.id] ? LevelGlossyIcons[level.id]() : <span className="text-5xl">{level.icon}</span>}
      </div>

      {/* Title & Info */}
      <div className="text-center mb-2">
        <h3 className="font-kid text-lg text-slate-800 flex items-center justify-center gap-1.5 leading-snug">
          {level.id === "1" && <span className="w-3.5 h-3.5 bg-green-500 rounded-full inline-block" />}
          {level.id === "2" && <span className="w-3.5 h-3.5 bg-yellow-500 rounded-full inline-block" />}
          {level.id === "3" && <span className="w-3.5 h-3.5 bg-purple-500 rounded-full inline-block" />}
          {level.id === "4" && <span className="w-3.5 h-3.5 bg-red-500 rounded-full inline-block" />}
          {level.id === "5" && <span className="w-3.5 h-3.5 bg-blue-500 rounded-full inline-block" />}
          <span>Level {level.id}: {level.title}</span>
        </h3>
      </div>

      <p className="text-xs text-slate-400 font-body text-center mb-4 min-h-[40px] px-2 leading-relaxed">
        {level.description}
      </p>

      {/* Stars and score display */}
      <div className="flex justify-between items-center bg-slate-50 rounded-2xl px-4 py-2 mb-6">
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
        <span className="text-xs font-kid text-slate-500">
          {labels[lang].score}: <b>{maxScore || 0}/10</b>
        </span>
      </div>

      {/* Action buttons exactly matching colors of screenshot */}
      <div className="flex gap-2 relative z-25">
        <button
          onClick={() => onLearnClick(level.id)}
          className="flex-1 flex items-center justify-center gap-1 bg-primary-blue hover:bg-opacity-95 text-white font-kid text-xs py-2.5 rounded-xl active:scale-95 transition"
        >
          <span>📖 Learn Cards</span>
        </button>

        {isLocked ? (
          <button
            onClick={() => onUnlockClick(level)}
            className="flex-1 flex items-center justify-center gap-1 bg-primary-purple hover:bg-opacity-95 text-white font-kid text-xs py-2.5 rounded-xl active:scale-95 transition"
          >
            <Lock size={12} fill="white" />
            <span>🔒 Play Quiz</span>
          </button>
        ) : (
          <button
            onClick={() => onQuizClick(level.id)}
            className="flex-1 flex items-center justify-center gap-1 bg-primary-pink hover:bg-opacity-95 text-white font-kid text-xs py-2.5 rounded-xl active:scale-95 transition"
          >
            <span>🏆 Play Quiz</span>
          </button>
        )}
      </div>

    </div>
  );
}
