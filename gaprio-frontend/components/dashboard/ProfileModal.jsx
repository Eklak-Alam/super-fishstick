'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, User, Mail, Shield, Key, Camera, Check, 
    ChevronRight, AlertCircle, LogOut, Smartphone 
} from 'lucide-react';
import api from '@/lib/axios';
import { IconBase } from 'react-icons';

export default function ProfileModal({ user, isOpen, onClose, onUpdate }) {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    // --- Form States ---
    const [formData, setFormData] = useState({ fullName: '', email: '' });
    const [securityData, setSecurityData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    // Initialize Data
    useEffect(() => {
        if (isOpen && user) {
            setFormData({ fullName: user.full_name || '', email: user.email || '' });
            setNotification(null);
        }
    }, [isOpen, user]);

    // --- Helpers ---
    const showToast = (type, text) => {
        setNotification({ type, text });
        setTimeout(() => setNotification(null), 3000);
    };

    // --- Actions ---
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/auth/me', formData);
            onUpdate(res.data.data);
            showToast('success', 'Profile updated successfully');
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Update failed');
        } finally { setLoading(false); }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (securityData.newPassword !== securityData.confirmPassword) {
            showToast('error', "New passwords don't match");
            setLoading(false);
            return;
        }
        try {
            await api.put('/auth/password', { 
                oldPassword: securityData.currentPassword, 
                newPassword: securityData.newPassword 
            });
            showToast('success', 'Password changed successfully');
            setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Failed to change password');
        } finally { setLoading(false); }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                
                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-[650px] overflow-hidden relative"
                >
                    
                    {/* --- LEFT SIDEBAR --- */}
                    <div className="w-full md:w-72 bg-[#050505] border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col shrink-0 relative overflow-hidden">
                        
                        {/* Background Decor */}
                        <div className="absolute top-0 left-0 w-full h-40 bg-orange-500/5 blur-[50px] pointer-events-none" />

                        {/* User Badge */}
                        <div className="flex flex-col items-center text-center mb-8 relative z-10">
                            <div className="relative group cursor-pointer">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 p-[2px] shadow-lg shadow-orange-500/20">
                                    <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                                        <span className="text-2xl font-bold text-white">{user?.full_name?.charAt(0)}</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 bg-white text-black p-1.5 rounded-full border-2 border-[#0a0a0a] shadow-sm">
                                    <Camera size={12} />
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-white mt-3 truncate w-full">{user?.full_name}</h2>
                            <p className="text-xs text-zinc-500 font-mono">Free Tier</p>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-1 flex-1">
                            <SidebarTab 
                                active={activeTab === 'general'} 
                                onClick={() => setActiveTab('general')} 
                                icon={User} 
                                label="General Info" 
                                description="Name & Email" 
                            />
                            <SidebarTab 
                                active={activeTab === 'security'} 
                                onClick={() => setActiveTab('security')} 
                                icon={Shield} 
                                label="Login & Security" 
                                description="Password & 2FA" 
                            />
                        </nav>

                        {/* Bottom Actions */}
                        <div className="mt-6 pt-6 border-t border-white/5">
                            <button className="flex items-center gap-3 w-full p-2 text-zinc-500 hover:text-red-400 transition-colors text-sm font-medium">
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* --- RIGHT CONTENT --- */}
                    <div className="flex-1 flex flex-col bg-[#0a0a0a] relative min-h-0">
                        
                        {/* Close Button */}
                        <button 
                            onClick={onClose} 
                            className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all border border-white/5 hover:rotate-90"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 relative">
                            <AnimatePresence mode="wait">
                                
                                {/* 1. GENERAL TAB */}
                                {activeTab === 'general' && (
                                    <motion.div 
                                        key="general"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="max-w-xl mx-auto space-y-8"
                                    >
                                        <Header title="General Information" sub="Update your personal details here." />
                                        
                                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InputGroup 
                                                    label="Full Name" 
                                                    value={formData.fullName} 
                                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                                    icon={User} 
                                                />
                                                <InputGroup 
                                                    label="Email Address" 
                                                    value={formData.email} 
                                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                                    icon={Mail} 
                                                    type="email"
                                                />
                                            </div>
                                            
                                            {/* Action Bar */}
                                            <div className="pt-4 flex justify-end">
                                                <button 
                                                    disabled={loading} 
                                                    className="btn-primary-orange px-8 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/20"
                                                >
                                                    {loading ? 'Saving...' : <>Save Changes <Check size={18}/></>}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                {/* 2. SECURITY TAB */}
                                {activeTab === 'security' && (
                                    <motion.div 
                                        key="security"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="max-w-xl mx-auto space-y-8"
                                    >
                                        <Header title="Login & Security" sub="Manage your password and account protection." />

                                        <form onSubmit={handleChangePassword} className="space-y-6">
                                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-6">
                                                <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
                                                    <Key size={14} /> Password Update
                                                </div>
                                                
                                                <InputGroup 
                                                    label="Current Password" 
                                                    value={securityData.currentPassword} 
                                                    onChange={e => setSecurityData({...securityData, currentPassword: e.target.value})}
                                                    type="password"
                                                    placeholder="••••••••"
                                                />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <InputGroup 
                                                        label="New Password" 
                                                        value={securityData.newPassword} 
                                                        onChange={e => setSecurityData({...securityData, newPassword: e.target.value})}
                                                        type="password"
                                                        placeholder="••••••••"
                                                    />
                                                    <InputGroup 
                                                        label="Confirm New Password" 
                                                        value={securityData.confirmPassword} 
                                                        onChange={e => setSecurityData({...securityData, confirmPassword: e.target.value})}
                                                        type="password"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-2 flex justify-end gap-4">
                                                <button type="button" className="text-zinc-500 hover:text-white text-sm font-medium transition-colors">
                                                    Forgot Password?
                                                </button>
                                                <button disabled={loading} className="btn-primary-orange px-8 py-3 rounded-xl shadow-lg shadow-orange-500/20">
                                                    {loading ? 'Updating...' : 'Update Password'}
                                                </button>
                                            </div>
                                        </form>

                                        {/* Two Factor Teaser */}
                                        <div className="p-6 bg-gradient-to-r from-blue-900/10 to-transparent border border-blue-500/20 rounded-2xl flex items-center justify-between opacity-75">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                                                    <Smartphone size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-white">Two-Factor Authentication</h4>
                                                    <p className="text-xs text-zinc-400">Add an extra layer of security.</p>
                                                </div>
                                            </div>
                                            <button className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg font-bold" disabled>
                                                Coming Soon
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>

                        {/* Toast Notification Area */}
                        <AnimatePresence>
                            {notification && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0, y: 20 }}
                                    className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl flex items-center gap-3 border shadow-2xl backdrop-blur-xl ${
                                        notification.type === 'success' 
                                            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }`}
                                >
                                    {notification.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                                    <span className="text-sm font-bold tracking-wide">{notification.text}</span>
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

function SidebarTab({ active, onClick, icon: Icon, label, description }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group ${
                active 
                ? 'bg-white/10 border border-white/5 shadow-inner' 
                : 'hover:bg-white/5 border border-transparent'
            }`}
        >
            <div className={`p-2.5 rounded-lg transition-colors ${active ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white/5 text-zinc-500 group-hover:text-white'}`}>
                <IconBase size={18} />
            </div>
            <div className="text-left">
                <p className={`text-sm font-bold transition-colors ${active ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>{label}</p>
                <p className="text-[10px] text-zinc-600 font-medium">{description}</p>
            </div>
            {active && <ChevronRight size={14} className="ml-auto text-orange-500" />}
        </button>
    );
}

function InputGroup({ label, value, onChange, icon: Icon, type = "text", placeholder }) {
    return (
        <div className="space-y-1.5 w-full">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider ml-1">{label}</label>
            <div className="relative group">
                <IconBase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input 
                    type={type} 
                    value={value} 
                    onChange={onChange} 
                    placeholder={placeholder}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-zinc-700 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all" 
                />
            </div>
        </div>
    );
}

function Header({ title, sub }) {
    return (
        <div className="border-b border-white/5 pb-6">
            <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
            <p className="text-zinc-400 text-sm">{sub}</p>
        </div>
    );
}