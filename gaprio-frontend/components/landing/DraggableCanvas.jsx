'use client';
import { motion, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { CheckSquare, Mail, Video, Database, Layout, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { FcCollaboration } from 'react-icons/fc';

// --- CONFIGURATION ---
// I've adjusted the coordinates. 
// "mobileX/Y" are tighter coordinates for small screens to ensure visibility.
const tools = [
  // 1. Top Center
  { 
    id: 'asana', label: 'Asana', 
    image: '/companylogo/asana.png', 
    x: 5, y: -260, 
    mobileX: 0, mobileY: -160,
    color: '#ea580c', bg: 'bg-[#151515]' 
  },
  // 2. Top Right
  { 
    id: 'jira', label: 'Jira', 
    image: '/companylogo/jira.png', 
    x: 240, y: -180, 
    mobileX: 120, mobileY: -110,
    color: '#d97706', bg: 'bg-[#151515]' 
  },
  // 3. Right
  { 
    id: 'ms365', label: 'MS 365', 
    image: '/companylogo/microsoft.webp', 
    x: 360, y: 0, 
    mobileX: 160, mobileY: 0,
    color: '#2563eb', bg: 'bg-[#151515]' 
  },
  // 4. Bottom Right
  { 
    id: 'clickup', label: 'ClickUp', 
    image: '/companylogo/clickup.png', 
    x: 240, y: 180, 
    mobileX: 120, mobileY: 110,
    color: '#7c3aed', bg: 'bg-[#151515]' 
  },
  // 5. Bottom Center
  { 
    id: 'zoho', label: 'Zoho', 
    image: '/companylogo/zoho.png', 
    x: -5, y: 260, 
    mobileX: 0, mobileY: 160,
    color: '#ef4444', bg: 'bg-[#151515]' 
  },
  // 6. Bottom Left
  { 
    id: 'Google', label: 'Google', 
    image: '/companylogo/google.webp', 
    x: -240, y: 180, 
    mobileX: -120, mobileY: 110,
    color: '#dc2626', bg: 'bg-[#151515]' 
  },
  // 7. Left
  { 
    id: 'slack', label: 'Slack', 
    image: '/companylogo/slack.png', 
    x: -360, y: 0, 
    mobileX: -160, mobileY: 0,
    color: '#f97316', bg: 'bg-[#151515]' 
  },
  // 8. Top Left
  { 
    id: 'Miro', label: 'Miro', 
    image: '/companylogo/miro.png', 
    x: -240, y: -180, 
    mobileX: -120, mobileY: -110,
    color: '#fbbf24', bg: 'bg-[#151515]' 
  },
];

export default function DraggableCanvas() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect Mobile for positioning logic
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative min-h-[85vh] w-full bg-[#020202] flex flex-col items-center justify-center py-16 md:py-24 overflow-hidden border-t border-white/5">
      
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(249,115,22,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:50px_50px] opacity-[0.03] pointer-events-none" />

      {/* --- Header --- */}
      <div className="relative z-10 text-center mb-8 md:mb-16 px-6 pointer-events-none select-none">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tighter leading-[1.1]">
          Total <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Connectivity.</span>
        </h2>
        <p className="text-sm md:text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed">
           Gaprio maintains a live understanding of your work across every connected app. Drag the nodes to explore.
        </p>
      </div>

      {/* --- The Infinite Canvas --- */}
      <div 
        ref={containerRef} 
        className="relative w-full max-w-[1400px] h-[500px] md:h-[800px] flex items-center justify-center cursor-crosshair touch-none select-none"
      >
        
        {/* Central Gaprio Node (The Hub) */}
        <div className="absolute z-30 w-28 h-28 md:w-36 md:h-36 bg-[#0a0a0a] border border-white/10 rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(234,88,12,0.15)] ring-1 ring-white/5 pointer-events-none select-none">
           {/* Pulsing Rings */}
           <div className="absolute inset-0 rounded-full border border-orange-500/30 animate-[ping_3s_linear_infinite]" />
           <div className="absolute inset-4 rounded-full border border-amber-500/10 animate-[ping_3s_linear_infinite_1s]" />
           
           <div className="relative w-10 h-10 md:w-12 md:h-12 mb-1">
             <Image
               src="/logo1.png"
               alt="Gaprio Logo"
               fill
               className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
               priority
             />
           </div>
           <span className="font-bold text-white text-[10px] md:text-xs uppercase tracking-widest text-zinc-400">Gaprio</span>
        </div>

        {/* Draggable Tool Nodes */}
        {tools.map((tool) => (
            <DraggableNode 
                key={tool.id} 
                tool={tool} 
                containerRef={containerRef} 
                isMobile={isMobile}
            />
        ))}
        
      </div>
    </section>
  );
}

// --- The Node Component ---
function DraggableNode({ tool, containerRef, isMobile }) {
    // Determine initial position based on screen size
    const initialX = isMobile ? tool.mobileX : tool.x;
    const initialY = isMobile ? tool.mobileY : tool.y;

    // Spring physics for smooth dragging
    const x = useSpring(initialX, { stiffness: 120, damping: 20 });
    const y = useSpring(initialY, { stiffness: 120, damping: 20 });
    
    // Update spring targets when screen size changes
    useEffect(() => {
        x.set(isMobile ? tool.mobileX : tool.x);
        y.set(isMobile ? tool.mobileY : tool.y);
    }, [isMobile, tool.x, tool.y, tool.mobileX, tool.mobileY, x, y]);

    // State for SVG Lines
    const [pos, setPos] = useState({ x: initialX, y: initialY });

    useEffect(() => {
        const unsubX = x.on("change", (v) => setPos(p => ({ ...p, x: v })));
        const unsubY = y.on("change", (v) => setPos(p => ({ ...p, y: v })));
        return () => { unsubX(); unsubY(); };
    }, [x, y]);

    // Curve Calculation
    const midX = pos.x / 2;
    const midY = pos.y / 2 + 60; // Curve intensity

    const gradientId = `gradient-${tool.id}`;

    return (
        <>
            {/* --- The Connection Line --- */}
            <svg className="absolute top-1/2 left-1/2 overflow-visible pointer-events-none" style={{ zIndex: 10 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.05" />
                        <stop offset="100%" stopColor={tool.color} stopOpacity="0.6" />
                    </linearGradient>
                </defs>
                
                <motion.path 
                    d={`M 0 0 Q ${midX} ${midY} ${pos.x} ${pos.y}`}
                    stroke={`url(#${gradientId})`}
                    // CHANGE HERE: Increased from "2" to "4"
                    strokeWidth="4" 
                    strokeLinecap="round"
                    fill="none"
                    className="opacity-80" // Increased opacity slightly for better visibility
                />
            </svg>

            {/* --- The Draggable Card --- */}
            <motion.div
                drag
                dragConstraints={containerRef}
                dragElastic={0.1}
                dragMomentum={false}
                style={{ x, y }}
                whileHover={{ scale: 1.1, cursor: 'grab' }}
                whileDrag={{ scale: 1.15, cursor: 'grabbing', zIndex: 100 }}
                className={`absolute w-[72px] h-[72px] md:w-24 md:h-24 ${tool.bg} rounded-3xl flex flex-col items-center justify-center shadow-2xl z-20 border border-white/10 backdrop-blur-md group touch-none select-none`}
            >
                {/* Image */}
                <div className="relative w-8 h-8 md:w-10 md:h-10 mb-1.5 pointer-events-none select-none">
                    <Image 
                        src={tool.image} 
                        alt={tool.label} 
                        fill 
                        draggable={false}
                        className="object-contain"
                    />
                </div>
                
                {/* Label */}
                <span className="text-[9px] md:text-[10px] text-zinc-300 font-bold uppercase tracking-wider pointer-events-none select-none">{tool.label}</span>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                
                {/* Active Border on Hover/Drag */}
                <div className={`absolute inset-0 rounded-3xl border border-transparent group-hover:border-[${tool.color}]/50 transition-colors duration-300 pointer-events-none`} style={{ borderColor: tool.color + '40' }} />
            </motion.div>
        </>
    );
}