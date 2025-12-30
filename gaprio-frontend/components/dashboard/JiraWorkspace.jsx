'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ListTodo, ExternalLink, AlertCircle, CheckCircle2, 
    Circle, Plus, MessageSquare, X, Send 
} from 'lucide-react';
import ConnectState from './ConnectState';
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
        if (priority.includes('medium')) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    };

    // --- Actions ---

    // 1. Create Issue
    const handleCreateIssue = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/integrations/jira/issues', {
                summary: formData.summary,
                description: formData.description,
                projectKey: formData.projectKey, // User must know this or we fetch projects (simplified for now)
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

    // 2. Add Comment
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

    if (!isConnected) return <ConnectState icon={ListTodo} title="Connect Jira Software" onClick={handleAuth} />;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto h-full flex flex-col relative">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Engineering Command</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" /> 
                        <p className="text-sm text-zinc-400">Jira Sync Active</p>
                    </div>
                </div>
                <button 
                    onClick={() => setActiveModal('create_issue')} 
                    className="flex-1 md:flex-none bg-blue-600/10 text-blue-500 border border-blue-600/20 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600/20 transition-all text-sm shadow-lg shadow-blue-500/5"
                >
                    <Plus size={16}/> Create Issue
                </button>
            </div>

            {/* --- ISSUES TABLE --- */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col min-h-[500px]">
                
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/[0.02] text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden md:grid">
                    <div className="col-span-7">Issue Summary</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Priority</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                {/* Table Body */}
                <div className="overflow-y-auto custom-scrollbar flex-1">
                    {data.issues?.length ? data.issues.map(issue => (
                        <div 
                            key={issue.id} 
                            onClick={() => openIssue(issue)}
                            className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-4 border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors group cursor-pointer"
                        >
                            
                            {/* Summary */}
                            <div className="md:col-span-7 flex items-center gap-3 overflow-hidden">
                                <span className="shrink-0 text-[10px] font-mono text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 group-hover:border-blue-500/30 transition-colors">
                                    {issue.key}
                                </span>
                                <span className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                                    {issue.summary}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="md:col-span-2 flex items-center justify-between md:justify-start">
                                <span className="md:hidden text-xs text-zinc-500 font-bold uppercase">Status</span>
                                <div className="flex items-center gap-2 text-xs text-zinc-400">
                                    {issue.status === 'Done' ? <CheckCircle2 size={14} className="text-green-500" /> : <Circle size={14} className="text-blue-500" />}
                                    <span className={issue.status === 'Done' ? 'text-green-400' : ''}>{issue.status}</span>
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="md:col-span-2 flex items-center justify-between md:justify-start">
                                <span className="md:hidden text-xs text-zinc-500 font-bold uppercase">Priority</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(issue.priority)}`}>
                                    {issue.priority}
                                </span>
                            </div>

                            {/* Link */}
                            <div className="hidden md:flex md:col-span-1 justify-end">
                                <a 
                                    href={issue.link} 
                                    target="_blank" 
                                    onClick={(e) => e.stopPropagation()} 
                                    className="p-2 text-zinc-600 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    )) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                            <ListTodo size={48} className="mb-4 text-zinc-700" />
                            <h3 className="text-lg font-bold text-zinc-500">No issues found</h3>
                            <p className="text-zinc-600 text-sm">You have no assigned issues in Jira.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODALS --- */}
            <AnimatePresence>
                
                {/* 1. CREATE ISSUE */}
                {activeModal === 'create_issue' && (
                    <Modal onClose={() => setActiveModal(null)} title="Create Jira Issue">
                        <form onSubmit={handleCreateIssue} className="space-y-4">
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Project Key (e.g. GAP, PROJ)</label>
                                <input 
                                    placeholder="PROJ" 
                                    className="input-field uppercase" 
                                    onChange={e => setFormData({...formData, projectKey: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Summary</label>
                                <input 
                                    placeholder="Bug: Login button alignment" 
                                    className="input-field" 
                                    onChange={e => setFormData({...formData, summary: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Description</label>
                                <textarea 
                                    placeholder="Steps to reproduce..." 
                                    rows={4} 
                                    className="input-field resize-none" 
                                    onChange={e => setFormData({...formData, description: e.target.value})} 
                                />
                            </div>
                            <button disabled={loading} className="btn-primary w-full bg-blue-600 hover:bg-blue-700 mt-2">
                                {loading ? 'Creating...' : 'Create Issue'}
                            </button>
                        </form>
                    </Modal>
                )}

                {/* 2. VIEW ISSUE / ADD COMMENT */}
                {activeModal === 'view_issue' && selectedIssue && (
                    <Modal onClose={() => setActiveModal(null)} title="Issue Details">
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded">{selectedIssue.key}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(selectedIssue.priority)}`}>{selectedIssue.priority}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white leading-snug">{selectedIssue.summary}</h3>
                            </div>

                            <div className="bg-[#050505] p-4 rounded-xl border border-white/5">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3 flex items-center gap-2">
                                    <MessageSquare size={12} /> Add Comment
                                </h4>
                                <form onSubmit={handleAddComment}>
                                    <textarea 
                                        placeholder="Write a comment..." 
                                        rows={3} 
                                        className="input-field resize-none text-sm mb-3" 
                                        value={commentText}
                                        onChange={e => setCommentText(e.target.value)}
                                        required
                                    />
                                    <div className="flex justify-end gap-2">
                                        <a href={selectedIssue.link} target="_blank" className="px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
                                            Open in Jira <ExternalLink size={12} />
                                        </a>
                                        <button disabled={loading} className="px-4 py-1.5 bg-white text-black rounded-lg text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2">
                                            {loading ? 'Posting...' : 'Comment'} <Send size={12} />
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

// --- SUB-COMPONENTS ---

// 1. Premium Modal
function Modal({ children, onClose, title }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 10 }} 
                className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
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