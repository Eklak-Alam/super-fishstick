'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Settings } from 'lucide-react';
import api from '@/lib/axios';
import { authService } from '@/services/auth.service';

// Components
import Sidebar from '@/components/dashboard/Sidebar';
import OverviewTab from '@/components/dashboard/OverviewTab';
import GoogleWorkspace from '@/components/dashboard/GoogleWorkspace';
import SlackWorkspace from '@/components/dashboard/SlackWorkspace';
import AsanaWorkspace from '@/components/dashboard/AsanaWorkspace';
import ProfileModal from '@/components/dashboard/ProfileModal';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Data Storage
  const [googleData, setGoogleData] = useState({ emails: [], files: [], meetings: [] });
  const [slackData, setSlackData] = useState({ channels: [] });
  const [asanaData, setAsanaData] = useState({ projects: [], tasks: [] });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }

    const initDashboard = async () => {
        try {
            // 1. Get User
            const userRes = await api.get('/auth/me');
            setUser(userRes.data.data);
            const connections = userRes.data.data.connections || [];

            // 2. Fetch Integrations Data (Parallel for speed)
            const promises = [];
            
            if (connections.some(c => c.provider === 'google')) {
                promises.push(api.get('/integrations/google/dashboard').then(res => setGoogleData(res.data.data)).catch(console.warn));
            }
            if (connections.some(c => c.provider === 'slack')) {
                promises.push(api.get('/integrations/slack/channels').then(res => setSlackData(res.data.data)).catch(console.warn));
            }
            if (connections.some(c => c.provider === 'asana')) {
                promises.push(api.get('/integrations/asana/dashboard').then(res => setAsanaData(res.data.data)).catch(console.warn));
            }

            await Promise.all(promises);

        } catch (error) {
            console.error("Dashboard Init Error:", error);
            authService.logout();
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    initDashboard();
  }, [router]);

  if (loading) return (
    <div className="h-screen bg-[#020202] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  // Determine Connection Status
  const isGoogleConnected = user.connections?.some(c => c.provider === 'google');
  const isSlackConnected = user.connections?.some(c => c.provider === 'slack');
  const isAsanaConnected = user.connections?.some(c => c.provider === 'asana');

  return (
    <div className="flex h-screen bg-[#020202] text-white overflow-hidden font-sans selection:bg-orange-500/30">
      
      {/* 🟢 FIXED: Passed props explicitly to ensure they are functions */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onOpenProfile={() => setIsProfileOpen(true)} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#020202]">
        
        {/* 🟢 FIXED: Replaced grid.svg with Pure CSS Pattern */}
        <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}
        />
        
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#020202]/80 backdrop-blur-md z-10 shrink-0">
            <h2 className="font-semibold text-lg capitalize text-zinc-200">
                {activeTab.replace('google', 'Google Workspace').replace('slack', 'Slack').replace('asana', 'Asana')}
            </h2>
            <button onClick={() => { authService.logout(); router.push('/login'); }} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-red-400 transition-colors">
                <LogOut size={18} />
            </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-0 custom-scrollbar">
            {activeTab === 'overview' && <OverviewTab user={user} googleData={googleData} slackData={slackData} />}
            {activeTab === 'google' && <GoogleWorkspace isConnected={isGoogleConnected} data={googleData} user={user} />}
            {activeTab === 'slack' && <SlackWorkspace isConnected={isSlackConnected} data={slackData} user={user} />}
            {activeTab === 'asana' && <AsanaWorkspace isConnected={isAsanaConnected} data={asanaData} user={user} />}
            
            {/* Microsoft Placeholder */}
            {activeTab === 'microsoft' && (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-50">
                    <Settings size={48} className="text-zinc-700 mb-4" />
                    <h2 className="text-2xl font-bold mb-2 capitalize text-zinc-500">Microsoft 365</h2>
                    <p className="text-zinc-600">Coming soon in Gaprio v2.1</p>
                </div>
            )}
        </div>
      </main>

      <ProfileModal user={user} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onUpdate={setUser} />
    </div>
  );
}