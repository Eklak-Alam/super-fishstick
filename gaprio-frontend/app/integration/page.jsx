'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Image from 'next/image';
import { 
  ArrowUpRight, ShieldCheck, Globe, Cpu, LayoutGrid, Check, 
  ArrowRight, Zap, Network, Workflow, UserCheck, Sparkles 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- DATA ---
const heroTools = [
  { id: 'asana', label: 'Asana', image: '/companylogo/asana.png', x: 5, y: -260, mobileX: 1, mobileY: -160, color: '#ea580c', bg: 'bg-[#151515]' },
  { id: 'jira', label: 'Jira', image: '/companylogo/jira.png', x: 240, y: -180, mobileX: 120, mobileY: -110, color: '#d97706', bg: 'bg-[#151515]' },
  { id: 'ms365', label: 'MS 365', image: '/companylogo/microsoft.webp', x: 360, y: -1, mobileX: 160, mobileY: 1, color: '#2563eb', bg: 'bg-[#151515]' },
  { id: 'clickup', label: 'ClickUp', image: '/companylogo/clickup.png', x: 240, y: 180, mobileX: 120, mobileY: 110, color: '#7c3aed', bg: 'bg-[#151515]' },
  { id: 'zoho', label: 'Zoho', image: '/companylogo/zoho.png', x: -5, y: 260, mobileX: 1, mobileY: 160, color: '#ef4444', bg: 'bg-[#151515]' },
  { id: 'google', label: 'Google', image: '/companylogo/google.webp', x: -240, y: 180, mobileX: -120, mobileY: 110, color: '#dc2626', bg: 'bg-[#151515]' },
  { id: 'slack', label: 'Slack', image: '/companylogo/slack.png', x: -360, y: 1, mobileX: -160, mobileY: 0, color: '#f97316', bg: 'bg-[#151515]' },
  { id: 'miro', label: 'Miro', image: '/companylogo/miro.png', x: -240, y: -180, mobileX: -120, mobileY: -110, color: '#fbbf24', bg: 'bg-[#151515]' },
];

const integrationDetails = [
  { id: 'google', name: 'Google Workspace', icon: '/companylogo/google.webp', tagline: 'Everyday collaboration', problem: "Documents, files, and calendars are spread across teams with limited visibility.", solution: "Gaprio understands documents, meetings, and inbox activity together to support faster decisions and follow-ups.", features: ['Calendar Sync', 'Drive Access', 'SSO Login'] },
  { id: 'slack', name: 'Slack', icon: '/companylogo/slack.png', tagline: 'Team communication', problem: "Important decisions get buried in channels. Context switching breaks focus.", solution: "Gaprio understands conversations and highlights decisions, summaries, and next steps directly from chats.", features: ['Smart Notifications', 'Slash Commands', 'Thread Sync'] },
  { id: 'jira', name: 'Jira Software', icon: '/companylogo/jira.png', tagline: 'Engineering execution', problem: "Updates and dependencies require constant manual coordination.", solution: "Gaprio keeps Jira aligned with real discussions, improving visibility for both technical and non-technical teams.", features: ['Issue Tracking', 'Sprint Planning', 'DevOps View'] },
  { id: 'asana', name: 'Asana', icon: '/companylogo/asana.png', tagline: 'Project Coordination', problem: "Tasks move between teams without shared background or clarity.", solution: "Gaprio connects tasks with conversations and documents so teams understand priorities and intent.", features: ['Portfolio View', 'Task Dependencies', 'Auto-Assign'] },
  { id: 'ms365', name: 'Microsoft 365', icon: '/companylogo/microsoft.webp', tagline: 'Enterprise productivity', problem: "Critical data lives in spreadsheets and inboxes with little connection to execution tools.", solution: "Gaprio brings context to Outlook, Excel, and Teams, enabling faster drafting, reporting, and coordination.", features: ['Excel Live Sync', 'Outlook Integ', 'Teams Connect'] },
  { id: 'clickup', name: 'ClickUp', icon: '/companylogo/clickup.png', tagline: 'Structured workflows', problem: "ClickUp often operates in isolation from engineering, sales, and external systems.", solution: "Gaprio bridges ClickUp with specialized tools to maintain continuity across workflows.", features: ['Doc Sync', 'Goal Tracking', 'Whiteboards'] },
  { id: 'miro', name: 'Miro', icon: '/companylogo/miro.png', tagline: 'Visual collaboration', problem: "Ideas stay on whiteboards and rarely turn into action.", solution: "Gaprio converts visual inputs into structured tasks, notes, follow-ups, and tickets automatically.", features: ['Board Embedding', 'Note-to-Task', 'Live Canvas'] },
  { id: 'zoho', name: 'Zoho WorkPlace', icon: '/companylogo/zoho.png', tagline: 'operations suite', problem: "Customer, finance, and product data remain disconnected across teams.", solution: "Gaprio connects operational data with execution workflows for better organizational alignment.", features: ['CRM Sync', 'Desk Tickets', 'Finance Data'] },
];

const steps = [
    { id: 1, title: "Workspace Initialization", description: "Create a Gaprio workspace for your organization. Users, teams, and permissions align with your existing identity system.", icon: ShieldCheck, tags: ["SSO Supported", "2FA"] },
    { id: 2, title: "Core Workspace Connection", description: "Connect your primary workspace such as Google Workspace or Microsoft 365. Identity, files, and calendars sync to establish shared context.", icon: Globe, tags: ["OAuth 2.0", "Read-Only"] },
    { id: 3, title: "Operational Tool Integration", description: "Communication and project tools connect next. Gaprio observes activity across conversations, tasks, and updates to understand how work actually happens.", icon: Cpu, tags: ["Webhooks", "Filtering"] },
    { id: 4, title: "Unified Command View", description: "All connected tools come together in one dashboard. Gaprio highlights what matters, suggests next steps, and lets you act across systems from one place.", icon: LayoutGrid, tags: ["Analytics", "Zero Latency"] }
];

const pillars = [
  {
    id: 1,
    title: "Context First",
    description: "Gaprio understands why something happened, not just that it happened. It reads between the lines of your data.",
    icon: Network
  },
  {
    id: 2,
    title: "Cross Tool Reasoning",
    description: "Signals from one system inform actions in another. A Slack message can trigger a Jira update intelligently.",
    icon: Workflow
  },
  {
    id: 3,
    title: "Human Controlled",
    description: "Gaprio suggests and prepares actions, but humans stay in control of the final execution button.",
    icon: UserCheck
  }
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
    const unsubX = x.on("change", (v) => setPos((p) => ({ ...p, x: v })));
    const unsubY = y.on("change", (v) => setPos((p) => ({ ...p, y: v })));
    return () => {
      unsubX();
      unsubY();
    };
  }, [x, y]);

  const midX = pos.x / 2;
  const midY = pos.y / 2 + (isMobile ? 30 : 60);
  const gradientId = `gradient-${tool.id}`;

  const scrollToStack = () => {
    const element = document.getElementById(`integration-${tool.id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <>
      <svg
        className="absolute top-1/2 left-1/2 overflow-visible pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.05" />
            <stop offset="100%" stopColor={tool.color} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <motion.path
          d={`M 0 0 Q ${midX} ${midY} ${pos.x} ${pos.y}`}
          stroke={`url(#${gradientId})`}
          strokeWidth={isMobile ? "2" : "4"}
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
        whileHover={{ scale: 1.1, cursor: "grab" }}
        whileDrag={{ scale: 1.15, cursor: "grabbing", zIndex: 100 }}
        className={`group absolute w-[68px] h-[68px] md:w-24 md:h-24 ${tool.bg} rounded-2xl md:rounded-3xl flex flex-col items-center justify-center shadow-2xl z-20 border border-white/10 backdrop-blur-md touch-none select-none overflow-visible`}
      >
        <div
          onClick={scrollToStack}
          className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="relative w-7 h-7 md:w-10 md:h-10 mb-1 md:mb-2 pointer-events-none select-none">
            <Image
              src={tool.image}
              alt={tool.label}
              fill
              draggable={false}
              className="object-contain"
            />
          </div>
          <span className="text-[9px] md:text-[11px] text-zinc-400 font-bold uppercase tracking-wider pointer-events-none select-none transition-colors group-hover:text-white">
            {tool.label}
          </span>
        </div>

        <div className="hidden md:flex absolute -bottom-3 left-0 right-0 justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollToStack();
            }}
            className="flex items-center gap-1.5 bg-[#050505] border border-zinc-700 hover:border-orange-500/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-black/50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>View Docs</span>
            <ArrowUpRight className="w-2.5 h-2.5 text-orange-400" />
          </button>
        </div>

        <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
        <div
          className={`absolute inset-0 rounded-2xl md:rounded-3xl border border-transparent group-hover:border-[${tool.color}]/50 transition-colors duration-300 pointer-events-none`}
          style={{ borderColor: tool.color + "40" }}
        />
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
                isLeft ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"
            )}
        >
            {/* Connector Line to Center Spine */}
            <div className={cn(
                "hidden md:block absolute top-10 h-[2px] bg-gradient-to-r from-orange-500/50 to-transparent w-16",
                isLeft ? "right-0 rotate-180 origin-left" : "left-0"
            )} />

            <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#0a0a0a] p-8 hover:border-orange-500/30 transition-colors duration-500 backdrop-blur-sm min-h-[220px] flex flex-col justify-center">
                <span className={cn(
                    "absolute top-0 text-[100px] font-bold text-zinc-900/40 font-mono transition-colors group-hover:text-orange-900/10 pointer-events-none select-none leading-none",
                    isLeft ? "left-1" : "right-2" 
                )}>
                    0{step.id}
                </span>

                <div className={cn(
                    "relative z-10 flex flex-col gap-5",
                    isLeft ? "md:items-end md:text-right" : "md:items-start md:text-left"
                )}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-black border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_4px_20px_-10px_rgba(255,255,255,0.1)]">
                        <step.icon className="w-6 h-6 text-orange-500" />
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-50 transition-colors">
                            {step.title}
                        </h3>
                        <p className="text-zinc-400 leading-relaxed text-sm md:text-base max-w-md">
                            {step.description}
                        </p>
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
    
    const scaleY = useTransform(scrollYProgress, [0, 0.95], [0, 1]);

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
                         <h3 className="text-4xl md:text-5xl font-bold text-zinc-600 tracking-tight">How Gaprio<span className="text-white"> Integrates With Your Stack</span></h3>
                    </motion.div>
                </div>

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
                         A closer look at how Gaprio enhances the tools your teams already rely on.
                      </p>
                </div>

                <div className="relative flex flex-col items-center">
                    {integrationDetails.map((tool, index) => {
                        const topOffset = 100 + (index * 20); 
                        
                        return (
                            <motion.div
                                key={tool.id}
                                id={`integration-${tool.id}`} 
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="sticky w-full max-w-5xl bg-[#080808] border border-white/5 rounded-[2rem] p-8 md:p-14 mb-24 md:mb-12 shadow-[0_0_80px_-30px_rgba(0,0,0,1)] overflow-hidden"
                                style={{ top: `${topOffset}px` }}
                            >
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />

                                <div className="relative z-10 grid md:grid-cols-[1fr_2fr] gap-12 items-start">
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
                </div>
            </div>
        </section>
    );
};

// --- SECTION 4: DIFFERENTIATION (NEW) ---
const DifferentiationSection = () => {
  return (
    <section className="relative w-full py-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADING */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-bold text-orange-500 tracking-[0.3em] uppercase mb-4">Differentiation</h2>
            <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Integrations That <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Coordinate, Not Just Connect</span>
            </h3>
          </motion.div>
        </div>

        {/* PILLARS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 hover:border-orange-500/30 transition-all duration-500 overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-600/10 rounded-full blur-[50px] group-hover:bg-orange-600/20 transition-all duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-8 border border-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                  <pillar.icon className="w-7 h-7 text-orange-500" />
                </div>
                
                <h4 className="text-2xl font-bold text-white mb-4">{pillar.title}</h4>
                <p className="text-zinc-400 leading-relaxed font-light">{pillar.description}</p>
                
                {/* Decorative Line */}
                <div className="w-full h-[1px] bg-gradient-to-r from-orange-500/20 to-transparent mt-8 group-hover:from-orange-500/50 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- SECTION 5: TRANSITION CTA (NEW) ---
const TransitionCTA = () => {
  return (
    <section className="relative w-full pb-20 overflow-hidden flex items-center justify-center">
      {/* Background Ambience */}
      <div className="absolute inset-0">
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-orange-400 text-sm font-bold uppercase tracking-widest mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Next Generation</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8">
            Integration Is Only <br/>
            <span className="text-zinc-600">The Beginning.</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-zinc-400 font-light mb-12 max-w-2xl mx-auto">
            See how Gaprio’s intelligence turns connected tools into coordinated work.
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group cursor-pointer relative px-10 py-5 bg-white text-black rounded-full font-bold text-lg overflow-hidden shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all"
          >
            {/* The Orange Background Layer (Slides up from bottom) */}
            <span className="absolute inset-0 w-full h-full bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

            {/* The Content Layer (Stays on top, turns white on hover) */}
            <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
              Explore Features
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

// --- MAIN PAGE ---
export default function UnifiedPage() {
  const containerRef = useRef(null);

  // --- 1. ADDED isMobile LOGIC ---
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); 
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    // --- 2. REMOVED 'pt-20' FROM MAIN to fix the black space gap ---
    <main className="relative w-full min-h-screen bg-[#020202] text-white overflow-x-hidden selection:bg-orange-500/30">
      
      {/* GLOBAL BACKGROUND ELEMENTS (YOUR EXACT CODE) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Deep Orange Radial */}
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[100vw] h-[80vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2a1005] via-[#050505] to-transparent opacity-100" />
          {/* Grain */}
      </div>

      {/* --- SECTION 1: HERO --- */}
      <section className="relative w-full min-h-[100vh] flex flex-col items-center pt-36 md:pt-32 md:pb-10 z-10 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-orange-600/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none mix-blend-screen" />

        {/* HERO HEADING */}
        <div className="relative z-10 text-center max-w-5xl px-4 md:px-6 mb-4 md:mb-8 pointer-events-none select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1] mb-6 md:mb-8 text-white drop-shadow-2xl">
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
            className="text-zinc-400 text-sm md:text-lg max-w-sm md:max-w-2xl mx-auto leading-relaxed font-light px-2"
          >
            Gaprio connects your existing tools into a single{" "}
            <span className="text-orange-500 font-medium">
              Intelligent Layer
            </span>{" "}
            and turns them into a unified, coordinated system of work.
          </motion.p>
        </div>

        {/* INTERACTIVE MAP CONTAINER */}
        <div
          ref={containerRef}
          className="relative w-full max-w-[1200px] h-[450px] md:h-[600px] flex items-center justify-center z-20 cursor-crosshair touch-none select-none mt-4 md:mt-0"
        >
          {/* CENTRAL HUB */}
          <div className="relative z-30 flex items-center justify-center pointer-events-none">
            <div className="absolute w-28 h-28 md:w-40 md:h-40 bg-orange-500/20 blur-[40px] md:blur-[60px] rounded-full animate-pulse" />
            
            <div className="relative w-20 h-20 md:w-36 md:h-36 bg-[#0a0a0a] rounded-full border border-zinc-800 shadow-[0_0_50px_-10px_rgba(234,88,12,0.4)] flex items-center justify-center ring-1 ring-white/10">
              <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-[ping_3s_linear_infinite]" />
              <div className="absolute inset-4 md:inset-8 rounded-full border border-orange-500/20 animate-[ping_3s_linear_infinite_1s]" />
              
              <div className="relative w-8 h-8 md:w-16 md:h-16">
                <Image
                  src="/logo1.png"
                  alt="Gaprio"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* RENDER NODES */}
          {heroTools.map((tool) => (
            <DraggableNode
              key={tool.id}
              tool={tool}
              containerRef={containerRef}
              isMobile={isMobile} // Now correctly defined
            />
          ))}
        </div>
      </section>

      {/* --- Other Sections --- */}
      <TimelineSection />
      <DifferentiationSection />
      <IntegrationStack />
      <TransitionCTA />

      <div className="w-full bg-gradient-to-t from-black to-transparent" />
    </main>
  );
}