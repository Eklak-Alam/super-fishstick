'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Hash, Users, Send, X } from 'lucide-react';
import ConnectState from './ConnectState';
import api from '@/lib/axios';

export default function SlackWorkspace({ isConnected, data, user }) { // 👈 Receive 'user' prop
    
    // 👇 Updated: Send user.id
    const handleAuth = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/slack?userId=${user?.id}`;
    };

    // ... Rest of component same as before ...
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault(); setLoading(true);
        try { await api.post('/integrations/slack/message', { channelId: formData.channelId, text: formData.message }); alert('Message Sent!'); setModal(false); } 
        catch (err) { alert('Failed to send'); } finally { setLoading(false); }
    };

    if (!isConnected) return <ConnectState icon={MessageSquare} title="Connect Slack Workspace" onClick={handleAuth} />;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div><h2 className="text-2xl font-bold text-white">Slack Headquarters</h2><p className="text-sm text-green-400 flex items-center gap-2 mt-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Connected</p></div>
                <button onClick={() => setModal(true)} className="bg-white text-black px-4 py-2 rounded-xl font-bold hover:bg-zinc-200 flex items-center gap-2"><Send size={18}/> Send Message</button>
            </div>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Hash size={18} className="text-zinc-500"/> Public Channels</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.channels?.length ? data.channels.map(channel => (
                        <div key={channel.id} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all cursor-pointer group">
                            <div className="flex justify-between items-center mb-2"><p className="text-white font-bold group-hover:text-orange-400 transition-colors">#{channel.name}</p><span className="flex items-center gap-1 text-[10px] text-zinc-500 bg-black/40 px-2 py-1 rounded-full"><Users size={10}/> {channel.members_count}</span></div>
                            <p className="text-xs text-zinc-500 truncate">{channel.topic || 'No topic description'}</p>
                        </div>
                    )) : <p className="text-zinc-500">No channels found.</p>}
                </div>
            </div>
            <AnimatePresence>
                {modal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 relative">
                            <button onClick={() => setModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X size={20}/></button>
                            <h2 className="text-xl font-bold mb-4 text-white">Send Slack Message</h2>
                            <form onSubmit={sendMessage} className="space-y-4">
                                <div><label className="text-xs text-zinc-500 mb-1 block">Select Channel</label><select className="input-std" onChange={e => setFormData({...formData, channelId: e.target.value})} required><option value="">-- Choose Channel --</option>{data.channels?.map(c => <option key={c.id} value={c.id}>#{c.name}</option>)}</select></div>
                                <div><label className="text-xs text-zinc-500 mb-1 block">Message</label><textarea placeholder="Type your message..." rows={4} className="input-std" onChange={e => setFormData({...formData, message: e.target.value})} required /></div>
                                <button disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-500 transition-colors">{loading ? 'Sending...' : 'Post Message'}</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}