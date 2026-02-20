'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ListTodo, ExternalLink, AlertCircle, CheckCircle2, 
    Circle, Plus, MessageSquare, X, Send, Zap, Layers
} from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/axios';

export default function JiraWorkspace({ isConnected, data, user, onRefresh }) {
    
    // --- State ---
    const [activeModal, setActiveModal] = useState(null); // 'create_issue', 'view_issue'
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [formData, setFormData] = useState({});
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(false);

    // --- Helpers ---
    const handleAuth = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/jira?userId=${user?.id}`;
    };

    const getPriorityColor = (p) => {
        const priority = p?.toLowerCase() || '';
        if (priority.includes('high') || priority.includes('critical')) return 'text-red-400 bg-red-500/10 border-red-500/20';
        if (priority.includes('medium')) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    };

    // --- Actions ---
    const handleCreateIssue = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/integrations/jira/issues', {
                summary: formData.summary,
                description: formData.description,
                projectKey: formData.projectKey, 
                issueType: 'Task'
            });
            alert('Issue Created Successfully!');
            setActiveModal(null);
            setFormData({});
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error(err);
            alert('Failed to create issue. Ensure Project Key is valid.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setLoading(true);
        try {
            await api.post(`/integrations/jira/issues/${selectedIssue.key}/comment`, {
                comment: commentText
            });
            alert('Comment added!');
            setCommentText('');
            setActiveModal(null);
        } catch (err) {
            alert('Failed to add comment.');
        } finally {
            setLoading(false);
        }
    };

    const openIssue = (issue) => {
        setSelectedIssue(issue);
        setActiveModal('view_issue');
    };

    // --- DISCONNECTED STATE (Clean Dotted Border) ---
    if (!isConnected) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center min-h-[70vh] bg-[#050505] rounded-3xl border-2 border-dashed border-zinc-800 p-6">
                <div className="flex flex-col items-center text-center max-w-md">
                    <div className="w-20 h-20 mb-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-4 shadow-sm relative overflow-hidden group">
                        <Image src="/companylogo/jira.png" alt="Jira" width={48} height={48} className="object-contain relative z-10" priority />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Connect Jira Engine</h2>
                    <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                        Unify your engineering workflows. Track bugs, manage sprints, and deploy tasks seamlessly from your workspace.
                    </p>
                    <button 
                        onClick={handleAuth}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-md"
                    >
                        <Zap size={16} /> Initialize Connection
                    </button>
                </div>
            </div>
        );
    }

    // --- CONNECTED DASHBOARD ---
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto h-full flex flex-col relative pb-6">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center p-1.5 shadow-sm">
                            <Image src="/companylogo/jira.png" alt="Jira" width={20} height={20} className="object-contain" />
                        </div>
                        Engineering Command
                    </h2>
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium text-zinc-500">
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" /> 
                        Jira Sync Active
                    </div>
                </div>
                <button 
                    onClick={() => setActiveModal('create_issue')} 
                    className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-sm"
                >
                    <Plus size={16}/> Create Issue
                </button>
            </div>

            {/* Issues Table */}
            <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col min-h-[500px]">
                
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800 bg-zinc-900/30 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden md:grid">
                    <div className="col-span-7 pl-2">Issue Summary</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Priority</div>
                    <div className="col-span-1 text-right pr-2">Action</div>
                </div>

                {/* Table Body */}
                <div className="overflow-y-auto custom-scrollbar flex-1" data-lenis-prevent="true">
                    {data.issues?.length > 0 ? data.issues.map(issue => (
                        <div 
                            key={issue.id} 
                            onClick={() => openIssue(issue)}
                            className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-4 border-b border-zinc-800/50 items-center hover:bg-zinc-900/50 transition-colors group cursor-pointer"
                        >
                            {/* Summary */}
                            <div className="md:col-span-7 flex items-center gap-3 overflow-hidden pl-0 md:pl-2">
                                <span className="shrink-0 text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800 group-hover:border-orange-500/30 group-hover:text-orange-400 transition-colors">
                                    {issue.key}
                                </span>
                                <span className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                                    {issue.summary}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="md:col-span-2 flex items-center justify-between md:justify-start">
                                <span className="md:hidden text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Status</span>
                                <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                                    {issue.status === 'Done' ? <CheckCircle2 size={14} className="text-green-500" /> : <Circle size={14} className="text-orange-500" />}
                                    <span className={issue.status === 'Done' ? 'text-green-400' : ''}>{issue.status}</span>
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="md:col-span-2 flex items-center justify-between md:justify-start">
                                <span className="md:hidden text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Priority</span>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border tracking-wide uppercase ${getPriorityColor(issue.priority)}`}>
                                    {issue.priority}
                                </span>
                            </div>

                            {/* Link */}
                            <div className="hidden md:flex md:col-span-1 justify-end pr-2">
                                <a 
                                    href={issue.link} 
                                    target="_blank" 
                                    onClick={(e) => e.stopPropagation()} 
                                    className="p-2 text-zinc-500 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors"
                                >
                                    <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    )) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                            <Layers size={40} className="mb-3 text-zinc-600" />
                            <h3 className="text-sm font-bold text-zinc-400">No issues found</h3>
                            <p className="text-xs text-zinc-600 mt-1">You have no assigned tasks in Jira.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- CLEAN MODALS --- */}
            <AnimatePresence>
                
                {/* 1. CREATE ISSUE */}
                {activeModal === 'create_issue' && (
                    <Modal onClose={() => setActiveModal(null)} title="Create Jira Issue">
                        <form onSubmit={handleCreateIssue} className="space-y-4">
                            <InputGroup 
                                label="Project Key (e.g. GAP, PROJ)" 
                                placeholder="PROJ" 
                                onChange={e => setFormData({...formData, projectKey: e.target.value.toUpperCase()})} 
                                autoFocus 
                            />
                            <InputGroup 
                                label="Summary" 
                                placeholder="Bug: Login button alignment" 
                                onChange={e => setFormData({...formData, summary: e.target.value})} 
                            />
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Description</label>
                                <textarea 
                                    placeholder="Steps to reproduce..." 
                                    rows={4} 
                                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-3 px-4 text-sm text-zinc-200 focus:border-orange-500/50 outline-none transition-colors placeholder:text-zinc-700 resize-none custom-scrollbar" 
                                    onChange={e => setFormData({...formData, description: e.target.value})} 
                                />
                            </div>
                            <button disabled={loading} className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
                                {loading ? 'Creating...' : 'Deploy Issue'}
                            </button>
                        </form>
                    </Modal>
                )}

                {/* 2. VIEW ISSUE / ADD COMMENT */}
                {activeModal === 'view_issue' && selectedIssue && (
                    <Modal onClose={() => setActiveModal(null)} title="Issue Details">
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[11px] font-mono font-bold text-zinc-300 bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-md">{selectedIssue.key}</span>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wide ${getPriorityColor(selectedIssue.priority)}`}>{selectedIssue.priority}</span>
                                </div>
                                <h3 className="text-[15px] font-bold text-white leading-snug">{selectedIssue.summary}</h3>
                            </div>

                            <div className="bg-[#050505] p-5 rounded-2xl border border-zinc-800/80">
                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <MessageSquare size={14} className="text-orange-500" /> Add Comment
                                </h4>
                                <form onSubmit={handleAddComment}>
                                    <textarea 
                                        placeholder="Write a comment..." 
                                        rows={3} 
                                        className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-3 px-4 text-sm text-zinc-200 focus:border-orange-500/50 outline-none transition-colors placeholder:text-zinc-700 resize-none custom-scrollbar mb-4" 
                                        value={commentText}
                                        onChange={e => setCommentText(e.target.value)}
                                        required
                                    />
                                    <div className="flex justify-end items-center gap-3">
                                        <a href={selectedIssue.link} target="_blank" className="px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
                                            Open in Jira <ExternalLink size={14} />
                                        </a>
                                        <button disabled={loading} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50">
                                            {loading ? 'Posting...' : 'Send Comment'} <Send size={14} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal>
                )}

            </AnimatePresence>

        </motion.div>
    );
}

// --- REUSABLE SUB-COMPONENTS ---

function Modal({ children, onClose, title }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 10 }} 
                transition={{ duration: 0.2 }}
                className="w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
            >
                <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-[#050505]/50">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center p-1">
                            <Image src="/companylogo/jira.png" alt="Jira" width={16} height={16} className="object-contain" />
                        </div>
                        <h2 className="text-sm font-bold text-white tracking-tight">{title}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 text-zinc-500 hover:text-white transition-colors">
                        <X size={16}/>
                    </button>
                </div>
                <div className="p-5 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}

function InputGroup({ label, type = "text", placeholder, onChange, autoFocus }) {
    return (
        <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">{label}</label>
            <input 
                type={type} 
                placeholder={placeholder} 
                onChange={onChange} 
                required 
                autoFocus={autoFocus}
                className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-3 px-4 text-sm text-zinc-200 focus:border-orange-500/50 outline-none transition-colors placeholder:text-zinc-700"
            />
        </div>
    );
}