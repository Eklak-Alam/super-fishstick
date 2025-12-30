'use client';
import { motion } from 'framer-motion';
import { 
    Mail, MessageSquare, CheckSquare, Zap, 
    Activity, Clock, ArrowUpRight, ShieldCheck 
} from 'lucide-react';
import StatCard from './StatCard';

export default function OverviewTab({ user, googleData, slackData }) {
    
    // --- Metrics Calculation ---
    const connections = user?.connections || [];
    const activeConnections = connections.length;
    
    const emailCount = googleData.emails?.length || 0;
    const meetingCount = googleData.meetings?.length || 0;
    const channelCount = slackData.channels?.length || 0;

    // --- Time Greeting ---
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8 pb-10">
            
            {/* --- Hero Section --- */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600/20 to-purple-600/20 border border-white/10 p-8 md:p-10">
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">{user.full_name?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-zinc-300 max-w-xl text-sm md:text-base leading-relaxed">
                        Your workspace is running at optimal performance. You have <strong className="text-white">{meetingCount} meetings</strong> scheduled today and <strong className="text-white">{emailCount} unread emails</strong> pending.
                    </p>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
            </div>

            {/* --- Stats Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    label="Total Connections" 
                    value={activeConnections} 
                    icon={Zap} 
                    color="text-yellow-400" 
                    bg="bg-yellow-400/10" 
                    trend="+1 this week"
                />
                <StatCard 
                    label="Recent Emails" 
                    value={emailCount} 
                    icon={Mail} 
                    color="text-red-400" 
                    bg="bg-red-400/10" 
                    sub="Syncing live"
                />
                <StatCard 
                    label="Slack Channels" 
                    value={channelCount} 
                    icon={MessageSquare} 
                    color="text-purple-400" 
                    bg="bg-purple-400/10" 
                    sub="Active workspaces"
                />
                <StatCard 
                    label="System Health" 
                    value="100%" 
                    icon={Activity} 
                    color="text-green-400" 
                    bg="bg-green-400/10" 
                    sub="All systems operational"
                />
            </div>

            {/* --- Split View: Recent Activity & Quick Actions --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Recent Activity Feed */}
                <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Clock size={18} className="text-zinc-500" /> Recent Activity
                        </h3>
                        <span className="text-xs text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">Real-time</span>
                    </div>

                    <div className="space-y-1">
                        {/* Google Activity */}
                        {googleData.emails?.slice(0, 3).map((email, i) => (
                            <ActivityRow 
                                key={`email-${i}`}
                                icon={Mail}
                                color="text-red-400"
                                bg="bg-red-500/10"
                                title={email.subject}
                                subtitle={`Email from ${email.from.split('<')[0]}`}
                                time="Just now"
                            />
                        ))}
                        
                        {/* Slack Activity */}
                        {slackData.channels?.slice(0, 3).map((channel, i) => (
                            <ActivityRow 
                                key={`slack-${i}`}
                                icon={MessageSquare}
                                color="text-purple-400"
                                bg="bg-purple-500/10"
                                title={`#${channel.name}`}
                                subtitle={`${channel.members_count} members active`}
                                time="Active today"
                            />
                        ))}

                        {/* Fallback */}
                        {!emailCount && !channelCount && (
                            <div className="py-10 text-center text-zinc-500 text-sm">
                                No recent activity to display. Connect apps to see data here.
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. System Status / Quick Info */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-zinc-500" /> Connection Status
                    </h3>
                    
                    <div className="space-y-3 flex-1">
                        <StatusItem label="Google Workspace" isConnected={connections.some(c => c.provider === 'google')} />
                        <StatusItem label="Slack" isConnected={connections.some(c => c.provider === 'slack')} />
                        <StatusItem label="Asana" isConnected={connections.some(c => c.provider === 'asana')} />
                        <StatusItem label="Miro" isConnected={connections.some(c => c.provider === 'miro')} />
                        <StatusItem label="Jira" isConnected={connections.some(c => c.provider === 'jira')} />
                        <StatusItem label="Zoho CRM" isConnected={connections.some(c => c.provider === 'zoho')} />
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5">
                        <p className="text-xs text-zinc-500 text-center">Gaprio Workspace v2.0 • Stable Build</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// --- SUB-COMPONENTS ---

function ActivityRow({ icon: Icon, color, bg, title, subtitle, time }) {
    return (
        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-default">
            <div className={`p-2.5 rounded-xl ${bg} ${color} border border-white/5 shrink-0`}>
                <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">{title}</h4>
                <p className="text-xs text-zinc-500 truncate">{subtitle}</p>
            </div>
            <div className="text-xs text-zinc-600 whitespace-nowrap">{time}</div>
        </div>
    );
}

function StatusItem({ label, isConnected }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-sm text-zinc-300">{label}</span>
            <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase font-bold ${isConnected ? 'text-green-500' : 'text-zinc-600'}`}>
                    {isConnected ? 'Online' : 'Offline'}
                </span>
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-zinc-700'}`} />
            </div>
        </div>
    );
}