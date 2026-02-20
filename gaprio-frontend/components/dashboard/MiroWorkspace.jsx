'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutTemplate, ExternalLink, Clock, Plus, 
    X, CheckCircle2, Image as ImageIcon, Zap, ChevronRight, Layers 
} from 'lucide-react';
import Image from 'next/image';
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

    // --- DARK & ORANGE DISCONNECTED STATE WITH DOTTED BORDERS ---
    if (!isConnected) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center min-h-[70vh] bg-[#050505] rounded-3xl border-2 border-dashed border-zinc-800 p-6">
                <div className="flex flex-col items-center text-center max-w-md">
                    <div className="w-20 h-20 mb-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-4 shadow-sm relative overflow-hidden group">
                        <Image src="/companylogo/miro.png" alt="Miro" width={48} height={48} className="object-contain relative z-10" priority />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Connect Miro Engine</h2>
                    <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                        Unify your creative workflows. Generate brainstorm boards, wireframes, and collaborative spaces directly from your workspace.
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
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center p-1.5 shadow-sm">
                            <Image src="/companylogo/miro.png" alt="Miro" width={20} height={20} className="object-contain" />
                        </div>
                        Visual Command
                    </h2>
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium text-zinc-500">
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" /> 
                        Miro Sync Active
                    </div>
                </div>
                <button 
                    onClick={() => setActiveModal('create_board')} 
                    className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-sm"
                >
                    <Plus size={16} /> New Board
                </button>
            </div>

            {/* --- BOARDS GRID (Clean, No fancy hover effects) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-10" data-lenis-prevent="true">
                {data.boards?.length > 0 ? data.boards.map(board => (
                    <a 
                        href={board.url} 
                        target="_blank" 
                        key={board.id} 
                        className="group bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl overflow-hidden hover:bg-zinc-900/50 hover:border-orange-500/40 transition-colors flex flex-col h-64"
                    >
                        {/* Thumbnail Area */}
                        <div className="flex-1 bg-[#050505] border-b border-zinc-800/50 w-full flex items-center justify-center relative overflow-hidden">
                            {board.thumbnail ? (
                                <img 
                                    src={board.thumbnail} 
                                    alt={board.name} 
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-200" 
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 opacity-40">
                                    <Image src="/companylogo/miro.png" alt="Miro" width={32} height={32} className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                                </div>
                            )}
                            
                            {/* Open Badge - Clean Solid Box */}
                            <div className="absolute top-3 right-3 bg-zinc-900 border border-zinc-700 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink size={14} className="text-zinc-400 group-hover:text-orange-400" />
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-4 bg-transparent">
                            <h3 className="text-sm font-bold text-zinc-100 group-hover:text-orange-400 transition-colors truncate mb-1">{board.name}</h3>
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 mt-2">
                                <Clock size={12} />
                                <span>{new Date(board.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </a>
                )) : (
                    // DOTTED BORDER NO BOARDS STATE
                    <div className="col-span-full h-48 flex flex-col items-center justify-center text-center opacity-60 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                        <Layers size={32} className="mb-3 text-zinc-600" />
                        <h3 className="text-sm font-bold text-zinc-400">No boards found</h3>
                        <p className="text-xs text-zinc-600 mt-1 max-w-sm">You haven't created any Miro boards yet. Click 'New Board' to begin brainstorming.</p>
                    </div>
                )}
            </div>

            {/* --- CLEAN MODALS --- */}
            <AnimatePresence>
                {activeModal === 'create_board' && (
                    <Modal onClose={() => setActiveModal(null)} title="Create New Board">
                        <form onSubmit={handleCreateBoard} className="space-y-4">
                            <InputGroup 
                                label="Board Name" 
                                placeholder="e.g. Q3 Brainstorming" 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                autoFocus 
                            />
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Description</label>
                                <textarea 
                                    placeholder="What is this board for?" 
                                    rows={3} 
                                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-3 px-4 text-sm text-zinc-200 focus:border-orange-500/50 outline-none transition-colors placeholder:text-zinc-700 resize-none custom-scrollbar" 
                                    onChange={e => setFormData({...formData, description: e.target.value})} 
                                />
                            </div>
                            
                            <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-xs text-zinc-400 flex items-center gap-2">
                                <ExternalLink size={14} className="shrink-0 text-zinc-500" /> 
                                The new board will automatically open in a new tab upon creation.
                            </div>

                            <button disabled={loading} className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
                                {loading ? 'Initializing Engine...' : 'Deploy Board'}
                            </button>
                        </form>
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
                className="w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col"
            >
                <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-[#050505]/50">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center p-1">
                            <Image src="/companylogo/miro.png" alt="Miro" width={16} height={16} className="object-contain" />
                        </div>
                        <h2 className="text-sm font-bold text-white tracking-tight">{title}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 text-zinc-500 hover:text-white transition-colors">
                        <X size={16}/>
                    </button>
                </div>
                <div className="p-5">
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