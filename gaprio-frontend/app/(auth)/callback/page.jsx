export const dynamic = 'force-dynamic'; // ADD THIS LINE
'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Prevent strict mode double-firing
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      // 1. Save tokens directly to LocalStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // 2. Force a hard redirect to Dashboard to load user data
      window.location.href = '/dashboard';
    } else {
      // 3. Handle failure
      router.push('/login?error=GoogleAuthFailed');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020202] text-white">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
      <h2 className="text-xl font-bold">Connecting to Gaprio...</h2>
      <p className="text-gray-400 text-sm">Please wait while we secure your session.</p>
    </div>
  );
}