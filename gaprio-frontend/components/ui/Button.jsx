'use client';
import { motion } from 'framer-motion';

export default function Button({ children, onClick, className = "", variant = "primary" }) {
  const baseStyle = "px-6 py-3 rounded-xl font-medium relative overflow-hidden transition-all duration-300";
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    outline: "border border-white/20 text-white hover:bg-white/10 backdrop-blur-md",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}