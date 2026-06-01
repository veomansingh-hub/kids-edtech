import React, { useState } from 'react';
import { DEMO_USERS } from '../data/users';
import { Sparkles, Key, Lock, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

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
      setError('Uh oh! That password was wrong. Try again!');
    }
  };

  return (
    <div className="min-height-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-amber-50 flex items-center justify-center p-4 min-h-screen">
      <div className="absolute top-10 left-10 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="max-w-xl w-full bg-white/80 backdrop-blur-md border-4 border-dashed border-primary-pink/40 rounded-3xl p-8 shadow-premium text-center relative">
        <div className="text-4xl font-kid text-primary-pink mb-2 flex items-center justify-center gap-2">
          <span>✨</span> CurioKids Learning Hub <span>✨</span>
        </div>
        <p className="text-gray-600 font-body mb-8">
          Welcome to the ultimate learning playground! Select your avatar and enter your secret key to start playing.
        </p>

        {/* User profile selection grid */}
        {!selectedUser ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
            {DEMO_USERS.map((user) => (
              <button
                key={user.username}
                onClick={() => {
                  setSelectedUser(user);
                  setError('');
                  setPassword('');
                }}
                className="flex flex-col items-center p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:border-primary-pink hover:scale-105 transition duration-200"
              >
                <span className="text-4xl mb-2">{user.avatar}</span>
                <span className="font-kid text-slate-700 font-bold">{user.displayName}</span>
                <span className="text-xs text-slate-400 mt-1">Select</span>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleLogin} className="max-w-xs mx-auto">
            <div className="flex flex-col items-center mb-6">
              <span className="text-6xl mb-2 animate-bounce">{selectedUser.avatar}</span>
              <h3 className="font-kid text-2xl text-slate-800">Hi {selectedUser.displayName}!</h3>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-xs text-primary-blue underline mt-1 font-body"
              >
                Change Avatar
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-primary-pink focus:outline-none font-body text-center"
                autoFocus
              />
              <Key className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>

            {error && (
              <div className="flex items-center gap-1 text-xs text-red-500 justify-center mb-4 font-body">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary-pink text-white font-kid font-bold text-lg py-3 rounded-2xl shadow-md hover:bg-opacity-90 active:scale-95 transition"
            >
              Let's Go! 🚀
            </button>
            
            <p className="text-[10px] text-slate-400 mt-4 font-body italic">
              Hint: Password is "{selectedUser.displayName}@1234"
            </p>
          </form>
        )}

        <div className="border-t border-slate-100 pt-4 mt-6">
          <p className="text-xs text-slate-400 font-body">
            🔐 Parent portal manual locks and settings can be unlocked inside the Parents Hub.
          </p>
        </div>
      </div>
    </div>
  );
}
