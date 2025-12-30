'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, Menu } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { authService } from '@/services/auth.service';

// Components
import Sidebar from '@/components/dashboard/Sidebar';
import OverviewTab from '@/components/dashboard/OverviewTab';
import GoogleWorkspace from '@/components/dashboard/GoogleWorkspace';
import SlackWorkspace from '@/components/dashboard/SlackWorkspace';
import AsanaWorkspace from '@/components/dashboard/AsanaWorkspace';
import MiroWorkspace from '@/components/dashboard/MiroWorkspace';
import JiraWorkspace from '@/components/dashboard/JiraWorkspace';
import ZohoWorkspace from '@/components/dashboard/ZohoWorkspace';
import ProfileModal from '@/components/dashboard/ProfileModal';
import AiAssistant from '@/components/dashboard/AiAssistant';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false); // <--- AI Chat State

  // Data Storage
  const [googleData, setGoogleData] = useState({ emails: [], files: [], meetings: [] });
  const [slackData, setSlackData] = useState({ channels: [] });
  const [asanaData, setAsanaData] = useState({ projects: [], tasks: [] });
  const [miroData, setMiroData] = useState({ boards: [] });
  const [jiraData, setJiraData] = useState({ issues: [] });
  const [zohoData, setZohoData] = useState({ deals: [] });

  const router = useRouter();

  const tabNames = {
    overview: 'Overview',
    google: 'Google Workspace',
    slack: 'Slack',
    asana: 'Asana',
    miro: 'Miro',
    jira: 'Jira Software',
    zoho: 'Zoho CRM',
    microsoft: 'Microsoft 365'
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }

    const initDashboard = async () => {
        try {
            // 1. Get User
            const userRes = await api.get('/auth/me');
            setUser(userRes.data.data);
            const connections = userRes.data.data.connections || [];

            // 2. Fetch Integrations (Parallel)
            const promises = [];
            if (connections.some(c => c.provider === 'google')) promises.push(api.get('/integrations/google/dashboard').then(res => setGoogleData(res.data.data)).catch(console.warn));
            if (connections.some(c => c.provider === 'slack')) promises.push(api.get('/integrations/slack/channels').then(res => setSlackData(res.data.data)).catch(console.warn));
            if (connections.some(c => c.provider === 'asana')) promises.push(api.get('/integrations/asana/dashboard').then(res => setAsanaData(res.data.data)).catch(console.warn));
            if (connections.some(c => c.provider === 'miro')) promises.push(api.get('/integrations/miro/boards').then(res => setMiroData(res.data.data)).catch(console.warn));
            if (connections.some(c => c.provider === 'jira')) promises.push(api.get('/integrations/jira/issues').then(res => setJiraData(res.data.data)).catch(console.warn));
            if (connections.some(c => c.provider === 'zoho')) promises.push(api.get('/integrations/zoho/deals').then(res => setZohoData(res.data.data)).catch(console.warn));

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

  const checkConn = (provider) => user.connections?.some(c => c.provider === provider);

  return (
    <div className="flex h-screen bg-[#020202] text-white overflow-hidden font-sans selection:bg-orange-500/30">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            user={user} 
            onOpenProfile={() => setIsProfileOpen(true)} 
            onOpenAI={() => setIsAiOpen(true)} // <--- Open AI from Sidebar
        />
      </div>

      {/* --- MOBILE SIDEBAR (DRAWER) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative w-72 h-full bg-[#020202] shadow-2xl border-r border-white/10"
                >
                    <Sidebar 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                        user={user} 
                        onOpenProfile={() => { setIsProfileOpen(true); setIsMobileMenuOpen(false); }}
                        onClose={() => setIsMobileMenuOpen(false)}
                        onOpenAI={() => { setIsAiOpen(true); setIsMobileMenuOpen(false); }} // <--- Open AI from Mobile
                    />
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#020202]">
        
        {/* Background Pattern */}
        <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#020202]/80 backdrop-blur-md z-10 shrink-0 sticky top-0">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsMobileMenuOpen(true)} 
                    className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white rounded-lg active:bg-white/10 transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h2 className="font-semibold text-lg text-zinc-200 truncate">
                    {tabNames[activeTab] || 'Dashboard'}
                </h2>
            </div>

            <button 
                onClick={() => { authService.logout(); router.push('/login'); }} 
                className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-red-400 transition-colors"
                title="Logout"
            >
                <LogOut size={20} />
            </button>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-0 custom-scrollbar">
            
            {activeTab === 'overview' && (
                <OverviewTab user={user} googleData={googleData} slackData={slackData} />
            )}
            
            {activeTab === 'google' && (
                <GoogleWorkspace isConnected={checkConn('google')} data={googleData} user={user} />
            )}
            
            {activeTab === 'slack' && (
                <SlackWorkspace isConnected={checkConn('slack')} data={slackData} user={user} />
            )}
            
            {activeTab === 'asana' && (
                <AsanaWorkspace isConnected={checkConn('asana')} data={asanaData} user={user} />
            )}

            {activeTab === 'miro' && (
                <MiroWorkspace isConnected={checkConn('miro')} data={miroData} user={user} />
            )}

            {activeTab === 'jira' && (
                <JiraWorkspace isConnected={checkConn('jira')} data={jiraData} user={user} />
            )}

            {activeTab === 'zoho' && (
                <ZohoWorkspace isConnected={checkConn('zoho')} data={zohoData} user={user} />
            )}
            
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
      
      {/* --- AI ASSISTANT OVERLAY --- */}
      {/* isOpen and onClose are controlled by Dashboard state */}
      <AiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

    </div>
  );
}