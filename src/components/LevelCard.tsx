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

export default function LevelCard({
  level,
  isLocked,
  progressPercent,
  maxScore,
  onLearnClick,
  onQuizClick,
  onUnlockClick,
  lang
}: LevelCardProps) {
  // Stars computation based on maxScore percentage:
  // 1 star = 50%+, 2 stars = 75%+, 3 stars = 90%+
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

  return (
    <div className={`relative bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm transition-all duration-300 ${
      isLocked 
        ? 'opacity-80 scale-95' 
        : 'hover:shadow-md hover:-translate-y-1'
    }`}>
      {/* Locked Blur Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-[1px] rounded-3xl flex flex-col items-center justify-center p-4 z-10">
          <div className="bg-white/90 border-2 border-primary-orange/60 p-3 rounded-full shadow-md text-primary-orange mb-2 animate-bounce">
            <Lock size={28} />
          </div>
          <span className="font-kid text-slate-800 text-lg">{labels[lang].locked}</span>
          <button
            onClick={() => onUnlockClick(level)}
            className="mt-3 bg-primary-orange text-white font-kid text-xs px-4 py-2 rounded-xl shadow hover:bg-opacity-90 active:scale-95 transition"
          >
            {labels[lang].unlock} - ₹{level.price}
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl p-2 bg-slate-50 rounded-2xl">{level.icon}</span>
          <div>
            <h3 className="font-kid text-xl text-slate-800">
              {level.title}
            </h3>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
              level.difficulty === 'Easy' 
                ? 'bg-green-50 text-green-600 border border-green-100' 
                : level.difficulty === 'Medium'
                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              {labels[lang].difficulty}: {level.difficulty}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 font-body mb-6 min-h-[48px]">
        {level.description}
      </p>

      {/* Progress & Stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs text-slate-400 font-body block">{labels[lang].score}</span>
          <span className="font-kid text-slate-700 text-lg">{maxScore || 0}/10</span>
        </div>

        {/* Dynamic Star rewards */}
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((num) => (
            <Star
              key={num}
              size={18}
              className={`${
                num <= starsCount 
                  ? 'text-yellow-400 fill-yellow-400 animate-pulse' 
                  : 'text-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 z-20 relative">
        <button
          onClick={() => onLearnClick(level.id)}
          className="flex-1 flex items-center justify-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border-2 border-slate-200/60 font-kid text-sm py-2.5 rounded-2xl active:scale-95 transition"
        >
          <BookOpen size={16} />
          <span>{labels[lang].learn}</span>
        </button>

        <button
          onClick={() => onQuizClick(level.id)}
          className="flex-1 flex items-center justify-center gap-1 bg-primary-pink hover:bg-opacity-95 text-white font-kid text-sm py-2.5 rounded-2xl shadow-sm active:scale-95 transition"
        >
          <Play size={16} fill="white" />
          <span>{labels[lang].quiz}</span>
        </button>
      </div>
    </div>
  );
}
