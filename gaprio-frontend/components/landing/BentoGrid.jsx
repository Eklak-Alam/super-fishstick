'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cpu, Zap, Globe, Lock, Send, Command } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation'; // <--- ADD THIS LINE

// --- MAIN COMPONENT ---
export default function BentoGrid() {
  return (
    <section className="py-12 md:py-24 px-4 md:px-8 max-w-7xl mx-auto bg-black text-white overflow-hidden">
      
      {/* Header */}
      <div className="mb-10 md:mb-20">
        <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
          Everything you need. <br /><span className="text-zinc-600">Nothing you don’t.</span>
        </h2>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed">
           Designed to reduce coordination overhead, preserve context, and scale decision-making across teams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-auto">
        
        {/* --- 1. AGENTIC AI CORE --- */}
        <BentoCard className="md:col-span-2 min-h-[400px]">
          <div className="p-6 md:p-8 h-full flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="flex-1 flex flex-col justify-start relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                        <Cpu size={24} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">Agentic AI Core</h3>
                </div>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                    Gaprio uses agentic AI to plan, coordinate, and execute multi-step work across tools, always with human approval.
                </p>
            </div>
            
            {/* Terminal */}
            <div className="w-full md:w-[380px] h-[220px] md:h-full shrink-0 relative z-10">
                <CommandTerminal />
            </div>
          </div>
        </BentoCard>

        {/* --- 2. ENTERPRISE SECURITY --- */}
        <BentoCard className="min-h-[380px]">
          <div className="h-full flex flex-col relative overflow-hidden">
            
            <div className="relative z-20 p-6 md:p-8 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 backdrop-blur-md">
                        <Shield size={24} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold drop-shadow-md text-white">Enterprise Security</h3>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed max-w-[95%]">
                    Gaprio respects existing access rules. It never sees or acts beyond what users are already permitted to do.
                </p>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center z-10 pt-16">
                <StasisFieldVisual />
            </div>

            <div className="relative z-20 mt-auto mx-6 mb-6 md:mx-8 md:mb-8 pt-4 border-t border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/5">
                <span className="text-[10px] md:text-xs text-zinc-500 font-mono uppercase">Status</span>
                <span className="text-[10px] md:text-xs text-emerald-500 font-mono font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/>
                    SECURE
                </span>
            </div>
          </div>
        </BentoCard>

        {/* --- 3. GLOBAL SYNC --- */}
        <BentoCard className="min-h-[400px] overflow-hidden bg-[#050505] p-0">
            <div className="absolute inset-0 z-0">
                <GlobeHighVis />
            </div>

            <div className="absolute top-0 left-0 p-6 md:p-8 w-full z-10 pointer-events-none bg-gradient-to-b from-black/90 via-black/60 to-transparent pb-24">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 backdrop-blur-md">
                        <Globe size={24} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold drop-shadow-lg text-white">Global Sync</h3>
                </div>
                <p className="text-zinc-300 text-sm drop-shadow-md max-w-[90%]">
                    Work stays aligned across teams, tools, and regions without manual updates or duplicated effort.
                </p>
            </div>
        </BentoCard>

        {/* --- 4. PERFORMANCE --- */}
        <BentoCard className="md:col-span-2 min-h-[340px]">
            <div className="p-6 md:p-8 h-full flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-20">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold">Lightning Fast</h3>
                            <p className="text-zinc-500 text-sm max-w-sm mt-1">
                                Designed for reliability and responsiveness at enterprise scale.
                            </p>
                        </div>
                    </div>
                    <div className="text-left md:text-right bg-zinc-900/50 p-3 rounded-xl border border-white/5 w-full md:w-auto">
                        <div className="text-3xl font-mono font-bold text-white">12<span className="text-zinc-500 text-lg">ms</span></div>
                        <div className="text-xs text-green-500 uppercase tracking-widest font-mono">Global Latency</div>
                    </div>
                </div>
                
                <div className="flex-1 w-full bg-zinc-900/30 rounded-xl border border-white/5 relative overflow-hidden h-[160px]">
                    <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[1px] opacity-10 pointer-events-none">
                         {[...Array(20)].map((_,i) => <div key={i} className="bg-zinc-500 h-full w-[1px]" />)}
                    </div>
                    <LiveSpectrum />
                </div>
            </div>
        </BentoCard>

      </div>
    </section>
  );
}


