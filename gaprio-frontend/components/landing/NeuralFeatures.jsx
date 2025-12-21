'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, FileText, CheckSquare, Database, Mail, FileSpreadsheet, Activity } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function NeuralFeatures() {
  return (
    <section className="relative min-h-screen bg-[#020202] py-24 md:py-40 flex flex-col items-center justify-center overflow-hidden border-t border-white/5">
      
      {/* --- Atmospheric Background --- */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-[0.03]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[800px] h-[50vh] md:h-[800px] bg-[radial-gradient(circle,rgba(249,115,22,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* --- Header --- */}
      <div className="relative z-10 text-center mb-16 md:mb-24 px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tighter leading-[1.05]">
          The Central <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Processing Unit.</span>
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
            Gaprio sits at the center of your workflows, converting scattered inputs into structured and actionable outcomes.
        </p>
      </div>

      {/* --- The Circuit Board --- */}
      <div className="relative w-full max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        
        {/* Left Column: INPUTS */}
        <div className="flex flex-col gap-6 relative z-10 order-2 lg:order-1">
            <NodeCard icon={MessageSquare} title="Slack" sub="Unstructured Chat" color="text-purple-400" align="right" delay={0} />
            <NodeCard icon={Mail} title="Gmail" sub="Inbound Requests" color="text-red-400" align="right" delay={0.1} />
            <NodeCard icon={FileText} title="Docs" sub="Knowledge Context" color="text-blue-400" align="right" delay={0.2} />
        </div>

        {/* Center Column: THE CORE */}
        <div className="relative h-[400px] lg:h-[600px] bg-[#050505] border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center shadow-[0_0_100px_-20px_rgba(249,115,22,0.15)] z-20 overflow-hidden order-1 lg:order-2 mb-12 lg:mb-0 group">
            
            {/* Core Background Animation */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)]" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:20px_20px] opacity-[0.04]" />
            
            {/* The Reactor Core (Central Hub) */}
            <div className="relative z-10 w-40 h-40 lg:w-56 lg:h-56 bg-[#0a0a0a] border border-white/10 rounded-full flex flex-col items-center justify-center shadow-[0_0_80px_rgba(234,88,12,0.25)] ring-1 ring-white/10">
                {/* Spinning Rings */}
                <div className="absolute inset-0 rounded-full border border-orange-500/30 border-t-orange-500/80 animate-[spin_8s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-white/5 border-b-white/30 animate-[spin_12s_linear_infinite_reverse]" />
                <div className="absolute inset-8 rounded-full border border-amber-500/20 border-l-amber-500/60 animate-[spin_5s_linear_infinite]" />
                
                {/* Center LOGO Image */}
                <div className="relative z-10 w-20 h-20 lg:w-28 lg:h-28">
                    <Image 
                        src="/logo.png" 
                        alt="Gaprio Core" 
                        fill
                        className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                        priority
                    />
                </div>
            </div>

            {/* --- UPDATED SECTION: Live Status Indicator --- */}
            <div className="mt-10 lg:mt-12 text-center w-full max-w-[280px]">
                <h3 className="text-xl font-bold text-white tracking-tight mb-3">Gaprio Neural Core</h3>
                
                {/* Live Activity Box */}
                <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-3 backdrop-blur-md shadow-inner">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                         <div className="flex items-center gap-2">
                             <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                             </div>
                             <span className="text-[10px] font-mono text-zinc-400 tracking-wider">LIVE FEED</span>
                         </div>
                         <span className="text-[10px] font-mono text-orange-400 font-bold">12ms</span>
                    </div>
                    
                    {/* The Typing Text Component */}
                    <LiveProcessingText />
                </div>
            </div>

            {/* Data Beams (Desktop Visuals) */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none">
                <Beam x="left-0" y="top-[25%]" delay={0} />
                <Beam x="left-0" y="top-[50%]" delay={2} />
                <Beam x="left-0" y="top-[75%]" delay={4} />
                <Beam x="right-0" y="top-[25%]" delay={1} direction="left" />
                <Beam x="right-0" y="top-[50%]" delay={3} direction="left" />
                <Beam x="right-0" y="top-[75%]" delay={5} direction="left" />
            </div>
        </div>

        {/* Right Column: OUTPUTS */}
        <div className="flex flex-col gap-6 relative z-10 order-3">
            <NodeCard icon={CheckSquare} title="Asana" sub="Create Tasks" color="text-red-400" align="left" delay={0.3} />
            <NodeCard icon={Database} title="Jira" sub="Engineering Tickets" color="text-blue-500" align="left" delay={0.4} />
            <NodeCard icon={FileSpreadsheet} title="Excel" sub="Update Reports" color="text-green-400" align="left" delay={0.5} />
        </div>

      </div>
    </section>
  );
}

// --- NEW COMPONENT: Live Text Switcher ---
function LiveProcessingText() {
    const actions = [
        "Parsing intent from Slack...",
        "Structuring unstructured data...",
        "Querying vector database...",
        "Drafting Asana task payload...",
        "Syncing context to Jira...",
        "Optimizing workflow route..."
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % actions.length);
        }, 2200); // Changes every 2.2 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-6 overflow-hidden relative flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs font-mono text-zinc-300 w-full text-left truncate"
                >
                    <span className="text-orange-500 mr-2">{'>'}</span>
                    {actions[index]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// --- Existing Sub-Components (Unchanged) ---

function NodeCard({ icon: Icon, title, sub, color, align, delay }) {
    return (
        <motion.div 
            initial={{ opacity: 0, x: align === 'right' ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`
                relative p-5 rounded-2xl bg-[#0a0a0a] border border-white/10 
                hover:border-orange-500/30 transition-all duration-300 
                flex items-center gap-5 group w-full overflow-hidden
                ${align === 'right' ? 'lg:ml-auto lg:text-right flex-row-reverse' : 'lg:mr-auto'}
            `}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />

            <div className={`p-3.5 rounded-xl bg-white/5 ${color} group-hover:scale-110 transition-transform duration-300 shadow-inner relative z-10`}>
                <Icon size={22} />
            </div>
            <div className="flex-1 relative z-10">
                <h4 className="text-white font-bold text-base">{title}</h4>
                <p className="text-zinc-500 text-xs font-mono tracking-wide uppercase mt-1 group-hover:text-zinc-400 transition-colors">{sub}</p>
            </div>
            
            <div className={`hidden lg:block w-12 h-[1px] bg-white/10 absolute top-1/2 ${align === 'right' ? 'right-[-48px]' : 'left-[-48px]'} group-hover:bg-orange-500/50 transition-colors`} />
            <div className={`hidden lg:block w-1.5 h-1.5 rounded-full bg-[#0a0a0a] border border-white/20 absolute top-1/2 -translate-y-1/2 ${align === 'right' ? 'right-[-6px]' : 'left-[-6px]'} group-hover:border-orange-500 transition-colors`} />
        </motion.div>
    )
}

function Beam({ x, y, delay, direction = 'right' }) {
    return (
        <div className={`absolute ${y} ${x} w-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent overflow-hidden`}>
            <motion.div 
                initial={{ x: direction === 'right' ? '-100%' : '100%' }}
                animate={{ x: direction === 'right' ? '100%' : '-100%' }}
                transition={{ duration: 2, repeat: Infinity, delay: delay, ease: "linear" }}
                className="w-full h-full bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_10px_#f97316]"
            />
        </div>
    )
}