'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Zap, Brain, ShieldCheck, ArrowRight, 
  Code2, Activity, Lock, Database, 
  GitBranch, CheckCircle2, Globe, 
  ChevronRight, Server, Command, 
  Layout, Search, Terminal
} from 'lucide-react';

// --- DATA: 8 CORE INTEGRATIONS ---
const integrations = [
  {
    id: 'slack',
    name: 'Slack',
    logo: '/companylogo/slack.png',
    title: 'The Nerve Center',
    desc: 'Turn Slack into a CLI. Gaprio listens for intent (e.g., "Schedule demo") and triggers workflows without leaving the chat.',
    tech: 'Socket Mode',
    latency: '12ms',
    status: 'Operational',
    endpoints: ['chat.post', 'views.open', 'users.info'],
    color: 'from-purple-500/20 to-purple-900/5'
  },
  {
    id: 'miro',
    name: 'Miro',
    logo: '/companylogo/miro.png',
    title: 'Visual Intelligence',
    desc: 'Parses whiteboards for actionable items. Reads sticky notes from retrospectives and converts them into Jira tickets.',
    tech: 'REST API v2',
    latency: '85ms',
    status: 'Syncing',
    endpoints: ['boards.get', 'items.create', 'connect'],
    color: 'from-yellow-500/20 to-yellow-900/5'
  },
  {
    id: 'asana',
    name: 'Asana',
    logo: '/companylogo/asana.png',
    title: 'Dependency Graph',
    desc: 'Visualizes blockers. If Design is delayed, Gaprio shifts the Engineering timeline and alerts the PM automatically.',
    tech: 'Graph API',
    latency: '24ms',
    status: 'Operational',
    endpoints: ['tasks.create', 'events.get', 'projects'],
    color: 'from-red-500/20 to-red-900/5'
  },
  {
    id: 'jira',
    name: 'Jira',
    logo: '/companylogo/jira.png',
    title: 'Velocity Automator',
    desc: 'Links Git commits to tickets. Predicts sprint velocity based on historical code churn and team capacity.',
    tech: 'Webhook',
    latency: '45ms',
    status: 'Operational',
    endpoints: ['issue.edit', 'search', 'agile.board'],
    color: 'from-blue-500/20 to-blue-900/5'
  },
  {
    id: 'google',
    name: 'Google Workspace',
    logo: '/companylogo/google.webp',
    title: 'Semantic Context',
    desc: 'Indexes Drive and Email into a private vector DB. Ask "What was the Q3 budget?" and get the exact cell reference.',
    tech: 'Vector Search',
    latency: '110ms',
    status: 'Indexing',
    endpoints: ['drive.list', 'gmail.get', 'sheets.read'],
    color: 'from-green-500/20 to-green-900/5'
  },
  {
    id: 'microsoft',
    name: 'Microsoft 365',
    logo: '/companylogo/microsoft.webp',
    title: 'Legacy Bridge',
    desc: 'Unlocks data in Excel/SharePoint. Acts as a translation layer, making legacy data accessible to modern AI agents.',
    tech: 'Graph API',
    latency: '92ms',
    status: 'Operational',
    endpoints: ['excel.read', 'sharepoint.list', 'teams'],
    color: 'from-blue-600/20 to-blue-900/5'
  },
  {
    id: 'zoho',
    name: 'Zoho One',
    logo: '/companylogo/zoho.png',
    title: 'Revenue Operations',
    desc: 'Closes the loop between Sales and Product. Won deals trigger automated onboarding sequences.',
    tech: 'Deluge',
    latency: '150ms',
    status: 'Listening',
    endpoints: ['crm.modules', 'desk.tickets', 'flow'],
    color: 'from-yellow-600/20 to-yellow-900/5'
  },
  {
    id: 'clickup',
    name: 'ClickUp',
    logo: '/companylogo/clickup.png',
    title: 'Unified Task Layer',
    desc: 'Consolidates tasks from 5+ platforms into one personalized ClickUp view. The single source of truth.',
    tech: 'REST API',
    latency: '30ms',
    status: 'Operational',
    endpoints: ['task.update', 'list.get', 'hooks'],
    color: 'from-purple-600/20 to-purple-900/5'
  }
];

