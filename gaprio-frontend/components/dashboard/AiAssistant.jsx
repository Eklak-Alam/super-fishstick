'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Play, Loader2, Terminal, AlertCircle, ArrowUp, Zap, Database, Mail, RotateCcw } from 'lucide-react';
import api from '@/lib/axios';
import Image from 'next/image';

export default function AiWorkspace() {
    // --- State ---
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]); // Starts empty for the Dashboard view
    const [loading, setLoading] = useState(false);
    
    // --- Scroll Handling ---
    const scrollRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // --- Actions ---
    const handleSend = async (textOrEvent) => {
        if (textOrEvent?.preventDefault) textOrEvent.preventDefault();
        
        const textToSubmit = typeof textOrEvent === 'string' ? textOrEvent : input;
        if (!textToSubmit.trim()) return;

        const userMsg = { role: 'user', content: textToSubmit };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/ai/chat', { message: userMsg.content });
            const data = res.data;

            const aiResponseMsg = {
                role: 'assistant',
                content: data.message || "I have processed your request telemetry.",
                actions: data.plan || []
            };

            setMessages(prev => [...prev, aiResponseMsg]);
        } catch (err) {
            console.error("AI Chat Error:", err);
            let errorMsg = "System failure: Cannot establish connection to AI Engine.";
            
            if (err.response?.status === 404) errorMsg = "Error 404: AI Logic Router not found. Verify backend endpoints.";
            if (err.response?.status === 503) errorMsg = "AI Engine is in sleep mode. Please boot the Python agent.";
            if (err.message) errorMsg = `Error: ${err.message}`;

            setMessages(prev => [...prev, { role: 'assistant', content: errorMsg, isError: true }]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (action, index) => {
        try {
            let actionId = action.id;

            if (!actionId) {
                const pendingRes = await api.get('/ai/actions');
                const pendingActions = pendingRes.data.actions || [];
                if (pendingActions.length > 0) {
                    actionId = pendingActions[0].id;
                }
            }

            if (!actionId) {
                setMessages(prev => [...prev, { role: 'assistant', content: "Execution error: Action ID missing.", isError: true }]);
                return;
            }

            await api.post('/ai/approve', { actionId });
            setMessages(prev => [...prev, { role: 'assistant', content: `✅ Payload deployed successfully via ${action.provider}.` }]);

        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: `❌ Execution Failed: ${err.response?.data?.message || err.message}`, isError: true }]);
        }
    };

    const handleRefresh = () => {
        setMessages([]);
        setInput('');
    };

    return (
        <div className="w-full h-full flex flex-col bg-[#050505] relative overflow-hidden font-sans selection:bg-orange-500/30">
            
            {/* --- DASHBOARD BACKGROUND --- */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
                {messages.length === 0 && (
                    <div className="w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-orange-600/5 blur-[100px] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000" />
                )}
            </div>

            {/* --- DASHBOARD HEADER --- */}
            <div className="relative z-20 flex items-center justify-between px-5 py-3.5 bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.04]">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.05] p-1.5 shadow-sm shrink-0">
                        <Image src="/logo1.png" alt="Gaprio" width={24} height={24} className="object-contain" priority style={{ width: "auto", height: "auto" }} />
                    </div>
                    <div>
                        <h2 className="text-[14px] md:text-[15px] font-semibold text-zinc-100 tracking-tight leading-none">Gaprio Intelligence Workspace</h2>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" /> Engine Online
                        </div>
                    </div>
                </div>
                
                {/* Refresh / Reset Button */}
                <button 
                    onClick={handleRefresh}
                    disabled={messages.length === 0}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.08] hover:text-white transition-colors text-zinc-400 text-[12px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RotateCcw size={14} /> <span className="hidden sm:inline">Reset Context</span>
                </button>
            </div>

            {/* --- SCROLL AREA --- */}
            <div 
                ref={scrollRef} 
                className="relative z-10 flex-1 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-contain pb-28 px-4 md:px-8"
                data-lenis-prevent="true"
            >
                {/* --- EMPTY STATE / DASHBOARD WELCOME (Centered in viewport) --- */}
                {messages.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                        className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto min-h-[60vh]"
                    >
                        <div className="w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/[0.08] shadow-xl flex items-center justify-center p-2.5 relative">
                            <Image src="/logo1.png" alt="Gaprio" width={32} height={32} className="object-contain" priority style={{ width: "auto", height: "auto" }} />
                            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_rgba(249,115,22,0.1)] pointer-events-none" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight text-center mb-2">
                            How can I assist you today?
                        </h1>
                        <p className="text-[13px] text-zinc-500 text-center max-w-sm mb-8 leading-relaxed">
                            Command the Gaprio Engine to execute workflows, manage databases, or draft communications.
                        </p>

                        {/* Suggestion Cards Grid - Tighter and smaller for one frame */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                            {[
                                { 
                                    icon: <Zap size={16} className="text-orange-500" />, 
                                    title: "Deploy Asana Task", 
                                    desc: "Create a new high-priority ticket",
                                    prompt: "Create a new high-priority Asana ticket for the backend API optimization task."
                                },
                                { 
                                    icon: <Mail size={16} className="text-blue-500" />, 
                                    title: "Draft Email", 
                                    desc: "Write a team update via Workspace",
                                    prompt: "Draft an email to the core team summarizing this week's development progress."
                                },
                                { 
                                    icon: <Database size={16} className="text-emerald-500" />, 
                                    title: "Query Database", 
                                    desc: "Fetch active user metrics",
                                    prompt: "Query the database to fetch the latest active user metrics for the last 30 days."
                                },
                                { 
                                    icon: <Terminal size={16} className="text-zinc-400" />, 
                                    title: "System Check", 
                                    desc: "Run a diagnostic on integrations",
                                    prompt: "Run a complete diagnostic check on our current third-party API integrations."
                                }
                            ].map((suggestion, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleSend(suggestion.prompt)}
                                    className="flex flex-col items-start text-left p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-orange-500/40 transition-all duration-200 group active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-2.5 mb-1.5">
                                        <div className="bg-[#0a0a0a] p-1.5 rounded-md border border-white/[0.05] shadow-sm">
                                            {suggestion.icon}
                                        </div>
                                        <span className="text-[13px] font-semibold text-zinc-200 group-hover:text-white transition-colors">{suggestion.title}</span>
                                    </div>
                                    <span className="text-[11.5px] text-zinc-500 group-hover:text-zinc-400 transition-colors leading-tight">{suggestion.desc}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    /* --- CHAT MESSAGES --- */
                    <div className="max-w-3xl mx-auto flex flex-col gap-6 pt-6 w-full">
                        <AnimatePresence initial={false}>
                            {messages.map((msg, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                                    key={i} 
                                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {/* AI MESSAGE LAYOUT */}
                                    {msg.role === 'assistant' && (
                                        <div className="flex gap-3 md:gap-4 max-w-full md:max-w-[85%]">
                                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-zinc-900 border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5 p-1.5 shadow-sm">
                                                <Image src="/logo1.png" alt="Gaprio" width={20} height={20} className="object-contain" style={{ width: "auto", height: "auto" }} />
                                            </div>
                                            
                                            <div className="flex flex-col gap-3 min-w-0 w-full pt-0.5 md:pt-1">
                                                <div className={`text-[14.5px] md:text-[15px] leading-relaxed break-words ${
                                                    msg.isError 
                                                    ? 'bg-red-500/10 border border-red-500/20 text-red-300 p-3 md:p-4 rounded-xl'
                                                    : 'text-zinc-300'
                                                }`}>
                                                    {msg.isError ? (
                                                        <div className="flex items-start gap-3">
                                                            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                                                            <span>{msg.content}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="prose prose-invert max-w-none">
                                                            {msg.content}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Execution Cards */}
                                                {msg.actions && msg.actions.length > 0 && (
                                                    <div className="flex flex-col gap-3 w-full mt-1">
                                                        {msg.actions.map((act, j) => (
                                                            <div key={j} className="group relative bg-[#0a0a0a] border border-white/[0.08] rounded-xl overflow-hidden shadow-lg border-l-2 border-l-orange-500">
                                                                <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.04]">
                                                                    <div className="flex items-center gap-2">
                                                                        <Terminal size={14} className="text-zinc-400" />
                                                                        <span className="text-[12px] font-semibold text-zinc-200 tracking-wide">{act.tool}</span>
                                                                    </div>
                                                                    <div className="px-2 py-0.5 rounded bg-zinc-800 text-[9px] font-bold text-zinc-400 uppercase tracking-widest border border-zinc-700">
                                                                        {act.provider}
                                                                    </div>
                                                                </div>
                                                                <div className="p-3.5 bg-zinc-950 overflow-x-auto custom-scrollbar">
                                                                    <pre className="text-[12px] text-zinc-400 font-mono leading-relaxed">
                                                                        {JSON.stringify(act.parameters, null, 2).replace(/{|}|"/g, '')}
                                                                    </pre>
                                                                </div>
                                                                <div className="p-2.5 bg-white/[0.02] border-t border-white/[0.04] flex justify-end">
                                                                    <button 
                                                                        onClick={() => handleApprove(act, j)}
                                                                        className="px-4 py-2 bg-white text-black hover:bg-orange-500 hover:text-white rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-[0.97]"
                                                                    >
                                                                        <Play size={12} fill="currentColor" /> Execute Action
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* USER MESSAGE LAYOUT */}
                                    {msg.role === 'user' && (
                                        <div className="max-w-[85%] md:max-w-[70%] bg-zinc-800 text-zinc-100 px-4 py-3 md:px-5 md:py-3.5 rounded-2xl rounded-tr-sm text-[14px] md:text-[15px] leading-relaxed shadow-sm font-medium">
                                            {msg.content}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        
                        {/* Loader */}
                        {loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 md:gap-4 max-w-[90%] mt-1">
                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-zinc-900 border border-white/[0.08] flex items-center justify-center shrink-0 p-1.5 shadow-sm">
                                    <Image src="/logo1.png" alt="Gaprio" width={20} height={20} className="object-contain opacity-50 animate-pulse" style={{ width: "auto", height: "auto" }} />
                                </div>
                                <div className="text-[13px] md:text-[14px] font-medium text-zinc-500 pt-1 md:pt-1.5 flex items-center gap-2">
                                    Processing <Loader2 size={12} className="animate-spin text-orange-500" />
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} className="h-2 w-full shrink-0" />
                    </div>
                )}
            </div>

            {/* --- DASHBOARD COMMAND INPUT --- */}
            <div className="absolute bottom-0 left-0 w-full pt-8 pb-5 px-4 md:px-8 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent z-30 pointer-events-none">
                <div className="max-w-3xl mx-auto pointer-events-auto">
                    <form 
                        onSubmit={handleSend} 
                        className="relative flex items-center bg-[#0f0f0f] border border-white/[0.1] rounded-2xl focus-within:border-orange-500/50 focus-within:bg-[#141414] focus-within:shadow-[0_0_30px_rgba(249,115,22,0.05)] transition-all duration-300 shadow-xl overflow-hidden"
                    >
                        <input 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Send a command to Gaprio..."
                            className="w-full bg-transparent pl-5 pr-14 py-3.5 md:py-4 text-[14.5px] text-zinc-100 outline-none placeholder:text-zinc-600 font-medium"
                            autoComplete="off"
                        />
                        <button 
                            type="submit" 
                            disabled={loading || !input.trim()}
                            className="absolute right-2 md:right-2.5 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-zinc-100 text-zinc-900 rounded-xl hover:bg-orange-500 hover:text-white disabled:opacity-0 disabled:scale-75 transition-all duration-300 shadow-sm"
                        >
                            <ArrowUp size={18} className="stroke-[2.5px]" />
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
}