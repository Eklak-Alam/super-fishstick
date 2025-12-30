'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutTemplate, ExternalLink, Clock, Plus, 
    X, CheckCircle2, Image as ImageIcon 
} from 'lucide-react';
import ConnectState from './ConnectState';
import api from '@/lib/axios';

export default function MiroWorkspace({ isConnected, data, user, onRefresh }) {
    
    // --- State ---
    const [activeModal, setActiveModal] = useState(null); // 'create_board'
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    // --- Helpers ---
    const handleAuth = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/miro?userId=${user?.id}`;
    };

    // --- Actions ---
    const handleCreateBoard = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/integrations/miro/boards', {
                name: formData.name,
                description: formData.description
            });
            
            // Success: Open the new board immediately
            if (res.data.data.viewLink) {
                window.open(res.data.data.viewLink, '_blank');
            }
            
            alert('Board Created! Opening in new tab...');
            setActiveModal(null);
            setFormData({});
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error(err);
            alert('Failed to create board.');
        } finally {
            setLoading(false);
        }
    };

    if (!isConnected) return <ConnectState icon={LayoutTemplate} title="Connect Miro Boards" onClick={handleAuth} />;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto h-full flex flex-col relative">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Visual Command</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_#facc15]" /> 
                        <p className="text-sm text-zinc-400">Miro Sync Active</p>
                    </div>
                </div>
                <button 
                    onClick={() => setActiveModal('create_board')} 
                    className="flex-1 md:flex-none bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-500/20 transition-all text-sm shadow-lg shadow-yellow-500/5"
                >
                    <Plus size={16} /> New Board
                </button>
            </div>

            {/* --- BOARDS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10 flex-1 overflow-y-auto custom-scrollbar min-h-[500px]">
                {data.boards?.length ? data.boards.map(board => (
                    <a 
                        href={board.url} 
                        target="_blank" 
                        key={board.id} 
                        className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all hover:-translate-y-1 block shadow-xl flex flex-col h-64"
                    >
                        
                        {/* Thumbnail Area */}
                        <div className="flex-1 bg-white/5 w-full flex items-center justify-center relative overflow-hidden">
                            {board.thumbnail ? (
                                <img 
                                    src={board.thumbnail} 
                                    alt={board.name} 
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 opacity-30 group-hover:opacity-50 transition-opacity">
                                    <LayoutTemplate size={40} className="text-white" />
                                </div>
                            )}
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                            
                            {/* Open Badge */}
                            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md border border-white/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                <ExternalLink size={14} className="text-white" />
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-5 relative z-10 bg-[#0a0a0a]">
                            <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors truncate">{board.name}</h3>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <Clock size={12} />
                                    <span>{new Date(board.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </a>
                )) : (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-center opacity-40 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                            <LayoutTemplate size={32} className="text-zinc-500" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-500">No boards found</h3>
                        <p className="text-zinc-600 text-sm mt-1">Create a new board to get started.</p>
                    </div>
                )}
            </div>

            {/* --- CREATE BOARD MODAL --- */}
            <AnimatePresence>
                {activeModal === 'create_board' && (
                    <Modal onClose={() => setActiveModal(null)} title="Create New Board">
                        <form onSubmit={handleCreateBoard} className="space-y-4">
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Board Name</label>
                                <input 
                                    placeholder="e.g. Q3 Brainstorming" 
                                    className="input-field" 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    required 
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Description</label>
                                <textarea 
                                    placeholder="What is this board for?" 
                                    rows={3} 
                                    className="input-field resize-none" 
                                    onChange={e => setFormData({...formData, description: e.target.value})} 
                                />
                            </div>
                            
                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-500 flex items-center gap-2">
                                <ExternalLink size={14} /> The new board will open in a new tab.
                            </div>

                            <button disabled={loading} className="btn-primary w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold mt-2">
                                {loading ? 'Creating...' : 'Create Board'}
                            </button>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>

        </motion.div>
    );
}

// --- SUB-COMPONENTS ---

// 1. Premium Modal (Reusable)
function Modal({ children, onClose, title }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 10 }} 
                className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
                <div className="flex justify-between items-center p-5 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
                    <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        <X size={18}/>
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}