// ------------------------------------------------------------------
// PART 1: HIGH-VISIBILITY 3D GLOBE
// ------------------------------------------------------------------

function GlobeHighVis() {
  const [GlobeClass, setGlobeClass] = useState(null);

  useEffect(() => {
    let mounted = true;
    import('three-globe').then((mod) => {
      if (mounted) {
        setGlobeClass(() => mod.default);
        extend({ ThreeGlobe: mod.default });
      }
    }).catch(err => console.log("Error loading globe", err));

    return () => { mounted = false; };
  }, []);

  const globeConfig = {
    pointSize: 1,
    globeColor: "#1e293b", 
    showAtmosphere: true,
    atmosphereColor: "#f97316",
    atmosphereAltitude: 0.25, 
    emissive: "#1e293b",
    emissiveIntensity: 0.2, 
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,1)", 
    ambientLight: "#ffffff", 
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
  };

  const arcsData = [
    { startLat: 37.7749, startLng: -122.4194, endLat: 40.7128, endLng: -74.006, color: "#fb923c" },
    { startLat: 51.5072, startLng: -0.1276, endLat: 28.6139, endLng: 77.209, color: "#fb923c" },
    { startLat: -33.8688, startLng: 151.2093, endLat: 1.3521, endLng: 103.8198, color: "#38bdf8" },
    { startLat: 40.7128, startLng: -74.006, endLat: 51.5072, endLng: -0.1276, color: "#fb923c" }, 
    { startLat: 35.6762, startLng: 139.6503, endLat: 37.7749, endLng: -122.4194, color: "#fb923c" },
    { startLat: 1.3521, startLng: 103.8198, endLat: 35.6762, endLng: 139.6503, color: "#fb923c" },
  ];

  if (!GlobeClass) return <div className="w-full h-full bg-[#1e293b] animate-pulse" />;

  return (
    <Canvas camera={{ position: [0, 0, 320], fov: 45 }}>
      <ambientLight color={globeConfig.ambientLight} intensity={1} />
      <directionalLight color={globeConfig.directionalLeftLight} position={[-400, 100, 400]} intensity={1} />
      <directionalLight color={globeConfig.directionalTopLight} position={[-200, 500, 200]} intensity={1} />
      <pointLight color={globeConfig.pointLight} position={[-200, 500, 200]} intensity={1.5} />
      
      <GlobeContentHighVis GlobeClass={GlobeClass} globeConfig={globeConfig} data={arcsData} />
      
      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        minDistance={320} 
        maxDistance={320} 
        enableRotate={true}
        autoRotate={false} 
      />
    </Canvas>
  );
}

