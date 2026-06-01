import React from 'react';
import { GK_LEVELS, GKLevel } from '../data/gkLevels';
import LevelCard from './LevelCard';
import { ChildProfile } from '../data/users';

interface GKLevelGridProps {
  currentChild: ChildProfile;
  onLearnSelect: (levelId: string) => void;
  onQuizSelect: (levelId: string) => void;
  onUnlockClick: (level: GKLevel) => void;
  lang: "en" | "hi";
}

export default function GKLevelGrid({
  currentChild,
  onLearnSelect,
  onQuizSelect,
  onUnlockClick,
  lang
}: GKLevelGridProps) {
  const unlocked = currentChild.unlockedLevels || ["1", "2"];

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-kid text-transparent bg-clip-text bg-gradient-to-r from-primary-pink via-primary-purple to-primary-blue mb-2">
          🧠 General Knowledge Trivia Quest
        </h2>
        <p className="text-slate-500 font-body max-w-lg mx-auto text-sm">
          Welcome Explorer! Swipe, click, and learn fantastic secrets about Indian cities, national space rockets, historical kings, and world records!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
