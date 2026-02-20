'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, Settings, ChevronDown, User as UserIcon } from 'lucide-react'; 
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
import MicrosoftWorkspace from '@/components/dashboard/MicrosoftWorkspace';
import ProfileModal from '@/components/dashboard/ProfileModal';
import AiWorkspace from '@/components/dashboard/AiAssistant';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Data Storage
  const [googleData, setGoogleData] = useState({ emails: [], files: [], meetings: [] });
  const [slackData, setSlackData] = useState({ channels: [], users: [] });
  const [asanaData, setAsanaData] = useState({ projects: [], tasks: [] });
  const [miroData, setMiroData] = useState({ boards: [] });
  const [jiraData, setJiraData] = useState({ issues: [] });
  const [zohoData, setZohoData] = useState({ deals: [] });
  const [microsoftData, setMicrosoftData] = useState({ documents: [], events: [] });

  const router = useRouter();

  const tabNames = {
    overview: 'Overview',
    ai: 'Gaprio Intelligence',
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
            const userRes = await api.get('/auth/me');
            setUser(userRes.data.data);
            const connections = userRes.data.data.connections || [];

            const promises = [];
            if (connections.some(c => c.provider === 'google')) promises.push(api.get('/integrations/google/dashboard').then(res => setGoogleData(res.data.data)).catch(console.warn));
            if (connections.some(c => c.provider === 'slack')) promises.push(api.get('/integrations/slack/channels').then(res => setSlackData(res.data.data)).catch(console.warn));
            if (connections.some(c => c.provider === 'asana')) promises.push(api.get('/integrations/asana/dashboard').then(res => setAsanaData(res.data.data)).catch(console.warn));
            if (connections.some(c => c.provider === 'miro')) promises.push(api.get('/integrations/miro/boards').then(res => setMiroData(res.data.data)).catch(console.warn));
            if (connections.some(c => c.provider === 'jira')) promises.push(api.get('/integrations/jira/issues').then(res => setJiraData(res.data.data)).catch(console.warn));
            if (connections.some(c => c.provider === 'zoho')) promises.push(api.get('/integrations/zoho/deals').then(res => setZohoData(res.data.data)).catch(console.warn));
            if (connections.some(c => c.provider === 'microsoft')) promises.push(api.get('/integrations/microsoft/dashboard').then(res => setMicrosoftData(res.data.data)).catch(console.warn));

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
    <div className="h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-800 border-t-orange-500 rounded-full animate-spin shadow-[0_0_15px_rgba(249,115,22,0.2)]" />
    </div>
  );

  if (!user) return null;
  const checkConn = (provider) => user.connections?.some(c => c.provider === provider);

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-orange-500/30 overflow-hidden relative">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <div className="hidden md:flex h-full shrink-0 z-40 border-r border-zinc-800 shadow-2xl">
        <Sidebar 
            activeTab={activeTab} setActiveTab={setActiveTab} user={user} 
            onOpenProfile={() => setIsProfileOpen(true)}
        />
      </div>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <div className="fixed inset-0 z-[150] flex md:hidden">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative w-[280px] h-full bg-zinc-950 border-r border-zinc-800 shadow-2xl"
                >
                    <Sidebar 
                        activeTab={activeTab} setActiveTab={setActiveTab} user={user} isMobile={true}
                        onOpenProfile={() => { setIsProfileOpen(true); setIsMobileMenuOpen(false); }}
                        onClose={() => setIsMobileMenuOpen(false)}
                    />
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col relative min-w-0 h-full bg-[#050505]">
        
        {/* Subtle Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        
        {/* HEADER */}
        <header className="h-[72px] border-b border-zinc-800/80 flex items-center justify-between px-6 lg:px-8 bg-[#050505]/90 backdrop-blur-md z-20 sticky top-0 shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2.5 -ml-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800">
                    <Menu size={20} />
                </button>
                
                <div className="flex items-center text-[15px] font-semibold tracking-tight">
                    <span className="text-zinc-500 hidden sm:block">Gaprio</span>
                    <span className="text-zinc-700 mx-2.5 hidden sm:block">/</span>
                    <span className="text-zinc-100">{tabNames[activeTab] || 'Dashboard'}</span>
                </div>
            </div>
            
            <div className="relative">
                {isProfileDropdownOpen && (
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)} />
                )}

                <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className={`relative z-50 flex items-center gap-3 p-1.5 pr-3 rounded-full border transition-all outline-none ${isProfileDropdownOpen ? 'bg-zinc-900 border-zinc-700 shadow-inner' : 'bg-[#0a0a0a] border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'}`}
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center text-sm font-bold shadow-inner border border-orange-400/20">
                        {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-[13px] font-semibold text-zinc-200 hidden sm:block tracking-wide">
                        {user?.full_name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown size={14} className={`text-zinc-500 hidden sm:block transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180 text-orange-500' : ''}`} />
                </button>

                <AnimatePresence>
                    {isProfileDropdownOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 top-full mt-3 w-64 bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="px-5 py-4 border-b border-zinc-800/80 bg-[#050505]/50">
                                <p className="text-sm font-bold text-white truncate">{user?.full_name || 'System Admin'}</p>
                                <p className="text-xs font-medium text-zinc-500 truncate mt-0.5 font-mono tracking-wide">{user?.email}</p>
                            </div>
                            <div className="p-2 space-y-1">
                                <button onClick={() => { setIsProfileOpen(true); setIsProfileDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors outline-none group">
                                    <UserIcon size={16} className="text-zinc-500 group-hover:text-orange-500 transition-colors" /> Profile & Settings
                                </button>
                                <button onClick={() => { authService.logout(); router.push('/login'); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors outline-none group">
                                    <LogOut size={16} className="text-red-500/70 group-hover:text-red-400 transition-colors" /> Sign Out
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>

        {/* --- DYNAMIC VIEWPORT ROUTING --- */}
        {activeTab === 'ai' ? (
            /* AI Workspace requires a perfectly locked flex container so the chat input stays at the bottom */
            <div className="flex-1 relative z-0 flex flex-col p-4 md:p-6 lg:p-10 overflow-hidden">
                <AiWorkspace />
            </div>
        ) : (
            /* Regular Workspaces get normal scrolling with bottom padding */
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 pb-24 md:pb-32 relative z-0 custom-scrollbar" data-lenis-prevent="true">
                {activeTab === 'overview' && <OverviewTab user={user} googleData={googleData} slackData={slackData} setActiveTab={setActiveTab} />} 
                {activeTab === 'google' && <GoogleWorkspace isConnected={checkConn('google')} data={googleData} user={user} />}
                {activeTab === 'slack' && <SlackWorkspace isConnected={checkConn('slack')} data={slackData} user={user} />}
                {activeTab === 'asana' && <AsanaWorkspace isConnected={checkConn('asana')} data={asanaData} user={user} />}
                {activeTab === 'miro' && <MiroWorkspace isConnected={checkConn('miro')} data={miroData} user={user} />}
                {activeTab === 'jira' && <JiraWorkspace isConnected={checkConn('jira')} data={jiraData} user={user} />}
                {activeTab === 'zoho' && <ZohoWorkspace isConnected={checkConn('zoho')} data={zohoData} user={user} />}
                {activeTab === 'microsoft' && <MicrosoftWorkspace isConnected={checkConn('microsoft')} data={microsoftData} user={user} />}
            </div>
        )}
      </main>

      <ProfileModal user={user} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onUpdate={setUser} />
      
      {/* 🚨 THE FLOATING AI ASSISTANT MODAL IS GONE FOREVER 🚨 */}
    </div>
  );
}