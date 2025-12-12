'use client';
import { motion } from 'framer-motion';
import { Zap, MessageSquare, FileText, CheckSquare, Database, Mail, FileSpreadsheet, ArrowRight } from 'lucide-react';

export default function NeuralFeatures() {
  return (
    <section className="relative min-h-screen bg-[#020202] py-10 md:pt-16 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Tech Mesh */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-[0.05]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center mb-16 md:mb-24 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-[10px] md:text-xs font-bold text-purple-300 uppercase tracking-widest mb-6">
            <Zap size={12} /> System Architecture
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
          The Central <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Processing Unit.</span>
        </h2>
        <p className="text-gray-400 max-w-lg md:max-w-2xl mx-auto text-base md:text-lg">
          Data flows in. Intelligence flows out. Gaprio sits in the middle, translating noise into structured action.
        </p>
      </div>

      {/* The Circuit Board Grid */}
      <div className="relative w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
        
        {/* Left Column: INPUTS */}
        <div className="flex flex-col gap-4 relative z-10 order-2 md:order-1">
            <NodeCard icon={MessageSquare} title="Slack" sub="Unstructured Chat" color="text-purple-400" align="right" delay={0} />
            <NodeCard icon={Mail} title="Gmail" sub="Inbound Requests" color="text-red-400" align="right" delay={0.1} />
            <NodeCard icon={FileText} title="Docs" sub="Knowledge Context" color="text-blue-400" align="right" delay={0.2} />
        </div>

        {/* Center Column: THE BRAIN */}
        <div className="relative h-[400px] md:h-[500px] bg-[#050505] border border-white/10 rounded-[2rem] flex flex-col items-center justify-center shadow-2xl z-20 overflow-hidden order-1 md:order-2 mb-8 md:mb-0">
            {/* Internal Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-blue-500/5 opacity-50" />
            
            {/* The Core */}
            <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 bg-black border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.3)]">
                <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-2 border border-white/10 rounded-full animate-ping opacity-20" />
                <Zap className="w-10 h-10 md:w-12 md:h-12 text-white fill-white" />
            </div>

            {/* Status Text */}
            <div className="mt-8 text-center">
                <h3 className="text-lg md:text-xl font-bold text-white">Gaprio Core</h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-mono text-green-400 tracking-widest">PROCESSING LIVE DATA</span>
                </div>
            </div>

            {/* Visual Beams (Desktop Only) */}
            <div className="hidden md:block">
                <Beam x="left-0" y="top-[25%]" delay={0} />
                <Beam x="left-0" y="top-[50%]" delay={1} />
                <Beam x="left-0" y="top-[75%]" delay={2} />
                <Beam x="right-0" y="top-[25%]" delay={0.5} direction="left" />
                <Beam x="right-0" y="top-[50%]" delay={1.5} direction="left" />
                <Beam x="right-0" y="top-[75%]" delay={2.5} direction="left" />
            </div>
        </div>

        {/* Right Column: OUTPUTS */}
        <div className="flex flex-col gap-4 relative z-10 order-3">
            <NodeCard icon={CheckSquare} title="Asana" sub="Create Tasks" color="text-red-400" align="left" delay={0.3} />
            <NodeCard icon={Database} title="Jira" sub="Engineering Tickets" color="text-blue-500" align="left" delay={0.4} />
            <NodeCard icon={FileSpreadsheet} title="Excel" sub="Update Reports" color="text-green-400" align="left" delay={0.5} />
        </div>

      </div>
    </section>
  );
}

// --- Components ---

function NodeCard({ icon: Icon, title, sub, color, align, delay }) {
    return (
        <motion.div 
            initial={{ opacity: 0, x: align === 'right' ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ scale: 1.02 }}
            className={`p-4 md:p-5 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-colors flex items-center gap-4 group w-full ${align === 'right' ? 'md:ml-auto' : 'md:mr-auto'}`}
        >
            <div className={`p-3 rounded-xl bg-white/5 ${color} group-hover:bg-white/10 transition-colors`}>
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <h4 className="text-white font-bold text-sm">{title}</h4>
                <p className="text-gray-500 text-xs font-mono">{sub}</p>
            </div>
            {align === 'right' && <ArrowRight size={14} className="text-gray-600 group-hover:text-purple-400 transition-colors hidden md:block" />}
        </motion.div>
    )
}

function Beam({ x, y, delay, direction = 'right' }) {
    return (
        <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: [0, 1, 0], width: ['0%', '20%'] }}
            transition={{ duration: 2, repeat: Infinity, delay: delay, ease: "easeInOut" }}
            className={`absolute ${y} ${x} h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent z-0`}
            style={{ [direction === 'right' ? 'left' : 'right']: 0 }}
        />
    )
}
