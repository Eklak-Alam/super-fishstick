'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, FileText, Calendar, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { id: '01', title: "The Trigger", subtitle: "Context Detection", desc: "A client asks for a proposal in Slack. Gaprio instantly recognizes the intent.", icon: MessageSquare, color: "bg-purple-500" },
  { id: '02', title: "The Brain", subtitle: "Strategic Drafting", desc: "Gaprio drafts a proposal in Docs based on your last 3 successful contracts.", icon: FileText, color: "bg-blue-500" },
  { id: '03', title: "The Action", subtitle: "Cross-Platform Sync", desc: "It schedules a review meeting in Outlook and creates a task in Asana.", icon: Calendar, color: "bg-orange-500" },
  { id: '04', title: "The Result", subtitle: "Zero Friction", desc: "You just click 'Approve'. No app switching. The workflow is orchestrated.", icon: CheckCircle, color: "bg-green-500" },
];

export default function HorizontalScroll() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const zoomTextRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const track = trackRef.current;
      const trackWidth = track.scrollWidth;
      const windowWidth = window.innerWidth;
      
      // Calculate how much to move: Total width - 1 screen width
      const xMove = -(trackWidth - windowWidth);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${trackWidth}`, // Correct length
          anticipatePin: 1,
        }
      });

      // 1. Scroll Horizontal
      tl.to(track, {
        x: xMove,
        ease: "none",
        duration: 4 // Takes up 80% of the scroll timeline
      });

      // 2. Zoom Portal Effect (Happens at the end)
      tl.to(zoomTextRef.current, {
        scale: 150, // Massive zoom "through" the text
        opacity: 0, // Vanish slowly
        ease: "power2.in",
        duration: 1, // Last 20% of scroll
      }, ">-0.5"); // Overlap slightly with scroll end

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative bg-[#020202] overflow-hidden">
      {/* Container must be h-screen for pinning */}
      <div ref={trackRef} className="h-screen flex w-max relative z-10 items-center">
        
        {/* Intro Slide */}
        <div className="w-[80vw] md:w-[50vw] h-full flex flex-col justify-center px-10 md:px-20 border-r border-white/5 pt-20">
            <span className="text-purple-400 font-mono mb-4 tracking-widest text-xs uppercase">Workflow Engine v2</span>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              From Chaos <br/> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Flow.</span>
            </h2>
            <p className="text-gray-400 max-w-lg text-base">Scroll right to see the automation.</p>
        </div>

        {/* Cards */}
        {steps.map((step, i) => (
            <div key={i} className="w-[80vw] md:w-[35vw] h-full flex items-center justify-center border-r border-white/5 bg-[#020202] px-8 pt-20">
                <div className="w-full aspect-[4/5] max-h-[500px] bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-white/20 transition-colors shadow-2xl">
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-4xl font-bold text-white/10 font-mono">{step.id}</span>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <step.icon className="text-white w-5 h-5" />
                            </div>
                        </div>
                        <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">{step.subtitle}</h4>
                        <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
                        <div className={`h-full ${step.color} w-full`} />
                    </div>
                </div>
            </div>
        ))}

        {/* End Portal */}
        <div className="w-[100vw] h-full flex items-center justify-center bg-black relative z-20">
             <h2 ref={zoomTextRef} className="text-[15vw] font-black text-white leading-none text-center origin-center">
                READY<br/>TO<br/>FLOW
             </h2>
        </div>

      </div>
    </section>
  );
}