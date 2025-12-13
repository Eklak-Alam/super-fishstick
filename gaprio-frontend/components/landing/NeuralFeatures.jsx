'use client';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, CheckSquare, Database, Mail, FileSpreadsheet, Activity } from 'lucide-react';
import Image from 'next/image';

export default function NeuralFeatures() {
  return (
    <section className="relative min-h-screen bg-[#020202] py-20 md:py-32 flex flex-col items-center justify-center overflow-hidden border-t border-white/5">
      
      {/* --- Atmospheric Background --- */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-[0.03]" />
      
      {/* Deep Orange Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(249,115,22,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* --- Header --- */}
      <div className="relative z-10 text-center mb-24 px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-[11px] font-bold text-orange-200 uppercase tracking-widest mb-8">
            <Activity size={12} className="text-orange-400" /> System Architecture v2.0
        </div>
        <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tighter leading-[1.1]">
          The Central <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Processing Unit.</span>
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          Data flows in. Intelligence flows out. Gaprio sits in the middle, translating noise into structured action.
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
        <div className="relative h-[450px] lg:h-[600px] bg-[#050505] border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center shadow-[0_0_100px_-20px_rgba(249,115,22,0.15)] z-20 overflow-hidden order-1 lg:order-2 mb-12 lg:mb-0">
            
            {/* Core Background Animation */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)]" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:20px_20px] opacity-[0.02]" />
            
            {/* The Reactor Core (Central Hub) */}
            <div className="relative z-10 w-40 h-40 lg:w-48 lg:h-48 bg-[#0a0a0a] border border-white/10 rounded-full flex flex-col items-center justify-center shadow-[0_0_80px_rgba(234,88,12,0.25)] ring-1 ring-white/10">
                
                {/* Spinning Rings - Orange/Amber */}
                <div className="absolute inset-0 rounded-full border border-orange-500/30 border-t-orange-500/60 animate-[spin_8s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-white/5 border-b-white/20 animate-[spin_12s_linear_infinite_reverse]" />
                
                {/* Center LOGO Image */}
                <div className="relative z-10 w-20 h-20 lg:w-24 lg:h-24">
                    <Image 
                        src="/logo.png" 
                        alt="Gaprio Core" 
                        fill
                        className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                        priority
                    />
                </div>
            </div>

            {/* Status Indicator */}
            <div className="mt-12 text-center">
                <h3 className="text-xl font-bold text-white tracking-tight">Gaprio Neural Core</h3>
                <div className="flex items-center justify-center gap-2 mt-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 w-fit mx-auto">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-mono text-green-400 tracking-widest uppercase">System Online</span>
                </div>
            </div>

            {/* Data Beams (Desktop Visuals) */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none">
                <Beam x="left-[-10%]" y="top-[30%]" delay={0} />
                <Beam x="left-[-10%]" y="top-[50%]" delay={2} />
                <Beam x="left-[-10%]" y="top-[70%]" delay={4} />
                
                <Beam x="right-[-10%]" y="top-[30%]" delay={1} direction="left" />
                <Beam x="right-[-10%]" y="top-[50%]" delay={3} direction="left" />
                <Beam x="right-[-10%]" y="top-[70%]" delay={5} direction="left" />
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

// --- Sub-Components ---

function NodeCard({ icon: Icon, title, sub, color, align, delay }) {
    return (
        <motion.div 
            initial={{ opacity: 0, x: align === 'right' ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-orange-500/30 transition-all duration-300 flex items-center gap-5 group w-full ${align === 'right' ? 'lg:ml-auto lg:text-right flex-row-reverse' : 'lg:mr-auto'}`}
        >
            <div className={`p-3.5 rounded-xl bg-white/5 ${color} group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                <Icon size={22} />
            </div>
            <div className="flex-1">
                <h4 className="text-white font-bold text-base">{title}</h4>
                <p className="text-zinc-500 text-xs font-mono tracking-wide uppercase mt-1">{sub}</p>
            </div>
            {/* Connector Line (Decorative) */}
            <div className={`hidden lg:block w-8 h-[1px] bg-white/10 group-hover:bg-orange-500/50 transition-colors ${align === 'right' ? 'mr-[-24px]' : 'ml-[-24px]'}`} />
        </motion.div>
    )
}

function Beam({ x, y, delay, direction = 'right' }) {
    return (
        <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 0], x: direction === 'right' ? [0, 100] : [0, -100] }}
            transition={{ duration: 3, repeat: Infinity, delay: delay, ease: "easeInOut" }}
            className={`absolute ${y} ${x} h-[1px] w-24 bg-gradient-to-r from-transparent via-orange-500 to-transparent z-0 origin-left`}
        />
    )
}