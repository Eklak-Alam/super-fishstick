'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckSquare, Briefcase, List, Calendar as CalIcon, 
    ArrowRight, User, Plus, X, CheckCircle2, Circle 
} from 'lucide-react';
import ConnectState from './ConnectState';
import api from '@/lib/axios';

export default function AsanaWorkspace({ isConnected, data, user, onRefresh }) {
    
    // --- State ---
    const [activeModal, setActiveModal] = useState(null); // 'create_task'
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [completingTask, setCompletingTask] = useState(null); // ID of task being completed

    // --- Helpers ---
    const handleAuth = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/asana?userId=${user?.id}`;
    };

    // --- Actions ---

    // 1. Create Task
    const handleCreateTask = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/integrations/asana/tasks', {
                name: formData.name,
                notes: formData.notes,
                date: formData.date
            });
            alert('Task Created Successfully!');
            setActiveModal(null);
            setFormData({});
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error(err);
            alert('Failed to create task.');
        } finally {
            setLoading(false);
        }
    };

    // 2. Mark Complete
    const handleCompleteTask = async (taskId) => {
        setCompletingTask(taskId);
        try {
            await api.put(`/integrations/asana/tasks/${taskId}/complete`);
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error(err);
            alert('Failed to update task.');
        } finally {
            setCompletingTask(null);
        }
    };

    if (!isConnected) return <ConnectState icon={CheckSquare} title="Connect Asana Workspace" onClick={handleAuth} />;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto h-full flex flex-col relative">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Project Command</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_#ec4899]" /> 
                        <p className="text-sm text-zinc-400">Asana Sync Active</p>
                    </div>
                </div>
                <button 
                    onClick={() => setActiveModal('create_task')} 
                    className="flex-1 md:flex-none bg-pink-600/10 text-pink-500 border border-pink-600/20 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-pink-600/20 transition-all text-sm shadow-lg shadow-pink-500/5"
                >
                    <Plus size={16}/> New Task
                </button>
            </div>

            {/* --- CONTENT GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 overflow-hidden pb-4">
                
                {/* 1. PROJECTS LIST */}
                <WidgetCard title="Active Projects" icon={Briefcase} count={data.projects?.length} color="text-pink-400" bg="bg-pink-500/10">
                    {data.projects?.length ? data.projects.map(project => (
                        <div key={project.gid} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl mb-3 border border-white/5 group transition-all flex justify-between items-center cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: project.color || '#FC636B' }} />
                                <div>
                                    <h4 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">{project.name}</h4>
                                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">ID: {project.gid.slice(-6)}</p>
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-black/20 text-zinc-500 group-hover:text-white transition-colors">
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    )) : <EmptyState text="No active projects found." />}
                </WidgetCard>

                {/* 2. TASKS LIST */}
                <WidgetCard title="My Tasks" icon={CheckSquare} count={data.tasks?.length} color="text-indigo-400" bg="bg-indigo-500/10">
                    {data.tasks?.length ? data.tasks.map(task => (
                        <div key={task.gid} className={`p-4 bg-white/5 rounded-xl mb-3 border border-white/5 group transition-all ${task.completed ? 'opacity-50' : 'hover:bg-white/10'}`}>
                            <div className="flex items-start gap-3">
                                
                                {/* Checkbox / Loading Spinner */}
                                <button 
                                    disabled={task.completed || completingTask === task.gid}
                                    onClick={() => handleCompleteTask(task.gid)}
                                    className={`mt-0.5 shrink-0 transition-colors ${task.completed ? 'text-green-500' : 'text-zinc-600 hover:text-green-500'}`}
                                >
                                    {completingTask === task.gid ? (
                                        <div className="w-5 h-5 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin" />
                                    ) : task.completed ? (
                                        <CheckCircle2 size={20} />
                                    ) : (
                                        <Circle size={20} />
                                    )}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm font-medium truncate transition-all ${task.completed ? 'text-zinc-500 line-through decoration-zinc-600' : 'text-zinc-200 group-hover:text-white'}`}>
                                        {task.name}
                                    </h4>
                                    
                                    <div className="flex items-center gap-4 mt-2">
                                        {task.due_on && (
                                            <div className={`flex items-center gap-1.5 text-xs ${new Date(task.due_on) < new Date() && !task.completed ? 'text-red-400' : 'text-zinc-500'}`}>
                                                <CalIcon size={12} />
                                                <span>{new Date(task.due_on).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        )}
                                        {task.projects && task.projects[0] && (
                                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-md">
                                                <Briefcase size={10} />
                                                <span className="truncate max-w-[100px]">{task.projects[0].name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : <EmptyState text="You have no tasks assigned." />}
                </WidgetCard>
            </div>

            {/* --- CREATE TASK MODAL --- */}
            <AnimatePresence>
                {activeModal === 'create_task' && (
                    <Modal onClose={() => setActiveModal(null)} title="Create New Task">
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Task Name</label>
                                <input 
                                    placeholder="e.g. Update Homepage Design" 
                                    className="input-field" 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    required 
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Due Date</label>
                                <input 
                                    type="date" 
                                    className="input-field" 
                                    onChange={e => setFormData({...formData, date: e.target.value})} 
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Description</label>
                                <textarea 
                                    placeholder="Add details here..." 
                                    rows={4} 
                                    className="input-field resize-none" 
                                    onChange={e => setFormData({...formData, notes: e.target.value})} 
                                />
                            </div>
                            <button disabled={loading} className="btn-primary w-full bg-pink-600 hover:bg-pink-700 mt-2">
                                {loading ? 'Creating...' : 'Create Task'}
                            </button>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>

        </motion.div>
    );
}

// --- SUB-COMPONENTS ---

// 1. Premium Modal
function Modal({ children, onClose, title }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 10 }} 
                className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="flex justify-between items-center p-5 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
                    <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        <X size={18}/>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}

// 2. Widget Card (Reused but with color props)
const WidgetCard = ({ title, icon: Icon, children, count, color, bg }) => (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col h-full shadow-lg overflow-hidden relative">
        <div className="p-4 border-b border-white/5 bg-[#0a0a0a] flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <div className={`p-2 ${bg} ${color} rounded-lg border border-white/5 shadow-inner`}>
                    <Icon size={16} />
                </div>
                <h3 className="font-bold text-sm text-white">{title}</h3>
            </div>
            {count > 0 && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bg} ${color}`}>{count}</span>}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
            {children}
        </div>
    </div>
);

// 3. Empty State
const EmptyState = ({ text }) => (
    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-2 border border-white/5">
            <List size={16} className="text-zinc-500" />
        </div>
        <p className="text-zinc-500 text-xs">{text}</p>
    </div>
);