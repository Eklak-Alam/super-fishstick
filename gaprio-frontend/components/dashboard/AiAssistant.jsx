'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, X, Play, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import Image from 'next/image';

export default function AiAssistant({ isOpen, onClose }) {
    
    // Local state for chat
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your Gaprio AI. Ask me to create tasks on Asana or send emails.' }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (isOpen && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // 1. Add User Message immediately
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // 2. Call Backend
            // Note: Ensure your axios baseURL handles '/api' correctly. 
            // If baseURL is http://localhost:5000/api, then use '/ai/chat'
            const res = await api.post('/ai/chat', { message: userMsg.content });
            const data = res.data;

            // 3. Process Response
            // The backend now returns { message: "...", plan: [...] }
            const aiResponseMsg = {
                role: 'assistant',
                content: data.message || "I processed your request.",
                actions: data.plan || [] // Attach actions if present
            };

            setMessages(prev => [...prev, aiResponseMsg]);

        } catch (err) {
            console.error("AI Chat Error:", err);
            let errorMsg = "Sorry, I can't connect to the AI brain right now.";
            
            // Helpful error if backend is 404 (route missing) or 500 (python down)
            if (err.response?.status === 404) errorMsg = "Error: AI Service not found (404). Check backend routes.";
            if (err.response?.status === 503) errorMsg = "The AI Brain is currently sleeping. Please start the Python agent.";

            setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (action, index) => {
        try {
            // Optimistic UI update (optional, could add loading state to specific button)
            
            // 1. We need the real DB ID. 
            // If the plan returned from chat has an 'id', use it. 
            // Otherwise, fetch pending actions to be safe.
            let actionId = action.id;

            if (!actionId) {
                // Fallback: Fetch pending actions if ID wasn't in the immediate response
                const pendingRes = await api.get('/ai/actions');
                const pendingActions = pendingRes.data.actions || [];
                if (pendingActions.length > 0) {
                    actionId = pendingActions[0].id; // Simple FIFO logic
                }
            }

            if (!actionId) {
                alert("Action ID not found. It may have already been executed.");
                return;
            }

            // 2. Execute
            await api.post('/ai/approve', { actionId });
            
            alert("✅ Action Executed Successfully!");
            
            // Optional: Remove the action card from UI or mark as done
            // setMessages(...) logic could go here to update the specific message

        } catch (err) {
            console.error(err);
            alert("❌ Execution Failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <>
            {/* Floating Toggle Button (Visible only on mobile when closed) */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { /* This button is usually controlled by parent/Sidebar */ }}
                    className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-40 bg-gradient-to-br from-indigo-600 to-violet-600 border border-white/20 md:hidden" 
                >
                    <Bot className="text-white w-7 h-7" />
                </motion.button>
            )}

            {/* Chat Window / Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 w-full md:w-[400px] h-full bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col z-[100]"
                    >
                        {/* --- HEADER --- */}
                        <div className="p-4 border-b border-white/10 bg-[#121212] flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                {/* Logo Container */}
                                <div className="relative w-8 h-8 shrink-0 bg-white/5 rounded-lg border border-white/5 p-1">
                                    <Image
                                        src="/logo1.png" 
                                        alt="Gaprio AI" 
                                        width={32} 
                                        height={32} 
                                        className="object-contain w-full h-full" 
                                        priority
                                    />
                                </div>

                                {/* Text & Status */}
                                <div>
                                    <h3 className="text-sm font-bold text-white leading-tight">Gaprio Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]" />
                                        <span className="text-[10px] text-zinc-400 font-medium">Online</span>
                                    </div>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button 
                                onClick={onClose} 
                                className="p-2 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* --- MESSAGES AREA --- */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-[#0a0a0a]">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    
                                    {/* Message Bubble */}
                                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-none' 
                                        : 'bg-[#1a1a1d] text-zinc-200 rounded-bl-none border border-white/10'
                                    }`}>
                                        {msg.content}
                                    </div>

                                    {/* Action Plan Cards */}
                                    {msg.actions && msg.actions.length > 0 && (
                                        <div className="mt-3 w-[90%] space-y-3">
                                            {msg.actions.map((act, j) => (
                                                <div key={j} className="bg-[#151515] border border-indigo-500/30 p-3 rounded-xl overflow-hidden relative group shadow-lg">
                                                    {/* Glow Effect */}
                                                    <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
                                                    
                                                    {/* Tool Header */}
                                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{act.tool}</span>
                                                            </div>
                                                            <span className="text-[10px] text-zinc-500 pl-4">{act.provider}</span>
                                                        </div>
                                                    </div>

                                                    {/* Parameters Preview */}
                                                    <div className="bg-black/40 rounded-lg p-2.5 mb-3 relative z-10 border border-white/5">
                                                        <pre className="text-[10px] text-zinc-400 whitespace-pre-wrap font-mono overflow-x-auto custom-scrollbar">
                                                            {JSON.stringify(act.parameters, null, 2).replace(/{|}|"/g, '')}
                                                        </pre>
                                                    </div>

                                                    {/* Approve Button */}
                                                    <button 
                                                        onClick={() => handleApprove(act, j)}
                                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all relative z-10 active:scale-95 shadow-md"
                                                    >
                                                        <Play size={12} fill="currentColor" /> Approve & Execute
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {/* Loading Indicator */}
                            {loading && (
                                <div className="flex items-center gap-2 text-xs text-zinc-500 pl-2">
                                    <Loader2 size={14} className="animate-spin text-indigo-500" />
                                    <span>Gaprio is thinking...</span>
                                </div>
                            )}
                        </div>

                        {/* --- INPUT AREA --- */}
                        <form onSubmit={handleSend} className="p-4 bg-[#121212] border-t border-white/10 shrink-0">
                            <div className="relative flex items-center">
                                <input 
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Type a command..."
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-zinc-600 shadow-inner"
                                />
                                <button 
                                    type="submit" 
                                    disabled={loading || !input.trim()}
                                    className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}