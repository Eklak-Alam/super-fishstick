'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { authService } from '@/services/auth.service';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Register
      await authService.register(formData);
      
      // 2. Auto-Login after registration (optional) or redirect to login
      await authService.login({ email: formData.email, password: formData.password });
      
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#030014] relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
            Create Account
          </h1>
          <p className="text-gray-400">Join the AI-native workspace revolution.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            icon={User}
            name="fullName"
            type="text" 
            placeholder="Full Name" 
            value={formData.fullName}
            onChange={handleChange}
          />
          <Input 
            icon={Mail}
            name="email"
            type="email" 
            placeholder="Email Address" 
            value={formData.email}
            onChange={handleChange}
          />
          <Input 
            icon={Lock}
            name="password"
            type="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange}
          />

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <Button className="w-full group flex items-center justify-center gap-2">
            {loading ? 'Creating Account...' : (
              <>
                Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}