function GlobeContentHighVis({ GlobeClass, globeConfig, data }) {
  const globeRef = useRef();
  const [countries, setCountries] = useState(null);
  const globeObjRef = useRef(null);
  
  // --- PHYSICS CONFIGURATION ---
  const speedRef = useRef(0.0006); 
  const baseSpeed = 0.0006;        // Idle speed
  const boostSpeed = 0.002;        // MAX scroll speed (Very subtle now)
  const smoothness = 0.01;         // Lower = smoother/slower slowdown (0.01 is very liquid)

  if (!globeObjRef.current && GlobeClass) {
      globeObjRef.current = new GlobeClass();
  }
  const globeObj = globeObjRef.current;

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/three-globe/master/example/country-polygons/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries)
      .catch(err => console.error("Globe data load failed", err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      speedRef.current = boostSpeed;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame(() => {
    if (globeRef.current) {
      // Lerp: Smoothly drift from current speed back to baseSpeed
      speedRef.current = THREE.MathUtils.lerp(speedRef.current, baseSpeed, smoothness);
      globeRef.current.rotation.y += speedRef.current;
    }
  });

  useEffect(() => {
    if (!globeObj || !countries) return;

    globeObj
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.6) 
      .showAtmosphere(globeConfig.showAtmosphere)
      .atmosphereColor(globeConfig.atmosphereColor)
      .atmosphereAltitude(globeConfig.atmosphereAltitude)
      .hexPolygonColor(() => globeConfig.polygonColor);

    globeObj
      .arcsData(data)
      .arcStartLat((d) => d.startLat)
      .arcStartLng((d) => d.startLng)
      .arcEndLat((d) => d.endLat)
      .arcEndLng((d) => d.endLng)
      .arcColor((d) => d.color)
      .arcAltitude(0.25)
      .arcStroke(0.8) 
      .arcDashLength(globeConfig.arcLength)
      .arcDashGap(2) 
      .arcDashAnimateTime(globeConfig.arcTime);

    const globeMaterial = globeObj.globeMaterial();
    globeMaterial.color = new THREE.Color(globeConfig.globeColor);
    globeMaterial.emissive = new THREE.Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity;
    globeMaterial.shininess = globeConfig.shininess;

  }, [countries, data, globeConfig, globeObj]);

  if (!globeObj) return null;

  return <primitive object={globeObj} ref={globeRef} />;
}


// ------------------------------------------------------------------
// PART 2: STASIS FIELD VISUAL
// ------------------------------------------------------------------

