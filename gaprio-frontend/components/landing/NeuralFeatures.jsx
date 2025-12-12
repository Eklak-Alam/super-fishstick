'use client';
import { motion } from 'framer-motion';
import { Zap, MessageSquare, FileText, Calendar, CheckSquare, Database, Mail, FileSpreadsheet } from 'lucide-react';

const connections = [
  // Cluster 1: Communication
  { id: 'slack', icon: MessageSquare, label: 'Slack', x: -200, y: -150, delay: 0 },
  { id: 'asana', icon: CheckSquare, label: 'Asana', x: 0, y: -220, delay: 0.1 },
  { id: 'jira', icon: Database, label: 'Jira', x: 200, y: -150, delay: 0.2 },

  // Cluster 2: Google
  { id: 'gmail', icon: Mail, label: 'Gmail', x: -300, y: 0, delay: 0.3 },
  { id: 'docs', icon: FileText, label: 'Docs', x: -250, y: 150, delay: 0.4 },

  // Cluster 3: Microsoft
  { id: 'word', icon: FileText, label: 'Word', x: 300, y: 0, delay: 0.5 },
  { id: 'excel', icon: FileSpreadsheet, label: 'Excel', x: 250, y: 150, delay: 0.6 },
];

export default function NeuralFeatures() {  
  return (
    <section className="min-h-screen bg-[#020202] flex flex-col items-center justify-center py-20 relative overflow-hidden">
      
      <div className="text-center mb-20 z-10 px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Not an Add-on. <br /> The <span className="text-purple-400">Central Nervous System.</span></h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Gaprio sits above your tools, connecting the dots that humans usually miss.
        </p>
      </div>

      <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] flex items-center justify-center">
        
        {/* Central Brain (Gaprio) */}
        <div className="relative z-20 w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.3)]">
          <Zap className="text-black w-10 h-10 md:w-16 md:h-16 animate-pulse" />
          {/* Ripple Effect */}
          <div className="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-20" />
        </div>

        {/* Orbiting Tools */}
        {connections.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1, x: item.x, y: item.y }}
            transition={{ duration: 0.8, delay: item.delay, type: "spring" }}
            className="absolute z-10"
          >
            {/* Connection Line */}
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none opacity-20" style={{ zIndex: -1 }}>
              <line x1="50%" y1="50%" x2={200 - item.x} y2={200 - item.y} stroke="white" strokeWidth="2" />
            </svg>
            
            <div className="w-16 h-16 bg-[#0a0a0a] border border-white/20 rounded-2xl flex items-center justify-center hover:border-purple-500 transition-colors cursor-pointer group">
              <item.icon className="text-gray-400 group-hover:text-purple-400 transition-colors" />
              <div className="absolute top-20 text-xs text-gray-500 font-mono tracking-widest">{item.label}</div>
            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
}