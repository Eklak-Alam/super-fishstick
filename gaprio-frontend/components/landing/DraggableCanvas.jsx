'use client';
import { motion, useMotionValue } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { MessageSquare, CheckSquare, Mail, Video, FileText, FileSpreadsheet, Database, Cpu } from 'lucide-react';

const tools = [
  { id: 'slack', label: 'Slack', icon: MessageSquare, x: -300, y: -200, color: 'bg-[#4A154B]' },
  { id: 'asana', label: 'Asana', icon: CheckSquare, x: 0, y: -250, color: 'bg-[#F06A6A]' },
  { id: 'jira', label: 'Jira', icon: Database, x: 300, y: -200, color: 'bg-[#0052CC]' },
  { id: 'gmail', label: 'Gmail', icon: Mail, x: -350, y: 0, color: 'bg-[#EA4335]' },
  { id: 'word', label: 'Word', icon: FileText, x: 350, y: 0, color: 'bg-[#2B579A]' },
  { id: 'excel', label: 'Excel', icon: FileSpreadsheet, x: 250, y: 200, color: 'bg-[#217346]' },
  { id: 'meet', label: 'Meet', icon: Video, x: -250, y: 200, color: 'bg-[#00AC47]' },
];

export default function DraggableCanvas() {
  const containerRef = useRef(null);

  return (
    <section className="relative min-h-screen w-full bg-[#020202] flex flex-col items-center justify-center py-20 overflow-hidden">
      
      <div className="text-center mb-16 z-10 pointer-events-none">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Infinite Canvas</h2>
        <p className="text-gray-400">Drag to re-organize your stack.</p>
      </div>

      {/* No Border Container */}
      <div ref={containerRef} className="relative w-full h-[800px] flex items-center justify-center">
        
        {/* Background Grid (Subtle) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />

        {/* Central Gaprio Node */}
        <div className="absolute z-20 w-32 h-32 bg-white rounded-3xl flex flex-col items-center justify-center shadow-[0_0_120px_rgba(255,255,255,0.2)]">
           <Cpu className="w-10 h-10 text-black mb-2" />
           <span className="font-bold text-black text-sm uppercase tracking-wider">Gaprio</span>
        </div>

        {/* Draggable Nodes */}
        {tools.map((tool) => (
            <DraggableNode 
                key={tool.id} 
                tool={tool} 
                containerRef={containerRef} 
            />
        ))}
        
      </div>
    </section>
  );
}

function DraggableNode({ tool, containerRef }) {
    const x = useMotionValue(tool.x);
    const y = useMotionValue(tool.y);
    const [points, setPoints] = useState({ x: tool.x, y: tool.y });

    useEffect(() => {
        const unsubX = x.on("change", (latest) => setPoints(p => ({ ...p, x: latest })));
        const unsubY = y.on("change", (latest) => setPoints(p => ({ ...p, y: latest })));
        return () => { unsubX(); unsubY(); };
    }, [x, y]);

    return (
        <>
            <svg className="absolute top-1/2 left-1/2 overflow-visible pointer-events-none" style={{ zIndex: 0 }}>
                <line 
                    x1={0} y1={0} 
                    x2={points.x} y2={points.y} 
                    stroke="rgba(255,255,255,0.15)" 
                    strokeWidth="2" 
                    strokeDasharray="6,6"
                />
            </svg>

            <motion.div
                drag
                dragConstraints={containerRef}
                dragElastic={0.2}
                dragMomentum={false}
                style={{ x, y }}
                whileHover={{ scale: 1.1, cursor: 'grab' }}
                whileDrag={{ scale: 1.15, cursor: 'grabbing', zIndex: 50 }}
                className={`absolute w-20 h-20 ${tool.color} rounded-2xl flex flex-col items-center justify-center shadow-2xl z-10 border border-white/20`}
            >
                <tool.icon className="text-white w-8 h-8" />
            </motion.div>
        </>
    );
}