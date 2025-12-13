'use client';
import { motion, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { MessageSquare, CheckSquare, Mail, Video, FileText, FileSpreadsheet, Database, Activity } from 'lucide-react';
import Image from 'next/image';

// --- Configuration ---
const tools = [
  { id: 'slack', index: 1, label: 'Slack', icon: MessageSquare, image: '/companylogo/slack.png', x: -350, y: -200, color: '#4A154B', bg: 'bg-[#4A154B]' },
  { id: 'asana', index: 2, label: 'Asana', icon: CheckSquare, image: '/companylogo/asana.png', x: 0, y: -280, color: '#F06A6A', bg: 'bg-[#F06A6A]' },
  { id: 'jira', index: 3, label: 'Jira', icon: Database, image: null, x: 350, y: -200, color: '#0052CC', bg: 'bg-[#0052CC]' },
  { id: 'gmail', index: 4, label: 'Gmail', icon: Mail, image: null, x: -400, y: 0, color: '#EA4335', bg: 'bg-[#EA4335]' },
  { id: 'word', index: 5, label: 'Word', icon: FileText, image: null, x: 400, y: 0, color: '#2B579A', bg: 'bg-[#2B579A]' },
  { id: 'excel', index: 6, label: 'Excel', icon: FileSpreadsheet, image: null, x: 300, y: 220, color: '#217346', bg: 'bg-[#217346]' },
  { id: 'meet', index: 7, label: 'Meet', icon: Video, image: '/companylogo/googlemeet.webp', x: -300, y: 220, color: '#00AC47', bg: 'bg-[#00AC47]' },
];

export default function DraggableCanvas() {
  const containerRef = useRef(null);

  return (
    <section className="relative min-h-[90vh] w-full bg-[#020202] flex flex-col items-center justify-center py-20 overflow-hidden border-t border-white/5">
      
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.03),transparent_70%)]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:60px_60px] opacity-[0.04]" />

      {/* --- Header --- */}
      <div className="text-center mb-10 md:mb-24 z-10 pointer-events-none px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
            <Activity size={12} className="text-green-400" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Integration Sandbox</span>
        </div>
        <h2 className="text-4xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          Total <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Connectivity.</span>
        </h2>
        <p className="text-sm md:text-xl text-gray-400 max-w-lg mx-auto leading-relaxed">
          Gaprio maintains the state of your work across Platforms.
        </p>
      </div>

      {/* --- The Infinite Canvas --- */}
      <div 
        ref={containerRef} 
        className="relative w-full max-w-[1400px] h-[600px] md:h-[900px] flex items-center justify-center cursor-crosshair scale-[0.6] md:scale-100 origin-center touch-none select-none"
      >
        
        {/* Central Gaprio Node (The Hub) */}
        <div className="absolute z-30 w-32 h-32 md:w-40 md:h-40 bg-[#050505] border border-white/20 rounded-full flex flex-col items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.1)] ring-4 ring-black">
           {/* Pulsing Rings */}
           <div className="absolute inset-0 rounded-full border border-white/10 animate-[ping_3s_linear_infinite]" />
           <div className="absolute inset-4 rounded-full border border-purple-500/20 animate-[ping_3s_linear_infinite_1s]" />
           
           <Image
              src="/logo.png"
              alt="Gaprio Logo"
              width={44}
              height={34}
              className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              priority
              draggable={false}
           />
           <span className="font-bold text-white text-[10px] md:text-xs uppercase tracking-widest mt-1">Gaprio</span>
        </div>

        {/* Draggable Tool Nodes */}
        {tools.map((tool) => (
            <DraggableNode 
                key={tool.id} 
                tool={tool} 
                containerRef={containerRef} 
            />
        ))}
        
      </div>
    </section>
  );
}

// --- The Node Component (Handles Logic & Drawing) ---
function DraggableNode({ tool, containerRef }) {
    // 1. Physics Setup: Springs make dragging feel "Heavy" and "Real"
    const x = useSpring(tool.x, { stiffness: 150, damping: 15, mass: 0.1 });
    const y = useSpring(tool.y, { stiffness: 150, damping: 15, mass: 0.1 });
    
    // 2. State to update the SVG Line coordinates
    const [pos, setPos] = useState({ x: tool.x, y: tool.y });

    // 3. Sync Physics with State (High Performance Loop)
    useEffect(() => {
        const unsubX = x.on("change", (v) => setPos(p => ({ ...p, x: v })));
        const unsubY = y.on("change", (v) => setPos(p => ({ ...p, y: v })));
        return () => { unsubX(); unsubY(); };
    }, [x, y]);

    // 4. Calculate Bézier Control Point (The "Slack" in the line)
    //    We bend the line slightly towards the bottom to simulate gravity/slack
    const midX = pos.x / 2;
    const midY = pos.y / 2 + 60; // +60 adds the curve intensity

    // 5. Create Dynamic Gradient ID
    const gradientId = `gradient-${tool.id}`;

    return (
        <>
            {/* --- The Curved Connection Line (Behind Nodes) --- */}
            <svg className="absolute top-1/2 left-1/2 overflow-visible pointer-events-none" style={{ zIndex: 10 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                        <stop offset="100%" stopColor={tool.color} stopOpacity="0.8" />
                    </linearGradient>
                </defs>
                
                {/* Quadratic Bézier Curve: M=Start, Q=Control Point, End Point */}
                <motion.path 
                    d={`M 0 0 Q ${midX} ${midY} ${pos.x} ${pos.y}`}
                    stroke={`url(#${gradientId})`} // Uses dynamic colored gradient
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                />
            </svg>

            {/* --- The Draggable Card --- */}
            <motion.div
                drag
                dragConstraints={containerRef}
                dragElastic={0.2} // Elasticity at edges
                style={{ x, y }} // Bind physics
                whileHover={{ scale: 1.1, cursor: 'grab' }}
                whileDrag={{ scale: 1.15, cursor: 'grabbing', zIndex: 100 }}
                // Preserved ORIGINAL styling as requested (bg, rounded, shadow, border)
                className={`absolute w-20 h-20 md:w-24 md:h-24 ${tool.bg} rounded-3xl flex flex-col items-center justify-center shadow-2xl z-20 border border-white/20 backdrop-blur-md group touch-none`}
            >
                {/* Image OR Icon Logic */}
                <div className="relative w-8 h-8 md:w-10 md:h-10 mb-2 transition-transform duration-300 group-hover:scale-110">
                    {tool.image ? (
                        <Image 
                            src={tool.image} 
                            alt={tool.label} 
                            fill 
                            draggable={false}
                            className="object-contain drop-shadow-md pointer-events-none"
                        />
                    ) : (
                        <tool.icon className="w-full h-full text-white drop-shadow-md pointer-events-none" />
                    )}
                </div>
                
                {/* Label (Preserved) */}
                <span className="text-[9px] md:text-[10px] text-white font-bold uppercase tracking-wider">{tool.label}</span>
                
                {/* Glass Reflection Effect (Preserved) */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
            </motion.div>
        </>
    );
}