'use client';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'Integration', href: '#integration' },
    { name: 'Enterprise', href: '#enterprise' },
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
              ? "w-full md:w-[850px] bg-[#050505]/80 border border-white/10 hover:border-orange-500/20 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl rounded-2xl md:rounded-full py-3 px-5 md:px-8" 
              : "w-full max-w-7xl bg-transparent border-transparent py-4 px-6"
            }`}
        >
          {/* --- 1. Brand (Left) --- */}
          <Link href="/" className="flex items-center gap-3 z-50 group min-w-[120px]">
            <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                    src="/logo1.png"
                    alt="Gaprio Logo"
                    fill
                    className="object-contain drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                    priority
                />
            </div>
            {/* Smoothly hide text on scroll for cleaner look */}
            <span className={`font-bold text-white tracking-tight text-lg transition-all duration-300 ${scrolled ? 'opacity-0 -translate-x-4 hidden md:block' : 'opacity-100 translate-x-0'}`}>
                Gaprio
            </span>
          </Link>

          {/* --- 2. Links (Absolute Center) --- */}
          {/* Using absolute positioning ensures they stay dead center regardless of logo/button width */}
          <div className="hidden md:flex items-center justify-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((item) => (
              <Link key={item.name} href={item.href} className="relative group px-4 py-2">
                <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors relative z-10">
                    {item.name}
                </span>
                {/* Minimal Orange Glow Dot on Hover */}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* --- 3. Actions (Right) --- */}
          <div className="hidden md:flex items-center gap-4 min-w-[120px] justify-end">
            
            {/* Clean Login Link */}
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Log in
            </Link>
            
            {/* The "Molten Amber" Button (Distinct from Hero) */}
            <Link href="/register">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group overflow-hidden rounded-full py-2.5 px-6 bg-gradient-to-r from-orange-600 to-amber-700 shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.6)] transition-all duration-300"
                >
                    {/* Shine Effect Overlay */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1s_ease-in-out] bg-gradient-to-r from-transparent via-white/25 to-transparent z-10" />
                    
                    <span className="relative z-20 flex items-center gap-2 text-xs font-bold text-white tracking-wide">
                        Get Started <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                </motion.button>
            </Link>
          </div>

          {/* --- Mobile Toggle --- */}
          <button 
            className="md:hidden text-white p-2 z-50 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </motion.nav>
      </motion.header>

      {/* --- Mobile Menu Overlay --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[90] bg-[#020202]/95 backdrop-blur-3xl pt-32 px-6 md:hidden flex flex-col gap-8 h-screen"
          >
            {/* Mobile Links */}
            <div className="flex flex-col gap-6">
              {navLinks.map((item, i) => (
                <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (i * 0.05), duration: 0.5, ease: "easeOut" }}
                >
                    <Link 
                        href={item.href} 
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-700 hover:from-orange-400 hover:to-amber-200 transition-all duration-500"
                    >
                    {item.name}
                    </Link>
                </motion.div>
              ))}
            </div>

            <div className="h-px w-full bg-white/10" />

            {/* Mobile Actions */}
            <div className="flex flex-col gap-4 mt-auto mb-10">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-center w-full py-4 text-zinc-300 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors font-medium text-lg">
                Log in
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-center w-full py-4 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold rounded-2xl shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)] transition-all text-lg flex items-center justify-center gap-2">
                Get Started <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}