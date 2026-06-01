import React, { useState } from 'react';
import { DEMO_USERS } from '../data/users';
import { Sparkles, Key, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

// Map profile names to our custom generated 3D clay avatars
const AVATAR_IMAGES: { [key: string]: string } = {
  aanya: '/profile_teddy.png',
  aarav: '/profile_panda.png',
  myra: '/profile_koala.png',
  vihaan: '/profile_star.png',
  kiaan: '/profile_lion.png'
};

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (password === selectedUser.password) {
      setError('');
      onLoginSuccess(selectedUser.username);
    } else {
      setError('Oops! That password was wrong. Try again! 🤫');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#f6f0ff] via-[#fdf9ff] to-[#f5f3ff] flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden font-body select-none">
      
      {/* Dynamic Ambient Blur Glows in Background */}
      <div className="absolute top-10 left-10 w-44 h-44 bg-primary-pink/15 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-52 h-52 bg-primary-blue/15 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-primary-yellow/10 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>

      {/* Main Glassmorphic Wrapper Split Card */}
      <div className="max-w-5xl w-full bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 min-h-[580px]">
        
        {/* Left Side: Whimsical 3D Study Banner */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-primary-purple via-indigo-600 to-indigo-700 p-8 flex flex-col justify-between items-center text-white relative min-h-[300px] md:min-h-auto">
          {/* Subtle star patterns */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="w-full flex justify-between items-center relative z-10">
            <span className="font-kid text-lg font-bold tracking-wider uppercase text-pink-100 flex items-center gap-1">
              ✨ CurioKids
            </span>
            <span className="bg-white/10 backdrop-blur-md text-[10px] font-kid px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
              Safe Offline Sandbox
            </span>
          </div>

          {/* Generated 3D Clay Illustration */}
          <div className="my-6 relative z-10 w-full max-w-[340px] transform hover:scale-105 transition duration-500">
            <img 
              src="/login_splash_banner.png" 
              alt="Cartoon Panda and Bear Studying" 
              className="w-full h-auto object-contain rounded-3xl drop-shadow-2xl border-4 border-white/10 bg-white/5 backdrop-blur-sm"
            />
          </div>

          <div className="text-center max-w-sm relative z-10">
            <h3 className="font-kid text-2xl font-bold mb-2">Kids' Learning Playground 🎨</h3>
            <p className="text-xs text-indigo-100 leading-relaxed font-body">
              Explore progressive bilingual trivia, interactive sound playrooms, and trace-to-learn activities!
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Action Portal */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-between bg-white/40">
          
          {/* Title Header */}
          <div className="text-center md:text-left mb-6">
            <h2 className="font-kid text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-primary-pink flex items-center justify-center md:justify-start gap-1 leading-snug">
              <span>Hi, Explorer!</span>
              <Sparkles size={22} className="text-primary-pink animate-pulse" />
            </h2>
            <p className="text-xs text-slate-400 font-body mt-1">
              {!selectedUser ? "Select your profile avatar to enter your classroom" : "Enter your secret code to unlock your learning desk"}
            </p>
          </div>

          {/* Core Login View Switch */}
          {!selectedUser ? (
            // Screen 1: Beautiful Profiles Grid
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-auto">
              {DEMO_USERS.map((user) => {
                const img = AVATAR_IMAGES[user.username] || '/profile_teddy.png';
                return (
                  <button
                    key={user.username}
                    onClick={() => setSelectedUser(user)}
                    className="group bg-white border border-slate-100 rounded-3xl p-4 flex flex-col items-center justify-between text-center shadow-sm hover:border-primary-purple hover:shadow-md hover:-translate-y-1 active:scale-95 transition duration-300 relative select-none cursor-pointer min-h-[140px]"
                  >
                    {/* Glowing highlight border on hover */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary-purple/40 transition duration-300 pointer-events-none"></div>

                    {/* Clay avatar picture */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 shadow-inner mb-2 group-hover:scale-110 group-hover:rotate-3 transition duration-300 bg-slate-50">
                      <img src={img} alt={user.displayName} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="font-kid text-slate-800 text-sm font-bold group-hover:text-primary-purple transition duration-200">
                        {user.displayName}
                      </span>
                      <span className="text-[9px] bg-purple-50 text-primary-purple font-kid font-bold px-2 py-0.5 rounded-full mt-1">
                        Lvl {user.level || 1}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            // Screen 2: Interactive Password Entry
            <form onSubmit={handleLogin} className="max-w-sm w-full mx-auto my-auto space-y-6">
              
              {/* Back selector button */}
              <div className="flex flex-col items-center text-center">
                {/* Custom Avatar Circular Frame */}
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-primary-purple to-primary-pink rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-spin-slow"></div>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10 bg-slate-100">
                    <img 
                      src={AVATAR_IMAGES[selectedUser.username] || '/profile_teddy.png'} 
                      alt={selectedUser.displayName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <h3 className="font-kid text-2xl text-slate-800 mt-4 leading-none">
                  Welcome Back, {selectedUser.displayName}!
                </h3>
                <button
                  type="button"
                  onClick={() => { setSelectedUser(null); setPassword(''); setError(''); }}
                  className="text-[10px] font-kid text-primary-blue hover:text-indigo-600 underline mt-1.5 transition uppercase tracking-widest"
                >
                  ◀ Switch Profile
                </button>
              </div>

              {/* Password field with glowing indicator */}
              <div className="space-y-1">
                <label className="text-[10px] font-kid font-bold text-slate-400 uppercase tracking-widest block text-left pl-2">
                  Enter Secret Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent text-center font-bold text-slate-700 placeholder-slate-300 shadow-inner"
                    autoFocus
                  />
                  <Lock className="absolute left-3.5 top-3.5 text-slate-300" size={16} />
                </div>
                {error && (
                  <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-bold justify-center pt-1 font-body">
                    <AlertCircle size={12} />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Action trigger button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-kid text-base font-bold py-3.5 rounded-2xl shadow-md hover:shadow-lg transition transform active:scale-98 uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Unlock Desk</span>
                <ArrowRight size={16} />
              </button>

              {/* Hint badge */}
              <p className="text-[8px] font-bold text-slate-400 text-center italic bg-slate-50 border border-slate-100 rounded-xl py-1.5">
                💡 Secret key hint: <b className="text-slate-500 font-body">{selectedUser.password}</b>
              </p>
            </form>
          )}

          {/* Footer branding */}
          <div className="border-t border-slate-100/50 pt-4 mt-6 text-center">
            <span className="text-[9px] font-body text-slate-400 font-semibold flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-emerald-500" />
              100% Offline Safe Sandbox • No tracking, advertising, or outside access.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
export { LoginPage };
