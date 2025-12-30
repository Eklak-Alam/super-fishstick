'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase, DollarSign, Calendar, TrendingUp, 
    Plus, UserPlus, X, Search, Filter, Layers, BarChart3
} from 'lucide-react';
import ConnectState from './ConnectState';
import api from '@/lib/axios';

export default function ZohoWorkspace({ isConnected, data, user, onRefresh }) {
    
    // --- State ---
    const [activeModal, setActiveModal] = useState(null); 
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStage, setFilterStage] = useState('All');

    // --- Derived State (Metrics & Filtering) ---
    const deals = data.deals || [];
    
    // Calculate Total Pipeline Value
    const totalPipeline = useMemo(() => {
        return deals.reduce((acc, deal) => {
            // Remove non-numeric chars (e.g. "$", ",") to sum
            const val = parseFloat(String(deal.amount).replace(/[^0-9.-]+/g,"")) || 0;
            return acc + val;
        }, 0).toLocaleString();
    }, [deals]);

    // Filter Logic
    const filteredDeals = deals.filter(deal => {
        const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStage = filterStage === 'All' || deal.stage === filterStage;
        return matchesSearch && matchesStage;
    });

    // --- Helpers ---
    const handleAuth = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/zoho?userId=${user?.id}`;
    };

    const getStageColor = (stage) => {
        const s = stage?.toLowerCase() || '';
        if (s.includes('won') || s.includes('closed')) return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]' };
        if (s.includes('negotiation') || s.includes('review')) return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]' };
        if (s.includes('lost')) return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', glow: 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]' };
        return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]' };
    };

    // --- Actions ---
    const handleCreateDeal = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/integrations/zoho/deals', {
                dealName: formData.dealName,
                amount: formData.amount,
                stage: formData.stage
            });
            setActiveModal(null);
            setFormData({});
            if (onRefresh) onRefresh();
        } catch (err) {
            alert('Failed to create deal.');
        } finally { setLoading(false); }
    };

    const handleCreateLead = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/integrations/zoho/leads', {
                lastName: formData.lastName,
                company: formData.company,
                email: formData.email
            });
            alert('Lead Captured!');
            setActiveModal(null);
            setFormData({});
        } catch (err) {
            alert('Failed to create lead.');
        } finally { setLoading(false); }
    };

    if (!isConnected) return <ConnectState icon={Briefcase} title="Connect Zoho CRM" onClick={handleAuth} />;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto h-full flex flex-col relative pb-6">
            
            {/* --- DASHBOARD HEADER --- */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6 shrink-0">
                
                {/* Title & Status */}
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Briefcase className="text-yellow-500" size={28} /> Sales Command
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" /> 
                            Zoho CRM Sync Active
                        </div>
                    </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                    {/* Quick Stats */}
                    <div className="flex gap-4 flex-1 md:flex-none">
                        <div className="bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-2 flex-1 md:w-40">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Pipeline Value</p>
                            <p className="text-lg font-bold text-white">${totalPipeline}</p>
                        </div>
                        <div className="bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-2 flex-1 md:w-32">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Active Deals</p>
                            <p className="text-lg font-bold text-white">{deals.length}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button onClick={() => setActiveModal('create_lead')} className="btn-secondary flex-1 md:flex-none flex items-center justify-center gap-2">
                            <UserPlus size={16}/> Lead
                        </button>
                        <button onClick={() => setActiveModal('create_deal')} className="btn-primary-yellow flex-1 md:flex-none flex items-center justify-center gap-2">
                            <Plus size={16}/> Deal
                        </button>
                    </div>
                </div>
            </div>

            {/* --- FILTERS & SEARCH --- */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 shrink-0">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                        type="text" 
                        placeholder="Search deals by name..." 
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-yellow-500/50 outline-none transition-all placeholder:text-zinc-600"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-full md:w-64">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <select 
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-300 focus:border-yellow-500/50 outline-none appearance-none cursor-pointer"
                        onChange={(e) => setFilterStage(e.target.value)}
                    >
                        <option value="All">All Stages</option>
                        <option value="Identify Decision Makers">Identify Decision Makers</option>
                        <option value="Proposal/Price Quote">Proposal/Price Quote</option>
                        <option value="Negotiation/Review">Negotiation/Review</option>
                        <option value="Closed Won">Closed Won</option>
                        <option value="Closed Lost">Closed Lost</option>
                    </select>
                </div>
            </div>

            {/* --- DEALS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-10">
                <AnimatePresence mode='popLayout'>
                    {filteredDeals.length > 0 ? filteredDeals.map((deal, index) => {
                        const style = getStageColor(deal.stage);
                        return (
                            <motion.div 
                                key={deal.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className={`group bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all hover:-translate-y-1 shadow-lg relative overflow-hidden ${style.glow}`}
                            >
                                {/* Subtle Background Gradient based on stage */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none ${style.bg.replace('bg-', 'from-').replace('/10', '/5')}`} />

                                <div className="relative z-10 flex flex-col h-full">
                                    {/* Top Row */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${style.bg} ${style.border}`}>
                                            <DollarSign size={18} className={style.text} />
                                        </div>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wide uppercase ${style.bg} ${style.text} ${style.border}`}>
                                            {deal.stage === 'Identify Decision Makers' ? 'Discovery' : deal.stage}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-white mb-1 line-clamp-1" title={deal.name}>{deal.name}</h3>
                                        <p className="text-2xl font-bold text-zinc-200 tracking-tight">{deal.amount}</p>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-white/5 mt-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-zinc-600" />
                                            <span>{deal.date || 'No Date'}</span>
                                        </div>
                                        {deal.probability != null && (
                                            <div className="flex items-center gap-1.5">
                                                <BarChart3 size={14} className={deal.probability > 50 ? 'text-green-500' : 'text-zinc-600'} />
                                                <span>{deal.probability}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    }) : (
                        <div className="col-span-full h-64 flex flex-col items-center justify-center text-center opacity-40 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                            <Layers size={48} className="mb-4 text-zinc-700" />
                            <h3 className="text-lg font-bold text-zinc-500">No deals found</h3>
                            <p className="text-zinc-600 text-sm mt-1">Try adjusting your filters or create a new deal.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- MODALS --- */}
            <AnimatePresence>
                {activeModal && (
                    <Modal onClose={() => setActiveModal(null)} title={activeModal === 'create_deal' ? "Create New Deal" : "Capture New Lead"}>
                        <form onSubmit={activeModal === 'create_deal' ? handleCreateDeal : handleCreateLead} className="space-y-5">
                            
                            {/* Form Fields - Deal */}
                            {activeModal === 'create_deal' && (
                                <>
                                    <InputGroup label="Deal Name" placeholder="e.g. Q4 Marketing Contract" onChange={e => setFormData({...formData, dealName: e.target.value})} autoFocus />
                                    <InputGroup label="Amount ($)" type="number" placeholder="5000" onChange={e => setFormData({...formData, amount: e.target.value})} />
                                    <div>
                                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider ml-1 mb-1.5 block">Stage</label>
                                        <div className="relative">
                                            <select className="input-field appearance-none cursor-pointer" onChange={e => setFormData({...formData, stage: e.target.value})}>
                                                <option value="Identify Decision Makers">Identify Decision Makers</option>
                                                <option value="Proposal/Price Quote">Proposal/Price Quote</option>
                                                <option value="Negotiation/Review">Negotiation/Review</option>
                                                <option value="Closed Won">Closed Won</option>
                                                <option value="Closed Lost">Closed Lost</option>
                                            </select>
                                            <TrendingUp size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Form Fields - Lead */}
                            {activeModal === 'create_lead' && (
                                <>
                                    <InputGroup label="Last Name" placeholder="Doe" onChange={e => setFormData({...formData, lastName: e.target.value})} autoFocus />
                                    <InputGroup label="Company" placeholder="Acme Corp" onChange={e => setFormData({...formData, company: e.target.value})} />
                                    <InputGroup label="Email" type="email" placeholder="john@example.com" onChange={e => setFormData({...formData, email: e.target.value})} />
                                </>
                            )}

                            <button disabled={loading} className="btn-primary-yellow w-full py-3 text-sm font-bold mt-2">
                                {loading ? 'Processing...' : (activeModal === 'create_deal' ? 'Create Deal' : 'Save Lead')}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 10 }} 
                className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
                <div className="flex justify-between items-center p-5 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                            <Briefcase size={16} className="text-yellow-500" />
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
                    </div>
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

function InputGroup({ label, type = "text", placeholder, onChange, autoFocus }) {
    return (
        <div>
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider ml-1 mb-1.5 block">{label}</label>
            <input 
                type={type} 
                placeholder={placeholder} 
                className="input-field" 
                onChange={onChange} 
                required 
                autoFocus={autoFocus}
            />
        </div>
    );
}