function StasisFieldVisual() {
    const [threats, setThreats] = useState([]);
    const SAFE_ZONE_RADIUS = 50; 

    useEffect(() => {
        const interval = setInterval(() => {
            const id = Date.now();
            const angle = Math.random() * Math.PI * 2;
            const distance = 140; 
            const startX = Math.cos(angle) * distance;
            const startY = Math.sin(angle) * distance;
            
            const endX = Math.cos(angle) * SAFE_ZONE_RADIUS;
            const endY = Math.sin(angle) * SAFE_ZONE_RADIUS;

            setThreats(prev => [...prev, { id, startX, startY, endX, endY, angle }]);

            setTimeout(() => {
                setThreats(prev => prev.filter(t => t.id !== id));
            }, 2000); 
        }, 600); 
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-[100px] h-[100px] rounded-full border border-emerald-500/30 bg-emerald-900/5 flex items-center justify-center z-10 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                 <div className="relative z-20 w-10 h-10 bg-black/80 rounded-xl border border-emerald-500/50 flex items-center justify-center">
                    <Lock size={18} className="text-emerald-400" />
                </div>
            </div>

            <AnimatePresence>
                {threats.map(threat => (
                    <motion.div
                        key={threat.id}
                        initial={{ x: threat.startX, y: threat.startY, opacity: 1, scale: 1 }}
                        animate={{ 
                            x: [threat.startX, threat.endX, threat.endX], 
                            y: [threat.startY, threat.endY, threat.endY], 
                            opacity: [1, 1, 0], 
                            scale: [1, 1, 0]
                        }} 
                        transition={{ 
                            duration: 1.2, 
                            times: [0, 0.6, 1], 
                            ease: "circOut" 
                        }}
                        className="absolute w-1.5 h-1.5 bg-red-500 rounded-sm shadow-[0_0_10px_#ef4444] z-20"
                        style={{ rotate: threat.angle * (180/Math.PI) }}
                    >
                         <motion.div 
                            animate={{ opacity: [0, 1, 0], scale: [1, 3, 0] }}
                            transition={{ delay: 0.72, duration: 0.2 }}
                            className="absolute inset-0 bg-white rounded-full"
                         />
                    </motion.div>
                ))}
            </AnimatePresence>
            
            <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute w-[100px] h-[100px] rounded-full border border-emerald-500/50"
            />
        </div>
    );
}


// ------------------------------------------------------------------
// PART 3: COMMAND TERMINAL (FIXED EXTENSION ERRORS)
// ------------------------------------------------------------------

function CommandTerminal() {
    const router = useRouter(); 
    const [lines, setLines] = useState([
        { type: 'log', text: 'Gaprio Core v2.4...' },
        { type: 'success', text: '✓ Connected' },
        { type: 'cmd', text: 'Start session' },
        { type: 'ai', text: 'Agent Active. Waiting...' }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [lines]);

    const handleEnter = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            // 1. Show User Command
            setLines(prev => [...prev, { type: 'cmd', text: input }]);
            setInput('');

            // 2. Show "Processing..."
            setTimeout(() => {
                setLines(prev => [...prev, { type: 'ai', text: 'Processing request...' }]);

                // 3. Show CLICKABLE Link (No auto redirect)
                setTimeout(() => {
                    setLines(prev => [...prev, { 
                        type: 'link', 
                        text: 'Click here to get started ->', 
                        url: '/register' 
                    }]);
                }, 1000);

            }, 600);
        }
    }

    return (
        <div className="h-full bg-[#0c0c0e] border border-white/10 rounded-xl flex flex-col font-mono text-xs md:text-sm overflow-hidden shadow-2xl relative w-full">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/5">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                <span className="ml-auto text-zinc-600 text-[10px] font-bold tracking-widest">TERMINAL</span>
            </div>

            <div ref={scrollRef} className="flex-1 p-4 space-y-2 overflow-y-auto">
                {lines.map((l, i) => (
                    <div key={i} className={`flex gap-3 ${
                        l.type === 'cmd' ? 'text-white font-bold' : 
                        l.type === 'success' ? 'text-emerald-400' : 
                        l.type === 'ai' ? 'text-orange-400' : 
                        l.type === 'link' ? 'text-blue-400' : 'text-zinc-500'
                    }`}>
                        <span className="shrink-0 opacity-50">
                            {l.type === 'cmd' ? '>' : l.type === 'ai' ? '*' : l.type === 'link' ? '?' : '#'}
                        </span>
                        
                        {/* CHECK: If type is 'link', render a button */}
                        {l.type === 'link' ? (
                            <button 
                                onClick={() => router.push(l.url)} 
                                className="text-orange-500 hover:text-orange-400 hover:underline text-left transition-colors cursor-pointer"
                            >
                                {l.text}
                            </button>
                        ) : (
                            <span>{l.text}</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-3 bg-zinc-900/80 border-t border-white/5 backdrop-blur-md">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Command size={12} className="text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                    </div>
                    <input 
                        suppressHydrationWarning={true}
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleEnter}
                        className="w-full bg-[#050505] border border-zinc-700 text-white rounded-lg py-2 pl-9 pr-9 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder-zinc-600 text-xs md:text-sm"
                        placeholder="Type to start..."
                    />
                    <button 
                        suppressHydrationWarning={true}
                        className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-white transition-colors"
                    >
                        <Send size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- SHARED ---

function LiveSpectrum() {
    return (
        <div className="w-full h-full flex items-end justify-between gap-1 pb-0 px-2">
            {[...Array(40)].map((_, i) => (
                <Bar key={i} />
            ))}
        </div>
    );
}

function Bar() {
    const [config, setConfig] = useState({
        height: "50%",
        duration: 4
    });

    useEffect(() => {
        setConfig({
            height: Math.floor(Math.random() * 80) + 20 + "%",
            duration: Math.random() * 3 + 3
        });
    }, []);

    return (
        <motion.div 
            className="w-full bg-indigo-500 rounded-t-[1px] opacity-60"
            animate={{ 
                height: ["20%", config.height, "20%"] 
            }}
            transition={{ 
                duration: config.duration, 
                repeat: Infinity, 
                ease: "easeInOut",
                repeatType: "mirror" 
            }}
        />
    );
}


function BentoCard({ children, className }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-3xl border border-white/10 bg-[#09090b] shadow-2xl overflow-hidden hover:border-white/20 transition-all duration-300 ${className}`}
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      {children}
    </motion.div>
  );
}