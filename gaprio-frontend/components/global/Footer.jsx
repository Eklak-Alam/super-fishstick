'use client';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'; // 1. Import useSpring
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Linkedin, Github, ArrowRight, ArrowUp } from 'lucide-react';

export default function Footer() {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // 2. THE SECRET SAUCE: Spring Physics
  // This creates that heavy, premium "catch-up" effect
  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.1,      // Low mass makes it responsive
    stiffness: 100, // Tautness of the spring
    damping: 20,    // Friction (prevents bouncing)
    restDelta: 0.001
  });

  // 3. Use 'smoothProgress' instead of raw 'scrollYProgress'
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-50%"]);

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#020202]" suppressHydrationWarning>
      
      {/* Sticky Container */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* The Track: Using the smooth spring value here */}
        <motion.div style={{ x }} className="flex w-[200vw]">
          
          {/* --- PANEL 1: THE BRAND REVEAL --- */}
          <div className="w-screen h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#020202] border-r border-white/5 shrink-0">
              
              <div className="absolute bottom-[-10%] md:bottom-[-20%] left-1/2 -translate-x-1/2 w-[90vw] md:w-[80vw] h-[50vh] md:h-[60vh] bg-orange-600/20 blur-[80px] md:blur-[120px] rounded-[100%] pointer-events-none mix-blend-screen" />
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] md:bg-[size:60px_60px] opacity-[0.05] pointer-events-none" />

              <div className="relative z-20 w-full px-4 flex flex-col items-center">
                  <h1 className="relative text-[20vw] leading-[0.8] font-black tracking-tighter text-center select-none w-full max-w-full">
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-900 relative z-10 block">
                        GAPRIO
                    </span>
                    <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-t from-orange-500/40 to-transparent z-20 pointer-events-none mix-blend-overlay block">
                        GAPRIO
                    </span>
                    <span className="absolute top-[100%] left-0 w-full text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent scale-y-[-0.5] origin-top opacity-20 blur-sm pointer-events-none block">
                        GAPRIO
                    </span>
                  </h1>
              </div>
          </div>


          {/* --- PANEL 2: LINKS & SOCIALS --- */}
          <div className="w-screen h-screen flex flex-col justify-center items-center px-6 md:px-20 relative bg-[#020202] shrink-0">
              
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
              <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-900/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

              <div className="max-w-7xl w-full grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 relative z-10">
                
                <div className="col-span-2 md:col-span-5 flex flex-col items-start justify-center mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="relative w-8 h-8 md:w-10 md:h-10">
                            <Image src="/logo1.png" alt="Gaprio" fill className="object-contain" />
                        </div>
                        <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">Gaprio</span>
                    </div>
                    <p className="text-zinc-400 text-sm md:text-lg leading-relaxed max-w-sm md:max-w-md mb-6 md:mb-8">
                        The AI Operating System for Modern Enterprises. Unifying tools, teams, and workflows.
                    </p>
                    <div className="flex gap-4">
                        <SocialIcon Icon={Twitter} />
                        <SocialIcon Icon={Linkedin} />
                        <SocialIcon Icon={Github} />
                    </div>
                </div>

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

                <div className="col-span-2 md:col-span-3 mt-4 md:mt-0">
                    <h4 className="font-bold text-white mb-4 md:mb-6 tracking-wide text-sm md:text-base">Subscribe</h4>
                    <div className="flex gap-2">
                        <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white w-full focus:outline-none focus:border-orange-500/50" />
                        <button className="p-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors shrink-0">
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 md:left-20 flex flex-col md:flex-row gap-2 md:gap-6 text-[10px] md:text-xs text-zinc-600 uppercase tracking-widest font-medium">
                <span>© {currentYear} Gaprio Inc.</span>
                <div className="flex gap-4">
                    <span>Privacy</span>
                    <span>Terms</span>
                </div>
              </div>

              <button 
                onClick={scrollToTop}
                className="absolute bottom-6 right-6 md:right-20 group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
              >
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
        <a href="#" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-all duration-300">
            <Icon size={16} />
        </a>
    )
}