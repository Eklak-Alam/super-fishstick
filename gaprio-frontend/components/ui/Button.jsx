'use client';
import { Loader2 } from 'lucide-react';

export default function Button({ 
  children, 
  onClick, 
  className = "", 
  loading = false, 
  variant = "primary" 
}) {
  
  const baseStyles = "relative w-full h-11 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed select-none";

  // 1. Primary: Rich Orange with "Inner Light"
  if (variant === 'primary') {
    return (
      <button 
        onClick={onClick}
        disabled={loading}
        className={`
          ${baseStyles}
          bg-[#F97316] text-black
          hover:bg-[#ea580c] 
          shadow-[inset_0px_1px_0px_rgba(255,255,255,0.3),0px_2px_4px_rgba(0,0,0,0.3)]
          ${className}
        `}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin text-black/70" />
            <span className="text-black/70">Processing...</span>
          </>
        ) : (
          <span className="font-bold tracking-tight">{children}</span>
        )}
      </button>
    );
  }

  // 2. Secondary: Dark Surface with "Rim Light"
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        ${baseStyles}
        bg-[#111] text-zinc-300 border border-[#222]
        hover:text-white hover:border-zinc-700 hover:bg-[#1a1a1a]
        shadow-[0px_1px_2px_rgba(0,0,0,0.5)]
        ${className}
      `}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}