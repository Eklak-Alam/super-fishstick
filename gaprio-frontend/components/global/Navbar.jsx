'use client';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Integration', href: '/integration' },
    { name: 'Features', href: '/features' },
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
              ? "w-full md:w-[850px] bg-[#050505]/80 border border-white/10 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl rounded-2xl md:rounded-full py-3 px-5 md:px-6" 
              : "w-full max-w-7xl bg-transparent border-transparent py-4 px-6"
            }`}
        >
          {/* --- 1. Brand (Left) --- */}
          {/* We use flex-1 to ensure spacing balance with the right side */}
          <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/logo1.png"
                  alt="Gaprio Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {/* Text fades out on scroll */}
              <span className={`font-bold text-white tracking-tight text-lg transition-all duration-300 
                ${scrolled ? 'opacity-0 -translate-x-4 hidden md:block' : 'opacity-100 translate-x-0'}`}>
                Gaprio
              </span>
            </Link>
          </div>

          {/* --- 2. Links (Absolute Center) --- */}
          {/* Absolute positioning guarantees true center relative to the container */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-1">
              {navLinks.map((item) => (
                <Link key={item.name} href={item.href} className="relative group px-4 py-2">
                  <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors relative z-10">
                    {item.name}
                  </span>
                  {/* Subtle hover background pill */}
                  <span className="absolute inset-0 bg-white/5 rounded-full scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out -z-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* --- 3. Actions (Right) --- */}
          <div className="flex-1 flex items-center justify-end gap-4">
            
            {/* The "White Button" */}
            <Link 
              href="/register"
              className="hidden md:flex relative group overflow-hidden rounded-full py-2.5 px-5 bg-white text-black transition-all duration-300 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2 text-sm font-bold tracking-tight">
                Get Started 
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </span>
              {/* Button Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out] bg-gradient-to-r from-transparent via-black/5 to-transparent z-0" />
            </Link>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </motion.nav>
      </motion.header>

      {/* --- Mobile Menu Overlay (Standardized & Professional) --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-black/60 md:hidden"
            onClick={() => setMobileMenuOpen(false)} // Close on click outside
          >
            <motion.div
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 30, stiffness: 300 }}
               className="absolute right-0 top-0 bottom-0 w-full sm:w-[350px] bg-[#09090b] border-l border-white/10 shadow-2xl p-6 pt-24 flex flex-col h-full"
               onClick={(e) => e.stopPropagation()} // Prevent close when clicking content
            >
              {/* Mobile Links List */}
              <div className="flex flex-col gap-2">
                {navLinks.map((item, i) => (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                  >
                    <span className="text-lg font-medium text-zinc-300 group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                    <ChevronRight size={16} className="text-zinc-600 group-hover:text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                ))}
              </div>

              {/* Mobile Footer Action */}
              <div className="mt-auto pt-6 border-t border-white/10">
                <Link 
                  href="/register" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center justify-center w-full py-4 bg-white text-black font-bold rounded-xl active:scale-95 transition-all text-base gap-2"
                >
                  Get Started Now <ArrowRight size={18} />
                </Link>
                
                <p className="text-center text-zinc-600 text-xs mt-6">
                  &copy; 2024 Gaprio Inc.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}