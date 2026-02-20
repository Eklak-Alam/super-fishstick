'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, Key, Check, AlertCircle, LogOut, Camera, Loader2, ArrowRight } from 'lucide-react';
import api from '@/lib/axios';

export default function ProfileModal({ user, isOpen, onClose, onUpdate }) {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const [formData, setFormData] = useState({ fullName: '', email: '' });
    const [securityData, setSecurityData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        if (isOpen && user) {
            setFormData({ fullName: user.full_name || '', email: user.email || '' });
            setNotification(null);
            setActiveTab('general');
        }
    }, [isOpen, user]);

    const showToast = (type, text) => {
        setNotification({ type, text });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/auth/me', formData);
            onUpdate(res.data.data);
            showToast('success', 'Identity configuration updated');
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Update failed');
        } finally { setLoading(false); }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (securityData.newPassword !== securityData.confirmPassword) {
            showToast('error', "Cryptographic keys do not match");
            setLoading(false);
            return;
        }
        try {
            await api.put('/auth/password', { oldPassword: securityData.currentPassword, newPassword: securityData.newPassword });
            showToast('success', 'Security key successfully rotated');
            setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Key rotation failed');
        } finally { setLoading(false); }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
                
                {/* --- BACKDROP BLUR --- */}
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* --- MAIN MODAL CONTAINER --- */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="w-full max-w-5xl bg-[#09090b] border border-zinc-800 rounded-3xl shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-[650px] overflow-hidden relative z-10"
                >
                    
                    {/* --- LEFT SIDEBAR (NAVIGATION) --- */}
                    <div className="w-full md:w-72 bg-[#050505] border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col shrink-0 relative overflow-hidden">
                        
                        {/* Abstract Glow Background */}
                        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-orange-500/10 to-transparent opacity-50 pointer-events-none" />

                        {/* User Avatar Section */}
                        <div className="p-8 pb-6 flex flex-col items-center text-center relative z-10">
                            <div className="relative group cursor-pointer mb-4">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 p-[2px] shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                                    <div className="w-full h-full bg-[#09090b] rounded-full flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white">{user?.full_name?.charAt(0)?.toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 bg-zinc-900 border border-zinc-700 text-zinc-300 p-1.5 rounded-full hover:bg-orange-500 hover:text-white transition-colors hover:border-orange-500">
                                    <Camera size={14} />
                                </div>
                            </div>
                            <h2 className="text-base font-semibold text-zinc-100 tracking-tight">{user?.full_name}</h2>
                            <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest mt-1 bg-orange-500/10 px-2 py-0.5 rounded-md">Root Admin</span>
                        </div>

                        {/* Navigation Tabs */}
                        <nav className="flex-1 px-4 space-y-1.5">
                            <SidebarTab active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={User} label="Identity Config" sub="Name & Email" />
                            <SidebarTab active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Shield} label="Access Control" sub="Passwords & Keys" />
                        </nav>
                        
                        {/* Footer Action */}
                        <div className="p-4 mt-auto">
                            <button className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all text-xs font-semibold uppercase tracking-wider group outline-none">
                                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Terminate Session
                            </button>
                        </div>
                    </div>

                    {/* --- RIGHT CONTENT AREA --- */}
                    <div className="flex-1 flex flex-col relative bg-[#09090b]">
                        
                        {/* Close Button */}
                        <button 
                            onClick={onClose} 
                            className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 relative" data-lenis-prevent="true">
                            <AnimatePresence mode="wait">
                                
                                {/* 1. GENERAL TAB */}
                                {activeTab === 'general' && (
                                    <motion.div 
                                        key="general" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                                        className="max-w-xl"
                                    >
                                        <Header title="Identity Configuration" sub="Manage your primary account details and public presence." />
                                        
                                        <form onSubmit={handleUpdateProfile} className="space-y-6 mt-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InputGroup label="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} icon={User} placeholder="Enter full name" />
                                                <InputGroup label="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} icon={Mail} type="email" placeholder="name@domain.com" />
                                            </div>
                                            
                                            <div className="pt-6 border-t border-zinc-800/50 flex justify-end">
                                                <button disabled={loading} className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50">
                                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                                    {loading ? 'Committing...' : 'Commit Changes'}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                {/* 2. SECURITY TAB */}
                                {activeTab === 'security' && (
                                    <motion.div 
                                        key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                                        className="max-w-xl"
                                    >
                                        <Header title="Access Control" sub="Update your cryptographic keys to secure your account." />
                                        
                                        <form onSubmit={handleChangePassword} className="space-y-6 mt-8">
                                            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-6">
                                                <div className="flex items-center gap-2 text-orange-500 mb-2">
                                                    <Key size={16} />
                                                    <span className="text-xs font-bold uppercase tracking-widest">Key Rotation</span>
                                                </div>

                                                <InputGroup label="Current Key" value={securityData.currentPassword} onChange={e => setSecurityData({...securityData, currentPassword: e.target.value})} type="password" icon={Key} placeholder="••••••••" />
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800/50">
                                                    <InputGroup label="New Key" value={securityData.newPassword} onChange={e => setSecurityData({...securityData, newPassword: e.target.value})} type="password" icon={Key} placeholder="••••••••" />
                                                    <InputGroup label="Verify New Key" value={securityData.confirmPassword} onChange={e => setSecurityData({...securityData, confirmPassword: e.target.value})} type="password" icon={Key} placeholder="••••••••" />
                                                </div>
                                            </div>

                                            <div className="pt-2 flex justify-between items-center">
                                                <button type="button" className="text-xs font-medium text-zinc-500 hover:text-white transition-colors">
                                                    Lost your key?
                                                </button>
                                                <button disabled={loading} className="group flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.2)] disabled:opacity-50">
                                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                                                    {loading ? 'Rotating...' : 'Rotate Security Key'}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* --- ELITE TOAST NOTIFICATION --- */}
                        <AnimatePresence>
                            {notification && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                    className={`absolute bottom-8 right-8 z-50 px-5 py-3.5 rounded-xl shadow-2xl border flex items-center gap-3 ${
                                        notification.type === 'success' 
                                            ? 'bg-[#09090b] border-green-500/30 text-zinc-100 shadow-[0_10px_40px_rgba(34,197,94,0.1)]' 
                                            : 'bg-[#09090b] border-red-500/30 text-zinc-100 shadow-[0_10px_40px_rgba(239,68,68,0.1)]'
                                    }`}
                                >
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${notification.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {notification.type === 'success' ? <Check size={16} strokeWidth={3} /> : <AlertCircle size={16} strokeWidth={3} />}
                                    </div>
                                    <span className="text-sm font-medium tracking-tight pr-2">{notification.text}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

// --- SUB-COMPONENTS ---

function SidebarTab({ active, onClick, icon: Icon, label, sub }) {
    return (
        <button 
            onClick={onClick} 
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 outline-none group
                ${active ? 'bg-zinc-900 border border-zinc-800' : 'hover:bg-zinc-900/50 border border-transparent'}
            `}
        >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-inner
                ${active ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-[#09090b] text-zinc-500 group-hover:text-zinc-300 border border-zinc-800'}
            `}>
                <Icon size={18} />
            </div>
            <div className="flex-1 text-left">
                <p className={`text-sm font-semibold transition-colors tracking-tight ${active ? 'text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{label}</p>
                <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{sub}</p>
            </div>
            {active && <ArrowRight size={14} className="text-orange-500 opacity-50" />}
        </button>
    );
}

function InputGroup({ label, value, onChange, icon: Icon, type = "text", placeholder }) {
    return (
        <div className="space-y-2 w-full">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest pl-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-zinc-600 group-focus-within:text-orange-500 transition-colors z-10">
                    <Icon size={18} />
                </div>
                <input 
                    type={type} 
                    value={value} 
                    onChange={onChange} 
                    placeholder={placeholder}
                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-[#0a0a0a] outline-none transition-all shadow-inner" 
                />
            </div>
        </div>
    );
}

function Header({ title, sub }) {
    return (
        <div className="mb-2">
            <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">{title}</h1>
            <p className="text-zinc-400 text-sm font-medium">{sub}</p>
        </div>
    );
}