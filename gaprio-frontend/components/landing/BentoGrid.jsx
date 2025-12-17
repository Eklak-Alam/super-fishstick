'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Globe, Cpu, Zap, Lock, Key, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function BentoGrid() {
  return (
    <section className="py-20 md:py-32 px-4 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-12 md:mb-20 text-center md:text-left">
        <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tighter leading-[1.05]">
          Everything you need. <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-700">
            Nothing you don't.
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[420px]">
        
        {/* --- 1. AI CORE (Large) --- */}
        <BentoCard className="md:col-span-2 min-h-[360px]">
          <div className="p-6 md:p-10 h-full flex flex-col justify-between relative z-20">
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-6 mb-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)] shrink-0">
                    <Cpu size={24} className="text-orange-500 md:w-7 md:h-7" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">Agentic AI Core</h3>
              </div>
              <p className="text-zinc-400 text-sm md:text-lg leading-relaxed max-w-md">
                Autonomous agents that handle complex workflows. They think, plan, and execute across your stack.
              </p>
            </div>
            
            {/* Widget: AI Chat */}
            <div className="mt-8 md:absolute md:bottom-8 md:right-8 w-full md:w-[320px]">
                <AgentChatWidget />
            </div>
          </div>
        </BentoCard>

        {/* --- 2. SECURITY (Small) - With Key Animation --- */}
        <BentoCard className="min-h-[360px]">
          <div className="p-6 md:p-8 h-full flex flex-col relative z-20">
            
            {/* NEW: Key Unlock Animation */}
            <LockPickAnimation />
            
            <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-6 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                    <Shield size={24} className="text-green-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Enterprise Security</h3>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed mb-auto relative z-10">
                SOC2 Type II Certified. Unauthorized access attempts are instantly blocked.
            </p>
            
            <div className="relative z-10 mt-8 pt-6 border-t border-white/5">
                <div className="flex justify-between text-[10px] text-zinc-500 mb-2 font-mono uppercase tracking-widest">
                    <span>System Status</span>
                    <span className="text-green-500 animate-pulse">Secure</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-green-500/30"></div>
                </div>
            </div>
          </div>
        </BentoCard>

        {/* --- 3. REAL-TIME SYNC (Small) --- */}
        <BentoCard className="min-h-[360px]">
          <div className="p-6 md:p-8 h-full flex flex-col relative z-20">
            <div className="relative z-20">
                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-6 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <Globe size={24} className="text-blue-500" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">Global Sync</h3>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">Updates propagate instantly across US, EU, and Asia regions.</p>
            </div>
            {/* Live Map */}
            <div className="absolute inset-0 top-[30%] opacity-80 pointer-events-none">
                <LiveSyncMap />
            </div>
          </div>
        </BentoCard>

        {/* --- 4. PERFORMANCE (Large) --- */}
        <BentoCard className="md:col-span-2 min-h-[360px]">
            <div className="p-6 md:p-10 h-full flex flex-col justify-between relative z-20">
                <div className="flex flex-col md:flex-row justify-between gap-8 z-20">
                    <div className="max-w-lg">
                        <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-6 mb-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)] shrink-0">
                                <Zap size={24} className="text-orange-500 md:w-7 md:h-7" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white">Lightning Fast</h3>
                        </div>
                        <p className="text-zinc-400 text-sm md:text-lg leading-relaxed">
                            Built on Rust for millisecond latency. Live performance monitoring included.
                        </p>
                    </div>
                    {/* Stats */}
                    <div className="flex gap-8 items-start pt-2">
                        <div>
                            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Latency</p>
                            <p className="text-2xl md:text-3xl font-bold text-white font-mono">12ms</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Throughput</p>
                            <p className="text-2xl md:text-3xl font-bold text-white font-mono">10k/s</p>
                        </div>
                    </div>
                </div>

                {/* VISUAL: Live Monitor Graph */}
                <div className="absolute bottom-0 left-0 right-0 h-48 z-10">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-20" />
                    <LiveMonitorGraph />
                </div>
            </div>
        </BentoCard>

      </div>
    </section>
  );
}

// --- HELPER COMPONENTS ---

