'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUser(res.data.data))
      .catch(() => router.push('/login')); // Protect route
  }, []);

  if (!user) return <div className="h-screen flex items-center justify-center text-white">Loading Brain...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10 pt-28">
      <h1 className="text-4xl font-bold">Hello, {user.full_name} 👋</h1>
      <p className="text-gray-400 mt-2">Welcome to your AI Command Center.</p>
    </div>
  );
}