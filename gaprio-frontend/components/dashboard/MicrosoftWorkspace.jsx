'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, FileSpreadsheet, Presentation, Calendar, 
    ExternalLink, Clock, Plus, X, Search, Filter, 
    Layers, Zap, CalendarPlus, FilePlus
} from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/axios';

export default function MicrosoftWorkspace({ isConnected, data, user, onRefresh }) {
    
    // --- State ---
    const [activeModal, setActiveModal] = useState(null); // 'create_doc', 'create_event'
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    // --- Derived State ---
    const documents = data?.documents || [];
    
    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || doc.type === filterType;
        return matchesSearch && matchesType;
    });

    // --- Helpers ---
    const handleAuth = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/microsoft?userId=${user?.id}`;
    };

    const getDocIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'excel': return <FileSpreadsheet size={16} className="text-green-500" />;
            case 'powerpoint': return <Presentation size={16} className="text-orange-500" />;
            case 'word': default: return <FileText size={16} className="text-blue-500" />;
        }
    };

    // --- Actions ---
    const handleCreateDocument = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/integrations/microsoft/documents', {
                name: formData.name,
                type: formData.type || 'Word'
            });
            
            if (res.data.data.webUrl) {
                window.open(res.data.data.webUrl, '_blank');
            }
            
            alert('Document created! Opening in OneDrive...');
            setActiveModal(null);
            setFormData({});
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error(err);
            alert('Failed to create document.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/integrations/microsoft/events', {
                title: formData.title,
                date: formData.date,
                time: formData.time
            });
            
            alert('Event scheduled successfully on your Outlook Calendar!');
            setActiveModal(null);
            setFormData({});
        } catch (err) {
            console.error(err);
            alert('Failed to schedule event.');
        } finally {
            setLoading(false);
        }
    };

    // --- DISCONNECTED STATE (Clean Dotted Border) ---
    if (!isConnected) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center min-h-[70vh] bg-[#050505] rounded-3xl border-2 border-dashed border-zinc-800 p-6 transition-colors hover:border-orange-500/30">
                <div className="flex flex-col items-center text-center max-w-md">
                    <div className="w-20 h-20 mb-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-4 shadow-sm relative overflow-hidden group">
                        <Image src="/companylogo/Microsoft_365.png" alt="Microsoft 365" width={48} height={48} className="object-contain relative z-10" priority />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Connect Microsoft 365</h2>
                    <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                        Unify your productivity suite. Manage Office documents, schedule Outlook meetings, and sync OneDrive files directly from your workspace.
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center p-1.5 shadow-sm">
                            <Image src="/companylogo/Microsoft_365.png" alt="Microsoft 365" width={20} height={20} className="object-contain" />
                        </div>
                        Office Command
                    </h2>
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium text-zinc-500">
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" /> 
                        Microsoft 365 Sync Active
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="flex gap-2">
                        <button onClick={() => setActiveModal('create_event')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-xl text-xs font-bold transition-colors">
                            <CalendarPlus size={14}/> Event
                        </button>
                        <button onClick={() => setActiveModal('create_doc')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm">
                            <FilePlus size={14}/> Document
                        </button>
                    </div>
                </div>
            </div>

            {/* --- FILTERS & SEARCH --- */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 shrink-0">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                        type="text" 
                        placeholder="Search recent files..." 
                        className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white focus:border-orange-500/50 outline-none transition-colors placeholder:text-zinc-600"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-full sm:w-56">
                    <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <select 
                        className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-sm text-zinc-300 focus:border-orange-500/50 outline-none appearance-none cursor-pointer transition-colors"
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="All">All File Types</option>
                        <option value="Word">Word Documents</option>
                        <option value="Excel">Excel Spreadsheets</option>
                        <option value="PowerPoint">Presentations</option>
                    </select>
                </div>
            </div>

            {/* --- DOCUMENTS GRID (Clean, No fancy hover effects) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-10" data-lenis-prevent="true">
                {filteredDocs.length > 0 ? filteredDocs.map(doc => (
                    <a 
                        href={doc.url} 
                        target="_blank" 
                        key={doc.id} 
                        className="group bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-5 hover:bg-zinc-900/50 hover:border-orange-500/40 transition-colors flex flex-col h-full relative"
                    >
                        {/* Open Badge */}
                        <div className="absolute top-4 right-4 text-zinc-600 group-hover:text-orange-400 transition-colors">
                            <ExternalLink size={14} />
                        </div>

                        {/* Top Icon Row */}
                        <div className="w-10 h-10 rounded-xl bg-[#050505] border border-zinc-800 flex items-center justify-center mb-4">
                            {getDocIcon(doc.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-zinc-100 group-hover:text-orange-400 transition-colors mb-1 line-clamp-2" title={doc.name}>{doc.name}</h3>
                            <p className="text-[11px] text-zinc-500 uppercase tracking-widest">{doc.type}</p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 pt-4 border-t border-zinc-800/50 mt-4">
                            <Clock size={12} />
                            <span>Modified: {new Date(doc.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </a>
                )) : (
                    // DOTTED BORDER NO FILES STATE
                    <div className="col-span-full h-48 flex flex-col items-center justify-center text-center opacity-60 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                        <Layers size={32} className="mb-3 text-zinc-600" />
                        <h3 className="text-sm font-bold text-zinc-400">No documents found</h3>
                        <p className="text-xs text-zinc-600 mt-1 max-w-sm">You have no recent files. Click 'Document' to create a new one.</p>
                    </div>
                )}
            </div>

            {/* --- CLEAN MODALS --- */}
            <AnimatePresence>
                
                {/* 1. CREATE DOCUMENT */}
                {activeModal === 'create_doc' && (
                    <Modal onClose={() => setActiveModal(null)} title="Create Document">
                        <form onSubmit={handleCreateDocument} className="space-y-4">
                            <InputGroup 
                                label="File Name" 
                                placeholder="e.g. Q4 Financial Report" 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                autoFocus 
                            />
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">File Type</label>
                                <select 
                                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-3 px-4 text-sm text-zinc-200 focus:border-orange-500/50 outline-none transition-colors cursor-pointer" 
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="Word">Microsoft Word (.docx)</option>
                                    <option value="Excel">Microsoft Excel (.xlsx)</option>
                                    <option value="PowerPoint">PowerPoint (.pptx)</option>
                                </select>
                            </div>
                            
                            <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-xs text-zinc-400 flex items-center gap-2">
                                <ExternalLink size={14} className="shrink-0 text-zinc-500" /> 
                                The file will open securely in Microsoft 365.
                            </div>

                            <button disabled={loading} className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
                                {loading ? 'Initializing...' : 'Deploy Document'}
                            </button>
                        </form>
                    </Modal>
                )}

                {/* 2. CREATE EVENT */}
                {activeModal === 'create_event' && (
                    <Modal onClose={() => setActiveModal(null)} title="Schedule Event">
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <InputGroup 
                                label="Event Title" 
                                placeholder="e.g. Product Sync" 
                                onChange={e => setFormData({...formData, title: e.target.value})} 
                                autoFocus 
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <InputGroup 
                                    label="Date" 
                                    type="date"
                                    onChange={e => setFormData({...formData, date: e.target.value})} 
                                />
                                <InputGroup 
                                    label="Time" 
                                    type="time"
                                    onChange={e => setFormData({...formData, time: e.target.value})} 
                                />
                            </div>

                            <button disabled={loading} className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
                                {loading ? 'Syncing Calendar...' : 'Schedule Event'}
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
                            <Image src="/companylogo/Microsoft_365.png" alt="Microsoft" width={16} height={16} className="object-contain" />
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