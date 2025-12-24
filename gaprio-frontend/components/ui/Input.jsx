'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  name, 
  icon: Icon, 
  required,
  error 
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="w-full space-y-2 mb-5">
      {/* Label */}
      {label && (
        <div className="flex justify-between items-center px-0.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
            {label} {required && <span className="text-orange-500">*</span>}
          </label>
        </div>
      )}

      <div className="relative group">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors duration-200 pointer-events-none">
            <Icon size={16} />
          </div>
        )}

        {/* Input Field */}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full bg-[#0F0F0F] text-sm text-white placeholder-zinc-700 
            rounded-lg py-2.5 
            border transition-all duration-200 ease-out
            ${Icon ? 'pl-10' : 'pl-3'} 
            ${isPassword ? 'pr-10' : 'pr-3'}
            ${error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
              : 'border-[#222] hover:border-[#333] focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10'
            }
          `}
        />

        {/* Password Eye */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-[11px] text-red-400 font-medium flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block"/> {error}
        </p>
      )}
    </div>
  );
}