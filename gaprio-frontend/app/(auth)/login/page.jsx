'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { authService } from '@/services/auth.service';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('accessToken')) router.push('/dashboard');
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login(formData);
      router.push('/dashboard');
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.data?.needsVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else {
        setError(err.response?.data?.error || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] p-6 font-sans">
      
      <div className="absolute top-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-[#050505] to-[#050505] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-[400px] relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Image src="/logo1.png" alt="Logo" width={24} height={24} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-zinc-500 text-sm">Enter your details to access the workspace.</p>
        </div>

        <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <form onSubmit={handleSubmit}>
            <Input 
              label="Email Address"
              icon={Mail} 
              type="email" 
              placeholder="name@work-email.com" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required
            />
            
            <Input 
              label="Password"
              icon={Lock} 
              type="password" 
              placeholder="••••••••••••" 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required
            />

            <div className="flex justify-between items-center mb-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#333] bg-[#111] text-orange-500 focus:ring-orange-500/20" />
                <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-xs text-zinc-500 hover:text-orange-500 transition-colors font-medium">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium text-center">
                {error}
              </div>
            )}

            <Button loading={loading} variant="primary">
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center mt-8 text-xs text-zinc-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-zinc-400 hover:text-orange-500 transition-colors font-medium">
            Start a free trial
          </Link>
        </p>
      </motion.div>
    </div>
  );
}