"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUp, ArrowUpRight, Instagram, Twitter } from "lucide-react";
import { BsLinkedin } from "react-icons/bs";
import { Saira } from "next/font/google";

const saira = Saira({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '900'] 
});

const navLinks = [
  { label: 'Privacy', href: '/' },
  { label: 'Terms', href: '/' },
  { label: 'Financials', href: '/financials' },
];

const THEME_ORANGE = "#F97316";

export default function TitanFooter() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-[#020202] text-white min-h-[85vh] flex flex-col justify-between pt-24 pb-8 overflow-hidden font-sans border-t border-white/5">
      
      {/* =========================================
          1. THE BRAND ARENA (CENTERED)
      ========================================= */}
      <div className="flex-grow flex items-center justify-center w-full relative z-10 select-none mb-12 md:mb-0">
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 scale-[0.85] md:scale-100 overflow-visible">
            
            {/* LOGO */}
            <motion.div 
                className="relative w-[18vw] h-[18vw] md:w-[10vw] md:h-[10vw] shrink-0 flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="absolute inset-0 bg-[#F97316]/20 blur-[60px] rounded-full scale-75 opacity-50" />
                <Image 
                    src="/logo1.png" 
                    alt="Gaprio Logo" 
                    fill 
                    className="object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
                    priority
                />
            </motion.div>

            {/* RESPONSIVE TEXT REVEAL */}
            <div className="hidden md:block">
                <DesktopTextReveal />
            </div>
            <div className="block md:hidden">
                <MobileTextReveal />
            </div>

        </div>
      </div>

      {/* =========================================
          2. THE CONTROL PANEL
      ========================================= */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 relative z-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 pt-12 pb-12 items-start border-t border-white/5">
            
            {/* LEFT: Heading */}
            <div className="flex flex-col items-start gap-8">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1]">
                    Ready to start? <br />
                    <span className="text-zinc-600">Let's scale together.</span>
                </h2>
                
                <a 
                  href="mailto:contact@gaprio.in" 
                  className="group flex items-center gap-3 text-xl text-zinc-400 hover:text-[#F97316] transition-colors duration-300"
                >
                    <span className="border-b border-white/10 group-hover:border-[#F97316] pb-0.5 transition-all">
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
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#F97316] transition-all duration-300 group-hover:w-full" />
                </Link>
            ))}
            </div>
        </div>

        {/* BOTTOM: Footer Meta */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 pb-2 border-t border-white/5">
            
            {/* Copyright */}
            <p className="text-xs uppercase tracking-widest text-zinc-700 font-bold">
                &copy; {currentYear} Gaprio Inc.
            </p>
            
            <div className="flex flex-col-reverse md:flex-row items-center gap-8">
                
                {/* --- NEW & IMPROVED BACK TO TOP BUTTON --- */}
                <button 
                    onClick={scrollToTop}
                    className="group flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-900/50 border border-white/10 hover:border-[#F97316] transition-all duration-300 active:scale-95"
                >
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">
                        Back to Top
                    </span>
                    {/* Sliding Arrow Animation */}
                    <div className="relative w-3.5 h-3.5 overflow-hidden">
                        <ArrowUp className="absolute inset-0 w-full h-full text-[#F97316] transition-transform duration-300 group-hover:-translate-y-full" />
                        <ArrowUp className="absolute inset-0 w-full h-full text-[#F97316] translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
                    </div>
                </button>

                {/* Socials */}
                <div className="flex items-center gap-4 pl-0 md:pl-8 md:border-l border-white/10">
                    <LiquidSocial Icon={BsLinkedin} link='https://www.linkedin.com/company/gaprio/' />
                    <LiquidSocial Icon={Twitter} link='https://twitter.com/gaprio_labs' />
                    <LiquidSocial Icon={Instagram} link='https://instagram.com/Gaprio_Labs' />
                </div>
            </div>
        </div>

      </div>
    </footer>
  );
}

// ===============================================
// DESKTOP TEXT (Updated Color #F97316)
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
                    style={{ backgroundImage: `linear-gradient(135deg, #F97316 0%, #FFFFFF 100%)` }}>
                    GAPRIO
                </h1>
            </motion.div>
        </div>
    );
}

// ===============================================
// MOBILE TEXT (Updated Color #F97316)
// ===============================================
function MobileTextReveal() {
    return (
        <div className={`relative transform scale-x-[1.15] px-4 ${saira.className}`}>
            <h1 className="text-[18vw] font-black leading-none tracking-tighter text-transparent" style={{ WebkitTextStroke: "1px #222" }}>
                GAPRIO
            </h1>
            <motion.div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{ maskPosition: ["-100% 0", "200% 0"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
                style={{
                    maskImage: "linear-gradient(90deg, transparent 0%, black 50%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 50%, transparent 100%)",
                    maskSize: "50% 100%",
                    WebkitMaskSize: "50% 100%",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat"
                }}
            >
                <h1 className="text-[18vw] font-black leading-none tracking-tighter text-transparent bg-clip-text"
                    style={{ backgroundImage: `linear-gradient(135deg, #F97316 0%, #FFFFFF 100%)` }}>
                    GAPRIO
                </h1>
            </motion.div>
        </div>
    );
}

// ===============================================
// LIQUID SOCIAL (Updated Color #F97316)
// ===============================================
const LiquidSocial = ({ Icon, link }) => {
    return (
        <a href={link} target="_blank" className="group relative w-10 h-10 overflow-hidden rounded-full border border-white/10 flex items-center justify-center bg-white/5">
            <div className="absolute inset-0 bg-[#F97316] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            <Icon size={16} className="relative z-10 text-zinc-400 group-hover:text-black transition-colors duration-300 group-hover:scale-110" />
        </a>
    )
}