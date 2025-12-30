'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Zap, Brain, Share2, ShieldCheck, 
  MessageSquare, Layout, CheckCircle, 
  ArrowRight, Globe, Lock, Cpu, 
  Workflow, Database, Command, Search,
  Terminal, Code2, GitBranch, Server
} from 'lucide-react';

// --- DATA: INTEGRATION DEEP DIVE ---
const integrations = [
  {
    id: 'slack',
    name: 'Slack',
    logo: '/companylogo/slack.png',
    title: 'The Nerve Center',
    desc: 'Turn Slack into a CLI for your business. Gaprio listens for intent (e.g., "Schedule demo") and triggers complex, multi-step workflows without leaving the chat interface.',
    tech: 'Webhook / Socket Mode',
    stat: '<12ms Latency'
  },
  {
    id: 'jira',
    name: 'Jira Software',
    logo: '/companylogo/jira.png',
    title: 'Velocity Automator',
    desc: 'Gaprio links Git commits to Jira tickets automatically. No more manual status updates. It predicts sprint velocity based on historical code churn and team capacity.',
    tech: 'REST API v3',
    stat: 'Auto-State Sync'
  },
  {
    id: 'google',
    name: 'Google Workspace',
    logo: '/companylogo/google.webp',
    title: 'Semantic Context',
    desc: 'We index every Drive document and Email into a private vector database. Ask "What was the budget for Q3?" and Gaprio retrieves the exact cell from a Sheet.',
    tech: 'Vector Embeddings',
    stat: '100% Recall'
  },
  {
    id: 'asana',
    name: 'Asana',
    logo: '/companylogo/asana.png',
    title: 'Dependency Graph',
    desc: 'Visualizes cross-team blockers. If Design (Asana) is delayed, Gaprio automatically shifts the Engineering timeline (Jira) and alerts the PM (Slack).',
    tech: 'Graph API',
    stat: 'Real-time Sync'
  },
  {
    id: 'zoho',
    name: 'Zoho One',
    logo: '/companylogo/zoho.png',
    title: 'Revenue Operations',
    desc: 'Closes the loop between Sales and Product. Won deals in Zoho trigger automated onboarding sequences, ensuring zero hand-off friction.',
    tech: 'Deluge Script',
    stat: 'Zero Data Loss'
  },
  {
    id: 'microsoft',
    name: 'Microsoft 365',
    logo: '/companylogo/microsoft.webp',
    title: 'Legacy Bridge',
    desc: 'Unlocks data trapped in Excel and SharePoint. Gaprio acts as a translation layer, making legacy enterprise data accessible to modern AI agents.',
    tech: 'Graph API',
    stat: 'Enterprise Ready'
  },
  {
    id: 'clickup',
    name: 'ClickUp',
    logo: '/companylogo/clickup.png',
    title: 'Unified Task Layer',
    desc: 'Acts as the single source of truth for task execution. Gaprio consolidates tasks from 5+ platforms into one personalized ClickUp view.',
    tech: 'REST API v2',
    stat: 'Bi-directional'
  },
  {
    id: 'miro',
    name: 'Miro',
    logo: '/companylogo/miro.png',
    title: 'Visual Intelligence',
    desc: 'Parses whiteboards for actionable items. It reads sticky notes from a retrospective and converts them instantly into Jira tickets.',
    tech: 'OCR / Vision',
    stat: '99% Accuracy'
  }
];

