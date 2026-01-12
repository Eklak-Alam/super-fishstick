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
  FileText
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
    <section className="relative min-h-[90vh] lg:pt-44 pt-32 flex flex-col items-center justify-start pb-32 overflow-hidden">
      <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-orange-600/20 blur-[150px] rounded-[100%]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[50vh] bg-violet-900/20 blur-[180px] rounded-[100%]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-[0.04]" />

      {/* --- Dynamic Backgrounds --- */}
      {/* 1. Base Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#ffffff03_1px,transparent_1px),linear-gradient(to_right,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />

      {/* 2. Orange Hero Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-600/20 blur-[120px] rounded-full opacity-50 z-0 pointer-events-none mix-blend-screen" />

      <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center relative">
        {/* --- Text Content --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[1.05] max-w-5xl mx-auto drop-shadow-2xl">
            The Operating System <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-300 to-amber-500">
              for Enterprise Work.
            </span>
          </h1>

          <p className="text-md md:text-lg text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Stop stitching tools together with fragile workflows. Gaprio adds a
            single intelligent layer that understands context, coordinates
            actions, and orchestrates work across your entire stack.
          </p>

          <div className="flex flex-row items-center justify-center gap-3 sm:gap-5 mb-16 sm:mb-24 w-full max-w-md sm:max-w-none">
            <button
              suppressHydrationWarning={true}
              className="
            group relative h-12 px-8 rounded-3xl
            bg-gradient-to-t from-orange-600 to-orange-500 
            hover:from-orange-500 hover:to-orange-600 cursor-pointer
            border border-orange-400/20
            text-white font-medium text-sm tracking-wide
            flex items-center justify-center gap-2
            w-full sm:w-auto min-w-[160px]
            transition-all duration-300 ease-out
        "
            >
              <span>Initialize System</span>
              <ArrowRight
                size={16}
                className="text-orange-100 group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
            <div className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] w-full sm:w-auto min-w-[160px] cursor-pointer group">
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

        {/* --- FLOATING DASHBOARD IMAGE --- */}
        <motion.div
          initial={{ opacity: 0, y: 80, rotateX: 25 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.3,
            type: "spring",
            stiffness: 60,
            damping: 25,
          }}
          className="w-full max-w-6xl relative perspective-1000 group z-20 mx-auto px-4"
        >
          <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-orange-500/30 via-purple-500/20 to-blue-500/20 blur-2xl sm:blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-700 will-change-[opacity]" />

          {/* FIX APPLIED HERE:
              1. Removed h-[35vw], min-h, max-h.
              2. Added aspect-video (16/9 ratio). This keeps the box shape consistent on all zooms.
          */}
          <div className="relative w-full aspect-[20/10] rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-900/80 p-2 sm:p-3 shadow-2xl backdrop-blur-md transition-all duration-500 ease-out group-hover:scale-[1.01] group-hover:-translate-y-2 group-hover:shadow-orange-500/10 group-hover:border-white/20">
            <div className="relative w-full h-full overflow-hidden rounded-lg sm:rounded-[14px] bg-zinc-950 ring-1 ring-white/5 flex items-center justify-center">
              <img
                src="/dashboard.png"
                alt="Gaprio Dashboard Interface"
                // object-contain: shows full image
                // object-center: keeps it centered
                className="w-full h-full object-contain object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none mix-blend-overlay" />
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
    <section className="relative py-24 bg-[#050201]">
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

// ... [KEEP YOUR EXISTING "NeuralArchitecture", "EnterpriseSpecs", "SpecCard", "CTASection"] ...

