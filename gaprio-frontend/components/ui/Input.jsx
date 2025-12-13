'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({ type, placeholder, value, onChange, name, icon: Icon, required }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative group">
      {/* Icon */}
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors duration-300 z-10">
          <Icon size={18} />
        </div>
      )}
      
      <motion.input
        whileFocus={{ scale: 1.01 }}
        type={isPassword && showPassword ? 'text' : type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full bg-[#050505] border border-white/10 rounded-xl py-3.5 text-white placeholder-zinc-600 
          focus:outline-none focus:border-orange-500/50 focus:bg-[#0a0a0a] focus:shadow-[0_0_20px_-5px_rgba(249,115,22,0.1)]
          transition-all duration-300 
          ${Icon ? 'pl-12' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'}`}
      />

      {/* Password Toggle Eye */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors z-10 p-1"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}

      {/* Ambient Orange Glow on Focus */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-orange-500/5 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500" />
    </div>
  );
}