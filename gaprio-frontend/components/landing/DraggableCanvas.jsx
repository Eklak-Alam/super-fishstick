'use client';
import { motion, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { MessageSquare, CheckSquare, Mail, Video, FileText, FileSpreadsheet, Database, Activity } from 'lucide-react';
import Image from 'next/image';
import { FcCollaboration } from 'react-icons/fc';

// --- Configuration (Orange/Amber Palette) ---
const tools = [
  // 🔹 Top Row
  {
    id: 'slack',
    index: 1,
    label: 'Slack',
    icon: MessageSquare,
    image: '/companylogo/slack.png',
    x: -300,
    y: -240,
    color: '#f97316',
    bg: 'bg-[#0a0a0a]',
  },
  {
    id: 'asana',
    index: 2,
    label: 'Asana',
    icon: CheckSquare,
    image: '/companylogo/asana.png',
    x: 1,
    y: -300, // ⛔ not 0
    color: '#ea580c',
    bg: 'bg-[#0a0a0a]',
  },
  {
    id: 'jira',
    index: 3,
    label: 'Jira',
    icon: Database,
    image: '/companylogo/jira.png',
    x: 300,
    y: -240,
    color: '#d97706',
    bg: 'bg-[#0a0a0a]',
  },

  // 🔹 Middle Row
  {
    id: 'gmail',
    index: 4,
    label: 'Gmail',
    icon: Mail,
    image: '/companylogo/gmail.png',
    x: -420,
    y: 0,
    color: '#dc2626',
    bg: 'bg-[#0a0a0a]',
  },
  {
    id: 'ms365',
    index: 5,
    label: 'MS 365',
    icon: Video,
    image: '/companylogo/microsoft.webp',
    x: 420,
    y: 0,
    color: '#2563eb',
    bg: 'bg-[#0a0a0a]',
  },

  // 🔹 Bottom Row
  {
    id: 'meet',
    index: 6,
    label: 'Google Meet',
    icon: Video,
    image: '/companylogo/googlemeet.webp',
    x: -300,
    y: 240,
    color: '#ea580c',
    bg: 'bg-[#0a0a0a]',
  },
  {
    id: 'drive',
    index: 7,
    label: 'Drive',
    icon: Video,
    image: '/companylogo/drive.png',
    x: 10,
    y: 300,
    color: '#22c55e',
    bg: 'bg-[#0a0a0a]',
  },
  {
    id: 'clickup',
    index: 8,
    label: 'ClickUp',
    icon: Video,
    image: '/companylogo/clickup.png',
    x: 300,
    y: 240,
    color: '#7c3aed',
    bg: 'bg-[#0a0a0a]',
  },

  // 🔹 Extra Tools (Inner Ring)
  {
    id: 'zoho',
    index: 9,
    label: 'Zoho',
    icon: FcCollaboration,
    image: '/companylogo/zoho.png',
    x: -180,
    y: 120,
    color: '#ef4444',
    bg: 'bg-[#0a0a0a]',
  },
  {
    id: 'word',
    index: 10,
    label: 'Word',
    icon: FileText,
    image: '/companylogo/msword.png',
    x: 180,
    y: 120,
    color: '#2563eb',
    bg: 'bg-[#0a0a0a]',
  },
  {
    id: 'excel',
    index: 11,
    label: 'Excel',
    icon: FileSpreadsheet,
    image: '/companylogo/msexcel.png',
    x: -10,
    y: 140,
    color: '#16a34a',
    bg: 'bg-[#0a0a0a]',
  },
];


export default function DraggableCanvas() {
  const containerRef = useRef(null);

  return (
    <section className="relative min-h-[90vh] w-full bg-[#020202] flex flex-col items-center justify-center py-20 overflow-hidden border-t border-white/5">
      
      {/* --- Ambient Background (Orange Glow) --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(249,115,22,0.05),transparent_70%)]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:60px_60px] opacity-[0.04]" />

      {/* --- Header --- */}
      <div className="text-center mb-10 md:mb-24 z-10 pointer-events-none px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-950/20 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <Activity size={12} className="text-orange-500 animate-pulse" />
            <span className="text-[10px] font-bold text-orange-200 uppercase tracking-widest">Live Integration Sandbox</span>
        </div>
        <h2 className="text-4xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          Total <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Connectivity.</span>
        </h2>
        <p className="text-sm md:text-xl text-zinc-400 max-w-lg mx-auto leading-relaxed">
          Gaprio maintains the state of your work across every app. Drag a node to see the connection.
        </p>
      </div>

      {/* --- The Infinite Canvas --- */}
      <div 
        ref={containerRef} 
        className="relative w-full max-w-[1400px] h-[600px] md:h-[900px] flex items-center justify-center cursor-crosshair scale-[0.6] md:scale-100 origin-center touch-none select-none"
      >
        
        {/* Central Gaprio Node (The Hub) */}
        <div className="absolute z-30 w-32 h-32 md:w-40 md:h-40 bg-[#050505] border border-white/10 rounded-full flex flex-col items-center justify-center shadow-[0_0_80px_rgba(234,88,12,0.2)] ring-1 ring-white/10">
           {/* Pulsing Rings - Orange/Amber */}
           <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-[ping_3s_linear_infinite]" />
           <div className="absolute inset-4 rounded-full border border-amber-500/10 animate-[ping_3s_linear_infinite_1s]" />
           
           <Image
              src="/logo.png"
              alt="Gaprio Logo"
              width={44}
              height={34}
              className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
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

// --- The Node Component ---
function DraggableNode({ tool, containerRef }) {
    // 1. ORIGINAL SNAPPY PHYSICS (Preserved)
    const x = useSpring(tool.x, { stiffness: 150, damping: 15, mass: 0.1 });
    const y = useSpring(tool.y, { stiffness: 150, damping: 15, mass: 0.1 });
    
    // 2. State for SVG Lines
    const [pos, setPos] = useState({ x: tool.x, y: tool.y });

    useEffect(() => {
        const unsubX = x.on("change", (v) => setPos(p => ({ ...p, x: v })));
        const unsubY = y.on("change", (v) => setPos(p => ({ ...p, y: v })));
        return () => { unsubX(); unsubY(); };
    }, [x, y]);

    // 3. Curve Calculation
    const midX = pos.x / 2;
    const midY = pos.y / 2 + 60; // Curve intensity

    const gradientId = `gradient-${tool.id}`;

    return (
        <>
            {/* --- The Connection Line --- */}
            <svg className="absolute top-1/2 left-1/2 overflow-visible pointer-events-none" style={{ zIndex: 10 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                        <stop offset="100%" stopColor={tool.color} stopOpacity="0.8" />
                    </linearGradient>
                </defs>
                
                <motion.path 
                    d={`M 0 0 Q ${midX} ${midY} ${pos.x} ${pos.y}`}
                    stroke={`url(#${gradientId})`} // Uses dynamic orange colored gradient
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                />
            </svg>

            {/* --- The Draggable Card (Restored UI + Orange Theme) --- */}
            <motion.div
                drag
                dragConstraints={containerRef}
                dragElastic={0.2}
                style={{ x, y }}
                whileHover={{ scale: 1.1, cursor: 'grab' }}
                whileDrag={{ scale: 1.15, cursor: 'grabbing', zIndex: 100 }}
                // Card Styling: Dark background, border, shadow, glass effect
                className={`absolute w-20 h-20 md:w-24 md:h-24 ${tool.bg} rounded-3xl flex flex-col items-center justify-center shadow-2xl z-20 border border-white/20 backdrop-blur-md group touch-none`}
            >
                {/* Image OR Icon */}
                <div className="relative w-8 h-8 md:w-10 md:h-10 mb-2 transition-transform duration-300 group-hover:scale-110">
                    {tool.image ? (
                        <Image 
                            src={tool.image} 
                            alt={tool.label} 
                            fill 
                            draggable={false}
                            onDragStart={(e) => e.preventDefault()}
                            className="object-contain drop-shadow-md pointer-events-none select-none"
                        />
                    ) : (
                        <tool.icon className="w-full h-full text-white drop-shadow-md pointer-events-none" />
                    )}
                </div>
                
                {/* Label */}
                <span className="text-[9px] md:text-[10px] text-white font-bold uppercase tracking-wider">{tool.label}</span>
                
                {/* Glass Reflection Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                
                {/* Orange Hover Border Effect */}
                <div className="absolute inset-0 rounded-3xl border border-orange-500/0 group-hover:border-orange-500/30 transition-colors pointer-events-none" />
            </motion.div>
        </>
    );
}