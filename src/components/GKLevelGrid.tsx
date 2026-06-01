import React from 'react';
import { GK_LEVELS, GKLevel } from '../data/gkLevels';
import LevelCard from './LevelCard';
import { ChildProfile } from '../data/users';
import { Languages } from 'lucide-react';
import PhysicsPlayground from './PhysicsPlayground';

interface GKLevelGridProps {
  currentChild: ChildProfile;
  onLearnSelect: (levelId: string) => void;
  onQuizSelect: (levelId: string) => void;
  onUnlockClick: (level: GKLevel) => void;
  lang: "en" | "hi";
  setLang: (lang: "en" | "hi") => void;
}

export default function GKLevelGrid({
  currentChild,
  onLearnSelect,
  onQuizSelect,
  onUnlockClick,
  lang,
  setLang
}: GKLevelGridProps) {
  const unlocked = currentChild.unlockedLevels || ["1", "2"];

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      
      {/* Dynamic Voice Reader language selector toggle from screenshot */}
      <div className="flex justify-center items-center gap-3 bg-slate-50 border border-slate-200/60 max-w-xs mx-auto rounded-full py-1.5 px-4 mb-8 shadow-sm">
        <span className="text-xs font-kid text-slate-500 flex items-center gap-1 font-bold">
          🗣️ Reader Language:
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setLang('en')}
            className={`text-xs font-kid px-3 py-1 rounded-full transition ${
              lang === 'en'
                ? 'bg-primary-purple text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            🇺🇸 English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`text-xs font-kid px-3 py-1 rounded-full transition ${
              lang === 'hi'
                ? 'bg-primary-purple text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            🇮🇳 हिंदी (Hindi)
          </button>
        </div>
      </div>

      {/* Main Title Headers */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-kid text-primary-pink mb-1">
          GK Brainy Explorer 🧠
        </h2>
        <p className="text-slate-400 font-body text-sm font-semibold mb-6">
          Level up your General Knowledge with fun interactive trivia and games!
        </p>
      </div>

      {/* Interactive Physics Playground */}
      <div className="max-w-5xl mx-auto mb-12">
        <PhysicsPlayground />
      </div>

      {/* Card grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {GK_LEVELS.map((level) => {
          const isLocked = !unlocked.includes(level.id);
          const maxScore = currentChild.completedQuizzes[level.id] || 0;
          const progressPercent = maxScore ? (maxScore / 10) * 100 : 0;

          return (
            <LevelCard
              key={level.id}
              level={level}
              isLocked={isLocked}
              progressPercent={progressPercent}
              maxScore={maxScore}
              onLearnClick={onLearnSelect}
              onQuizClick={onQuizSelect}
              onUnlockClick={onUnlockClick}
              lang={lang}
            />
          );
        })}
      </div>
    </div>
  );
}
