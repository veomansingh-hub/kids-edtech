import React, { useState, useEffect } from 'react';
import { Check, ShieldAlert, Sparkles, CreditCard, Lock, ArrowRight, Award, Copy, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import './SubscriptionPaywall.css';

export default function SubscriptionPaywall({ isPro, setProState }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' or 'card'
  const [processing, setProcessing] = useState(false);
  const [procStep, setProcStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form states
  const [utrNumber, setUtrNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardFocused, setCardFocused] = useState(false);

  const upiId = "6375367713@upi";
  const amountToPay = billingCycle === 'monthly' ? 1000 : 10000;

  const processingSteps = [
    "Initiating secure payment handshake... 🤝",
    "Verifying transaction with National Payments Corporation (NPCI)... 🏦",
    "Confirming UPI reference status with magic nodes... ✨",
    "Validating secure locks to open cognitive Level 2 - 5... 🗝️",
    "Payment verified successfully! Welcome to Pro Club! 🎉"
  ];

  useEffect(() => {
    let timer;
    if (processing && procStep < processingSteps.length - 1) {
      timer = setTimeout(() => {
        setProcStep(s => s + 1);
      }, 1000);
    } else if (processing && procStep === processingSteps.length - 1) {
      timer = setTimeout(() => {
        setProcessing(false);
        setSuccess(true);
        setProState(true); // Unlock globally
        playSuccessConfetti();
      }, 1200);
    }
    return () => clearTimeout(timer);
  }, [processing, procStep]);

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'upi') {
      if (utrNumber.trim().length < 8) {
        alert("Please enter a valid 12-digit UPI Ref Number / UTR ID!");
        return;
      }
    } else {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
        alert("Please fill out all card details!");
        return;
      }
    }
    setProcessing(true);
    setProcStep(0);
  };

  const playSuccessConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  // UPI mobile direct payment link scheme
  const upiUrl = `upi://pay?pa=${upiId}&pn=CurioKids&am=${amountToPay}&cu=INR&tn=CurioKidsPro`;

  return (
    <div className="paywall-container">
      {!showCheckout && !success && (
        <div className="paywall-hero animate-float">
          <div className="premium-header-icon animate-bounce-slow">✨👑✨</div>
          <h1 className="paywall-title">Join the <span className="text-gradient-purple">CurioKids Pro Club</span></h1>
          <p className="paywall-subtitle">Unlock Levels 2 to 5, text-to-speech audio tools, and comprehensive parental growth trackers!</p>

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
              Yearly <span className="save-tag">SAVE 17%</span>
            </span>
          </div>

          {/* Pricing Grid */}
          <div className="pricing-cards-grid">
            <div className="card-premium plan-card">
              <h3>Curio Starter</h3>
              <div className="price-display">
                <span className="amount">₹0</span>
                <span className="period">forever free</span>
              </div>
              <p className="plan-summary">Perfect for testing out the absolute basics of Indian cities trivia.</p>
              <ul className="plan-features">
                <li><Check size={16} color="#2ecc71" /> Free Access to Level 1</li>
                <li><Check size={16} color="#2ecc71" /> English & Hindi Audio Tools</li>
                <li className="disabled"><Lock size={14} /> Full access to Levels 2, 3, 4 & 5</li>
                <li className="disabled"><Lock size={14} /> Detailed daily child study time trackers</li>
                <li className="disabled"><Lock size={14} /> Parent cognitive growth recommendations</li>
              </ul>
              <button className="btn-bouncy blue btn-plan disabled" disabled>
                Active Starter Plan
              </button>
            </div>

            <div className="card-premium plan-card premium-selected animate-float">
              <div className="popular-badge">🌟 BEST VALUE 🌟</div>
              <h3>Curio Pro Club</h3>
              <div className="price-display">
                <span className="amount">
                  {billingCycle === 'monthly' ? '₹1,000' : '₹10,000'}
                </span>
                <span className="period">{billingCycle === 'monthly' ? '/ month' : '/ year (billed annually)'}</span>
              </div>
              <p className="plan-summary">Unlocks all 5 levels, voice synthesis readers, and parent analytics!</p>
              <ul className="plan-features">
                <li><Check size={16} color="#2ecc71" /> <strong>Everything in Starter</strong></li>
                <li><Check size={16} color="#2ecc71" /> All GK Levels 2, 3, 4 & 5 Active</li>
                <li><Check size={16} color="#2ecc71" /> Independent trackers for up to 5 kids</li>
                <li><Check size={16} color="#2ecc71" /> Live daily study time charts</li>
                <li><Check size={16} color="#2ecc71" /> Personalized growth insights per kid</li>
                <li><Check size={16} color="#2ecc71" /> Direct instant UPI unlocking</li>
              </ul>
              <button 
                className="btn-bouncy purple btn-plan btn-checkout-action animate-pulse"
                onClick={() => setShowCheckout(true)}
              >
                Unlock Pro Playground <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CHECKOUT SCREEN */}
      {showCheckout && !success && (
        <div className="checkout-screen-container">
          <button className="btn-back-pricing" onClick={() => setShowCheckout(false)} disabled={processing}>
            ← Back to pricing
          </button>

          <div className="checkout-layout">
            {/* Left side: Payment visual block */}
            <div className="visual-card-wrapper">
              {paymentMethod === 'upi' ? (
                /* UPI SCANNER BOX */
                <div className="card-premium upi-qr-scanner-card animate-float">
                  <div className="upi-qr-header">
                    <span className="upi-icon-badge">📱 UPI</span>
                    <strong>Scan to Pay</strong>
                  </div>
                  
                  {/* Styled pure CSS mock QR Code */}
                  <div className="mock-qr-code-box">
                    <div className="qr-corner top-l"></div>
                    <div className="qr-corner top-r"></div>
                    <div className="qr-corner bot-l"></div>
                    <div className="qr-corner bot-r"></div>
                    <div className="qr-center-logo">✨</div>
                    <div className="qr-pixel-matrix"></div>
                  </div>

                  <div className="upi-details-label">
                    <span>Payable Amount: </span>
                    <strong>₹{amountToPay.toLocaleString('en-IN')}</strong>
                  </div>

                  {/* Copyable UPI ID row */}
                  <div className="upi-id-copy-row">
                    <code>{upiId}</code>
                    <button className="btn-copy-upi" onClick={copyUpiId}>
                      {copied ? <CheckCircle size={16} color="#2ecc71" /> : <Copy size={16} />}
                    </button>
                  </div>

                  {/* Direct Mobile pay button */}
                  <a href={upiUrl} className="btn-bouncy blue btn-mobile-pay-intent">
                    ⚡ Tap to Pay on Mobile
                  </a>
                </div>
              ) : (
                /* CREDIT CARD VISUALIZER */
                <div className="credit-card-3d-wrapper">
                  <div className={`credit-card-3d ${cardFocused ? 'flipped' : ''}`}>
                    <div className="card-face-side front-side">
                      <div className="card-front-decor">
                        <span className="card-logo">CurioKids Gold</span>
                        <span className="card-chip"></span>
                      </div>
                      <div className="card-visual-number">{cardNumber || "•••• •••• •••• ••••"}</div>
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
                    <div className="card-face-side back-side">
                      <div className="card-magnetic-strip"></div>
                      <div className="card-signature-box">
                        <span className="signature-line">Authorized Signee</span>
                        <span className="cvc-number-visual">{cardCvc || "•••"}</span>
                      </div>
                      <div className="card-back-decor">
                        <ShieldAlert size={14} /> Secured Gate
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment selector tabs */}
              <div className="payment-method-selector-tabs">
                <button 
                  className={`payment-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  📱 UPI Instant Transfer
                </button>
                <button 
                  className={`payment-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  💳 Credit Card / Debit
                </button>
              </div>
            </div>

            {/* Right side: Input verification fields */}
            <div className="card-premium checkout-form-card">
              {processing ? (
                <div className="processing-payment-loader">
                  <div className="magical-spinner animate-bounce-slow">🔮</div>
                  <h3 className="proc-title">Verifying Payment Status</h3>
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
                    Amount: <strong>₹{amountToPay.toLocaleString('en-IN')}</strong>
                  </div>

                  {paymentMethod === 'upi' ? (
                    /* UPI SUBMISSION FORM */
                    <div className="upi-submission-fields">
                      <p className="upi-instructions">
                        1. Scan the QR code or transfer to **`6375367713@upi`** using GPay, PhonePe, Paytm, or BHIM.  
                        2. Paste your **12-digit UPI UTR / Transaction Reference ID** below to verify and instantly activate Pro!
                      </p>

                      <div className="form-group">
                        <label htmlFor="utr-input">12-Digit UPI Transaction Ref Number / UTR ID</label>
                        <input 
                          type="text" 
                          id="utr-input"
                          placeholder="e.g. 340982348512"
                          maxLength={12}
                          required
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>

                      <button type="submit" className="btn-bouncy purple btn-pay-now">
                        🚀 Verify & Unlock Pro Levels
                      </button>
                    </div>
                  ) : (
                    /* CREDIT CARD FORM */
                    <div className="card-submission-fields">
                      <div className="form-group">
                        <label htmlFor="card-name">Cardholder Name</label>
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
                        <input 
                          type="text" 
                          id="card-num" 
                          placeholder="4111 2222 3333 4444" 
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || '')}
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="card-expiry">Expiry</label>
                          <input 
                            type="text" 
                            id="card-expiry" 
                            placeholder="MM/YY" 
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').slice(0,4).replace(/(.{2})/, '$1/'))}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="card-cvc">CVC</label>
                          <input 
                            type="text" 
                            id="card-cvc" 
                            placeholder="123" 
                            required
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0,3))}
                            onFocus={() => setCardFocused(true)}
                            onBlur={() => setCardFocused(false)}
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn-bouncy purple btn-pay-now">
                        💳 Pay ₹{amountToPay.toLocaleString('en-IN')} & Unlock
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. SUCCESS SCREEN */}
      {success && (
        <div className="card-premium success-thank-you animate-float">
          <div className="success-badge-gold">👑</div>
          <h2>Welcome to Pro Club, Explorer!</h2>
          <p>Your subscription is active! You have unlocked all 5 progressive GK Levels, English/Hindi audio readers, and parent analytics!</p>
          <button 
            className="btn-bouncy green btn-success-start-play animate-pulse"
            onClick={() => window.location.hash = '#gk'}
          >
            🚀 Launch Pro Quest Arena
          </button>
        </div>
      )}
    </div>
  );
}
