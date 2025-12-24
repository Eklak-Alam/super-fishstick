'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock } from 'lucide-react';
import { authService } from '@/services/auth.service';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
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
        await authService.register(formData);
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
        setError(err.response?.data?.error || 'Registration failed');
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
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-zinc-500 text-sm">Join the Neural Core workspace.</p>
        </div>

        <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <form onSubmit={handleSubmit}>
            <Input label="Full Name" icon={User} placeholder="John Doe" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
            <Input label="Work Email" icon={Mail} type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <Input label="Password" icon={Lock} type="password" placeholder="Create a strong password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />

            <div className="h-2"></div>

            {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium text-center">{error}</div>}

            <Button className='cursor-pointer' loading={loading} variant="primary">Sign Up</Button>
          </form>
        </div>

        <p className="text-center mt-8 text-xs text-zinc-600">
          Already a member?{' '}
          <Link href="/login" className="text-zinc-400 hover:text-orange-500 transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}