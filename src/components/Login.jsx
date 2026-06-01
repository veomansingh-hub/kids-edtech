import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Sparkles } from 'lucide-react';
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Credentials provided: username "dolsa", password "dolsa123"
    if (username.trim() === 'dolsa' && password === 'dolsa123') {
      setErrorMsg('');
      onLoginSuccess();
    } else {
      setErrorMsg('🔑 Magic keys incorrect! Check your spell and try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500); // Reset shake animation
    }
  };

  return (
    <div className="login-screen-container">
      {/* Decorative bubbles */}
      <div className="login-bubble lb1 animate-float"></div>
      <div className="login-bubble lb2 animate-float"></div>

      <div className={`card-premium login-card ${shake ? 'error-shake' : ''}`}>
        <div className="login-header-icon animate-bounce-slow">
          <Sparkles size={40} className="icon-gold" />
        </div>
        
        <h2>Welcome to CurioKids!</h2>
        <p className="login-subtitle">Enter your magic keys to start your learning quest!</p>

        <form onSubmit={handleLogin} className="login-form">
          {errorMsg && (
            <div className="login-error-banner animate-float">
              {errorMsg}
            </div>
          )}

          <div className="login-form-group">
            <label htmlFor="login-username">Magic Username</label>
            <div className="input-icon-wrapper">
              <User size={18} className="input-prefix-icon" />
              <input 
                type="text" 
                id="login-username" 
                placeholder="Enter username" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="login-password">Secret Password</label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-prefix-icon" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="login-password" 
                placeholder="Enter password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="btn-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="login-hint-badge">
            💡 <strong>Hint:</strong> Use <code>dolsa</code> / <code>dolsa123</code>
          </div>

          <button type="submit" className="btn-bouncy purple btn-login-submit">
            ✨ Open Playground
          </button>
        </form>
      </div>
    </div>
  );
}
