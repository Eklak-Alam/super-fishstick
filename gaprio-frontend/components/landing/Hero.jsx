'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import { ArrowRight, PlayCircle, MessageSquare, Database, Mail, CheckSquare } from 'lucide-react';
import * as random from 'maath/random/dist/maath-random.cjs';

// --- 1. STABLE 3D COMPONENT (Hydration Safe) ---
function TechGlobe(props) {
  const ref = useRef();
  // Generate data only on client side to prevent NaN errors
  const [sphere] = useState(() => {
    const data = random.inSphere(new Float32Array(3000), { radius: 1.2 });
    // Safety check to remove any NaN values
    for (let i = 0; i < data.length; i++) {
        if (isNaN(data[i])) data[i] = 0; 
    }
    return data;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#f97316"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

// --- 2. MAIN HERO COMPONENT ---
export default function Hero() {
  const containerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent Hydration Mismatch: Only render complex logic after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[100dvh] w-full sticky top-0 z-0 overflow-hidden bg-[#050201] flex flex-col items-center justify-center selection:bg-orange-500/30">
      
      {/* --- 1. 3D LAYER (Standard Level) --- */}
      <div className="absolute inset-0 z-0 opacity-100">
        {isMounted && (
            <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: true, alpha: true }}>
                <Suspense fallback={null}>
                    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                        <TechGlobe />
                    </Float>
                </Suspense>
            </Canvas>
        )}
      </div>

      {/* --- 2. ATMOSPHERE LAYER (Your Original Layout) --- */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-full pointer-events-none z-10">
        
        {/* Solar Flare */}
        <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-orange-600/20 blur-[150px] rounded-[100%]" />
      
        {/* Violet Glow */}
        <div className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[50vh] bg-violet-900/20 blur-[180px] rounded-[100%]" />
        
        {/* Grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-[0.04]" />

        <PulseGrid />

        <div className="absolute inset-0">
            <DataDrop x="20%" delay={0} duration={8} />
            <DataDrop x="50%" delay={4} duration={10} />
            <DataDrop x="80%" delay={2} duration={9} />
        </div>

        <div className="hidden md:block">
            <FloatingIcon Icon={MessageSquare} x="10%" y="25%" delay={0} />
            <FloatingIcon Icon={Database} x="85%" y="30%" delay={2} />
            <FloatingIcon Icon={Mail} x="15%" y="65%" delay={4} />
            <FloatingIcon Icon={CheckSquare} x="80%" y="60%" delay={1} />
        </div>
      </motion.div>

      {/* --- 3. THE CONTENT --- */}
      <motion.div 
        style={{ opacity: opacityContent }}
        className="relative z-20 mt-16 w-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center gap-8"
      >
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
            <motion.h1 variants={itemAnim} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.05]">
                The AI Brain <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-200 to-amber-500">
                    for Your Enterprise
                </span>
            </motion.h1>

            <motion.p variants={itemAnim} className="text-base sm:text-lg text-zinc-400 mb-10 max-w-2xl leading-relaxed font-light">
                One intelligent layer that understands your work, connects your tools, and turns everyday operations into automated workflows.            
            </motion.p>


<motion.div variants={itemAnim} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
    
    {/* 1. START FREE TRIAL */}
    <button 
        suppressHydrationWarning={true} // <--- FIX 1
        className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-50 group shadow-[0_0_20px_-5px_rgba(249,115,22,0.5)]"
    >
        <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#27272a_0%,#f97316_50%,#27272a_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#050201] px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl gap-2 transition-colors hover:bg-zinc-900">
            Start Free Trial <ArrowRight size={16} className="text-orange-500 group-hover:translate-x-1 transition-transform" />
        </span>
    </button>
    
    {/* 2. VIEW DOCUMENTATION */}
    <button 
        suppressHydrationWarning={true} // <--- FIX 2
        className="group relative h-12 px-8 rounded-full text-sm font-medium text-zinc-300 border border-zinc-700 hover:border-orange-500/50 hover:bg-zinc-900/50 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
    >
        <PlayCircle size={16} className="text-orange-500 group-hover:scale-110 transition-transform" /> 
        View Documentation
    </button>

</motion.div>
        </motion.div>
      </motion.div>
      
      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050201] to-transparent z-10 pointer-events-none" />
    </div>
  );
}

// --- SUB-COMPONENTS (Originals Kept Intact) ---

const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

function PulseGrid() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
                <PulseSquare key={i} />
            ))}
        </div>
    )
}

function PulseSquare() {
    const [pos, setPos] = useState(null);
    useEffect(() => {
        setPos({
            top: Math.floor(Math.random() * 20) * 5 + '%',
            left: Math.floor(Math.random() * 20) * 5 + '%'
        })
    }, []);

    if (!pos) return null;

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