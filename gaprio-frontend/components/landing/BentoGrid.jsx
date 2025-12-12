'use client';
import { motion } from 'framer-motion';
import { Zap, Shield, Globe, Cpu, BarChart, Lock, Users } from 'lucide-react';

export default function BentoGrid() {
  return (
    <section className="py-10 md:pt-16 px-4 max-w-7xl mx-auto">
      <div className="mb-16 md:mb-20">
        <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-6 tracking-tight">
          Everything you need. <br /> Nothing you don't.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-auto md:h-[400px]">
        
        {/* Large Card: AI Core */}
        <BentoCard className="md:col-span-2 md:row-span-2 bg-[#020202]">
          <div className="p-8 h-full flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
                    <Cpu size={24} className="text-purple-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Agentic AI Core</h3>
                <p className="text-gray-400 text-base md:text-lg max-w-md">Our agents don't just chat. They act. They schedule meetings, send emails, and update tasks automatically.</p>
            </div>
            
            {/* Visual: Code/Data Stream */}
            <div className="w-full h-40 bg-[#020202] rounded-xl border border-white/10 mt-8 relative overflow-hidden p-4 font-mono text-xs text-green-400/80">
               <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(transparent_0%,rgba(0,0,0,0.8)_100%)] z-10" />
               <p>{`> Initializing Gaprio Agent v2.1...`}</p>
               <p>{`> Connecting to Slack API... [OK]`}</p>
               <p>{`> Analyzing Thread Context...`}</p>
               <p className="text-purple-400">{`> Intent Detected: "Create Proposal"`}</p>
               <p>{`> Generating Doc...`}</p>
            </div>
          </div>
        </BentoCard>

        {/* Small Card 1: Security */}
        <BentoCard className="bg-[#020202]">
          <div className="p-6 h-full flex flex-col">
            <Shield size={28} className="text-green-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Enterprise Security</h3>
            <p className="text-sm text-gray-400 mb-4">SOC2 Type II Certified.</p>
            {/* Visual: Lock Status */}
            <div className="mt-auto flex items-center gap-3 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <Lock size={14} className="text-green-400" />
                <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Encrypted</span>
            </div>
          </div>
        </BentoCard>

        {/* Small Card 2: Global Sync */}
        <BentoCard className="bg-[#020202]]">
          <div className="p-6 h-full flex flex-col">
            <Globe size={28} className="text-blue-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Real-time Sync</h3>
            <div className="mt-auto space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                    <span>US-East</span>
                    <span className="text-green-400">12ms</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full">
                    <div className="h-full w-[90%] bg-blue-500 rounded-full" />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                    <span>EU-West</span>
                    <span className="text-green-400">45ms</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full">
                    <div className="h-full w-[70%] bg-blue-500 rounded-full" />
                </div>
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
      whileHover={{ y: -5 }}
      className={`rounded-3xl border border-white/10 bg-[#020202] overflow-hidden hover:border-white/20 transition-all hover:shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
}