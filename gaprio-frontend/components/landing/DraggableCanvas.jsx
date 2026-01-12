'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Terminal,
  Cpu, 
  Wifi,
  Disc,
  Activity,
  Zap
} from 'lucide-react';

// --- CONFIGURATION ---

// Using your specific image paths
const INTEGRATIONS = [
  { id: 'slack', label: 'Slack', sub: 'Team Messaging', img: '/companylogo/slack.png', status: 'active' },
  { id: 'miro', label: 'Miro', sub: 'Visual Collab', img: '/companylogo/miro.png', status: 'active' },
  { id: 'asana', label: 'Asana', sub: 'Task Mgmt', img: '/companylogo/asana.png', status: 'active' },
  { id: 'jira', label: 'Jira', sub: 'Issue Tracking', img: '/companylogo/jira.png', status: 'warning' }, 
  { id: 'google', label: 'Google', sub: 'Workspace', img: '/companylogo/google.webp', status: 'active' },
  { id: 'ms365', label: 'Microsoft', sub: 'Office 365', img: '/companylogo/microsoft.webp', status: 'active' },
  { id: 'zoho', label: 'Zoho', sub: 'Business Suite', img: '/companylogo/zoho.png', status: 'active' },
  { id: 'clickup', label: 'ClickUp', sub: 'Productivity', img: '/companylogo/clickup.png', status: 'active' },
];

const LOGS = {
  scanning: [
    '> Handshaking with Google Workspace API...',
    '> [OK] Slack Webhook Verified',
    '> [OK] Miro Board Sync: 12ms',
    '> Waiting for triggers...'
  ],
  alert: [
    '> [WARN] Jira Webhook Timeout (504)',
    '> [ALERT] High CPU Load on Worker Node',
    '> [CRIT] Memory Spillover detected',
    '> Initiating failover sequence...'
  ],
  analyzing: [
    '> Rerouting traffic via US-EAST-2...',
    '> Spinning up read-replicas...',
    '> Applying rate-limiting rules...',
    '> Purging cache keys...'
  ],
  resolved: [
    '> [SUCCESS] Latency normalized (12ms)',
    '> [INFO] Traffic pattern stabilized',
    '> [SECURE] Systems operational',
    '> ACTIVE: 99.9% Uptime'
  ]
};

