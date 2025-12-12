'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({ type, placeholder, value, onChange, name, icon: Icon, required }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors z-10">
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
        className={`w-full bg-[#050505] border border-white/10 rounded-xl py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all duration-300 ${Icon ? 'pl-12' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'}`}
      />

      {/* Password Toggle Eye */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors z-10 p-1"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}

      {/* Glow Effect */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-purple-500/5 opacity-0 group-focus-within:opacity-100 blur-lg transition-opacity duration-300" />
    </div>
  );
}