import React, { useState, useEffect } from 'react';
import { ShieldCheck, Calendar, Download, ToggleLeft, ToggleRight, X, AlertTriangle, BadgePercent } from 'lucide-react';
import './ParentDashboard.css';

export default function ParentDashboard({ isPro, setProState, xpCount }) {
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [mathProblem, setMathProblem] = useState({ q: '', a: 0 });
  const [parentAnswer, setParentAnswer] = useState('');
  const [gateError, setGateError] = useState(false);

  // Settings states
  const [autoRenew, setAutoRenew] = useState(true);
  const [weeklyEmails, setWeeklyEmails] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);

  // Generate a random multiplication equation for the parent lock
  const generateGateMath = () => {
    const num1 = Math.floor(Math.random() * 8) + 6; // 6 to 13
    const num2 = Math.floor(Math.random() * 4) + 3;  // 3 to 7
    setMathProblem({
      q: `What is ${num1} x ${num2}?`,
      a: num1 * num2
    });
  };

  useEffect(() => {
    generateGateMath();
  }, []);

  const handleGateSubmit = (e) => {
    e.preventDefault();
    if (parseInt(parentAnswer) === mathProblem.a) {
      setParentUnlocked(true);
      setGateError(false);
    } else {
      setGateError(true);
      setParentAnswer('');
      generateGateMath();
    }
  };

  const handleInvoiceDownload = (invNum) => {
    alert(`📄 Simulating invoice PDF download for ${invNum}! (Invoice generated successfully)`);
  };

  const triggerCancelFunnel = () => {
    // Show cancellation retention popup
    setShowCancelModal(true);
  };

  const acceptCoupon = () => {
    setShowCancelModal(false);
    setShowCouponModal(true);
  };

  const finalizeCancel = () => {
    setProState(false); // Cancel Pro
    setShowCancelModal(false);
    alert("😔 Pro Club subscription cancelled. Your account has been reverted to the Free Starter Tier.");
  };

  // 1. LOCKED GATE VIEW
  if (!parentUnlocked) {
    return (
      <div className="parent-gate-container">
        <div className="card-premium parent-gate-card animate-float">
          <div className="shield-decor">🔐</div>
          <h2>Parents Area Only</h2>
          <p>Please solve this simple equation to verify you are a parent or guardian. Kids, ask a grown-up for help!</p>
          
          <form onSubmit={handleGateSubmit} className="gate-form">
            <div className="gate-equation">{mathProblem.q}</div>
            <input 
              type="number" 
              placeholder="Your answer" 
              required
              value={parentAnswer}
              onChange={(e) => setParentAnswer(e.target.value)}
              className={gateError ? 'error-pulse' : ''}
              autoFocus
            />
            {gateError && <p className="gate-error-msg">❌ Oops! That wasn't correct. Try the new equation!</p>}
            <button type="submit" className="btn-bouncy purple btn-gate-enter">
              🔓 Verify and Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. UNLOCKED PARENT DASHBOARD VIEW
  return (
    <div className="parent-dash-container animate-float">
      <div className="parent-dash-header">
        <div>
          <h1><span className="text-gradient-purple">Parent Portal Hub</span> 📊</h1>
          <p>Track your child's cognitive learning progress and manage billing settings.</p>
        </div>
        <button className="btn-lock-dash" onClick={() => setParentUnlocked(false)}>
          🔒 Lock Dashboard
        </button>
      </div>

      {/* Progress metrics visualizations */}
      <div className="parent-grid-layout">
        
        {/* Analytics Card 1: Study Time Progress Curve (SVG) */}
        <div className="card-premium dashboard-metric-card">
          <h3>Weekly Learning Streak</h3>
          <p className="card-desc-small">Total active time spent on GK and abacus rods over 7 days.</p>
          
          {/* Curved Line SVG graph */}
          <div className="svg-chart-holder">
            <svg viewBox="0 0 400 180" className="analytics-svg">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-purple)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--color-purple)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="380" y2="20" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
              <line x1="40" y1="70" x2="380" y2="70" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
              <line x1="40" y1="120" x2="380" y2="120" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
              <line x1="40" y1="150" x2="380" y2="150" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />

              {/* Shaded Area */}
              <path 
                d="M 50,150 L 50,130 C 100,120 120,60 160,80 C 200,100 220,30 270,40 C 320,50 340,110 370,50 L 370,150 Z" 
                fill="url(#chartGradient)"
              />
              
              {/* Curve Line */}
              <path 
                d="M 50,130 C 100,120 120,60 160,80 C 200,100 220,30 270,40 C 320,50 340,110 370,50" 
                fill="none" 
                stroke="var(--color-purple)" 
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Data Points Glowing Dots */}
              <circle cx="50" cy="130" r="5" fill="var(--color-purple)" stroke="white" strokeWidth="2" />
              <circle cx="160" cy="80" r="5" fill="var(--color-purple)" stroke="white" strokeWidth="2" />
              <circle cx="270" cy="40" r="5" fill="var(--color-purple)" stroke="white" strokeWidth="2" />
              <circle cx="370" cy="50" r="5" fill="var(--color-purple)" stroke="white" strokeWidth="2" />

              {/* Day Labels */}
              <text x="50" y="170" textAnchor="middle" fontSize="11" fill="#777">Mon</text>
              <text x="110" y="170" textAnchor="middle" fontSize="11" fill="#777">Wed</text>
              <text x="170" y="170" textAnchor="middle" fontSize="11" fill="#777">Fri</text>
              <text x="230" y="170" textAnchor="middle" fontSize="11" fill="#777">Sat</text>
              <text x="290" y="170" textAnchor="middle" fontSize="11" fill="#777">Sun</text>
              <text x="350" y="170" textAnchor="middle" fontSize="11" fill="#777">Today</text>
            </svg>
          </div>
          <div className="metric-totals-footer">
            <span>Streak: <strong>5 Days Active</strong></span>
            <span>Total Time: <strong>112 Minutes</strong></span>
          </div>
        </div>

        {/* Analytics Card 2: Subject Accuracy Bars (SVG) */}
        <div className="card-premium dashboard-metric-card">
          <h3>Subject Mastery Levels</h3>
          <p className="card-desc-small">Comparing accuracy and performance quotients across subjects.</p>
          
          <div className="svg-chart-holder">
            <svg viewBox="0 0 400 180" className="analytics-svg">
              {/* Category 1: Abacus Math */}
              <text x="20" y="45" fontSize="13" fontWeight="600" fill="#333">Abacus Addition</text>
              <rect x="20" y="55" width="300" height="16" rx="8" fill="#f1f2f6" />
              <rect x="20" y="55" width="276" height="16" rx="8" fill="var(--color-blue)" />
              <text x="330" y="68" fontSize="13" fontWeight="700" fill="var(--color-blue)">92%</text>

              {/* Category 2: Trivia Quizzes */}
              <text x="20" y="105" fontSize="13" fontWeight="600" fill="#333">General Knowledge</text>
              <rect x="20" y="115" width="300" height="16" rx="8" fill="#f1f2f6" />
              <rect x="20" y="115" width="234" height="16" rx="8" fill="var(--color-pink)" />
              <text x="330" y="128" fontSize="13" fontWeight="700" fill="var(--color-pink)">78%</text>
            </svg>
          </div>
          <div className="metric-totals-footer">
            <span>Challenges Cleared: <strong>12 total</strong></span>
            <span>XP Accumulated: <strong>{xpCount} XP</strong></span>
          </div>
        </div>

      </div>

      {/* Subscription and Billings Panel */}
      <div className="parent-settings-panel card-premium">
        <h2>Subscription & Portal Settings</h2>
        
        <div className="settings-split">
          {/* Subscription details */}
          <div className="settings-billing-info">
            <div className="billing-status-badge">
              PLAN: {isPro ? (
                <span className="badge pro-pill animate-pulse">👑 PRO CLUB ACTIVE</span>
              ) : (
                <span className="badge free-pill">STARTER TIER</span>
              )}
            </div>
            
            <p className="billing-dates">
              {isPro ? (
                <>Next renewal date: <strong>July 1, 2026 ($9.99/mo)</strong></>
              ) : (
                <>Upgrade to unlock unlimited progress tracking and advanced lessons.</>
              )}
            </p>

            <div className="invoice-sim-list">
              <h4>Invoice History</h4>
              <div className="invoice-row">
                <span><Calendar size={14} /> 06/01/2026</span>
                <span>{isPro ? "$9.99" : "$0.00"}</span>
                <button className="btn-invoice-dl" onClick={() => handleInvoiceDownload('INV-1092')}>
                  <Download size={14} /> PDF
                </button>
              </div>
            </div>

            {isPro && (
              <button className="btn-cancel-subscription" onClick={triggerCancelFunnel}>
                Cancel Auto-Renew
              </button>
            )}
          </div>

          {/* Toggle Switches */}
          <div className="settings-toggles">
            <div className="toggle-setting-row">
              <div>
                <strong>Weekly Email Summaries</strong>
                <p>Receive reports detailing XP milestones and study hours.</p>
              </div>
              <button className="toggle-btn" onClick={() => setWeeklyEmails(e => !e)}>
                {weeklyEmails ? <ToggleRight size={38} color="var(--color-purple)" /> : <ToggleLeft size={38} color="#94a3b8" />}
              </button>
            </div>

            <div className="toggle-setting-row">
              <div>
                <strong>Auto-Renew Billing</strong>
                <p>Automatically charge payment card at renewal cycle.</p>
              </div>
              <button className="toggle-btn" onClick={() => setAutoRenew(e => !e)}>
                {autoRenew ? <ToggleRight size={38} color="var(--color-purple)" /> : <ToggleLeft size={38} color="#94a3b8" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RETENTION CANCELLATION FUNNEL MODAL */}
      {showCancelModal && (
        <div className="parent-modal-overlay">
          <div className="card-premium cancellation-modal animate-float">
            <button className="close-modal-btn" onClick={() => setShowCancelModal(false)}>
              <X size={20} />
            </button>
            <div className="warning-banner-icon"><AlertTriangle size={48} color="#ff6b81" /></div>
            <h3>Wait! Please Don't Go!</h3>
            <p>Your child is in the <strong>Top 8%</strong> of cognitive responders this week! Cancelling now will lock them out of:</p>
            
            <ul className="retention-locks-list">
              <li>🔒 Advanced Soroban Addition/Subtraction challenges</li>
              <li>🔒 Space Odyssey & Wonders of Earth trivia games</li>
              <li>🔒 Daily streak multipliers and level up animations</li>
            </ul>

            <div className="retention-coupon-offer">
              <div className="coupon-percent-badge"><BadgePercent size={32} /></div>
              <div>
                <strong>Get 10% Off Today!</strong>
                <p>Stay in the Pro Club for only $8.99/mo instead of $9.99/mo!</p>
              </div>
              <button className="btn-bouncy green btn-coupon-apply animate-pulse" onClick={acceptCoupon}>
                Apply Discount
              </button>
            </div>

            <div className="modal-actions-cancellation">
              <button className="btn-bouncy blue btn-modal-stay" onClick={() => setShowCancelModal(false)}>
                Keep Pro Benefits 🚀
              </button>
              <button className="btn-modal-final-cancel" onClick={finalizeCancel}>
                Confirm Cancellation & Revert to Free
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. COUPON APPLIED MODAL SUCCESS */}
      {showCouponModal && (
        <div className="parent-modal-overlay">
          <div className="card-premium cancellation-modal coupon-success animate-float">
            <div className="warning-banner-icon text-gradient-blue">🎉</div>
            <h3>10% Discount Applied!</h3>
            <p>Your billing rate is updated to **$8.99/mo** starting next month. Thank you for investing in your child's bright learning future!</p>
            <button className="btn-bouncy purple btn-modal-close" onClick={() => setShowCouponModal(false)}>
              Return to Parent Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