// --- 1. HERO SECTION (TERMINAL VISUALIZATION) ---
const FeatureHero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-[#020202] text-white pt-32 pb-20 overflow-hidden border-b border-white/5">
      
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/10 via-[#020202] to-[#020202]" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03]" />

      <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Gaprio Core v2.4</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Operating System</span> <br/> for Enterprise Work.
          </h1>

          <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-lg">
            Stop stitching tools together with Zapier. Gaprio provides a single, intelligent layer that understands context, executes code, and orchestrates your entire stack.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-500 transition-all shadow-[0_0_30px_rgba(234,88,12,0.3)] flex items-center justify-center gap-2">
              <Terminal size={18} /> Initialize System
            </button>
            <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-lg font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              Read Docs <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* Right: The Code/Terminal Interface */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Glowing Backlight */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-purple-500/20 blur-2xl opacity-50" />
          
          <div className="relative bg-[#0a0a0a] rounded-xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Window Controls */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0f0f0f]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="text-xs text-zinc-600 font-mono flex items-center gap-2">
                <Server size={10} /> gaprio_orchestrator.rs
              </div>
            </div>

            {/* Code Content */}
            <div className="p-6 font-mono text-xs md:text-sm leading-relaxed overflow-hidden">
              <div className="space-y-1">
                <div className="flex">
                  <span className="text-zinc-600 w-8 select-none">01</span>
                  <span className="text-purple-400">async fn</span> <span className="text-blue-400">main</span>() {'{'}
                </div>
                <div className="flex">
                  <span className="text-zinc-600 w-8 select-none">02</span>
                  <span className="pl-4 text-zinc-400">// Initialize Neural Layer</span>
                </div>
                <div className="flex">
                  <span className="text-zinc-600 w-8 select-none">03</span>
                  <span className="pl-4 text-purple-400">let</span> stack = <span className="text-yellow-400">Gaprio</span>::<span className="text-blue-400">connect</span>([
                </div>
                <div className="flex">
                  <span className="text-zinc-600 w-8 select-none">04</span>
                  <span className="pl-8 text-green-400">"Slack"</span>, <span className="text-green-400">"Jira"</span>, <span className="text-green-400">"Asana"</span>, <span className="text-green-400">"Zoho"</span>
                </div>
                <div className="flex">
                  <span className="text-zinc-600 w-8 select-none">05</span>
                  <span className="pl-4">]).<span className="text-blue-400">await</span>?;</span>
                </div>
                <div className="flex">
                  <span className="text-zinc-600 w-8 select-none">06</span>
                </div>
                <div className="flex">
                  <span className="text-zinc-600 w-8 select-none">07</span>
                  <span className="pl-4 text-zinc-400">// Listen for triggers</span>
                </div>
                <div className="flex">
                  <span className="text-zinc-600 w-8 select-none">08</span>
                  <span className="pl-4">stack.<span className="text-blue-400">on</span>(<span className="text-green-400">"client_request"</span>, |ctx| {'{'}</span>
                </div>
                <div className="flex bg-orange-500/10 border-l-2 border-orange-500">
                  <span className="text-zinc-600 w-8 select-none">09</span>
                  <span className="pl-8 text-orange-300">let context = ctx.rag_search("pricing_v3.pdf");</span>
                </div>
                <div className="flex bg-orange-500/10 border-l-2 border-orange-500">
                  <span className="text-zinc-600 w-8 select-none">10</span>
                  <span className="pl-8 text-orange-300">ctx.execute_workflow("draft_proposal", context);</span>
                </div>
                <div className="flex">
                  <span className="text-zinc-600 w-8 select-none">11</span>
                  <span className="pl-4">{'}'});</span>
                </div>
                <div className="flex">
                  <span className="text-zinc-600 w-8 select-none">12</span>
                  <span className="text-green-500">➜ System Ready. Listening on port 8000...</span>
                  <span className="animate-pulse w-2 h-4 bg-orange-500 ml-1 block" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

// --- 2. INTEGRATION DEEP DIVE (EXPANDED CARDS) ---
const UnifiedStack = () => {
  return (
    <section className="py-24 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-3">The Unified Stack</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Connected Intelligence.</h3>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Gaprio doesn't just display data; it acts on it. Review the capabilities enabled by our deep API integrations.
          </p>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrations.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-orange-500/40 transition-all duration-300 flex flex-col h-full"
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

              {/* Top: Logo & Tech */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="w-12 h-12 bg-[#151515] rounded-lg border border-white/5 flex items-center justify-center p-2 group-hover:bg-[#202020] transition-colors">
                  <Image 
                    src={tool.logo} 
                    alt={tool.name} 
                    width={32} 
                    height={32} 
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-zinc-500 font-mono">{tool.tech}</span>
                  <span className="text-[10px] font-bold text-green-500">{tool.stat}</span>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex-1">
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-orange-100 transition-colors">{tool.title}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-4 min-h-[80px]">
                  {tool.desc}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors relative z-10">
                <span className="font-mono">STATUS: ACTIVE</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

// --- 3. WORKFLOW ENGINE (CODE BLOCK STYLE) ---
const WorkflowEngine = () => {
  const steps = [
    { id: "01", title: "Signal Ingestion", desc: "Passive monitoring of webhooks from Slack, Gmail, and CRM.", icon: Zap },
    { id: "02", title: "RAG Context", desc: "Vector search across millions of documents for relevance.", icon: Database },
    { id: "03", title: "LLM Planning", desc: "Chain-of-thought reasoning to formulate an execution plan.", icon: Brain },
    { id: "04", title: "Atomic Execution", desc: "Transaction-safe API calls to write data back to tools.", icon: CheckCircle }
  ];

  return (
    <section className="py-24 bg-[#020202] text-white border-y border-white/5 relative">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Diagram */}
          <div className="relative bg-[#0a0a0a] rounded-xl border border-white/10 p-8 shadow-2xl">
            <div className="absolute top-0 right-0 p-32 bg-orange-600/5 blur-[80px]" />
            
            <div className="space-y-6 relative z-10">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${i === 3 ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-zinc-900 border-white/10 text-zinc-500'}`}>
                      <step.icon size={14} />
                    </div>
                    {i !== 3 && <div className="w-[1px] h-8 bg-zinc-800 my-1" />}
                  </div>
                  <div className="pb-6">
                    <h4 className={`text-sm font-bold ${i === 3 ? 'text-green-400' : 'text-white'}`}>{step.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Text */}
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
              <Code2 className="text-orange-500" size={20} />
              <h2 className="text-orange-500 font-mono text-sm tracking-widest uppercase">System Architecture</h2>
            </div>
            <h3 className="text-4xl font-bold mb-6">Deterministic AI.<br/> Not Chatbots.</h3>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              We don't build "chatbots" that guess. We build **Agentic Workflows** that follow strict logic paths. 
              Gaprio uses RAG (Retrieval Augmented Generation) to ground every decision in your company's actual data, ensuring 99.9% reliability.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0a0a0a] p-4 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">12ms</div>
                <div className="text-xs text-zinc-500 font-mono">Response Latency</div>
              </div>
              <div className="bg-[#0a0a0a] p-4 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">AES-256</div>
                <div className="text-xs text-zinc-500 font-mono">Encryption Standard</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// --- 4. ENTERPRISE SPECS ---
const EnterpriseSpecs = () => {
  return (
    <section className="py-24 bg-[#050505] text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="group p-8 border border-white/5 bg-[#0a0a0a] rounded-2xl hover:border-orange-500/30 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-[50px] group-hover:bg-orange-500/20 transition-all" />
            <ShieldCheck size={32} className="text-orange-500 mb-6" />
            <h3 className="text-lg font-bold mb-3">Full-Trust Security</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              SOC2 Type II compliant. We utilize strict data isolation, ensuring your proprietary data never leaves your VPC.
            </p>
          </div>

          <div className="group p-8 border border-white/5 bg-[#0a0a0a] rounded-2xl hover:border-orange-500/30 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-[50px] group-hover:bg-blue-500/20 transition-all" />
            <GitBranch size={32} className="text-blue-500 mb-6" />
            <h3 className="text-lg font-bold mb-3">Version Control</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Every action taken by the AI is logged, versioned, and reversible. Full audit trails for compliance.
            </p>
          </div>

          <div className="group p-8 border border-white/5 bg-[#0a0a0a] rounded-2xl hover:border-orange-500/30 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 blur-[50px] group-hover:bg-green-500/20 transition-all" />
            <Cpu size={32} className="text-green-500 mb-6" />
            <h3 className="text-lg font-bold mb-3">Edge Compute</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Gaprio runs on distributed edge nodes close to your data centers, minimizing latency for global teams.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

// --- 5. CTA ---
const FeatureCTA = () => {
  return (
    <section className="py-32 bg-black relative overflow-hidden flex flex-col items-center justify-center text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/10 via-black to-black" />
      
      <div className="relative z-10 px-4 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
          Ready to deploy the <br/> <span className="text-orange-500">Neural Layer?</span>
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-4 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-500 transition-all shadow-[0_0_30px_rgba(234,88,12,0.3)] flex items-center justify-center gap-2">
            <Terminal size={18} /> Initialize Gaprio
          </button>
          <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-lg font-bold hover:bg-white/10 transition-all">
            Contact Engineering
          </button>
        </div>
        <div className="mt-12 flex items-center justify-center gap-8 opacity-50 grayscale">
           {/* You can add partner logos here if needed, or keep it clean */}
        </div>
      </div>
    </section>
  );
};

// --- MAIN PAGE LAYOUT ---
const FeaturesPage = () => {
  return (
    <main className="bg-[#020202] min-h-screen selection:bg-orange-500/30 selection:text-white font-sans">
      <FeatureHero />
      <UnifiedStack />
      <WorkflowEngine />
      <EnterpriseSpecs />
      <FeatureCTA />
    </main>
  );
};

export default FeaturesPage;