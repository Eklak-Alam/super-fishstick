'use client';
import { motion } from 'framer-motion';

export default function Input({ type, placeholder, value, onChange, name, icon: Icon }) {
  return (
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors">
          <Icon size={20} />
        </div>
      )}
      <motion.input
        whileFocus={{ scale: 1.01, borderColor: "rgba(168, 85, 247, 0.5)" }}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all duration-300 ${Icon ? 'pl-12 pr-4' : 'px-4'}`}
      />
      {/* Glow Effect on Focus */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-purple-500/20 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-300" />
    </div>
  );
}