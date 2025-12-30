"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Twitter,
  Instagram,
  ArrowUpRight,
  ArrowUp,
  Linkedin,
  Mail // Added Mail icon
} from "lucide-react";

// Register GSAP Plugin safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicFooter() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // GSAP Animation only for Desktop (min-width: 1024px)
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const track = trackRef.current;
      
      // Calculate scroll amount: Total Width - One Viewport
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,           
          scrub: 1,            
          start: "top top",
          end: "+=3000",       
          invalidateOnRefresh: true, 
        },
      });

      tl.to(track, {
        x: getScrollAmount,
        ease: "none", 
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative bg-[#020202] text-white overflow-hidden lg:h-screen z-50 flex flex-col"
    >
      
      {/* ================= BACKGROUND LAYERS ================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
        
        {/* 1. BOTTOM HORIZON GLOW (Subtle, from bottom only) */}
        <div className="absolute bottom-[-20%] left-[-10%] right-[-10%] h-[50vh] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-900/20 via-[#050505] to-transparent blur-[60px]" />

        {/* 2. SCI-FI GRID (With fade-out mask) */}
        <div 
          className="absolute inset-0 bg-[size:60px_60px] opacity-[0.15] mix-blend-overlay"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            maskImage: 'radial-gradient(circle at 50% 100%, black 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 100%, black 30%, transparent 80%)'
          }}
        />

        {/* 3. NOISE TEXTURE (Film grain feel) */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay pointer-events-none" />
      </div>

      {/* ================= SCROLL TRACK ================= */}
      <div ref={trackRef} className="flex flex-col lg:flex-row lg:h-full lg:w-max relative z-10">
        
        {/* === SECTION 1: HERO BRANDING (Desktop Only) === */}
        <section className="hidden lg:flex w-screen h-screen flex-col justify-center items-center relative shrink-0 border-r border-white/5 backdrop-blur-[1px]">
          
          {/* Vertical Line Decoration */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent" />

          <div className="relative z-10 flex flex-col items-center w-full px-10">
            {/* BIG HERO IMAGE */}
            <div className="relative w-full max-w-[1400px] h-[60vh] max-h-[500px] flex items-center justify-center">
              <Image
                src="/logo2.png"
                alt="Gaprio"
                fill
                priority
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </section>


        {/* === SECTION 2: CONTENT & LINKS === */}
        <section className="w-full lg:w-screen lg:h-screen flex items-center shrink-0 bg-transparent lg:border-l border-white/5 relative py-24 lg:py-0">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
                
                {/* GRID CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 mb-20">
                    
                    {/* LEFT COL: Small Logo & Socials */}
                    <div className="lg:col-span-5 flex flex-col items-start justify-center">
                          {/* Mobile/Tablet Logo View */}
                          <div className="mb-10 relative h-16 w-64 lg:h-20 lg:w-80">
                            <Image
                                src="/logo2.png"
                                alt="Gaprio Logo"
                                fill
                                className="object-contain object-left"
                            />
                         </div>

                        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-md mb-8 font-light text-pretty">
                            The central nervous system for your enterprise. We connect your fragmented tools into one intelligent workflow.
                        </p>
                        
                        {/* --- ADDED EMAIL SECTION --- */}
                        <div className="mb-8 flex items-center gap-3 group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-orange-400 group-hover:bg-orange-500/10 transition-colors duration-300">
                                <Mail size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Contact Us</span>
                                <a href="mailto:contact@gaprio.in" className="text-lg text-white font-medium hover:text-orange-400 transition-colors">
                                    contact@gaprio.in
                                </a>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <SocialLink Icon={Twitter} href="https://x.com/Gaprio_Labs" />
                            <SocialLink Icon={Instagram} href="https://instagram.com/gaprio_labs" />
                            <SocialLink Icon={Linkedin} href="#" />
                        </div>
                    </div>

                    {/* RIGHT COL: Navigation Links */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-16 items-start lg:items-center">
                        
                        <div className="flex flex-col gap-8">
                            <h4 className="text-orange-500 font-bold tracking-[0.15em] text-xs uppercase opacity-80">Platform</h4>
                            <ul className="space-y-5">
                                <FooterLink>Intelligence</FooterLink>
                                <FooterLink>Workflows</FooterLink>
                                <FooterLink>Integrations</FooterLink>
                                <FooterLink>Pricing</FooterLink>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-8">
                            <h4 className="text-orange-500 font-bold tracking-[0.15em] text-xs uppercase opacity-80">Legal</h4>
                            <ul className="space-y-5">
                                <FooterLink>Privacy Policy</FooterLink>
                                <FooterLink>Terms of Service</FooterLink>
                                <FooterLink>Security</FooterLink>
                                <FooterLink>Cookie Settings</FooterLink>
                            </ul>
                        </div>
                        
                        {/* Empty col for spacing/future use */}
                        <div className="hidden sm:block"></div>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-white/10 pt-8 mt-4">
                  <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
                    {/* Copyright */}
                    <p className="text-zinc-600 text-xs uppercase tracking-widest font-semibold">
                      © {new Date().getFullYear()} Gaprio Inc. All Rights Reserved.
                    </p>

                    {/* Back to Top */}
                    <button
                      onClick={scrollToTop}
                      className="group flex items-center gap-3 text-zinc-400 hover:text-orange-400 transition-colors duration-300"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest">Back to Top</span>
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-orange-500/50 group-hover:bg-orange-500/10 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                        <ArrowUp size={16} className="transition-transform duration-300 group-hover:-translate-y-1" />
                      </div>
                    </button>
                  </div>
                </div>

            </div>
        </section>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FooterLink({ children }) {
  return (
    <li>
      <Link href="#" className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all duration-300 text-base font-medium">
        <span className="relative overflow-hidden">
            {children}
            <span className="absolute left-0 bottom-0 w-full h-[1px] bg-orange-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
        </span>
        <ArrowUpRight size={14} className="opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-orange-500" />
      </Link>
    </li>
  );
}

function SocialLink({ Icon, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-full bg-zinc-900/50 border border-white/10 flex items-center justify-center text-zinc-400 
      hover:text-white hover:border-orange-500 hover:bg-zinc-900
      hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:-translate-y-1 transition-all duration-300"
    >
      <Icon size={18} />
    </a>
  );
}






// "use client";

// import React, { useEffect, useRef } from "react";
// import Link from "next/link";
// import Image from "next/image"; // Added Image import
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import {
//   Twitter,
//   Instagram,
//   ArrowUpRight,
//   ArrowUp,
//   Linkedin,
// } from "lucide-react";

// // Register GSAP Plugin
// if (typeof window !== "undefined") {
//     gsap.registerPlugin(ScrollTrigger);
// }

// export default function CinematicFooter() {
//   const containerRef = useRef(null);
//   const trackRef = useRef(null);

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   useEffect(() => {
//     // GSAP Animation only for Desktop (min-width: 1024px)
//     let mm = gsap.matchMedia();

//     mm.add("(min-width: 1024px)", () => {
//       const track = trackRef.current;
      
//       // Calculate scroll amount: Total Width - One Viewport
//       const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: containerRef.current,
//           pin: true,           
//           scrub: 1,            
//           start: "top top",
//           end: "+=3000",       
//           invalidateOnRefresh: true, 
//         },
//       });

//       tl.to(track, {
//         x: getScrollAmount,
//         ease: "none", 
//       });
//     });

//     return () => mm.revert();
//   }, []);

//   return (
//     <div 
//       ref={containerRef} 
//       className="relative bg-[#020202] text-white overflow-hidden lg:h-screen z-50 flex flex-col"
//     >
      
//       {/* --- BACKGROUND (Lighting from Bottom) --- */}
//       <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        
//         {/* 1. The Bottom Horizon Glow (Rising from bottom) */}
//         <div className="absolute bottom-[-10%] left-[-10%] right-[-10%] h-[50vh] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-900/30 via-[#050505] to-transparent blur-[80px]" />
        
//         {/* 2. Secondary Amber Wash (Subtle) */}
//         <div className="absolute bottom-0 left-1/4 w-1/2 h-[30vh] bg-amber-700/10 blur-[100px] rounded-full" />

//         {/* 3. Texture Overlay */}
//         <div className="absolute inset-0 opacity-[0.04] bg-[url('/noise.png')] mix-blend-overlay" />
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
//       </div>

//       {/* --- TRACK --- */}
//       <div ref={trackRef} className="flex flex-col lg:flex-row lg:h-full lg:w-max relative z-10">
        
//         {/* === SECTION 1: BRAND INTRO (Desktop Only) === */}
//         <section className="hidden lg:flex w-screen h-screen flex-col justify-center items-center relative shrink-0 border-r border-white/5">
//             <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
            
//             <div className="relative z-10 flex flex-col items-center">
//                 {/* THE TEXT: Standard Professional Gradient (Metallic)
//                    From White -> Zinc-300 -> Zinc-600.
//                    It looks premium without being overwhelmingly colorful.
//                 */}
//                 <h1 className="font-black tracking-tighter text-transparent bg-clip-text 
//                                bg-gradient-to-b from-white via-zinc-400 to-zinc-900
//                                text-[24vw] leading-[0.85] select-none text-center drop-shadow-2xl 
//                                p-12 filter contrast-125">
//                     GAPRIO
//                 </h1>
//             </div>
//         </section>

//         {/* === SECTION 2: CONTENT === */}
//         <section className="w-full lg:w-screen lg:h-screen flex items-center shrink-0 bg-transparent border-l border-white/10 relative py-20 lg:py-0">
//             <div className="w-full max-w-7xl mx-auto px-6 md:px-10">
                
//                 {/* MAIN GRID */}
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
                    
//                     {/* 1. BRAND COLUMN (Left) */}
//                     <div className="lg:col-span-5 flex flex-col items-start justify-center">
                         
//                          {/* LOGO REPLACEMENT */}
//                          <div className="mb-8 relative">
//                             <Image
//                                 src="/logo2.png"
//                                 alt="Gaprio Logo"
//                                 width={600}
//                                 height={180}
//                                 priority
//                                 className="object-contain h-10 sm:h-8 md:h-8 lg:h-10 xl:h-12 w-auto"
//                             />
//                         </div>

//                         <p className="text-zinc-400 text-lg leading-relaxed max-w-md mb-8 font-light">
//                             The central nervous system for your enterprise. We connect your fragmented tools into one intelligent workflow.
//                         </p>

//                         <div className="flex gap-4">
//                             <SocialLink Icon={Twitter} href="https://x.com/Gaprio_Labs" />
//                             <SocialLink Icon={Instagram} href="https://instagram.com/gaprio_labs" />
//                             <SocialLink Icon={Linkedin} href="#" />
//                         </div>
//                     </div>

//                     {/* 2. LINKS COLUMNS (Right) */}
//                     <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 mt-4 lg:mt-0 items-center">
                        
//                         <div className="flex flex-col gap-6">
//                             <h4 className="text-orange-500 font-bold tracking-wide text-xs uppercase opacity-90">Platform</h4>
//                             <ul className="space-y-4">
//                                 <FooterLink>Intelligence</FooterLink>
//                                 <FooterLink>Workflows</FooterLink>
//                                 <FooterLink>Integrations</FooterLink>
//                                 <FooterLink>Pricing</FooterLink>
//                             </ul>
//                         </div>

//                         <div className="flex flex-col gap-6">
//                             <h4 className="text-orange-500 font-bold tracking-wide text-xs uppercase opacity-90">Legal</h4>
//                             <ul className="space-y-4">
//                                 <FooterLink>Privacy Policy</FooterLink>
//                                 <FooterLink>Terms of Service</FooterLink>
//                                 <FooterLink>Security</FooterLink>
//                                 <FooterLink>Cookie Settings</FooterLink>
//                             </ul>
//                         </div>
                        
//                         <div className="hidden md:block"></div>
//                     </div>
//                 </div>

//                 {/* BOTTOM BAR */}
//                 <div className="border-t border-white/10 pt-6">
//   <div className="
//     flex flex-col items-center gap-4
//     md:flex-row md:justify-between
//   ">
//     {/* Copyright */}
//     <p className="
//       text-zinc-500 text-xs
//       uppercase tracking-widest font-medium
//       text-center md:text-left
//     ">
//       © {new Date().getFullYear()} Gaprio Inc.
//     </p>

//     {/* Back to Top */}
//     <button
//       onClick={scrollToTop}
//       className="
//         group
//         flex items-center gap-3
//         text-zinc-400
//         hover:text-orange-400
//         transition-colors duration-300
//       "
//     >
//       <span className="text-xs font-semibold uppercase tracking-wider">
//         Back to Top
//       </span>

//       <div
//         className="
//           w-11 h-11
//           rounded-full
//           bg-white/5
//           border border-white/10
//           flex items-center justify-center
//           transition-all duration-300
//           group-hover:border-orange-400
//           group-hover:bg-orange-500/10
//         "
//       >
//         <ArrowUp
//           size={16}
//           className="transition-transform duration-300 group-hover:-translate-y-0.5"
//         />
//       </div>
//     </button>
//   </div>
// </div>


//             </div>
//         </section>

//       </div>
//     </div>
//   );
// }

// // --- SUB-COMPONENTS ---

// function FooterLink({ children }) {
//   return (
//     <li>
//       <Link href="#" className="group flex items-center gap-1 text-zinc-500 hover:text-white transition-colors text-base font-medium">
//         <span>{children}</span>
//         <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-orange-500" />
//       </Link>
//     </li>
//   );
// }

// function SocialLink({ Icon, href }) {
//   return (
//     <a
//       href={href}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 
//       hover:text-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-600 hover:border-orange-500 
//       hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-110 active:scale-95 transition-all duration-300"
//     >
//       <Icon size={20} />
//     </a>
//   );
// }