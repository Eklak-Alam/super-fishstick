'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, X, Play, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import Image from 'next/image';

export default function AiAssistant({ isOpen, onClose }) {
    
    // We keep local state for inputs/messages, but visibility is controlled by parent
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your Gaprio AI. Ask me to create tasks on Asana or send emails.' }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom of chat when new message arrives or chat opens
    useEffect(() => {
        if (isOpen && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add User Message
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Call Node Backend -> Calls Python Agent
            const res = await api.post('/ai/chat', { message: userMsg.content });
            const data = res.data;

            let aiContent = data.message || "Processed.";
            
            // If the AI returned a plan (actions to approve)
            if (data.plan && data.plan.length > 0) {
                aiContent = `I've prepared ${data.plan.length} action(s) for you. Please review and approve them below.`;
            }

            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: aiContent,
                actions: data.plan // Attach the plan to the message
            }]);

        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I can't connect to the AI brain right now." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (action, index) => {
        try {
            // Fetch pending actions to get the real ID
            const pendingRes = await api.get('/ai/actions');
            const pendingActions = pendingRes.data.actions || [];
            
            if (pendingActions.length === 0) {
                alert("Action not found or already executed.");
                return;
            }

            // Simple logic: grab the most recent one. 
            // In a real app, you might match by content or return IDs in the plan.
            const actionToApprove = pendingActions[0]; 

            await api.post('/ai/approve', { actionId: actionToApprove.id });
            alert("✅ Action Executed Successfully!");
            
        } catch (err) {
            alert("❌ Execution Failed: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <>
            {/* We kept the floating button in case you want to toggle it from here too,
               but currently, the Sidebar controls it.
               If you want ONLY sidebar control, remove this motion.button block.
            */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { /* You'd need a setOpen prop if you want this button to work independently */ }}
                    className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-40 bg-gradient-to-br from-indigo-600 to-violet-600 border border-white/20 md:hidden" 
                    // ^ Visible only on mobile if Sidebar is closed
                >
                    <Bot className="text-white w-7 h-7" />
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="fixed top-0 right-0 w-[400px] h-full bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col z-[100]"
                    >
                        {/* Header */}
<div className="p-4 border-b border-white/10 bg-[#121212] flex justify-between items-center">
    <div className="flex items-center gap-3">
        
        {/* Logo Container (Fixed size to prevent layout shift) */}
        <div className="relative w-8 h-8 shrink-0">
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

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar bg-[#0a0a0a]">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    
                                    {/* Message Bubble */}
                                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                        ? 'bg-purple-600 text-white rounded-br-none' 
                                        : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-white/5'
                                    }`}>
                                        {msg.content}
                                    </div>

                                    {/* Action Plan Cards */}
                                    {msg.actions && msg.actions.length > 0 && (
                                        <div className="mt-3 w-[90%] space-y-2">
                                            {msg.actions.map((act, j) => (
                                                <div key={j} className="bg-[#1a1a1d] border border-purple-500/30 p-3 rounded-xl overflow-hidden relative group">
                                                    <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors" />
                                                    
                                                    {/* Tool Header */}
                                                    <div className="flex justify-between items-start mb-2 relative z-10">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{act.tool}</span>
                                                            <span className="text-[10px] text-zinc-500">{act.provider}</span>
                                                        </div>
                                                    </div>

                                                    {/* Parameters Preview */}
                                                    <div className="bg-black/40 rounded-lg p-2 mb-3 relative z-10">
                                                        <pre className="text-[10px] text-zinc-400 whitespace-pre-wrap font-mono">
                                                            {JSON.stringify(act.parameters, null, 2).replace(/{|}|"/g, '')}
                                                        </pre>
                                                    </div>

                                                    {/* Approve Button */}
                                                    <button 
                                                        onClick={() => handleApprove(act, j)}
                                                        className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all relative z-10 active:scale-95"
                                                    >
                                                        <Play size={12} fill="currentColor" /> Approve & Execute
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {loading && (
                                <div className="flex items-center gap-2 text-xs text-zinc-500 pl-2">
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Thinking...</span>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 bg-[#121212] border-t border-white/5">
                            <div className="relative flex items-center">
                                <input 
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Type a command..."
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-zinc-600"
                                />
                                <button 
                                    type="submit" 
                                    disabled={loading || !input.trim()}
                                    className="absolute right-2 p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
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