// Plain Card (No Spotlight Border)
function BentoCard({ children, className }) {
  return (
    <motion.div 
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative rounded-[2rem] border border-white/10 bg-[#0a0a0a] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] ${className}`}
    >
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      {children}
    </motion.div>
  );
}

// 1. Agent Chat
function AgentChatWidget() {
    const [step, setStep] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setStep((s) => (s + 1) % 3), 2000);
        return () => clearInterval(interval);
    }, []);

    const steps = [
        { title: "Parsing Request...", color: "bg-zinc-800 text-zinc-400" },
        { title: "Calling Jira API...", color: "bg-blue-900/30 text-blue-400 border-blue-500/30" },
        { title: "Task Created Successfully", color: "bg-green-900/30 text-green-400 border-green-500/30" },
    ];

    return (
        <div className="bg-[#050505] border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xs">AI</div>
                <div className="text-xs font-bold text-white">Gaprio Agent</div>
            </div>
            <div className="space-y-3">
                <div className="text-xs text-zinc-400 bg-white/5 p-2 rounded-lg rounded-tl-none">
                    Create a Jira ticket for the new bug report.
                </div>
                <div className={`flex items-center gap-2 text-xs p-2 rounded-lg border transition-all duration-300 ${steps[step].color}`}>
                    {step === 0 && <span className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse" />}
                    {step === 1 && <span className="w-2 h-2 rounded-full bg-blue-500 animate-spin" />}
                    {step === 2 && <CheckCircle2 size={12} />}
                    {steps[step].title}
                </div>
            </div>
        </div>
    );
}

// 2. Lock Pick Animation (The Key Trying to Open)
function LockPickAnimation() {
    return (
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-green-900/10 blur-[80px] rounded-full" />
            
            <div className="absolute top-10 right-10">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    
                    {/* The Lock */}
                    <motion.div className="relative z-10 text-green-500">
                        <Lock size={64} />
                    </motion.div>

                    {/* The Key (Intruder) Animation Loop */}
                    <motion.div
                        animate={{ 
                            x: [40, 0, 0, 0, 40], // Move In -> Wait -> Shake -> Move Out
                            rotate: [0, 0, -10, 10, 0], // Shake while trying
                            opacity: [0, 1, 1, 1, 0] 
                        }}
                        transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            times: [0, 0.2, 0.4, 0.6, 1],
                            repeatDelay: 1 
                        }}
                        className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 text-red-500"
                    >
                        <Key size={32} className="rotate-[-90deg]" />
                    </motion.div>

                    {/* Shield Flash (Denial) */}
                    <motion.div
                        animate={{ opacity: [0, 0, 0.8, 0, 0], scale: [1, 1, 1.2, 1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, times: [0, 0.4, 0.5, 0.6, 1], repeatDelay: 1 }}
                        className="absolute inset-0 bg-red-500/20 rounded-full blur-xl z-0"
                    />
                </div>
            </div>
        </div>
    );
}

// 3. Live Sync Map
function LiveSyncMap() {
    return (
        <div className="w-full h-full relative">
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 50" preserveAspectRatio="none">
                <path d="M 20 25 Q 35 10 50 15" fill="none" stroke="#ea580c" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-30" />
                <circle r="1" fill="#fbbf24">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M 20 25 Q 35 10 50 15" />
                </circle>
                <path d="M 50 15 Q 65 20 80 35" fill="none" stroke="#ea580c" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-30" />
                <circle r="1" fill="#fbbf24">
                    <animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" path="M 50 15 Q 65 20 80 35" />
                </circle>
                <circle cx="20" cy="25" r="2" fill="#ea580c" className="animate-pulse" />
                <circle cx="50" cy="15" r="2" fill="#ea580c" className="animate-pulse" />
                <circle cx="80" cy="35" r="2" fill="#ea580c" className="animate-pulse" />
            </svg>
        </div>
    );
}

// 4. Live Monitor Graph
function LiveMonitorGraph() {
    const [path, setPath] = useState('');
    useEffect(() => {
        let data = Array(40).fill(50);
        const interval = setInterval(() => {
            data.shift();
            const time = Date.now() / 1000;
            const value = 50 + Math.sin(time * 2) * 20 + Math.random() * 10;
            data.push(value);
            const d = data.map((point, i) => {
                const x = (i / (data.length - 1)) * 100;
                return `${i === 0 ? 'M' : 'L'} ${x} ${100 - point}`;
            }).join(' ');
            setPath(d);
        }, 50);
        return () => clearInterval(interval);
    }, []);
    if (!path) return null;
    return (
        <div className="w-full h-full relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="monitor-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={`${path} L 100 100 L 0 100 Z`} fill="url(#monitor-gradient)" className="transition-all duration-75 ease-linear" />
                <path d={path} fill="none" stroke="#f97316" strokeWidth="1.5" className="transition-all duration-75 ease-linear" />
            </svg>
            <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Live</span>
            </div>
        </div>
    );
}