// --- 1. ENHANCED TERMINAL (Exact Sequence) ---
const SmartTerminal = () => {
  const [lines, setLines] = useState([
    { text: "Initializing Gaprio Daemon v2.4...", color: "text-zinc-500" },
  ]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = [
        { text: "✔ NLP Model Loaded (340MB)", color: "text-green-400", delay: 500 },
        { text: "✔ Vector DB Connected (Pinecone)", color: "text-green-400", delay: 1000 },
        { text: "[INFO] Scanning environment variables...", color: "text-zinc-400", delay: 1800 },
        { text: "➜ ~ gaprio connect --all", color: "text-blue-400", type: "command", delay: 3000 },
        { text: "Handshaking with Slack (Socket Mode)...", color: "text-zinc-300", delay: 3800 },
        { text: "Indexing 14,203 documents...", color: "text-zinc-300", delay: 4500 },
        { text: "[WARN] Jira API rate limit approaching (85%)", color: "text-orange-400", delay: 5500 },
        { text: "Optimization Complete. System Ready.", color: "text-green-500", delay: 6500 },
    ];

    if (step < sequence.length) {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev.slice(-8), sequence[step]]); // Keep last 9 lines
        setStep(prev => prev + 1);
      }, sequence[step].delay - (step > 0 ? sequence[step-1].delay : 0));
      return () => clearTimeout(timeout);
    }
  }, [step]);

  return (
    <div className="relative bg-[#050505]/90 backdrop-blur-2xl rounded-xl border border-white/10 shadow-2xl overflow-hidden text-left font-mono text-xs md:text-sm h-[320px] flex flex-col group hover:border-white/20 transition-colors duration-500">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#2a2a2a] border border-white/10 group-hover:bg-red-500/50 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-[#2a2a2a] border border-white/10 group-hover:bg-yellow-500/50 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-[#2a2a2a] border border-white/10 group-hover:bg-green-500/50 transition-colors" />
        </div>
        <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
          gaprio_daemon — active
        </div>
        <div className="w-10" /> 
      </div>

      {/* Terminal Body */}
      <div className="p-6 flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5 pointer-events-none" />
        
        <div className="space-y-3 relative z-10">
          {lines.map((line, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${line.color} flex items-center`}
            >
              {line.type === 'command' && <span className="text-green-500 mr-2">➜ ~</span>}
              {line.text}
            </motion.div>
          ))}
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-2 h-4 bg-orange-500 inline-block align-middle ml-1"
          />
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="mt-auto px-4 py-2 border-t border-white/5 bg-[#080808] flex justify-between items-center text-[10px] text-zinc-500">
         <div className="flex gap-4">
            <span className="text-zinc-400">CPU: <span className="text-green-400">12%</span></span>
            <span className="text-zinc-400">MEM: <span className="text-green-400">340MB</span></span>
         </div>
         <div className="flex items-center gap-2">
            <Activity size={10} className="text-green-500" />
            SYSTEM READY
         </div>
      </div>
    </div>
  );
};

// --- 2. HERO SECTION ---
const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] lg:pt-44 pt-32 flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden">
      
      {/* Dynamic Backgrounds */}
      {/* 1. Base Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#ffffff03_1px,transparent_1px),linear-gradient(to_right,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />
      
      {/* 2. Orange Hero Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-600/20 blur-[120px] rounded-full opacity-50 z-0 pointer-events-none mix-blend-screen" />

      <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center relative">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[1.05] max-w-5xl mx-auto drop-shadow-2xl">
            The <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-orange-500 to-red-600">Operating System</span> <br />
            for Enterprise Work.
          </h1>

          <p className="text-md md:text-lg text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop stitching tools together with brittle scripts. Gaprio provides a single, 
            intelligent layer that understands context, executes code, and orchestrates 
            your entire stack.
          </p>

          <div className="flex flex-row items-center justify-center gap-3 sm:gap-5 mb-24 w-full px-2">
  <button className="flex-1 sm:flex-none h-12 sm:h-14 px-3 sm:px-8 rounded-full bg-gradient-to-b from-orange-500 to-orange-700 text-white font-bold text-xs sm:text-base hover:shadow-[0_0_40px_-5px_rgba(234,88,12,0.6)] transition-all flex items-center justify-center gap-2 group border border-orange-400/20 whitespace-nowrap">
    Initialize System
    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
  </button>
  <button className="flex-1 sm:flex-none h-12 sm:h-14 px-3 sm:px-8 rounded-full bg-[#0a0a0a] text-white border border-white/10 font-bold text-xs sm:text-base hover:bg-white/5 transition-all flex items-center justify-center gap-2 backdrop-blur-sm whitespace-nowrap">
    <Code2 size={16} className="text-zinc-500" /> View Documentation
  </button>
</div>
        </motion.div>

        {/* FLOATING TERMINAL */}
        <motion.div 
          initial={{ opacity: 0, y: 60, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 100 }}
          className="w-full max-w-4xl relative perspective-1000 group z-20"
        >
          {/* Backlight for Terminal */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-blue-500/20 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
          <SmartTerminal />
        </motion.div>

      </div>
    </section>
  );
};

// --- 3. UNIFIED GRID ---
const UnifiedGrid = () => {
    return (
        <section className="pt-32 relative">
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-transparent to-orange-500/50" />
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5 pointer-events-none" />

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-2 mb-4"
                    >
                        <Layout size={16} className="text-orange-500" />
                        <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest">The Unified Stack</h2>
                    </motion.div>
                    
                    <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold mb-6 text-white"
                    >
                        Integrations that actually work.
                    </motion.h3>
                    <p className="text-zinc-400 text-lg">
                        Gaprio doesn't just display data; it acts on it using deep, bi-directional API connections across your entire stack.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {integrations.map((tool, i) => (
                        <motion.div 
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-500 flex flex-col h-full overflow-hidden"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                            <div className="flex items-start justify-between mb-8 relative z-10">
                                <div className="w-12 h-12 bg-[#111] rounded-xl border border-white/5 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                                    <Image 
                                        src={tool.logo} 
                                        alt={tool.name} 
                                        width={32} 
                                        height={32} 
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5 backdrop-blur-md">
                                        <div className={`w-1.5 h-1.5 rounded-full ${tool.status === 'Operational' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{tool.status}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-600">LATENCY: {tool.latency}</span>
                                </div>
                            </div>

                            <div className="relative z-10 flex-1">
                                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-orange-100 transition-colors flex items-center gap-2">
                                    {tool.title}
                                </h4>
                                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                                    {tool.desc}
                                </p>
                                
                                <div className="bg-[#050505] rounded-lg p-3 border border-white/5 font-mono text-xs text-zinc-500 space-y-1 group-hover:border-white/10 transition-colors">
                                    <div className="flex justify-between">
                                        <span>Protocol:</span>
                                        <span className="text-zinc-300">{tool.tech}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Scope:</span>
                                        <span className="text-orange-400/80">Read/Write</span>
                                    </div>
                                    <div className="pt-2 mt-2 border-t border-white/5 flex gap-2 flex-wrap">
                                        {tool.endpoints.map(ep => (
                                            <span key={ep} className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-zinc-400">{ep}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- 4. NEURAL ARCHITECTURE ---
const NeuralArchitecture = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: "Ingest & Normalize",
      desc: "Sanitizes data streams from connected APIs into a standard JSON schema.",
      icon: Database,
      code: `// 1. Data Ingestion\nconst rawData = await slack.history.get({\n  channel: "C012345",\n  limit: 100\n});\n// Normalize to internal schema\nconst cleanEvents = rawData.map(normalize);\nreturn cleanEvents;`
    },
    {
      id: 1,
      title: "Vector Embedding",
      desc: "Passes textual data through embedding models to create a semantic map.",
      icon: Brain,
      code: `// 2. Semantic Embedding\nconst vector = await openai.embed({\n  model: "text-embedding-3-large",\n  input: userQuery\n});\n// Upsert to Pinecone/Weaviate\nawait db.vectors.upsert({\n  id: "evt_992",\n  values: vector\n});`
    },
    {
      id: 2,
      title: "Recursive Planning",
      desc: "The Agent breaks requests down into atomic, executable steps.",
      icon: GitBranch,
      code: `// 3. Chain of Thought\nconst plan = [\n  { step: "search_users", query: "marketing" },\n  { step: "filter_active", status: "true" },\n  { step: "compose_msg", template: "invite" }\n];\nawait executor.run(plan);`
    },
    {
      id: 3,
      title: "Deterministic Action",
      desc: "Executes plans via sandboxed API calls with rollback capabilities.",
      icon: ShieldCheck,
      code: `// 4. Safe Execution\ntry {\n  const result = await api.call(endpoint, payload);\n  await auditLog.write({\n    action: "create_invite",\n    status: "success" \n  });\n} catch (err) {\n  await rollback.trigger(transactionId);\n}`
    }
  ];

  return (
    <section className="pt-24 border-y border-white/5 relative">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="mb-16">
          <h2 className="text-orange-500 font-mono text-sm tracking-widest uppercase mb-3">Under the Hood</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white">Neural Architecture</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-4">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`cursor-pointer p-6 rounded-xl border transition-all duration-300 relative overflow-hidden group ${activeStep === index ? "bg-zinc-900 border-orange-500/50" : "bg-transparent border-white/5 hover:bg-zinc-900/50 hover:border-white/10"}`}
              >
                {activeStep === index && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" 
                  />
                )}
                <div className="flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-lg transition-colors ${activeStep === index ? "text-orange-500 bg-orange-500/10" : "text-zinc-500 bg-zinc-800"}`}>
                    <step.icon size={20} />
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold mb-1 transition-colors ${activeStep === index ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-7">
            <div className="relative h-full min-h-[500px] bg-[#0a0a0a] rounded-2xl border border-white/10 p-1 shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/5 rounded-t-xl">
                 <div className="flex gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                   <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                 </div>
                 <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">
                    Process_Monitor.js
                 </div>
                 <div className="w-8" />
              </div>
              <div className="relative flex-1 bg-[#050505] p-6 lg:p-8 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col"
                  >
                    <div className="mb-6 flex items-center gap-3">
                      <div className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-orange-400 border border-orange-500/20">
                        Step 0{activeStep + 1}
                      </div>
                      <div className="h-px bg-white/10 flex-1" />
                    </div>
                    <div className="font-mono text-sm leading-relaxed overflow-x-auto">
                      <pre>
                        <code className="language-javascript text-zinc-300">
                          {steps[activeStep].code.split('\n').map((line, i) => (
                            <div key={i} className="table-row">
                              <span className="table-cell select-none text-zinc-700 pr-4 text-right w-8">{i + 1}</span>
                              <span 
                                className="table-cell"
                                dangerouslySetInnerHTML={{ 
                                  __html: line
                                    .replace(/\/\/.*/g, '<span class="text-zinc-500">$&</span>')
                                    .replace(/const|await|return|try|catch/g, '<span class="text-purple-400">$&</span>')
                                    .replace(/"[^"]*"/g, '<span class="text-green-400">$&</span>')
                                    .replace(/function|=>/g, '<span class="text-blue-400">$&</span>')
                                 }} 
                              />
                            </div>
                          ))}
                        </code>
                      </pre>
                    </div>
                    <div className="mt-auto pt-8">
                       <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                          <Activity size={12} className="animate-pulse text-green-500" />
                          Processing thread active...
                       </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 5. SPECS & TRUST ---
const EnterpriseSpecs = () => {
  return (
    <section className="pt-24 relative">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Enterprise Grade Security</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Built for organizations where data privacy is non-negotiable.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative p-8 bg-[#0a0a0a] rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all duration-300 overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-50">
               <ShieldCheck className="text-zinc-700 group-hover:text-orange-500 transition-colors" size={80} strokeWidth={1} />
             </div>
             <div className="relative z-10">
               <h3 className="text-xl font-bold text-white mb-2">SOC2 Type II</h3>
               <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                 Strict data isolation. Your proprietary data never leaves your VPC. We adhere to the strictest compliance standards.
               </p>
               <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500 w-full" />
               </div>
               <div className="flex justify-between mt-2 text-[10px] text-zinc-500 font-mono uppercase">
                  <span>Compliance</span>
                  <span>Verified</span>
               </div>
             </div>
          </div>
          <div className="group relative p-8 bg-[#0a0a0a] rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all duration-300 overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-50">
               <Activity className="text-zinc-700 group-hover:text-orange-500 transition-colors" size={80} strokeWidth={1} />
             </div>
             <div className="relative z-10">
               <h3 className="text-xl font-bold text-white mb-2">99.99% Uptime</h3>
               <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                 Redundant edge nodes ensure Gaprio is always listening. Failover systems activate in under 50ms.
               </p>
               <div className="flex gap-1 mt-auto">
                  {[...Array(20)].map((_,i) => (
                    <div key={i} className="h-6 flex-1 bg-green-900/40 rounded-sm overflow-hidden">
                       <div className="h-full bg-green-500 animate-pulse opacity-80" style={{ animationDelay: `${i * 0.1}s` }} />
                    </div>
                  ))}
               </div>
               <div className="flex justify-between mt-2 text-[10px] text-zinc-500 font-mono uppercase">
                  <span>Status</span>
                  <span className="text-green-500">Operational</span>
               </div>
             </div>
          </div>
          <div className="group relative p-8 bg-[#0a0a0a] rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all duration-300 overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-50">
               <Lock className="text-zinc-700 group-hover:text-orange-500 transition-colors" size={80} strokeWidth={1} />
             </div>
             <div className="relative z-10">
               <h3 className="text-xl font-bold text-white mb-2">AES-256 Encryption</h3>
               <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                 All data is encrypted at rest and in transit. Keys are managed via AWS KMS with automatic rotation policies.
               </p>
               <div className="flex items-center gap-3 p-3 rounded bg-zinc-900/50 border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-mono text-zinc-300">TLS 1.3 / SHA-256</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 6. FOOTER ---
const Footer = () => (
    <footer className="border-t border-white/10 pt-20 pb-10 bg-[#020202] relative z-20">
        <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
                <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 bg-orange-600 rounded-md flex items-center justify-center">
                            <Zap size={12} className="text-white fill-white" />
                        </div>
                        <span className="font-bold text-white tracking-tight">Gaprio</span>
                    </div>
                    <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
                        The operating system for modern enterprise work. Automate, orchestrate, and secure your stack.
                    </p>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">Product</h4>
                    <ul className="space-y-2 text-sm text-zinc-500">
                        <li className="hover:text-orange-500 cursor-pointer">Integrations</li>
                        <li className="hover:text-orange-500 cursor-pointer">Workflows</li>
                        <li className="hover:text-orange-500 cursor-pointer">Security</li>
                        <li className="hover:text-orange-500 cursor-pointer">Pricing</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-zinc-500">
                        <li className="hover:text-orange-500 cursor-pointer">About</li>
                        <li className="hover:text-orange-500 cursor-pointer">Careers</li>
                        <li className="hover:text-orange-500 cursor-pointer">Blog</li>
                        <li className="hover:text-orange-500 cursor-pointer">Contact</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-zinc-500">
                        <li className="hover:text-orange-500 cursor-pointer">Privacy</li>
                        <li className="hover:text-orange-500 cursor-pointer">Terms</li>
                        <li className="hover:text-orange-500 cursor-pointer">DPA</li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-zinc-600">
                <p>&copy; 2025 Gaprio Inc. All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <span>Twitter</span>
                    <span>GitHub</span>
                    <span>LinkedIn</span>
                </div>
            </div>
        </div>
    </footer>
);

// --- 7. CTA SECTION ---
const CTASection = () => {
  return (
    <section className="relative py-32 overflow-hidden flex flex-col items-center justify-center border-t border-white/10 bg-[#020202]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />

      <div className="relative z-10 text-center px-4 max-w-3xl">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Ready to deploy the <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Neural Layer?</span>
        </h2>
        
        <p className="text-xl text-zinc-400 mb-10">
          Join 500+ engineering teams automating their workflows today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <button className="h-14 px-8 rounded-full bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Get Started <ArrowRight size={20} />
          </button>
          <button className="h-14 px-8 rounded-full bg-zinc-900 text-white border border-zinc-800 font-bold text-lg hover:bg-zinc-800 transition-colors flex items-center gap-2">
            Explore Integrations <Globe size={20} className="text-zinc-500" />
          </button>
        </div>
      </div>
    </section>
  );
};

// --- MAIN PAGE LAYOUT ---
const FeaturesPage = () => {
  return (
    // Single Root Background for seamless flow
    <main className="bg-[#020202] min-h-screen selection:bg-orange-500/30 selection:text-white font-sans text-white overflow-x-hidden">
      <HeroSection />
      <UnifiedGrid />
      <NeuralArchitecture />
      <EnterpriseSpecs />
      <CTASection />
      <Footer />
    </main>
  );
};

export default FeaturesPage;