'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Button from '../ui/Button';
import { ArrowRight, PlayCircle, MessageSquare, Database, Mail, CheckSquare } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax: Background moves slightly slower than foreground
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    // FIX: Removed "-z-10", changed to "z-0". 
    // "sticky top-0" keeps it pinned so the next section slides over it.
    <div ref={containerRef} className="relative h-screen w-full sticky top-0 z-0 overflow-hidden bg-[#020202] flex flex-col items-center justify-center selection:bg-orange-500/30">
      
      {/* --- 1. THE ATMOSPHERE (Parallax Layer) --- */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-full pointer-events-none">
        
        {/* Solar Flare Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-orange-600/10 blur-[120px] rounded-full" />
        
        {/* Grid Texture */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:50px_50px] opacity-[0.04]" />

        {/* Falling Data Rain */}
        <div className="absolute inset-0">
            <DataDrop x="20%" delay={0} duration={6} />
            <DataDrop x="50%" delay={2} duration={8} />
            <DataDrop x="80%" delay={1} duration={7} />
        </div>

        {/* Floating Icons */}
        <FloatingIcon Icon={MessageSquare} x="10%" y="20%" delay={0} />
        <FloatingIcon Icon={Database} x="85%" y="30%" delay={2} />
        <FloatingIcon Icon={Mail} x="15%" y="70%" delay={4} />
        <FloatingIcon Icon={CheckSquare} x="80%" y="65%" delay={1} />
      </motion.div>


      {/* --- 2. THE CONTENT (Centered) --- */}
      <motion.div 
        style={{ opacity: opacityContent }}
        className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center gap-10"
      >
        
        {/* Animated Entrance */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
                opacity: 1, 
                y: 0,
                transition: { staggerChildren: 0.2, duration: 0.8, ease: "easeOut" }
            }
          }}
        >

            {/* Headline */}
            <motion.h1 variants={itemAnim} className="text-6xl md:text-9xl font-bold tracking-tighter text-white mb-8 leading-[0.95]">
                One brain for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-orange-100 to-orange-600">
                    your entire work.
                </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={itemAnim} className="text-lg md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                Stop switching tabs. Gaprio connects Slack, Asana, and Google to automate the busywork, so you can just flow.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={itemAnim} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button variant="primary">
                    Start Free Trial <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button variant="outline">
                    <PlayCircle size={20} className="mr-2 text-orange-500" /> See How It Works
                </Button>
            </motion.div>
        </motion.div>

      </motion.div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020202] to-transparent z-10" />
    </div>
  );
}

// --- SUB-COMPONENTS ---

const itemAnim = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

function DataDrop({ x, delay, duration }) {
    return (
        <div className="absolute top-[-50%] w-[1px] h-[200vh] bg-gradient-to-b from-transparent via-white/5 to-transparent" style={{ left: x }}>
            <motion.div 
                animate={{ y: ['0%', '100%'] }} 
                transition={{ duration: duration, repeat: Infinity, delay: delay, ease: "linear" }}
                className="w-full h-[200px] bg-gradient-to-b from-transparent via-orange-500 to-transparent blur-[1px]" 
            />
        </div>
    )
}

function FloatingIcon({ Icon, x, y, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
                opacity: [0.2, 0.5, 0.2], 
                y: [0, -30, 0],
            }}
            transition={{ 
                duration: 8, 
                repeat: Infinity, 
                delay: delay,
                ease: "easeInOut" 
            }}
            className="absolute p-4 rounded-3xl border border-orange-500/10 bg-white/[0.02] backdrop-blur-sm text-zinc-500 pointer-events-none"
            style={{ left: x, top: y }}
        >
            <Icon size={32} className="opacity-80" />
        </motion.div>
    )
}