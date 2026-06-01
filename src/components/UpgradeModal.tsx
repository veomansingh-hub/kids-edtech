import React, { useState } from 'react';
import { X, Check, CreditCard, Sparkles, QrCode } from 'lucide-react';
import { GKLevel } from '../data/gkLevels';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetLevel?: GKLevel | null;
  onUnlockSimulate: (levelId: string) => void;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  targetLevel,
  onUnlockSimulate
}: UpgradeModalProps) {
  const [activeTab, setActiveTab] = useState<'qr' | 'info'>('qr');
  const [selectedPack, setSelectedPack] = useState<'3' | '4' | '5' | 'all'>('all');
  const [simulatedPaying, setSimulatedPaying] = useState(false);
  const [simulationFinished, setSimulationFinished] = useState(false);

  // Sync selected level from props if present
  React.useEffect(() => {
    if (targetLevel) {
      setSelectedPack(targetLevel.id as any);
    }
  }, [targetLevel]);

  if (!isOpen) return null;

  const upiId = "6375367713@upi";
  
  const getPrice = () => {
    switch (selectedPack) {
      case '3': return 99;
      case '4': return 149;
      case '5': return 199;
      case 'all': return 399;
    }
  };

  const getDeepLink = () => {
    const amt = getPrice();
    return `upi://pay?pa=${upiId}&pn=CurioKids&cu=INR&am=${amt}`;
  };

  const handleSimulatePayment = () => {
    // Show a loader representing payment processing
    // NOTE FOR PRODUCTION: For automated verification, integrate standard REST APIs from payment gateways
    // like Razorpay, Cashfree, or PhonePe PG which trigger instant webhooks upon successful checkouts.
    setSimulatedPaying(true);
    setTimeout(() => {
      setSimulatedPaying(false);
      setSimulationFinished(true);
      onUnlockSimulate(selectedPack);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl relative font-body border-4 border-dashed border-primary-yellow/40">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 p-2 rounded-full transition"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <span className="text-4xl animate-bounce inline-block mb-2">🚀</span>
            <h2 className="font-kid text-2xl text-slate-800">CurioKids Premium Upgrade</h2>
            <p className="text-xs text-slate-400 font-body mt-1">Unlock advanced space, history, and world geography worksheets!</p>
          </div>

          {!simulationFinished ? (
            <div>
              {/* Plan selectors */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  onClick={() => setSelectedPack('3')}
                  className={`p-3 rounded-2xl border-2 text-center transition ${
                    selectedPack === '3' ? 'border-primary-pink bg-pink-50/20' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <span className="text-xs font-kid text-slate-500 block">Level 3: Space</span>
                  <span className="font-kid text-lg text-slate-800 font-bold">₹99</span>
                </button>

                <button
                  onClick={() => setSelectedPack('4')}
                  className={`p-3 rounded-2xl border-2 text-center transition ${
                    selectedPack === '4' ? 'border-primary-pink bg-pink-50/20' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <span className="text-xs font-kid text-slate-500 block">Level 4: History</span>
                  <span className="font-kid text-lg text-slate-800 font-bold">₹149</span>
                </button>

                <button
                  onClick={() => setSelectedPack('5')}
                  className={`p-3 rounded-2xl border-2 text-center transition ${
                    selectedPack === '5' ? 'border-primary-pink bg-pink-50/20' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <span className="text-xs font-kid text-slate-500 block">Level 5: World</span>
                  <span className="font-kid text-lg text-slate-800 font-bold">₹199</span>
                </button>

                <button
                  onClick={() => setSelectedPack('all')}
                  className={`p-3 rounded-2xl border-2 text-center transition ${
                    selectedPack === 'all' ? 'border-primary-pink bg-pink-50/20' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <span className="text-xs font-kid text-slate-500 block">Full Learning Pack</span>
                  <span className="font-kid text-lg text-slate-800 font-bold">₹399</span>
                </button>
              </div>

              {/* UPI Options */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center mb-6">
                <span className="text-xs text-slate-400 font-body block mb-1">Target UPI merchant</span>
                <span className="font-kid text-slate-700 font-bold text-base bg-white border border-slate-200 px-3 py-1 rounded-full">{upiId}</span>
                
                {/* Deep Link Button */}
                <a
                  href={getDeepLink()}
                  className="w-full mt-4 bg-primary-pink text-white font-kid py-3 rounded-2xl shadow hover:bg-opacity-95 transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <CreditCard size={18} />
                  <span>Pay ₹{getPrice()} via UPI App</span>
                </a>
              </div>

              {/* Instructions */}
              <div className="text-xs text-slate-500 font-body space-y-2 border-t border-slate-100 pt-4">
                <h4 className="font-kid text-slate-700">How it works:</h4>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Tap the button above to pay using GPay, PhonePe, Paytm, or BHIM.</li>
                  <li>Alternatively, scan the QR code to transfer <b>₹{getPrice()}</b>.</li>
                  <li>Take a screenshot of the successful transaction.</li>
                  <li>Send the screenshot to your school admin or WhatsApp contact to complete activation.</li>
                </ol>
              </div>

              {/* Simulation triggers for prototype */}
              <div className="border-t border-slate-100 pt-4 mt-6">
                {simulatedPaying ? (
                  <div className="text-center font-kid text-xs text-slate-500 animate-pulse">
                    🚀 Contacting UPI gateway interface... Please wait...
                  </div>
                ) : (
                  <button
                    onClick={handleSimulatePayment}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-kid text-xs py-2 rounded-xl border border-slate-200 transition"
                  >
                    Simulate Payment Completion (Prototype Only)
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <span className="text-5xl animate-bounce block mb-4">🎉</span>
              <h3 className="font-kid text-2xl text-slate-800">Simulated Payment Received!</h3>
              <p className="text-sm font-body text-slate-500 mb-6">
                Level unlocks have been applied to this child profile. Happy learning!
              </p>
              <button
                onClick={() => {
                  setSimulationFinished(false);
                  onClose();
                }}
                className="bg-primary-pink text-white font-kid px-6 py-2.5 rounded-2xl shadow hover:bg-opacity-95 transition"
              >
                Close Portal
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
export { UpgradeModal };
