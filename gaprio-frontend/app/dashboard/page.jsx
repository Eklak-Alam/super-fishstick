'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Sparkles } from 'lucide-react';
import api from '@/lib/axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- 1. Fetch User Data ---
  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        setUser(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        // If error (not logged in), go to login
        router.push('/login');
      });
  }, [router]);

  // --- 2. Logout Function ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  // --- 3. Loading State ---
  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#020202]">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020202] relative overflow-hidden px-4">
      
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-[0.05] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

      {/* --- Logout Button (Top Right) --- */}
      <div className="absolute top-6 right-6 z-20">
        <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10"
        >
            <LogOut size={16} />
            <span>Sign out</span>
        </button>
      </div>

      {/* --- Main Content --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        {/* Avatar / Icon */}
        <div className="mx-auto w-20 h-20 bg-[#0a0a0a] border border-white/10 rounded-full flex items-center justify-center mb-8 shadow-2xl relative group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="text-3xl font-bold text-white relative z-10">
                {user.full_name?.charAt(0).toUpperCase()}
            </span>
        </div>

        {/* Greeting */}
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
          Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{user.full_name}</span>
        </h1>

        {/* Subtitle */}
        <div className="flex items-center justify-center gap-2 text-gray-400 text-lg md:text-xl">
            <Sparkles size={18} className="text-yellow-500" />
            <p>Welcome to your AI Command Center.</p>
        </div>

      </motion.div>

      {/* Bottom Text */}
      <div className="absolute bottom-10 text-xs text-gray-600 font-mono">
        GAPRIO SYSTEM ONLINE • v2.0.1
      </div>

    </div>
  );
}