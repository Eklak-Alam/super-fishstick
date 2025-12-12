'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Layers, Target, Zap, LayoutGrid, GitMerge, Box, ShieldCheck, Cpu } from 'lucide-react';

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  
  // Parallax for the grid background
  const yGrid = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <main ref={containerRef} className="bg-[#020202] min-h-screen text-white overflow-hidden selection:bg-purple-500/30">
      
      {/* --- Section 1: The Blueprint Hero --- */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-32">
        {/* Architectural Grid Background */}
        <motion.div 
            style={{ y: yGrid }}
            className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" 
        />
        
        <div className="relative z-10 text-center max-w-5xl">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-white/10 bg-white/5 backdrop-blur-md rounded-md text-[10px] font-mono text-gray-400 uppercase tracking-widest"
            >
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                System Architecture v2.0
            </motion.div>
            
            <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-none mb-8">
                <span className="block text-white mix-blend-difference">Architecting</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Intelligence.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-light">
                We are building the <span className="text-white">Central Nervous System</span> for the modern enterprise.
            </p>
        </div>
      </section>

      {/* --- Section 2: The "Entropy vs Synergy" Bento Grid --- */}
      <section className="py-32 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
            <div className="mb-16 flex items-end justify-between">
                <h2 className="text-4xl font-bold">The Shift.</h2>
                <p className="text-gray-500 text-right hidden md:block">From Fragmentation <br /> to Unification.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-4 md:grid-rows-3 gap-4 h-[1200px] md:h-[800px]">
                
                {/* 1. The Problem (Chaos) */}
                <BentoCard className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-red-900/10 to-[#0a0a0a] border-red-500/20">
                    <div className="p-8 h-full flex flex-col">
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                            <Layers className="text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">The Fragmentation Crisis</h3>
                        <p className="text-gray-400 mb-8">Apps are isolated islands. Context is lost in the gaps.</p>
                        
                        {/* Chaos Visual */}
                        <div className="flex-1 relative border border-red-500/10 rounded-xl bg-black/20 overflow-hidden">
                            {[...Array(5)].map((_, i) => (
                                <motion.div 
                                    key={i}
                                    animate={{ 
                                        x: [0, Math.random() * 100 - 50, 0], 
                                        y: [0, Math.random() * 100 - 50, 0],
                                        rotate: [0, 45, 0]
                                    }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute w-12 h-12 bg-red-500/20 rounded-lg border border-red-500/30 top-1/2 left-1/2 -ml-6 -mt-6"
                                />
                            ))}
                        </div>
                    </div>
                </BentoCard>

                {/* 2. The Solution (Gaprio Core) */}
                <BentoCard className="md:col-span-2 md:row-span-2 bg-[#0a0a0a]">
                    <div className="p-8 h-full flex flex-col">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6">
                            <Zap className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">The Unified Brain</h3>
                        <p className="text-gray-400 mb-8">One layer to rule them all. Tool agnostic intelligence.</p>
                        
                        {/* Order Visual */}
                        <div className="flex-1 relative flex items-center justify-center border border-white/10 rounded-xl bg-black/20">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] z-10">
                                <Cpu className="text-black" size={32} />
                            </div>
                            {/* Orbiting Satellites */}
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute w-64 h-64 border border-dashed border-white/20 rounded-full"
                            />
                            <motion.div 
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute w-48 h-48 border border-white/10 rounded-full"
                            />
                        </div>
                    </div>
                </BentoCard>

                {/* 3. Security */}
                <BentoCard className="md:col-span-1 md:row-span-1 bg-[#0a0a0a]">
                    <div className="p-6 flex flex-col h-full justify-between">
                        <ShieldCheck className="text-green-400" size={32} />
                        <div>
                            <div className="text-3xl font-bold text-white">SOC2</div>
                            <div className="text-sm text-gray-500">Enterprise Ready</div>
                        </div>
                    </div>
                </BentoCard>

                {/* 4. Speed */}
                <BentoCard className="md:col-span-1 md:row-span-1 bg-[#0a0a0a]">
                    <div className="p-6 flex flex-col h-full justify-between">
                        <Zap className="text-yellow-400" size={32} />
                        <div>
                            <div className="text-3xl font-bold text-white">50ms</div>
                            <div className="text-sm text-gray-500">Latency</div>
                        </div>
                    </div>
                </BentoCard>

                {/* 5. Integration */}
                <BentoCard className="md:col-span-2 md:row-span-1 bg-gradient-to-r from-purple-900/20 to-[#0a0a0a]">
                    <div className="p-6 flex items-center justify-between h-full">
                        <div>
                            <h3 className="text-xl font-bold text-white">Universal Sync</h3>
                            <p className="text-gray-400 text-sm">Works with Slack, Jira, Notion, and 50+ others.</p>
                        </div>
                        <GitMerge className="text-purple-400" size={40} />
                    </div>
                </BentoCard>

            </div>
        </div>
      </section>

    </main>
  );
}

function BentoCard({ children, className }) {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className={`rounded-3xl border border-white/10 overflow-hidden relative group ${className}`}
        >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            {children}
        </motion.div>
    )
}