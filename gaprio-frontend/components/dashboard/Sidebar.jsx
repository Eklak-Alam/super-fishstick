'use client';
import { LayoutGrid, Mail, MessageSquare, CheckSquare, Briefcase, Settings } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user, onOpenProfile }) {
    const isGoogleConnected = user?.connections?.some(c => c.provider === 'google');
    const isSlackConnected = user?.connections?.some(c => c.provider === 'slack');

    return (
        <aside className="w-64 bg-[#050505] border-r border-white/5 flex flex-col justify-between p-4 z-20 hidden md:flex">
            <div>
                {/* Logo */}
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">G</div>
                    <span className="font-bold text-lg tracking-tight text-white">Gaprio</span>
                </div>

                {/* Navigation */}
                <div className="space-y-1">
                    <div className="px-2 mb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Main</div>
                    <SidebarItem icon={LayoutGrid} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    
                    <div className="px-2 mb-2 mt-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Connections</div>
                    <SidebarItem icon={Mail} label="Google Workspace" active={activeTab === 'google'} onClick={() => setActiveTab('google')} connected={isGoogleConnected} />
                    <SidebarItem icon={MessageSquare} label="Slack" active={activeTab === 'slack'} onClick={() => setActiveTab('slack')} connected={isSlackConnected} />
                    <SidebarItem icon={CheckSquare} label="Asana" active={activeTab === 'asana'} onClick={() => setActiveTab('asana')} />
                    <SidebarItem icon={Briefcase} label="Microsoft 365" active={activeTab === 'microsoft'} onClick={() => setActiveTab('microsoft')} />
                </div>
            </div>

            {/* User Profile Trigger */}
            <div className="border-t border-white/5 pt-4">
                <button onClick={onOpenProfile} className="flex items-center gap-3 w-full p-2 hover:bg-white/5 rounded-xl transition-colors text-left group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                        {user?.full_name?.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
                        <p className="text-[10px] text-zinc-500 truncate group-hover:text-orange-400 transition-colors">View Profile</p>
                    </div>
                    <Settings size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                </button>
            </div>
        </aside>
    );
}

function SidebarItem({ icon: Icon, label, active, onClick, connected }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all mb-1 ${active ? 'bg-white/10 text-white font-medium' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
            <div className="flex items-center gap-3">
                <Icon size={18} className={active ? 'text-orange-500' : 'text-zinc-500 group-hover:text-white'} />
                <span className="text-sm">{label}</span>
            </div>
            {connected && <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
        </button>
    )
}