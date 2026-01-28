'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Binary, 
  Workflow, 
  ScanLine, 
  ShieldAlert, 
  ArrowUpRight,
  Activity
} from 'lucide-react';

// --- DATA & CONFIG ---
const QUADS = [
  {
    id: 1,
    label: "01 // SILOS",
    title: "Data Fragmentation",
    desc: "Data is trapped in isolated pockets. Teams operate on assumptions, not facts. Velocity dies in the gap between systems.",
    icon: Binary,
  },
  {
    id: 2,
    label: "02 // CONTEXT",
    title: "Cognitive Decay",
    desc: "Engineers switch contexts 15x an hour. This isn't multitasking; it's the systematic destruction of deep work.",
    icon: Workflow,
  },
  {
    id: 3,
    label: "03 // FRICTION",
    title: "Manual Overhead",
    desc: "Deployments are brittle manual rituals. You are burning expensive engineering cycles on repetitive robot work.",
    icon: ScanLine,
  },
  {
    id: 4,
    label: "04 // RISK",
    title: "Security Blindspots",
    desc: "Surface scans miss deep-layer dependencies. Without introspection, you are shipping vulnerabilities faster than features.",
    icon: ShieldAlert,
  }
];

export default function QuadrantScanner() {
  const [activeId, setActiveId] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // --- HYDRATION ERROR FIX ---
  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Helper to determine grid areas for desktop "Bento" layout
  const getGridTemplate = () => {
    if (!activeId) return { cols: '1fr 1fr', rows: '1fr 1fr' };
    
    const cols = (activeId === 1 || activeId === 3) ? '1.5fr 1fr' : '1fr 1.5fr';
    const rows = (activeId === 1 || activeId === 2) ? '1.5fr 1fr' : '1fr 1.5fr';
    
    return { cols, rows };
  };

  const { cols, rows } = getGridTemplate();

  return (
    <section className="bg-[#050505] min-h-screen flex flex-col items-center justify-center py-24 px-6 relative overflow-hidden">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/10 via-[#050505] to-[#050505] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 brightness-100 contrast-150 pointer-events-none mix-blend-overlay" />
      
      {/* Delicate horizontal lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

      {/* --- HEADER --- */}
      <div className="relative z-10 text-center mb-16 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 shadow-[0_0_20px_-5px_rgba(255,69,0,0.3)] backdrop-blur-md"
        >
          <Activity size={14} className="text-[#FF4500]" />
          <span className="text-[11px] font-mono text-[#FF4500] font-bold tracking-widest uppercase">
            System Diagnostics Active
          </span>
        </motion.div>
        
        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6">
          CRITICAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4500] via-orange-400 to-white">FAILURE</span> MODES
        </h2>
        
        <p className="text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Your architecture isn't breaking all at once. <br className="hidden md:block"/>It's decaying silently in four specific quadrants.
        </p>
      </div>

      {/* --- GRID CONTAINER --- */}
      <div 
        className="relative z-10 w-full max-w-6xl mx-auto h-auto md:h-[600px] grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        onMouseLeave={() => setActiveId(null)}
        style={{
          gridTemplateColumns: isDesktop ? cols : undefined,
          gridTemplateRows: isDesktop ? rows : undefined,
        }}
      >
        {QUADS.map((q) => {
          const isActive = activeId === q.id;
          const isDimmed = activeId !== null && !isActive;

          return (
            <motion.div
              layout
              key={q.id}
              onMouseEnter={() => setActiveId(q.id)}
              className={`
                group relative flex flex-col justify-between overflow-hidden rounded-3xl 
                border bg-[#0A0A0A] backdrop-blur-sm
                transition-all duration-500
                ${isActive ? 'border-[#FF4500]/50 shadow-[0_0_50px_-12px_rgba(255,69,0,0.3)] z-20' : 'border-white/5 hover:border-[#FF4500]/30'}
                ${isDimmed ? 'opacity-40 blur-[1px] grayscale' : 'opacity-100'}
              `}
            >
              {/* Internal Gradient Glow (Unified Orange) */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-[#FF4500]/20 via-orange-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
              />
              
              {/* Scanline Effect (Active Only) */}
              {isActive && (
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay animate-pulse" />
              )}

              {/* Card Content Top */}
              <div className="relative p-6 md:p-8 flex items-start justify-between z-10">
                <div className="flex flex-col gap-4">
                  <div 
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center border
                      transition-colors duration-300
                      ${isActive ? `bg-[#FF4500] text-black border-transparent` : `bg-white/5 border-white/10 text-white/50 group-hover:text-[#FF4500] group-hover:border-[#FF4500]/30`}
                    `}
                  >
                    <q.icon size={20} />
                  </div>
                  <span className={`font-mono text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${isActive ? 'text-[#FF4500]' : 'text-white/40'}`}>
                    {q.label}
                  </span>
                </div>
                
                {/* Mobile Expansion Indicator */}
                <ArrowUpRight 
                  className={`text-white/20 transition-transform duration-500 ${isActive ? 'rotate-45 text-[#FF4500]' : 'group-hover:text-[#FF4500]'}`} 
                />
              </div>

              {/* Card Content Bottom */}
              <div className="relative p-6 md:p-8 z-10 mt-auto">
                <h3 
                  className={`
                    font-bold text-white mb-3 transition-all duration-300
                    ${isActive ? 'text-3xl md:text-4xl' : 'text-2xl text-white/70'}
                  `}
                >
                  {q.title}
                </h3>
                
                <div className="relative overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isActive ? 'auto' : 0,
                      opacity: isActive ? 1 : 0,
                      y: isActive ? 0 : 10
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <p className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-[90%] pb-2">
                      {q.desc}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Corner Accents */}
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                 <div className="w-16 h-16 border-t border-r border-[#FF4500]/30 rounded-tr-3xl" />
              </div>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}