export default function AgenticNexus() {
  const [status, setStatus] = useState('scanning');
  const [isClient, setIsClient] = useState(false);

  // --- LOGIC LOOP ---
  useEffect(() => {
    setIsClient(true);
    let mounted = true;
    const cycle = async () => {
      if (!mounted) return;
      setStatus('scanning');
      await new Promise(r => setTimeout(r, 4000));
      if (!mounted) return;
      setStatus('alert');
      await new Promise(r => setTimeout(r, 4000));
      if (!mounted) return;
      setStatus('analyzing');
      await new Promise(r => setTimeout(r, 4000));
      if (!mounted) return;
      setStatus('resolved');
      await new Promise(r => setTimeout(r, 4000));
      if (mounted) cycle();
    };
    cycle();
    return () => { mounted = false; };
  }, []);

  // --- THEME COLORS ---
  const getTheme = () => {
    switch (status) {
      case 'alert': return { text: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-500/10', glow: 'shadow-red-500/20', stroke: '#ef4444' };
      case 'analyzing': return { text: 'text-amber-400', border: 'border-amber-400/50', bg: 'bg-amber-400/10', glow: 'shadow-amber-400/20', stroke: '#fbbf24' };
      case 'resolved': return { text: 'text-emerald-400', border: 'border-emerald-400/50', bg: 'bg-emerald-400/10', glow: 'shadow-emerald-400/20', stroke: '#34d399' };
      default: return { text: 'text-orange-500', border: 'border-orange-500/50', bg: 'bg-orange-500/10', glow: 'shadow-orange-500/20', stroke: '#f97316' };
    }
  };
  const theme = getTheme();

  return (
    <div className="min-h-screen bg-[#020202] text-white p-2 md:p-6 font-sans flex items-center justify-center">
      
      {/* 1. MAIN BENTO GRID */}
      <div className="w-full max-w-[1400px] h-full md:h-[85vh] grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 md:grid-rows-4 gap-3 md:gap-4">

        {/* --- A. STATUS CARD (Top Left) --- */}
        <motion.div 
          className={`col-span-1 md:col-span-1 md:row-span-1 rounded-2xl border bg-[#080808] p-5 flex flex-col justify-between relative overflow-hidden ${theme.border}`}
        >
           <div className={`absolute top-0 right-0 p-2 opacity-50 ${theme.text}`}><ShieldCheck size={20} /></div>
           <div>
              <h2 className="text-xs font-mono uppercase text-zinc-500 tracking-widest mb-1">System Status</h2>
              <div className={`text-2xl font-black uppercase tracking-tight ${theme.text}`}>{status}</div>
           </div>
           <div className="flex items-center gap-2 mt-2">
              <span className={`relative flex h-2 w-2`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.bg.replace('/10', '')}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.bg.replace('/10', '')}`}></span>
              </span>
              <span className="text-xs font-mono text-zinc-400">{isClient ? new Date().toLocaleTimeString() : '--:--:--'}</span>
           </div>
        </motion.div>


        {/* --- B. METRICS CARD (Bottom Left - REDESIGNED) --- */}
        <div className="col-span-1 md:col-span-1 md:row-span-3 rounded-2xl border border-white/5 bg-[#080808] p-5 flex flex-col gap-6 relative overflow-hidden">
            {/* Background Grid for Tech Feel */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

            {/* 1. CIRCULAR CPU GAUGE */}
            <div className="relative z-10">
               <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase"><Cpu size={14}/> CPU Load</div>
                  <span className={`text-lg font-bold ${status === 'alert' ? 'text-red-500' : 'text-white'}`}>{status === 'alert' ? '98%' : '42%'}</span>
               </div>
               <div className="h-32 w-full flex items-center justify-center relative">
                   {/* Background Circle */}
                   <svg viewBox="0 0 100 100" className="w-full h-full rotate-90">
                       <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="8" strokeDasharray="200" strokeDashoffset="50" strokeLinecap="round" />
                       {/* Animated Value Circle */}
                       <motion.circle 
                          cx="50" cy="50" r="45" fill="none" 
                          stroke={theme.stroke} 
                          strokeWidth="8" 
                          strokeLinecap="round"
                          strokeDasharray="280"
                          initial={{ strokeDashoffset: 280 }}
                          animate={{ strokeDashoffset: status === 'alert' ? 10 : 160 }}
                          transition={{ duration: 1, ease: "easeInOut" }}
                       />
                   </svg>
                   <Activity className={`absolute ${theme.text}`} size={24} />
               </div>
            </div>

            {/* 2. MEMORY BARS */}
            <div className="relative z-10">
               <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase"><Disc size={14}/> Memory</div>
                  <span className="text-lg font-bold text-zinc-200">64%</span>
               </div>
               <div className="flex gap-1 h-3">
                   {[...Array(10)].map((_, i) => (
                       <motion.div 
                          key={i}
                          className={`flex-1 rounded-sm ${i < 6 ? 'bg-blue-500' : 'bg-zinc-800'}`}
                          animate={{ opacity: i < 6 ? [0.5, 1, 0.5] : 1 }}
                          transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                       />
                   ))}
               </div>
            </div>

            {/* 3. LATENCY EKG GRAPH */}
            <div className="relative z-10">
               <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase"><Wifi size={14}/> Network</div>
                  <span className={`text-lg font-bold ${status === 'alert' ? 'text-red-500' : 'text-emerald-400'}`}>
                     {status === 'alert' ? '540ms' : '12ms'}
                  </span>
               </div>
               <div className="h-20 w-full bg-black/50 border border-white/5 rounded-md relative overflow-hidden flex items-end">
                   {/* EKG Line */}
                   <svg viewBox="0 0 300 100" className="w-full h-full absolute inset-0" preserveAspectRatio="none">
                       <motion.path 
                          d={status === 'alert' 
                             ? "M0,90 L20,90 L30,20 L40,90 L60,90 L70,10 L80,90 L100,90 L110,30 L120,90 L300,90" 
                             : "M0,80 L50,80 L55,60 L60,80 L120,80 L125,65 L130,80 L300,80"}
                          fill="none"
                          stroke={theme.stroke}
                          strokeWidth="2"
                          vectorEffect="non-scaling-stroke"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1, x: [-300, 0] }} // Moving graph effect
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                       />
                   </svg>
                   {/* Grid Lines */}
                   <div className="absolute inset-0 border-t border-white/5 top-1/2"></div>
                   <div className="absolute inset-0 border-r border-white/5 left-1/2"></div>
               </div>
            </div>
        </div>


        {/* --- C. CENTER VIEWPORT (The "Working" Core) --- */}
        <motion.div 
          className="col-span-1 md:col-span-3 lg:col-span-3 md:row-span-3 rounded-2xl border border-white/10 bg-black relative overflow-hidden flex items-center justify-center"
        >
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
            
            {/* The Central Engine */}
            <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
                
                {/* 1. Pulsing Outer Rings */}
                <motion.div 
                   animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                   transition={{ duration: 4, repeat: Infinity }}
                   className={`absolute inset-0 rounded-full border border-dashed ${theme.border}`}
                />
                <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                   className="absolute inset-8 rounded-full border border-white/5 border-t-white/20"
                />

                {/* 2. Data Particles moving INWARD */}
                <div className="absolute inset-0">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                        <motion.div
                            key={i}
                            className={`absolute top-1/2 left-1/2 w-1 h-1 rounded-full ${theme.bg.replace('/10','')} shadow-[0_0_10px_currentColor]`}
                            initial={{ x: 0, y: 0, opacity: 0 }}
                            animate={{ 
                                x: [Math.cos(deg * Math.PI / 180) * 150, 0],
                                y: [Math.sin(deg * Math.PI / 180) * 150, 0],
                                opacity: [0, 1, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        />
                    ))}
                </div>

                {/* 3. THE CENTER IMAGE (Your Logo) */}
                <motion.div
                    animate={{ scale: status === 'alert' ? [1, 0.95, 1] : [1, 1.02, 1] }}
                    transition={{ duration: status === 'alert' ? 0.5 : 2, repeat: Infinity }}
                    className={`relative z-20 w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#050505] border flex items-center justify-center shadow-2xl ${theme.border} ${theme.glow}`}
                >
                    {/* --- YOUR LOGO HERE --- */}
                    <img 
                        src="/logo1.png" 
                        alt="Nexus Core" 
                        className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                        onError={(e) => { e.target.style.display = 'none'; }} // Fallback if image fails
                    />

                    {/* Scanning Line over Logo */}
                    <motion.div 
                        className={`absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent w-full h-full rounded-full`}
                        animate={{ top: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                </motion.div>

            </div>

            {/* Viewport Overlay Text */}
            <div className="absolute bottom-4 left-4 flex gap-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                <span>Core: <span className="text-white">Online</span></span>
                <span>Thread: <span className="text-white">Multi</span></span>
                <span>Sec: <span className="text-white">TLS_1.3</span></span>
            </div>
        </motion.div>


        {/* --- D. RIGHT SIDEBAR: APPS (Using Real Images) --- */}
        <div className="col-span-1 md:col-span-4 lg:col-span-1 md:row-span-4 rounded-2xl border border-white/10 bg-[#080808] flex flex-col">
           <div className="p-4 border-b border-white/5 flex items-center justify-between">
               <span className="text-xs font-mono uppercase text-zinc-500">Integrations</span>
               <div className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">99.9%</div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
              {INTEGRATIONS.map((app) => {
                  const isIssue = status === 'alert' && app.id === 'jira';
                  return (
                      <div key={app.id} className={`group p-3 rounded-lg border transition-all duration-300 flex items-center gap-3 ${isIssue ? 'bg-red-500/10 border-red-500/50' : 'bg-white/5 border-transparent hover:border-zinc-700'}`}>
                          {/* Image Container */}
                          <div className={`p-1.5 rounded-md bg-white w-8 h-8 flex items-center justify-center overflow-hidden`}>
                              <img src={app.img} alt={app.label} className="w-full h-full object-contain" />
                          </div>
                          
                          <div className="flex-1">
                              <div className={`text-xs font-semibold ${isIssue ? 'text-red-200' : 'text-zinc-300'}`}>{app.label}</div>
                              <div className="text-[10px] text-zinc-600">{app.sub}</div>
                          </div>
                          
                          {/* Status Dot */}
                          <div className={`w-1.5 h-1.5 rounded-full ${isIssue ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                      </div>
                  );
              })}
           </div>
        </div>


        {/* --- E. BOTTOM: TERMINAL (Span across bottom) --- */}
        <div className="col-span-1 md:col-span-4 lg:col-span-4 md:row-span-1 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md p-4 flex flex-col relative overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 mb-2 opacity-60">
                <Terminal size={12} className="text-zinc-400"/>
                <span className="text-[10px] font-mono uppercase text-zinc-500">Event_Log_Stream</span>
            </div>
            
            {/* Logs Area */}
            <div className="flex-1 font-mono text-xs overflow-hidden flex flex-col justify-end">
                <AnimatePresence mode='popLayout'>
                    {LOGS[status].map((log, i) => (
                        <motion.div 
                            key={`${status}-${i}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-2 mb-1"
                        >
                             <span className="text-zinc-600 shrink-0">{isClient ? new Date().toLocaleTimeString() : '00:00:00'}</span>
                             <span className={`${log.includes('WARN') || log.includes('CRIT') || log.includes('ALERT') ? 'text-red-400' : log.includes('SUCCESS') ? 'text-emerald-400' : 'text-zinc-400'}`}>
                                 {log}
                             </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>

      </div>
    </div>
  );
}