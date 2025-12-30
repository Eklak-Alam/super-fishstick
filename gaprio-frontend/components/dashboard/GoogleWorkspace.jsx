'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mail, Video, Send, FileText, Calendar, 
    ExternalLink, Plus, X, Clock, User, Paperclip, 
    Save, CheckCircle2, Copy, AlertCircle
} from 'lucide-react';
import ConnectState from './ConnectState';
import api from '@/lib/axios';

export default function GoogleWorkspace({ isConnected, data, user, onRefresh }) {
    
    // --- State ---
    const [activeModal, setActiveModal] = useState(null); // 'compose', 'meeting', 'view_email', 'meeting_success'
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [createdMeeting, setCreatedMeeting] = useState(null); // To store the link after creation
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null); // { type: 'success'|'error', text: '' }

    // --- Helpers ---
    const showToast = (type, text) => {
        setNotification({ type, text });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleAuth = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?userId=${user?.id}`;
    };

    // --- Actions ---

    // 1. Send Email
    const handleSendEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/integrations/google/email/send', formData);
            showToast('success', 'Email sent successfully!');
            setActiveModal(null);
            setFormData({});
            if (onRefresh) onRefresh();
        } catch (err) { 
            showToast('error', 'Failed to send email. Check recipient.');
        } finally { 
            setLoading(false); 
        }
    };

    // 2. Save Draft
    const handleSaveDraft = async () => {
        if(!formData.to || !formData.subject) return showToast('error', 'Recipient and Subject are required');
        setLoading(true);
        try {
            await api.post('/integrations/google/email/draft', formData);
            showToast('success', 'Draft saved to Gmail!');
            setActiveModal(null);
            setFormData({});
        } catch (err) {
            showToast('error', 'Failed to save draft.');
        } finally {
            setLoading(false);
        }
    };

    // 3. Create Meeting
    const handleCreateMeeting = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Default: 1 Hour Duration
            const start = new Date(formData.startTime);
            const end = new Date(start.getTime() + 60 * 60 * 1000); 

            const res = await api.post('/integrations/google/calendar/create', {
                summary: formData.summary,
                description: formData.description,
                startTime: start,
                endTime: end
            });
            
            // Show Success Modal with Link
            setCreatedMeeting(res.data.data); // Contains .link (Google Meet URL)
            setActiveModal('meeting_success');
            setFormData({});
            if (onRefresh) onRefresh();
        } catch (err) { 
            console.error(err);
            showToast('error', 'Failed to schedule meeting.'); 
        } finally { 
            setLoading(false); 
        }
    };

    if (!isConnected) return <ConnectState icon={Mail} title="Connect Google Workspace" onClick={handleAuth} />;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto h-full flex flex-col relative">
            
            {/* --- Toast Notification --- */}
            <AnimatePresence>
                {notification && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={`absolute top-4 left-1/2 z-50 px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl border ${notification.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        <span className="text-sm font-bold">{notification.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Command Center</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex -space-x-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#020202]" />
                            <div className="w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#020202]" />
                            <div className="w-2 h-2 rounded-full bg-orange-500 ring-2 ring-[#020202]" />
                        </div>
                        <p className="text-sm text-zinc-400">Google Workspace Active</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => setActiveModal('meeting')} className="flex-1 md:flex-none bg-orange-600/10 text-orange-500 border border-orange-600/20 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600/20 transition-all text-sm">
                        <Video size={16}/> New Meeting
                    </button>
                    <button onClick={() => setActiveModal('compose')} className="flex-1 md:flex-none bg-white text-black px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-lg shadow-white/10 text-sm">
                        <Plus size={16}/> Compose
                    </button>
                </div>
            </div>

            {/* --- WIDGET GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden pb-4">
                
                {/* 1. GMAIL INBOX */}
                <WidgetCard title="Recent Emails" icon={Mail} color="text-red-400" bg="bg-red-500/10">
                    {data.emails?.length ? data.emails.map(e => (
                        <div key={e.id} onClick={() => { setSelectedEmail(e); setActiveModal('view_email'); }} className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl mb-2.5 border border-white/5 cursor-pointer group transition-all">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-xs text-zinc-200 group-hover:text-white truncate w-3/4">{e.from.split('<')[0].replace(/"/g, '')}</span>
                                <span className="text-[10px] text-zinc-500 font-mono">{new Date(e.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                            </div>
                            <h4 className="text-sm font-semibold text-white mb-0.5 truncate">{e.subject}</h4>
                            <p className="text-xs text-zinc-500 line-clamp-1">{e.snippet}</p>
                        </div>
                    )) : <EmptyState text="Inbox zero! No new emails." />}
                </WidgetCard>

                {/* 2. CALENDAR */}
                <WidgetCard title="Today's Schedule" icon={Calendar} color="text-orange-400" bg="bg-orange-500/10">
                    {data.meetings?.length ? data.meetings.map(m => (
                        <div key={m.id} className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl mb-2.5 border border-white/5 group transition-all flex justify-between items-center">
                            <div>
                                <div className="font-bold text-sm text-white mb-1 group-hover:text-orange-400 transition-colors line-clamp-1">{m.summary}</div>
                                <div className="flex items-center gap-2 text-xs text-zinc-400">
                                    <Clock size={12} className="text-orange-500"/>
                                    {new Date(m.start.dateTime || m.start.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                            {m.link && (
                                <a href={m.link} target="_blank" className="w-8 h-8 flex items-center justify-center bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500 hover:text-white transition-all">
                                    <Video size={14} />
                                </a>
                            )}
                        </div>
                    )) : <EmptyState text="No meetings scheduled." />}
                </WidgetCard>

                {/* 3. DRIVE FILES */}
                <WidgetCard title="Recent Files" icon={FileText} color="text-blue-400" bg="bg-blue-500/10">
                    {data.files?.length ? data.files.map(f => (
                        <a href={f.webViewLink} target="_blank" key={f.id} className="flex items-center gap-3 p-3.5 bg-white/5 hover:bg-white/10 rounded-xl mb-2.5 border border-white/5 group transition-all hover:border-blue-500/30">
                            <div className="w-8 h-8 rounded-lg bg-[#0a0a0a] border border-white/10 flex items-center justify-center shrink-0">
                                <img src={f.iconLink} alt="icon" className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-300 truncate group-hover:text-white">{f.name}</p>
                                <p className="text-[10px] text-zinc-500">Modified recently</p>
                            </div>
                            <ExternalLink size={12} className="text-zinc-600 group-hover:text-blue-400 transition-colors" />
                        </a>
                    )) : <EmptyState text="No recent files." />}
                </WidgetCard>
            </div>

            {/* --- MODALS --- */}
            <AnimatePresence>
                
                {/* 1. COMPOSE */}
                {activeModal === 'compose' && (
                    <Modal onClose={() => setActiveModal(null)} title="Compose Email">
                        <form onSubmit={handleSendEmail} className="space-y-4">
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Recipient</label>
                                <input placeholder="client@company.com" className="input-field" onChange={e => setFormData({...formData, to: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Subject</label>
                                <input placeholder="Project Update..." className="input-field" onChange={e => setFormData({...formData, subject: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Message</label>
                                <textarea placeholder="Write your message..." rows={6} className="input-field resize-none" onChange={e => setFormData({...formData, body: e.target.value})} required />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={handleSaveDraft} disabled={loading} className="flex-1 bg-white/5 text-white border border-white/10 py-2.5 rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                    <Save size={16} /> Draft
                                </button>
                                <button type="submit" disabled={loading} className="flex-[2] btn-primary flex items-center justify-center gap-2">
                                    {loading ? 'Sending...' : 'Send Email'} <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* 2. MEETING CREATE */}
                {activeModal === 'meeting' && (
                    <Modal onClose={() => setActiveModal(null)} title="Schedule Meeting">
                        <form onSubmit={handleCreateMeeting} className="space-y-4">
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Title</label>
                                <input placeholder="Weekly Sync..." className="input-field" onChange={e => setFormData({...formData, summary: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Description</label>
                                <input placeholder="Agenda items..." className="input-field" onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 ml-1 mb-1 block">Start Time</label>
                                <input type="datetime-local" className="input-field" onChange={e => setFormData({...formData, startTime: e.target.value})} required />
                            </div>
                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300 flex items-center gap-2">
                                <Video size={14} className="animate-pulse" /> A Google Meet link will be generated automatically.
                            </div>
                            <button disabled={loading} className="btn-primary w-full mt-2">
                                {loading ? 'Scheduling...' : 'Create Meeting'}
                            </button>
                        </form>
                    </Modal>
                )}

                {/* 3. MEETING SUCCESS (SHOW LINK) */}
                {activeModal === 'meeting_success' && createdMeeting && (
                    <Modal onClose={() => setActiveModal(null)} title="Meeting Created!">
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                                <CheckCircle2 size={32} className="text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">You're all set!</h3>
                            <p className="text-zinc-400 text-sm mb-6">Your Google Meet link has been generated.</p>
                            
                            <div className="bg-[#050505] border border-white/10 rounded-xl p-4 flex items-center justify-between gap-3 mb-6">
                                <code className="text-orange-400 text-sm truncate flex-1 text-left">{createdMeeting.link}</code>
                                <button 
                                    onClick={() => { navigator.clipboard.writeText(createdMeeting.link); showToast('success', 'Copied to clipboard'); }} 
                                    className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>

                            <button onClick={() => setActiveModal(null)} className="btn-primary w-full">Done</button>
                        </div>
                    </Modal>
                )}

                {/* 4. VIEW EMAIL */}
                {activeModal === 'view_email' && selectedEmail && (
                    <Modal onClose={() => setActiveModal(null)} title="Read Message" wide>
                        <div className="flex flex-col h-full max-h-[70vh]">
                            <div className="border-b border-white/10 pb-4 mb-4">
                                <h3 className="text-xl font-bold text-white mb-2 leading-snug">{selectedEmail.subject}</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-orange-600 flex items-center justify-center text-xs font-bold text-white">
                                        {selectedEmail.from.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm text-white font-medium">{selectedEmail.from.replace(/<.*>/, '')}</p>
                                        <p className="text-[10px] text-zinc-500">via Gmail Integration</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#050505] p-5 rounded-xl border border-white/5 flex-1 overflow-y-auto custom-scrollbar mb-4">
                                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedEmail.snippet}</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                                <a 
                                    href={`https://mail.google.com/mail/u/0/#inbox/${selectedEmail.id}`} 
                                    target="_blank" 
                                    className="px-4 py-2 bg-white text-black font-bold rounded-lg text-sm hover:bg-zinc-200 flex items-center gap-2 transition-colors"
                                >
                                    Open in Gmail <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    </Modal>
                )}

            </AnimatePresence>
        </motion.div>
    );
}

// --- SUB-COMPONENTS ---

// 1. Premium Modal
function Modal({ children, onClose, title, wide = false }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 10 }} 
                className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
            >
                <div className="flex justify-between items-center p-5 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
                    <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        <X size={18}/>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}

// 2. Widget Card
const WidgetCard = ({ title, icon: Icon, children, color, bg }) => (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col h-full shadow-lg overflow-hidden relative">
        <div className="p-4 border-b border-white/5 bg-[#0a0a0a] flex items-center gap-3 sticky top-0 z-10">
            <div className={`p-2 ${bg} ${color} rounded-lg border border-white/5 shadow-inner`}>
                <Icon size={16} />
            </div>
            <h3 className="font-bold text-sm text-white">{title}</h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
            {children}
        </div>
    </div>
);

// 3. Empty State
const EmptyState = ({ text }) => (
    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-2 border border-white/5">
            <X size={16} className="text-zinc-500" />
        </div>
        <p className="text-zinc-500 text-xs">{text}</p>
    </div>
);