const NeuralArchitecture = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: "Ingest and Organize",
      desc: "Gaprio listens to connected tools, normalizing chaotic streams into a structured event log.",
      icon: Database,
    },
    {
      id: 1,
      title: "Semantic Understanding",
      desc: "The AI analyzes context, linking user queries to relevant documents and past conversations.",
      icon: Brain,
    },
    {
      id: 2,
      title: "Action Planning",
      desc: "Complex requests are broken down into a step-by-step logic chain before any action is taken.",
      icon: GitBranch,
    },
    {
      id: 3,
      title: "Controlled Execution",
      desc: "Actions are executed in a sandboxed environment with full audit trails and rollback capabilities.",
      icon: ShieldCheck,
    }
  ];

  // --- RIGHT SIDE CONTENT (THE VISUALS) ---
  const renderVisual = () => {
    switch (activeStep) {
      case 0: // Ingest
        return (
          <div className="space-y-4">
             <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-4 border-b border-white/5 pb-2">
                <span>INCOMING_STREAM</span>
                <span className="text-green-500 flex items-center gap-1"><Activity size={10} /> ACTIVE</span>
             </div>
             {/* Mock Items */}
             {[
               { icon: MessageSquare, src: "Slack", txt: "Marketing Channel: Q4 updates...", time: "now" },
               { icon: FileText, src: "Notion", txt: "Doc: Product Requirements v2", time: "2ms ago" },
               { icon: Zap, src: "Linear", txt: "Issue #492 created", time: "15ms ago" },
             ].map((item, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900/50 border border-white/5"
               >
                 <div className="p-2 bg-zinc-800 rounded-md text-zinc-400"><item.icon size={16} /></div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                       <span className="text-xs font-bold text-white">{item.src}</span>
                       <span className="text-[10px] text-zinc-600 font-mono">{item.time}</span>
                    </div>
                    <div className="text-xs text-zinc-500 truncate">{item.txt}</div>
                 </div>
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
               </motion.div>
             ))}
          </div>
        );

      case 1: // Understanding
        return (
          <div className="h-full flex flex-col justify-center">
            <div className="bg-zinc-900/50 rounded-xl border border-white/10 p-4 mb-6">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                     <Search size={16} />
                  </div>
                  <div className="text-sm text-white">"Find the Q3 budget report"</div>
               </div>
               <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-orange-500/50" 
                  />
               </div>
            </div>

            <div className="space-y-2">
               <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Vector Matches Found</div>
               <div className="flex items-center gap-3 p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                  <div className="text-xs font-mono text-green-500">98% Match</div>
                  <div className="text-xs text-zinc-300">Finance_Q3_Overview.pdf</div>
               </div>
               <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-zinc-900/20 opacity-60">
                  <div className="text-xs font-mono text-zinc-500">45% Match</div>
                  <div className="text-xs text-zinc-400">Q3_Team_Outing.png</div>
               </div>
            </div>
          </div>
        );

      case 2: // Planning
        return (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
             {[
               { title: "Identify Intent", status: "complete", detail: "Search Query" },
               { title: "Check Permissions", status: "complete", detail: "User: Admin" },
               { title: "Formulate Response", status: "processing", detail: "Summarizing Data..." }
             ].map((step, i) => (
                <div key={i} className="relative">
                   <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 ${step.status === 'processing' ? 'border-orange-500 bg-black animate-pulse' : 'border-green-500 bg-green-500'}`} />
                   <div className="p-3 rounded-lg border border-white/10 bg-zinc-900/40">
                      <div className="flex items-center justify-between mb-1">
                         <span className="text-sm font-bold text-white">{step.title}</span>
                         {step.status === 'complete' && <CheckCircle2 size={14} className="text-green-500" />}
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">{step.detail}</span>
                   </div>
                </div>
             ))}
          </div>
        );

      case 3: // Execution
        return (
          <div className="h-full flex flex-col">
             <div className="flex items-center justify-center py-8">
                <div className="relative">
                   <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                   <ShieldCheck size={64} className="text-green-500 relative z-10" />
                </div>
             </div>
             <div className="bg-black/50 rounded-lg p-4 font-mono text-[10px] text-zinc-400 border border-white/5 flex-1 overflow-hidden">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                   <Lock size={10} /> Secure Sandbox Active
                </div>
                <div className="space-y-1 opacity-70">
                   <p>{`> Initiating secure handshake...`}</p>
                   <p>{`> Validating API tokens... OK`}</p>
                   <p>{`> Encrypting payload (AES-256)...`}</p>
                   <p className="text-white">{`> POST /api/v1/execute`}</p>
                   <p className="text-green-400">{`> 200 OK - Action Completed`}</p>
                   <p>{`> Writing to audit log...`}</p>
                </div>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <section className="pt-24 pb-10 border-y border-white/5 relative bg-[#050201]">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="mb-16">
          <h2 className="text-orange-500 font-mono text-sm tracking-widest uppercase mb-3">Under the Hood</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white">Intelligence, Explained</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT SIDE: Navigation */}
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

          {/* RIGHT SIDE: Visual Content */}
          <div className="lg:col-span-7">
            <div className="relative h-full min-h-[400px] bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/5">
                 <div className="flex gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                   <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                   <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                 </div>
                 <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">
                   System_Visualizer
                 </div>
                 <div className="w-8" />
              </div>

              {/* Window Body */}
              <div className="relative flex-1 bg-[#050505] p-6 lg:p-8 overflow-hidden flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {renderVisual()}
                  </motion.div>
                </AnimatePresence>
                
                {/* Background Grid Pattern */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] z-0" />
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