import React, { useState } from 'react';
import { 
  LEARN_CARDS_L1, 
  LEARN_CARDS_L2, 
  LEARN_CARDS_L3, 
  LEARN_CARDS_L4, 
  LEARN_CARDS_L5, 
  LearnCard 
} from '../data/gkLevels';
import { ChevronLeft, ChevronRight, Volume2, Sparkles, Trophy, BookOpen } from 'lucide-react';

interface LearnCardsProps {
  levelId: string;
  onBackToDashboard: () => void;
  onStartQuiz: (levelId: string) => void;
  lang: "en" | "hi";
}

export default function LearnCards({
  levelId,
  onBackToDashboard,
  onStartQuiz,
  lang
}: LearnCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  // Get matching card list
  const getCards = (): LearnCard[] => {
    switch (levelId) {
      case "1": return LEARN_CARDS_L1;
      case "2": return LEARN_CARDS_L2;
      case "3": return LEARN_CARDS_L3;
      case "4": return LEARN_CARDS_L4;
      case "5": return LEARN_CARDS_L5;
      default: return [];
    }
  };

  const cards = getCards();
  const currentCard = cards[activeIndex];

  const handleSpeech = () => {
    if (!currentCard) return;
    try {
      window.speechSynthesis.cancel();
      const speakText = `${currentCard.title}. ${currentCard.text}. Fun fact: ${currentCard.funFact}. Remember: ${currentCard.remember}`;
      const utterance = new SpeechSynthesisUtterance(speakText);
      
      const voices = window.speechSynthesis.getVoices();
      const premiumVoice = voices.find(v => 
        (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha")) && v.lang.startsWith("en")
      );
      if (premiumVoice) {
        utterance.voice = premiumVoice;
      }
      utterance.rate = 0.85;
      utterance.pitch = 1.15;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error(e);
    }
  };

  const stopSpeech = () => {
    try {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } catch (e){}
  };

  const handleNext = () => {
    stopSpeech();
    if (activeIndex < cards.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    stopSpeech();
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const labels = {
    en: {
      funFact: "💡 Fun Fact",
      remember: "⭐ Remember This!",
      back: "Back to Map",
      next: "Next Card",
      prev: "Previous",
      readyQuiz: "Ready for Quiz? 🎯",
      startQuiz: "Start Quiz",
      readAloud: "Read Aloud"
    },
    hi: {
      funFact: "💡 रोचक तथ्य",
      remember: "⭐ इसे याद रखें!",
      back: "पीछे",
      next: "आगे बढ़ें",
      prev: "पीछे",
      readyQuiz: "क्विज़ के लिए तैयार? 🎯",
      startQuiz: "क्विज़ खेलें",
      readAloud: "सुनें"
    }
  };

  if (cards.length === 0) {
    return (
      <div className="text-center p-8 font-body">
        No study cards found for this level.
        <button onClick={onBackToDashboard} className="mt-4 bg-primary-pink text-white px-4 py-2 rounded-2xl">
          Go Back
        </button>
      </div>
    );
  }

  const progressPercent = ((activeIndex + 1) / cards.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => { stopSpeech(); onBackToDashboard(); }}
          className="text-slate-500 hover:text-slate-800 font-kid text-sm bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm transition"
        >
          ← {labels[lang].back}
        </button>
        <span className="font-kid text-slate-500 text-sm">
          Card {activeIndex + 1} of {cards.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-8 border border-slate-200">
        <div 
          className="bg-primary-blue h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Main Study Card Paper */}
      <div className="bg-white border-4 border-dashed border-primary-blue/30 rounded-3xl p-6 sm:p-8 shadow-md relative min-h-[400px] flex flex-col justify-between">
        
        {/* Speak Reader floating button */}
        <button
          onClick={handleSpeech}
          className={`absolute top-4 right-4 flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition ${
            speaking 
              ? 'bg-primary-pink text-white animate-pulse' 
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Volume2 size={14} />
          <span className="font-kid">{labels[lang].readAloud}</span>
        </button>

        {/* Content body */}
        <div className="pt-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-5xl p-2 bg-slate-50 rounded-2xl">{currentCard.icon}</span>
            <h2 className="font-kid text-2xl text-slate-800">{currentCard.title}</h2>
          </div>

          <p className="text-lg text-slate-600 font-body mb-6 leading-relaxed">
            {currentCard.text}
          </p>

          {/* Fun Fact Block */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 mb-4">
            <h4 className="font-kid text-sm text-amber-700 mb-1">{labels[lang].funFact}</h4>
            <p className="text-sm text-slate-600 font-body">{currentCard.funFact}</p>
          </div>

          {/* Remember Block */}
          <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4">
            <h4 className="font-kid text-sm text-green-700 mb-1">{labels[lang].remember}</h4>
            <p className="text-sm font-kid text-slate-700 font-bold">{currentCard.remember}</p>
          </div>
        </div>

        {/* Controls Navigation */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="flex-1 flex items-center justify-center gap-1 py-3 border-2 border-slate-200 text-slate-600 font-kid rounded-2xl hover:bg-slate-50 transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft size={16} />
            <span>{labels[lang].prev}</span>
          </button>

          {activeIndex < cards.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-1 py-3 bg-primary-blue text-white font-kid rounded-2xl shadow hover:bg-opacity-95 transition active:scale-95"
            >
              <span>{labels[lang].next}</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => { stopSpeech(); onStartQuiz(levelId); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-primary-pink text-white font-kid rounded-2xl shadow-md hover:bg-opacity-95 transition active:scale-95 animate-pulse"
            >
              <Trophy size={16} />
              <span>{labels[lang].startQuiz}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
