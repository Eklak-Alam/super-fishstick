'use client';
import { motion } from 'framer-motion';
import { Shield, Globe, Cpu, Lock, Activity, Zap } from 'lucide-react';

export default function BentoGrid() {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-20 text-center md:text-left">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter">
          Everything you need. <br /> 
          <span className="text-zinc-500">Nothing you don't.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
        
        {/* Large Card: AI Core */}
        <BentoCard className="md:col-span-2 md:row-span-1 bg-[#0a0a0a]">
          <div className="p-8 h-full flex flex-col justify-between relative overflow-hidden group">
            
            {/* Content */}
            <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
                    <Cpu size={24} className="text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Agentic AI Core</h3>
                <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
                    Our agents don't just chat. They act. They schedule meetings, send emails, and update tasks automatically across your entire stack.
                </p>
            </div>
            
            {/* Visual: Code/Data Stream */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-30 mask-gradient-b">
                <div className="h-full w-full bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute bottom-8 right-8 space-y-2 font-mono text-[10px] text-orange-400">
                    <div className="bg-orange-900/20 border border-orange-500/20 px-3 py-1.5 rounded-lg w-fit ml-auto">
                        Executing workflow...
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg w-fit ml-auto text-zinc-500">
                        Context retrieved
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg w-fit ml-auto text-zinc-500">
                        Slack API connected
                    </div>
                </div>
            </div>
          </div>
        </BentoCard>

        {/* Small Card 1: Security */}
        <BentoCard className="bg-[#0a0a0a]">
          <div className="p-8 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-green-500/10 transition-colors" />
            
            <Shield size={28} className="text-green-500 mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
            <p className="text-sm text-zinc-400 mb-8">SOC2 Type II Certified. Your data is isolated and encrypted at rest.</p>
            
            {/* Visual: Lock Status */}
            <div className="mt-auto flex items-center gap-3 px-4 py-2.5 rounded-xl bg-green-500/5 border border-green-500/20 w-fit">
                <Lock size={14} className="text-green-500" />
                <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Encrypted</span>
            </div>
          </div>
        </BentoCard>

        {/* Small Card 2: Global Sync */}
        <BentoCard className="bg-[#0a0a0a]">
          <div className="p-8 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-colors" />

            <Globe size={28} className="text-blue-500 mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">Real-time Sync</h3>
            <p className="text-sm text-zinc-400 mb-6">Updates propagate instantly across US, EU, and Asia regions.</p>
            
            <div className="mt-auto space-y-3">
                <div className="flex justify-between text-xs text-zinc-500">
                    <span>US-East-1</span>
                    <span className="text-green-500 font-mono">12ms</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-blue-500 rounded-full" />
                </div>
            </div>
          </div>
        </BentoCard>

        {/* Medium Card: Performance */}
        <BentoCard className="md:col-span-2 md:row-span-1 bg-[#0a0a0a]">
            <div className="p-8 h-full flex items-center justify-between relative overflow-hidden group">
                <div className="relative z-10 max-w-sm">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
                        <Zap size={24} className="text-orange-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Lightning Fast</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Built on Rust for millisecond latency. Gaprio handles complex reasoning tasks faster than any human operator.
                    </p>
                </div>

                {/* Visual: Graph */}
                <div className="hidden md:flex gap-2 items-end h-32 w-48 opacity-50 group-hover:opacity-100 transition-opacity">
                    {[40, 70, 50, 90, 60, 80].map((h, i) => (
                        <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm" />
                    ))}
                </div>
            </div>
        </BentoCard>

      </div>
    </section>
  );
}

function BentoCard({ children, className }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`rounded-3xl border border-white/5 overflow-hidden hover:border-white/10 transition-all hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] ${className}`}
    >
      {children}
    </motion.div>
  );
}