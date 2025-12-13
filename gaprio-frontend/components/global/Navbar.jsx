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
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.nav
          layout
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className={`pointer-events-auto relative flex items-center justify-between transition-all duration-500 ease-out
            ${scrolled 
              ? "w-full md:w-[680px] bg-[#0a0a0a]/80 border border-white/10 hover:border-orange-500/20 shadow-2xl backdrop-blur-xl rounded-2xl md:rounded-full py-2.5 px-5 md:py-3 md:px-8" 
              : "w-full max-w-7xl bg-transparent border-transparent py-4 px-2"
            }`}
        >
          {/* --- Brand --- */}
          <Link href="/" className="flex items-center gap-3 z-50 group">
            <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                    src="/logo.png"
                    alt="Gaprio Logo"
                    fill
                    className="object-contain drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                    priority
                />
            </div>
            <span className={`font-bold text-white tracking-tight transition-opacity duration-300 ${scrolled ? 'md:opacity-0 md:hidden' : 'opacity-100'}`}>
                Gaprio
            </span>
          </Link>

          {/* --- Desktop Links --- */}
          <div className={`hidden md:flex items-center gap-8 text-sm font-medium transition-all duration-300`}>
            {navLinks.map((item) => (
              <Link key={item.name} href={item.href} className="text-zinc-400 hover:text-white transition-colors relative group">
                {item.name}
              </Link>
            ))}
          </div>

          {/* --- Desktop CTA --- */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white px-2 transition-colors">
                Log in
            </Link>
            
            <Link href="/register">
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full text-xs font-bold cursor-pointer shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.5)] transition-shadow"
                >
                <span>Get Started</span>
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
            </Link>
          </div>

          {/* --- Mobile Menu Toggle --- */}
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-[#020202]/95 backdrop-blur-2xl pt-32 px-6 md:hidden flex flex-col gap-8 h-screen"
          >
            {/* Links */}
            <div className="flex flex-col gap-6">
              {navLinks.map((item, i) => (
                <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (i * 0.05) }}
                >
                    <Link 
                        href={item.href} 
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-200 hover:from-orange-400 hover:to-amber-200 transition-all"
                    >
                    {item.name}
                    </Link>
                </motion.div>
              ))}
            </div>

            <div className="h-px w-full bg-white/10" />

            {/* Actions */}
            <div className="flex flex-col gap-4 mt-auto mb-10">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-center w-full py-4 text-zinc-300 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors font-medium">
                Log in
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-center w-full py-4 bg-white text-black font-bold rounded-2xl shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)] transition-all">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}