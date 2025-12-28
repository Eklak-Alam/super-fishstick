'use client';
import { motion } from 'framer-motion';
import { Briefcase, DollarSign, Calendar, TrendingUp, ArrowRight, User } from 'lucide-react';
import ConnectState from './ConnectState';

export default function ZohoWorkspace({ isConnected, data, user }) {
    
    // Auth Handler
    const handleAuth = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/zoho?userId=${user?.id}`;
    };

    // Helper: Badge Color based on Stage
    const getStageColor = (stage) => {
        const s = stage?.toLowerCase() || '';
        if (s.includes('won') || s.includes('closed')) return 'bg-green-500/10 text-green-400 border-green-500/20';
        if (s.includes('negotiation') || s.includes('review')) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
        if (s.includes('lost')) return 'bg-red-500/10 text-red-400 border-red-500/20';
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    };

    if (!isConnected) return <ConnectState icon={Briefcase} title="Connect Zoho CRM" onClick={handleAuth} />;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto h-full flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white">Sales Pipeline</h2>
                    <p className="text-sm text-yellow-500 flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_#eab308]" /> 
                        Zoho Sync Active
                    </p>
                </div>
            </div>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                {data.deals?.length ? data.deals.map(deal => (
                    <div key={deal.id} className="group bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 hover:border-yellow-500/30 transition-all hover:-translate-y-1 shadow-lg relative overflow-hidden">
                        
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-yellow-500/20 group-hover:bg-yellow-500/10 transition-colors">
                                    <DollarSign size={18} className="text-zinc-400 group-hover:text-yellow-500" />
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStageColor(deal.stage)}`}>
                                    {deal.stage}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1 truncate">{deal.name}</h3>
                            <p className="text-2xl font-bold text-zinc-200 mb-4 tracking-tight">{deal.amount}</p>

                            <div className="flex items-center gap-3 text-xs text-zinc-500 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} className="text-zinc-600" />
                                    <span>{deal.date || 'No Date'}</span>
                                </div>
                                {deal.probability && (
                                    <div className="flex items-center gap-1.5 ml-auto">
                                        <TrendingUp size={14} className={deal.probability > 50 ? 'text-green-500' : 'text-zinc-600'} />
                                        <span>{deal.probability}% Prob.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-center opacity-40 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                        <Briefcase size={48} className="mb-4 text-zinc-700" />
                        <h3 className="text-lg font-bold text-zinc-500">No active deals found</h3>
                        <p className="text-zinc-600 text-sm">Create a new deal in Zoho CRM to see it here.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}