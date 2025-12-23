'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';
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
    const token = localStorage.getItem('accessToken');
    if (token) {
        router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login(formData);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 w-full flex items-center justify-center bg-[#020202] relative overflow-hidden p-4">
      
      {/* Orange/Amber Atmospheric Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10"
      >
        <div className="mb-10 text-center">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 relative">
                {/* Glow behind logo */}
                <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" />
                <Image src="/logo1.png" alt="Gaprio Logo" width={50} height={40} className="object-contain relative z-10" priority />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-zinc-400 text-sm">Enter your credentials to access the Neural Core.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
                icon={Mail} 
                type="email" 
                placeholder="name@company.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
            />
            <Input 
                icon={Lock} 
                type="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
            />

            <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs text-orange-400 hover:text-orange-300 transition-colors font-medium">
                    Forgot password?
                </Link>
            </div>

            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
                    {error}
                </div>
            )}

            <Button className="w-full h-12 group !rounded-xl" variant="primary">
                {loading ? 'Signing in...' : (
                    <span className="flex items-center justify-center gap-2">
                        Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                )}
            </Button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-white hover:text-orange-400 transition-colors font-medium hover:underline decoration-orange-500/50 underline-offset-4">
                Start a free trial
            </Link>
        </div>
      </motion.div>
    </div>
  );
}