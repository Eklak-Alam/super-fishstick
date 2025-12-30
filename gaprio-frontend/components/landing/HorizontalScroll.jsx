'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, FileText, Calendar, CheckCircle, ArrowRight, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- 1. Orange/Amber Themed Steps ---
const steps = [
  { 
    id: '01', 
    title: "The Trigger", 
    subtitle: "Signal Detected",
    desc: "A client sends a request in Slack. Gaprio understands intent, urgency, and the people who need to act.",
    icon: MessageSquare,
    color: "from-orange-600 to-amber-500",
    nodeLabel: "Listening for signals"
  },
  { 
    id: '02', 
    title: "The Brain", 
    subtitle: "Context Retrieval",
    desc: "Gaprio searches your documents, knowledge base, and past work to retrieve the exact context required for the task.",
    icon: FileText,
    color: "from-amber-500 to-yellow-500",
    nodeLabel: "Retrieving context"
  },
  { 
    id: '03', 
    title: "The Action", 
    subtitle: "Orchestration",
    desc: "Gaprio coordinates next steps across your tools, from drafting documents to scheduling meetings and creating tickets.",
    icon: Calendar,
    color: "from-red-600 to-orange-500",
    nodeLabel: "Orchestrating tasks"
  },
  { 
    id: '04', 
    title: "The Result", 
    subtitle: "Execution",
    desc: "You receive a single notification saying “Workflow ready for approval.” One click completes the process across every connected system.",
    icon: CheckCircle,
    color: "from-emerald-500 to-green-400",
    nodeLabel: "Execution complete"
  },
];


export default function HorizontalScroll() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const track = trackRef.current;
      
      // Calculate scroll distance
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true, 
        }
      });

      tl.to(track, {
        x: getScrollAmount,
        ease: "none",
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative bg-[#020202] overflow-hidden border-t border-white/5">
      
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:60px_60px] opacity-[0.04] pointer-events-none" />

      <div ref={trackRef} className="lg:pt-32 pt-32 pb-14 flex w-max relative z-10 items-center">
        
        {/* --- Intro Slide --- */}
        <div className="w-[100vw] md:w-[60vw] h-full flex flex-col justify-center px-6 md:px-32 border-r border-white/5 relative bg-[#020202]">
            
            {/* Horizontal Line Decoration */}
            <div className="absolute top-1/2 mt-10 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-orange-500/20" />
            
            <div className='pt-32'>
              <div className="flex items-center gap-2 mb-8">
                <span className="p-1.5 rounded-md bg-orange-500/10 border border-orange-300/20 text-orange-600"><Zap size={14} /></span>
                <span className="text-orange-400/80 font-mono tracking-widest text-[10px] md:text-xs uppercase">Workflow Engine</span>
            </div>

            <h2 className="text-4xl md:text-8xl font-bold text-white mb-8 leading-[1.0]">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300">Invisible</span> <br /> Workflow.
            </h2>
            
            <p className="text-zinc-400 max-w-lg text-lg leading-relaxed font-light">
                Gaprio works quietly between your apps, orchestrating tasks, context, and communication so your teams stay focused on real work.
            </p>
            </div>
        </div>

        {/* --- The Cards --- */}
        {steps.map((step, i) => (
            <div key={i} className="w-[100vw] md:w-[45vw]  h-full flex items-center justify-center border-r border-white/5 bg-[#020202] px-6 md:px-12 relative group">
                
                {/* Connecting Line (Only visible on desktop) */}
                <div className="hidden md:block absolute mt-10 top-1/2 left-0 w-full h-[2px] bg-white/5 z-0">
                    <div className={`h-full w-0 group-hover:w-full bg-gradient-to-r ${step.color} transition-all duration-1000 ease-out`} />
                </div>

                {/* Card Container */}
                <div className="w-full mt-10 max-w-lg aspect-[4/5] md:aspect-auto md:h-[500px] bg-[#080808] border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden hover:border-orange-500/30 hover:shadow-[0_0_50px_-20px_rgba(234,88,12,0.3)] z-10 transition-all duration-500 group-hover:-translate-y-2">
                    
                    {/* Inner Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
                    
                    <div className="relative z-10">
                        {/* Header: ID + Icon */}
                        <div className="flex justify-between items-start mb-12">
                            <span className="text-6xl font-bold text-white/5 font-mono tracking-tighter">{step.id}</span>
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}>
                                <step.icon className="text-white w-6 h-6" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className={`h-[2px] w-8 bg-gradient-to-r ${step.color}`} />
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{step.subtitle}</h4>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{step.title}</h3>
                            <p className="text-zinc-400 text-lg leading-relaxed">{step.desc}</p>
                        </div>
                    </div>

                    {/* Footer Status */}
                    <div className="
  flex items-center gap-2
  text-zinc-600 text-xs font-mono uppercase tracking-widest
  group-hover:text-orange-400/80 transition-colors
">
  <div
    className={`
      w-1.5 h-1.5 rounded-full
      bg-gradient-to-r ${step.color}
      animate-pulse
    `}
  />
  <span>{step.nodeLabel}</span>
</div>

                </div>
            </div>
        ))}

      </div>
    </section>
  );
}