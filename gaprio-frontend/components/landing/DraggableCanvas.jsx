"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, Activity, ShieldCheck, Zap } from "lucide-react";

// --- CONFIGURATION WITH DYNAMIC DATA ---
const TOOLS = [
  { id: 'asana', label: 'Asana', image: '/companylogo/asana.png', x: 1, y: -300, mobileX: 0, mobileY: -220, color: '#ea580c', latency: '12ms', status: 'Synced', uptime: '99.99%' },
  { id: 'jira', label: 'Jira', image: '/companylogo/jira.png', x: 280, y: -200, mobileX: 140, mobileY: -110, color: '#d97706', latency: '45ms', status: 'Processing', uptime: '99.8%' },
  { id: 'ms365', label: 'MS 365', image: '/companylogo/microsoft.webp', x: 400, y: 0, mobileX: 160, mobileY: 0, color: '#2563eb', latency: '18ms', status: 'Connected', uptime: '99.95%' },
  { id: 'clickup', label: 'ClickUp', image: '/companylogo/clickup.png', x: 280, y: 200, mobileX: 140, mobileY: 110, color: '#7c3aed', latency: '22ms', status: 'Active', uptime: '99.9%' },
  { id: 'zoho', label: 'Zoho', image: '/companylogo/zoho.png', x: -1, y: 300, mobileX: 0, mobileY: 220, color: '#ef4444', latency: '30ms', status: 'Secure', uptime: '99.5%' },
  { id: 'google', label: 'Google', image: '/companylogo/google.webp', x: -280, y: 200, mobileX: -140, mobileY: 110, color: '#dc2626', latency: '8ms', status: 'Optimized', uptime: '99.99%' },
  { id: 'slack', label: 'Slack', image: '/companylogo/slack.png', x: -400, y: 0, mobileX: -160, mobileY: 0, color: '#f97316', latency: '15ms', status: 'Live', uptime: '100%' },
  { id: 'miro', label: 'Miro', image: '/companylogo/miro.png', x: -280, y: -200, mobileX: -140, mobileY: -110, color: '#fbbf24', latency: '25ms', status: 'Cached', uptime: '99.9%' },
];

export default function NeuralDragSystem() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative w-full min-h-[1200px] bg-[#020202] flex flex-col items-center overflow-hidden font-sans selection:bg-orange-500/30">
      
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:50px_50px] opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* --- HEADER --- */}
      <div className="relative z-10 pt-24 pb-12 px-6 text-center max-w-3xl mx-auto pointer-events-none">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tighter mb-4">
            Your Digital World, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Unified</span>
          </h1>

          {/* Description */}
          <p className="text-zinc-400 text-sm md:text-lg leading-relaxed">
            Stop switching between tabs. Gaprio connects your favorite tools into one intelligent core. 
            <br className="hidden md:block" />
            <span className="text-zinc-500">Drag the integrations below to visualize the connection.</span>
          </p>

        </motion.div>
      </div>
      
      {/* --- DRAG CANVAS --- */}
      <div ref={containerRef} className="flex-1 w-full relative flex items-center justify-center cursor-crosshair pb-20">
        
        {/* CENTER CORE (FIXED: Added High Z-Index to stay ON TOP of lines) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: 50 }}>
            <div className="absolute inset-0 bg-orange-500/10 blur-[80px] rounded-full animate-pulse" />
            <div className="w-32 h-32 md:w-40 md:h-40 bg-[#050505] rounded-full border border-white/10 flex items-center justify-center shadow-2xl relative z-20">
                <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_10s_linear_infinite]" />
                <div className="relative w-16 h-16 md:w-20 md:h-20 opacity-90">
                    <Image src="/logo1.png" alt="Gaprio" fill className="object-contain" />
                </div>
            </div>
        </div>

        {/* NODES */}
        {TOOLS.map((tool) => (
            <DraggableNode 
                key={tool.id} 
                tool={tool} 
                containerRef={containerRef} 
                isMobile={isMobile} 
            />
        ))}

      </div>
    </section>
  );
}

