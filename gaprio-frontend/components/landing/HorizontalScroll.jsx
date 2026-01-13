'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, FileText, Calendar, CheckCircle, Zap, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const steps = [
  { 
    id: '01', 
    title: "The Trigger", 
    subtitle: "Signal Detected",
    desc: "A client sends a request in Slack. Gaprio understands intent, urgency, and the people who need to act.",
    icon: MessageSquare,
    color: "text-orange-500",
    gradient: "from-orange-500/20 to-orange-900/5",
    border: "border-orange-500/50"
  },
  { 
    id: '02', 
    title: "The Brain", 
    subtitle: "Context Retrieval",
    desc: "Gaprio searches your documents, knowledge base, and past work to retrieve the exact context required.",
    icon: FileText,
    color: "text-amber-500",
    gradient: "from-amber-500/20 to-amber-900/5",
    border: "border-amber-500/50"
  },
  { 
    id: '03', 
    title: "The Action", 
    subtitle: "Orchestration",
    desc: "Gaprio coordinates next steps across your tools, from drafting documents to creating tickets.",
    icon: Calendar,
    color: "text-red-500",
    gradient: "from-red-500/20 to-red-900/5",
    border: "border-red-500/50"
  },
  { 
    id: '04', 
    title: "The Result", 
    subtitle: "Execution",
    desc: "You receive a 'Ready for approval' notification. One click completes the process across connected systems.",
    icon: CheckCircle,
    color: "text-emerald-500",
    gradient: "from-emerald-500/20 to-emerald-900/5",
    border: "border-emerald-500/50"
  },
];

export default function WorkflowConsole() {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- THE LOGIC FIX ---
  useEffect(() => {
    // 1. Pause if user is hovering
    if (isHovered) return;

    // 2. Set the interval
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length); // 1->2->3->4->1 Loop
    }, 4000); // 4 Seconds per slide

    // 3. Cleanup: This resets the timer whenever 'activeStep' changes.
    // This ensures if you Click 'Step 3', the timer resets to 0, waits 4s, then goes to 'Step 4'.
    return () => clearInterval(timer);
  }, [isHovered, activeStep]); 

  if (!isMounted) return null;

  return (
    <section className="relative w-full py-20 bg-[#020202] overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* --- Header --- */}
        <div className="mb-16 md:flex items-end justify-between border-b border-white/5 pb-8">
           <div>
              <div className="flex items-center gap-2 mb-3">
                 <Zap size={14} className="text-orange-500" />
                 <span className="text-orange-500 font-mono text-xs uppercase tracking-widest">Workflow Engine</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                The <span className="text-orange-500">Invisible</span> Workflow.
              </h2>
           </div>
           <p className="hidden md:block text-neutral-500 max-w-md text-right text-sm leading-relaxed">
             Gaprio orchestrates tasks, context, and communication <br/> so you can focus on the work that matters.
           </p>
        </div>

        {/* --- The Console (Split View) --- */}
        <div 
            className="flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-0 md:border md:border-white/10 md:rounded-3xl md:bg-[#080808] md:overflow-hidden h-auto md:h-[500px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
           
           {/* LEFT SIDE: Navigation */}
           <div className="md:col-span-4 flex flex-col md:border-r border-white/10">
              {steps.map((step, index) => {
                 const isActive = activeStep === index;
                 return (
                    <div
                       key={step.id}
                       onClick={() => setActiveStep(index)} // Clicking here resets the timer automatically
                       role="button"
                       tabIndex={0}
                       suppressHydrationWarning={true}
                       className={clsx(
                          "group relative flex items-center gap-4 p-6 text-left transition-all duration-300 outline-none cursor-pointer select-none",
                          isActive ? "bg-white/5" : "hover:bg-white/[0.02]"
                       )}
                    >
                       {/* Active Indicator Line */}
                       <div className={clsx(
                          "absolute left-0 top-0 bottom-0 w-[3px] transition-colors duration-300",
                          isActive ? "bg-orange-500" : "bg-transparent"
                       )} />
                       
                       {/* Number */}
                       <span className={clsx(
                          "font-mono text-sm transition-colors duration-300",
                          isActive ? "text-orange-500 font-bold" : "text-neutral-600"
                       )}>
                          {step.id}
                       </span>

                       {/* Title */}
                       <div className="flex-1">
                          <h4 className={clsx(
                             "text-lg font-bold transition-colors duration-300",
                             isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"
                          )}>
                             {step.title}
                          </h4>
                          <p className="text-xs text-neutral-600 uppercase tracking-wider mt-0.5">
                             {step.subtitle}
                          </p>
                       </div>

                       {/* Arrow (Desktop Only) */}
                       <ChevronRight 
                          size={16} 
                          className={clsx(
                             "hidden md:block transition-all duration-300",
                             isActive ? "text-orange-500 translate-x-0" : "text-neutral-700 -translate-x-2 opacity-0 group-hover:opacity-100"
                          )} 
                       />
                    </div>
                 );
              })}
           </div>

           {/* RIGHT SIDE: The Monitor */}
           <div className="hidden md:col-span-8 md:flex relative items-center justify-center p-12 bg-[#050505]">
              
              {/* Background Glow */}
              <div className={clsx(
                 "absolute inset-0 bg-gradient-to-br opacity-20 transition-all duration-700",
                 steps[activeStep].gradient
              )} />

              <AnimatePresence mode="wait">
                 <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10 w-full max-w-lg"
                 >
                    {/* The Big Card */}
                    <div className={clsx(
                       "bg-[#0A0A0A] border rounded-2xl p-10 shadow-2xl relative overflow-hidden",
                       steps[activeStep].border
                    )}>
                       {/* Top Decorative Bar */}
                       <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                          <div className={clsx("p-3 rounded-lg bg-white/5", steps[activeStep].color)}>
                             {React.createElement(steps[activeStep].icon, { size: 32 })}
                          </div>
                          <span className="font-mono text-6xl font-bold text-white/5">
                             {steps[activeStep].id}
                          </span>
                       </div>

                       <h3 className="text-3xl font-bold text-white mb-4">
                          {steps[activeStep].subtitle}
                       </h3>
                       <p className="text-lg text-neutral-400 leading-relaxed">
                          {steps[activeStep].desc}
                       </p>
                    </div>
                 </motion.div>
              </AnimatePresence>
           </div>

           {/* MOBILE VIEW: Stacked Cards */}
           <div className="md:hidden flex flex-col gap-4 mt-4">
              {steps.map((step) => (
                 <div 
                    key={step.id} 
                    className={clsx(
                       "p-6 rounded-xl border bg-[#080808]",
                       "border-white/10" 
                    )}
                 >
                    <div className="flex items-center gap-4 mb-4">
                       <div className={clsx("p-2 rounded-lg bg-white/5", step.color)}>
                          {React.createElement(step.icon, { size: 20 })}
                       </div>
                       <span className="text-white font-bold">{step.title}</span>
                       <span className="ml-auto text-xs font-mono text-neutral-600">{step.id}</span>
                    </div>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                       {step.desc}
                    </p>
                 </div>
              ))}
           </div>

        </div>

      </div>
    </section>
  );
}