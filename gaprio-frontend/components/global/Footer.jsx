"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Instagram, Twitter, Linkedin } from "lucide-react";
import { BsLinkedin } from "react-icons/bs";

export default function CinematicFooter() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: 'How It Works', href: '/integration' },
    { label: 'Platforms', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Team', href: '#team' },
  ];

  return (
    // CHANGE 1: Used 'min-h-screen' to ensure full height.
    // CHANGE 2: Reduced padding to 'pt-24 md:pt-32' (Just enough safe space for navbar, not huge)
    <footer className="relative w-full bg-black text-white overflow-hidden min-h-screen flex flex-col px-6 md:px-12 lg:px-20 pt-24 md:pt-20 pb-6">
      
      {/* --- FLASHY BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[600px] 
                        bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
                        from-orange-600/40 via-orange-900/10 to-transparent 
                        blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[40%] h-[300px] 
                        bg-orange-600/20 blur-[80px] rounded-full mix-blend-lighten" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" 
             style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      </div>

      {/* --- CONTENT CONTAINER --- */}
      {/* flex-grow allows this container to take up all available space */}
      <div className="relative z-10 flex flex-col flex-grow justify-between">
        
        {/* === TOP SECTION: Headlines & Nav === 
            CHANGE 3: Added 'flex flex-col justify-center flex-grow'. 
            This vertically centers the "Ready to start" text in the middle of the screen.
            It naturally clears the navbar without needing huge padding.
        */}
        <div className="flex flex-col justify-center flex-grow w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 w-full mb-16">
            
            {/* LEFT: Heading & Email */}
            <div className="flex flex-col items-start max-w-2xl">
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[0.95] tracking-tight text-white mb-8 md:mb-12">
                <span className="block text-white transition-colors duration-700">Ready to start?</span>
                <span className="block mt-2 bg-gradient-to-br from-white via-white to-zinc-500 bg-clip-text">
                    Let's scale together.
                </span>
                </h2>

                <div className="mt-2">
                <a 
                    href="mailto:contact@gaprio.in" 
                    className="group relative flex items-center gap-3 text-lg md:text-xl text-zinc-300 hover:text-white transition-all duration-500"
                >
                    <span className="relative z-10">
                        contact@gaprio.in
                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-gradient-to-r from-orange-500 to-amber-300 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/5 overflow-hidden group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all duration-500">
                        <ArrowUpRight className="w-4 h-4 text-white absolute transition-all duration-300 group-hover:translate-x-5 group-hover:-translate-y-5" />
                        <ArrowUpRight className="w-4 h-4 text-orange-400 absolute -translate-x-5 translate-y-5 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
                    </div>
                </a>
                </div>
            </div>

            {/* RIGHT: Navigation - HORIZONTAL ROW */}
            <div className="flex flex-col justify-start lg:justify-end lg:items-end mt-4 lg:mt-0">
                <nav className="flex flex-row flex-wrap gap-x-6 gap-y-2 md:gap-10 lg:gap-12 items-center">
                {navLinks.map(({ label, href }) => (
                    <Link
                    key={label}
                    href={href}
                    className="group relative text-base md:text-lg lg:text-xl font-light tracking-tight py-1"
                    >
                    <span className="relative z-10 block text-zinc-400 transition-all duration-500 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-amber-300">
                        {label}
                    </span>
                    <span className="absolute left-0 bottom-0 h-[1px] w-0 bg-gradient-to-r from-orange-400 to-amber-300 transition-all duration-500 ease-out group-hover:w-full" />
                    </Link>
                ))}
                </nav>
            </div>
            </div>
        </div>

        {/* === BOTTOM SECTION: LOGO ===
            Kept your request for BIG mobile logo/text 
        */}
        <div className="w-full mt-auto mb-8 md:mb-10 relative flex items-center justify-center overflow-hidden">
            <div className="flex items-center justify-center gap-3 md:gap-8 lg:gap-12 w-full max-w-full md:max-w-[90vw]">
                {/* LOGO */}
                <div className="relative w-[14vw] h-[14vw] md:w-[12vw] md:h-[12vw] shrink-0">
                    <Image 
                        src="/logo1.png" 
                        alt="Gaprio Logo" 
                        fill 
                        className="object-contain" 
                    />
                </div>

                {/* TEXT */}
                <h1 className="text-[16vw] md:text-[13vw] leading-[0.8] font-black tracking-tighter text-white select-none drop-shadow-2xl">
                  GAPRIO
                </h1>
            </div>
        </div>

        {/* 3. BOTTOM BAR */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center pt-6 gap-6 md:gap-0">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-medium">
            &copy; {currentYear} Gaprio Inc.
          </p>

          <div className="flex items-center gap-6 md:gap-8">
             <Link href="/" className="text-zinc-600 text-[10px] uppercase tracking-widest hover:text-orange-400 transition-colors">Privacy</Link>
             <Link href="/" className="text-zinc-600 text-[10px] uppercase tracking-widest hover:text-orange-400 transition-colors">Terms</Link>
             
             <div className="flex items-center gap-4 md:gap-5 pl-4 md:pl-5 border-l border-zinc-900">
                <SocialIcon Icon={BsLinkedin} link='https://www.linkedin.com/company/gaprio/' />
                <SocialIcon Icon={Twitter} link='https://www.instagram.com/gaprio_labs?igsh=eTV1N3M0eHZveWN2' />
                <SocialIcon Icon={Instagram} link='https://x.com/Gaprio_Labs' />
             </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

function SocialIcon({ Icon, link }) {
  return (
    <a 
      href={link} 
      target="_blank"
      className="text-zinc-500 hover:text-orange-500 transition-colors duration-300 hover:scale-110"
    >
      <Icon size={16} />
    </a>
  );
}