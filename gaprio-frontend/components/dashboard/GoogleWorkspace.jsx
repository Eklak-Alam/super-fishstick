'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mail, Video, Send, FileText, Calendar, 
    ExternalLink, Plus, X, Clock, User, Link as LinkIcon, Paperclip
} from 'lucide-react';
import ConnectState from './ConnectState';
import api from '@/lib/axios';

export default function GoogleWorkspace({ isConnected, data, onRefresh }) {
    // --- State Management ---
    const [activeModal, setActiveModal] = useState(null); // 'compose', 'meeting', 'view_email'
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    // --- Actions ---
    const handleAuth = () => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/integrations/google/email/send', formData);
            alert('Email Sent Successfully!');
            setActiveModal(null);
            setFormData({});
        } catch (err) { 
            alert('Failed to send email.'); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleCreateMeeting = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Calculate End Time (Default to 1 hour after start)
            const start = new Date(formData.startTime);
            const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 Hour

            const res = await api.post('/integrations/google/calendar/create', {
                summary: formData.summary,
                description: formData.description,
                startTime: start,
                endTime: end
            });
            
            alert('Meeting Scheduled with Google Meet!');
            setActiveModal(null);
            setFormData({});
            if(onRefresh) onRefresh(); // Refresh data to show new meeting
        } catch (err) { 
            console.error(err);
            alert('Failed to schedule meeting.'); 
        } finally { 
            setLoading(false); 
        }
    };

    // Open Email Reader
    const openEmail = (email) => {
        setSelectedEmail(email);
        setActiveModal('view_email');
    };

    if (!isConnected) return <ConnectState icon={Mail} title="Connect Google Workspace" onClick={handleAuth} />;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Workspace Command</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                        <p className="text-sm text-zinc-400">Real-time sync active via Google Cloud</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => setActiveModal('meeting')} className="flex-1 md:flex-none bg-[#ea4335]/10 text-[#ea4335] border border-[#ea4335]/20 px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#ea4335]/20 transition-all">
                        <Video size={18}/> New Meeting
                    </button>
                    <button onClick={() => setActiveModal('compose')} className="flex-1 md:flex-none bg-white text-black px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-lg shadow-white/10">
                        <Plus size={18}/> Compose
                    </button>
                </div>
            </div>

            {/* --- WIDGET GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
                
                {/* 1. GMAIL INBOX */}
                <WidgetCard title="Inbox" icon={Mail} color="text-red-400" bg="bg-red-500/10">
                    {data.emails?.length ? data.emails.map(e => (
                        <div key={e.id} onClick={() => openEmail(e)} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl mb-3 border border-white/5 cursor-pointer group transition-all hover:translate-x-1">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-sm text-zinc-200 group-hover:text-white truncate w-3/4">{e.from.split('<')[0].replace(/"/g, '')}</span>
                                <span className="text-[10px] text-zinc-500 bg-black/20 px-1.5 py-0.5 rounded">Now</span>
                            </div>
                            <h4 className="text-sm font-semibold text-white mb-1 truncate">{e.subject}</h4>
                            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{e.snippet}</p>
                        </div>
                    )) : <EmptyState text="Inbox zero! No new emails." />}
                </WidgetCard>

                {/* 2. CALENDAR */}
                <WidgetCard title="Schedule" icon={Calendar} color="text-orange-400" bg="bg-orange-500/10">
                    {data.meetings?.length ? data.meetings.map(m => (
                        <div key={m.id} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl mb-3 border border-white/5 group transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-sm text-white mb-1 group-hover:text-orange-400 transition-colors">{m.summary}</div>
                                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                                        <Clock size={12} />
                                        {new Date(m.start.dateTime || m.start.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                                {m.hangoutLink && (
                                    <a href={m.hangoutLink} target="_blank" className="p-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors" title="Join Meet">
                                        <Video size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                    )) : <EmptyState text="No upcoming meetings today." />}
                </WidgetCard>

                {/* 3. DRIVE FILES */}
                <WidgetCard title="Recent Files" icon={FileText} color="text-blue-400" bg="bg-blue-500/10">
                    {data.files?.length ? data.files.map(f => (
                        <a href={f.webViewLink} target="_blank" key={f.id} className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl mb-3 border border-white/5 group transition-all hover:scale-[1.02]">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <img src={f.iconLink} alt="icon" className="w-5 h-5 opacity-80 group-hover:opacity-100" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-300 truncate group-hover:text-white">{f.name}</p>
                                <p className="text-[10px] text-zinc-500">Modified recently</p>
                            </div>
                            <ExternalLink size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                        </a>
                    )) : <EmptyState text="No recent files found." />}
                </WidgetCard>
            </div>

            {/* --- MODALS --- */}
            <AnimatePresence>
                
                {/* 1. COMPOSE EMAIL MODAL */}
                {activeModal === 'compose' && (
                    <Modal onClose={() => setActiveModal(null)} title="Compose Email">
                        <form onSubmit={handleSendEmail} className="space-y-4">
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Recipient</label>
                                <input placeholder="example@gmail.com" className="input-field" onChange={e => setFormData({...formData, to: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Subject</label>
                                <input placeholder="Project Update..." className="input-field" onChange={e => setFormData({...formData, subject: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Body</label>
                                <textarea placeholder="Write your message here..." rows={8} className="input-field resize-none h-40" onChange={e => setFormData({...formData, body: e.target.value})} required />
                            </div>
                            <button disabled={loading} className="btn-primary w-full mt-2">
                                {loading ? 'Sending...' : 'Send Email'} <Send size={16} />
                            </button>
                        </form>
                    </Modal>
                )}

                {/* 2. CREATE MEETING MODAL */}
                {activeModal === 'meeting' && (
                    <Modal onClose={() => setActiveModal(null)} title="Schedule Google Meet">
                        <form onSubmit={handleCreateMeeting} className="space-y-4">
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Meeting Title</label>
                                <input placeholder="Weekly Sync..." className="input-field" onChange={e => setFormData({...formData, summary: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Description</label>
                                <input placeholder="Discussing roadmap..." className="input-field" onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Start Time</label>
                                <input type="datetime-local" className="input-field" onChange={e => setFormData({...formData, startTime: e.target.value})} required />
                            </div>
                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300 flex items-center gap-2">
                                <Video size={14} /> A Google Meet link will be generated automatically.
                            </div>
                            <button disabled={loading} className="btn-primary bg-gradient-to-r from-orange-600 to-red-600 w-full mt-2 border-0">
                                {loading ? 'Scheduling...' : 'Create Meeting'}
                            </button>
                        </form>
                    </Modal>
                )}

                {/* 3. VIEW EMAIL MODAL (Full Read Mode) */}
                {activeModal === 'view_email' && selectedEmail && (
                    <Modal onClose={() => setActiveModal(null)} title="Read Message" wide>
                        <div className="flex flex-col h-full max-h-[70vh]">
                            {/* Header Info */}
                            <div className="border-b border-white/10 pb-6 mb-6">
                                <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{selectedEmail.subject}</h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold border border-indigo-500/30">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-medium">{selectedEmail.from.split('<')[0].replace(/"/g, '')}</p>
                                            <p className="text-xs text-zinc-500">{selectedEmail.from.match(/<([^>]+)>/)?.[1] || 'Unknown Email'}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded">
                                        Inbox
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable Body */}
                            <div className="bg-[#050505] p-6 rounded-xl border border-white/5 flex-1 overflow-y-auto custom-scrollbar mb-4">
                                <p className="text-zinc-300 text-sm leading-7 whitespace-pre-wrap font-light">
                                    {selectedEmail.snippet} 
                                    {/* Note: Real API should return 'body' html, we simulate a long body here for scroll test */}
                                    {"\n\n" + Array(5).fill("This is a simulation of the full email body content. It repeats to demonstrate the scrolling capability of the new modal design. The actual content would come from the Gmail API's 'body' field.").join("\n\n")}
                                </p>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-auto">
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Reply">
                                        <Send size={18} />
                                    </button>
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Attachment">
                                        <Paperclip size={18} />
                                    </button>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-zinc-400 hover:text-white text-sm">Close</button>
                                    <a 
                                        href={`https://mail.google.com/mail/u/0/#inbox/${selectedEmail.id}`} 
                                        target="_blank" 
                                        className="px-4 py-2 bg-white text-black font-bold rounded-lg text-sm hover:bg-zinc-200 flex items-center gap-2 transition-colors"
                                    >
                                        Open in Gmail <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}

            </AnimatePresence>
        </motion.div>
    );
}

// --- HELPER COMPONENTS ---

// 1. Improved Modal Wrapper
function Modal({ children, onClose, title, wide = false }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                className={`w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl relative flex flex-col max-h-[90vh]`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                    <button onClick={onClose} className="p-1 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        <X size={20}/>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}

// 2. Scrollable Widget Card
const WidgetCard = ({ title, icon: Icon, children, color, bg }) => (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-0 flex flex-col h-full shadow-xl overflow-hidden relative group hover:border-white/20 transition-colors">
        {/* Header */}
        <div className="p-5 border-b border-white/5 bg-[#0a0a0a] z-10 relative">
            <div className="flex items-center gap-3">
                <div className={`p-2.5 ${bg} ${color} rounded-xl border border-white/5 shadow-inner`}>
                    <Icon size={20} />
                </div>
                <h3 className="font-bold text-lg text-white">{title}</h3>
            </div>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1 relative z-0">
            {children}
        </div>

        {/* Bottom Fade for Scroll Indication */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </div>
);

// 3. Empty State
const EmptyState = ({ text }) => (
    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 pb-10">
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 border border-white/5">
            <X size={20} className="text-zinc-500" />
        </div>
        <p className="text-zinc-500 text-sm">{text}</p>
    </div>
);