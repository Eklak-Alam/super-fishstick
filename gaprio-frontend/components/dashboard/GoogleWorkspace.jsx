'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mail, Video, Send, FileText, Calendar, 
    ExternalLink, Plus, X, Clock, User, 
    Save, CheckCircle2, Copy, AlertCircle, Trash2, UploadCloud, Reply, Terminal, Check
} from 'lucide-react';
import ConnectState from './ConnectState';
import Image from 'next/image';
import api from '@/lib/axios';

export default function GoogleWorkspace({ isConnected, data, user, onRefresh }) {
    
    // --- State ---
    const [activeView, setActiveView] = useState('mail'); // 'mail', 'calendar', 'drive'
    const [activeModal, setActiveModal] = useState(null); // 'compose', 'meeting', 'view_email', 'meeting_success', 'drive_upload'
    const [selectedItem, setSelectedItem] = useState(null);
    const [createdMeeting, setCreatedMeeting] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isReplying, setIsReplying] = useState(false);

    // --- Helpers ---
    const showToast = (type, text) => {
        setNotification({ type, text });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleAuth = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?userId=${user?.id}`;
    };

    const extractEmailAddress = (fromStr) => {
        const match = fromStr?.match(/<(.+)>/);
        return match ? match[1] : fromStr;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showToast('success', 'Link copied to clipboard');
    };

    // --- CRUD ACTIONS ---

    // 1. Emails
    const handleSendEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/integrations/google/email/send', formData);
            showToast('success', 'Email dispatched securely.');
            setActiveModal(null);
            setFormData({});
            if (onRefresh) onRefresh();
        } catch (err) { showToast('error', 'Dispatch failed. Verify recipient.'); } 
        finally { setLoading(false); }
    };

    const handleReplyEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/integrations/google/email/reply', {
                to: extractEmailAddress(selectedItem.from),
                subject: `Re: ${selectedItem.subject}`,
                body: formData.replyBody,
                threadId: selectedItem.threadId,
                messageId: selectedItem.id
            });
            showToast('success', 'Reply sent successfully.');
            setIsReplying(false);
            setActiveModal(null);
            setFormData({});
        } catch (err) { showToast('error', 'Failed to send reply.'); } 
        finally { setLoading(false); }
    };

    const handleSaveDraft = async () => {
        if(!formData.to || !formData.subject) return showToast('error', 'Recipient and Subject required');
        setLoading(true);
        try {
            await api.post('/integrations/google/email/draft', formData);
            showToast('success', 'Draft saved to Gmail.');
            setActiveModal(null);
            setFormData({});
        } catch (err) { showToast('error', 'Failed to save draft.');
        } finally { setLoading(false); }
    };

    const handleDeleteEmail = async (id) => {
        try {
            await api.delete(`/integrations/google/email/${id}`);
            showToast('success', 'Email moved to trash.');
            setActiveModal(null);
            if (onRefresh) onRefresh();
        } catch (err) { showToast('error', 'Failed to delete email.'); }
    };

    // 2. Calendar
    const handleCreateMeeting = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const start = new Date(formData.startTime);
            const end = new Date(start.getTime() + 60 * 60 * 1000); 

            const res = await api.post('/integrations/google/calendar/create', {
                summary: formData.summary,
                description: formData.description,
                startTime: start,
                endTime: end
            });
            
            setCreatedMeeting(res.data.data);
            setActiveModal('meeting_success');
            setFormData({});
            if (onRefresh) onRefresh();
        } catch (err) { showToast('error', 'Failed to schedule meeting.'); } 
        finally { setLoading(false); }
    };

    const handleDeleteMeeting = async (id) => {
        try {
            await api.delete(`/integrations/google/calendar/${id}`);
            showToast('success', 'Meeting canceled successfully.');
            if (onRefresh) onRefresh();
        } catch (err) { showToast('error', 'Failed to cancel meeting.'); }
    };

    // 3. Drive
    const handleUploadDrive = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/integrations/google/drive/upload', {
                name: formData.fileName + '.txt',
                mimeType: 'text/plain',
                bufferText: formData.fileContent
            });
            showToast('success', 'Document injected into Google Drive.');
            setActiveModal(null);
            setFormData({});
            if (onRefresh) onRefresh();
        } catch (err) { showToast('error', 'Failed to push document.'); } 
        finally { setLoading(false); }
    };

    const handleDeleteFile = async (id) => {
        try {
            await api.delete(`/integrations/google/drive/${id}`);
            showToast('success', 'File deleted permanently.');
            if (onRefresh) onRefresh();
        } catch (err) { showToast('error', 'Failed to delete file.'); }
    };

    // --- RENDER ---
    if (!isConnected) return <ConnectState icon={Mail} title="Initialize Google Workspace" onClick={handleAuth} />;

    return (
        <div className="w-full h-full flex flex-col relative pb-8">
            
            {/* --- ELITE TOAST NOTIFICATION --- */}
            <AnimatePresence>
                {notification && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={`fixed bottom-8 right-8 z-[200] px-5 py-3.5 rounded-xl shadow-2xl border flex items-center gap-3 ${
                            notification.type === 'success' ? 'bg-[#0a0a0a] border-orange-500/30 text-zinc-100 shadow-[0_10px_40px_rgba(249,115,22,0.15)]' : 'bg-[#0a0a0a] border-red-500/30 text-zinc-100 shadow-[0_10px_40px_rgba(239,68,68,0.15)]'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'}`}>
                            {notification.type === 'success' ? <Check size={16} strokeWidth={3} /> : <AlertCircle size={16} strokeWidth={3} />}
                        </div>
                        <span className="text-[13px] font-semibold tracking-wide pr-2">{notification.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MASTER HEADER & TABS --- */}
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-sm mb-6 flex flex-col overflow-hidden shrink-0">
                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-800/80">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-inner">
                            <Image src="/companylogo/google.webp" alt="Google" width={24} height={24} className="object-contain" style={{ width: "auto", height: "auto" }} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-white tracking-tight">Google Command</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Workspace Active</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Dynamic Action Button based on View */}
                    <div className="w-full md:w-auto">
                        {activeView === 'mail' && (
                            <button onClick={() => { setFormData({}); setActiveModal('compose'); }} className="w-full md:w-auto px-6 py-3 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                                <Plus size={16} /> Compose Email
                            </button>
                        )}
                        {activeView === 'calendar' && (
                            <button onClick={() => { setFormData({}); setActiveModal('meeting'); }} className="w-full md:w-auto px-6 py-3 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                                <Video size={16} /> Schedule Meeting
                            </button>
                        )}
                        {activeView === 'drive' && (
                            <button onClick={() => { setFormData({}); setActiveModal('drive_upload'); }} className="w-full md:w-auto px-6 py-3 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                                <UploadCloud size={16} /> Create Document
                            </button>
                        )}
                    </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex items-center px-4 bg-[#050505] overflow-x-auto custom-scrollbar">
                    <TabButton active={activeView === 'mail'} onClick={() => setActiveView('mail')} icon={Mail} label="Inbox" count={data.emails?.length} />
                    <TabButton active={activeView === 'calendar'} onClick={() => setActiveView('calendar')} icon={Calendar} label="Calendar" count={data.meetings?.length} />
                    <TabButton active={activeView === 'drive'} onClick={() => setActiveView('drive')} icon={FileText} label="Drive" count={data.files?.length} />
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 bg-[#0a0a0a] border border-zinc-800 rounded-[24px] overflow-hidden flex flex-col shadow-xl min-h-[500px] relative">
                
                <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] bg-[position:0_0,12px_12px] opacity-30 pointer-events-none" />

                {/* 👇 Added pb-20 so the last item never sticks to the bottom border */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 pb-20 z-10" data-lenis-prevent="true">
                    
                    {/* VIEW: MAIL */}
                    {activeView === 'mail' && (
                        <div className="flex flex-col gap-2">
                            {data.emails?.length ? data.emails.map(e => (
                                <div key={e.id} className="flex items-start gap-3 p-4 bg-[#050505] border border-zinc-800 hover:border-orange-500/30 hover:shadow-lg rounded-2xl transition-all group">
                                    <button 
                                        onClick={() => { setSelectedItem(e); setIsReplying(false); setActiveModal('view_email'); }}
                                        className="flex-1 flex items-start gap-4 min-w-0 outline-none text-left"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-sm font-bold text-orange-500 shrink-0">
                                            {e.from.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                                <span className="font-bold text-[14px] text-zinc-100 truncate pr-4">{e.from.split('<')[0].replace(/"/g, '')}</span>
                                                <span className="text-[10px] text-zinc-500 font-mono shrink-0">{new Date(e.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[13px] font-semibold text-white truncate max-w-[80%]">{e.subject}</span>
                                                <span className="text-[12px] text-zinc-500 line-clamp-2 leading-relaxed">{e.snippet}</span>
                                            </div>
                                        </div>
                                    </button>
                                    <button onClick={() => handleDeleteEmail(e.id)} className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )) : <EmptyState icon={Mail} title="Inbox Zero" desc="No pending payloads in your connected account." />}
                        </div>
                    )}

                    {/* VIEW: CALENDAR */}
                    {activeView === 'calendar' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.meetings?.length ? data.meetings.map(m => (
                                <div key={m.id} className="bg-[#050505] border border-zinc-800 hover:border-orange-500/30 rounded-2xl p-5 flex flex-col gap-5 group transition-all hover:shadow-lg">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4 items-center min-w-0">
                                            <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex flex-col items-center justify-center shrink-0 shadow-inner">
                                                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{new Date(m.start.dateTime || m.start.date).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-lg font-black text-white leading-tight">{new Date(m.start.dateTime || m.start.date).getDate()}</span>
                                            </div>
                                            <div className="min-w-0 pr-2">
                                                <h4 className="font-bold text-[14px] text-zinc-100 truncate mb-1">{m.summary}</h4>
                                                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
                                                    <Clock size={12} className="text-zinc-600"/>
                                                    {new Date(m.start.dateTime || m.start.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteMeeting(m.id)} className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    
                                    {m.link ? (
                                        <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-2 pl-3 mt-auto">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <Video size={14} className="text-orange-500 shrink-0" />
                                                <span className="text-xs text-zinc-400 font-mono truncate">{m.link}</span>
                                            </div>
                                            <button onClick={() => copyToClipboard(m.link)} className="p-2 bg-[#050505] border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg transition-colors shrink-0 shadow-sm">
                                                <Copy size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-3 rounded-xl border border-dashed border-zinc-800/80 text-zinc-600 text-[11px] font-mono uppercase tracking-widest text-center mt-auto">No Link Attached</div>
                                    )}
                                </div>
                            )) : <div className="col-span-full"><EmptyState icon={Calendar} title="Clear Schedule" desc="No upcoming events found." /></div>}
                        </div>
                    )}

                    {/* VIEW: DRIVE */}
                    {activeView === 'drive' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {data.files?.length ? data.files.map(f => (
                                <div key={f.id} className="bg-[#050505] border border-zinc-800 rounded-2xl p-5 flex flex-col group hover:border-orange-500/30 transition-all hover:shadow-lg">
                                    <div className="flex justify-between items-start mb-5">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner group-hover:border-zinc-700 transition-colors">
                                            <img src={f.iconLink} alt="icon" className="w-6 h-6 opacity-90 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <button onClick={() => handleDeleteFile(f.id)} className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <h4 className="text-[14px] font-bold text-zinc-200 truncate mb-1 group-hover:text-white transition-colors" title={f.name}>{f.name}</h4>
                                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-5">Drive Document</p>
                                    
                                    <a href={f.webViewLink} target="_blank" className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-orange-500 rounded-xl text-[13px] font-semibold text-zinc-300 transition-colors">
                                        Access File <ExternalLink size={14} />
                                    </a>
                                </div>
                            )) : <div className="col-span-full"><EmptyState icon={FileText} title="Vault is Empty" desc="No recent files found in your connected Drive." /></div>}
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODALS --- */}
            <AnimatePresence>
                
                {/* 1. COMPOSE MODAL */}
                {activeModal === 'compose' && (
                    <Modal onClose={() => setActiveModal(null)} title="New Transmission">
                        {/* 👇 Added pb-8 for more breathing room at bottom of modal forms */}
                        <form onSubmit={handleSendEmail} className="p-6 pb-8 space-y-5">
                            <InputGroup label="Recipient" value={formData.to} onChange={e => setFormData({...formData, to: e.target.value})} icon={User} placeholder="address@domain.com" type="email" required />
                            <InputGroup label="Subject Line" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} icon={FileText} placeholder="Enter subject..." required />
                            <div className="space-y-2 w-full">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Message Body</label>
                                <textarea placeholder="Write your message here..." rows={6} required value={formData.body || ''} onChange={e => setFormData({...formData, body: e.target.value})} className="w-full bg-[#050505] border border-zinc-800 rounded-xl p-4 text-[13px] text-zinc-100 placeholder:text-zinc-700 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-inner resize-none custom-scrollbar" />
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-zinc-800/80">
                                <button type="button" onClick={handleSaveDraft} disabled={loading} className="flex-1 bg-[#050505] border border-zinc-800 text-zinc-300 py-3.5 rounded-xl text-[13px] font-semibold hover:text-white hover:border-zinc-600 transition-colors flex items-center justify-center gap-2">
                                    <Save size={16} /> Save Draft
                                </button>
                                <button type="submit" disabled={loading} className="flex-[2] bg-orange-500 text-white py-3.5 rounded-xl text-[13px] font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.3)] disabled:opacity-50">
                                    {loading ? 'Transmitting...' : 'Send Payload'} <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* 2. MEETING CREATE MODAL */}
                {activeModal === 'meeting' && (
                    <Modal onClose={() => setActiveModal(null)} title="Schedule Event">
                        <form onSubmit={handleCreateMeeting} className="p-6 pb-8 space-y-5">
                            <InputGroup label="Event Title" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} icon={Calendar} placeholder="e.g. Architectural Sync" required />
                            <InputGroup label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} icon={FileText} placeholder="Agenda details..." />
                            <InputGroup label="Start Time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} icon={Clock} type="datetime-local" required />
                            
                            <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl flex items-start gap-3 shadow-inner">
                                <Video size={16} className="text-orange-500 mt-0.5 shrink-0" /> 
                                <div>
                                    <p className="text-[13px] font-semibold text-orange-500">Google Meet Generation</p>
                                    <p className="text-[11px] text-zinc-400 mt-0.5">A secure video link will be generated automatically.</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-800/80">
                                <button disabled={loading} className="w-full bg-orange-500 text-white py-3.5 rounded-xl text-[13px] font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                                    <Video size={16} /> {loading ? 'Scheduling...' : 'Create Meeting & Link'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* 3. UPLOAD TO DRIVE MODAL */}
                {activeModal === 'drive_upload' && (
                    <Modal onClose={() => setActiveModal(null)} title="Push to Vault">
                        <form onSubmit={handleUploadDrive} className="p-6 pb-8 space-y-5">
                            <InputGroup label="Document Name" value={formData.fileName} onChange={e => setFormData({...formData, fileName: e.target.value})} icon={FileText} placeholder="e.g. Mission_Brief" required />
                            <div className="space-y-2 w-full">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Content</label>
                                <textarea placeholder="Type the text you want saved..." rows={6} required value={formData.fileContent || ''} onChange={e => setFormData({...formData, fileContent: e.target.value})} className="w-full bg-[#050505] border border-zinc-800 rounded-xl p-4 text-[13px] text-zinc-100 placeholder:text-zinc-700 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-inner resize-none custom-scrollbar" />
                            </div>
                            <div className="pt-4 border-t border-zinc-800/80">
                                <button disabled={loading} className="w-full bg-orange-500 text-white py-3.5 rounded-xl text-[13px] font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                                    {loading ? 'Uploading...' : 'Save to Drive'} <UploadCloud size={16} />
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* 4. MEETING SUCCESS MODAL */}
                {activeModal === 'meeting_success' && createdMeeting && (
                    <Modal onClose={() => setActiveModal(null)} title="Event Scheduled">
                        <div className="text-center py-6 px-6">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.15)]">
                                <CheckCircle2 size={40} className="text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Meeting Confirmed</h3>
                            <p className="text-zinc-400 text-[13px] mb-8">Calendar updated and Meet link generated.</p>
                            
                            <div className="bg-[#050505] border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4 mb-8 shadow-inner">
                                <code className="text-orange-500 text-[13px] font-mono truncate flex-1 text-left select-all">{createdMeeting.link}</code>
                                <button onClick={() => copyToClipboard(createdMeeting.link)} className="p-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg transition-colors shadow-sm">
                                    <Copy size={16} />
                                </button>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="w-full bg-white text-black py-3.5 rounded-xl text-[13px] font-bold hover:bg-zinc-200 transition-colors shadow-lg active:scale-95">
                                Acknowledge
                            </button>
                        </div>
                    </Modal>
                )}

                {/* 5. EMAIL READER + REPLY MODAL */}
                {activeModal === 'view_email' && selectedItem && (
                    <Modal onClose={() => setActiveModal(null)} title="Payload Details" wide>
                        <div className="flex flex-col h-full">
                            
                            {/* Email Header */}
                            <div className="border-b border-zinc-800/80 px-8 py-6 bg-[#0a0a0a]">
                                <h3 className="text-2xl font-bold text-white mb-5 tracking-tight leading-snug">{selectedItem.subject}</h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-lg font-bold text-orange-500 shadow-inner">
                                            {selectedItem.from.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-[15px] text-zinc-100 font-bold">{selectedItem.from.replace(/<.*>/, '')}</p>
                                            <p className="text-[12px] text-zinc-500 font-mono tracking-wide mt-0.5">{extractEmailAddress(selectedItem.from)}</p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] text-zinc-500 font-mono bg-[#050505] border border-zinc-800 px-3 py-1.5 rounded-lg shadow-inner">{new Date(selectedItem.date).toLocaleString()}</span>
                                </div>
                            </div>
                            
                            {/* Email Body */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8" data-lenis-prevent="true">
                                <div className="bg-[#050505] p-6 rounded-2xl border border-zinc-800/80 shadow-inner min-h-[200px]">
                                    <p className="text-zinc-300 text-[14px] leading-relaxed whitespace-pre-wrap font-medium">{selectedItem.snippet}</p>
                                </div>
                            </div>
                            
                            {/* Reply Section */}
                            <div className="p-6 border-t border-zinc-800/80 bg-[#0a0a0a] shrink-0">
                                {!isReplying ? (
                                    <div className="flex justify-between items-center">
                                        <button onClick={() => handleDeleteEmail(selectedItem.id)} className="flex items-center gap-2 px-4 py-2.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
                                            <Trash2 size={14} /> Wipe
                                        </button>
                                        <div className="flex items-center gap-3">
                                            <a href={`https://mail.google.com/mail/u/0/#inbox/${selectedItem.id}`} target="_blank" className="px-5 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 rounded-xl text-[13px] font-semibold flex items-center gap-2 transition-colors">
                                                Open Native <ExternalLink size={14} />
                                            </a>
                                            <button onClick={() => setIsReplying(true)} className="px-6 py-3 bg-white text-black font-bold rounded-xl text-[13px] hover:bg-zinc-200 flex items-center gap-2 transition-colors active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                                <Reply size={16} /> Reply
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleReplyEmail} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                        <div className="space-y-2 w-full">
                                            <label className="text-[10px] font-bold text-orange-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                                                <Reply size={12}/> Target: {extractEmailAddress(selectedItem.from)}
                                            </label>
                                            <textarea 
                                                placeholder="Write your reply here..." rows={4} required value={formData.replyBody || ''}
                                                onChange={e => setFormData({...formData, replyBody: e.target.value})}
                                                className="w-full bg-[#050505] border border-zinc-800 rounded-xl p-4 text-[13px] text-zinc-100 placeholder:text-zinc-700 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-inner resize-none custom-scrollbar" 
                                            />
                                        </div>
                                        <div className="flex gap-3 justify-end">
                                            <button type="button" onClick={() => setIsReplying(false)} className="px-5 py-3 text-zinc-400 hover:text-white text-xs font-bold transition-colors">Cancel</button>
                                            <button type="submit" disabled={loading} className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl text-[13px] hover:bg-orange-600 flex items-center gap-2 transition-colors active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                                                {loading ? 'Transmitting...' : 'Send Reply'} <Send size={14} />
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </Modal>
                )}

            </AnimatePresence>
        </div>
    );
}

// --- STRUCTURAL SUB-COMPONENTS ---

function TabButton({ active, onClick, icon: Icon, label, count }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all outline-none text-sm font-semibold whitespace-nowrap
                ${active ? 'border-orange-500 text-white bg-zinc-900/50' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}
            `}
        >
            <Icon size={16} className={active ? 'text-orange-500' : 'opacity-70'} /> {label}
            {count > 0 && (
                <span className={`ml-1.5 text-[10px] px-2 py-0.5 rounded-md font-mono border ${active ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-[#050505] text-zinc-500 border-zinc-800'}`}>
                    {count}
                </span>
            )}
        </button>
    );
}

function Modal({ children, onClose, title, wide = false }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`w-full ${wide ? 'max-w-3xl' : 'max-w-md'} bg-[#0a0a0a] border border-zinc-800 rounded-[24px] shadow-2xl flex flex-col max-h-[85vh] relative z-10 overflow-hidden`}
            >
                <div className="flex justify-between items-center p-6 border-b border-zinc-800/80 bg-[#0a0a0a] z-20">
                    <h2 className="text-xs font-bold text-zinc-400 tracking-widest uppercase">{title}</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 rounded-full transition-all">
                        <X size={14}/>
                    </button>
                </div>
                <div className="overflow-y-auto custom-scrollbar flex-1" data-lenis-prevent="true">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}

function EmptyState({ icon: Icon, title, desc }) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-12">
            <div className="w-20 h-20 bg-[#050505] border border-zinc-800 rounded-[28px] flex items-center justify-center mb-5 shadow-inner">
                <Icon size={32} className="text-zinc-600" />
            </div>
            <p className="text-xl font-bold text-zinc-200 tracking-tight">{title}</p>
            <p className="text-sm text-zinc-500 mt-2 max-w-[250px] mx-auto leading-relaxed">{desc}</p>
        </div>
    );
}

function InputGroup({ label, value, onChange, icon: Icon, type = "text", placeholder, required }) {
    return (
        <div className="space-y-2 w-full">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-zinc-600 group-focus-within:text-orange-500 transition-colors z-10">
                    <Icon size={18} />
                </div>
                <input 
                    type={type} value={value || ''} onChange={onChange} placeholder={placeholder} required={required}
                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-[13px] text-zinc-100 placeholder:text-zinc-700 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-[#0a0a0a] outline-none transition-all shadow-inner" 
                />
            </div>
        </div>
    );
}