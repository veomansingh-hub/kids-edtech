import React, { useState } from 'react';
import { Sparkles, Trophy, Flame, ShieldAlert, LogOut, ChevronDown, Languages, CreditCard } from 'lucide-react';
import { ChildProfile } from '../data/users';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentChild: ChildProfile;
  onLogout: () => void;
  lang: "en" | "hi";
  setLang: (lang: "en" | "hi") => void;
  onUpgradeClick: () => void;
  isAllUnlocked: boolean;
}

export default function TopNav({
  activeTab,
  setActiveTab,
  currentChild,
  onLogout,
  lang,
  setLang,
  onUpgradeClick,
  isAllUnlocked
}: TopNavProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const xpProgress = currentChild.xp % 100;
  const levelProgress = Math.floor(currentChild.xp / 100) + 1;

  // Language translations map
  const t = {
    en: {
      gk: "🧠 GK Trivia Quest",
      nursery: "🎈 Nursery Playroom",
      parents: "📊 Parents Hub",
      upgrade: "🚀 Upgrade",
      pro: "👑 PRO",
      logout: "Log Out",
      xp: "XP",
      level: "Level"
    },
    hi: {
      gk: "🧠 सीखें (GK)",
      nursery: "🎈 नर्सरी प्लेरूम",
      parents: "📊 माता-पिता (Hub)",
      upgrade: "अपग्रेड",
      pro: "प्रो 👑",
      logout: "बाहर निकलें",
      xp: "एक्सपी",
      level: "लेवल"
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b-2 border-slate-100 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('gk')}>
          <span className="text-3xl animate-spin-slow">✨</span>
          <span className="text-2xl font-kid text-transparent bg-clip-text bg-gradient-to-r from-primary-pink via-primary-purple to-primary-blue">
            CurioKids
          </span>
        </div>

        {/* Tab Buttons */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('gk')}
            className={`px-4 py-2 rounded-2xl font-kid transition duration-200 ${
              activeTab === 'gk'
                ? 'bg-primary-pink text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t[lang].gk}
          </button>
          
          <button
            onClick={() => setActiveTab('nursery')}
            className={`px-4 py-2 rounded-2xl font-kid transition duration-200 ${
              activeTab === 'nursery'
                ? 'bg-primary-blue text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t[lang].nursery}
          </button>

          <button
            onClick={() => setActiveTab('parents')}
            className={`px-4 py-2 rounded-2xl font-kid transition duration-200 ${
              activeTab === 'parents'
                ? 'bg-primary-purple text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t[lang].parents}
          </button>
        </nav>

        {/* Child Profile, XP Bar & Upgrade Controls */}
        <div className="flex items-center gap-4 flex-grow sm:flex-grow-0 justify-end w-full sm:w-auto">
          
          {/* Streak */}
          <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full border border-amber-100 font-kid">
            <Flame size={18} className="fill-amber-500 text-amber-500 animate-pulse" />
            <span>{currentChild.streak || 1}d</span>
          </div>

          {/* XP Bar */}
          <div className="hidden md:flex flex-col w-36">
            <div className="flex justify-between text-xs font-kid text-slate-500 mb-1">
              <span>{t[lang].level} {levelProgress}</span>
              <span>{xpProgress}/100 {t[lang].xp}</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-primary-pink to-primary-yellow h-full transition-all duration-300"
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Lang Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-600 p-2 rounded-full border border-slate-200 transition font-body text-xs uppercase"
            title="Switch Language"
          >
            <Languages size={16} />
            <span>{lang}</span>
          </button>

          {/* Upgrade Button */}
          {isAllUnlocked ? (
            <span className="hidden sm:inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-2xl font-kid text-sm shadow-sm animate-pulse">
              {t[lang].pro}
            </span>
          ) : (
            <button
              onClick={onUpgradeClick}
              className="bg-gradient-to-r from-primary-yellow to-primary-orange text-white px-4 py-2 rounded-2xl font-kid text-sm shadow-sm hover:scale-105 transition duration-200 active:scale-95 flex items-center gap-1"
            >
              <CreditCard size={14} />
              <span>{t[lang].upgrade}</span>
            </button>
          )}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 p-1.5 pr-3 rounded-2xl transition"
            >
              <span className="text-2xl">{currentChild.avatar}</span>
              <span className="hidden sm:inline font-kid text-slate-700 font-bold">{currentChild.displayName}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-lg p-2 z-50">
                <div className="p-2 border-b border-slate-50 text-center md:hidden">
                  <div className="text-xs font-kid text-slate-500 mb-1">{t[lang].xp} Progress</div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-primary-pink h-full" style={{ width: `${xpProgress}%` }}></div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition font-body text-sm"
                >
                  <LogOut size={16} />
                  <span>{t[lang].logout}</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