// --- UPDATED PHYSICS NODE COMPONENT ---
function DraggableNode({ tool, containerRef, isMobile }) {
    const initialX = isMobile ? tool.mobileX : tool.x;
    const initialY = isMobile ? tool.mobileY : tool.y;
    
    // State for interactions
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    
    // 1. SPRING PHYSICS
    const x = useSpring(initialX, { stiffness: 150, damping: 15, mass: 0.8 });
    const y = useSpring(initialY, { stiffness: 150, damping: 15, mass: 0.8 });
    
    // State to track current spring position for the SVG line
    const [pos, setPos] = useState({ x: initialX, y: initialY });

    // 2. Handle Resize/Mobile switch
    useEffect(() => {
        x.set(isMobile ? tool.mobileX : tool.x);
        y.set(isMobile ? tool.mobileY : tool.y);
    }, [isMobile, tool.x, tool.y, tool.mobileX, tool.mobileY, x, y]);

    // 3. Sync Spring to State for SVG Drawing
    useEffect(() => {
        const unsubX = x.on("change", (v) => setPos(p => ({ ...p, x: v })));
        const unsubY = y.on("change", (v) => setPos(p => ({ ...p, y: v })));
        return () => { unsubX(); unsubY(); };
    }, [x, y]);

    // 4. Line Calculations
    const midX = pos.x / 2;
    const midY = pos.y / 2 + 60; // Droop effect
    const gradientId = `gradient-${tool.id}`;

    // 5. Scroll Interaction
    const scrollToStack = () => {
        const element = document.getElementById(`integration-${tool.id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // 6. Logic to determine where to show the tooltip
    const isTopHalf = pos.y < 0;

    return (
        <>
            {/* A. THE CABLE (FIXED: zIndex 0 to be BEHIND the center core) */}
            <svg className="absolute top-1/2 left-1/2 overflow-visible pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.05" />
                        <stop offset="100%" stopColor={tool.color} stopOpacity="0.6" />
                    </linearGradient>
                </defs>
                <motion.path 
                    d={`M 0 0 Q ${midX} ${midY} ${pos.x} ${pos.y}`}
                    stroke={`url(#${gradientId})`}
                    strokeWidth="2" 
                    strokeLinecap="round"
                    fill="none"
                    initial={false}
                    animate={{ 
                        strokeWidth: isHovered || isDragging ? 5 : 4,
                        opacity: isHovered || isDragging ? 1 : 0.5 
                    }}
                    transition={{ duration: 0.3 }}
                />
            </svg>

            {/* B. THE CARD */}
            <motion.div
                drag
                dragConstraints={containerRef}
                dragElastic={0.1}
                dragMomentum={false}
                style={{ x, y }}
                
                // Event Handlers
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}

                whileHover={{ scale: 1.1, cursor: 'grab' }}
                whileDrag={{ scale: 1.15, cursor: 'grabbing' }}
                
                className={`group absolute top-1/2 left-1/2 -ml-[40px] -mt-[40px] md:-ml-12 md:-mt-12 w-[80px] h-[80px] md:w-24 md:h-24 bg-[#0a0a0a] rounded-3xl flex flex-col items-center justify-center shadow-2xl border border-white/10 backdrop-blur-md touch-none select-none overflow-visible`}
                // Ensure active element is always on top
                animate={{ zIndex: isDragging ? 100 : 20 }} 
            >
                {/* Main Card Content */}
                <div 
                    onClick={scrollToStack}
                    className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer"
                >
                    <div className="relative w-8 h-8 md:w-10 md:h-10 mb-2 pointer-events-none select-none">
                        <Image src={tool.image} alt={tool.label} fill draggable={false} className="object-contain"/>
                    </div>
                    
                    <span className="text-[10px] md:text-[11px] text-zinc-400 font-bold uppercase tracking-wider pointer-events-none select-none transition-colors group-hover:text-white">
                        {tool.label}
                    </span>
                </div>
                
                {/* C. HOLOGRAPHIC HUD WITH DYNAMIC DATA */}
                <AnimatePresence>
                    {(isDragging || isHovered) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: isTopHalf ? -10 : 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: isTopHalf ? -10 : 10 }}
                            transition={{ duration: 0.2 }}
                            className={`
                                absolute left-1/2 -translate-x-1/2 w-48 p-3
                                bg-[#080808]/95 border border-zinc-800 rounded-xl shadow-2xl pointer-events-none
                                ${isTopHalf ? 'top-full mt-4' : 'bottom-full mb-4'}
                            `}
                            style={{ zIndex: 110 }}
                        >
                            {/* Decorative Arrow */}
                            <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[#080808] border-zinc-800 rotate-45 ${isTopHalf ? '-top-1.5 border-l border-t' : '-bottom-1.5 border-r border-b'}`} />
                            
                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                                <span className="text-white font-bold text-xs">{tool.label} Core</span>
                                <span className="text-[9px] text-emerald-400 font-mono bg-emerald-400/10 px-1 rounded">ACTIVE</span>
                            </div>
                            
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                                   <span className="flex items-center gap-1"><Activity size={10} className="text-blue-400"/> Latency</span>
                                   <span className="text-zinc-200">{tool.latency}</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                                   <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-orange-400"/> Status</span>
                                   <span className="text-zinc-200">{tool.status}</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                                   <span className="flex items-center gap-1"><Zap size={10} className="text-yellow-400"/> Uptime</span>
                                   <span className="text-zinc-200">{tool.uptime}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hover Glow Effects */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                <div 
                    className="absolute inset-0 rounded-3xl border border-transparent transition-colors duration-300 pointer-events-none" 
                    style={{ borderColor: `${tool.color}40` }} 
                />
            </motion.div>
        </>
    );
}