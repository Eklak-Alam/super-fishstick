'use client';
import { motion } from 'framer-motion';

export default function Button({ children, onClick, className = "", variant = "primary", disabled }) {
  const baseStyle = "group relative px-6 py-3 rounded-xl font-medium text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Primary: A rich gradient orange with a 'bottom lip' shadow for depth
    primary: `
      bg-gradient-to-b from-orange-500 to-orange-600 
      text-white 
    `,
    // Outline: Glassmorphism with a subtle orange hover tint
    outline: `
      bg-white/5 border border-white/10 text-gray-300 
      hover:bg-white/10 hover:text-white hover:border-orange-500/30 
      backdrop-blur-sm
    `,
  };

  return (
    <motion.button
      whileHover={!disabled ? { y: -1 } : {}}
      whileTap={!disabled ? { y: 1, scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {/* Optional: Add a subtle shine effect on hover for primary */}
      {variant === 'primary' && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}