'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawEmail = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  // --- 🔒 Advanced Email Masking ---
  // Shows first 5 chars if possible, otherwise adjusts for short emails.
  const maskedEmail = (() => {
    if (!rawEmail) return '';
    const [username, domain] = rawEmail.split('@');
    if (!username || !domain) return rawEmail;

    // Short username (e.g. "bob"): Show "b****@gmail.com"
    if (username.length <= 4) {
        return `${username.charAt(0)}****@${domain}`;
    }
    
    // Normal username: Show first 5 chars "eklak****@gmail.com"
    return `${username.substring(0, 5)}****@${domain}`;
  })();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle Input Typing
  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  // Handle Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle Paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.some(char => isNaN(char))) return;

    const newOtp = [...otp];
    pastedData.forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const code = otp.join('');
      const res = await api.post('/auth/verify-email', { email: rawEmail, code });
      
      // Store tokens
      localStorage.setItem('accessToken', res.data.data.accessToken);
      localStorage.setItem('refreshToken', res.data.data.refreshToken);
      
      // Hard refresh to ensure full app reload
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimer(60);
    setError('');
    await api.post('/auth/resend-code', { email: rawEmail });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 font-sans relative overflow-hidden">
      
      <div className="absolute top-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-[#050505] to-[#050505] pointer-events-none" />

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[420px] relative z-10">
        
        <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.6)] text-center">
          
          <div className="w-14 h-14 bg-[#111] border border-[#222] rounded-xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShieldCheck size={24} className="text-orange-500" />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Verify Identity</h2>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
            Enter the secure code sent to <br/>
            <span className="text-white font-medium">{maskedEmail}</span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-between gap-2 mb-8">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className={`
                    w-12 h-14 bg-[#0F0F0F] rounded-lg text-center text-xl font-bold text-white outline-none transition-all duration-200
                    ${digit 
                        ? 'border border-orange-500/50 shadow-[0_0_0_4px_rgba(249,115,22,0.1)]' 
                        : 'border border-[#27272a] focus:border-orange-500 focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]'
                    }
                  `}
                />
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium text-center">
                {error}
              </div>
            )}

            <Button loading={loading} variant="primary">
              Verify Account <ArrowRight size={16} className="ml-2 inline-block"/>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1F1F1F]">
            {timer > 0 ? (
              <p className="text-zinc-500 text-xs">Resend code in <span className="text-white font-mono">{timer}s</span></p>
            ) : (
              <button onClick={handleResend} className="text-zinc-400 text-xs font-medium flex items-center justify-center gap-2 hover:text-orange-500 transition-colors mx-auto group">
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500"/> Resend Code
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Export Page Wrapped in Suspense
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <VerifyContent />
    </Suspense>
  );
}