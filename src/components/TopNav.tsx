import React, { useState } from 'react';
import { Sparkles, Trophy, Flame, LogOut, ChevronDown, Languages, CreditCard, RefreshCw } from 'lucide-react';
import { ChildProfile } from '../data/users';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentChild: ChildProfile;
  onLogout: () => void;
  onProfileSwitch: () => void;
  lang: "en" | "hi";
  onUpgradeClick: () => void;
  isAllUnlocked: boolean;
}

export default function TopNav({
  activeTab,
  setActiveTab,
  currentChild,
  onLogout,
  onProfileSwitch,
  lang,
  onUpgradeClick,
  isAllUnlocked
}: TopNavProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const xpProgress = currentChild.xp % 100;
  const levelProgress = Math.floor(currentChild.xp / 100) + 1;

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-4 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
        
        {/* Left Side Logo */}
        <div className="flex flex-col select-none cursor-pointer" onClick={() => setActiveTab('gk')}>
          <div className="flex items-center gap-1.5">
            <span className="text-xl animate-bounce">✨</span>
            <span className="text-2xl font-kid font-bold text-primary-purple">
              CurioKids
            </span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 pl-6">Made by Aarti Gurjar</span>
        </div>

        {/* Center Tabs exactly matching screenshot */}
        <nav className="flex items-center gap-2 bg-slate-50 border border-slate-200/50 p-1 rounded-full shadow-inner">
          <button
            onClick={() => setActiveTab('gk')}
            className={`px-4 py-2 rounded-full font-kid text-sm transition flex items-center gap-1.5 ${
              activeTab === 'gk'
                ? 'bg-primary-purple text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <span>🧠 GK Trivia Quest</span>
          </button>
          
          <button
            onClick={() => setActiveTab('nursery')}
            className={`px-4 py-2 rounded-full font-kid text-sm transition flex items-center gap-1.5 ${
              activeTab === 'nursery'
                ? 'bg-primary-purple text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <span>📍 Nursery Playroom</span>
          </button>

          <button
            onClick={() => setActiveTab('parents')}
            className={`px-4 py-2 rounded-full font-kid text-sm transition flex items-center gap-1.5 ${
              activeTab === 'parents'
                ? 'bg-primary-purple text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <span>📊 Parents Hub</span>
          </button>
        </nav>

        {/* Right Side indicators matching screenshot */}
        <div className="flex items-center gap-3">
          
          {/* Child Badge selector */}
          <button
            onClick={onProfileSwitch}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 px-3 py-1.5 rounded-full text-xs font-kid font-bold text-slate-700 transition"
          >
            <RefreshCw size={12} className="text-slate-400" />
            <span>{currentChild.displayName}</span>
            <span>{currentChild.avatar}</span>
          </button>

          {/* Level indicators */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] bg-primary-blue text-white font-kid font-bold px-2 py-0.5 rounded-full">
              Lvl {levelProgress}
            </span>
            <span className="text-[10px] text-slate-400 font-body font-semibold mt-0.5">
              {xpProgress}/100 XP
            </span>
          </div>

          {/* Upgrade Button */}
          {isAllUnlocked ? (
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-kid text-xs px-3.5 py-2 rounded-full shadow-sm">
              👑 PRO
            </span>
          ) : (
            <button
              onClick={onUpgradeClick}
              className="bg-primary-pink hover:bg-opacity-95 text-white font-kid text-xs px-4 py-2.5 rounded-full shadow-sm hover:scale-105 transition flex items-center gap-1.5"
            >
              🚀 Upgrade
            </button>
          )}

          {/* Dropdown Logout Toggle */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full border-2 border-slate-100 shadow bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition"
            >
              <span className="text-2xl">{currentChild.avatar}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-100 rounded-2xl shadow-lg p-2 z-50">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition font-body text-xs"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
