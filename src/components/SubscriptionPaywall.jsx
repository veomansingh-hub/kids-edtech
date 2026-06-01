import React, { useState, useEffect } from 'react';
import { Check, ShieldAlert, Sparkles, CreditCard, Lock, ArrowRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import './SubscriptionPaywall.css';

export default function SubscriptionPaywall({ isPro, setProState }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [procStep, setProcStep] = useState(0);
  const [success, setSuccess] = useState(false);

  // Credit Card Form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardFocused, setCardFocused] = useState(false); // true when CVC focused -> flips card

  const processingSteps = [
    "Connecting to the secure magic banks... 🏦",
    "Unlocking the golden gates of wisdom... 🗝️",
    "Gathering space stardust and logic beads... ✨",
    "Verifying details with parent validators... 🤝",
    "Success! Loading your Pro membership! 🎉"
  ];

  // Increment processing step text
  useEffect(() => {
    let timer;
    if (processing && procStep < processingSteps.length - 1) {
      timer = setTimeout(() => {
        setProcStep(s => s + 1);
      }, 900);
    } else if (processing && procStep === processingSteps.length - 1) {
      timer = setTimeout(() => {
        setProcessing(false);
        setSuccess(true);
        setProState(true); // Unlock globally
        playSuccessConfetti();
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [processing, procStep]);

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    // Format: XXXX XXXX XXXX XXXX
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setCardExpiry(val);
  };

  const handleCvcChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardCvc(val);
  };

  const triggerCheckout = () => {
    if (isPro) {
      alert("✨ You are already a premium member of the CurioKids Club! Enjoy your benefits!");
      return;
    }
    setShowCheckout(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
      alert("Please fill out all billing details!");
      return;
    }
    setProcessing(true);
    setProcStep(0);
  };

  const playSuccessConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const currentPrice = billingCycle === 'monthly' ? '$9.99' : '$6.66';
  const billingPeriod = billingCycle === 'monthly' ? '/ month' : '/ month (billed yearly)';

  return (
    <div className="paywall-container">
      {/* 1. MAIN PRICING PAGE */}
      {!showCheckout && !success && (
        <div className="paywall-hero animate-float">
          <div className="premium-header-icon animate-bounce-slow">✨👑✨</div>
          <h1 className="paywall-title">Join the <span className="text-gradient-purple">CurioKids Club</span></h1>
          <p className="paywall-subtitle">Unlock advanced abacus math, universe secrets, and custom parent progress reports!</p>

          {/* Monthly / Yearly Switch */}
          <div className="billing-switch-container">
            <span className={`billing-label ${billingCycle === 'monthly' ? 'active' : ''}`}>Monthly</span>
            <button 
              className={`billing-toggle ${billingCycle === 'yearly' ? 'toggled' : ''}`}
              onClick={() => setBillingCycle(c => c === 'monthly' ? 'yearly' : 'monthly')}
            >
              <span className="toggle-knob"></span>
            </button>
            <span className={`billing-label ${billingCycle === 'yearly' ? 'active' : ''}`}>
              Yearly <span className="save-tag">SAVE 33%</span>
            </span>
          </div>

          {/* Pricing Grid */}
          <div className="pricing-cards-grid">
            {/* Free Tier Card */}
            <div className="card-premium plan-card">
              <h3>Curio Starter</h3>
              <div className="price-display">
                <span className="amount">$0</span>
                <span className="period">forever free</span>
              </div>
              <p className="plan-summary">Great for testing out the absolute basics of counting and trivia.</p>
              <ul className="plan-features">
                <li><Check size={16} color="#2ecc71" /> Free Abacus Simulator</li>
                <li><Check size={16} color="#2ecc71" /> Starter 4 Abacus Challenges</li>
                <li><Check size={16} color="#2ecc71" /> Nature & Animals Quiz Category</li>
                <li className="disabled"><Lock size={14} /> Advanced space & geography quizzes</li>
                <li className="disabled"><Lock size={14} /> Parent verification analytical dashboard</li>
              </ul>
              <button className="btn-bouncy blue btn-plan disabled" disabled>
                Active Starter Plan
              </button>
            </div>

            {/* Premium Tier Card */}
            <div className="card-premium plan-card premium-selected animate-float">
              <div className="popular-badge">🌟 RECOMMENDED 🌟</div>
              <h3>Curio Pro Club</h3>
              <div className="price-display">
                <span className="amount">{currentPrice}</span>
                <span className="period">{billingPeriod}</span>
              </div>
              <p className="plan-summary">Complete unlimited interactive access for advanced future geniuses!</p>
              <ul className="plan-features">
                <li><Check size={16} color="#2ecc71" /> <strong>Everything in Starter</strong></li>
                <li><Check size={16} color="#2ecc71" /> All Abacus Challenges (1 to 8)</li>
                <li><Check size={16} color="#2ecc71" /> Advanced Space & Geography Quizzes</li>
                <li><Check size={16} color="#2ecc71" /> Infinite custom levels & math gates</li>
                <li><Check size={16} color="#2ecc71" /> Complete Parents performance tracker</li>
                <li><Check size={16} color="#2ecc71" /> 7-day money-back parenting guarantee</li>
              </ul>
              <button 
                className="btn-bouncy purple btn-plan btn-checkout-action"
                onClick={triggerCheckout}
              >
                Get Pro Access Now <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Soft-edge Preview Divider */}
          <div className="premium-sneak-peek-header">
            <h3>Sneak Peek: What Pro Club Unlocks 🔒</h3>
          </div>
          
          <div className="soft-edge-fade-container">
            <div className="preview-locked-content">
              <div className="locked-badge-pill">🔒 PRO LEVEL UNLOCKED PREVIEW</div>
              <div className="preview-card-grid">
                <div className="preview-mini-card">
                  <div className="mini-card-icon">🪐</div>
                  <h4>Outer Deep Space Quiz</h4>
                  <p>Solve queries about giant black holes, supernova collisions, and galaxy mappings.</p>
                </div>
                <div className="preview-mini-card">
                  <div className="mini-card-icon">🏔️</div>
                  <h4>World Wonders Geography</h4>
                  <p>Examine active volcanoes, coral reefs, and mountaintops in interactive maps.</p>
                </div>
                <div className="preview-mini-card">
                  <div className="mini-card-icon">📈</div>
                  <h4>Parent Analytics portal</h4>
                  <p>Visualize accurate progress graphs, time tracking, and cancel auto-renew anytime.</p>
                </div>
              </div>
            </div>
            <div className="fade-mask-overlay"></div>
          </div>
        </div>
      )}

      {/* 2. HIGH FIDELITY ANIMATED CHECKOUT INTERFACE */}
      {showCheckout && !success && (
        <div className="checkout-screen-container">
          <button className="btn-back-pricing" onClick={() => setShowCheckout(false)} disabled={processing}>
            ← Back to pricing
          </button>

          <div className="checkout-layout">
            {/* Visual Credit Card Component */}
            <div className="visual-card-wrapper">
              <div className={`credit-card-3d ${cardFocused ? 'flipped' : ''}`}>
                
                {/* Front Face */}
                <div className="card-face-side front-side">
                  <div className="card-front-decor">
                    <span className="card-logo">CurioKids Gold</span>
                    <span className="card-chip"></span>
                  </div>
                  <div className="card-visual-number">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </div>
                  <div className="card-visual-details">
                    <div className="details-col">
                      <span className="label">CARDHOLDER</span>
                      <span className="val">{cardName.toUpperCase() || "LITTLE EXPLORER"}</span>
                    </div>
                    <div className="details-col expiry-col">
                      <span className="label">EXPIRES</span>
                      <span className="val">{cardExpiry || "MM/YY"}</span>
                    </div>
                  </div>
                </div>

                {/* Back Face */}
                <div className="card-face-side back-side">
                  <div className="card-magnetic-strip"></div>
                  <div className="card-signature-box">
                    <span className="signature-line">Authorized Signee</span>
                    <span className="cvc-number-visual">{cardCvc || "•••"}</span>
                  </div>
                  <div className="card-back-decor">
                    <ShieldAlert size={14} /> 256-bit Golden Shield Secured
                  </div>
                </div>

              </div>
              <p className="card-flip-hint">💡 CVC field focus flips the card over!</p>
            </div>

            {/* Billing input form */}
            <div className="card-premium checkout-form-card">
              {processing ? (
                <div className="processing-payment-loader">
                  <div className="magical-spinner animate-bounce-slow">🔮</div>
                  <h3 className="proc-title">Processing Secure Payment</h3>
                  <div className="proc-step-container">
                    <p className="proc-active-step animate-float">{processingSteps[procStep]}</p>
                    <div className="progress-loader-bar">
                      <div className="loading-fill" style={{ width: `${((procStep + 1) / processingSteps.length) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePaymentSubmit} className="billing-form">
                  <h3>Secure Pro Checkout</h3>
                  <div className="checkout-price-pill">
                    Total Due: <strong>{billingCycle === 'monthly' ? '$9.99/mo' : '$79.99/yr'}</strong>
                  </div>

                  <div className="form-group">
                    <label htmlFor="card-name">Cardholder Name (Parent Name)</label>
                    <input 
                      type="text" 
                      id="card-name" 
                      placeholder="Jane Doe" 
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="card-num">Card Number</label>
                    <div className="input-with-icon">
                      <CreditCard size={18} className="input-decor-icon" />
                      <input 
                        type="text" 
                        id="card-num" 
                        placeholder="4111 2222 3333 4444" 
                        required
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="card-expiry">Expiration</label>
                      <input 
                        type="text" 
                        id="card-expiry" 
                        placeholder="MM/YY" 
                        required
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="card-cvc">CVC (3 Digits)</label>
                      <input 
                        type="text" 
                        id="card-cvc" 
                        placeholder="123" 
                        required
                        value={cardCvc}
                        onChange={handleCvcChange}
                        onFocus={() => setCardFocused(true)}
                        onBlur={() => setCardFocused(false)}
                      />
                    </div>
                  </div>

                  <div className="checkout-security-notice">
                    🔒 Mock payment page. Input any values to test the high-fidelity billing triggers!
                  </div>

                  <button type="submit" className="btn-bouncy purple btn-pay-now">
                    💳 Finalize Payment & Unlock
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. PAYMENT SUCCESSFUL SCREEN */}
      {success && (
        <div className="card-premium success-thank-you animate-float">
          <div className="success-badge-gold"><Award size={48} /></div>
          <h2>Welcome to the Club, Explorer!</h2>
          <p>Your subscription is active! You have unlocked all features of the **CurioKids Club**! Get ready to expand your mind!</p>
          
          <div className="unlocked-items-summary">
            <h3>✨ PRO BENEFITS NOW UNLOCKED ✨</h3>
            <ul className="success-benefits-list">
              <li>🔓 Complete Soroban challenges (1 to 8) with step-by-step additions</li>
              <li>🔓 Pro Planet & Earth Quiz arenas fully functional</li>
              <li>🔓 Secure Parents dashboard active for progress metrics & subscription controls</li>
              <li>🔓 Streaks multipliers & gold badge on your profile</li>
            </ul>
          </div>

          <button 
            className="btn-bouncy green btn-success-start-play animate-pulse"
            onClick={() => window.location.hash = '#abacus'} // Navigates to abacus simulator
          >
            🚀 Launch Pro Playground
          </button>
        </div>
      )}
    </div>
  );
}
