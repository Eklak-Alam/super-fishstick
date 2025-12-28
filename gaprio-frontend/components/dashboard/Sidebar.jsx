'use client';
import { 
    LayoutGrid, Mail, MessageSquare, CheckSquare, Briefcase, 
    Settings, LayoutTemplate, ListTodo, LogOut, Sparkles, Database 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user, onOpenProfile }) {
    
    // --- 1. EXISTING LOGIC (PRESERVED) ---
    const connections = user?.connections || [];
    
    // Check Status
    const isGoogleConnected = connections.some(c => c.provider === 'google');
    const isSlackConnected = connections.some(c => c.provider === 'slack');
    const isAsanaConnected = connections.some(c => c.provider === 'asana');
    const isMiroConnected = connections.some(c => c.provider === 'miro');
    const isJiraConnected = connections.some(c => c.provider === 'jira');
    const isZohoConnected = connections.some(c => c.provider === 'zoho'); // NEW

    // Safe Tab Handler
    const handleTabChange = (tabName) => {
        if (typeof setActiveTab === 'function') setActiveTab(tabName);
    };

    return (
        <aside className="w-72 bg-[#020202] border-r border-white/5 flex flex-col justify-between z-20 hidden md:flex shrink-0 h-full relative overflow-hidden">
            
            {/* Background Texture for Sidebar */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] pointer-events-none" />

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {/* --- HEADER --- */}
                <div className="flex items-center gap-3 px-2 mb-8 mt-2">
                    <div className="relative w-10 h-10">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl blur-[2px] opacity-60" />
                        <div className="relative w-full h-full bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-inner border border-white/10">
                            G
                        </div>
                    </div>
                    <div>
                        <span className="font-bold text-lg tracking-tight text-white block leading-none">Gaprio</span>
                        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Workspace v2.0</span>
                    </div>
                </div>

                {/* --- NAVIGATION --- */}
                <div className="space-y-8">
                    
                    {/* Section: MAIN */}
                    <div>
                        <SectionLabel>Cockpit</SectionLabel>
                        <div className="space-y-1">
                            <SidebarItem 
                                icon={LayoutGrid} 
                                label="Overview" 
                                isActive={activeTab === 'overview'} 
                                onClick={() => handleTabChange('overview')} 
                            />
                        </div>
                    </div>
                    
                    {/* Section: INTEGRATIONS */}
                    <div>
                        <SectionLabel>Neural Integrations</SectionLabel>
                        <div className="space-y-1">
                            <SidebarItem 
                                icon={Mail} 
                                label="Google Workspace" 
                                isActive={activeTab === 'google'} 
                                onClick={() => handleTabChange('google')} 
                                isConnected={isGoogleConnected} 
                            />
                            <SidebarItem 
                                icon={MessageSquare} 
                                label="Slack" 
                                isActive={activeTab === 'slack'} 
                                onClick={() => handleTabChange('slack')} 
                                isConnected={isSlackConnected} 
                            />
                            <SidebarItem 
                                icon={CheckSquare} 
                                label="Asana" 
                                isActive={activeTab === 'asana'} 
                                onClick={() => handleTabChange('asana')} 
                                isConnected={isAsanaConnected} 
                            />
                            <SidebarItem 
                                icon={LayoutTemplate} 
                                label="Miro" 
                                isActive={activeTab === 'miro'} 
                                onClick={() => handleTabChange('miro')} 
                                isConnected={isMiroConnected} 
                            />
                            <SidebarItem 
                                icon={ListTodo} 
                                label="Jira Software" 
                                isActive={activeTab === 'jira'} 
                                onClick={() => handleTabChange('jira')} 
                                isConnected={isJiraConnected} 
                            />
                            {/* NEW: ZOHO ITEM */}
                            <SidebarItem 
                                icon={Briefcase} 
                                label="Zoho CRM" 
                                isActive={activeTab === 'zoho'} 
                                onClick={() => handleTabChange('zoho')} 
                                isConnected={isZohoConnected} 
                            />
                            <SidebarItem 
                                icon={Database} 
                                label="Microsoft 365" 
                                isActive={activeTab === 'microsoft'} 
                                onClick={() => handleTabChange('microsoft')} 
                                badge="Soon"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FOOTER: PROFILE --- */}
            <div className="p-4 border-t border-white/5 bg-[#050505]/50 backdrop-blur-sm">
                <button 
                    onClick={onOpenProfile} 
                    className="flex items-center gap-3 w-full p-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all group"
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-sm font-bold text-white shadow-lg ring-2 ring-[#050505]">
                            {user?.full_name?.charAt(0) || 'U'}
                        </div>
                        {/* Online Dot */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full" />
                    </div>
                    
                    <div className="flex-1 text-left overflow-hidden">
                        <p className="text-sm font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                            {user?.full_name || 'User'}
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate flex items-center gap-1">
                            <Sparkles size={10} className="text-orange-500" /> Free Plan
                        </p>
                    </div>
                    
                    <Settings size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                </button>
            </div>
        </aside>
    );
}

// --- HELPER COMPONENTS ---

function SectionLabel({ children }) {
    return (
        <h3 className="px-3 mb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest opacity-80">
            {children}
        </h3>
    );
}

function SidebarItem({ icon: Icon, label, isActive, onClick, isConnected, badge }) {
    return (
        <button 
            onClick={onClick} 
            className={`
                group relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300
                ${isActive 
                    ? 'bg-gradient-to-r from-orange-500/10 to-transparent text-white' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }
            `}
        >
            {/* Active Border Indicator */}
            {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-orange-500 rounded-r-full shadow-[0_0_10px_#f97316]" />
            )}

            <div className="flex items-center gap-3 pl-2">
                <Icon 
                    size={18} 
                    className={`transition-colors duration-300 ${isActive ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} 
                />
                <span className={`text-sm font-medium ${isActive ? 'translate-x-1' : ''} transition-transform duration-300`}>
                    {label}
                </span>
            </div>

            {/* Right Side Indicators */}
            <div className="flex items-center gap-2">
                {badge && (
                    <span className="text-[9px] font-bold bg-white/5 border border-white/5 px-1.5 py-0.5 rounded text-zinc-500">
                        {badge}
                    </span>
                )}
                {isConnected && (
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </div>
                )}
            </div>
        </button>
    );
}