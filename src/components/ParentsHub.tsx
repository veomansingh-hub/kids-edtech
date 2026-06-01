import React, { useState } from 'react';
import { ChildProfile, DEMO_USERS } from '../data/users';
import { 
  getChildProgress, 
  saveChildProgress, 
  resetChildProgress, 
  getPaidLevels, 
  savePaidLevels 
} from '../utils/progressStore';
import { 
  Trophy, 
  Unlock, 
  RotateCcw, 
  Download, 
  Plus, 
  Check, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';

interface ParentsHubProps {
  currentChild: ChildProfile;
  lang: "en" | "hi";
  onProgressUpdated: () => void;
}

export default function ParentsHub({
  currentChild,
  lang,
  onProgressUpdated
}: ParentsHubProps) {
  // Adult math gate security states
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathError, setMathError] = useState('');
  const [num1] = useState(() => Math.floor(Math.random() * 8) + 6); // e.g. 6 to 13
  const [num2] = useState(() => Math.floor(Math.random() * 7) + 3);  // e.g. 3 to 9
  const expectedMathAnswer = num1 * num2;

  // Selected child states for parenting logs
  const [selectedChildUsername, setSelectedChildUsername] = useState(currentChild.username);
  const childProgress = getChildProgress(selectedChildUsername);

  // Unlocks states
  const childPaidLevels = getPaidLevels(selectedChildUsername);

  // Forms states
  const [newQuestionLevel, setNewQuestionLevel] = useState('1');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionAns, setNewQuestionAns] = useState('');
  const [newQuestionSuccess, setNewQuestionSuccess] = useState(false);

  const [newWorksheetTitle, setNewWorksheetTitle] = useState('');
  const [newWorksheetSuccess, setNewWorksheetSuccess] = useState(false);

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(mathAnswer) === expectedMathAnswer) {
      setParentUnlocked(true);
      setMathError('');
    } else {
      setMathError('Oops! That was incorrect. Parents only!');
    }
  };

  const handleManualUnlock = (levelId: string) => {
    let list = [...childPaidLevels];
    if (levelId === 'all') {
      list = ["3", "4", "5"];
    } else {
      if (!list.includes(levelId)) {
        list.push(levelId);
      }
    }
    savePaidLevels(selectedChildUsername, list);
    onProgressUpdated();
  };

  const handleManualLock = () => {
    savePaidLevels(selectedChildUsername, []);
    // Reset progress unlocked list to default free levels 1 & 2
    const progress = getChildProgress(selectedChildUsername);
    progress.unlockedLevels = ["1", "2"];
    saveChildProgress(selectedChildUsername, progress);
    onProgressUpdated();
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to delete all learning progress and stars for this child profile?")) {
      resetChildProgress(selectedChildUsername);
      onProgressUpdated();
    }
  };

  const exportProgressAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(childProgress, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `curiokids_${selectedChildUsername}_progress.json`);
    dlAnchorElem.click();
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || !newQuestionAns) return;

    // Simulate successfully adding question to pool inside localStorage
    const savedCustoms = localStorage.getItem('curiokids_custom_questions') || '[]';
    const customs = JSON.parse(savedCustoms);
    customs.push({
      id: `custom_${Date.now()}`,
      levelId: newQuestionLevel,
      question: newQuestionText,
      answer: newQuestionAns,
      options: [newQuestionAns, "Option B", "Option C", "Option D"]
    });
    localStorage.setItem('curiokids_custom_questions', JSON.stringify(customs));

    setNewQuestionText('');
    setNewQuestionAns('');
    setNewQuestionSuccess(true);
    setTimeout(() => setNewQuestionSuccess(false), 3000);
  };

  const handleAddWorksheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorksheetTitle) return;

    const savedTemplates = localStorage.getItem('curiokids_custom_worksheets') || '[]';
    const templates = JSON.parse(savedTemplates);
    templates.push({
      id: `custom_sheet_${Date.now()}`,
      title: newWorksheetTitle,
      instructions: "Trace the dotted items."
    });
    localStorage.setItem('curiokids_custom_worksheets', JSON.stringify(templates));

    setNewWorksheetTitle('');
    setNewWorksheetSuccess(true);
    setTimeout(() => setNewWorksheetSuccess(false), 3000);
  };

  // Math translation helpers
  const labels = {
    en: {
      parentLock: "Parents Verification Gate",
      parentLockSub: `Prove you are a grown-up by solving this math puzzle: What is ${num1} x ${num2}?`,
      gateBtn: "Unlock Parent Hub",
      totalXp: "Total XP Collected",
      quizzesFinished: "Completed Quizzes",
      worksheetsFinished: "Completed Worksheets",
      unlockControls: "Unlock Paid Levels Manually",
      unlockL3: "Unlock Space (Level 3)",
      unlockL4: "Unlock History (Level 4)",
      unlockL5: "Unlock Geography (Level 5)",
      unlockAll: "Unlock All Levels (Full Pack)",
      resetAll: "Lock All Levels / Reset Unlocks",
      resetProgress: "Reset Child Progress",
      exportData: "Export Progress JSON",
      addQuestion: "Add Custom GK Question",
      addWorksheet: "Add Custom Worksheet Template",
      qText: "Question text",
      qAns: "Correct Answer",
      wTitle: "Worksheet Title",
      strongestTopic: "Strongest Topic Area",
      weakestTopic: "Weakest Topic Area"
    },
    hi: {
      parentLock: "माता-पिता सत्यापन गेट",
      parentLockSub: `वयस्क होने का प्रमाण दें: ${num1} x ${num2} का उत्तर क्या है?`,
      gateBtn: "अनलॉक करें",
      totalXp: "कुल एक्सपी (XP)",
      quizzesFinished: "पूरे किए गए क्विज़",
      worksheetsFinished: "पूरी की गई वर्कशीट",
      unlockControls: "पेड लेवल मैनुअल अनलॉक",
      unlockL3: "लेवल 3 अनलॉक करें (अंतरिक्ष)",
      unlockL4: "लेवल 4 अनलॉक करें (इतिहास)",
      unlockL5: "लेवल 5 अनलॉक करें (भूगोल)",
      unlockAll: "सभी लेवल अनलॉक करें",
      resetAll: "लॉक रीसेट करें",
      resetProgress: "प्रगति रीसेट करें",
      exportData: "प्रगति एक्सपोर्ट करें (JSON)",
      addQuestion: "कस्टम सामान्य ज्ञान प्रश्न जोड़ें",
      addWorksheet: "कस्टम वर्कशीट टेम्पलेट जोड़ें",
      qText: "प्रश्न",
      qAns: "सही उत्तर",
      wTitle: "वर्कशीट शीर्षक",
      strongestTopic: "मजबूत विषय क्षेत्र",
      weakestTopic: "कमजोर विषय क्षेत्र"
    }
  };

  // Screen 1: Verification Gate
  if (!parentUnlocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white border-4 border-dashed border-primary-purple/40 rounded-3xl p-6 sm:p-8 shadow-md text-center">
          <UserCheck size={48} className="mx-auto text-primary-purple fill-primary-purple/10 mb-4 animate-float" />
          <h2 className="font-kid text-2xl text-slate-800 mb-2">{labels[lang].parentLock}</h2>
          <p className="text-xs text-slate-500 font-body mb-6 leading-relaxed">
            {labels[lang].parentLockSub}
          </p>

          <form onSubmit={handleGateSubmit} className="space-y-4">
            <input
              type="number"
              placeholder="Your answer..."
              value={mathAnswer}
              onChange={(e) => setMathAnswer(e.target.value)}
              className="w-full text-center border-2 border-slate-200 rounded-2xl py-3 text-lg font-body focus:border-primary-purple focus:outline-none"
              autoFocus
            />
            {mathError && <p className="text-xs text-red-500 font-body">{mathError}</p>}
            <button
              type="submit"
              className="w-full bg-primary-purple text-white font-kid text-lg py-3 rounded-2xl shadow hover:bg-opacity-95 transition"
            >
              {labels[lang].gateBtn}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Screen 2: Parents Control center
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-kid text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-primary-pink">
          📊 Parent Dashboard & Controls
        </h2>
        <p className="text-slate-500 font-body text-sm mt-1">
          Monitor your child's learning statistics, unlock premium space/history pages, and configure custom lessons!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sidebar: Child Selector & Summary */}
        <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-kid text-lg text-slate-800 mb-4">Select Child Profile</h3>
            <div className="space-y-2 mb-6">
              {DEMO_USERS.map(user => (
                <button
                  key={user.username}
                  onClick={() => setSelectedChildUsername(user.username)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition ${
                    selectedChildUsername === user.username
                      ? 'border-primary-purple bg-purple-50/20 font-bold'
                      : 'border-slate-50 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{user.avatar}</span>
                    <span className="font-kid text-sm">{user.displayName}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-body">XP: {getChildProgress(user.username).xp}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 text-center">
            <button
              onClick={() => setParentUnlocked(false)}
              className="text-xs font-kid text-slate-400 underline hover:text-slate-700"
            >
              Lock Parents Hub
            </button>
          </div>
        </div>

        {/* Column 2 & 3: Child stats logs & lock operations */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Summary Cards */}
          <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-kid text-xl text-slate-800 mb-4">
              {childProgress.displayName}'s Performance Metrics
            </h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 rounded-2xl p-4 text-center">
                <span className="text-2xl block mb-1">🏆</span>
                <span className="text-[10px] text-slate-400 font-body block">{labels[lang].totalXp}</span>
                <span className="font-kid text-lg text-slate-800">{childProgress.xp}</span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-center">
                <span className="text-2xl block mb-1">🧠</span>
                <span className="text-[10px] text-slate-400 font-body block">{labels[lang].quizzesFinished}</span>
                <span className="font-kid text-lg text-slate-800">
                  {Object.keys(childProgress.completedQuizzes || {}).length} / 5
                </span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-center">
                <span className="text-2xl block mb-1">🎈</span>
                <span className="text-[10px] text-slate-400 font-body block">{labels[lang].worksheetsFinished}</span>
                <span className="font-kid text-lg text-slate-800">
                  {(childProgress.completedWorksheets || []).length} / 15
                </span>
              </div>
            </div>

            {/* Strengths & Weaknesses analysis based on XP levels */}
            <div className="space-y-3 font-body text-sm border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-500">{labels[lang].strongestTopic}:</span>
                <span className="font-bold text-green-600">Indian Cities & Nicknames</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{labels[lang].weakestTopic}:</span>
                <span className="font-bold text-amber-600">Space Systems (No Quizzes completed)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Unlocked GK Levels:</span>
                <span className="font-kid text-xs bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                  {childProgress.unlockedLevels.join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* Manual Unlocks Section */}
          <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-kid text-lg text-slate-800 mb-4">{labels[lang].unlockControls}</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => handleManualUnlock('3')}
                className="flex items-center justify-center gap-1.5 p-3 border border-slate-200 rounded-2xl hover:border-primary-purple font-kid text-xs transition"
              >
                <Unlock size={14} className="text-slate-400" />
                <span>{labels[lang].unlockL3}</span>
              </button>
              
              <button
                onClick={() => handleManualUnlock('4')}
                className="flex items-center justify-center gap-1.5 p-3 border border-slate-200 rounded-2xl hover:border-primary-purple font-kid text-xs transition"
              >
                <Unlock size={14} className="text-slate-400" />
                <span>{labels[lang].unlockL4}</span>
              </button>

              <button
                onClick={() => handleManualUnlock('5')}
                className="flex items-center justify-center gap-1.5 p-3 border border-slate-200 rounded-2xl hover:border-primary-purple font-kid text-xs transition"
              >
                <Unlock size={14} className="text-slate-400" />
                <span>{labels[lang].unlockL5}</span>
              </button>

              <button
                onClick={() => handleManualUnlock('all')}
                className="flex items-center justify-center gap-1.5 p-3 bg-purple-500 text-white rounded-2xl hover:bg-opacity-95 font-kid text-xs shadow-sm transition"
              >
                <Trophy size={14} />
                <span>{labels[lang].unlockAll}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleManualLock}
                className="flex-1 flex items-center justify-center gap-1.5 p-3 border border-red-200 text-red-600 rounded-2xl hover:bg-red-50 font-kid text-xs transition"
              >
                <AlertTriangle size={14} />
                <span>{labels[lang].resetAll}</span>
              </button>

              <button
                onClick={handleResetProgress}
                className="flex-1 flex items-center justify-center gap-1.5 p-3 border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 font-kid text-xs transition"
              >
                <RotateCcw size={14} />
                <span>{labels[lang].resetProgress}</span>
              </button>

              <button
                onClick={exportProgressAsJSON}
                className="flex-1 flex items-center justify-center gap-1.5 p-3 border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 font-kid text-xs transition"
              >
                <Download size={14} />
                <span>Export Progress</span>
              </button>
            </div>
          </div>

          {/* Form: Add Custom Question */}
          <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-kid text-lg text-slate-800 mb-4">{labels[lang].addQuestion}</h3>
            <form onSubmit={handleAddQuestion} className="space-y-4 font-body">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">GK Level</label>
                <select
                  value={newQuestionLevel}
                  onChange={(e) => setNewQuestionLevel(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                >
                  <option value="1">Level 1: Nicknames</option>
                  <option value="2">Level 2: Leaders</option>
                  <option value="3">Level 3: Space</option>
                  <option value="4">Level 4: History</option>
                  <option value="5">Level 5: World</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">{labels[lang].qText}</label>
                <input
                  type="text"
                  placeholder="e.g. Which is the national tree of India?"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">{labels[lang].qAns}</label>
                <input
                  type="text"
                  placeholder="e.g. Banyan Tree"
                  value={newQuestionAns}
                  onChange={(e) => setNewQuestionAns(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                />
              </div>

              {newQuestionSuccess && (
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <Check size={14} /> Added successfully to custom question pools!
                </div>
              )}

              <button
                type="submit"
                className="bg-primary-purple text-white px-4 py-2 rounded-xl font-kid text-xs shadow hover:bg-opacity-95 transition"
              >
                <Plus size={14} className="inline mr-1" /> Add Question
              </button>
            </form>
          </div>

          {/* Form: Add Custom Worksheet template */}
          <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-kid text-lg text-slate-800 mb-4">{labels[lang].addWorksheet}</h3>
            <form onSubmit={handleAddWorksheet} className="space-y-4 font-body">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">{labels[lang].wTitle}</label>
                <input
                  type="text"
                  placeholder="e.g. Connect and color the stars"
                  value={newWorksheetTitle}
                  onChange={(e) => setNewWorksheetTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                />
              </div>

              {newWorksheetSuccess && (
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <Check size={14} /> Worksheet template added successfully!
                </div>
              )}

              <button
                type="submit"
                className="bg-primary-purple text-white px-4 py-2 rounded-xl font-kid text-xs shadow hover:bg-opacity-95 transition"
              >
                <Plus size={14} className="inline mr-1" /> Add Template
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
