'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight, ShieldCheck, Globe, Cpu, LayoutGrid, Check, ArrowRight, Zap, MousePointer2, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- DATA ---
const heroTools = [
  { id: 'asana', label: 'Asana', image: '/companylogo/asana.png', x: 5, y: -260, mobileX: 0, mobileY: -160, color: '#ea580c', bg: 'bg-[#151515]' },
  { id: 'jira', label: 'Jira', image: '/companylogo/jira.png', x: 240, y: -180, mobileX: 120, mobileY: -110, color: '#d97706', bg: 'bg-[#151515]' },
  { id: 'ms365', label: 'MS 365', image: '/companylogo/microsoft.webp', x: 360, y: 0, mobileX: 160, mobileY: 0, color: '#2563eb', bg: 'bg-[#151515]' },
  { id: 'clickup', label: 'ClickUp', image: '/companylogo/clickup.png', x: 240, y: 180, mobileX: 120, mobileY: 110, color: '#7c3aed', bg: 'bg-[#151515]' },
  { id: 'zoho', label: 'Zoho', image: '/companylogo/zoho.png', x: -5, y: 260, mobileX: 0, mobileY: 160, color: '#ef4444', bg: 'bg-[#151515]' },
  { id: 'google', label: 'Google', image: '/companylogo/google.webp', x: -240, y: 180, mobileX: -120, mobileY: 110, color: '#dc2626', bg: 'bg-[#151515]' },
  { id: 'slack', label: 'Slack', image: '/companylogo/slack.png', x: -360, y: 0, mobileX: -160, mobileY: 0, color: '#f97316', bg: 'bg-[#151515]' },
  { id: 'miro', label: 'Miro', image: '/companylogo/miro.png', x: -240, y: -180, mobileX: -120, mobileY: -110, color: '#fbbf24', bg: 'bg-[#151515]' },
];

const integrationDetails = [
  { id: 'google', name: 'Google Workspace', icon: '/companylogo/google.webp', tagline: 'The Collaboration Backbone', problem: "Files and calendars are scattered across personal drives.", solution: "Gaprio unifies Drive permissions and syncs every calendar instantly.", features: ['Calendar Sync', 'Drive Access', 'SSO Login'] },
  { id: 'slack', name: 'Slack', icon: '/companylogo/slack.png', tagline: 'Centralized Nerve Center', problem: "Critical updates get lost in noise. Context switching kills focus.", solution: "Turn Slack into your command center with filtered, actionable alerts.", features: ['Smart Notifications', 'Slash Commands', 'Thread Sync'] },
  { id: 'jira', name: 'Jira Software', icon: '/companylogo/jira.png', tagline: 'Engineering Velocity', problem: "Status updates are manual and outdated.", solution: "Two-way sync ensures updates in roadmap automatically.", features: ['Issue Tracking', 'Sprint Planning', 'DevOps View'] },
  { id: 'asana', name: 'Asana', icon: '/companylogo/asana.png', tagline: 'Project Orchestration', problem: "Tasks slip through the cracks across departments.", solution: "Visualize cross-functional timelines and dependencies.", features: ['Portfolio View', 'Task Dependencies', 'Auto-Assign'] },
  { id: 'ms365', name: 'Microsoft 365', icon: '/companylogo/microsoft.webp', tagline: 'Enterprise Scale', problem: "Legacy enterprise data is often siloed in Excel.", solution: "Bring the power of Excel/Outlook into the modern stack.", features: ['Excel Live Sync', 'Outlook Integ', 'Teams Connect'] },
  { id: 'clickup', name: 'ClickUp', icon: '/companylogo/clickup.png', tagline: 'The Everything App', problem: "Disconnected from specialized vertical tools.", solution: "Bridge ClickUp with GitHub/Salesforce for a true 'one app' feel.", features: ['Doc Sync', 'Goal Tracking', 'Whiteboards'] },
  { id: 'miro', name: 'Miro', icon: '/companylogo/miro.png', tagline: 'Visual Intelligence', problem: "Ideas on whiteboards aren't actionable.", solution: "Convert sticky notes into Jira tickets with a single click.", features: ['Board Embedding', 'Note-to-Task', 'Live Canvas'] },
  { id: 'zoho', name: 'Zoho One', icon: '/companylogo/zoho.png', tagline: 'Business OS', problem: "CRM data is invisible to product teams.", solution: "Close the feedback loop by connecting tickets to backlogs.", features: ['CRM Sync', 'Desk Tickets', 'Finance Data'] },
];

