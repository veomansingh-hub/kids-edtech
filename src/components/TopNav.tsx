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

const AVATAR_IMAGES: { [key: string]: string } = {
  aanya: '/profile_teddy.png',
  aarav: '/profile_panda.png',
  myra: '/profile_koala.png',
  vihaan: '/profile_star.png',
  kiaan: '/profile_lion.png'
};

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
  const imgUrl = AVATAR_IMAGES[currentChild.username] || '/profile_teddy.png';

  return (
    <header className="bg-white/75 backdrop-blur-md border-b border-slate-200/40 px-6 py-3.5 shadow-sm sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
        
        {/* Left Side Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => setActiveTab('gk')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-purple to-indigo-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition">
            ✨
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-xl font-kid font-bold bg-gradient-to-r from-primary-purple to-primary-pink bg-clip-text text-transparent">
              CurioKids
            </span>
            <span className="text-[8px] font-bold text-slate-400 font-body uppercase tracking-wider">
              Made by Aarti Gurjar
            </span>
          </div>
        </div>

        {/* Center Tabs exact SaaS layout */}
        <nav className="flex items-center gap-1 bg-slate-100/80 border border-slate-200/20 p-1 rounded-full shadow-inner">
          {[
            { id: 'gk', label: '🧠 GK Trivia', color: 'bg-primary-purple' },
            { id: 'nursery', label: '📍 Playroom', color: 'bg-primary-green' },
            { id: 'parents', label: '📊 Parent Hub', color: 'bg-primary-blue' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full font-kid text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full inline-block ${tab.color} ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Side indicators */}
        <div className="flex items-center gap-3">
          
          {/* Active Profile Pill */}
          <button
            onClick={onProfileSwitch}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 px-3 py-1 rounded-full text-xs font-kid font-bold text-slate-700 transition active:scale-95 shadow-inner"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-200 shadow-sm">
              <img src={imgUrl} alt={currentChild.displayName} className="w-full h-full object-cover" />
            </div>
            <span>{currentChild.displayName}</span>
            <RefreshCw size={10} className="text-slate-400 spin-hover" />
          </button>

          {/* Level / XP progression Gauge */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] bg-gradient-to-r from-primary-blue to-cyan-500 text-white font-kid font-bold px-2 py-0.5 rounded-full shadow-sm">
              Lvl {levelProgress}
            </span>
            <div className="flex items-center gap-1.5 mt-1.5">
              {/* Slider track */}
              <div className="w-16 bg-slate-100 h-2 rounded-full border border-slate-200 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-primary-blue to-primary-green h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                ></div>
              </div>
              <span className="text-[8px] text-slate-400 font-body font-bold uppercase tracking-wider">{xpProgress}/100 XP</span>
            </div>
          </div>

          {/* Premium Tag / Crown */}
          {isAllUnlocked ? (
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-kid font-bold text-[10px] px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1 border border-white/20">
              👑 PRO
            </span>
          ) : (
            <button
              onClick={onUpgradeClick}
              className="bg-gradient-to-r from-primary-pink to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-kid font-bold text-[10px] px-3.5 py-1.5 rounded-full shadow-sm hover:scale-105 transition transform active:scale-95 cursor-pointer flex items-center gap-1 uppercase tracking-wider"
            >
              🚀 Upgrade
            </button>
          )}

          {/* Quick toggle dropdown logout */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition overflow-hidden cursor-pointer"
            >
              <img src={imgUrl} alt="active profile" className="w-full h-full object-cover" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-100 rounded-2xl shadow-xl p-1 z-50">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition font-body text-xs font-bold"
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
export { TopNav };
