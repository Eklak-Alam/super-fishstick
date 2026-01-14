'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Zap, Brain, ShieldCheck, ArrowRight, 
  Code2, Activity, Lock, Database, 
  GitBranch, CheckCircle2, Globe, 
  ChevronRight, Server, Command, 
  Layout, Search, Terminal,
  ArrowRightCircle,
  Code2Icon,
  BookOpen,
  Cpu,
  Workflow,
  Sparkles,
  MessageSquare,
  FileText,
  Radio
} from 'lucide-react';

// ... [KEEP YOUR EXISTING "integrations" DATA HERE] ...
const integrations = [
  {
    id: 'slack',
    name: 'Slack',
    logo: '/companylogo/slack.png',
    title: 'Team communication',
    desc: 'Gaprio listens to conversations in Slack, detects intent, and triggers workflows directly from chat, helping teams take action without leaving the chat.',
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
    title: 'Visual collaboration',
    desc: 'Ideas should not stay on whiteboards. Gaprio understands Miro boards and helps turn discussions into tasks, notes, and follow-ups.',
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
    title: 'Project Coordination',
    desc: 'Gaprio understands how work connects across teams. When priorities shift, timelines and dependencies update automatically.',
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
    title: 'Engineering execution',
    desc: 'Engineering progress stays visible across the organization through real-time synchronization between planning and execution.',
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
    title: 'Everyday collaboration',
    desc: 'Gaprio connects documents, emails, and spreadsheets into a unified knowledge layer that teams can query naturally.',
    tech: 'Vector Search',
    latency: '110ms',
    status: 'Indexing',
    endpoints: ['drive.list', 'gmail.get', 'sheets.read'],
    color: 'from-blue-500/20 to-red-900/5'
  },
  {
    id: 'microsoft',
    name: 'Microsoft 365',
    logo: '/companylogo/microsoft.webp',
    title: 'Enterprise productivity',
    desc: 'Gaprio connects Outlook, Excel, and SharePoint into modern workflows, allowing legacy data to remain useful and actionable.',
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
    title: 'operations suite',
    desc: 'Customer activity connects directly to internal workflows, helping teams move from sales signals to delivery without manual handoffs.',
    tech: 'Deluge',
    latency: '150ms',
    status: 'Listening',
    endpoints: ['crm.modules', 'desk.tickets', 'flow'],
    color: 'from-red-600/20 to-yellow-900/5'
  },
  {
    id: 'clickup',
    name: 'ClickUp',
    logo: '/companylogo/clickup.png',
    title: 'Structured workflows',
    desc: 'Work is scattered across platforms. Gaprio brings tasks together so teams see priorities clearly in one place.',
    tech: 'REST API',
    latency: '30ms',
    status: 'Operational',
    endpoints: ['task.update', 'list.get', 'hooks'],
    color: 'from-purple-600/20 to-purple-900/5'
  }
];

