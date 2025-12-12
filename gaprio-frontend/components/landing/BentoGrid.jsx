'use client';
import { motion } from 'framer-motion';
import { Zap, Shield, Globe, Cpu } from 'lucide-react';

export default function BentoGrid() {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="mb-20">
        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-6">
          Everything you need. <br /> Nothing you don't.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
        {/* Large Card */}
        <BentoCard className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-purple-900/20 to-black">
          <div className="p-8 h-full flex flex-col justify-between">
            <Cpu size={48} className="text-purple-400" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">AI-Core Processing</h3>
              <p className="text-gray-400">Our agentic AI doesn't just chat. It acts. It schedules meetings, sends emails, and updates tasks automatically.</p>
            </div>
            <div className="w-full h-32 bg-purple-500/10 rounded-xl border border-purple-500/20 mt-6 relative overflow-hidden">
              <motion.div 
                 animate={{ x: ["0%", "100%"] }} 
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent skew-x-12" 
              />
            </div>
          </div>
        </BentoCard>

        {/* Small Card 1 */}
        <BentoCard className="bg-blue-900/10">
          <div className="p-6">
            <Globe size={32} className="text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white">Global Sync</h3>
            <p className="text-sm text-gray-400 mt-2">Real-time collaboration across 140+ countries.</p>
          </div>
        </BentoCard>

        {/* Small Card 2 */}
        <BentoCard className="bg-green-900/10">
          <div className="p-6">
            <Shield size={32} className="text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white">Enterprise Security</h3>
            <p className="text-sm text-gray-400 mt-2">SOC2 Type II Certified and GDPR compliant.</p>
          </div>
        </BentoCard>
        
         {/* Small Card 3 */}
         <BentoCard className="bg-orange-900/10 md:col-span-1">
          <div className="p-6 flex items-center gap-4">
             <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">5x</div>
             <p className="text-white font-medium">Faster than Jira</p>
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
      className={`rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors ${className}`}
    >
      {children}
    </motion.div>
  );
}