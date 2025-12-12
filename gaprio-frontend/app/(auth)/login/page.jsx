'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service'; // Import the service!

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // State for error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors

    try {
      // Use the authService, not direct api call, to keep logic clean
      await authService.login(formData);
      
      // If successful, redirect
      router.push('/dashboard');
    } catch (err) {
      // CAPTURE THE REAL ERROR
      const errorMsg = err.response?.data?.error || err.message || 'Login Failed';
      setError(errorMsg);
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#030014] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-black z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 z-10 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-white">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-8">Login to Gaprio Workspace</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          No account? <Link href="/register" className="text-white hover:underline">Create one</Link>
        </div>
      </motion.div>
    </div>
  );
}