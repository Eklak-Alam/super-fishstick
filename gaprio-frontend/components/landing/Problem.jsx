'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Binary, 
  Workflow, 
  ScanLine, 
  ShieldAlert, 
  ArrowUpRight
} from 'lucide-react';

// --- DATA ---
const QUADS = [
  {
    id: 1,
    label: "SILOS",
    title: "DATA FRAGMENTATION",
    desc: "Information lives across disconnected tools. Each system holds a partial truth, but no system understands the whole picture. Teams act on assumptions because context never fully converges.",
    icon: Binary,
  },
  {
    id: 2,
    label: "CONTEXT",
    title: "COGNITIVE DECAY",
    desc: "Knowledge workers are forced to constantly shift attention between tools, conversations, and priorities. Focus fragments. Understanding degrades. Important details slip through without anyone noticing.",
    icon: Workflow,
  },
  {
    id: 3,
    label: "FRICTION",
    title: "MANUAL OVERHEAD",
    desc: "Routine coordination work still depends on human intervention. Tasks are copied, updates are repeated, and follow ups are manual. High skill teams spend time doing low leverage work.",
    icon: ScanLine,
  },
  {
    id: 4,
    label: "RISK",
    title: "SECURITY BLINDSPOTS",
    desc: "When systems operate independently, visibility breaks down. Permissions drift, dependencies are missed, and actions happen without full context. Risk accumulates quietly until it surfaces too late.",
    icon: ShieldAlert,
  }
];

export default function QuadrantScanner() {
  const [activeId, setActiveId] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // --- RESPONSIVE CHECK ---
  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Calculate Grid Layout for Smooth Transitions
  // We determine the grid tracks based on which card is active
  const getGridTemplate = () => {
    if (!isDesktop || !activeId) return { cols: '1fr 1fr', rows: '1fr 1fr' };
    
    // Bento Logic: Active card gets 1.5fr space
    const cols = (activeId === 1 || activeId === 3) ? '1.5fr 1fr' : '1fr 1.5fr';
    const rows = (activeId === 1 || activeId === 2) ? '1.5fr 1fr' : '1fr 1.5fr';
    
    return { cols, rows };
  };

  const { cols, rows } = getGridTemplate();

  return (
    <section className="bg-[#050505] min-h-screen flex flex-col items-center justify-center py-24 px-4 sm:px-6 relative overflow-hidden">
      
      {/* --- BACKGROUND FX (UNCHANGED) --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/10 via-[#050505] to-[#050505] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 brightness-100 contrast-150 pointer-events-none mix-blend-overlay" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

      {/* --- HEADER (FIXED: CENTERED & SPLIT) --- */}
      <div className="relative z-10 w-full max-w-4xl mx-auto mb-16 flex flex-col items-center text-center">
        
        {/* Line 1 */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9]">
            CRITICAL
        </h2>
        
        {/* Line 2 */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4500] via-orange-400 to-white tracking-tighter leading-[1.1] mb-6">
            FAILURE MODES
        </h2>
        
        <p className="text-neutral-500 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
          Your systems are not failing all at once. <br className="hidden md:block"/>
          They are quietly degrading across four structural fault lines.
        </p>
      </div>

      {/* --- GRID CONTAINER (SMOOTH LAYOUT) --- */}
      {/* We animate the grid container itself to handle the column resizing smoothly */}
      <motion.div 
        className="relative z-10 w-full max-w-6xl mx-auto h-auto md:h-[600px] grid grid-cols-1 md:grid-cols-2 gap-4"
        onMouseLeave={() => setActiveId(null)}
        animate={{
            gridTemplateColumns: isDesktop ? cols : '1fr',
            gridTemplateRows: isDesktop ? rows : 'auto'
        }}
        transition={{
            type: "spring",
            stiffness: 200,
            damping: 25
        }}
      >
        {QUADS.map((q) => {
          const isActive = activeId === q.id;
          const isDimmed = activeId !== null && !isActive;

          return (
            <motion.div
              layout
              key={q.id}
              onMouseEnter={() => setIsDesktop && setActiveId(q.id)}
              onClick={() => !isDesktop && setActiveId(isActive ? null : q.id)} // Mobile tap
              
              // --- CARD ANIMATION ---
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: isDimmed ? 0.5 : 1,
                scale: isDimmed ? 0.98 : 1, // Subtle shrink for inactive cards
                filter: isDimmed ? 'blur(2px) grayscale(50%)' : 'blur(0px) grayscale(0%)',
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25
              }}

              className={`
                group relative flex flex-col justify-between overflow-hidden rounded-3xl 
                border bg-[#0A0A0A] backdrop-blur-sm cursor-default
                ${isActive ? 'border-[#FF4500]/50 shadow-[0_0_50px_-12px_rgba(255,69,0,0.3)] z-20' : 'border-white/5 hover:border-[#FF4500]/30'}
              `}
            >
                {/* 1. Internal Gradient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br from-[#FF4500]/20 via-orange-900/5 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                
                {/* 2. Active Scanline */}
                {isActive && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 0.15 }} 
                        className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" 
                    />
                )}

                {/* CONTENT TOP */}
                <div className="relative p-6 md:p-8 flex items-start justify-between z-10 w-full">
                    <div className="flex flex-col gap-4">
                        <motion.div 
                            layout
                            className={`
                                w-10 h-10 rounded-lg flex items-center justify-center border transition-colors duration-300
                                ${isActive ? 'bg-[#FF4500] text-black border-transparent' : 'bg-white/5 border-white/10 text-white/50 group-hover:text-[#FF4500] group-hover:border-[#FF4500]/30'}
                            `}
                        >
                            <q.icon size={20} />
                        </motion.div>
                        <span className={`font-mono text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${isActive ? 'text-[#FF4500]' : 'text-white/40'}`}>
                            {q.label}
                        </span>
                    </div>
                    
                    <ArrowUpRight className={`text-white/20 transition-all duration-500 ${isActive ? 'rotate-45 text-[#FF4500]' : 'group-hover:text-white/60'}`} />
                </div>

                {/* CONTENT BOTTOM */}
                <div className="relative p-6 md:p-8 z-10 mt-auto w-full">
                    <motion.h3 
                        layout="position"
                        className={`font-bold text-white mb-2 transition-colors duration-300 ${isActive ? 'text-2xl md:text-3xl' : 'text-xl text-white/70'}`}
                    >
                        {q.title}
                    </motion.h3>
                    
                    {/* Smooth Text Reveal */}
                    <motion.div
                        initial={false}
                        animate={{ 
                            height: isActive ? 'auto' : 0,
                            opacity: isActive ? 1 : 0
                        }}
                        transition={{
                             type: "spring",
                             stiffness: 180,
                             damping: 25
                        }}
                        className="overflow-hidden"
                    >
                        <p className="text-neutral-400 text-sm md:text-base leading-relaxed pt-2 pb-1">
                            {q.desc}
                        </p>
                    </motion.div>
                </div>

                {/* Corner Accent */}
                <div className={`absolute top-0 right-0 p-4 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                   <div className="w-16 h-16 border-t border-r border-[#FF4500]/30 rounded-tr-3xl" />
                </div>

            </motion.div>
          );
        })}
      </motion.div>

    </section>
  );
}