const steps = [
    { id: 1, title: "Identity & Registration", description: "Create your secure Gaprio ID. We verify your workspace eligibility instantly.", icon: ShieldCheck, tags: ["SSO Supported", "2FA"] },
    { id: 2, title: "Ecosystem Handshake", description: "Link your primary workspace. Seamlessly integrate Google Workspace or Microsoft 365.", icon: Globe, tags: ["OAuth 2.0", "Read-Only"] },
    { id: 3, title: "Channel Synchronization", description: "Plug in your communication layers. Connect Slack, Jira, and Asana.", icon: Cpu, tags: ["Webhooks", "Filtering"] },
    { id: 4, title: "Dashboard Activation", description: "Your nervous system is ready. The dashboard lights up with unified data.", icon: LayoutGrid, tags: ["Analytics", "Zero Latency"] }
];

// --- COMPONENTS ---

const GrainOverlay = () => (
  <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.06] mix-blend-overlay fixed">
    <svg className='w-full h-full'>
      <filter id='noiseFilter'>
        <feTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch' />
      </filter>
      <rect width='100%' height='100%' filter='url(#noiseFilter)' />
    </svg>
  </div>
);

// --- DRAGGABLE NODE ---
function DraggableNode({ tool, containerRef, isMobile }) {
    const initialX = isMobile ? tool.mobileX : tool.x;
    const initialY = isMobile ? tool.mobileY : tool.y;
    const x = useSpring(initialX, { stiffness: 120, damping: 20 });
    const y = useSpring(initialY, { stiffness: 120, damping: 20 });
    const [pos, setPos] = useState({ x: initialX, y: initialY });

    useEffect(() => {
        x.set(isMobile ? tool.mobileX : tool.x);
        y.set(isMobile ? tool.mobileY : tool.y);
    }, [isMobile, tool.x, tool.y, tool.mobileX, tool.mobileY, x, y]);

    useEffect(() => {
        const unsubX = x.on("change", (v) => setPos(p => ({ ...p, x: v })));
        const unsubY = y.on("change", (v) => setPos(p => ({ ...p, y: v })));
        return () => { unsubX(); unsubY(); };
    }, [x, y]);

    const midX = pos.x / 2;
    const midY = pos.y / 2 + 60; 
    const gradientId = `gradient-${tool.id}`;

    const scrollToStack = () => {
        const element = document.getElementById(`integration-${tool.id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <>
            <svg className="absolute top-1/2 left-1/2 overflow-visible pointer-events-none" style={{ zIndex: 10 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.05" />
                        <stop offset="100%" stopColor={tool.color} stopOpacity="0.6" />
                    </linearGradient>
                </defs>
                <motion.path 
                    d={`M 0 0 Q ${midX} ${midY} ${pos.x} ${pos.y}`}
                    stroke={`url(#${gradientId})`}
                    strokeWidth="4" 
                    strokeLinecap="round"
                    fill="none"
                    className="opacity-80 transition-opacity duration-300" 
                />
            </svg>

            <motion.div
                drag
                dragConstraints={containerRef}
                dragElastic={0.1}
                dragMomentum={false}
                style={{ x, y }}
                whileHover={{ scale: 1.1, cursor: 'grab' }}
                whileDrag={{ scale: 1.15, cursor: 'grabbing', zIndex: 100 }}
                className={`group absolute w-[80px] h-[80px] md:w-24 md:h-24 ${tool.bg} rounded-3xl flex flex-col items-center justify-center shadow-2xl z-20 border border-white/10 backdrop-blur-md touch-none select-none overflow-visible`}
            >
                <div 
                    onClick={scrollToStack}
                    className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer"
                >
                    <div className="relative w-8 h-8 md:w-10 md:h-10 mb-2 pointer-events-none select-none">
                        <Image src={tool.image} alt={tool.label} fill draggable={false} className="object-contain"/>
                    </div>
                    {/* LABEL ALWAYS VISIBLE */}
                    <span className="text-[10px] md:text-[11px] text-zinc-400 font-bold uppercase tracking-wider pointer-events-none select-none transition-colors group-hover:text-white">
                        {tool.label}
                    </span>
                </div>
                
                {/* --- BOTTOM PILL BUTTON (HALF-IN / HALF-OUT) --- */}
                <div className="absolute -bottom-3 left-0 right-0 flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-30">
                    <button 
                        onClick={(e) => { e.stopPropagation(); scrollToStack(); }}
                        className="flex items-center gap-1.5 bg-[#050505] border border-zinc-700 hover:border-orange-500/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-black/50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                        <span>View Docs</span>
                        <ArrowUpRight className="w-2.5 h-2.5 text-orange-400" />
                    </button>
                </div>

                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                <div className={`absolute inset-0 rounded-3xl border border-transparent group-hover:border-[${tool.color}]/50 transition-colors duration-300 pointer-events-none`} style={{ borderColor: tool.color + '40' }} />
            </motion.div>
        </>
    );
}

// --- TIMELINE CARD ---
const TimelineCard = ({ step, index, isLeft }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn(
                "relative md:w-[45%] mb-24 md:mb-0",
                isLeft ? "md:mr-auto md:pr-12 md:text-right" : "md:ml-auto md:pl-12 md:text-left"
            )}
        >
            <div className={cn(
                "hidden md:block absolute top-10 h-[2px] bg-gradient-to-r from-orange-500/50 to-transparent w-16",
                isLeft ? "right-0 rotate-180 origin-left" : "left-0"
            )} />

            <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#0a0a0a] p-8 hover:border-orange-500/30 transition-colors duration-500 backdrop-blur-sm">
                <span className={cn(
                    "absolute -top-4 text-[80px] font-bold text-zinc-900/50 font-mono transition-colors group-hover:text-orange-900/20",
                    isLeft ? "right-4" : "left-4"
                )}>
                    0{step.id}
                </span>

                <div className={cn("relative z-10 flex flex-col gap-4", isLeft ? "md:items-end" : "md:items-start")}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-black border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_4px_20px_-10px_rgba(255,255,255,0.1)]">
                        <step.icon className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-50 transition-colors">{step.title}</h3>
                        <p className="text-zinc-400 leading-relaxed text-sm md:text-base">{step.description}</p>
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
        </motion.div>
    );
};

