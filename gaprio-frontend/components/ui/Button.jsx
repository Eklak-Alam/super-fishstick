'use client';
import { motion } from 'framer-motion';

export default function Button({ children, onClick, className = "", variant = "primary" }) {
  
  // --- VARIANT 1: THE ORBIT BEAM (Primary) ---
  // A spinning beam of light travels around the border. 
  // It looks premium, not cartoonish, because the line is thin (1px) and the speed is smooth.
  if (variant === 'primary') {
    return (
      <button 
        onClick={onClick}
        className={`relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-50 group ${className}`}
      >
        {/* The Spinning Gradient Beam (The Moving Border) */}
        <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#f97316_50%,#0000_100%)] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* The Inner Button Content (Dark Core) */}
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#050505] px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors duration-300 group-hover:bg-[#0a0a0a]">
          {children}
        </span>
      </button>
    );
  }

  // --- VARIANT 2: THE MIRROR SHINE (Secondary) ---
  // A "Glass" button where a beam of light reflects across it on hover (Mirror effect).
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative h-12 px-8 rounded-full text-sm font-medium text-zinc-300 border border-white/10 bg-white/5 overflow-hidden group transition-all hover:text-white hover:border-white/20 hover:bg-white/10 ${className}`}
    >
      {/* The Mirror Shine Effect */}
      {/* This gradient sits off-screen (-left-full) and slides across on hover */}
      <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1s_ease-in-out]" />
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}