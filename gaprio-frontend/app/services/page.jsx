'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { MessageSquare, Calendar, Zap, FileText, ArrowRight, CheckCircle, Mail, Database, Box } from 'lucide-react';

// Raw inputs you can drag
const rawInputs = [
  { id: '1', type: 'Email', label: 'Client Request', icon: Mail, color: 'bg-red-500' },
  { id: '2', type: 'Chat', label: 'Slack Thread', icon: MessageSquare, color: 'bg-purple-500' },
  { id: '3', type: 'Meeting', label: 'Zoom Recording', icon: Calendar, color: 'bg-blue-500' },
];

export default function ServicesPage() {
  const [processedItems, setProcessedItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const reactorRef = useRef(null);

  // When a card is dropped on the reactor
  const handleDrop = (item) => {
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
        setIsProcessing(false);
        const newItem = { 
            id: Date.now(), 
            source: item.label, 
            result: getResult(item.type),
            icon: CheckCircle 
        };
        setProcessedItems(prev => [newItem, ...prev]);
    }, 1500);
  };

  const getResult = (type) => {
      if (type === 'Email') return 'Drafted Proposal';
      if (type === 'Chat') return 'Created Jira Ticket';
      if (type === 'Meeting') return 'Generated Summary';
      return 'Task Completed';
  };

  return (
    <main className="bg-[#020202] min-h-screen text-white overflow-hidden">
      
      <section className="min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-4">
        
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Zap size={14} className="text-yellow-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-white">Interactive Demo</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">The Workflow Reactor.</h1>
            <p className="text-gray-400">Drag raw data into the core to see Gaprio generate value.</p>
        </div>

        {/* --- The Game Area --- */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center h-[600px]">
            
            {/* 1. Raw Inputs (Draggable Source) */}
            <div className="h-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 z-10">Raw Inputs</h3>
                
                {rawInputs.map((item) => (
                    <DraggableCard key={item.id} item={item} onDrop={() => handleDrop(item)} />
                ))}
                
                <p className="mt-auto text-center text-xs text-gray-600">Drag these into the center &rarr;</p>
            </div>

            {/* 2. The Reactor (Drop Zone) */}
            <div ref={reactorRef} className="h-full flex items-center justify-center relative">
                {/* Connecting Lines */}
                <div className="absolute top-1/2 left-0 w-8 h-1 bg-gradient-to-r from-gray-800 to-transparent" />
                <div className="absolute top-1/2 right-0 w-8 h-1 bg-gradient-to-l from-gray-800 to-transparent" />

                {/* The Core */}
                <motion.div 
                    animate={isProcessing ? { scale: [1, 1.1, 1], rotate: 360 } : { rotate: 0 }}
                    transition={isProcessing ? { duration: 1, repeat: Infinity } : { duration: 0 }}
                    className={`w-48 h-48 rounded-full border-4 ${isProcessing ? 'border-purple-500 shadow-[0_0_80px_rgba(168,85,247,0.6)]' : 'border-white/10'} flex items-center justify-center relative bg-black z-20 transition-all duration-300`}
                >
                    <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_10s_linear_infinite]" />
                    <Zap size={48} className={`transition-colors ${isProcessing ? 'text-white' : 'text-gray-700'}`} />
                </motion.div>

                {/* Processing Text */}
                <AnimatePresence>
                    {isProcessing && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0 }}
                            className="absolute bottom-20 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-mono"
                        >
                            PROCESSING...
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 3. Output Feed (Results) */}
            <div className="h-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 z-10">Processed Actions</h3>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                    <AnimatePresence>
                        {processedItems.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3"
                            >
                                <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                    <item.icon size={16} />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">{item.result}</div>
                                    <div className="text-xs text-gray-500">Source: {item.source}</div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {processedItems.length === 0 && (
                        <div className="h-full flex items-center justify-center text-gray-700 text-sm italic">
                            Waiting for input...
                        </div>
                    )}
                </div>
            </div>

        </div>
      </section>

    </main>
  );
}

// Draggable Card Component with Auto-Reset
function DraggableCard({ item, onDrop }) {
    return (
        <motion.div
            drag
            dragSnapToOrigin={true} // Returns to start if dropped invalidly
            onDragEnd={(e, info) => {
                // Simple logic: if dragged far enough right (approx 200px), trigger drop
                if (info.offset.x > 150) {
                    onDrop();
                }
            }}
            whileHover={{ scale: 1.05, cursor: 'grab' }}
            whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 50 }}
            className={`p-4 rounded-xl ${item.color} bg-opacity-20 border border-white/10 flex items-center gap-4 relative z-10 backdrop-blur-md`}
        >
            <div className={`p-2 rounded-lg ${item.color} text-white`}>
                <item.icon size={20} />
            </div>
            <span className="font-medium text-white">{item.label}</span>
        </motion.div>
    )
}   