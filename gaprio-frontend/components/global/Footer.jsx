'use client';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Linkedin, Github, ArrowRight, ArrowUp } from 'lucide-react';

export default function Footer() {
  const targetRef = useRef(null);

  // 1. Setup Scroll Hook
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end end"], 
  });

  // 2. Heavy Spring Physics for that "Premium" feel
  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.1,
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  // 3. Transform: Slides the track to the left
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-50%"]);

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // Height 250vh gives enough scroll distance without being too long
    <section ref={targetRef} className="relative h-[250vh] bg-[#020202]" suppressHydrationWarning>
      
      {/* STICKY CONTAINER 
         - overflow-hidden: CRITICAL! This stops the horizontal scrollbar from appearing.
         - h-screen: Ensures it fills the viewport while you scroll through the 250vh parent.
      */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        
        {/* THE TRACK: 200vw wide (2 panels x 100vw) */}
        <motion.div style={{ x }} className="flex w-[200vw] h-full">
          
          {/* --- PANEL 1: BRAND REVEAL (Compact) --- */}
          <div className="w-[100vw] h-full relative flex flex-col items-center justify-center bg-[#020202] border-r border-white/5 shrink-0">
              
              {/* Background Ambience */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/10 via-[#020202] to-[#020202]" />
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />

              {/* CONTENT CONTAINER 
                  - py-20: Adds the specific margin/padding you requested.
                  - tight layout: Keeps the text centered without taking up the whole screen height.
              */}
              <div className="relative z-20 flex flex-col items-center justify-center py-20">
                  <h1 className="relative text-[18vw] md:text-[15vw] leading-[0.8] font-black tracking-tighter text-center select-none">
                    
                    {/* Main Text */}
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-800 relative z-10 block">
                        GAPRIO
                    </span>
                    
                    {/* Reflection Effect */}
                    <span className="absolute top-[90%] left-0 w-full text-transparent bg-clip-text bg-gradient-to-b from-white/5 to-transparent scale-y-[-0.4] origin-top blur-[2px] pointer-events-none block">
                        GAPRIO
                    </span>
                  </h1>
                  
                  <p className="mt-8 text-zinc-500 text-sm md:text-xl font-medium tracking-widest uppercase opacity-60">
                      The Neural Core
                  </p>
              </div>
          </div>


          {/* --- PANEL 2: FOOTER LINKS --- */}
          <div className="w-[100vw] h-full flex flex-col justify-center items-center px-6 md:px-20 relative bg-[#020202] shrink-0">
              
              {/* Noise Texture */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
              
              {/* Content Grid */}
              <div className="max-w-7xl w-full grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 relative z-10">
                
                {/* Brand Column */}
                <div className="col-span-2 md:col-span-5 flex flex-col items-start justify-center mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="relative w-8 h-8 md:w-10 md:h-10">
                            <Image src="/logo1.png" alt="Gaprio" fill className="object-contain" />
                        </div>
                        <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">Gaprio</span>
                    </div>
                    <p className="text-zinc-400 text-sm md:text-lg leading-relaxed max-w-sm md:max-w-md mb-6">
                        The AI Operating System for Modern Enterprises. Unifying tools, teams, and workflows.
                    </p>
                    <div className="flex gap-4">
                        <SocialIcon Icon={Twitter} />
                        <SocialIcon Icon={Linkedin} />
                        <SocialIcon Icon={Github} />
                    </div>
                </div>

                {/* Links */}
                <div className="col-span-1 md:col-span-2">
                    <h4 className="font-bold text-white mb-4 md:mb-6 tracking-wide text-sm md:text-base">Product</h4>
                    <ul className="space-y-3 md:space-y-4">
                        <FooterLink>Intelligence</FooterLink>
                        <FooterLink>Integrations</FooterLink>
                        <FooterLink>Enterprise</FooterLink>
                        <FooterLink>Changelog</FooterLink>
                    </ul>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <h4 className="font-bold text-white mb-4 md:mb-6 tracking-wide text-sm md:text-base">Company</h4>
                    <ul className="space-y-3 md:space-y-4">
                        <FooterLink>About</FooterLink>
                        <FooterLink>Careers</FooterLink>
                        <FooterLink>Blog</FooterLink>
                        <FooterLink>Contact</FooterLink>
                    </ul>
                </div>

                {/* Subscribe */}
                <div className="col-span-2 md:col-span-3 mt-4 md:mt-0">
                    <h4 className="font-bold text-white mb-4 md:mb-6 tracking-wide text-sm md:text-base">Subscribe</h4>
                    <div className="flex gap-2">
                        <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white w-full focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-colors" />
                        <button className="p-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors shrink-0">
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
              </div>
              
              {/* Bottom Bar */}
              <div className="absolute bottom-6 left-6 md:left-20 flex flex-col md:flex-row gap-2 md:gap-6 text-[10px] md:text-xs text-zinc-600 uppercase tracking-widest font-medium">
                <span>© {currentYear} Gaprio Inc.</span>
                <div className="flex gap-4">
                    <span>Privacy</span>
                    <span>Terms</span>
                </div>
              </div>

              {/* Scroll Top */}
              <button 
                onClick={scrollToTop}
                className="absolute bottom-6 right-6 md:right-20 group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
              >
                <span className="hidden md:inline text-xs font-medium uppercase tracking-widest">Top</span>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                    <ArrowUp size={18} className="group-hover:-translate-y-1 transition-transform" />
                </div>
              </button>
          </div>

        </motion.div>
      </div>
    </section>
  );
}

// --- SUB-COMPONENTS ---

function FooterLink({ children }) {
    return (
        <li>
            <Link href="#" className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs md:text-sm">
                <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-zinc-700 group-hover:bg-orange-500 transition-colors" />
                {children}
            </Link>
        </li>
    )
}

function SocialIcon({ Icon }) {
    return (
        <a href="#" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-all duration-300 hover:scale-110">
            <Icon size={16} />
        </a>
    )
}