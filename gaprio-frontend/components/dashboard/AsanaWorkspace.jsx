'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckSquare, Briefcase, Calendar as CalIcon, 
    ArrowRight, User, Plus, X, CheckCircle2, Circle,
    Trash2, Edit2, ExternalLink, Loader2, AlertCircle, Check, AlignLeft, FolderPlus, ArrowLeft, Terminal
} from 'lucide-react';
import ConnectState from './ConnectState';
import Image from 'next/image';
import api from '@/lib/axios';

export default function AsanaWorkspace({ isConnected, data, user, onRefresh }) {
    
    // --- State ---
    const [activeModal, setActiveModal] = useState(null); // 'create_task', 'edit_task', 'create_project'
    const [selectedTask, setSelectedTask] = useState(null);
    const [activeProjectFilter, setActiveProjectFilter] = useState(null);
    
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [completingTask, setCompletingTask] = useState(null); 
    const [notification, setNotification] = useState(null);

    // --- Data Parsing ---
    const projects = data?.projects || [];
    const rawTasks = data?.tasks || [];
    
    const displayedTasks = activeProjectFilter 
        ? rawTasks.filter(t => t.projects?.some(p => p.gid === activeProjectFilter))
        : rawTasks;

    // --- Helpers ---
    const handleAuth = () => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/asana?userId=${user?.id}`;
    
    const showToast = (type, text) => {
        setNotification({ type, text });
        setTimeout(() => setNotification(null), 3000);
    };

    const openEditModal = (task) => {
        setSelectedTask(task);
        setFormData({
            name: task.name,
            notes: task.notes || '',
            date: task.due_on || ''
        });
        setActiveModal('edit_task');
    };

    // --- CRUD Actions: TASKS ---
    const handleCreateTask = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/integrations/asana/tasks', {
                name: formData.name,
                notes: formData.notes,
                date: formData.date,
                projectGid: formData.projectGid || activeProjectFilter || null
            });
            showToast('success', 'Task injected into Asana.');
            setActiveModal(null);
            setFormData({});
            if (onRefresh) onRefresh();
        } catch (err) { showToast('error', 'Failed to create task.'); } 
        finally { setLoading(false); }
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/integrations/asana/tasks/${selectedTask.gid}`, {
                name: formData.name,
                notes: formData.notes,
                date: formData.date
            });
            showToast('success', 'Task telemetry updated.');
            setActiveModal(null);
            setFormData({});
            if (onRefresh) onRefresh();
        } catch (err) { showToast('error', 'Failed to update task.'); } 
        finally { setLoading(false); }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await api.delete(`/integrations/asana/tasks/${taskId}`);
            showToast('success', 'Task permanently wiped.');
            if (onRefresh) onRefresh();
        } catch (err) { showToast('error', 'Failed to wipe task.'); }
    };

    const handleCompleteTask = async (taskId) => {
        setCompletingTask(taskId);
        try {
            await api.put(`/integrations/asana/tasks/${taskId}/complete`);
            showToast('success', 'Task marked as completed.');
            if (onRefresh) onRefresh();
        } catch (err) { showToast('error', 'Failed to complete task.'); } 
        finally { setCompletingTask(null); }
    };

    // --- CRUD Actions: PROJECTS ---
    const handleCreateProject = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/integrations/asana/projects', {
                name: formData.projectName,
                color: 'dark-orange' // Hardcoded to match theme
            });
            showToast('success', 'Project Vault initialized.');
            setActiveModal(null);
            setFormData({});
            if (onRefresh) onRefresh();
        } catch (err) { showToast('error', 'Failed to initialize project.'); } 
        finally { setLoading(false); }
    };

    const handleDeleteProject = async (projectId) => {
        if (!confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
        try {
            await api.delete(`/integrations/asana/projects/${projectId}`);
            showToast('success', 'Project eradicated.');
            setActiveProjectFilter(null);
            if (onRefresh) onRefresh();
        } catch (err) { showToast('error', 'Failed to delete project.'); }
    };

    if (!isConnected) return <ConnectState icon={CheckSquare} title="Initialize Asana Engine" onClick={handleAuth} />;

    return (
        <div className="w-full h-full flex flex-col relative pb-10">
            
            {/* --- ELITE TOAST --- */}
            <AnimatePresence>
                {notification && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={`fixed bottom-8 right-8 z-[200] px-5 py-3.5 rounded-xl shadow-2xl border flex items-center gap-3 ${notification.type === 'success' ? 'bg-[#0a0a0a] border-orange-500/30 text-zinc-100 shadow-[0_10px_40px_rgba(249,115,22,0.15)]' : 'bg-[#0a0a0a] border-red-500/30 text-zinc-100 shadow-[0_10px_40px_rgba(239,68,68,0.15)]'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'}`}>
                            {notification.type === 'success' ? <Check size={16} strokeWidth={3} /> : <AlertCircle size={16} strokeWidth={3} />}
                        </div>
                        <span className="text-[13px] font-semibold tracking-wide pr-2">{notification.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MASTER HEADER --- */}
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-inner">
                        <Image src="/companylogo/asana.png" alt="Asana" width={24} height={24} className="object-contain" style={{ width: "auto", height: "auto" }} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-white tracking-tight">Asana Command</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Active Sync</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => { setFormData({}); setActiveModal('create_task'); }} 
                    className="w-full md:w-auto px-6 py-3 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                >
                    <Plus size={16} /> Deploy Task
                </button>
            </div>

            {/* --- SPLIT PANE LAYOUT --- */}
            <div className="flex-1 bg-[#050505] border border-zinc-800 rounded-[24px] shadow-2xl overflow-hidden flex h-full min-h-[700px]">
                
                {/* LEFT SIDEBAR: PROJECTS DIRECTORY */}
                <div className={`w-full md:w-80 bg-[#0a0a0a] border-r border-zinc-800 shrink-0 flex-col ${activeProjectFilter !== null ? 'hidden md:flex' : 'flex'}`}>
                    
                    <div className="p-6 border-b border-zinc-800/80 bg-[#050505]/50 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center shadow-inner">
                                <Briefcase size={14} className="text-orange-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Project Vault</h3>
                        </div>
                        <button onClick={() => { setFormData({}); setActiveModal('create_project'); }} className="p-1.5 bg-zinc-900 hover:bg-orange-500 text-zinc-400 hover:text-white rounded-lg transition-colors border border-zinc-800 hover:border-orange-500">
                            <Plus size={14} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1.5" data-lenis-prevent="true">
                        
                        <button 
                            onClick={() => setActiveProjectFilter(null)}
                            className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all outline-none ${activeProjectFilter === null ? 'bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-inner' : 'border border-transparent hover:bg-zinc-900 text-zinc-400'}`}
                        >
                            <span className="text-[13px] font-bold">All Assigned Tasks</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${activeProjectFilter === null ? 'bg-orange-500/20 text-orange-400' : 'bg-zinc-900 border border-zinc-800 text-zinc-500'}`}>{rawTasks.length}</span>
                        </button>

                        <div className="pt-4 pb-2 px-3 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Workspaces</span>
                        </div>

                        {projects.map(project => (
                            <div key={project.gid} className="relative group">
                                <button 
                                    onClick={() => setActiveProjectFilter(project.gid)}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all outline-none ${activeProjectFilter === project.gid ? 'bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-inner' : 'border border-transparent hover:bg-zinc-900 text-zinc-400'}`}
                                >
                                    <div className="flex items-center gap-3 min-w-0 pr-6">
                                        <div className={`w-2 h-2 rounded-full shadow-sm ${activeProjectFilter === project.gid ? 'bg-orange-500 animate-pulse' : 'bg-zinc-600'}`} />
                                        <span className={`text-[13px] font-medium truncate ${activeProjectFilter === project.gid ? 'font-bold' : ''}`}>{project.name}</span>
                                    </div>
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.gid); }} 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Active Profile Dock */}
                    <div className="p-4 border-t border-zinc-800/80 bg-[#050505]/80 shrink-0">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 shadow-inner cursor-default">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                                    {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-semibold text-zinc-100 truncate">{user?.full_name}</p>
                                <p className="text-[10px] text-orange-500 font-mono uppercase tracking-widest">Asana Sync Active</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR: MASTER TASK LIST */}
                <div className={`flex-1 flex-col relative overflow-hidden bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] bg-[position:0_0,12px_12px] ${activeProjectFilter === null ? 'hidden md:flex' : 'flex'}`}>
                    <div className="absolute inset-0 bg-[#050505]/95 pointer-events-none" />
                    
                    <div className="h-[84px] px-6 border-b border-zinc-800/80 bg-[#0a0a0a]/50 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setActiveProjectFilter(null)} className="md:hidden p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                                <ArrowLeft size={16} />
                            </button>
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                                    <CheckSquare size={18} className="text-orange-500" /> 
                                    {activeProjectFilter ? projects.find(p => p.gid === activeProjectFilter)?.name : 'Master Action Items'}
                                </h3>
                                <p className="text-[11px] text-zinc-500 font-medium mt-0.5">Manage and execute workspace deliverables.</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg shadow-inner">
                            <Terminal size={14} className="text-orange-500" />
                            <span className="text-[11px] font-mono text-zinc-300 tracking-wider">{displayedTasks.length} TARGETS</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 z-10" data-lenis-prevent="true">
                        {displayedTasks.length > 0 ? displayedTasks.map(task => (
                            <div key={task.gid} className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 ${task.completed ? 'bg-zinc-900/30 border-zinc-800/50 opacity-60' : 'bg-[#0a0a0a] border-zinc-800 hover:border-orange-500/40 hover:shadow-lg'}`}>
                                
                                <button 
                                    disabled={task.completed || completingTask === task.gid}
                                    onClick={() => handleCompleteTask(task.gid)}
                                    className={`mt-0.5 shrink-0 transition-colors ${task.completed ? 'text-green-500' : 'text-zinc-600 hover:text-orange-500'}`}
                                >
                                    {completingTask === task.gid ? <Loader2 size={20} className="animate-spin text-orange-500" /> : task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-[15px] font-bold truncate transition-all ${task.completed ? 'text-zinc-500 line-through decoration-zinc-600' : 'text-zinc-100 group-hover:text-white'}`}>
                                        {task.name}
                                    </h4>
                                    
                                    {task.notes && (
                                        <div className="flex items-start gap-2 mt-2 text-zinc-500 bg-[#050505] border border-zinc-800/50 p-3 rounded-xl shadow-inner">
                                            <AlignLeft size={14} className="mt-0.5 shrink-0 text-zinc-600" />
                                            <p className="text-[13px] line-clamp-2 leading-relaxed">{task.notes}</p>
                                        </div>
                                    )}
                                    
                                    <div className="flex flex-wrap items-center gap-2 mt-4">
                                        {task.due_on && (
                                            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${new Date(task.due_on) < new Date() && !task.completed ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}>
                                                <CalIcon size={12} />
                                                <span>{new Date(task.due_on).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        )}
                                        {task.projects && task.projects[0] && (
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
                                                <Briefcase size={12} />
                                                <span className="truncate max-w-[150px]">{task.projects[0].name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="opacity-0 group-hover:opacity-100 flex bg-[#050505] border border-zinc-700 rounded-lg shadow-xl overflow-hidden transition-opacity duration-200 shrink-0">
                                    <button onClick={() => openEditModal(task)} className="p-2.5 hover:bg-zinc-800 text-zinc-400 hover:text-blue-400 transition-colors" title="Edit Task"><Edit2 size={14} /></button>
                                    <div className="w-px bg-zinc-800" />
                                    {task.permalink_url && (
                                        <>
                                            <a href={task.permalink_url} target="_blank" className="p-2.5 hover:bg-zinc-800 text-zinc-400 hover:text-orange-500 transition-colors flex items-center justify-center" title="Open in Asana"><ExternalLink size={14} /></a>
                                            <div className="w-px bg-zinc-800" />
                                        </>
                                    )}
                                    <button onClick={() => handleDeleteTask(task.gid)} className="p-2.5 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 transition-colors" title="Delete Task"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                                <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-[28px] flex items-center justify-center mb-5 shadow-inner">
                                    <CheckSquare size={32} className="text-zinc-600" />
                                </div>
                                <h2 className="text-xl font-bold text-zinc-300 mb-1">Matrix is clear.</h2>
                                <p className="text-sm text-zinc-500 max-w-[250px] mx-auto">No active parameters found in this sector. Deploy a task to begin.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}
            <AnimatePresence>
                
                {/* 1. CREATE / EDIT TASK MODAL */}
                {(activeModal === 'create_task' || activeModal === 'edit_task') && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-[24px] shadow-2xl flex flex-col relative z-10">
                            
                            <div className="flex justify-between items-center p-6 border-b border-zinc-800/80 bg-[#050505]/50 rounded-t-[24px]">
                                <h2 className="text-xs font-bold text-zinc-400 tracking-widest uppercase">{activeModal === 'create_task' ? 'Deploy New Task' : 'Modify Task Telemetry'}</h2>
                                <button onClick={() => setActiveModal(null)} className="text-zinc-500 hover:text-white transition-colors bg-zinc-900 p-1.5 rounded-full"><X size={14}/></button>
                            </div>

                            <form onSubmit={activeModal === 'create_task' ? handleCreateTask : handleUpdateTask} className="p-6 space-y-5">
                                
                                <InputGroup label="Task Designation" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} icon={CheckSquare} placeholder="Update structural integrity..." required />
                                <InputGroup label="Deadline / Due Date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} icon={CalIcon} type="date" />
                                
                                {activeModal === 'create_task' && projects.length > 0 && (
                                    <div className="space-y-2 w-full">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Assign to Project</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"><Briefcase size={16} /></div>
                                            <select 
                                                value={formData.projectGid || ''} onChange={e => setFormData({...formData, projectGid: e.target.value})}
                                                className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-3.5 pl-11 pr-4 text-[13px] text-zinc-100 focus:border-orange-500/50 outline-none shadow-inner appearance-none cursor-pointer" 
                                            >
                                                <option value="" disabled>-- Select Target Project --</option>
                                                {projects.map(p => <option key={p.gid} value={p.gid}>{p.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2 w-full">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Operational Notes</label>
                                    <textarea 
                                        value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})}
                                        placeholder="Add context or instructions here..." rows={4} 
                                        className="w-full bg-[#050505] border border-zinc-800 rounded-xl p-4 text-[13px] text-zinc-100 placeholder:text-zinc-700 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-inner resize-none custom-scrollbar" 
                                    />
                                </div>

                                <div className="pt-2">
                                    <button disabled={loading} type="submit" className="w-full bg-orange-500 text-white py-3.5 rounded-xl text-[13px] font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-95">
                                        {loading ? 'Processing...' : activeModal === 'create_task' ? 'Deploy Task' : 'Commit Edits'}
                                    </button>
                                </div>
                            </form>

                        </motion.div>
                    </div>
                )}

                {/* 2. CREATE PROJECT MODAL */}
                {activeModal === 'create_project' && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-[24px] shadow-2xl flex flex-col relative z-10">
                            <div className="flex justify-between items-center p-6 border-b border-zinc-800/80 bg-[#050505]/50 rounded-t-[24px]">
                                <h2 className="text-xs font-bold text-zinc-400 tracking-widest uppercase">Initialize Project</h2>
                                <button onClick={() => setActiveModal(null)} className="text-zinc-500 hover:text-white transition-colors bg-zinc-900 p-1.5 rounded-full"><X size={14}/></button>
                            </div>
                            <form onSubmit={handleCreateProject} className="p-6 space-y-5">
                                <InputGroup label="Project Name" value={formData.projectName} onChange={e => setFormData({...formData, projectName: e.target.value})} icon={FolderPlus} placeholder="e.g. Q3 Marketing Launch" required />
                                <div className="pt-2">
                                    <button disabled={loading} type="submit" className="w-full bg-orange-500 text-white py-3.5 rounded-xl text-[13px] font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-95">
                                        {loading ? 'Processing...' : 'Create Project'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

            </AnimatePresence>
        </div>
    );
}

// --- SUB-COMPONENTS ---
function InputGroup({ label, value, onChange, icon: Icon, type = "text", placeholder, required }) {
    return (
        <div className="space-y-2 w-full">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-zinc-600 group-focus-within:text-orange-500 transition-colors z-10">
                    <Icon size={16} />
                </div>
                <input 
                    type={type} value={value || ''} onChange={onChange} placeholder={placeholder} required={required}
                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-[13px] text-zinc-100 placeholder:text-zinc-700 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-[#0a0a0a] outline-none transition-all shadow-inner" 
                />
            </div>
        </div>
    );
}