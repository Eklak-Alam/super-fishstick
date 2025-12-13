'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, ArrowRight, Zap } from 'lucide-react';
import { authService } from '@/services/auth.service';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        router.push('/dashboard');
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register(formData);
      await authService.login({ email: formData.email, password: formData.password });
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 w-full flex items-center justify-center bg-[#020202] relative overflow-hidden p-4">
      
      {/* Background: Amber/Red glow for creation energy */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10"
      >
        <div className="mb-8 text-center">
            {/* Header Icon: Orange/Amber Gradient */}
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-2xl border border-orange-500/20 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Zap className="text-orange-500 w-7 h-7 fill-orange-500/20" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
            <p className="text-zinc-400 text-sm">Join the AI-native workspace revolution.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <Input icon={User} name="fullName" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            <Input icon={Mail} name="email" type="email" placeholder="Work Email" value={formData.email} onChange={handleChange} required />
            <Input icon={Lock} name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
                    {error}
                </div>
            )}

            <Button className="w-full h-12 group !rounded-xl" variant="primary">
                {loading ? 'Creating Account...' : (
                    <span className="flex items-center justify-center gap-2">
                        Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                )}
            </Button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:text-orange-400 transition-colors font-medium hover:underline decoration-orange-500/50 underline-offset-4">
                Sign In
            </Link>
        </div>
      </motion.div>
    </div>
  );
}