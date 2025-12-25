'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, FileText, CheckSquare, Database, Mail, 
    FileSpreadsheet, Activity, Briefcase, LayoutTemplate 
} from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function NeuralFeatures() {
  return (
    <section className="relative min-h-screen bg-[#020202] py-24 md:py-32 flex flex-col items-center justify-center overflow-hidden border-t border-white/5">
      
      {/* --- Atmospheric Background --- */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-[0.03]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-[radial-gradient(circle,rgba(249,115,22,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* --- Header --- */}
      <div className="relative z-10 text-center mb-16 md:mb-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tighter leading-[1.05]">
          The Central <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
            Processing Unit.
          </span>
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
            Gaprio sits at the center of your workflows, converting scattered inputs into structured and actionable outcomes.
        </p>
      </div>

      {/* --- The Circuit Board --- */}
      <div className="relative w-full max-w-[1100px] px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
        
        {/* Left Column: INPUTS */}
        <div className="flex flex-col gap-4 relative z-10 order-2 lg:order-1">
            <NodeCard icon={MessageSquare} title="Slack" sub="Unstructured Chat" color="text-purple-400" align="right" delay={0} />
            <NodeCard icon={Mail} title="Gmail" sub="Inbound Requests" color="text-red-400" align="right" delay={0.1} />
            <NodeCard icon={FileText} title="Docs" sub="Knowledge Context" color="text-blue-400" align="right" delay={0.2} />
            <NodeCard icon={Briefcase} title="Zoho" sub="CRM Data Points" color="text-yellow-400" align="right" delay={0.3} />
        </div>

        {/* Center Column: THE CORE (Optimized) */}
        <div className="relative h-[300px] lg:h-[450px] bg-[#050505] border border-white/10 rounded-[2rem] flex flex-col items-center justify-center z-20 overflow-hidden order-1 lg:order-2 mb-10 lg:mb-0 group ring-1 ring-white/5">
            
            {/* Core Background Animation */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_60%)]" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:20px_20px] opacity-[0.03]" />
            
            {/* THE REACTOR CORE (Scaled Down & Refined) */}
            <div className="relative z-10 w-28 h-28 lg:w-40 lg:h-40 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-full flex flex-col items-center justify-center ring-1 ring-white/10">
                
                {/* 1. Outer Glow Ring */}
                <div className="absolute -inset-4 rounded-full border border-orange-500/10 blur-sm animate-pulse" />

                {/* 2. Main Spinning Rings (Thinner & cleaner) */}
                <div className="absolute inset-0 rounded-full border-[1px] border-orange-500/30 border-t-orange-500/90 animate-[spin_8s_linear_infinite]" />
                <div className="absolute inset-3 rounded-full border-[1px] border-white/5 border-b-white/40 animate-[spin_12s_linear_infinite_reverse]" />
                <div className="absolute inset-6 rounded-full border-[1px] border-amber-500/20 border-l-amber-500/70 animate-[spin_5s_linear_infinite]" />
                
                {/* 3. Center LOGO (Smaller) */}
                <div className="relative z-10 w-14 h-14 lg:w-20 lg:h-20">
                    <Image 
                        src="/logo1.png" 
                        alt="Gaprio Core" 
                        fill
                        className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                        priority
                    />
                </div>
            </div>

            {/* LIVE STATUS (Compact & Glassmorphic) */}
            <div className="mt-6 lg:mt-8 text-center w-full max-w-[200px] lg:max-w-[220px]">
                <div className="bg-black/40 border border-white/10 rounded-lg p-2 backdrop-blur-md shadow-lg ring-1 ring-white/5">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-1.5">
                         <div className="flex items-center gap-1.5">
                             <div className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                             </div>
                             <span className="text-[9px] font-mono text-zinc-400 tracking-wider font-medium">SYSTEM LIVE</span>
                         </div>
                         <span className="text-[9px] font-mono text-orange-400/80">12ms</span>
                    </div>
                    <LiveProcessingText />
                </div>
            </div>

            {/* Data Beams (Desktop Visuals) */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none">
                {/* Adjust beam positions to match new node height if needed */}
                <Beam x="left-0" y="top-[18%]" delay={0} />
                <Beam x="left-0" y="top-[38%]" delay={2} />
                <Beam x="left-0" y="top-[58%]" delay={4} />
                <Beam x="left-0" y="top-[78%]" delay={1.5} />

                <Beam x="right-0" y="top-[18%]" delay={1} direction="left" />
                <Beam x="right-0" y="top-[38%]" delay={3} direction="left" />
                <Beam x="right-0" y="top-[58%]" delay={5} direction="left" />
                <Beam x="right-0" y="top-[78%]" delay={2.5} direction="left" />
            </div>
        </div>

        {/* Right Column: OUTPUTS */}
        <div className="flex flex-col gap-4 relative z-10 order-3">
            <NodeCard icon={CheckSquare} title="Asana" sub="Create Tasks" color="text-pink-400" align="left" delay={0.4} />
            <NodeCard icon={Database} title="Jira" sub="Eng Tickets" color="text-blue-500" align="left" delay={0.5} />
            <NodeCard icon={FileSpreadsheet} title="Excel" sub="Update Reports" color="text-green-400" align="left" delay={0.6} />
            <NodeCard icon={LayoutTemplate} title="Miro" sub="Visual Maps" color="text-yellow-300" align="left" delay={0.7} />
        </div>

      </div>
    </section>
  );
}

// --- SUB COMPONENTS (LiveText, NodeCard, Beam) stay the same ---
function LiveProcessingText() {
    const actions = [
        "Parsing intent...",
        "Syncing CRM...",
        "Vectorizing...",
        "Drafting task...",
        "Updating node...",
        "Optimizing..."
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % actions.length);
        }, 2200); 
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-6 overflow-hidden relative flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-[9px] font-mono text-zinc-400 w-full text-left truncate"
                >
                    <span className="text-orange-500 mr-1.5">{'>'}</span>
                    {actions[index]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function NodeCard({ icon: Icon, title, sub, color, align, delay }) {
    return (
        <motion.div 
            initial={{ opacity: 0, x: align === 'right' ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true, margin: "-50px" }}
            className={`
                relative p-3.5 md:p-4 rounded-xl bg-[#0a0a0a] border border-white/10 
                hover:border-orange-500/30 transition-all duration-300 
                flex items-center gap-3 md:gap-4 group w-full overflow-hidden
                ${align === 'right' ? 'lg:ml-auto lg:text-right flex-row-reverse' : 'lg:mr-auto'}
            `}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />

            <div className={`p-2.5 md:p-3 rounded-lg bg-white/5 ${color} group-hover:scale-110 transition-transform duration-300 shadow-inner relative z-10 shrink-0`}>
                <Icon size={18} className="md:w-5 md:h-5" />
            </div>
            <div className="flex-1 relative z-10 min-w-0">
                <h4 className="text-white font-bold text-sm truncate">{title}</h4>
                <p className="text-zinc-500 text-[10px] font-mono tracking-wide uppercase mt-0.5 group-hover:text-zinc-400 transition-colors truncate">{sub}</p>
            </div>
            
            <div className={`hidden lg:block w-8 xl:w-10 h-[1px] bg-white/10 absolute top-1/2 ${align === 'right' ? 'right-[-32px] xl:right-[-40px]' : 'left-[-32px] xl:left-[-40px]'} group-hover:bg-orange-500/50 transition-colors`} />
            <div className={`hidden lg:block w-1 h-1 rounded-full bg-[#0a0a0a] border border-white/20 absolute top-1/2 -translate-y-1/2 ${align === 'right' ? 'right-[-4px]' : 'left-[-4px]'} group-hover:border-orange-500 transition-colors`} />
        </motion.div>
    )
}

function Beam({ x, y, delay, direction = 'right' }) {
    return (
        <div className={`absolute ${y} ${x} w-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent overflow-hidden`}>
            <motion.div 
                initial={{ x: direction === 'right' ? '-100%' : '100%' }}
                animate={{ x: direction === 'right' ? '100%' : '-100%' }}
                transition={{ duration: 2.5, repeat: Infinity, delay: delay, ease: "linear" }}
                className="w-full h-full bg-gradient-to-r from-transparent via-orange-500/80 to-transparent shadow-[0_0_15px_#f97316]"
            />
        </div>
    )
}