'use client';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // 1. Added this import
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Saira } from 'next/font/google';

// 1. Font Setup
const saira = Saira({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'] 
});

// 2. Mobile Menu Animation Variants
const menuContainerVars = {
  hidden: { x: "100%" },
  show: { 
    x: 0,
    transition: { 
      type: "spring", 
      damping: 30, 
      stiffness: 300,
      staggerChildren: 0.1, 
      delayChildren: 0.2
    }
  },
  exit: { 
    x: "100%",
    transition: { 
      type: "spring", 
      damping: 30, 
      stiffness: 300,
      staggerChildren: 0.05, 
      staggerDirection: -1 
    }
  }
};

const linkItemVars = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0 }
};

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 2. Get current path
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Integration', href: '/integration' },
    { name: 'Enterprise', href: '/enterprise' },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 md:pt-6 px-4 pointer-events-none"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.nav
          layout
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className={`pointer-events-auto relative flex items-center justify-between transition-all duration-500 ease-out
            ${scrolled 
              ? "w-full md:w-[850px] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-2xl md:rounded-full py-3 px-5 md:px-6 ring-1 ring-white/5" 
              : "w-full max-w-7xl bg-transparent border-transparent py-4 px-6"
            }`}
        >
          {/* --- 1. Brand (Left) --- */}
          <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/logo1.png"
                  alt="Gaprio Logo"
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
              <span className={` text-white tracking-tight text-lg transition-all duration-300 ${saira.className}
                ${scrolled ? 'opacity-0 -translate-x-4 hidden md:block' : 'opacity-100 translate-x-0'}`}>
                Gaprio
              </span>
            </Link>
          </div>

          {/* --- 2. Links (Absolute Center) --- */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-1">
              {navLinks.map((item) => {
                // 3. Check if active
                const isActive = pathname === item.href;

                return (
                  <Link key={item.name} href={item.href} className="relative group px-4 py-2">
                    <span className={`text-sm font-medium transition-colors relative z-10 
                      ${isActive ? "text-white" : "text-zinc-300 group-hover:text-white"}`}>
                      {item.name}
                    </span>
                    
                    {/* "Selected" OR "Hover" Effect (Merged logic) */}
                    <span className={`absolute inset-0 bg-white/10 rounded-full transition-all duration-300 ease-out -z-0
                      ${isActive ? "scale-100 opacity-100" : "scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100"}`} 
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* --- 3. Actions (Right) --- */}
          <div className="flex-1 flex items-center justify-end gap-4">
            <Link 
              href="/register"
              className="hidden md:flex items-center gap-2 rounded-full py-2.5 px-6 bg-white text-black text-sm font-bold tracking-tight active:scale-95 transition-transform"
            >
              Get Started 
            </Link>

            {/* --- Hamburger Icon --- */}
            <button 
              className="md:hidden relative z-[100] w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <motion.svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24"
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <motion.path 
                  d="M4 6h16" 
                  animate={mobileMenuOpen ? { d: "M6 18L18 6" } : { d: "M4 6h16" }}
                  transition={{ duration: 0.3 }} 
                />
                <motion.path 
                  d="M4 12h16" 
                  animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }} 
                />
                <motion.path 
                  d="M4 18h16" 
                  animate={mobileMenuOpen ? { d: "M6 6l12 12" } : { d: "M4 18h16" }}
                  transition={{ duration: 0.3 }} 
                />
              </motion.svg>
            </button>
          </div>
        </motion.nav>
      </motion.header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
               variants={menuContainerVars}
               initial="hidden"
               animate="show"
               exit="exit"
               className="absolute right-0 top-0 bottom-0 w-full sm:w-[350px] bg-[#050505] border-l border-white/10 shadow-2xl p-6 pt-24 flex flex-col h-full overflow-hidden"
               onClick={(e) => e.stopPropagation()} 
            >
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-500/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-amber-600/10 rounded-full blur-[60px] pointer-events-none" />

              <div className="flex flex-col gap-4 relative z-10">
                {navLinks.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div key={item.name} variants={linkItemVars}>
                      <Link 
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group flex items-center justify-between p-4 rounded-xl transition-all border active:scale-[0.98]
                          ${isActive 
                             ? "bg-white/10 border-white/10" 
                             : "hover:bg-white/5 border-transparent hover:border-white/5"
                          }`}
                      >
                        <span className={`text-xl font-medium transition-colors ${saira.className} 
                          ${isActive ? "text-white" : "text-zinc-300 group-hover:text-white"}`}>
                          {item.name}
                        </span>
                        <ChevronRight size={20} className={`transition-all 
                          ${isActive ? "text-orange-500 opacity-100" : "text-orange-500/80 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"}`} 
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div variants={linkItemVars} className="mt-auto pt-8 border-t border-white/10 relative z-10">
                <Link 
                  href="/register" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center justify-center w-full py-4 bg-white text-black font-bold rounded-xl active:scale-95 transition-all text-lg gap-2"
                >
                  Get Started <ArrowRight size={20} />
                </Link>
                
                <p className="text-center text-zinc-500 text-xs mt-8">
                  &copy; 2024 Gaprio Inc.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}