'use client';
import { motion } from 'framer-motion';
import { CheckSquare, Briefcase, List, Calendar as CalIcon, ArrowRight, User } from 'lucide-react';
import ConnectState from './ConnectState';

export default function AsanaWorkspace({ isConnected, data, user }) {
    
    // Auth Handler: Sends Current User ID to link account
    const handleAuth = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/asana?userId=${user?.id}`;
    };

    if (!isConnected) return <ConnectState icon={CheckSquare} title="Connect Asana Workspace" onClick={handleAuth} />;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white">Project Command</h2>
                    <p className="text-sm text-pink-400 flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_#ec4899]" /> 
                        Asana Sync Active
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[500px]">
                {/* 1. PROJECTS LIST */}
                <WidgetCard title="Active Projects" icon={Briefcase} count={data.projects?.length}>
                    {data.projects?.length ? data.projects.map(project => (
                        <div key={project.gid} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl mb-3 border border-white/5 group transition-all flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-10 rounded-full" style={{ backgroundColor: project.color || '#FC636B' }} />
                                <div>
                                    <h4 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">{project.name}</h4>
                                    <p className="text-xs text-zinc-500">Project ID: {project.gid}</p>
                                </div>
                            </div>
                            <ArrowRight size={16} className="text-zinc-600 group-hover:text-white" />
                        </div>
                    )) : <EmptyState text="No active projects found." />}
                </WidgetCard>

                {/* 2. TASKS LIST */}
                <WidgetCard title="My Tasks" icon={CheckSquare} count={data.tasks?.length}>
                    {data.tasks?.length ? data.tasks.map(task => (
                        <div key={task.gid} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl mb-3 border border-white/5 group transition-all">
                            <div className="flex items-start gap-3">
                                <div className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-zinc-600'}`}>
                                    {task.completed && <List size={12} className="text-black" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm font-medium truncate ${task.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>
                                        {task.name}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-2">
                                        {task.due_on && (
                                            <div className="flex items-center gap-1 text-xs text-zinc-400">
                                                <CalIcon size={12} className="text-pink-500" />
                                                <span>{new Date(task.due_on).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                                            <User size={12} />
                                            <span>Assigned to me</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : <EmptyState text="You have no tasks assigned." />}
                </WidgetCard>
            </div>
        </motion.div>
    );
}

function WidgetCard({ title, icon: Icon, children, count }) {
    return (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col h-full overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <Icon size={18} className="text-pink-500"/>
                    <h3 className="font-bold text-white">{title}</h3>
                </div>
                {count > 0 && <span className="text-[10px] font-bold bg-pink-500/10 text-pink-400 px-2 py-1 rounded-full">{count}</span>}
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-1">{children}</div>
        </div>
    );
}

const EmptyState = ({ text }) => (
    <div className="h-full flex flex-col items-center justify-center opacity-40 pb-10">
        <List size={24} className="mb-2 text-zinc-500"/> <p className="text-sm text-zinc-500">{text}</p>
    </div>
);