'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, Hash, Users, Send, X, 
    Search, Edit2, Trash2, ArrowLeft, 
    Loader2, CheckCircle2, AlertCircle, ChevronRight, Plus, Lock, User, Terminal, Mail, UserCircle, Check
} from 'lucide-react';
import ConnectState from './ConnectState';
import Image from 'next/image';
import api from '@/lib/axios';

export default function SlackWorkspace({ isConnected, data, user, onRefresh }) {
    
    // --- State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEntity, setSelectedEntity] = useState(null); 
    const [activeChannelId, setActiveChannelId] = useState(null); 
    
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    
    // UI Toggles
    const [openFolders, setOpenFolders] = useState({ channels: true, groups: true, users: true });
    const [activeModal, setActiveModal] = useState(null); // 'create_channel', 'view_profile'
    const [profileData, setProfileData] = useState(null);
    
    // Form & Chat State
    const [formData, setFormData] = useState({});
    const [inputText, setInputText] = useState('');
    const [editingMsgId, setEditingMsgId] = useState(null);
    const [editInputText, setEditInputText] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    const [notification, setNotification] = useState(null);
    const messagesEndRef = useRef(null);

    // --- Data Parsing ---
    const channels = data?.channels || [];
    const workspaceUsers = data?.users || [];

    const publicChannels = channels.filter(c => !c.is_private && !c.is_im && c.name !== 'Direct Message' && c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const privateGroups = channels.filter(c => c.is_private && !c.is_im && c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredUsers = workspaceUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // --- Helpers ---
    const showToast = (type, text) => {
        setNotification({ type, text });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAuth = () => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/slack?userId=${user?.id}`;
    const toggleFolder = (folder) => setOpenFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    const openUserProfile = (userData) => {
        setProfileData(userData);
        setActiveModal('view_profile');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    // --- Core API Actions ---
    const selectTarget = async (entity, type) => {
        setSelectedEntity({ ...entity, type });
        setLoadingMessages(true);
        setMessages([]);
        setActiveChannelId(null);

        try {
            let targetChannelId = entity.id;
            
            // Generate DM Channel if it's a User
            if (type === 'user') {
                const res = await api.post('/integrations/slack/dm/open', { targetUserId: entity.id });
                if(!res.data.success) throw new Error("DM Open Failed");
                targetChannelId = res.data.channelId;
            }
            
            setActiveChannelId(targetChannelId);

            const historyRes = await api.get('/integrations/slack/messages', { params: { channelId: targetChannelId } });
            setMessages(historyRes.data.data || []);
            setTimeout(scrollToBottom, 150);
        } catch (err) {
            showToast('error', 'Failed to establish connection. Ensure Slack permissions are granted.');
        } finally { setLoadingMessages(false); }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !activeChannelId) return;
        setIsSending(true);
        try {
            await api.post('/integrations/slack/message', { channelId: activeChannelId, text: inputText });
            setInputText('');
            const historyRes = await api.get('/integrations/slack/messages', { params: { channelId: activeChannelId } });
            setMessages(historyRes.data.data || []);
            setTimeout(scrollToBottom, 100);
        } catch (err) { showToast('error', 'Payload transmission failed.'); } 
        finally { setIsSending(false); }
    };

    const handleCreateChannel = async (e) => {
        e.preventDefault();
        setLoadingMessages(true);
        try {
            await api.post('/integrations/slack/channel/create', {
                name: formData.channelName,
                isPrivate: formData.isPrivate || false,
                description: formData.description
            });
            showToast('success', `${formData.isPrivate ? 'Group' : 'Channel'} successfully initialized.`);
            setActiveModal(null);
            setFormData({});
            if (onRefresh) onRefresh();
        } catch (err) {
            showToast('error', 'Initialization failed. Name may be in use.');
        } finally { setLoadingMessages(false); }
    };

    const handleUpdateMessage = async (e, ts) => {
        e.preventDefault();
        if (!editInputText.trim()) return;
        try {
            await api.put('/integrations/slack/message', { channelId: activeChannelId, ts: ts, newText: editInputText });
            setEditingMsgId(null);
            const historyRes = await api.get('/integrations/slack/messages', { params: { channelId: activeChannelId } });
            setMessages(historyRes.data.data || []);
            showToast('success', 'Transmission updated.');
        } catch (err) { showToast('error', 'Update failed.'); }
    };

    const handleDeleteMessage = async (ts) => {
        try {
            await api.delete('/integrations/slack/message', { data: { channelId: activeChannelId, ts } });
            setMessages(messages.filter(m => m.ts !== ts)); 
            showToast('success', 'Payload wiped from server.');
        } catch (err) { showToast('error', 'Wipe failed.'); }
    };

    if (!isConnected) return <ConnectState icon={MessageSquare} title="Initialize Slack Engine" onClick={handleAuth} />;

    return (
        <div className="w-full h-full flex flex-col relative pb-8">
            
            {/* --- ELITE TOAST --- */}
            <AnimatePresence>
                {notification && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={`fixed bottom-8 right-8 z-[200] px-5 py-3.5 rounded-xl shadow-2xl border flex items-center gap-3 ${notification.type === 'success' ? 'bg-[#0a0a0a] border-orange-500/30 text-zinc-100 shadow-[0_10px_40px_rgba(249,115,22,0.15)]' : 'bg-[#0a0a0a] border-red-500/30 text-zinc-100 shadow-[0_10px_40px_rgba(239,68,68,0.15)]'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'}`}>
                            {notification.type === 'success' ? <Check size={16} strokeWidth={3} /> : <AlertCircle size={16} strokeWidth={3} />}
                        </div>
                        <span className="text-[13px] font-semibold tracking-wide pr-2">{notification.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- CORE UI CONTAINER --- */}
            <div className="flex-1 bg-[#050505] border border-zinc-800 rounded-[24px] shadow-2xl overflow-hidden flex h-full min-h-[750px]">
                
                {/* === LEFT SIDEBAR: DIRECTORY === */}
                <div className={`w-full md:w-80 flex-col bg-[#0a0a0a] border-r border-zinc-800 shrink-0 ${selectedEntity ? 'hidden md:flex' : 'flex'}`}>
                    
                    {/* Search Header */}
                    <div className="p-5 md:p-6 border-b border-zinc-800/80 bg-[#050505]/50 shrink-0">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center shadow-inner p-1.5 shrink-0">
                                <Image src="/companylogo/slack.png" alt="Slack" width={20} height={20} className="object-contain" priority />
                            </div>
                            <h2 className="text-lg font-bold text-white tracking-tight">Slack Command</h2>
                        </div>
                        <div className="relative group">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                            <input 
                                type="text" placeholder="Search directory..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-inner" 
                            />
                        </div>
                    </div>

                    {/* Scrollable Channels */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-4 space-y-5 pb-20" data-lenis-prevent="true">
                        <SidebarFolder title="Public Channels" isOpen={openFolders.channels} onToggle={() => toggleFolder('channels')} onAdd={() => { setFormData({ isPrivate: false }); setActiveModal('create_channel'); }}>
                            {publicChannels.map(c => <SidebarItem key={c.id} name={c.name} icon={Hash} isSelected={selectedEntity?.id === c.id} onClick={() => selectTarget(c, 'channel')} count={c.members_count} />)}
                        </SidebarFolder>

                        <SidebarFolder title="Private Groups" isOpen={openFolders.groups} onToggle={() => toggleFolder('groups')} onAdd={() => { setFormData({ isPrivate: true }); setActiveModal('create_channel'); }}>
                            {privateGroups.map(c => <SidebarItem key={c.id} name={c.name} icon={Lock} isSelected={selectedEntity?.id === c.id} onClick={() => selectTarget(c, 'channel')} count={c.members_count} />)}
                        </SidebarFolder>

                        <SidebarFolder title="Direct Messages" isOpen={openFolders.users} onToggle={() => toggleFolder('users')}>
                            {filteredUsers.map(u => <SidebarItem key={u.id} name={u.name} imageUrl={u.image} isSelected={selectedEntity?.id === u.id} onClick={() => selectTarget(u, 'user')} />)}
                        </SidebarFolder>
                    </div>

                    {/* CLICKABLE ACTIVE PROFILE DOCK */}
                    <div className="p-4 border-t border-zinc-800/80 bg-[#050505]/80 shrink-0">
                        <button 
                            onClick={() => openUserProfile({ name: user?.full_name, email: user?.email, is_self: true })}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/80 shadow-inner transition-colors outline-none text-left group"
                        >
                            <div className="relative">
                                <div className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:shadow-orange-500/20 transition-all">
                                    {user?.full_name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-semibold text-zinc-100 truncate">{user?.full_name}</p>
                                <p className="text-[10px] text-orange-500 font-mono uppercase tracking-widest">Slack Sync Active</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* === RIGHT SIDEBAR: CHAT INTERFACE === */}
                <div className={`flex-1 flex-col bg-[#050505] relative ${selectedEntity ? 'flex' : 'hidden md:flex'}`}>
                    {selectedEntity ? (
                        <>
                            {/* Header */}
                            <div className="h-[76px] px-4 md:px-6 border-b border-zinc-800/80 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <button onClick={() => setSelectedEntity(null)} className="md:hidden p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors shadow-sm">
                                        <ArrowLeft size={16} />
                                    </button>
                                    
                                    {/* Clickable Header for Profiles */}
                                    <button 
                                        onClick={() => selectedEntity.type === 'user' && openUserProfile(selectedEntity)}
                                        className={`flex items-center gap-3 text-left outline-none ${selectedEntity.type === 'user' ? 'hover:bg-white/5 p-1.5 -ml-1.5 rounded-xl transition-colors' : 'cursor-default'}`}
                                    >
                                        {selectedEntity.type === 'user' ? (
                                            <img src={selectedEntity.image} className="w-10 h-10 rounded-xl border border-zinc-800 shadow-sm object-cover" alt="Avatar" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center shadow-inner">
                                                {selectedEntity.is_private ? <Lock size={18} /> : <Hash size={18} />}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-[14px] md:text-[15px] font-bold text-white tracking-tight flex items-center gap-2">
                                                {selectedEntity.name} 
                                                {selectedEntity.type === 'user' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                                            </h3>
                                            <p className="text-[11px] text-zinc-500 font-medium truncate max-w-[180px] sm:max-w-md mt-0.5">{selectedEntity.type === 'user' ? 'View User Profile' : selectedEntity.topic || 'Secure Workspace Channel'}</p>
                                        </div>
                                    </button>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg shadow-inner">
                                    <Terminal size={14} className="text-orange-500" />
                                    <span className="text-[11px] font-mono text-zinc-300 tracking-wider">SECURE</span>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 pb-20 space-y-6 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] bg-[position:0_0,12px_12px]" data-lenis-prevent="true">
                                <div className="absolute inset-0 bg-[#050505]/90 pointer-events-none" /> 
                                
                                <div className="relative z-10 flex flex-col justify-end min-h-full space-y-6">
                                    {loadingMessages ? (
                                        <div className="flex items-center justify-center text-orange-500 py-10"><Loader2 size={24} className="animate-spin" /></div>
                                    ) : messages.length > 0 ? (
                                        [...messages].reverse().map(msg => {
                                            const msgUserObj = workspaceUsers.find(u => u.id === msg.user) || { name: msg.user_name, image: msg.user_image };
                                            return (
                                                <div key={msg.ts} className="group flex gap-3 md:gap-4 hover:bg-zinc-900/60 p-3 md:p-4 -mx-2 md:-mx-4 rounded-2xl transition-colors relative">
                                                    
                                                    <button 
                                                        onClick={() => msg.user && openUserProfile(msgUserObj)}
                                                        className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden shadow-md hover:ring-2 hover:ring-orange-500/50 transition-all outline-none"
                                                    >
                                                        {msg.user_image ? <img src={msg.user_image} alt="User" className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-zinc-400">{msg.user_name?.charAt(0) || 'U'}</span>}
                                                    </button>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-baseline gap-2 mb-1.5">
                                                            <button onClick={() => msg.user && openUserProfile(msgUserObj)} className="font-bold text-[13px] md:text-[14px] text-white hover:underline outline-none truncate">
                                                                {msg.user_name || 'System Bot'}
                                                            </button>
                                                            <span className="text-[10px] text-zinc-500 font-mono tracking-wide shrink-0">{new Date(msg.ts * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                                        </div>

                                                        {editingMsgId === msg.ts ? (
                                                            <form onSubmit={(e) => handleUpdateMessage(e, msg.ts)} className="mt-2">
                                                                <textarea 
                                                                    value={editInputText || ''} onChange={e => setEditInputText(e.target.value)} autoFocus rows={3}
                                                                    className="w-full bg-[#0a0a0a] border border-orange-500/50 rounded-xl p-3 text-[13px] text-zinc-100 outline-none shadow-inner mb-2 resize-none custom-scrollbar focus:ring-2 focus:ring-orange-500/20" 
                                                                />
                                                                <div className="flex gap-2 justify-end">
                                                                    <button type="button" onClick={() => setEditingMsgId(null)} className="px-4 py-2 rounded-lg text-xs font-bold text-zinc-400 hover:text-white transition-colors">Cancel</button>
                                                                    <button type="submit" className="px-4 py-2 rounded-lg text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">Commit Edit</button>
                                                                </div>
                                                            </form>
                                                        ) : (
                                                            <div className="text-[13.5px] md:text-[14px] text-zinc-300 leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                                                        )}
                                                    </div>

                                                    {/* Floating Action Menu */}
                                                    <div className="absolute right-4 top-2 opacity-0 group-hover:opacity-100 flex bg-[#0a0a0a] border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-10 transition-opacity duration-200">
                                                        <button onClick={() => { setEditingMsgId(msg.ts); setEditInputText(msg.text); }} className="p-2.5 hover:bg-zinc-800 text-zinc-400 hover:text-blue-400 transition-colors"><Edit2 size={14} /></button>
                                                        <div className="w-px bg-zinc-800" />
                                                        <button onClick={() => handleDeleteMessage(msg.ts)} className="p-2.5 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="flex flex-col items-center justify-center opacity-50 py-20 px-4 text-center">
                                            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                                                <MessageSquare size={24} className="text-zinc-600" />
                                            </div>
                                            <p className="text-sm font-bold text-zinc-300">Connection established.</p>
                                            <p className="text-xs text-zinc-500 mt-1">Awaiting payload transmission.</p>
                                        </div>
                                    )}
                                </div>
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Composer */}
                            <div className="p-4 md:p-6 pt-2 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent shrink-0 relative z-20">
                                <form onSubmit={handleSendMessage} className="relative group bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-xl focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
                                    <textarea 
                                        value={inputText || ''} 
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={`Message ${selectedEntity.name}...`} 
                                        disabled={isSending}
                                        rows={1}
                                        className="w-full bg-transparent py-4 pl-4 md:pl-5 pr-14 md:pr-16 text-[13px] md:text-[14px] text-zinc-100 placeholder:text-zinc-600 outline-none resize-none custom-scrollbar disabled:opacity-50 min-h-[52px] max-h-[120px]"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={isSending || !inputText.trim()} 
                                        className="absolute right-1.5 md:right-2 bottom-1.5 md:bottom-2 w-9 h-9 md:w-10 md:h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:bg-zinc-900 active:scale-95 shadow-md shadow-orange-500/20"
                                    >
                                        {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} className="ml-0.5" />}
                                    </button>
                                </form>
                                {/* <div className="hidden sm:flex justify-between items-center mt-2 px-2">
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                                        <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">ENTER</span> to send
                                    </p>
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                                        <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">SHIFT + ENTER</span> for new line
                                    </p>
                                </div> */}
                            </div>
                        </>
                    ) : (
                        // NEW EMPTY DASHBOARD STATE
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 md:p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-[#050505] to-[#050505]">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#0a0a0a] border border-zinc-800/80 rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative p-4 md:p-5 backdrop-blur-sm">
                                <Image src="/companylogo/slack.png" alt="Slack" width={48} height={48} className="object-contain drop-shadow-lg" priority />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">Slack Command Center</h2>
                            <p className="text-[13px] text-zinc-500 max-w-xs md:max-w-sm leading-relaxed px-4">Select a channel, private group, or individual from the directory to establish a secure communication tunnel.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODALS --- */}
            <AnimatePresence>
                
                {/* 1. Create Channel Modal */}
                {activeModal === 'create_channel' && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-[24px] shadow-2xl flex flex-col relative z-10">
                            <div className="flex justify-between items-center p-6 border-b border-zinc-800/80 bg-[#050505]/50 rounded-t-[24px]">
                                <h2 className="text-xs font-bold text-zinc-400 tracking-widest uppercase">Deploy {formData.isPrivate ? 'Private Group' : 'Public Channel'}</h2>
                                <button onClick={() => setActiveModal(null)} className="text-zinc-500 hover:text-white transition-colors bg-zinc-900 p-1.5 rounded-full"><X size={14}/></button>
                            </div>
                            <form onSubmit={handleCreateChannel} className="p-6 pb-8 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Network Identifier</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">{formData.isPrivate ? <Lock size={16}/> : <Hash size={16}/>}</div>
                                        <input type="text" value={formData.channelName || ''} onChange={e => setFormData({...formData, channelName: e.target.value.toLowerCase().replace(/\s+/g, '-')})} placeholder="project-alpha" required className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-3.5 pl-11 pr-4 text-[13px] text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 outline-none shadow-inner transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Topic (Optional)</label>
                                    <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="State the purpose..." className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-3.5 px-4 text-[13px] text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 outline-none shadow-inner transition-all" />
                                </div>
                                <div className="pt-2">
                                    <button disabled={loadingMessages} className="w-full bg-orange-500 text-white py-3.5 rounded-xl text-[13px] font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-95">
                                        {loadingMessages ? 'Initializing...' : 'Deploy Now'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* 2. View User Profile Modal */}
                {activeModal === 'view_profile' && profileData && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="w-full max-w-sm bg-[#0a0a0a] border border-zinc-800 rounded-[32px] shadow-2xl flex flex-col relative z-10 overflow-hidden">
                            
                            {/* Abstract Header BG */}
                            <div className="h-28 bg-gradient-to-br from-zinc-800/30 to-[#0a0a0a] relative">
                                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-black/20 hover:bg-black/50 p-2 rounded-full backdrop-blur-md transition-colors"><X size={16}/></button>
                            </div>

                            <div className="px-8 pb-8 pt-0 flex flex-col items-center text-center -mt-14 relative z-10">
                                <div className="w-28 h-28 rounded-3xl bg-[#050505] p-2 shadow-2xl mb-4 border border-zinc-800 relative">
                                    {profileData.image ? (
                                        <img src={profileData.image} alt={profileData.name} className="w-full h-full rounded-2xl object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-orange-500 rounded-2xl flex items-center justify-center text-3xl font-bold text-white">
                                            {profileData.name?.charAt(0).toUpperCase() || <UserCircle size={40} />}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-[#050505] rounded-full"></div>
                                </div>
                                
                                <h2 className="text-xl font-bold text-white mb-1 tracking-tight">{profileData.name}</h2>
                                <p className="text-[12px] text-zinc-500 font-mono tracking-wide mb-6">{profileData.email || 'No email attached'}</p>

                                {/* Action Buttons */}
                                <div className="flex gap-3 w-full">
                                    {!profileData.is_self && (
                                        <button 
                                            onClick={() => { setActiveModal(null); selectTarget(profileData, 'user'); }} 
                                            className="flex-1 bg-orange-500 text-white py-3.5 rounded-xl text-[13px] font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-95"
                                        >
                                            <MessageSquare size={16} /> Direct Message
                                        </button>
                                    )}
                                    <a 
                                        href={`mailto:${profileData.email}`} 
                                        className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-300 py-3.5 rounded-xl text-[13px] font-bold hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <Mail size={16} /> {profileData.is_self ? 'Email Inbox' : 'Send Email'}
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

            </AnimatePresence>
        </div>
    );
}

// --- SUB-COMPONENTS ---
function SidebarFolder({ title, isOpen, onToggle, onAdd, children }) {
    return (
        <div className="mb-2">
            <div className="flex items-center justify-between px-2 mb-1 group">
                <button onClick={onToggle} className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-300 transition-colors outline-none py-1">
                    <ChevronRight size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                    {title}
                </button>
                {onAdd && (
                    <button onClick={onAdd} className="p-1 text-zinc-600 hover:text-white hover:bg-zinc-800 rounded-md transition-colors opacity-0 group-hover:opacity-100 md:flex hidden">
                        <Plus size={14} />
                    </button>
                )}
            </div>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="space-y-0.5 pt-1 border-l border-zinc-800/50 ml-3.5 pl-2.5 pb-2">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SidebarItem({ name, icon: Icon, imageUrl, isSelected, onClick, count }) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all outline-none group ${
                isSelected ? 'bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-inner' : 'border border-transparent hover:bg-zinc-900/80 text-zinc-400 hover:text-zinc-200'
            }`}
        >
            <div className="flex items-center gap-3 min-w-0">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="w-5 h-5 rounded-md shadow-sm object-cover" />
                ) : (
                    <Icon size={14} className={`shrink-0 ${isSelected ? 'text-orange-500' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                )}
                <span className={`text-[13px] font-medium truncate ${isSelected ? 'font-bold' : ''}`}>{name}</span>
            </div>
            {count > 0 && (
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${isSelected ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-[#050505] border-zinc-800 text-zinc-500'}`}>
                    {count}
                </span>
            )}
        </button>
    );
}