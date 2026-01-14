'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Database, 
  Workflow, 
  CheckCircle2, 
  Zap, 
  FileText, 
  Bot,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

// --- DATA ---
const steps = [
  { 
    id: '01', 
    title: "The Trigger", 
    tagline: "Signal Detected",
    desc: "Gaprio constantly monitors your connected channels. In this example, a client sends a critical request in a dedicated Slack channel.",
    detail: "Gaprio analyzes intent, sentiment, and urgency instantly. It identifies that 'Legal' and 'Sales' need to be involved based on the keyword 'contract'.",
    icon: MessageSquare,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    visual: "chat" 
  },
  { 
    id: '02', 
    title: "The Context", 
    tagline: "Deep Retrieval",
    desc: "Before taking action, the AI builds a memory graph. It searches your Google Drive, Jira history, and past emails.",
    detail: "Found: 3 relevant PDFs, 1 previous email thread with this client, and the 'Master Service Agreement' template from the legal folder.",
    icon: Database,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    visual: "scan"
  },
  { 
    id: '03', 
    title: "The Action", 
    tagline: "Orchestration",
    desc: "Gaprio formulates a plan. It doesn't just ping you; it starts doing the work.",
    detail: "Drafting 'Amendment v2.docx', creating a Jira ticket for the legal team, and preparing a summary email for the Account Executive.",
    icon: Workflow,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    visual: "terminal"
  },
  { 
    id: '04', 
    title: "The Result", 
    tagline: "Execution",
    desc: "You receive a single 'Ready for Approval' notification. The manual work is already done.",
    detail: "One click approves the document, sends the email, and updates the CRM. Total time saved: 45 minutes.",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    visual: "success"
  },
];

// --- VISUAL SUB-COMPONENTS ---

// 1. Chat Visual
const ChatVisual = () => (
  <div className="flex flex-col gap-3 w-full max-w-sm mx-auto pt-4">
    <motion.div 
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
      className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-3 self-start max-w-[90%]"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
        <span className="text-[10px] text-neutral-400 font-mono">Client • Slack</span>
      </div>
      <p className="text-xs text-neutral-200">We need the updated contract for the Q4 project by EOD today.</p>
    </motion.div>
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
      className="flex items-center gap-2 self-center mt-2"
    >
        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
        <span className="text-orange-500 text-[10px] font-mono uppercase tracking-widest">Signal Detected</span>
    </motion.div>
  </div>
);

// 2. Scan Visual
const ScanVisual = () => (
  <div className="w-full max-w-sm mx-auto pt-2 space-y-2">
    {[
      { name: "MSA_Template_v2.pdf", type: "Drive", found: true },
      { name: "Client_Email_Thread", type: "Gmail", found: true },
      { name: "Q4_Scope_Jira", type: "Jira", found: true },
    ].map((file, i) => (
      <motion.div 
        key={i}
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: file.found ? 1 : 0.3, x: 0 }} 
        transition={{ delay: i * 0.15 }}
        className={clsx(
          "flex items-center justify-between p-2.5 rounded border text-xs font-mono",
          file.found ? "bg-blue-500/10 border-blue-500/30 text-blue-200" : "bg-white/5 border-white/5 text-neutral-600"
        )}
      >
        <div className="flex items-center gap-2">
           <FileText size={12} />
           <span>{file.name}</span>
        </div>
        <span className="text-[10px] opacity-70">{file.type}</span>
      </motion.div>
    ))}
  </div>
);

// 3. Terminal Visual
const TerminalVisual = () => (
  <div className="w-full h-full bg-black/40 rounded-lg border border-white/5 p-4 font-mono text-[10px] md:text-xs text-neutral-400 overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-transparent to-transparent animate-shimmer" />
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5">
       <p className="text-purple-400">root@gaprio:~$ init_sequence --legal</p>
       <p className="pl-2"> Parsing requirements...</p>
       <p className="pl-2"> Generating doc: <span className="text-white">Amendment_v2.docx</span></p>
       <p className="pl-2"> Connecting to Jira API...</p>
       <p className="pl-2"> Draft email generated.</p>
       <motion.div 
          animate={{ opacity: [0, 1, 0] }} 
          transition={{ repeat: Infinity, duration: 0.8 }} 
          className="w-2 h-4 bg-purple-500 ml-2 mt-1 inline-block align-middle"
       />
    </motion.div>
  </div>
);

