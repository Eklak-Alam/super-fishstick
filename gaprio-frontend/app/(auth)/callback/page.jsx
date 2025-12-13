'use client';
import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// The actual logic component
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      // Use window.location for a hard refresh to ensure auth state updates immediately
      window.location.href = '/dashboard';
    } else {
      router.push('/login?error=GoogleAuthFailed');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020202] text-white">
      {/* Loading Spinner - Orange Theme */}
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6" />
      <h2 className="text-xl font-bold tracking-tight">Connecting to Gaprio...</h2>
      <p className="text-zinc-500 text-sm mt-2">
        Securing your session. Please wait.
      </p>
    </div>
  );
}

// The Page Component (Exports Suspense)
export default function CallbackPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#020202] text-white">
            Loading...
        </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}