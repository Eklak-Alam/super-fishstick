'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Save, Shield, Key, AlertCircle, Camera, Check, ChevronRight } from 'lucide-react';
import api from '@/lib/axios';

export default function ProfileModal({ user, isOpen, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
        setMessage({ type: '', text: '' });
        setFormData({
            fullName: user?.full_name || '',
            email: user?.email || '',
        });
    }
  }, [isOpen, user]);

  // --- Form States ---
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // --- Handlers ---

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.put('/auth/me', formData);
      onUpdate(res.data.data); // Update Dashboard State
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (securityData.newPassword !== securityData.confirmPassword) {
        setMessage({ type: 'error', text: "New passwords don't match" });
        setLoading(false);
        return;
    }

    try {
      await api.put('/auth/password', {
        oldPassword: securityData.currentPassword,
        newPassword: securityData.newPassword
      });
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  // Trigger Forgot Password Email
  const handleForgotPassword = async () => {
    setLoading(true);
    // In a real app, this would call an API to send a reset email
    setTimeout(() => {
        setMessage({ type: 'success', text: `Reset link sent to ${user.email}` });
        setLoading(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[600px]"
        >
          
          {/* --- Sidebar (Navigation) --- */}
          <div className="w-full md:w-64 bg-[#050505] border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between">
            <div>
                <h2 className="text-lg font-bold text-white mb-6 px-2">Settings</h2>
                <nav className="space-y-1">
                    <SidebarTab 
                        active={activeTab === 'general'} 
                        onClick={() => setActiveTab('general')} 
                        icon={User} 
                        label="General" 
                    />
                    <SidebarTab 
                        active={activeTab === 'security'} 
                        onClick={() => setActiveTab('security')} 
                        icon={Shield} 
                        label="Security" 
                    />
                </nav>
            </div>
            
            {/* User Mini Badge */}
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                    {user?.full_name?.charAt(0)}
                </div>
                <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                </div>
            </div>
          </div>

          {/* --- Main Content Area --- */}
          <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] relative">
            
            {/* Header / Close */}
            <div className="absolute top-6 right-6 z-10">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-12">
                
                {/* --- Tab: General --- */}
                {activeTab === 'general' && (
                    <div className="max-w-lg mx-auto">
                        <h1 className="text-2xl font-bold text-white mb-2">Profile Details</h1>
                        <p className="text-gray-400 text-sm mb-8">Manage your personal information.</p>

                        {/* Avatar Section */}
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 p-1">
                                    <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
                                        <span className="text-4xl font-bold text-white">{user?.full_name?.charAt(0)}</span>
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera size={24} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-white font-medium">Profile Photo</h3>
                                <p className="text-xs text-gray-500 mt-1">Click to upload a new avatar.</p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                    <input 
                                        type="text" 
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-purple-500/50 outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-purple-500/50 outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button disabled={loading} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                    {loading ? 'Saving...' : <>Save Changes <Check size={16} /></>}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* --- Tab: Security --- */}
                {activeTab === 'security' && (
                    <div className="max-w-lg mx-auto">
                        <h1 className="text-2xl font-bold text-white mb-2">Login & Security</h1>
                        <p className="text-gray-400 text-sm mb-8">Manage your password and authentication.</p>

                        <form onSubmit={handleChangePassword} className="space-y-6">
                            
                            {/* Current Password Section */}
                            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl space-y-4">
                                <div className="flex items-center gap-2 text-red-400 mb-2">
                                    <Lock size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Verification Required</span>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-400">Current Password</label>
                                    <input 
                                        type="password" 
                                        placeholder="Enter your current password"
                                        value={securityData.currentPassword}
                                        onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                                        className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-red-500/50 outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button type="button" onClick={handleForgotPassword} className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                                        Forgot Password? <ChevronRight size={12} />
                                    </button>
                                </div>
                            </div>

                            <div className="h-px bg-white/5 w-full my-6" />

                            {/* New Password Section */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-400">New Password</label>
                                    <input 
                                        type="password" 
                                        value={securityData.newPassword}
                                        onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                                        className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500/50 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-400">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        value={securityData.confirmPassword}
                                        onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                                        className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500/50 outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button disabled={loading} className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                                    {loading ? 'Updating...' : <>Update Password <Key size={16} /></>}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Status Message Toast */}
                {message.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
                            message.type === 'success' 
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}
                    >
                        {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                        <span className="text-sm font-medium">{message.text}</span>
                    </motion.div>
                )}

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SidebarTab({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                active ? 'bg-white text-black font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
            <Icon size={18} className={active ? 'text-black' : 'text-gray-500'} />
            <span className="text-sm">{label}</span>
        </button>
    )
}