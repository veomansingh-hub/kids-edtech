import React, { useState, useEffect, useRef } from 'react';
import { 
  NURSERY_ACTIVITIES, 
  NurseryActivity 
} from '../data/nurseryActivities';
import { 
  Volume2, 
  Printer, 
  Star, 
  RefreshCw, 
  Sparkles, 
  Trophy,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NurseryPlayroomProps {
  username: string;
  onWorksheetFinished: (activityId: string, stars: number) => void;
  lang: "en" | "hi";
}

export default function NurseryPlayroom({
  username,
  onWorksheetFinished,
  lang
}: NurseryPlayroomProps) {
  const [selectedActivity, setSelectedActivity] = useState<NurseryActivity | null>(null);
  
  // Active worksheet state variables
  const [leftCol, setLeftCol] = useState<any[]>([]);
  const [rightCol, setRightCol] = useState<any[]>([]);
  const [matches, setMatches] = useState<{[key: string]: string}>({});
  const [selectedItem, setSelectedItem] = useState<{id: string, side: 'left' | 'right'} | null>(null);
  const [stars, setStars] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Specific Activity States
  const [oddOneItems, setOddOneItems] = useState<any[]>([]);
  const [biggestItems, setBiggestItems] = useState<any[]>([]);
  const [oddColorShapeItems, setOddColorShapeItems] = useState<any[]>([]);
  const [balloonFills, setBalloonFills] = useState<{[key: string]: string}>({});
  const [legendFills, setLegendFills] = useState<{[key: string]: string}>({});
  const [activeColor, setActiveColor] = useState<string>('red');
  const [recognitionOptions, setRecognitionOptions] = useState<string[]>([]);
  const [recognitionTarget, setRecognitionTarget] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  // Sound chimes
  const playSound = (correct: boolean) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      if (correct) {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else {
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      }
    } catch(e){}
  };

  const speakInstructions = () => {
    if (!selectedActivity) return;
    try {
      window.speechSynthesis.cancel();
      const text = selectedActivity.instructions;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.15;
      window.speechSynthesis.speak(utterance);
    } catch (e){}
  };

  // Tracing Line Canvas Event Handlers
  const startTracing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = activeColor === 'orange' ? '#ff7f50' : activeColor;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const traceLine = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopTracing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    
    // Auto-mark tracing worksheets as completed on mouse release
    if (!isCompleted) {
      setIsCompleted(true);
      setStars(3);
      playSound(true);
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw guide lines on clear
    drawGuideLines(ctx, canvas.width, canvas.height);
    setIsCompleted(false);
  };

  const drawGuideLines = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);

    // Draw wavy lines, zig-zags, and straight tracks based on current activity type
    if (selectedActivity?.id === 'act_4') {
      // Wavy Cloud Line
      ctx.beginPath();
      for (let x = 50; x < w - 50; x += 5) {
        let y = 100 + Math.sin(x * 0.05) * 20;
        if (x === 50) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Zig-Zag Line
      ctx.beginPath();
      ctx.moveTo(50, 200);
      for (let x = 100; x < w - 50; x += 80) {
        ctx.lineTo(x, x % 160 === 0 ? 170 : 230);
      }
      ctx.stroke();

      // Raindrops track
      for (let i = 0; i < 5; i++) {
        const xPos = 80 + i * (w - 160) / 4;
        ctx.beginPath();
        ctx.moveTo(xPos, 280);
        ctx.lineTo(xPos, 360);
        ctx.stroke();
      }
    } else if (selectedActivity?.id === 'act_7') {
      // Tracing Circle Outlines
      const circles = [
        { cx: w / 4, cy: h / 2, r: 50 },
        { cx: w / 2, cy: h / 2, r: 70 },
        { cx: 3 * w / 4, cy: h / 2, r: 60 }
      ];
      circles.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

    ctx.setLineDash([]); // Reset dash
  };

  // Start activity worksheet templates randomly
  const setupActivity = (act: NurseryActivity) => {
    setSelectedActivity(act);
    setIsCompleted(false);
    setStars(0);
    setMatches({});
    setSelectedItem(null);
    setBalloonFills({});
    setLegendFills({});

    const voices = window.speechSynthesis.getVoices();
    try {
      window.speechSynthesis.cancel();
    } catch(e){}

    // A. Match Same Object, Shape Matching, Match same shape, match other half
    if (act.type === 'matching' || act.type === 'shape-matching' || act.type === 'shape-match' || act.type === 'match-half') {
      let itemsList: any[] = [];
      if (act.type === 'matching') {
        itemsList = ["car", "fish", "kite", "bucket", "lollipop"].map(x => ({ id: x, val: x }));
      } else if (act.type === 'shape-matching') {
        itemsList = [
          { id: "circle", val: "Ball" },
          { id: "triangle", val: "Warning sign" },
          { id: "square", val: "Clock" },
          { id: "rectangle", val: "TV" },
          { id: "star", val: "Window" }
        ];
      } else if (act.type === 'shape-match') {
        itemsList = ["oval", "triangle", "rectangle", "heart", "square"].map(x => ({ id: x, val: x }));
      } else {
        // match other half
        itemsList = ["triangle", "rectangle", "circle", "semicircle"].map(x => ({ id: x, val: x }));
      }

      // Shuffle left & right columns automatically
      const left = [...itemsList].sort(() => Math.random() - 0.5);
      const right = [...itemsList].sort(() => Math.random() - 0.5);
      
      setLeftCol(left);
      setRightCol(right);
    }

    // B. Match the Colour
    if (act.type === 'colour-matching') {
      const itemsList = [
        { id: "apple", val: "red" },
        { id: "banana", val: "yellow" },
        { id: "orange", val: "orange" },
        { id: "grapes", val: "purple" },
        { id: "pear", val: "green" }
      ];
      setLeftCol([...itemsList].sort(() => Math.random() - 0.5));
      setRightCol([
        { id: "red", val: "red" },
        { id: "yellow", val: "yellow" },
        { id: "orange", val: "orange" },
        { id: "purple", val: "purple" },
        { id: "green", val: "green" }
      ].sort(() => Math.random() - 0.5));
    }

    // C. One and Many
    if (act.type === 'one-many') {
      const itemsList = [
        { id: "hat", val: "hats" },
        { id: "tree", val: "trees" },
        { id: "cap", val: "caps" },
        { id: "lemon", val: "lemons" },
        { id: "shell", val: "shells" }
      ];
      setLeftCol([...itemsList].sort(() => Math.random() - 0.5));
      setRightCol([...itemsList].sort(() => Math.random() - 0.5));
    }

    // D. Same or Different
    if (act.type === 'odd-one') {
      // 4 rows of items, each row contains 4 SVGs with 1 slightly different
      const rows = [
        { id: "row1", label: "Ice creams", items: ["🍦", "🍦", "🍧", "🍦"], oddIndex: 2 },
        { id: "row2", label: "Cupcakes", items: ["🧁", "🍩", "🧁", "🧁"], oddIndex: 1 },
        { id: "row3", label: "Arrows", items: ["➡️", "➡️", "➡️", "⬅️"], oddIndex: 3 },
        { id: "row4", label: "Balloons", items: ["🎈", "🎈", "🎈", "🎒"], oddIndex: 3 }
      ];
      setOddOneItems(rows.sort(() => Math.random() - 0.5));
    }

    // E. Circle Biggest One
    if (act.type === 'biggest') {
      const biggestPool = [
        { id: "cloud", items: [{ size: 'sm', text: "☁️" }, { size: 'lg', text: "☁️" }, { size: 'md', text: "☁️" }] },
        { id: "watermelon", items: [{ size: 'lg', text: "🍉" }, { size: 'sm', text: "🍉" }, { size: 'md', text: "🍉" }] },
        { id: "cup", items: [{ size: 'md', text: "🥤" }, { size: 'sm', text: "🥤" }, { size: 'lg', text: "🥤" }] },
        { id: "sun", items: [{ size: 'sm', text: "☀️" }, { size: 'lg', text: "☀️" }, { size: 'md', text: "☀️" }] }
      ];
      setBiggestItems(biggestPool.sort(() => Math.random() - 0.5));
    }

    // F. Circle Odd One Out (different color/shape)
    if (act.type === 'odd-color-shape') {
      const list = [
        { id: "row1", items: [{ shape: "Circle", color: "red" }, { shape: "Circle", color: "red" }, { shape: "Triangle", color: "red" }, { shape: "Circle", color: "red" }], oddIndex: 2 },
        { id: "row2", items: [{ shape: "Square", color: "blue" }, { shape: "Square", color: "yellow" }, { shape: "Square", color: "blue" }, { shape: "Square", color: "blue" }], oddIndex: 1 },
        { id: "row3", items: [{ shape: "Star", color: "green" }, { shape: "Star", color: "green" }, { shape: "Star", color: "green" }, { shape: "Star", color: "purple" }], oddIndex: 3 },
        { id: "row4", items: [{ shape: "Heart", color: "pink" }, { shape: "Oval", color: "pink" }, { shape: "Heart", color: "pink" }, { shape: "Heart", color: "pink" }], oddIndex: 1 }
      ];
      setOddColorShapeItems(list.sort(() => Math.random() - 0.5));
    }

    // G. Recognition
    if (act.type === 'recognition') {
      const recognitionList = ["lion", "butterfly", "rocket", "star", "flower"];
      const target = recognitionList[Math.floor(Math.random() * recognitionList.length)];
      setRecognitionTarget(target);
      setRecognitionOptions([...recognitionList].sort(() => Math.random() - 0.5));
    }

    // Canvas drawing reset
    setTimeout(() => {
      if (act.type === 'tracing' || act.type === 'trace-colour' || act.type === 'colouring') {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGuideLines(ctx, canvas.width, canvas.height);
          }
        }
      }
    }, 100);

    setTimeout(() => {
      speakInstructions();
    }, 400);
  };

  // Drag Match connections
  const handleItemClick = (id: string, side: 'left' | 'right') => {
    playSound(false);

    if (!selectedItem) {
      setSelectedItem({ id, side });
      return;
    }

    if (selectedItem.side === side) {
      setSelectedItem({ id, side });
    } else {
      const leftId = side === 'left' ? id : selectedItem.id;
      const rightId = side === 'right' ? id : selectedItem.id;

      // Match check logic
      let matched = false;
      if (selectedActivity?.type === 'matching' || selectedActivity?.type === 'shape-match' || selectedActivity?.type === 'match-half' || selectedActivity?.type === 'one-many') {
        matched = leftId === rightId;
      } else if (selectedActivity?.type === 'shape-matching') {
        const target = rightCol.find(x => x.id === rightId);
        const source = leftCol.find(x => x.id === leftId);
        if (source && target) {
          matched = (source.id === "circle" && target.id === "circle") ||
                    (source.id === "triangle" && target.id === "triangle") ||
                    (source.id === "square" && target.id === "square") ||
                    (source.id === "rectangle" && target.id === "rectangle") ||
                    (source.id === "star" && target.id === "star");
        }
      } else if (selectedActivity?.type === 'colour-matching') {
        matched = leftId === rightId;
      }

      if (matched) {
        const newMatches = { ...matches, [leftId]: rightId };
        setMatches(newMatches);
        setSelectedItem(null);
        playSound(true);

        if (Object.keys(newMatches).length === leftCol.length) {
          setIsCompleted(true);
          setStars(3);
          confetti({ particleCount: 60, spread: 50 });
        }
      } else {
        setSelectedItem(null);
      }
    }
  };

  const handleOddOneClick = (rowId: string, index: number, oddIndex: number) => {
    if (index === oddIndex) {
      playSound(true);
      setMatches(prev => {
        const next = { ...prev, [rowId]: String(index) };
        if (Object.keys(next).length === oddOneItems.length) {
          setIsCompleted(true);
          setStars(3);
          confetti({ particleCount: 50, spread: 50 });
        }
        return next;
      });
    } else {
      playSound(false);
    }
  };

  const handleBiggestClick = (id: string, size: string) => {
    if (size === 'lg') {
      playSound(true);
      setMatches(prev => {
        const next = { ...prev, [id]: size };
        if (Object.keys(next).length === biggestItems.length) {
          setIsCompleted(true);
          setStars(3);
          confetti({ particleCount: 50, spread: 50 });
        }
        return next;
      });
    } else {
      playSound(false);
    }
  };

  const handleBalloonClick = (balloonId: string, expectedColor: string) => {
    playSound(true);
    const newFills = { ...balloonFills, [balloonId]: activeColor };
    setBalloonFills(newFills);

    // Check border-filled matching conditions
    const balloonBorders = ["red", "yellow", "green", "blue", "purple"];
    const complete = balloonBorders.every(b => newFills[b] === b);
    if (complete) {
      setIsCompleted(true);
      setStars(3);
      confetti({ particleCount: 60, spread: 60 });
    }
  };

  const handleLegendClick = (shapeKey: string, targetColor: string) => {
    playSound(true);
    const newLegendFills = { ...legendFills, [shapeKey]: activeColor };
    setLegendFills(newLegendFills);

    // check triangles = pink, circles = green, squares = blue
    const check1 = newLegendFills['tri1'] === 'pink' && newLegendFills['tri2'] === 'pink';
    const check2 = newLegendFills['cir1'] === 'green' && newLegendFills['cir2'] === 'green';
    const check3 = newLegendFills['sq1'] === 'blue' && newLegendFills['sq2'] === 'blue';

    if (check1 && check2 && check3) {
      setIsCompleted(true);
      setStars(3);
      confetti({ particleCount: 60, spread: 60 });
    }
  };

  const handleRecognitionClick = (opt: string) => {
    if (opt === recognitionTarget) {
      playSound(true);
      setIsCompleted(true);
      setStars(3);
      confetti({ particleCount: 60, spread: 60 });
    } else {
      playSound(false);
    }
  };

  const triggerA4Print = () => {
    window.print();
  };

  // Color selection bar
  const colorsList = [
    { name: "red", hex: "#ef4444" },
    { name: "yellow", hex: "#eab308" },
    { name: "orange", hex: "#f97316" },
    { name: "green", hex: "#22c55e" },
    { name: "blue", hex: "#3b82f6" },
    { name: "purple", hex: "#a855f7" },
    { name: "pink", hex: "#ec4899" }
  ];

  // SVG Shapes library helpers for render
  const renderShapeIcon = (shape: string, stroke: string = "#334155") => {
    switch (shape.toLowerCase()) {
      case 'circle':
        return <circle cx="25" cy="25" r="16" stroke={stroke} strokeWidth="3" fill="none" />;
      case 'triangle':
        return <polygon points="25,9 41,39 9,39" stroke={stroke} strokeWidth="3" fill="none" />;
      case 'square':
        return <rect x="9" y="9" width="32" height="32" rx="4" stroke={stroke} strokeWidth="3" fill="none" />;
      case 'rectangle':
        return <rect x="5" y="14" width="40" height="22" rx="3" stroke={stroke} strokeWidth="3" fill="none" />;
      case 'star':
        return <polygon points="25,5 30,19 45,19 33,28 38,42 25,33 12,42 17,28 5,19 20,19" stroke={stroke} strokeWidth="2.5" fill="none" />;
      case 'oval':
        return <ellipse cx="25" cy="25" rx="20" ry="12" stroke={stroke} strokeWidth="3" fill="none" />;
      case 'heart':
        return <path d="M12 16 C8 10, 2 12, 2 20 C2 28, 12 36, 12 36 C12 36, 22 28, 22 20 C22 12, 16 10, 12 16 Z" transform="scale(0.8) translate(8, 5)" stroke={stroke} strokeWidth="3.5" fill="none" />;
      default:
        return null;
    }
  };

  const getRecognitionEmoji = (target: string) => {
    switch (target) {
      case 'lion': return '🦁';
      case 'butterfly': return '🦋';
      case 'rocket': return '🚀';
      case 'star': return '⭐';
      case 'flower': return '🌸';
      default: return '👶';
    }
  };

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto font-body">
      
      {/* List / Map Grid */}
      {!selectedActivity ? (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-kid text-transparent bg-clip-text bg-gradient-to-r from-primary-pink via-primary-purple to-primary-blue mb-2">
              🎈 Nursery & Pre-Nursery Playroom
            </h2>
            <p className="text-slate-500 font-body max-w-lg mx-auto text-sm">
              Fun tactile educational sheets designed for toddler fingers. Color, match, trace, and earn stars!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NURSERY_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                onClick={() => setupActivity(act)}
                className="bg-white border-2 border-slate-100 rounded-3xl p-5 hover:shadow-md cursor-pointer hover:-translate-y-1 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🧸</span>
                    <span className="bg-primary-blue/10 text-primary-blue text-xs font-kid px-3 py-1 rounded-full">
                      {act.ageGroup}
                    </span>
                  </div>
                  <h3 className="font-kid text-lg text-slate-800 mb-1">{act.title}</h3>
                  <p className="text-xs text-slate-500 font-body leading-relaxed">{act.instructions}</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-4 text-xs font-kid text-slate-400">
                  <span>Worksheet Activity</span>
                  <span className="text-primary-pink">Click to Play →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Controls Header */}
          <div className="flex justify-between items-center gap-4 mb-6 flex-wrap sm:flex-nowrap print:hidden">
            <button
              onClick={() => setSelectedActivity(null)}
              className="text-slate-500 hover:text-slate-800 font-kid text-sm bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm transition"
            >
              ← Back to Playroom
            </button>

            <div className="flex items-center gap-2">
              {/* Voice Instruct button */}
              <button
                onClick={speakInstructions}
                className="bg-primary-purple text-white px-4 py-2 rounded-2xl font-kid text-sm shadow hover:bg-opacity-95 active:scale-95 transition flex items-center gap-1"
              >
                <Volume2 size={16} />
                <span>Read Question</span>
              </button>

              {/* Printable Download */}
              <button
                onClick={triggerA4Print}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-2xl font-kid text-sm transition flex items-center gap-1 border border-slate-200"
              >
                <Printer size={16} />
                <span>Print A4</span>
              </button>
            </div>
          </div>

          {/* CRAYON COLOR PICKER FOR COLOURING ACTIVITIES */}
          {(selectedActivity.type === 'colouring' || selectedActivity.type === 'trace-colour' || selectedActivity.type === 'balloon-colour' || selectedActivity.type === 'color-legend' || selectedActivity.type === 'tracing') && (
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-4 mb-4 flex items-center justify-between flex-wrap gap-3 print:hidden">
              <span className="font-kid text-sm text-slate-600">Select Crayon:</span>
              <div className="flex gap-2">
                {colorsList.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setActiveColor(c.name)}
                    className={`w-9 h-9 rounded-full border-4 shadow-inner transition ${
                      activeColor === c.name ? 'border-slate-800 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* MAIN WORKSHEET WHITE SHEET PAPER (Standard A4 Print Target) */}
          <div 
            ref={containerRef}
            className="bg-white border-4 border-dashed border-slate-200 rounded-3xl p-8 shadow-md relative min-h-[550px] print:border-none print:shadow-none"
          >
            {/* Header info for parent prints */}
            <div className="text-center pb-6 mb-6 border-b border-dashed border-slate-100 print:block">
              <span className="text-xs font-kid text-primary-pink uppercase">CurioKids Printable Playroom Worksheets</span>
              <h2 className="font-kid text-2xl text-slate-800 mt-1">{selectedActivity.title}</h2>
              <p className="text-slate-500 font-body text-sm mt-1">{selectedActivity.instructions}</p>
            </div>

            {/* -------------------------------------------------------------
                WORKSHEET TYPE 1: MATCHING (Same objects / Real World shapes / colors / one-many)
               ------------------------------------------------------------- */}
            {(selectedActivity.type === 'matching' || selectedActivity.type === 'shape-matching' || selectedActivity.type === 'colour-matching' || selectedActivity.type === 'shape-match' || selectedActivity.type === 'match-half' || selectedActivity.type === 'one-many') && (
              <div className="grid grid-cols-3 items-center justify-between gap-6 max-w-lg mx-auto py-8">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                  {leftCol.map(item => {
                    const isSelected = selectedItem?.id === item.id && selectedItem?.side === 'left';
                    const isMatched = matches[item.id] !== undefined;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id, 'left')}
                        className={`p-4 border-2 rounded-2xl flex flex-col items-center justify-center min-h-[96px] transition select-none ${
                          isSelected ? 'border-primary-pink bg-pink-50/20 ring-4 ring-pink-100' : isMatched ? 'border-green-400 bg-green-50/10 opacity-75' : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        {selectedActivity.type === 'matching' && <span className="text-3xl capitalize">{item.val === 'car' ? '🚗' : item.val === 'fish' ? '🐟' : item.val === 'kite' ? '🪁' : item.val === 'bucket' ? '🪣' : '🍭'}</span>}
                        {selectedActivity.type === 'shape-matching' && (
                          <svg className="w-12 h-12 stroke-slate-700" viewBox="0 0 50 50">
                            {renderShapeIcon(item.id)}
                          </svg>
                        )}
                        {selectedActivity.type === 'colour-matching' && <span className="text-3xl capitalize">{item.id === 'apple' ? '🍎' : item.id === 'banana' ? '🍌' : item.id === 'orange' ? '🍊' : item.id === 'grapes' ? '🍇' : '🍐'}</span>}
                        {selectedActivity.type === 'shape-match' && (
                          <svg className="w-12 h-12 stroke-slate-700" viewBox="0 0 50 50">
                            {renderShapeIcon(item.val)}
                          </svg>
                        )}
                        {selectedActivity.type === 'match-half' && (
                          <span className="text-2xl font-bold">🌓 {item.val}</span>
                        )}
                        {selectedActivity.type === 'one-many' && (
                          <span className="text-2xl">{item.id === 'hat' ? '👒' : item.id === 'tree' ? '🌳' : item.id === 'cap' ? '🧢' : item.id === 'lemon' ? '🍋' : '🐚'}</span>
                        )}
                        <span className="text-[10px] text-slate-400 font-kid mt-1">{item.id}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Middle guide line overlay */}
                <div className="text-center font-kid text-slate-300">
                  ✏️ Connect
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                  {rightCol.map(item => {
                    const isSelected = selectedItem?.id === item.id && selectedItem?.side === 'right';
                    const isMatched = Object.values(matches).includes(item.id);

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id, 'right')}
                        className={`p-4 border-2 rounded-2xl flex flex-col items-center justify-center min-h-[96px] transition select-none ${
                          isSelected ? 'border-primary-pink bg-pink-50/20 ring-4 ring-pink-100' : isMatched ? 'border-green-400 bg-green-50/10 opacity-75' : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        {selectedActivity.type === 'matching' && <span className="text-3xl capitalize">{item.val === 'car' ? '🚗' : item.val === 'fish' ? '🐟' : item.val === 'kite' ? '🪁' : item.val === 'bucket' ? '🪣' : '🍭'}</span>}
                        {selectedActivity.type === 'shape-matching' && <span className="text-xs font-kid text-slate-600 font-bold">{item.val}</span>}
                        {selectedActivity.type === 'colour-matching' && (
                          <div className="w-8 h-8 rounded-full border border-slate-300" style={{ backgroundColor: item.val }} />
                        )}
                        {selectedActivity.type === 'shape-match' && (
                          <svg className="w-12 h-12 stroke-slate-700" viewBox="0 0 50 50">
                            {renderShapeIcon(item.val)}
                          </svg>
                        )}
                        {selectedActivity.type === 'match-half' && (
                          <span className="text-2xl font-bold">🌗 {item.val}</span>
                        )}
                        {selectedActivity.type === 'one-many' && (
                          <span className="text-xl">
                            {item.id === 'hat' ? '👒👒👒' : item.id === 'tree' ? '🌳🌳🌳' : item.id === 'cap' ? '🧢🧢🧢' : item.id === 'lemon' ? '🍋🍋🍋' : '🐚🐚🐚'}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-kid mt-1">{item.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                WORKSHEET TYPE 2: TRACING (Straight, curved, raindrop clouds)
               ------------------------------------------------------------- */}
            {(selectedActivity.type === 'tracing' || selectedActivity.type === 'trace-colour') && (
              <div className="flex flex-col items-center gap-4">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  onMouseDown={startTracing}
                  onMouseMove={traceLine}
                  onMouseUp={stopTracing}
                  onMouseLeave={stopTracing}
                  onTouchStart={startTracing}
                  onTouchMove={traceLine}
                  onTouchEnd={stopTracing}
                  className="bg-white border-2 border-slate-100 rounded-2xl shadow-inner max-w-full cursor-crosshair print:border-none"
                />
                <button
                  onClick={clearCanvas}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-2xl font-kid text-xs transition"
                >
                  <RefreshCw size={12} className="inline mr-1" /> Clear Canvas
                </button>
              </div>
            )}

            {/* -------------------------------------------------------------
                WORKSHEET TYPE 3: ODD-ONE ( ice creams / arrow row picks )
               ------------------------------------------------------------- */}
            {selectedActivity.type === 'odd-one' && (
              <div className="flex flex-col gap-6 max-w-md mx-auto py-4">
                {oddOneItems.map(row => (
                  <div key={row.id} className="border-b border-slate-100 pb-4">
                    <span className="text-xs font-kid text-slate-400 block mb-2">{row.label} row:</span>
                    <div className="flex gap-4 justify-between">
                      {row.items.map((emoji: string, idx: number) => {
                        const isCorrectOdd = idx === row.oddIndex;
                        const isSelected = matches[row.id] === String(idx);
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => handleOddOneClick(row.id, idx, row.oddIndex)}
                            className={`p-4 border-2 rounded-2xl text-4xl hover:scale-105 active:scale-95 transition ${
                              isSelected 
                                ? 'border-green-500 bg-green-50/20 ring-4 ring-green-100' 
                                : 'border-slate-100 bg-white'
                            }`}
                          >
                            {emoji}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* -------------------------------------------------------------
                WORKSHEET TYPE 4: COLORING SANDBOX
               ------------------------------------------------------------- */}
            {selectedActivity.type === 'colouring' && (
              <div className="flex flex-col items-center gap-6 max-w-md mx-auto py-8">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={300}
                  onMouseDown={startTracing}
                  onMouseMove={traceLine}
                  onMouseUp={stopTracing}
                  onMouseLeave={stopTracing}
                  className="bg-white border-2 border-slate-100 rounded-2xl shadow-inner max-w-full cursor-crosshair"
                />
                <div className="flex gap-2">
                  <button
                    onClick={clearCanvas}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-2xl font-kid text-xs transition"
                  >
                    Clear Drawing
                  </button>
                  <button
                    onClick={() => { setIsCompleted(true); setStars(3); playSound(true); confetti({ particleCount: 40 }); }}
                    className="bg-primary-pink text-white px-5 py-2 rounded-2xl font-kid text-xs transition"
                  >
                    I Finished Coloring! 🎨
                  </button>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                WORKSHEET TYPE 5: BALLOON BORDER COLOR MATCH FILLS
               ------------------------------------------------------------- */}
            {selectedActivity.type === 'balloon-colour' && (
              <div className="flex justify-center gap-6 flex-wrap py-12 max-w-lg mx-auto">
                {["red", "yellow", "green", "blue", "purple"].map((col) => {
                  const fillCol = balloonFills[col];
                  
                  return (
                    <button
                      key={col}
                      onClick={() => handleBalloonClick(col, col)}
                      className="flex flex-col items-center border border-slate-100 rounded-3xl p-4 bg-white hover:scale-105 transition"
                    >
                      <div 
                        className="w-16 h-20 rounded-full border-4 shadow-sm"
                        style={{ 
                          borderColor: col === 'red' ? '#ef4444' : col === 'yellow' ? '#eab308' : col === 'green' ? '#22c55e' : col === 'blue' ? '#3b82f6' : '#a855f7',
                          backgroundColor: fillCol === 'red' ? '#fecaca' : fillCol === 'yellow' ? '#fef08a' : fillCol === 'green' ? '#bbf7d0' : fillCol === 'blue' ? '#bfdbfe' : fillCol === 'purple' ? '#e9d5ff' : '#f8fafc'
                        }}
                      />
                      <span className="text-[10px] font-kid text-slate-400 mt-2">{col} border</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* -------------------------------------------------------------
                WORKSHEET TYPE 6: CIRCLE BIGGEST ONE
               ------------------------------------------------------------- */}
            {selectedActivity.type === 'biggest' && (
              <div className="flex flex-col gap-6 max-w-md mx-auto py-6">
                {biggestItems.map(row => (
                  <div key={row.id} className="border-b border-slate-100 pb-4">
                    <span className="text-xs font-kid text-slate-400 block mb-2">{row.id} row:</span>
                    <div className="flex gap-4 items-center justify-between">
                      {row.items.map((item: any, idx: number) => {
                        const isSelected = matches[row.id] === item.size;
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => handleBiggestClick(row.id, item.size)}
                            className={`p-4 border-2 rounded-2xl bg-white hover:scale-105 active:scale-95 transition ${
                              isSelected 
                                ? 'border-green-500 bg-green-50/20 ring-4 ring-green-100' 
                                : 'border-slate-100'
                            }`}
                          >
                            <span 
                              className="block"
                              style={{ 
                                fontSize: item.size === 'sm' ? '1.5rem' : item.size === 'md' ? '2.5rem' : '4rem' 
                              }}
                            >
                              {item.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* -------------------------------------------------------------
                WORKSHEET TYPE 7: ODD COLOR OR SHAPE SELECT
               ------------------------------------------------------------- */}
            {selectedActivity.type === 'odd-color-shape' && (
              <div className="flex flex-col gap-6 max-w-md mx-auto py-6">
                {oddColorShapeItems.map(row => (
                  <div key={row.id} className="border-b border-slate-100 pb-4">
                    <div className="flex gap-4 justify-between">
                      {row.items.map((item: any, idx: number) => {
                        const isSelected = matches[row.id] === String(idx);
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => handleOddOneClick(row.id, idx, row.oddIndex)}
                            className={`p-4 border-2 rounded-2xl w-20 h-20 flex items-center justify-center bg-white hover:scale-105 transition ${
                              isSelected 
                                ? 'border-green-500 bg-green-50/20 ring-4 ring-green-100' 
                                : 'border-slate-100'
                            }`}
                          >
                            <svg className="w-12 h-12" viewBox="0 0 50 50">
                              {renderShapeIcon(item.shape, item.color === 'red' ? '#ef4444' : item.color === 'yellow' ? '#eab308' : item.color === 'green' ? '#22c55e' : item.color === 'blue' ? '#3b82f6' : '#a855f7')}
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* -------------------------------------------------------------
                WORKSHEET TYPE 8: COLOR CODE LEGEND (triangles = pink, etc)
               ------------------------------------------------------------- */}
            {selectedActivity.type === 'color-legend' && (
              <div className="flex flex-col items-center gap-6 max-w-lg mx-auto py-8">
                {/* Legend Table */}
                <div className="flex gap-4 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="w-3 h-3 bg-pink-400 rounded-full" />
                    <span>Triangle = Pink</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="w-3 h-3 bg-green-400 rounded-full" />
                    <span>Circle = Green</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="w-3 h-3 bg-blue-400 rounded-full" />
                    <span>Square = Blue</span>
                  </div>
                </div>

                {/* Shuffled Shape Buttons grid */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Tri 1 */}
                  <button
                    onClick={() => handleLegendClick('tri1', 'pink')}
                    className="p-4 border-2 rounded-2xl w-24 h-24 flex items-center justify-center hover:scale-105 transition"
                    style={{ backgroundColor: legendFills['tri1'] === 'pink' ? '#fbcfe8' : '#ffffff' }}
                  >
                    <svg className="w-12 h-12 stroke-slate-500" viewBox="0 0 50 50">
                      {renderShapeIcon('triangle')}
                    </svg>
                  </button>

                  {/* Cir 1 */}
                  <button
                    onClick={() => handleLegendClick('cir1', 'green')}
                    className="p-4 border-2 rounded-2xl w-24 h-24 flex items-center justify-center hover:scale-105 transition"
                    style={{ backgroundColor: legendFills['cir1'] === 'green' ? '#bbf7d0' : '#ffffff' }}
                  >
                    <svg className="w-12 h-12 stroke-slate-500" viewBox="0 0 50 50">
                      {renderShapeIcon('circle')}
                    </svg>
                  </button>

                  {/* Sq 1 */}
                  <button
                    onClick={() => handleLegendClick('sq1', 'blue')}
                    className="p-4 border-2 rounded-2xl w-24 h-24 flex items-center justify-center hover:scale-105 transition"
                    style={{ backgroundColor: legendFills['sq1'] === 'blue' ? '#bfdbfe' : '#ffffff' }}
                  >
                    <svg className="w-12 h-12 stroke-slate-500" viewBox="0 0 50 50">
                      {renderShapeIcon('square')}
                    </svg>
                  </button>

                  {/* Tri 2 */}
                  <button
                    onClick={() => handleLegendClick('tri2', 'pink')}
                    className="p-4 border-2 rounded-2xl w-24 h-24 flex items-center justify-center hover:scale-105 transition"
                    style={{ backgroundColor: legendFills['tri2'] === 'pink' ? '#fbcfe8' : '#ffffff' }}
                  >
                    <svg className="w-12 h-12 stroke-slate-500" viewBox="0 0 50 50">
                      {renderShapeIcon('triangle')}
                    </svg>
                  </button>

                  {/* Cir 2 */}
                  <button
                    onClick={() => handleLegendClick('cir2', 'green')}
                    className="p-4 border-2 rounded-2xl w-24 h-24 flex items-center justify-center hover:scale-105 transition"
                    style={{ backgroundColor: legendFills['cir2'] === 'green' ? '#bbf7d0' : '#ffffff' }}
                  >
                    <svg className="w-12 h-12 stroke-slate-500" viewBox="0 0 50 50">
                      {renderShapeIcon('circle')}
                    </svg>
                  </button>

                  {/* Sq 2 */}
                  <button
                    onClick={() => handleLegendClick('sq2', 'blue')}
                    className="p-4 border-2 rounded-2xl w-24 h-24 flex items-center justify-center hover:scale-105 transition"
                    style={{ backgroundColor: legendFills['sq2'] === 'blue' ? '#bfdbfe' : '#ffffff' }}
                  >
                    <svg className="w-12 h-12 stroke-slate-500" viewBox="0 0 50 50">
                      {renderShapeIcon('square')}
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                WORKSHEET TYPE 9: RECOGNITION (Tap-to-match image clicker)
               ------------------------------------------------------------- */}
            {selectedActivity.type === 'recognition' && (
              <div className="flex flex-col items-center gap-6 py-12 max-w-sm mx-auto">
                <div className="text-8xl p-8 bg-slate-50 border-2 border-slate-100 rounded-full animate-float">
                  {getRecognitionEmoji(recognitionTarget)}
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  {recognitionOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleRecognitionClick(opt)}
                      className="p-4 border-2 border-slate-100 rounded-2xl bg-white hover:border-primary-pink active:scale-95 font-kid capitalize transition"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Success screen completion card */}
            {isCompleted && (
              <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-6 text-center mt-8 print:hidden">
                <h4 className="font-kid text-2xl text-green-700 mb-1">💫 Worksheet Complete! 💫</h4>
                <p className="text-xs text-green-600 font-body mb-4">You did an amazing job tracing, coloring or matching!</p>
                
                {/* Earned stars */}
                <div className="flex justify-center gap-1.5 mb-4">
                  {[1, 2, 3].map(num => (
                    <Star key={num} className="text-yellow-400 fill-yellow-400 animate-bounce" size={24} />
                  ))}
                </div>

                <button
                  onClick={() => onWorksheetFinished(selectedActivity.id, stars)}
                  className="bg-primary-pink text-white font-kid px-6 py-2.5 rounded-2xl shadow hover:bg-opacity-95 transition"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
