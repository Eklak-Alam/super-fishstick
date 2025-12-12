'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Sparkles, Settings } from 'lucide-react';
import api from '@/lib/axios';
import { authService } from '@/services/auth.service';
import ProfileModal from '@/components/dashboard/ProfileModal'; // Import the new modal

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State for modal
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    api.get('/auth/me')
      .then(res => {
        setUser(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        authService.logout();
      });
  }, [router]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#020202]">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020202] relative overflow-hidden px-4">
      
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-[0.05] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Navigation Bar */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        {/* Profile Trigger Button */}
        <button 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
        >
            <Settings size={16} />
            <span>Profile</span>
        </button>

        {/* Logout Button */}
        <button 
            onClick={() => authService.logout()} 
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors px-4 py-2 rounded-full hover:bg-red-500/10 border border-transparent"
        >
            <LogOut size={16} />
            <span>Sign out</span>
        </button>
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        {/* Avatar (Clickable to open profile too) */}
        <button onClick={() => setIsProfileOpen(true)} className="mx-auto w-24 h-24 bg-[#0a0a0a] border border-white/10 rounded-full flex items-center justify-center mb-8 shadow-2xl relative group cursor-pointer transition-transform hover:scale-105">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="text-4xl font-bold text-white relative z-10">
                {user.full_name?.charAt(0).toUpperCase()}
            </span>
            {/* Edit Icon Overlay */}
            <div className="absolute bottom-0 right-0 bg-white text-black p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings size={14} />
            </div>
        </button>

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

      {/* --- Profile Modal --- */}
      <ProfileModal 
        user={user} 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        onUpdate={(updatedUser) => setUser(updatedUser)} 
      />

    </div>
  );
}