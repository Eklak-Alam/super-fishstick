'use client';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 px-4 pointer-events-none"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.nav
        layout
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className={`pointer-events-auto relative flex items-center justify-between
          ${scrolled 
            ? "w-full md:w-[600px] bg-[#0a0a0a]/80 border border-white/10 shadow-2xl backdrop-blur-xl rounded-2xl md:rounded-full py-3 px-6" 
            : "w-full max-w-7xl bg-transparent border-transparent py-4 px-0"
          }`}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg">G</div>
          <span className={`font-bold text-lg tracking-tight ${scrolled ? 'hidden md:block' : 'block text-white'}`}>Gaprio</span>
        </Link>

        {/* Links (Desktop) */}
        <div className={`hidden md:flex items-center gap-6 text-sm font-medium transition-all ${scrolled ? 'opacity-100' : 'opacity-100'}`}>
          <Link href="#" className="text-gray-400 hover:text-white transition-colors">Product</Link>
          <Link href="#" className="text-gray-400 hover:text-white transition-colors">Solutions</Link>
          <Link href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white px-2">Log in</Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-xs font-bold"
          >
            <span>Start</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.nav>
    </motion.header>
  );
}