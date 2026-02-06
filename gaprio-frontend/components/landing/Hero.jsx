"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import { BookOpen, ArrowRight, MessageSquare, Database, Mail, CheckSquare } from "lucide-react";
import * as random from "maath/random/dist/maath-random.cjs";
import Link from "next/link";

// --- 1. STABLE 3D COMPONENT (Unchanged) ---
function TechGlobe(props) {
  const ref = useRef();
  const [sphere] = useState(() => {
    const data = random.inSphere(new Float32Array(3000), { radius: 1.2 });
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], ["0%", "30%"]);
  const opacityContent = useTransform(scrollY, [0, 600], [1, 0]);

  // --- TILT LOGIC START ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Physics for smooth mouse tracking
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  // Map mouse position to rotation (Inverted for natural tilt)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  // --- TILT LOGIC END ---

  return (
    <section className="relative min-h-screen w-full bg-[#050201] flex flex-col items-center justify-start lg:pt-48 pt-36 pb-20 overflow-hidden perspective-[2000px] selection:bg-orange-500/30">
      
      {/* --- 3D Background Layer --- */}
      <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
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

      {/* --- Parallax Atmosphere Layer --- */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-orange-600/20 blur-[150px] rounded-[100%]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[50vh] bg-violet-900/20 blur-[180px] rounded-[100%]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-[0.04]" />
        <PulseGrid />
        
        <div className="hidden md:block">
          <FloatingIcon Icon={MessageSquare} x="10%" y="25%" delay={0} />
          <FloatingIcon Icon={Database} x="85%" y="30%" delay={2} />
          <FloatingIcon Icon={Mail} x="15%" y="65%" delay={4} />
          <FloatingIcon Icon={CheckSquare} x="80%" y="60%" delay={1} />
        </div>
      </motion.div>

      {/* --- Main Text Content --- */}
      <motion.div
        style={{ opacity: opacityContent }}
        className="relative z-20 w-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center gap-8 mb-24"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.15, duration: 0.8, ease: "easeOut" },
            },
          }}
          className="flex flex-col items-center"
        >
          <motion.h1
            variants={itemAnim}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.05]"
          >
            The AI Brain<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-200 to-amber-500">
               for Your Enterprise
            </span>
          </motion.h1>

          <motion.p
            variants={itemAnim}
            className="text-base sm:text-lg text-zinc-400 mb-10 max-w-2xl leading-relaxed font-light"
          >
            Gaprio sits above your existing tools, understands conversations, documents, and tasks together, and turns everyday coordination into automated outcomes.
          </motion.p>

          <motion.div
            variants={itemAnim}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center"
          >
            {/* Primary Button */}
           <Link
            suppressHydrationWarning={true}
            href='/register'
            className="
              group relative cursor-pointer 
              h-12 w-full sm:w-auto min-w-[200px] px-8 
              rounded-full overflow-hidden 
              bg-gradient-to-br from-orange-400 to-orange-500
              text-white font-bold text-lg tracking-wide
              flex items-center justify-center gap-2
              shadow-lg shadow-orange-500/30
              active:scale-95
              transition-all duration-300
            "
          >
            <div className="absolute inset-0 bg-orange-600 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <span className="relative z-10">Request Early Access</span>
            <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

            {/* Secondary Button */}
            <Link href='/integration' className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] cursor-pointer group w-auto min-w-[220px] sm:min-w-[160px]">
              <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#333333_50%,#f97316_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#050201] px-6 text-sm font-medium text-zinc-400 backdrop-blur-3xl group-hover:text-white group-hover:bg-[#0f0a05] transition-all duration-300 gap-2 whitespace-nowrap">
                See How It Works
                <BookOpen size={16} className="text-zinc-600 group-hover:text-orange-500 transition-colors duration-300" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* --- 3. DASHBOARD SECTION (3D TILT ENABLED) --- */}
      <motion.div
        initial={{ opacity: 0, y: 80, rotateX: 25 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{
          duration: 1.2,
          delay: 0.3,
          type: "spring",
          stiffness: 60,
          damping: 25,
        }}
        // Added perspective style here for 3D depth
        style={{ perspective: "1200px" }}
        className="w-full max-w-6xl relative z-20 mx-auto px-4 group"
      >
        {/* Glow Effect (Moved outside tilt container to stay grounded) */}
        <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-orange-500/30 via-purple-500/20 to-blue-500/20 blur-2xl sm:blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-700 will-change-[opacity]" />

        {/* <--- INTERACTIVE TILT CONTAINER ---> */}
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d", // Keeps children in 3D space
          }}
          className="relative w-full aspect-[20/10] rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-900/80 p-2 sm:p-3 shadow-2xl backdrop-blur-md transition-colors duration-500 ease-out hover:border-white/20 hover:shadow-orange-500/10"
        >
          
          <div 
            className="relative w-full h-full overflow-hidden rounded-lg sm:rounded-[14px] bg-black ring-1 ring-white/5 flex items-center justify-center"
            style={{ transform: "translateZ(30px)" }} // Pushes image forward for depth inside the card
          >
            
            <img
              src="/dashboard.png"
              alt="Gaprio Dashboard Interface"
              className="w-full h-full object-contain object-center" 
            />

            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none mix-blend-overlay" />
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050201] to-transparent z-10 pointer-events-none" />
    </section>
  );
}

// --- SUB-COMPONENTS (Unchanged) ---
const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
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
  );
}

function PulseSquare() {
  const [pos, setPos] = useState(null);
  useEffect(() => {
    setPos({
      top: Math.floor(Math.random() * 20) * 5 + "%",
      left: Math.floor(Math.random() * 20) * 5 + "%",
    });
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
        ease: "easeInOut",
      }}
      className="absolute w-[40px] h-[40px] bg-orange-500/5 border border-orange-500/10"
      style={{ top: pos.top, left: pos.left }}
    />
  );
}

function FloatingIcon({ Icon, x, y, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.2, 0.5, 0.2], y: [0, -15, 0] }}
      transition={{ duration: 6, repeat: Infinity, delay: delay, ease: "easeInOut" }}
      className="absolute p-3 rounded-2xl border border-orange-500/10 bg-white/[0.01] backdrop-blur-[1px] text-zinc-600 pointer-events-none"
      style={{ left: x, top: y }}
    >
      <Icon size={24} className="opacity-60" />
    </motion.div>
  );
}