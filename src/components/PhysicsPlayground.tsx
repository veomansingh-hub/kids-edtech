import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, RefreshCw, Star, Play, CircleDot } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PhysicsBody {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  emoji: string;
  color: string;
  type: 'ball' | 'star' | 'balloon' | 'teddy';
  mass: number;
  angle: number;
  angularVelocity: number;
}

export default function PhysicsPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gravity, setGravity] = useState<boolean>(true);
  const [elasticity, setElasticity] = useState<number>(0.8); // Bounciness
  const [spawnType, setSpawnType] = useState<'teddy' | 'star' | 'balloon' | 'ball'>('teddy');
  const [activeBodies, setActiveBodies] = useState<number>(0);
  const [wind, setWind] = useState<number>(0); // Wind acceleration (-0.1 to 0.1)

  const bodies = useRef<PhysicsBody[]>([]);
  const isDragging = useRef<boolean>(false);
  const draggedBody = useRef<PhysicsBody | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const prevMousePos = useRef({ x: 0, y: 0, time: 0 });
  const mouseVelocity = useRef({ x: 0, y: 0 });

  // Play a procedurally generated synth pop sound upon collision
  const playSynthCollision = (frequency: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  };

  // Setup initial playground items
  useEffect(() => {
    const defaultEmojis = [
      { emoji: '🧸', type: 'teddy', color: '#ffbe76' },
      { emoji: '🐼', type: 'teddy', color: '#f1f2f6' },
      { emoji: '🦁', type: 'teddy', color: '#ffeaa7' },
      { emoji: '⭐', type: 'star', color: '#ffd23f' },
      { emoji: '🎈', type: 'balloon', color: '#ff7675' },
      { emoji: '🏀', type: 'ball', color: '#e67e22' },
      { emoji: '🥎', type: 'ball', color: '#2ecc71' }
    ];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    // Spawn 7 default bouncy items
    bodies.current = defaultEmojis.map((item, idx) => {
      const rad = 26 + Math.random() * 8;
      return {
        id: `init_${idx}_${Date.now()}`,
        x: w / 4 + (idx * (w / 10)),
        y: 80 + Math.random() * 80,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 4,
        radius: rad,
        emoji: item.emoji,
        color: item.color,
        type: item.type as any,
        mass: rad * 0.15,
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.1
      };
    });
    
    setActiveBodies(bodies.current.length);
  }, []);

  // Frame simulation loop
  useEffect(() => {
    let animFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup canvas resolution
    const resizeCanvas = () => {
      const parent = containerRef.current;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = 360;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const updatePhysics = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Clear & Draw
      ctx.clearRect(0, 0, w, h);

      // Grid helper visual for scientific playroom feel
      ctx.strokeStyle = 'rgba(168, 230, 207, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const gravityForce = gravity ? 0.35 : 0;
      const friction = 0.99; // Air resistance

      const list = bodies.current;

      // Update positions
      list.forEach((body) => {
        if (body === draggedBody.current) {
          // Smoothly track mouse drag
          body.vx = (mousePos.current.x - body.x) * 0.2;
          body.vy = (mousePos.current.y - body.y) * 0.2;
          body.x = mousePos.current.x;
          body.y = mousePos.current.y;
          body.angle += body.angularVelocity;
          return;
        }

        // Apply Forces
        body.vy += gravityForce;
        body.vx += wind;

        // Apply air friction
        body.vx *= friction;
        body.vy *= friction;

        // Update positions
        body.x += body.vx;
        body.y += body.vy;

        // Angular rotations based on speed
        body.angularVelocity *= 0.98;
        body.angle += body.angularVelocity + (body.vx * 0.01);

        // A. Screen Boundary Collisions
        // Left & Right
        if (body.x < body.radius) {
          body.x = body.radius;
          body.vx = -body.vx * elasticity;
          body.angularVelocity += body.vy * 0.02;
          if (Math.abs(body.vx) > 2.5) playSynthCollision(330);
        } else if (body.x > w - body.radius) {
          body.x = w - body.radius;
          body.vx = -body.vx * elasticity;
          body.angularVelocity -= body.vy * 0.02;
          if (Math.abs(body.vx) > 2.5) playSynthCollision(330);
        }

        // Top & Bottom
        if (body.y < body.radius) {
          body.y = body.radius;
          body.vy = -body.vy * elasticity;
          if (Math.abs(body.vy) > 2.5) playSynthCollision(440);
        } else if (body.y > h - body.radius) {
          body.y = h - body.radius;
          body.vy = -body.vy * elasticity;
          // Apply surface rolling friction
          body.vx *= 0.94;
          body.angularVelocity = body.vx * 0.05;
          if (Math.abs(body.vy) > 2.5) playSynthCollision(261);
        }
      });

      // B. Body-to-Body Collisions (Double Loop)
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const b1 = list[i];
          const b2 = list[j];

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = b1.radius + b2.radius;

          if (dist < minDist) {
            // Overlap correction (Push apart immediately)
            const overlap = minDist - dist;
            const nx = dx / dist; // Normal vector x
            const ny = dy / dist; // Normal vector y

            // Push based on relative masses
            const totalMass = b1.mass + b2.mass;
            const ratio1 = b2.mass / totalMass;
            const ratio2 = b1.mass / totalMass;

            if (b1 !== draggedBody.current) {
              b1.x -= nx * overlap * ratio1;
              b1.y -= ny * overlap * ratio1;
            }
            if (b2 !== draggedBody.current) {
              b2.x += nx * overlap * ratio2;
              b2.y += ny * overlap * ratio2;
            }

            // Elastic Collision Response (Impulse resolution)
            // Relative velocity
            const rvx = b2.vx - b1.vx;
            const rvy = b2.vy - b1.vy;

            // Velocity along normal
            const velAlongNormal = rvx * nx + rvy * ny;

            // Do not resolve if velocities are separating
            if (velAlongNormal < 0) {
              const impulseScalar = -(1 + elasticity) * velAlongNormal / (1/b1.mass + 1/b2.mass);

              // Apply impulse
              if (b1 !== draggedBody.current) {
                b1.vx -= (impulseScalar / b1.mass) * nx;
                b1.vy -= (impulseScalar / b1.mass) * ny;
                b1.angularVelocity -= (rvx * ny - rvy * nx) * 0.01;
              }
              if (b2 !== draggedBody.current) {
                b2.vx += (impulseScalar / b2.mass) * nx;
                b2.vy += (impulseScalar / b2.mass) * ny;
                b2.angularVelocity += (rvx * ny - rvy * nx) * 0.01;
              }

              // Play collision music
              const impactSpeed = Math.abs(velAlongNormal);
              if (impactSpeed > 2) {
                playSynthCollision(Math.min(523 + (impactSpeed * 30), 1200));
              }
            }
          }
        }
      }

      // C. Draw Bodies
      list.forEach((body) => {
        ctx.save();
        ctx.translate(body.x, body.y);
        ctx.rotate(body.angle);

        // Glassmorphic bouncy sphere outline shadow
        const grad = ctx.createRadialGradient(-3, -3, 2, 0, 0, body.radius);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        grad.addColorStop(0.3, body.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.15)');

        // Sphere shadow body
        ctx.beginPath();
        ctx.arc(0, 0, body.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Glossy shine overlay
        ctx.beginPath();
        ctx.ellipse(-body.radius / 3, -body.radius / 3, body.radius / 2.5, body.radius / 5, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fill();

        // Text Mascot Emoji Center
        ctx.font = `${body.radius * 1.05}px Fredoka`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(body.emoji, 0, 1.5);

        ctx.restore();
      });

      animFrameId = requestAnimationFrame(updatePhysics);
    };

    animFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [gravity, elasticity, wind]);

  // Handle Drag-and-Drop / Force Launch
  const getMouseCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      if (e.touches.length === 0) return mousePos.current;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const pos = getMouseCoords(e);
    mousePos.current = pos;
    prevMousePos.current = { x: pos.x, y: pos.y, time: performance.now() };

    // Find if clicked on any existing body
    const hit = bodies.current.find((b) => {
      const dx = b.x - pos.x;
      const dy = b.y - pos.y;
      return Math.sqrt(dx * dx + dy * dy) < b.radius * 1.2;
    });

    if (hit) {
      isDragging.current = true;
      draggedBody.current = hit;
      hit.vx = 0;
      hit.vy = 0;
      hit.angularVelocity = 0;
      playSynthCollision(523.25); // C5
    } else {
      // Spawn a new item at touch point!
      spawnEmoji(pos.x, pos.y);
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const pos = getMouseCoords(e);
    mousePos.current = pos;

    if (isDragging.current && draggedBody.current) {
      const now = performance.now();
      const dt = now - prevMousePos.current.time;
      if (dt > 10) {
        mouseVelocity.current = {
          x: (pos.x - prevMousePos.current.x) / dt * 16, // Velocity scale
          y: (pos.y - prevMousePos.current.y) / dt * 16
        };
        prevMousePos.current = { x: pos.x, y: pos.y, time: now };
      }
    }
  };

  const handlePointerUp = () => {
    if (isDragging.current && draggedBody.current) {
      // Launch body with mouse velocity!
      draggedBody.current.vx = Math.max(Math.min(mouseVelocity.current.x, 15), -15);
      draggedBody.current.vy = Math.max(Math.min(mouseVelocity.current.y, 15), -15);
      draggedBody.current.angularVelocity = (Math.random() - 0.5) * 0.3;
      
      confetti({ particleCount: 20, spread: 35, origin: { x: mousePos.current.x / window.innerWidth, y: mousePos.current.y / window.innerHeight } });
    }
    isDragging.current = false;
    draggedBody.current = null;
  };

  const spawnEmoji = (x: number, y: number) => {
    const emojisMap = {
      teddy: { emoji: '🧸', color: '#ffbe76' },
      star: { emoji: '⭐', color: '#ffd23f' },
      balloon: { emoji: '🎈', color: '#ff7675' },
      ball: { emoji: '⚽', color: '#bdc5c5' }
    };
    const item = emojisMap[spawnType];
    const rad = 25 + Math.random() * 10;

    const newBody: PhysicsBody = {
      id: `spawn_${Date.now()}_${Math.random()}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: gravity ? -5 : (Math.random() - 0.5) * 10,
      radius: rad,
      emoji: item.emoji,
      color: item.color,
      type: spawnType,
      mass: rad * 0.15,
      angle: Math.random() * Math.PI * 2,
      angularVelocity: (Math.random() - 0.5) * 0.2
    };

    bodies.current.push(newBody);
    setActiveBodies(bodies.current.length);
    playSynthCollision(659.25); // E5
  };

  const handleClear = () => {
    bodies.current = [];
    setActiveBodies(0);
    playSynthCollision(220); // A3
  };

  const handleMascotParty = () => {
    const party = [
      { emoji: '🧸', color: '#ffbe76', type: 'teddy' },
      { emoji: '🐼', color: '#f1f2f6', type: 'teddy' },
      { emoji: '🦁', color: '#ffeaa7', type: 'teddy' },
      { emoji: '🐯', color: '#ffeaa7', type: 'teddy' },
      { emoji: '🦊', color: '#ffbe76', type: 'teddy' },
      { emoji: '🐨', color: '#dcdde1', type: 'teddy' },
      { emoji: '🎈', color: '#ff7675', type: 'balloon' },
      { emoji: '⭐', color: '#ffd23f', type: 'star' }
    ];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;

    party.forEach((p, idx) => {
      const rad = 25 + Math.random() * 8;
      bodies.current.push({
        id: `party_${idx}_${Date.now()}`,
        x: 40 + (idx * (w / 9)),
        y: 60 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 10,
        vy: 2 + Math.random() * 5,
        radius: rad,
        emoji: p.emoji,
        color: p.color,
        type: p.type as any,
        mass: rad * 0.15,
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.1
      });
    });

    setActiveBodies(bodies.current.length);
    confetti({ particleCount: 80, spread: 60 });
    playSynthCollision(880); // A5
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border-4 border-dashed border-primary-pink/30 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden font-body select-none">
      
      {/* Absolute Decorative Glow */}
      <div className="absolute -top-12 -left-12 w-28 h-28 bg-primary-pink/15 rounded-full filter blur-xl pointer-events-none"></div>
      
      {/* Header Controls */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4 relative z-10">
        <div>
          <h3 className="font-kid text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary-pink via-primary-purple to-primary-blue leading-snug">
            🦁 Tactile Physics Playground 🎈
          </h3>
          <p className="text-xs text-slate-400 font-body">Tap to spawn, drag to throw, and watch super-bouncy collision chimes!</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Active Items Badge */}
          <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 font-kid font-bold px-2.5 py-1 rounded-full">
            Items: {activeBodies}
          </span>
          
          {/* Gravity Control */}
          <button
            onClick={() => { setGravity(!gravity); playSynthCollision(gravity ? 293 : 587); }}
            className={`text-xs font-kid px-3 py-1.5 rounded-full border-2 border-slate-800 shadow-[2px_2px_0px_#2d3748] active:scale-95 transition transform ${
              gravity ? 'bg-[#ffda79] hover:bg-[#ffeaa7]' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            🌍 Gravity: {gravity ? 'ON' : 'OFF'}
          </button>

          {/* Wind triggers */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-full">
            <button
              onClick={() => { setWind(prev => prev === -0.15 ? 0 : -0.15); playSynthCollision(349); }}
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition ${wind < 0 ? 'bg-primary-blue text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              title="Wind Left"
            >
              ◀
            </button>
            <span className="text-[9px] font-kid text-slate-400 font-bold px-1">Wind</span>
            <button
              onClick={() => { setWind(prev => prev === 0.15 ? 0 : 0.15); playSynthCollision(349); }}
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition ${wind > 0 ? 'bg-primary-blue text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              title="Wind Right"
            >
              ▶
            </button>
          </div>

          {/* Clear Playground */}
          <button
            onClick={handleClear}
            className="bg-red-50 hover:bg-red-100 border-2 border-slate-800 text-red-600 font-kid text-xs px-3 py-1.5 rounded-full shadow-[2px_2px_0px_#2d3748] active:scale-95 transition transform"
          >
            🧹 Clear
          </button>
        </div>
      </div>

      {/* Main Physics Drawing Canvas Area */}
      <div 
        ref={containerRef}
        className="w-full bg-[#fdfdfd] border-4 border-slate-800 rounded-3xl relative overflow-hidden shadow-inner cursor-crosshair min-h-[300px]"
      >
        {/* Simple instructional floating text in bg */}
        {activeBodies === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <span className="font-kid text-lg text-slate-600">Tap anywhere inside to spawn bouncy items! 🧸</span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="block max-w-full"
        />
      </div>

      {/* Spawners Selection Row */}
      <div className="flex justify-between items-center flex-wrap gap-4 mt-4 relative z-10 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3">
          <span className="font-kid text-sm text-slate-500">Choose Spawner Crayon:</span>
          <div className="flex gap-2">
            {[
              { id: 'teddy', name: 'Mascot 🧸', color: '#ffbe76' },
              { id: 'star', name: 'Star ⭐', color: '#ffd23f' },
              { id: 'balloon', name: 'Balloon 🎈', color: '#ff7675' },
              { id: 'ball', name: 'Ball 🏀', color: '#e67e22' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => { setSpawnType(type.id as any); playSynthCollision(523); }}
                className={`text-xs font-kid px-3 py-1.5 rounded-2xl border-2 transition ${
                  spawnType === type.id 
                    ? 'border-slate-800 bg-slate-50 shadow-sm font-bold scale-105' 
                    : 'border-transparent text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: type.color }} />
                {type.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mascot Party Sparkle Trigger */}
        <button
          onClick={handleMascotParty}
          className="bg-primary-purple text-white hover:bg-opacity-95 font-kid text-sm px-5 py-2 rounded-2xl border-2 border-slate-800 shadow-[3px_3px_0px_#2d3748] active:scale-95 transition transform flex items-center gap-1.5"
        >
          <Sparkles size={14} />
          <span>Mascot Party Mode! 🐼</span>
        </button>
      </div>

    </div>
  );
}
export { PhysicsPlayground };
