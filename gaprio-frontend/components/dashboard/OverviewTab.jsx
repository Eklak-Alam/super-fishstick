'use client';
import { 
    Clock, Settings, ArrowRight, Activity, Zap, Mail, MessageSquare, ShieldCheck, CheckSquare, LayoutTemplate, ListTodo, Briefcase
} from 'lucide-react';
import Image from 'next/image';

export default function OverviewTab({ user, googleData, slackData, setActiveTab }) {
    const connections = user?.connections || [];
    const activeConnections = connections.length;
    
    const emailCount = googleData?.emails?.length || 0;
    const meetingCount = googleData?.meetings?.length || 0;
    const channelCount = slackData?.channels?.length || 0;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="w-full max-w-[1800px] mx-auto space-y-6 pb-12">
            
            {/* --- FULL WIDTH HERO CONSOLE --- */}
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl flex flex-col overflow-hidden shadow-2xl">
                
                <div className="p-6 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative z-10">
                        <h1 className="text-2xl md:text-3xl font-semibold text-zinc-100 mb-3 tracking-tight">
                            {greeting}, <span className="text-white">{user?.full_name?.split(' ')[0]}</span>.
                        </h1>
                        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
                            System overview is live. You have <strong className="text-zinc-200">{meetingCount} scheduled events</strong> and <strong className="text-zinc-200">{emailCount} pending payloads</strong> requiring your attention across your connected ecosystem today.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-4 border-t border-zinc-800 bg-[#050505] divide-x divide-zinc-800 border-b-0 xl:divide-y-0 divide-y">
                    <MetricSegment label="Active Connections" value={activeConnections} sub="Nodes online" icon={Zap} onClick={() => {}} activeColor="bg-orange-500" />
                    <MetricSegment label="Recent Emails" value={emailCount} sub="Unread in inbox" icon={Mail} onClick={() => setActiveTab('google')} activeColor="bg-orange-500" isActionable />
                    <MetricSegment label="Slack Intelligence" value={channelCount} sub="Active workspaces" icon={MessageSquare} onClick={() => setActiveTab('slack')} activeColor="bg-orange-500" isActionable />
                    
                    <div className="relative flex flex-col p-6 lg:p-8 bg-[#050505]">
                        <div className="flex items-center gap-2 mb-3 text-zinc-400">
                            <Activity size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">System Status</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-semibold text-white tracking-tight">100%</span>
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10">
                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                            </div>
                        </div>
                        <span className="text-xs text-zinc-500 mt-2 font-medium">All infrastructure operational</span>
                    </div>
                </div>
            </div>

            {/* --- FULL WIDTH SPLIT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                {/* 1. Recent Activity Feed */}
                <div className="lg:col-span-2 xl:col-span-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-[#050505]/50">
                        <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                            <Clock size={16} className="text-orange-500" /> Recent Activity Log
                        </h3>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2.5 py-1 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> Live
                        </span>
                    </div>

                    <div className="flex-1 p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {googleData?.emails?.slice(0, 4).map((email, i) => (
                            <ActivityRow key={`email-${i}`} icon={Mail} title={email.subject || 'No Subject'} subtitle={email.from?.split('<')[0] || 'Unknown Sender'} time="Just now" onClick={() => setActiveTab('google')} />
                        ))}
                        {slackData?.channels?.slice(0, 4).map((channel, i) => (
                            <ActivityRow key={`slack-${i}`} icon={MessageSquare} title={`#${channel.name}`} subtitle={`${channel.members_count} active members`} time="Today" onClick={() => setActiveTab('slack')} />
                        ))}

                        {(!emailCount && !channelCount) && (
                            <div className="col-span-full flex flex-col items-center justify-center p-16 text-center">
                                <Activity size={24} className="text-zinc-700 mb-4" />
                                <p className="text-sm text-zinc-300 font-semibold">Timeline is clear</p>
                                <p className="text-[13px] text-zinc-500 mt-1 max-w-[250px] mx-auto">Connect your infrastructure to begin syncing real-time data.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Integrations List */}
                <div className="col-span-1 bg-[#0a0a0a] border border-zinc-800 rounded-xl flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-[#050505]/50">
                        <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-zinc-400" /> Active Nodes
                        </h3>
                        <Settings size={14} className="text-zinc-600 hover:text-white cursor-pointer transition-colors" />
                    </div>
                    
                    <div className="p-3 space-y-1">
                        <IntegrationItem label="Google Workspace" imageSrc="/companylogo/google.webp" isConnected={connections.some(c => c.provider === 'google')} onClick={() => setActiveTab('google')} />
                        <IntegrationItem label="Slack" imageSrc="/companylogo/slack.png" isConnected={connections.some(c => c.provider === 'slack')} onClick={() => setActiveTab('slack')} />
                        <IntegrationItem label="Asana" imageSrc="/companylogo/asana.png" isConnected={connections.some(c => c.provider === 'asana')} onClick={() => setActiveTab('asana')} />
                        <IntegrationItem label="Miro" imageSrc="/companylogo/miro.png" isConnected={connections.some(c => c.provider === 'miro')} onClick={() => setActiveTab('miro')} />
                        <IntegrationItem label="Jira Software" imageSrc="/companylogo/jira.png" isConnected={connections.some(c => c.provider === 'jira')} onClick={() => setActiveTab('jira')} />
                        <IntegrationItem label="Zoho CRM" imageSrc="/companylogo/zoho.png" isConnected={connections.some(c => c.provider === 'zoho')} onClick={() => setActiveTab('zoho')} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function MetricSegment({ label, value, sub, icon: Icon, onClick, activeColor, isActionable }) {
    return (
        <button 
            onClick={onClick}
            className={`relative flex flex-col text-left p-6 lg:p-8 bg-[#050505] transition-all duration-300 outline-none
                ${isActionable ? 'hover:bg-zinc-900 cursor-pointer group' : 'cursor-default'}
            `}
        >
            {isActionable && (
                <div className={`absolute top-0 left-0 h-full w-1 ${activeColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
            )}

            <div className={`flex items-center gap-2 mb-3 text-zinc-400 ${isActionable && 'group-hover:text-zinc-200 transition-colors'}`}>
                <Icon size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
            </div>
            
            <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-semibold text-white tracking-tight">{value}</span>
                {isActionable && (
                    <ArrowRight size={14} className="text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                )}
            </div>
            
            <span className="text-xs text-zinc-500 font-medium">{sub}</span>
        </button>
    );
}

function ActivityRow({ icon: Icon, title, subtitle, time, onClick }) {
    return (
        <button 
            onClick={onClick}
            className="w-full flex items-center justify-between p-3.5 rounded-lg hover:bg-zinc-900 transition-all duration-200 group text-left outline-none border border-transparent hover:border-zinc-800/50"
        >
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#050505] border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-orange-500 group-hover:border-orange-500/30 transition-colors shrink-0 shadow-inner">
                    <Icon size={18} />
                </div>
                <div className="min-w-0">
                    <h4 className="text-sm font-medium text-zinc-200 truncate">{title}</h4>
                    <p className="text-[13px] text-zinc-500 truncate mt-0.5">{subtitle}</p>
                </div>
            </div>
            <div className="text-[11px] text-zinc-600 font-mono hidden sm:block whitespace-nowrap pl-4">{time}</div>
        </button>
    );
}

function IntegrationItem({ label, imageSrc, isConnected, onClick }) {
    return (
        <button 
            onClick={onClick}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-zinc-900 hover:border-zinc-800 transition-all outline-none group"
        >
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lgrelative flex items-center justify-center transition-colors shadow-inner">
                    {/* 👇 ADDED style={{ width: "auto", height: "auto" }} to fix Next.js warning */}
                    <Image 
                        src={imageSrc} 
                        alt={label} 
                        width={16} 
                        height={16} 
                        className={`object-contain ${!isConnected && 'transition-all'}`} 
                        style={{ width: "auto", height: "auto" }}
                    />
                </div>
                <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
                    {label}
                </span>
            </div>

            {isConnected ? (
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                </div>
            ) : (
                <span className="text-[11px] font-medium text-zinc-600 group-hover:text-orange-500 transition-colors">
                    Connect
                </span>
            )}
        </button>
    );
}