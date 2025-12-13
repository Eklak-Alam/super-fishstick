import AuthCallbackClient from '@/components/Logic/AuthCallbackClient';
import { Suspense } from 'react';

export default function CallbackPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthCallbackClient />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Loading...
    </div>
  );
}
