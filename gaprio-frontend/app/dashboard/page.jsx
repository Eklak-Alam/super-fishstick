'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LogOut, Settings, Mail, FileText, Video, 
    Plus, LayoutGrid, MessageSquare, CheckSquare, 
    Briefcase, Search, Bell, ExternalLink, Send, X, Calendar 
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import ProfileModal from '@/components/dashboard/ProfileModal';
import api from '@/lib/axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'google' | 'slack' | 'asana'
  const [googleData, setGoogleData] = useState({ emails: [], files: [], meetings: [] });
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'email' | 'meeting'
  const [formData, setFormData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }

    const fetchData = async () => {
        try {
            const userRes = await api.get('/auth/me');
            setUser(userRes.data.data);

            if (userRes.data.data.connections?.some(c => c.provider === 'google')) {
                const googleRes = await api.get('/integrations/google/dashboard');
                setGoogleData(googleRes.data.data);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };
    fetchData();
  }, [router]);

  // --- Actions ---
  const handleGoogleConnect = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
        await api.post('/integrations/google/email/send', formData);
        alert('Email Sent!');
        setModalType(null);
    } catch (err) { alert('Failed'); } finally { setActionLoading(false); }
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
        const res = await api.post('/integrations/google/calendar/create', {
            summary: formData.summary,
            startTime: new Date(formData.startTime),
            endTime: new Date(new Date(formData.startTime).getTime() + 3600000)
        });
        setGoogleData(prev => ({...prev, meetings: [res.data.data, ...prev.meetings]}));
        alert('Meeting Created!');
        setModalType(null);
    } catch (err) { alert('Failed'); } finally { setActionLoading(false); }
  };

  if (loading) return <DashboardSkeleton />;
  if (!user) return null;

  const isGoogleConnected = user.connections?.some(c => c.provider === 'google');

  return (
    <div className="flex h-screen bg-[#020202] text-white overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* --- LEFT SIDEBAR --- */}
      <aside className="w-64 bg-[#050505] border-r border-white/5 flex flex-col justify-between p-4 z-20">
        <div>
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white">G</div>
                <span className="font-bold text-lg tracking-tight">Gaprio</span>
            </div>

            {/* Navigation */}
            <div className="space-y-1">
                <div className="px-2 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Main</div>
                <SidebarItem icon={LayoutGrid} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                
                <div className="px-2 mb-2 mt-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Connections</div>
                <SidebarItem 
                    icon={Mail} 
                    label="Google Workspace" 
                    active={activeTab === 'google'} 
                    onClick={() => setActiveTab('google')} 
                    connected={isGoogleConnected}
                />
                <SidebarItem icon={MessageSquare} label="Slack" active={activeTab === 'slack'} onClick={() => setActiveTab('slack')} />
                <SidebarItem icon={CheckSquare} label="Asana" active={activeTab === 'asana'} onClick={() => setActiveTab('asana')} />
                <SidebarItem icon={Briefcase} label="Microsoft 365" active={activeTab === 'microsoft'} onClick={() => setActiveTab('microsoft')} />
            </div>
        </div>

        {/* User Mini Profile */}
        <div className="border-t border-white/5 pt-4">
            <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-3 w-full p-2 hover:bg-white/5 rounded-xl transition-colors text-left group">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    {user.full_name?.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
                    <p className="text-[10px] text-gray-500 truncate group-hover:text-purple-400 transition-colors">View Profile</p>
                </div>
                <Settings size={14} className="text-gray-600 group-hover:text-white transition-colors" />
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#020202]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />
        
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#020202]/80 backdrop-blur-md z-10">
            <h2 className="font-semibold text-lg capitalize">{activeTab === 'google' ? 'Google Workspace' : activeTab}</h2>
            <div className="flex items-center gap-4">
                <button onClick={() => authService.logout()} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-red-400 transition-colors">
                    <LogOut size={18} />
                </button>
            </div>
        </header>

        {/* Dynamic View Container */}
        <div className="flex-1 overflow-y-auto p-8 relative z-0">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">Welcome back, {user.full_name.split(' ')[0]} 👋</h1>
                    <p className="text-gray-400 mb-10">Your AI command center is active.</p>
                    
                    <div className="grid grid-cols-3 gap-6">
                        <StatCard label="Active Connections" value={isGoogleConnected ? '1' : '0'} />
                        <StatCard label="Emails Processed" value={googleData.emails.length} />
                        <StatCard label="Pending Tasks" value="0" />
                    </div>
                </motion.div>
            )}

            {/* 2. GOOGLE WORKSPACE TAB */}
            {activeTab === 'google' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
                    
                    {!isGoogleConnected ? (
                        <div className="h-[60vh] flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <Mail size={32} className="text-gray-500" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Connect Google Workspace</h2>
                            <p className="text-gray-400 mb-8 max-w-md">Access your Gmail, Drive, and Calendar directly inside Gaprio.</p>
                            <button onClick={handleGoogleConnect} className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                                <Plus size={18} /> Connect Account
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Action Bar */}
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold">Workspace Overview</h2>
                                    <p className="text-sm text-green-400 flex items-center gap-2 mt-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Live Sync Active
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setModalType('meeting')} className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-4 py-2 rounded-xl font-bold hover:bg-blue-600/30 transition-colors flex items-center gap-2">
                                        <Video size={18} /> New Meeting
                                    </button>
                                    <button onClick={() => setModalType('email')} className="bg-white text-black px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                                        <Send size={18} /> Compose
                                    </button>
                                </div>
                            </div>

                            {/* Widgets Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                
                                {/* EMAILS */}
                                <div className="lg:col-span-1 bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex flex-col h-[500px]">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-red-500/10 text-red-400 rounded-lg"><Mail size={18} /></div>
                                        <h3 className="font-bold">Inbox</h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                        {googleData.emails.map(email => (
                                            <div key={email.id} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors cursor-pointer group">
                                                <div className="flex justify-between mb-1">
                                                    <span className="font-bold text-sm truncate w-2/3 group-hover:text-blue-400 transition-colors">{email.subject}</span>
                                                    <span className="text-[10px] text-gray-500">{email.from.split('<')[0].slice(0,10)}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-2">{email.snippet}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CALENDAR */}
                                <div className="lg:col-span-1 bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex flex-col h-[500px]">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg"><Calendar size={18} /></div>
                                        <h3 className="font-bold">Schedule</h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                        {googleData.meetings.map(meet => (
                                            <div key={meet.id} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors flex justify-between items-center group">
                                                <div>
                                                    <div className="font-bold text-sm group-hover:text-orange-400 transition-colors">{meet.summary}</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {new Date(meet.start.dateTime || meet.start.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </div>
                                                </div>
                                                <a href={meet.htmlLink} target="_blank" className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20">
                                                    <Video size={14} />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* FILES */}
                                <div className="lg:col-span-1 bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex flex-col h-[500px]">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><FileText size={18} /></div>
                                        <h3 className="font-bold">Drive</h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                        {googleData.files.map(file => (
                                            <a href={file.webViewLink} target="_blank" key={file.id} className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors group">
                                                <img src={file.iconLink} className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                                                <span className="text-sm text-gray-300 truncate flex-1 group-hover:text-white transition-colors">{file.name}</span>
                                                <ExternalLink size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                                            </a>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </>
                    )}
                </motion.div>
            )}

            {/* 3. PLACEHOLDER TABS */}
            {['slack', 'asana', 'microsoft'].includes(activeTab) && (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-50">
                    <Settings size={48} className="text-gray-600 mb-4" />
                    <h2 className="text-2xl font-bold mb-2 capitalize">{activeTab} Integration</h2>
                    <p className="text-gray-500">Coming soon in Gaprio v2.1</p>
                </div>
            )}

        </div>
      </main>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {modalType && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl relative">
                    <button onClick={() => setModalType(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
                    <h2 className="text-xl font-bold mb-6">{modalType === 'email' ? 'Compose Email' : 'New Meeting'}</h2>
                    
                    {modalType === 'email' ? (
                        <form onSubmit={handleSendEmail} className="space-y-4">
                            <input placeholder="To" className="w-full bg-white/5 p-3 rounded-lg border border-white/10 text-white outline-none focus:border-white/30" onChange={e => setFormData({...formData, to: e.target.value})} required />
                            <input placeholder="Subject" className="w-full bg-white/5 p-3 rounded-lg border border-white/10 text-white outline-none focus:border-white/30" onChange={e => setFormData({...formData, subject: e.target.value})} required />
                            <textarea placeholder="Message..." rows={5} className="w-full bg-white/5 p-3 rounded-lg border border-white/10 text-white outline-none focus:border-white/30" onChange={e => setFormData({...formData, body: e.target.value})} required />
                            <button disabled={actionLoading} className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors">
                                {actionLoading ? 'Sending...' : 'Send Email'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleCreateMeeting} className="space-y-4">
                            <input placeholder="Meeting Title" className="w-full bg-white/5 p-3 rounded-lg border border-white/10 text-white outline-none focus:border-white/30" onChange={e => setFormData({...formData, summary: e.target.value})} required />
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">Start Time</label>
                                <input type="datetime-local" className="w-full bg-white/5 p-3 rounded-lg border border-white/10 text-white outline-none focus:border-white/30" onChange={e => setFormData({...formData, startTime: e.target.value})} required />
                            </div>
                            <button disabled={actionLoading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-500 transition-colors">
                                {actionLoading ? 'Creating...' : 'Schedule Meeting'}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <ProfileModal user={user} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onUpdate={setUser} />
    </div>
  );
}

// --- Sidebar Item Component ---
function SidebarItem({ icon: Icon, label, active, onClick, connected }) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all mb-1 ${active ? 'bg-white/10 text-white font-medium' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
        >
            <div className="flex items-center gap-3">
                <Icon size={18} className={active ? 'text-white' : 'text-gray-500'} />
                <span className="text-sm">{label}</span>
            </div>
            {connected && <div className="w-1.5 h-1.5 rounded-full bg-green-500" />}
        </button>
    )
}

function StatCard({ label, value }) {
    return (
        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl">
            <p className="text-gray-500 text-sm font-medium mb-2">{label}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    )
}

function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
}