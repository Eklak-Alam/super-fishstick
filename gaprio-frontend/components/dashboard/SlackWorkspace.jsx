'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, Hash, Users, Send, X, 
    Search, AtSign, Bell, Sparkles 
} from 'lucide-react';
import ConnectState from './ConnectState';
import api from '@/lib/axios';

export default function SlackWorkspace({ isConnected, data, user }) {
    
    // --- State ---
    const [activeModal, setActiveModal] = useState(null); // 'send_message'
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Helpers ---
    const handleAuth = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/slack?userId=${user?.id}`;
    };

    // Filter channels based on search
    const filteredChannels = data.channels?.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // --- Actions ---
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if(!formData.channelId || !formData.text) return alert("Please select a channel and write a message.");
        
        setLoading(true);
        try {
            await api.post('/integrations/slack/message', {
                channelId: formData.channelId,
                text: formData.text
            });
            alert('Message Sent Successfully!');
            setActiveModal(null);
            setFormData({});
        } catch (err) {
            console.error(err);
            alert('Failed to send message.');
        } finally {
            setLoading(false);
        }
    };

    if (!isConnected) return <ConnectState icon={MessageSquare} title="Connect Slack Workspace" onClick={handleAuth} />;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto h-full flex flex-col relative">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Slack HQ</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" /> 
                        <p className="text-sm text-zinc-400">Connected to {user.connections?.find(c => c.provider === 'slack')?.metadata?.teamName || 'Workspace'}</p>
                    </div>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-1 md:w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input 
                            type="text" 
                            placeholder="Find channel..." 
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-zinc-600"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        onClick={() => setActiveModal('send_message')} 
                        className="flex-1 md:flex-none bg-purple-600/10 text-purple-400 border border-purple-600/20 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-600/20 transition-all text-sm shadow-lg shadow-purple-500/5"
                    >
                        <Send size={16}/> New Message
                    </button>
                </div>
            </div>

            {/* --- CHANNELS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-4">
                {filteredChannels.length > 0 ? filteredChannels.map(channel => (
                    <div key={channel.id} className="group p-5 bg-[#0a0a0a] border border-white/10 hover:border-purple-500/30 rounded-2xl transition-all hover:-translate-y-1 shadow-lg relative overflow-hidden">
                        
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white/5 rounded-lg text-zinc-400 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors">
                                    <Hash size={18} />
                                </div>
                                <span className="font-bold text-white truncate max-w-[120px]">{channel.name}</span>
                            </div>
                            <span className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                <Users size={10} /> {channel.members_count}
                            </span>
                        </div>

                        {/* Topic */}
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed h-8 mb-4">
                            {channel.topic || "No description set for this channel."}
                        </p>

                        {/* Quick Action */}
                        <button 
                            onClick={() => { setFormData({ channelId: channel.id }); setActiveModal('send_message'); }}
                            className="w-full py-2 bg-white/5 hover:bg-purple-600 hover:text-white text-zinc-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        >
                            <MessageSquare size={12} /> Message Channel
                        </button>

                        {/* Decoration */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 blur-2xl rounded-full -mr-8 -mt-8 pointer-events-none" />
                    </div>
                )) : (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-center opacity-40">
                        <Hash size={48} className="mb-4 text-zinc-700" />
                        <h3 className="text-lg font-bold text-zinc-500">No channels found</h3>
                        <p className="text-zinc-600 text-sm">Try searching for something else.</p>
                    </div>
                )}
            </div>

            {/* --- SEND MESSAGE MODAL --- */}
            <AnimatePresence>
                {activeModal === 'send_message' && (
                    <Modal onClose={() => setActiveModal(null)} title="Send Message">
                        <form onSubmit={handleSendMessage} className="space-y-4">
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Select Channel</label>
                                <div className="relative">
                                    <select 
                                        className="input-field appearance-none" 
                                        value={formData.channelId || ''}
                                        onChange={e => setFormData({...formData, channelId: e.target.value})} 
                                        required
                                    >
                                        <option value="" disabled>-- Choose a Channel --</option>
                                        {data.channels?.map(c => (
                                            <option key={c.id} value={c.id}># {c.name}</option>
                                        ))}
                                    </select>
                                    <Hash size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Message</label>
                                <textarea 
                                    placeholder="What's on your mind?" 
                                    rows={5} 
                                    className="input-field resize-none" 
                                    onChange={e => setFormData({...formData, text: e.target.value})} 
                                    required 
                                />
                            </div>

                            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-400 flex items-center gap-2">
                                <Sparkles size={14} /> This will be posted instantly as <strong>Gaprio Bot</strong>.
                            </div>

                            <button disabled={loading} className="btn-primary w-full bg-purple-600 hover:bg-purple-700 mt-2">
                                {loading ? 'Sending...' : 'Send Message'} <Send size={14} className="ml-1" />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 10 }} 
                className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
                <div className="flex justify-between items-center p-5 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-purple-500/20 rounded-lg">
                            <MessageSquare size={16} className="text-purple-400" />
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