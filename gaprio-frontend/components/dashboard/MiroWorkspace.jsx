'use client';
import { motion } from 'framer-motion';
import { LayoutTemplate, ExternalLink, Clock, Plus } from 'lucide-react';
import ConnectState from './ConnectState';

export default function MiroWorkspace({ isConnected, data, user }) {
    
    // Auth Handler with User ID linking
    const handleAuth = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/miro?userId=${user?.id}`;
    };

    if (!isConnected) return <ConnectState icon={LayoutTemplate} title="Connect Miro Boards" onClick={handleAuth} />;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto h-full flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white">Visual Command</h2>
                    <p className="text-sm text-yellow-400 flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_#facc15]" /> 
                        Miro Sync Active
                    </p>
                </div>
                <a href="https://miro.com/app/dashboard/" target="_blank" className="bg-white text-black px-4 py-2 rounded-xl font-bold hover:bg-zinc-200 flex items-center gap-2 text-sm">
                    <Plus size={16} /> New Board
                </a>
            </div>

            {/* Boards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                {data.boards?.length ? data.boards.map(board => (
                    <a href={board.url} target="_blank" key={board.id} className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-400/50 transition-all hover:-translate-y-1 block shadow-xl">
                        
                        {/* Thumbnail / Placeholder */}
                        <div className="h-40 bg-white/5 w-full flex items-center justify-center relative overflow-hidden">
                            {board.thumbnail ? (
                                <img src={board.thumbnail} alt={board.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            ) : (
                                <LayoutTemplate size={40} className="text-white/10 group-hover:text-yellow-400/20 transition-colors" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-90" />
                        </div>

                        {/* Content */}
                        <div className="p-5 absolute bottom-0 left-0 w-full">
                            <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors truncate">{board.name}</h3>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <Clock size={12} />
                                    <span>{new Date(board.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <ExternalLink size={14} className="text-zinc-600 group-hover:text-white" />
                            </div>
                        </div>
                    </a>
                )) : (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-center opacity-50 border border-dashed border-white/10 rounded-2xl">
                        <LayoutTemplate size={32} className="mb-3 text-zinc-600" />
                        <p className="text-zinc-500">No recent boards found.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}