// --- TIMELINE SECTION ---
const TimelineSection = () => {
    const containerRef = useRef(null);
    const [active, setActive] = useState(false);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });
    
    // Animate the line fill
    const scaleY = useTransform(scrollYProgress, [0, 0.95], [0, 1]);

    // Detect when line hits the button to trigger "ignition"
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest > 0.95 && !active) setActive(true);
        if (latest < 0.95 && active) setActive(false);
    });

    return (
        <section ref={containerRef} className="relative w-full py-32 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto relative">
                <div className="text-center mb-24 relative z-10">
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                    >
                         <h2 className="text-sm font-bold text-orange-500 tracking-[0.3em] uppercase mb-3">How It Works</h2>
                         <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">The <span className="text-zinc-600">Nervous System</span></h3>
                    </motion.div>
                </div>

                {/* Central Spine with Magma Effect */}
                <div className="absolute left-8 md:left-1/2 top-32 bottom-[60px] w-[3px] bg-zinc-900 -translate-x-1/2 rounded-full overflow-hidden">
                    <motion.div 
                        style={{ scaleY, transformOrigin: "top" }}
                        className="w-full h-full bg-gradient-to-b from-orange-500 via-red-500 to-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.8)]"
                    />
                </div>

                <div className="relative z-10 flex flex-col gap-12 md:gap-0">
                    {steps.map((step, index) => {
                        const isLeft = index % 2 === 0;
                        return (
                            <div key={step.id} className="relative md:flex md:items-center w-full md:h-[300px]">
                                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#020202] border-[3px] border-zinc-800 rounded-full z-20 items-center justify-center">
                                    <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${active ? 'bg-orange-500' : 'bg-zinc-600'}`} />
                                </div>
                                <TimelineCard step={step} index={index} isLeft={isLeft} />
                            </div>
                        )
                    })}
                </div>

                {/* Connected CTA Button - Ignition Effect */}
                <div className="mt-28 flex justify-center relative z-20">
                    <motion.button 
                        className={cn(
                            "group cursor-pointer relative px-10 py-5 rounded-full flex items-center gap-4 overflow-hidden transition-all duration-500 border",
                            active 
                                ? "bg-orange-600 border-orange-400 text-white scale-110"
                                : "bg-[#0a0a0a] border-zinc-800 text-zinc-500 scale-100"
                        )}
                    >
                         <span className="relative z-10 font-bold tracking-wide">Start Integration</span>
                         <Zap className={cn("w-5 h-5 relative z-10 transition-colors", active ? "text-white fill-white" : "text-zinc-600")} />
                         
                         {/* Pulse Rings */}
                         {active && (
                             <>
                                <span className="absolute inset-0 rounded-full border border-white/40 animate-[ping_1.5s_linear_infinite]" />
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-100" />
                             </>
                         )}
                    </motion.button>
                </div>
            </div>
        </section>
    );
}

// --- INTEGRATION STACK ---
const IntegrationStack = () => {
    return (
        <section className="relative w-full">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* HEADLINE: BETTER, STANDARD LEVEL */}
                <div className="mb-32 md:sticky md:top-24 z-0 text-center md:text-left">
                     <h2 className="text-sm font-bold text-orange-500 tracking-[0.3em] uppercase mb-8">Deep Dive</h2>
                     <h3 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-8">
                        Unified <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-500 to-zinc-800">
                           Ecosystems.
                        </span>
                     </h3>
                     <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-transparent mb-10 md:mx-0 mx-auto" />
                     <p className="text-zinc-400 max-w-2xl text-xl md:text-2xl leading-relaxed md:mx-0 mx-auto font-light">
                        Detailed breakdown of how Gaprio unlocks the hidden potential of your existing stack.
                     </p>
                </div>

                <div className="relative flex flex-col items-center">
                    {integrationDetails.map((tool, index) => {
                        const topOffset = 100 + (index * 20); 
                        
                        return (
                            <motion.div
                                key={tool.id}
                                id={`integration-${tool.id}`} // Target for scrolling
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                // STRICT ORANGE/DARK THEME
                                className="sticky w-full max-w-5xl bg-[#080808] border border-white/5 rounded-[2rem] p-8 md:p-14 mb-24 md:mb-12 shadow-[0_0_80px_-30px_rgba(0,0,0,1)] overflow-hidden"
                                style={{ top: `${topOffset}px` }}
                            >
                                {/* Subtle Orange Glow */}
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />

                                <div className="relative z-10 grid md:grid-cols-[1fr_2fr] gap-12 items-start">
                                    {/* Left: Brand Identity */}
                                    <div className="flex flex-col gap-8">
                                        <div className="w-24 h-24 relative bg-[#0f0f0f] rounded-3xl p-5 border border-white/5 flex items-center justify-center shadow-inner">
                                            <Image src={tool.icon} alt={tool.name} width={64} height={64} className="object-contain" />
                                        </div>
                                        <div>
                                            <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">{tool.name}</h3>
                                            <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">{tool.tagline}</span>
                                        </div>
                                        <button className="group flex items-center gap-3 text-sm font-bold text-zinc-400 mt-auto border-b border-zinc-800 pb-2 w-fit hover:border-orange-500 hover:text-white transition-all">
                                            Connect {tool.name}
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-orange-500" />
                                        </button>
                                    </div>

                                    {/* Right: The Solution */}
                                    <div className="flex flex-col gap-12 pt-2">
                                        <div className="space-y-10">
                                            <div className="flex gap-6 items-start">
                                                <div className="w-[1px] h-16 bg-zinc-800 flex-shrink-0 mt-2" />
                                                <div>
                                                    <h4 className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-3">The Friction</h4>
                                                    <p className="text-zinc-400 leading-relaxed text-lg font-light">{tool.problem}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-6 items-start">
                                                <div className="w-[3px] h-16 bg-gradient-to-b from-orange-500 to-orange-800 flex-shrink-0 mt-2 shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
                                                <div>
                                                    <h4 className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-3">The Solution</h4>
                                                    <p className="text-white leading-relaxed text-xl">{tool.solution}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mt-auto border-t border-white/5 pt-8">
                                            {tool.features.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs font-bold text-zinc-300">
                                                    <Check className="w-3 h-3 text-orange-500" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    <div className="h-[20vh]" />
                </div>
            </div>
        </section>
    );
};

// --- MAIN PAGE ---
export default function UnifiedPage() {
  const containerRef = useRef(null);

  return (
    <main className="relative w-full lg:pt-5 pt-20 min-h-screen bg-[#020202] text-white overflow-x-hidden selection:bg-orange-500/30">
      
      {/* GLOBAL BACKGROUND ELEMENTS (FIXED) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Deep Orange Radial */}
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[100vw] h-[80vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2a1005] via-[#050505] to-transparent opacity-100" />
          {/* Grain */}
          <GrainOverlay />
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* --- SECTION 1: HERO --- */}
      <section className="relative w-full min-h-[100vh] flex flex-col items-center pt-20 md:pt-32 z-10">
          
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
          
          {/* UPDATED HERO HEADING */}
          <div className="relative z-10 text-center max-w-5xl px-6 mb-8 pointer-events-none select-none">
            <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1] mb-8 text-white drop-shadow-2xl">
                  Your Stack. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500">
                     Fully Connected.
                  </span>
                </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-zinc-400 text-md md:text-lg max-w-2xl mx-auto leading-relaxed font-light"
            >
              Gaprio turns your fragmented tools into a single, intelligent <span className="text-orange-500 font-medium">nervous system</span>.
            </motion.p>
          </div>

          <div 
            ref={containerRef}
            className="relative w-full max-w-[1200px] h-[500px] md:h-[600px] flex items-center justify-center z-20 cursor-crosshair touch-none select-none"
          >
            <div className="relative z-30 flex items-center justify-center pointer-events-none">
               <div className="absolute w-40 h-40 bg-orange-500/20 blur-[60px] rounded-full animate-pulse" />
               <div className="relative w-28 h-28 md:w-36 md:h-36 bg-[#0a0a0a] rounded-full border border-zinc-800 shadow-[0_0_50px_-10px_rgba(234,88,12,0.4)] flex items-center justify-center ring-1 ring-white/10">
                  <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-[ping_3s_linear_infinite]" />
                  <div className="absolute inset-8 rounded-full border border-orange-500/20 animate-[ping_3s_linear_infinite_1s]" />
                  <div className="relative w-12 h-12 md:w-16 md:h-16">
                     <Image src="/logo1.png" alt="Gaprio" fill className="object-contain drop-shadow-[0_0_15px_rgba(255,100,0,0.5)]" />
                  </div>
               </div>
            </div>

            {heroTools.map((tool) => (
              <DraggableNode key={tool.id} tool={tool} containerRef={containerRef} />
            ))}
          </div>
      </section>

      {/* --- SECTION 2: TIMELINE / STEPS --- */}
      <TimelineSection />

      {/* --- SECTION 3: INTEGRATION STACK --- */}
      <IntegrationStack />

      <div className="w-full bg-gradient-to-t from-black to-transparent" />
    </main>
  );
}