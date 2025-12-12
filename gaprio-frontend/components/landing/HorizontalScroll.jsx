'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, FileText, Calendar, CheckCircle, ArrowRight, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { 
    id: '01', 
    title: "The Trigger", 
    subtitle: "Signal Detected",
    desc: "Gaprio intercepts a client request in Slack. It parses intent, urgency, and required stakeholders instantly.",
    icon: MessageSquare,
    color: "from-purple-500 to-indigo-600"
  },
  { 
    id: '02', 
    title: "The Brain", 
    subtitle: "Context Retrieval",
    desc: "It queries vector databases for similar past contracts and drafts a highly specific response in Google Docs.",
    icon: FileText,
    color: "from-blue-500 to-cyan-600"
  },
  { 
    id: '03', 
    title: "The Action", 
    subtitle: "Orchestration",
    desc: "Gaprio books a meeting in Outlook, invites the client, and creates a linked Jira ticket for Engineering.",
    icon: Calendar,
    color: "from-orange-500 to-red-600"
  },
  { 
    id: '04', 
    title: "The Result", 
    subtitle: "Execution",
    desc: "Zero friction. You receive a single notification: 'Workflow ready for approval'. One click, done.",
    icon: CheckCircle,
    color: "from-green-500 to-emerald-600"
  },
];

export default function HorizontalScroll() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);
  const zoomTextRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const track = trackRef.current;
      
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true, 
          onUpdate: (self) => {
            if (progressBarRef.current) {
                gsap.set(progressBarRef.current, { width: `${self.progress * 100}%` });
            }
          }
        }
      });

      tl.to(track, {
        x: getScrollAmount,
        ease: "none",
      });

      // Zoom Portal
      gsap.fromTo(zoomTextRef.current, 
        { scale: 0.5, opacity: 0 },
        { 
          scale: 100, 
          opacity: 1, 
          ease: "power2.in",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "95% bottom",
            end: "bottom bottom",
            scrub: true,
          }
        }
      );

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative bg-[#020202] overflow-hidden border-t border-white/5">
      
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:50px_50px] md:bg-[size:100px_100px] opacity-[0.05] pointer-events-none" />

      <div ref={trackRef} className="lg:py-28 pt-32 pb-24 flex w-max relative z-10 items-center">
        
        {/* Intro Slide */}
        <div className="w-[100vw] md:w-[60vw] h-full flex flex-col justify-center px-6 md:px-32 border-r border-white/5 relative bg-[#020202]">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-white/20" />
            {/* <div className="flex items-center gap-2 mb-6">
                <span className="p-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400"><Zap size={14} /></span>
                <span className="text-purple-400 font-mono tracking-widest text-[10px] md:text-xs uppercase">Live Architecture v2.0</span>
            </div> */}
            <h2 className="text-4xl md:text-8xl font-bold text-white mb-6 md:mb-8 leading-[1.1] md:leading-[0.9]">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Invisible</span> <br /> Workflow.
            </h2>
            <p className="text-gray-400 max-w-sm md:max-w-lg text-base md:text-lg leading-relaxed">
                Gaprio doesn't just chat. It moves data between silos so you don't have to. <span className="text-white block mt-2 font-medium">Scroll to trace the execution.</span>
            </p>
        </div>

        {/* Cards */}
        {steps.map((step, i) => (
            <div key={i} className="w-[100vw] md:w-[45vw] h-full flex items-center justify-center border-r border-white/5 bg-[#020202] px-4 md:px-12 relative group">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-white/5 z-0">
                    <div className={`h-full w-0 group-hover:w-full bg-gradient-to-r ${step.color} transition-all duration-1000 ease-out`} />
                </div>

                {/* Forced max-width to prevent overflow */}
                <div className="w-full max-w-[90vw] md:max-w-lg aspect-[4/5] md:aspect-[4/5] max-h-[60vh] md:max-h-[550px] bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10 flex flex-col justify-between relative overflow-hidden hover:border-white/20 hover:shadow-2xl z-10 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8 md:mb-12">
                            <span className="text-5xl md:text-7xl font-bold text-white/5 font-mono tracking-tighter">{step.id}</span>
                            <div className={`p-3 md:p-4 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}>
                                <step.icon className="text-white w-5 h-5 md:w-6 md:h-6" />
                            </div>
                        </div>
                        <div className="space-y-3 md:space-y-4">
                            <div className="flex items-center gap-3">
                                <div className={`h-[1px] w-6 md:w-8 bg-gradient-to-r ${step.color}`} />
                                <h4 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{step.subtitle}</h4>
                            </div>
                            <h3 className="text-2xl md:text-4xl font-bold text-white">{step.title}</h3>
                            <p className="text-gray-400 text-sm md:text-lg leading-relaxed border-l-2 border-white/10 pl-4 md:pl-6">{step.desc}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/20 text-[10px] md:text-xs font-mono uppercase tracking-widest group-hover:text-white/50 transition-colors">
                        <span>Processing Node</span>
                        <ArrowRight size={12} />
                    </div>
                </div>
            </div>
        ))}
      </div>
    </section>
  );
}