// ... [KEEP YOUR EXISTING HERO SECTION] ...
const HeroSection = () => {
  return (
    <section className="relative min-h-[100dvh] lg:min-h-[90vh] lg:pt-44 md:pt-32 pt-36 flex flex-col items-center justify-start pb-32 overflow-hidden bg-[#050201]">
      
      {/* --- Background Effects --- */}
      <div className="absolute top-[-10%] md:top-[-25%] left-1/2 -translate-x-1/2 w-[90vw] md:w-[80vw] h-[40vh] md:h-[50vh] bg-orange-600/20 blur-[100px] md:blur-[150px] rounded-[100%]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[80vw] md:w-[60vw] h-[40vh] md:h-[50vh] bg-violet-900/20 blur-[120px] md:blur-[180px] rounded-[100%]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:30px_30px] md:bg-[size:40px_40px] opacity-[0.04]" />

      <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center relative">
        {/* --- Text Content --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6 md:mb-8 leading-[1.1] md:leading-[1.05] max-w-5xl mx-auto drop-shadow-2xl">
            The Operating System <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-300 to-amber-500">
              for Enterprise Work.
            </span>
          </h1>

          <p className="text-base md:text-lg text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed px-2">
            Stop stitching tools together with fragile workflows. Gaprio adds a
            single intelligent layer that understands context, coordinates
            actions, and orchestrates work across your entire stack.
          </p>

          {/* --- Buttons Section --- */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-16 sm:mb-24 w-full max-w-md sm:max-w-none">
            
            {/* 1. Primary Button (Full width on mobile) */}
            <button 
              suppressHydrationWarning={true}
              className="group cursor-pointer relative h-12 px-8 rounded-full bg-gradient-to-b from-orange-400 to-orange-600 text-black font-semibold text-lg hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden w-full sm:w-auto min-w-[200px]"
            >
              <span className="relative z-10">Initialize System</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
            </button>

            {/* 2. Secondary Button (Reduced width on mobile) */}
            {/* Changed w-full to w-[80%] so it's smaller than the top button on phones */}
            <div className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] w-[80%] sm:w-auto min-w-[160px] cursor-pointer group">
              <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#333333_50%,#f97316_100%)]" />

              <span
                className="
                  inline-flex h-full w-full items-center justify-center rounded-full 
                  bg-[#050201] px-8 text-sm font-medium text-zinc-400 
                  backdrop-blur-3xl 
                  group-hover:text-white group-hover:bg-[#0f0a05] 
                  transition-all duration-300 gap-2
                "
              >
                View Documentation
                <BookOpen
                  size={16}
                  className="text-zinc-600 group-hover:text-orange-500 transition-colors duration-300"
                />
              </span>
            </div>
            
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050201] to-transparent z-10 pointer-events-none" />
    </section>
  );
};

// --- NEW COMPONENT: CORE FEATURES (Bento Grid) ---
const CoreFeatures = () => {
  return (
    <section className="relative pb-24 bg-[#050201]">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles size={16} className="text-orange-500" />
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest">
              Core Capabilities
            </h2>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Why teams choose Gaprio
          </motion.h3>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          
          {/* Card 1: Universal Search (Large, Spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group md:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/20 p-8 hover:bg-zinc-900/40 transition-all duration-500"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 border border-orange-500/20">
                  <Search className="text-orange-500" size={20} />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Universal Context</h4>
                <p className="text-zinc-400 max-w-md">
                  Stop digging through tabs. Gaprio indexes everything—chats, docs, issues—so you can query your entire organization in natural language.
                </p>
              </div>
              
              {/* Visual Mock: Command Bar */}
              <div className="mt-8 relative w-full h-16 bg-black/50 rounded-xl border border-white/10 flex items-center px-4 shadow-xl group-hover:scale-[1.02] transition-transform duration-500">
                 <Search size={16} className="text-zinc-500 mr-3" />
                 <div className="text-zinc-500 text-sm font-mono flex-1">
                    <span className="text-zinc-300">Summarize</span> marketing plans for Q4...
                 </div>
                 <div className="px-2 py-1 rounded bg-white/10 text-[10px] text-zinc-400 font-mono border border-white/5">⌘ K</div>
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none" />
          </motion.div>

          {/* Card 2: Real-time Sync (Tall or standard) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/20 p-8 hover:bg-zinc-900/40 transition-all duration-500"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                  <Zap className="text-blue-500" size={20} />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Instant Sync</h4>
                <p className="text-zinc-400">
                  Two-way binding means when a task updates in Asana, it updates in Slack. Instantly.
                </p>
              </div>
              
              {/* Visual Mock: Pulsing Status */}
              <div className="mt-8 flex items-center justify-center h-16 bg-black/40 rounded-xl border border-white/5 relative">
                 <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full animate-pulse" />
                 <div className="flex items-center gap-2 relative z-10">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                    <span className="text-xs font-mono text-blue-400">SYNC_ACTIVE: 12ms</span>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Autonomous Agents (Standard) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/20 p-8 hover:bg-zinc-900/40 transition-all duration-500"
          >
             <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                  <Cpu className="text-purple-500" size={20} />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Autonomous Agents</h4>
                <p className="text-zinc-400">
                  Deploy agents that monitor specialized streams and act when specific criteria are met.
                </p>
              </div>

               {/* Visual Mock: Nodes */}
               <div className="mt-8 flex justify-center gap-2 items-center opacity-70 group-hover:opacity-100 transition-opacity">
                   <div className="w-8 h-8 rounded bg-zinc-800 border border-white/10" />
                   <div className="w-8 h-[1px] bg-zinc-700" />
                   <div className="w-8 h-8 rounded bg-purple-900/30 border border-purple-500/50 animate-pulse" />
                   <div className="w-8 h-[1px] bg-zinc-700" />
                   <div className="w-8 h-8 rounded bg-zinc-800 border border-white/10" />
               </div>
            </div>
          </motion.div>

          {/* Card 4: Orchestration (Large, Spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group md:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/20 p-8 hover:bg-zinc-900/40 transition-all duration-500"
          >
             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center h-full">
                <div className="flex-1">
                   <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 border border-green-500/20">
                      <Workflow className="text-green-500" size={20} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Adaptive Orchestration</h4>
                    <p className="text-zinc-400">
                      Workflows that heal themselves. If a step fails or a tool goes down, Gaprio reroutes the logic or flags a human for review, ensuring processes never stall.
                    </p>
                </div>
                
                {/* Visual Mock: Timeline/Tree */}
                <div className="flex-1 w-full bg-black/40 rounded-xl border border-white/5 p-4 font-mono text-[10px] space-y-2 group-hover:border-green-500/20 transition-colors">
                    <div className="flex justify-between text-zinc-500 border-b border-white/5 pb-2 mb-2">
                       <span>PROCESS_ID: 9942</span>
                       <span className="text-green-500">RUNNING</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <CheckCircle2 size={12} className="text-green-500" /> 
                       <span className="text-zinc-300">Ingest Data</span>
                       <span className="ml-auto text-zinc-600">0.2s</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <CheckCircle2 size={12} className="text-green-500" /> 
                       <span className="text-zinc-300">Analyze Intent</span>
                       <span className="ml-auto text-zinc-600">1.4s</span>
                    </div>
                    <div className="flex items-center gap-2 pl-4 border-l border-zinc-700 ml-1.5">
                       <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                       <span className="text-orange-400">Wait for Approval</span>
                    </div>
                </div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

// ... [KEEP YOUR EXISTING "UnifiedGrid" COMPONENT] ...
const UnifiedGrid = () => {
    return (
        <section className="pt-32 pb-10 relative">
            
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
                        Integrations That Actually Work.
                    </motion.h3>
                    <p className="text-zinc-400 text-lg">
                        Gaprio does more than surface information. It understands intent and takes action through deep, two-way integrations across your tools.
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

const NeuralArchitecture = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-advance logic
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 5000); // 5 seconds per step
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      id: 0,
      label: "STEP 01",
      title: "Ingest",
      fullTitle: "Ingest & Normalize",
      desc: "Gaprio absorbs chaotic signals from your stack.",
      color: "from-blue-500 to-cyan-500",
      icon: Database
    },
    {
      id: 1,
      label: "STEP 02",
      title: "Reason",
      fullTitle: "Semantic Reasoning",
      desc: "The AI connects dots between scattered data.",
      color: "from-purple-500 to-pink-500",
      icon: Brain
    },
    {
      id: 2,
      label: "STEP 03",
      title: "Plan",
      fullTitle: "Strategic Planning",
      desc: "Formulating a safe execution path.",
      color: "from-amber-500 to-orange-500",
      icon: GitBranch
    },
    {
      id: 3,
      label: "STEP 04",
      title: "Execute",
      fullTitle: "Secure Execution",
      desc: "Actions run in isolated sandboxes.",
      color: "from-emerald-500 to-green-500",
      icon: ShieldCheck
    }
  ];

  // --- RESPONSIVE VISUALIZERS ---

  const IngestVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Central Hub */}
      <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full bg-black border border-blue-500/50 shadow-[0_0_60px_rgba(59,130,246,0.3)] flex items-center justify-center">
        <Database className="text-blue-500 w-8 h-8 md:w-12 md:h-12" />
        <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
      </div>

      {/* Orbiting Particles */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0.5, 1, 0],
            x: [Math.cos(deg * (Math.PI / 180)) * 140, 0],
            y: [Math.sin(deg * (Math.PI / 180)) * 140, 0] 
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            delay: i * 0.3,
            ease: "easeInOut"
          }}
        >
           <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-500/30 backdrop-blur-md flex items-center justify-center">
              <Zap size={14} className="text-blue-400" />
           </div>
        </motion.div>
      ))}
      
      <div className="absolute bottom-6 md:bottom-10 text-center w-full px-4">
        <div className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-1">Stream Velocity</div>
        <div className="text-xl md:text-2xl font-bold text-white">24k events/sec</div>
      </div>
    </div>
  );

  const ReasonVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Nodes Grid */}
      <div className="grid grid-cols-3 gap-8 md:gap-12 relative z-10">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, i) => (
          <motion.div
            key={n}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ 
              scale: [0.8, 1.2, 0.8], 
              opacity: [0.5, 1, 0.5],
              backgroundColor: ["rgba(168,85,247,0.1)", "rgba(168,85,247,0.4)", "rgba(168,85,247,0.1)"]
            }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
            className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-purple-500/50 relative"
          >
             {i % 2 === 0 && (
                <div className="absolute top-1/2 left-1/2 w-16 md:w-24 h-[1px] bg-purple-500/30 -z-10 origin-left rotate-45" />
             )}
          </motion.div>
        ))}
      </div>
      
      {/* Floating Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 px-4 py-3 bg-black/90 border border-purple-500/30 rounded-xl backdrop-blur-xl shadow-2xl"
      >
         <div className="flex items-center gap-2 mb-2">
            <Brain className="text-purple-500 w-4 h-4" />
            <span className="text-sm font-bold text-white">Pattern Detected</span>
         </div>
         <p className="text-[10px] text-purple-200 leading-tight">Correlating Jira Ticket #402 with Slack Thread "Q4 Plans".</p>
         <div className="mt-3 h-1 w-full bg-purple-900/50 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "100%" }}
               transition={{ duration: 1.5 }}
               className="h-full bg-purple-500" 
            />
         </div>
      </motion.div>
    </div>
  );

  const PlanVisual = () => (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-6">
       <div className="px-3 py-1.5 rounded border border-amber-500/50 bg-amber-500/10 text-amber-500 text-[10px] font-mono uppercase">Request Inbound</div>
       <div className="w-[1px] h-6 md:h-8 bg-amber-500/30" />
       
       <div className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-sm px-4">
          <div className="flex flex-col items-center">
             <div className="w-full h-14 md:h-16 rounded-lg border border-zinc-700 bg-zinc-900/50 flex items-center justify-center text-xs text-zinc-500">Check Perms</div>
             <div className="w-[1px] h-4 bg-zinc-700 mt-2" />
             <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] mt-2" />
          </div>
          <div className="flex flex-col items-center">
             <div className="w-full h-14 md:h-16 rounded-lg border border-amber-500 bg-amber-900/10 flex items-center justify-center text-xs text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                Build Graph
             </div>
             <div className="w-[1px] h-4 bg-amber-500 mt-2" />
             <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mt-2" />
          </div>
       </div>
    </div>
  );

  const ExecuteVisual = () => (
    <div className="relative w-full h-full flex flex-col items-center justify-center font-mono p-4 md:p-10">
       <div className="w-full max-w-md bg-black/90 rounded-lg border border-emerald-500/20 shadow-2xl overflow-hidden text-left">
          <div className="bg-emerald-900/10 px-3 py-2 border-b border-emerald-500/10 flex items-center gap-2">
             <Terminal size={12} className="text-emerald-500" />
             <span className="text-[10px] text-emerald-500/70">GAPRIO_RUNNER_V1</span>
          </div>
          <div className="p-4 text-[10px] md:text-xs space-y-2 leading-relaxed">
             <p className="text-zinc-500">$ init_sandbox --secure --isolate</p>
             <p className="text-emerald-500/80">{`> Sandbox initialized in 12ms`}</p>
             <p className="text-zinc-500">$ execute_workflow --id=992</p>
             <div className="flex gap-1 py-1">
                <span className="text-emerald-500">████████</span>
                <span className="text-emerald-900">░░░</span>
             </div>
             <p className="text-white">{`> SUCCESS: Ticket Created`}</p>
             <p className="text-white">{`> SUCCESS: Slack Notified`}</p>
          </div>
       </div>
       <div className="absolute bottom-6 md:bottom-10 flex items-center gap-2 text-emerald-500 text-[10px] uppercase tracking-widest">
          <Lock size={12} /> Encrypted Transmission
       </div>
    </div>
  );

  return (
    <section className="py-14 md:pt-24 md:pb-10 bg-[#020202] border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* HEADER */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            The Intelligence Pipeline
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl">
            Watch how Gaprio transforms raw noise into structured action.
          </p>
        </div>

        {/* CONTAINER */}
        <div className="flex flex-col rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/20">
          
          {/* 1. CONTROLS (ALWAYS ON TOP) */}
          <div className="grid grid-cols-2 md:grid-cols-4 bg-zinc-900/40 border-b border-white/10">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`
                    relative p-4 md:p-6 text-left transition-all duration-300 
                    border-r border-b md:border-b-0 border-white/5 last:border-r-0 last:border-b-0 nth-2:border-r-0 md:nth-2:border-r
                    ${isActive ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'}
                  `}
                >
                  {/* Active Indicator (Top) */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabLine"
                      className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${step.color}`} 
                    />
                  )}
                  
                  <div className="flex flex-col h-full justify-between gap-2 md:gap-4">
                    <div className="flex items-center justify-between">
                       <span className={`text-[9px] md:text-[10px] font-mono uppercase tracking-widest ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                         {step.label}
                       </span>
                       <step.icon size={16} className={`hidden md:block ${isActive ? 'text-white' : 'text-zinc-700'}`} />
                    </div>
                    <div>
                      <h3 className={`text-sm md:text-lg font-bold mb-1 ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                        <span className="md:hidden">{step.title}</span>
                        <span className="hidden md:inline">{step.fullTitle}</span>
                      </h3>
                      <p className={`text-xs line-clamp-2 hidden md:block ${isActive ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 2. VISUAL STAGE (ALWAYS ON BOTTOM) */}
          <div className="relative w-full aspect-square md:aspect-[21/9] bg-black overflow-hidden group">
            
            {/* Ambient Background */}
            <motion.div 
               animate={{ 
                 background: `radial-gradient(circle at center, ${steps[activeStep].color.includes('blue') ? '#3b82f6' : steps[activeStep].color.includes('purple') ? '#a855f7' : steps[activeStep].color.includes('amber') ? '#f59e0b' : '#10b981'}15 0%, transparent 70%)` 
               }}
               className="absolute inset-0 z-0 transition-colors duration-1000"
            />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px] z-0 pointer-events-none" />

            {/* Content Switcher */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 z-10 p-4 md:p-12"
              >
                 {activeStep === 0 && <IngestVisual />}
                 {activeStep === 1 && <ReasonVisual />}
                 {activeStep === 2 && <PlanVisual />}
                 {activeStep === 3 && <ExecuteVisual />}
              </motion.div>
            </AnimatePresence>

            {/* Stage Footer UI */}
            <div className="absolute bottom-0 left-0 w-full px-4 py-2 md:px-6 md:py-3 border-t border-white/10 flex justify-between items-center bg-black/60 backdrop-blur-md z-20">
               <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 md:gap-2">
                     <Radio size={10} className={activeStep % 2 === 0 ? "text-white animate-pulse" : "text-zinc-600"} />
                     <span className="text-[10px] font-mono text-zinc-400 uppercase">Live</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                     <Cpu size={10} className="text-zinc-600" />
                     <span className="text-[10px] font-mono text-zinc-400 uppercase">12ms</span>
                  </div>
               </div>
               <div className="text-[10px] font-mono text-zinc-600">
                  ID: 8829-AFX
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const EnterpriseSpecs = () => {
  return (
    <section className="py-32 relative bg-[#050201] overflow-hidden">
      
      {/* Background Ambience */}
      {/* <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-800/20 rounded-full blur-[100px] pointer-events-none" /> */}

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-zinc-500 mb-6 tracking-tight"
          >
            Security Built Into <span className="text-white">Every Layer</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Built for organizations where data privacy is non-negotiable.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* --- CARD 1: Permission Aware --- */}
          <SpecCard delay={0.1}>
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck className="text-orange-500" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Permission Aware</h3>
                <p className="text-zinc-400 leading-relaxed mb-8">
                  Gaprio respects existing roles and rules. It acts strictly within the user's authorized scope, ensuring zero privilege escalation.
                </p>
              </div>

              {/* Visual Element */}
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-zinc-500 uppercase">Access Control</span>
                  <CheckCircle2 size={14} className="text-green-500" />
                </div>
                <div className="flex gap-2">
                   <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-[10px] font-mono border border-green-500/20">Read: Granted</span>
                   <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-[10px] font-mono border border-green-500/20">Write: Granted</span>
                </div>
              </div>
            </div>
          </SpecCard>

          {/* --- CARD 2: Human-in-the-Loop --- */}
          <SpecCard delay={0.2}>
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Activity className="text-orange-500" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Human-in-the-Loop</h3>
                <p className="text-zinc-400 leading-relaxed mb-8">
                  Critical actions require approval. Teams retain full control over execution, with the ability to rollback at any stage.
                </p>
              </div>

              {/* Visual Element: Pulse Graph */}
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 backdrop-blur-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-3">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider">Awaiting Input</span>
                    </div>
                 </div>
                 
                 <div className="flex items-end gap-[2px] h-8 mt-4 opacity-50">
                    {[40, 60, 30, 80, 50, 90, 20, 40, 70, 45, 60, 30, 80].map((h, i) => (
                        <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-zinc-600 rounded-sm" />
                    ))}
                 </div>
              </div>
            </div>
          </SpecCard>

          {/* --- CARD 3: Workspace Isolation --- */}
          <SpecCard delay={0.3}>
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Lock className="text-orange-500" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Workspace Isolation</h3>
                <p className="text-zinc-400 leading-relaxed mb-8">
                  Workflows run in sandboxed environments. Data is encrypted at rest (AES-256) and in transit (TLS 1.3).
                </p>
              </div>

              {/* Visual Element: Code/Encryption */}
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 backdrop-blur-sm font-mono text-[10px] text-zinc-500">
                 <div className="flex items-center gap-2 mb-2 text-zinc-400">
                    <Terminal size={12} />
                    <span>encrypt_stream.sh</span>
                 </div>
                 <div className="space-y-1">
                    <p><span className="text-purple-400">const</span> cipher = <span className="text-blue-400">"AES-256-GCM"</span>;</p>
                    <p><span className="text-purple-400">const</span> hash = <span className="text-yellow-600">"SHA-256"</span>;</p>
                    <p className="text-green-500/80 mt-2"> Secure Connection Established</p>
                 </div>
              </div>
            </div>
          </SpecCard>

        </div>
      </div>
    </section>
  );
};

// Reusable Card Wrapper with Hover Effects
const SpecCard = ({ children, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, delay }}
      className="group relative p-8 md:p-10 rounded-3xl bg-zinc-900/30 border border-white/10 hover:border-orange-500/30 transition-all duration-500 backdrop-blur-sm overflow-hidden min-h-[420px] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
    >
      {/* Hover Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute -right-10 -top-10 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none group-hover:translate-x-0" />
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};


const CTASection = () => {
  return (
    <section className="relative py-32 overflow-hidden flex flex-col items-center justify-center border-t border-white/10 bg-[#020202]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />

      <div className="relative z-10 text-center px-4 max-w-3xl">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Ready to deploy the <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Intelligence Layer?</span>
        </h2>
        
        <p className="text-xl text-zinc-400 mb-10">
          Start with the tools you already use and let Gaprio coordinate the rest.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <button className="h-14 px-8 rounded-full bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Get Started <ArrowRight size={20} />
          </button>
          <button className="h-14 px-8 rounded-full bg-zinc-900 text-white border border-zinc-800 font-bold text-lg hover:bg-zinc-800 transition-colors flex items-center gap-2">
             <Globe size={20} className="text-zinc-500" />Explore Integrations
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
      <CoreFeatures /> {/* <--- ADDED HERE */}
      <UnifiedGrid />
      <NeuralArchitecture />
      <EnterpriseSpecs />
      <CTASection />
    </main>
  );
};

export default FeaturesPage;