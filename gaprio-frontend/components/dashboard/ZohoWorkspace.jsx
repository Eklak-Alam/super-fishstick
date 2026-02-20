'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase, DollarSign, Calendar, TrendingUp, 
    Plus, UserPlus, X, Search, Filter, Layers, BarChart3, Zap
} from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/axios';

export default function ZohoWorkspace({ isConnected, data, user, onRefresh }) {
    
    // --- State ---
    const [activeModal, setActiveModal] = useState(null); 
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStage, setFilterStage] = useState('All');

    // --- Derived State ---
    const deals = data?.deals || [];
    
    const totalPipeline = useMemo(() => {
        return deals.reduce((acc, deal) => {
            const val = parseFloat(String(deal.amount).replace(/[^0-9.-]+/g,"")) || 0;
            return acc + val;
        }, 0).toLocaleString();
    }, [deals]);

    const filteredDeals = deals.filter(deal => {
        const matchesSearch = deal.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStage = filterStage === 'All' || deal.stage === filterStage;
        return matchesSearch && matchesStage;
    });

    // --- Helpers ---
    const handleAuth = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/zoho?userId=${user?.id}`;
    };

    const getStageColor = (stage) => {
        const s = stage?.toLowerCase() || '';
        if (s.includes('won') || s.includes('closed')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        if (s.includes('negotiation') || s.includes('review')) return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
        if (s.includes('lost')) return 'bg-red-500/10 text-red-400 border-red-500/20';
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
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

    // --- DISCONNECTED STATE (Clean Dotted Border) ---
    if (!isConnected) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center min-h-[70vh] bg-[#050505] rounded-3xl border-2 border-dashed border-zinc-800 p-6">
                <div className="flex flex-col items-center text-center max-w-md">
                    <div className="w-20 h-20 mb-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-4 shadow-sm">
                        <Image src="/companylogo/zoho.png" alt="Zoho" width={48} height={48} className="object-contain" priority />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Connect Zoho CRM</h2>
                    <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                        Sync your deals, track pipeline metrics, and capture leads seamlessly from your workspace.
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center p-1.5 shadow-sm">
                            <Image src="/companylogo/zoho.png" alt="Zoho" width={20} height={20} className="object-contain" />
                        </div>
                        Sales Pipeline
                    </h2>
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium text-zinc-500">
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" /> 
                        Zoho CRM Active
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="flex gap-3 flex-1 sm:flex-none">
                        <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-4 py-2.5 flex-1 sm:w-36">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-0.5">Total Value</p>
                            <p className="text-lg font-bold text-white tracking-tight">${totalPipeline}</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-4 py-2.5 flex-1 sm:w-28">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-0.5">Active</p>
                            <p className="text-lg font-bold text-white tracking-tight">{deals.length} Deals</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setActiveModal('create_lead')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-xl text-xs font-bold transition-colors">
                            <UserPlus size={14}/> Lead
                        </button>
                        <button onClick={() => setActiveModal('create_deal')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors">
                            <Plus size={14}/> Deal
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 shrink-0">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                        type="text" 
                        placeholder="Search deals..." 
                        className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white focus:border-orange-500/50 outline-none transition-colors placeholder:text-zinc-600"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-full sm:w-56">
                    <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <select 
                        className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-sm text-zinc-300 focus:border-orange-500/50 outline-none appearance-none cursor-pointer transition-colors"
                        onChange={(e) => setFilterStage(e.target.value)}
                    >
                        <option value="All">All Stages</option>
                        <option value="Identify Decision Makers">Discovery</option>
                        <option value="Proposal/Price Quote">Proposal</option>
                        <option value="Negotiation/Review">Negotiation</option>
                        <option value="Closed Won">Closed Won</option>
                        <option value="Closed Lost">Closed Lost</option>
                    </select>
                </div>
            </div>

            {/* Deals Grid (Clean, No Scale Animations) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-10" data-lenis-prevent="true">
                {filteredDeals.length > 0 ? filteredDeals.map((deal) => {
                    const style = getStageColor(deal.stage);
                    return (
                        <div 
                            key={deal.id}
                            className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-4 hover:bg-zinc-900/50 transition-colors flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${style}`}>
                                    <DollarSign size={14} />
                                </div>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${style}`}>
                                    {deal.stage === 'Identify Decision Makers' ? 'Discovery' : deal.stage}
                                </span>
                            </div>

                            <div className="flex-1 mb-4">
                                <h3 className="text-sm font-bold text-zinc-100 mb-1 line-clamp-2" title={deal.name}>{deal.name}</h3>
                                <p className="text-lg font-bold text-zinc-400">{deal.amount}</p>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-medium text-zinc-500 pt-3 border-t border-zinc-800/80">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={12} />
                                    <span>{deal.date || 'No Date'}</span>
                                </div>
                                {deal.probability != null && (
                                    <div className="flex items-center gap-1.5">
                                        <BarChart3 size={12} className={deal.probability > 50 ? 'text-green-500' : 'text-zinc-500'} />
                                        <span>{deal.probability}%</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="col-span-full h-48 flex flex-col items-center justify-center text-center opacity-60 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                        <Layers size={32} className="mb-3 text-zinc-600" />
                        <h3 className="text-sm font-bold text-zinc-400">No deals found</h3>
                        <p className="text-xs text-zinc-600 mt-1">Adjust filters or create a new deal.</p>
                    </div>
                )}
            </div>

            {/* --- CLEAN MODALS --- */}
            <AnimatePresence>
                {activeModal && (
                    <Modal onClose={() => setActiveModal(null)} title={activeModal === 'create_deal' ? "Create New Deal" : "Capture New Lead"}>
                        <form onSubmit={activeModal === 'create_deal' ? handleCreateDeal : handleCreateLead} className="space-y-4">
                            
                            {activeModal === 'create_deal' && (
                                <>
                                    <InputGroup label="Deal Name" placeholder="e.g. Q4 Marketing Contract" onChange={e => setFormData({...formData, dealName: e.target.value})} autoFocus />
                                    <InputGroup label="Amount ($)" type="number" placeholder="5000" onChange={e => setFormData({...formData, amount: e.target.value})} />
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Stage</label>
                                        <div className="relative">
                                            <select 
                                                className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-3 pl-3 pr-10 text-sm text-zinc-200 focus:border-orange-500/50 outline-none appearance-none cursor-pointer transition-colors" 
                                                onChange={e => setFormData({...formData, stage: e.target.value})}
                                            >
                                                <option value="Identify Decision Makers">Discovery</option>
                                                <option value="Proposal/Price Quote">Proposal</option>
                                                <option value="Negotiation/Review">Negotiation</option>
                                                <option value="Closed Won">Closed Won</option>
                                                <option value="Closed Lost">Closed Lost</option>
                                            </select>
                                            <TrendingUp size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeModal === 'create_lead' && (
                                <>
                                    <InputGroup label="Last Name" placeholder="Doe" onChange={e => setFormData({...formData, lastName: e.target.value})} autoFocus />
                                    <InputGroup label="Company" placeholder="Acme Corp" onChange={e => setFormData({...formData, company: e.target.value})} />
                                    <InputGroup label="Email" type="email" placeholder="john@example.com" onChange={e => setFormData({...formData, email: e.target.value})} />
                                </>
                            )}

                            <button disabled={loading} className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
                                {loading ? 'Processing...' : (activeModal === 'create_deal' ? 'Create Deal' : 'Save Lead')}
                            </button>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>

        </motion.div>
    );
}

// --- SUB-COMPONENTS ---

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
                    <h2 className="text-sm font-bold text-white tracking-tight">{title}</h2>
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
                className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-3 px-3 text-sm text-zinc-200 focus:border-orange-500/50 outline-none transition-colors placeholder:text-zinc-700"
            />
        </div>
    );
}