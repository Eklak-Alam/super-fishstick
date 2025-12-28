'use client';
import { motion } from 'framer-motion';
import { ListTodo, ExternalLink, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import ConnectState from './ConnectState';

export default function JiraWorkspace({ isConnected, data, user }) {
    
    // Auth Handler
    const handleAuth = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/jira?userId=${user?.id}`;
    };

    // Helper: Priority Color
    const getPriorityColor = (p) => {
        const priority = p?.toLowerCase() || '';
        if (priority.includes('high')) return 'text-red-400 bg-red-500/10 border-red-500/20';
        if (priority.includes('medium')) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    };

    if (!isConnected) return <ConnectState icon={ListTodo} title="Connect Jira Software" onClick={handleAuth} />;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto h-full flex flex-col">
            
            <div className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white">Engineering Command</h2>
                    <p className="text-sm text-blue-400 flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" /> 
                        Jira Sync Active
                    </p>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col min-h-[500px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/[0.02] text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <div className="col-span-6 md:col-span-7">Issue Summary</div>
                    <div className="col-span-3 md:col-span-2">Status</div>
                    <div className="col-span-3 md:col-span-2">Priority</div>
                    <div className="hidden md:block col-span-1 text-right">Action</div>
                </div>

                {/* Table Body */}
                <div className="overflow-y-auto custom-scrollbar flex-1">
                    {data.issues?.length ? data.issues.map(issue => (
                        <div key={issue.id} className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors group">
                            
                            {/* Summary */}
                            <div className="col-span-6 md:col-span-7 flex items-center gap-3 overflow-hidden">
                                <span className="shrink-0 text-[10px] font-mono text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{issue.key}</span>
                                <span className="text-sm font-medium text-zinc-200 truncate group-hover:text-white">{issue.summary}</span>
                            </div>

                            {/* Status */}
                            <div className="col-span-3 md:col-span-2">
                                <div className="flex items-center gap-2 text-xs text-zinc-400">
                                    {issue.status === 'Done' ? <CheckCircle2 size={14} className="text-green-500" /> : <Circle size={14} className="text-zinc-600" />}
                                    <span className={issue.status === 'Done' ? 'text-green-400' : ''}>{issue.status}</span>
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="col-span-3 md:col-span-2">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getPriorityColor(issue.priority)}`}>
                                    {issue.priority}
                                </span>
                            </div>

                            {/* Link */}
                            <div className="hidden md:flex col-span-1 justify-end">
                                <a href={issue.link} target="_blank" className="p-2 text-zinc-600 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                    <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    )) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <ListTodo size={32} className="mb-3 text-zinc-600" />
                            <p className="text-zinc-500">No issues assigned to you.</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}