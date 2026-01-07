"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Instagram, Twitter, Linkedin, Facebook } from "lucide-react";

export default function CinematicFooter() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: 'How It Works', href: '/integration' },
    { label: 'Platforms', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Team', href: '#team' },
  ];


  return (
    <footer className="relative w-full bg-black text-white overflow-hidden pt-10 pb-8 px-6 md:px-12 lg:px-20 border-t border-white/5">
      
      {/* --- FLASHY BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        
        {/* 1. Deep Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-[#000000] to-[#000000]" />

        {/* 2. The "Flashy" Orange Glow from Bottom */}
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[600px] 
                        bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
                        from-orange-600/40 via-orange-900/10 to-transparent 
                        blur-[100px] mix-blend-screen" />
        
        {/* 3. Intense Amber Hotspot behind the text */}
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[40%] h-[300px] 
                        bg-orange-600/20 blur-[80px] rounded-full mix-blend-lighten" />

        {/* 4. Cinematic Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" 
             style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 flex flex-col justify-between min-h-[600px]">
        
        {/* === TOP SECTION: Headlines & Nav === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0 w-full mb-20">
          
          {/* LEFT: Heading & Email */}
          <div className="flex flex-col items-start max-w-2xl">
            {/* Animated Pill Label */}
            <div className="flex items-center gap-3 mb-8 group cursor-default">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75 duration-1000"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
               <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] group-hover:text-orange-400 transition-colors duration-300">
                 Get in touch
               </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-[0.95] tracking-tight text-white mb-12">
              <span className="block text-white transition-colors duration-700">Ready to start?</span>
              <span className="block mt-2 bg-gradient-to-br from-white via-white to-zinc-500 bg-clip-text">
                Let's scale together.
              </span>
            </h2>

            <div className="mt-auto">
              <a 
                href="mailto:contact@gaprio.in" 
                className="group relative flex items-center gap-3 text-xl md:text-2xl text-zinc-300 hover:text-white transition-all duration-500"
              >
                {/* Text underline animation */}
                <span className="relative z-10">
                    contact@gaprio.in
                    <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-gradient-to-r from-orange-500 to-amber-300 transition-all duration-300 group-hover:w-full"></span>
                </span>
                
                {/* Arrow Circle Animation */}
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 overflow-hidden group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all duration-500">
                    <ArrowUpRight className="w-5 h-5 text-white absolute transition-all duration-300 group-hover:translate-x-5 group-hover:-translate-y-5" />
                    <ArrowUpRight className="w-5 h-5 text-orange-400 absolute -translate-x-5 translate-y-5 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>
              </a>
            </div>
          </div>

          {/* RIGHT: Navigation with "Liquid" Hover Effects */}
          <div className="flex flex-col justify-end items-start lg:items-end">
            <nav className="flex flex-col items-start lg:items-end gap-3">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="group relative text-3xl md:text-4xl font-light tracking-tight py-1"
                >
                  {/* Text */}
                  <span className="
                    relative z-10 block text-zinc-400
                    transition-all duration-500
                    group-hover:bg-clip-text
                    group-hover:text-transparent
                    group-hover:bg-gradient-to-r
                    group-hover:from-orange-400
                    group-hover:to-amber-300
                  ">
                    {label}
                  </span>

                  {/* Underline */}
                  <span className="
                    absolute left-0 bottom-0 h-[2px] w-0
                    bg-gradient-to-r from-orange-400 to-amber-300
                    transition-all duration-500 ease-out
                    group-hover:w-full
                  " />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* 2. MIDDLE SECTION: LOGO + BIG TEXT */}
        <div className="w-full border-t border-white/10 border-b border-white/10 py-10 md:py-16 relative flex items-center justify-center overflow-hidden">
            
            {/* Container for Logo + Text to sit side-by-side */}
            <div className="flex items-center justify-center gap-4 md:gap-8 lg:gap-12 w-full max-w-[90vw]">
                
                {/* YOUR LOGO (Left Side, Full Opacity) */}
                <div className="relative w-[13vw] h-[13vw] md:w-[13vw] md:h-[13vw] shrink-0">
                    <Image 
                        src="/logo1.png" 
                        alt="Gaprio Logo" 
                        fill 
                        className="object-contain" // Orange glow behind logo
                    />
                </div>

                {/* BIG TEXT (Right Side) */}
                <h1 className="text-[14vw] md:text-[15vw] leading-[0.8] font-black tracking-tighter text-white select-none drop-shadow-2xl">
                  GAPRIO
                </h1>
            </div>
        </div>

        {/* 3. BOTTOM BAR */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center pt-8 gap-6 md:gap-0 opacity-80">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-medium">
            &copy; {currentYear} Gaprio Inc.
          </p>

          <div className="flex items-center gap-8">
             <Link href="#" className="text-zinc-500 text-xs uppercase tracking-widest hover:text-orange-400 transition-colors">Privacy</Link>
             <Link href="#" className="text-zinc-500 text-xs uppercase tracking-widest hover:text-orange-400 transition-colors">Terms</Link>
             
             <div className="flex items-center gap-5 pl-5 border-l border-zinc-800">
                <SocialIcon Icon={Linkedin} />
                <SocialIcon Icon={Twitter} />
                <SocialIcon Icon={Instagram} />
             </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

// Helper Component
function SocialIcon({ Icon }) {
  return (
    <a 
      href="#" 
      className="text-zinc-400 hover:text-orange-500 transition-colors duration-300 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]"
    >
      <Icon size={18} />
    </a>
  );
}