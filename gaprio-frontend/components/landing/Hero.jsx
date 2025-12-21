'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Button from '../ui/Button';
import { ArrowRight, PlayCircle, MessageSquare, Database, Mail, CheckSquare, Zap } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax: Background moves slightly slower than foreground
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    // h-[100dvh] ensures it fits mobile browsers perfectly.
    <div ref={containerRef} className="relative h-[100dvh] w-full sticky top-0 z-0 overflow-hidden bg-[#050201] flex flex-col items-center justify-center selection:bg-orange-500/30">
      
      {/* --- 1. ATMOSPHERE LAYER (Restored Your Colors) --- */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-full pointer-events-none">
        
        {/* 1. Primary Glow (Top Center): "Solar Flare" (Orange/Amber) */}
        <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-orange-600/20 blur-[150px] rounded-[100%]" />
      
        {/* 2. Secondary Glow (Bottom Right): Deep Violet for contrast/depth */}
        <div className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[50vh] bg-violet-900/20 blur-[180px] rounded-[100%]" />
        
        {/* Grid Texture */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-[0.04]" />

        {/* Pulse Grid (Random Active Squares) */}
        <PulseGrid />

        {/* Falling Data Rain */}
        <div className="absolute inset-0">
            <DataDrop x="20%" delay={0} duration={8} />
            <DataDrop x="50%" delay={4} duration={10} />
            <DataDrop x="80%" delay={2} duration={9} />
        </div>

        {/* Floating Icons (Hidden on Mobile) */}
        <div className="hidden md:block">
            <FloatingIcon Icon={MessageSquare} x="10%" y="25%" delay={0} />
            <FloatingIcon Icon={Database} x="85%" y="30%" delay={2} />
            <FloatingIcon Icon={Mail} x="15%" y="65%" delay={4} />
            <FloatingIcon Icon={CheckSquare} x="80%" y="60%" delay={1} />
        </div>
      </motion.div>


      {/* --- 2. THE CONTENT --- */}
      <motion.div 
        style={{ opacity: opacityContent }}
        className="relative z-20 mt-16 w-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center gap-8"
      >
        
        {/* Animated Entrance Wrapper */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
                opacity: 1, 
                y: 0,
                transition: { staggerChildren: 0.15, duration: 0.8, ease: "easeOut" }
            }
          }}
          className="flex flex-col items-center"
        >

            {/* Headline: Uses your Specific Gradient */}
            <motion.h1 variants={itemAnim} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.05]">
                The AI Brain <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-200 to-amber-500">
                    for Your Enterprise
                </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={itemAnim} className="text-base sm:text-lg text-zinc-400 mb-10 max-w-2xl leading-relaxed font-light">
                One intelligent layer that understands your work, connects your tools, and turns everyday operations into automated workflows.            
            </motion.p>
            {/* Buttons */}
            <motion.div variants={itemAnim} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto min-w-[160px]">
                    Start Free Trial <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button variant="outline" className="w-full sm:w-auto min-w-[160px]">
                    <PlayCircle size={16} className="mr-2 text-orange-500" /> View Documentation
                </Button>
            </motion.div>
        </motion.div>

      </motion.div>
      
      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050201] to-transparent z-10 pointer-events-none" />
    </div>
  );
}

// --- SUB-COMPONENTS (Hydration Safe) ---

const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

// 1. Pulse Grid
function PulseGrid() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <div className="absolute inset-0 pointer-events-none">
            {mounted && Array.from({ length: 8 }).map((_, i) => (
                <PulseSquare key={i} />
            ))}
        </div>
    )
}

function PulseSquare() {
    const [pos, setPos] = useState({ top: '0%', left: '0%' });
    useEffect(() => {
        setPos({
            top: Math.floor(Math.random() * 20) * 5 + '%',
            left: Math.floor(Math.random() * 20) * 5 + '%'
        })
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ 
                duration: Math.random() * 4 + 2, 
                repeat: Infinity, 
                delay: Math.random() * 5,
                ease: "easeInOut"
            }}
            className="absolute w-[40px] h-[40px] bg-orange-500/5 border border-orange-500/10"
            style={{ top: pos.top, left: pos.left }}
        />
    )
}

// 2. Data Drop
function DataDrop({ x, delay, duration }) {
    return (
        <div className="absolute top-[-50%] w-[1px] h-[200vh] bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" style={{ left: x }}>
            <motion.div 
                animate={{ y: ['0%', '150%'] }} 
                transition={{ duration: duration, repeat: Infinity, delay: delay, ease: "linear" }}
                className="w-full h-[150px] bg-gradient-to-b from-transparent via-orange-500/30 to-transparent blur-[1px]" 
            />
        </div>
    )
}

// 3. Floating Icons
function FloatingIcon({ Icon, x, y, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
                opacity: [0.2, 0.5, 0.2], 
                y: [0, -15, 0],
            }}
            transition={{ 
                duration: 6, 
                repeat: Infinity, 
                delay: delay,
                ease: "easeInOut" 
            }}
            className="absolute p-3 rounded-2xl border border-orange-500/10 bg-white/[0.01] backdrop-blur-[1px] text-zinc-600 pointer-events-none"
            style={{ left: x, top: y }}
        >
            <Icon size={24} className="opacity-60" />
        </motion.div>
    )
}