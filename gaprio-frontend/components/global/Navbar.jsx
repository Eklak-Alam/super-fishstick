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

  // Define your navigation links here
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 md:pt-6 px-4 pointer-events-none"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.nav
          layout
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className={`pointer-events-auto relative flex items-center justify-between transition-all duration-500 ease-out
            ${scrolled 
              ? "w-full md:w-[600px] bg-[#0a0a0a]/80 border border-white/10 shadow-2xl backdrop-blur-xl rounded-2xl md:rounded-full py-2 px-4 md:py-3 md:px-6" 
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
                    className="object-contain"
                    priority
                />
            </div>
          </Link>

          {/* --- Desktop Links --- */}
          <div className={`hidden md:flex items-center gap-8 text-sm font-medium transition-all duration-300 ${scrolled ? 'opacity-100' : 'opacity-100'}`}>
            {navLinks.map((item) => (
              <Link key={item.name} href={item.href} className="text-gray-400 hover:text-white transition-colors relative group">
                {item.name}
                {/* Hover Dot Effect */}
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-white group-hover:w-1/2 group-hover:left-1/4 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* --- Desktop CTA --- */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white px-2 transition-colors">
                Log in
            </Link>
            
            <Link href="/register">
                <motion.button
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full text-xs font-bold cursor-pointer transition-shadow"
                >
                <span>Get Started</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </Link>
          </div>

          {/* --- Mobile Menu Toggle --- */}
          <button 
            className="md:hidden text-white p-2 z-50"
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
            className="fixed inset-0 z-[90] bg-[#020202]/95 backdrop-blur-xl pt-32 px-6 md:hidden flex flex-col gap-8 h-screen"
          >
            {/* Links */}
            <div className="flex flex-col gap-6">
              {navLinks.map((item) => (
                <Link 
                    key={item.name} 
                    href={item.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl font-bold text-white hover:text-gray-300 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="h-px w-full bg-white/10" />

            {/* Actions */}
            <div className="flex flex-col gap-4 mt-auto mb-10">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-center w-full py-4 text-gray-300 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                Log in
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-center w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}