// 4. Success Visual
const SuccessVisual = () => (
  <div className="flex flex-col items-center justify-center h-full pt-4">
    <motion.div 
      initial={{ scale: 0, rotate: -45 }} 
      animate={{ scale: 1, rotate: 0 }} 
      transition={{ type: "spring", bounce: 0.5 }}
      className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mb-4 text-emerald-500 shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)]"
    >
       <CheckCircle2 size={32} />
    </motion.div>
    <motion.h4 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="text-white font-bold text-lg"
    >
      Ready for Approval
    </motion.h4>
    <motion.button 
       whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
       className="mt-6 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
    >
       Approve Action
    </motion.button>
  </div>
);

export default function WorkflowConsole() {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // --- Auto-Play Logic ---
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="relative w-full py-20 md:py-32 bg-[#020202] text-white overflow-hidden">
      
      {/* Background Decor */}
      {/* <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-neutral-900/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" /> */}

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* --- Section Header --- */}
        <div className="mb-12 md:mb-20">
           <motion.div 
             initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-mono uppercase tracking-widest mb-6"
           >
             <Zap size={12} fill="currentColor" />
             <span>Core Intelligence</span>
           </motion.div>

           <div className="grid md:grid-cols-2 gap-12 items-end">
             <motion.h2 
               initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
               className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]"
             >
               The Invisible <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                 Workflow.
               </span>
             </motion.h2>
             <motion.p 
               initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
               className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-lg"
             >
               Gaprio operates quietly between your apps. It detects intent, connects context, and drafts actions—so you just have to approve.
             </motion.p>
           </div>
        </div>

        {/* ========================================================= */}
        {/* DESKTOP LAYOUT (The Split View You Liked)                 */}
        {/* ========================================================= */}
        <div 
          className="hidden lg:grid lg:grid-cols-12 gap-12"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          
          {/* LEFT: Timeline Navigation */}
          <div className="lg:col-span-5 flex flex-col justify-center relative">
            {/* The Vertical Connecting Line */}
            <div className="absolute left-8 top-10 bottom-10 w-px bg-white/10" />

            <div className="space-y-6">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <div 
                    key={step.id}
                    onClick={() => setActiveStep(index)}
                    className={clsx(
                      "group relative pl-16 cursor-pointer transition-all duration-300",
                      isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                    )}
                  >
                    {/* The Dot on the Line */}
                    <div 
                        className={clsx(
                          "absolute left-[28px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-black transition-all duration-500 z-10",
                          isActive ? `bg-current scale-150 ${step.color}` : "bg-neutral-800"
                        )} 
                    />

                    {/* Content Card */}
                    <div className={clsx(
                       "p-6 rounded-xl border transition-all duration-300 backdrop-blur-sm",
                       isActive ? "bg-white/5 border-white/10 translate-x-2" : "border-transparent hover:bg-white/[0.02]"
                    )}>
                       <div className="flex items-center gap-3 mb-2">
                          <span className={clsx("font-mono text-sm", isActive ? step.color : "text-neutral-500")}>
                            {step.id}
                          </span>
                          <h3 className={clsx("text-xl font-bold", isActive ? "text-white" : "text-neutral-300")}>
                            {step.title}
                          </h3>
                       </div>
                       <p className="text-sm text-neutral-400 leading-relaxed">
                         {step.desc}
                       </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: The Mac Window Console */}
          <div className="lg:col-span-7 h-auto relative perspective-1000">
             
             {/* The "Glass" Container */}
             <div className="relative w-full h-full bg-[#080808] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
                
                {/* 1. Window Header */}
                <div className="h-12 border-b border-white/5 bg-white/[0.02] flex items-center px-6 justify-between shrink-0">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                      <Bot size={12} />
                      Gaprio Agent Core v1.4
                   </div>
                </div>

                {/* 2. Main Content Area */}
                <div className="flex-1 relative p-12 flex flex-col min-h-[450px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="w-full h-full flex flex-col"
                    >
                      {/* Top: Icon & Title */}
                      <div className="flex items-start justify-between mb-8">
                         <div>
                            <span className={clsx(
                              "inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-2 border",
                              steps[activeStep].color,
                              steps[activeStep].bg,
                              steps[activeStep].border
                            )}>
                              {steps[activeStep].tagline}
                            </span>
                            <h2 className="text-3xl font-bold text-white">
                              {steps[activeStep].title}
                            </h2>
                         </div>
                         <div className={clsx("p-3 rounded-xl bg-white/5 text-white/50")}>
                            {React.createElement(steps[activeStep].icon, { size: 24 })}
                         </div>
                      </div>

                      {/* Middle: The Visual Simulation */}
                      <div className="flex-1 bg-black/50 rounded-xl border border-white/5 relative overflow-hidden flex flex-col justify-center items-center p-6 min-h-[200px]">
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px]" />
                          <div className="relative z-10 w-full">
                            {activeStep === 0 && <ChatVisual />}
                            {activeStep === 1 && <ScanVisual />}
                            {activeStep === 2 && <TerminalVisual />}
                            {activeStep === 3 && <SuccessVisual />}
                          </div>
                      </div>
                      
                      {/* Bottom: Technical Detail Text */}
                      <div className="mt-6 pt-6 border-t border-white/5">
                        <p className="font-mono text-sm text-neutral-400 leading-relaxed">
                          <span className="text-orange-500 mr-2">_</span>
                          {steps[activeStep].detail}
                        </p>
                      </div>

                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* 3. Progress Bar (Bottom of Window) */}
                <div className="h-1 bg-white/5 w-full">
                   <motion.div 
                      key={activeStep}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className={clsx("h-full", steps[activeStep].bg.replace('/10', '/50'))} 
                   />
                </div>

             </div>
          </div>
        </div>


        {/* ========================================================= */}
        {/* MOBILE LAYOUT (The Instagram Story Style)                 */}
        {/* ========================================================= */}
        <div className="lg:hidden flex flex-col h-auto">
          
          {/* 1. Progress Indicators (Top) */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {steps.map((_, i) => (
              <div key={i} className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: i === activeStep ? "100%" : i < activeStep ? "100%" : "0%" }}
                  transition={{ duration: i === activeStep ? 5 : 0, ease: "linear" }}
                  className={clsx("h-full", i === activeStep ? "bg-orange-500" : "bg-white/30")}
                />
              </div>
            ))}
          </div>

          {/* 2. Unified Mobile Card */}
          <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 min-h-[480px] flex flex-col relative overflow-hidden">
             
             {/* Background Glow */}
             <div className={clsx("absolute top-0 right-0 w-64 h-64 bg-gradient-to-br opacity-10 blur-3xl rounded-full", steps[activeStep].gradient)} />

             <AnimatePresence mode="wait">
               <motion.div
                 key={activeStep}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.3 }}
                 className="flex flex-col h-full"
               >
                 {/* Header */}
                 <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-mono font-bold text-white/10">{steps[activeStep].id}</span>
                    <div>
                       <h3 className="text-2xl font-bold text-white leading-none">{steps[activeStep].title}</h3>
                       <span className={clsx("text-xs font-mono uppercase tracking-wider", steps[activeStep].color)}>
                         {steps[activeStep].tagline}
                       </span>
                    </div>
                 </div>

                 {/* Text */}
                 <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                   {steps[activeStep].desc}
                 </p>

                 {/* Visual Box */}
                 <div className="mt-auto bg-black/40 border border-white/10 rounded-xl p-4 h-[200px] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    <div className="relative z-10 w-full">
                       {activeStep === 0 && <ChatVisual />}
                       {activeStep === 1 && <ScanVisual />}
                       {activeStep === 2 && <TerminalVisual />}
                       {activeStep === 3 && <SuccessVisual />}
                    </div>
                 </div>

                 {/* Terminal Line (Mobile) */}
                 <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="font-mono text-[10px] text-neutral-500 line-clamp-2">
                       <span className="text-green-500 mr-2"></span>
                       {steps[activeStep].detail}
                    </p>
                 </div>

               </motion.div>
             </AnimatePresence>
          </div>

          {/* Mobile Tap Navigation Controls */}
          <div className="mt-4 flex justify-between text-neutral-600 text-xs font-mono px-2">
             <button onClick={() => setActiveStep((prev) => (prev - 1 + steps.length) % steps.length)}>← Prev</button>
             <button onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}>Next →</button>
          </div>

        </div>

      </div>
    </section>
  );
}