"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { ArrowUpRight, Instagram, Twitter } from "lucide-react";
import { BsLinkedin } from "react-icons/bs";
import { Saira } from "next/font/google";

const saira = Saira({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '900'] 
});

const navLinks = [
  { label: 'Platforms', href: '/integration' },
  { label: 'Features', href: '/features' },
  { label: 'Resources', href: '/resources' },
  { label: 'Team', href: '/financials' }, // or '/about'
];

export default function TitanFooter() {
  const currentYear = new Date().getFullYear();

  return (
    // CHANGE 1: Background is #020202, Removed border-t, single unified block
    <footer className="relative w-full bg-[#020202] text-white min-h-[85vh] flex flex-col justify-between pt-24 pb-8 overflow-hidden font-sans">
      
      {/* =========================================
          1. THE BRAND ARENA
      ========================================= */}
      <div className="flex-grow flex items-center justify-center w-full relative z-10 select-none mb-12 md:mb-0">
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 scale-[0.85] md:scale-100 overflow-visible">
            
            {/* LOGO (Floating Jewel) */}
            <motion.div 
                className="relative w-[18vw] h-[18vw] md:w-[11vw] md:h-[11vw] shrink-0 flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="absolute inset-0 bg-orange-500/20 blur-[60px] rounded-full scale-75 opacity-50" />
                <Image 
                    src="/logo1.png" 
                    alt="Gaprio Logo" 
                    fill 
                    className="object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
                    priority
                />
            </motion.div>

            {/* --- RESPONSIVE TEXT REVEAL --- */}
            
            {/* A. DESKTOP VERSION (Mouse Interactive) - Hidden on Mobile */}
            <div className="hidden md:block">
                <DesktopTextReveal />
            </div>

            {/* B. MOBILE VERSION (Auto-Scanning) - Hidden on Desktop */}
            <div className="block md:hidden">
                <MobileTextReveal />
            </div>

        </div>
      </div>

      {/* =========================================
          2. THE CONTROL PANEL
      ========================================= */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 relative z-20">
        
        {/* REMOVED THE BORDER-T HERE for seamless look */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 pt-12 pb-12 items-start">
            
            {/* LEFT: Heading */}
            <div className="flex flex-col items-start gap-8">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1]">
                    Ready to start? <br />
                    <span className="text-zinc-600">Let's scale together.</span>
                </h2>
                
                <a 
                  href="mailto:contact@gaprio.in" 
                  className="group flex items-center gap-3 text-xl text-zinc-400 hover:text-[#EC9138] transition-colors duration-300"
                >
                   <span className="border-b border-white/10 group-hover:border-[#EC9138] pb-0.5 transition-all">
                     contact@gaprio.in
                   </span>
                   <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>
            </div>

            {/* RIGHT: Navigation */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 md:justify-end md:items-start pt-2">
            {navLinks.map((item) => (
                <Link
                key={item.label}
                href={item.href}
                className="group relative text-lg md:text-xl font-light text-zinc-500 hover:text-white transition-colors duration-300"
                >
                {item.label}
                
                {/* Animated Orange Underline */}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#EC9138] transition-all duration-300 group-hover:w-full" />
                </Link>
            ))}
            </div>
        </div>

        {/* BOTTOM: Footer Meta */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 pb-2 text-xs uppercase tracking-widest text-zinc-700 font-bold">
            <p>&copy; {currentYear} Gaprio Inc.</p>
            
            <div className="flex items-center gap-8">
                <Link href="/" className="hover:text-[#EC9138] transition-colors">Privacy</Link>
                <Link href="/" className="hover:text-[#EC9138] transition-colors">Terms</Link>
                
                <div className="flex items-center gap-4 pl-8 border-l border-white/10">
                    <LiquidSocial Icon={BsLinkedin} link='https://www.linkedin.com/company/gaprio/' />
                    <LiquidSocial Icon={Twitter} link='https://www.instagram.com/gaprio_labs' />
                    <LiquidSocial Icon={Instagram} link='https://x.com/Gaprio_Labs' />
                </div>
            </div>
        </div>

      </div>
    </footer>
  );
}

// ===============================================
// COMPONENT A: DESKTOP TEXT (Mouse Interactive)
// ===============================================
function DesktopTextReveal() {
    const textRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e) => {
        if (!textRef.current) return;
        const rect = textRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <div 
            ref={textRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`relative cursor-crosshair transform scale-x-[1.25] origin-left ml-4 px-8 ${saira.className}`}
        >
            <h1 className="text-[14vw] font-black leading-none tracking-tighter text-transparent" style={{ WebkitTextStroke: "1px #222" }}>
                GAPRIO
            </h1>
            <motion.div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{ opacity: isHovering ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                    maskImage: useTransform([smoothX, smoothY], ([x, y]) => `radial-gradient(circle 250px at ${x}px ${y}px, black, transparent)`),
                    WebkitMaskImage: useTransform([smoothX, smoothY], ([x, y]) => `radial-gradient(circle 250px at ${x}px ${y}px, black, transparent)`)
                }}
            >
                <h1 className="text-[14vw] font-black leading-none tracking-tighter text-transparent bg-clip-text"
                    style={{ backgroundImage: `linear-gradient(135deg, #EC9138 0%, #FFB060 50%, #EC9138 100%)` }}>
                    GAPRIO
                </h1>
            </motion.div>
        </div>
    );
}

// ===============================================
// COMPONENT B: MOBILE TEXT (Auto-Scanning)
// ===============================================
function MobileTextReveal() {
    // This creates an automatic spotlight that moves back and forth
    return (
        <div className={`relative transform scale-x-[1.15] px-4 ${saira.className}`}>
            {/* The Ghost Outline */}
            <h1 className="text-[18vw] font-black leading-none tracking-tighter text-transparent" style={{ WebkitTextStroke: "1px #222" }}>
                GAPRIO
            </h1>

            {/* The Auto-Moving Reveal */}
            <motion.div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{ 
                    // Move the mask position from left (-100%) to right (200%)
                    maskPosition: ["-100% 0", "200% 0"]
                }}
                transition={{ 
                    duration: 4, // 4 seconds per scan
                    repeat: Infinity, 
                    ease: "linear",
                    repeatType: "mirror" // Goes back and forth
                }}
                style={{
                    // CSS Mask that looks like a searchlight beam
                    maskImage: "linear-gradient(90deg, transparent 0%, black 50%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 50%, transparent 100%)",
                    maskSize: "50% 100%", // The beam is 50% width of the text
                    WebkitMaskSize: "50% 100%",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat"
                }}
            >
                <h1 className="text-[18vw] font-black leading-none tracking-tighter text-transparent bg-clip-text"
                    style={{ backgroundImage: `linear-gradient(135deg, #EC9138 0%, #FFB060 50%, #EC9138 100%)` }}>
                    GAPRIO
                </h1>
            </motion.div>
        </div>
    );
}

// --- LIQUID SOCIAL ---
const LiquidSocial = ({ Icon, link }) => {
    return (
        <a href={link} target="_blank" className="group relative w-10 h-10 overflow-hidden rounded-full border border-white/10 flex items-center justify-center bg-white/5">
            <div className="absolute inset-0 bg-[#EC9138] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            <Icon size={16} className="relative z-10 text-zinc-400 group-hover:text-black transition-colors duration-300 group-hover:scale-110" />
        </a>
    )
}