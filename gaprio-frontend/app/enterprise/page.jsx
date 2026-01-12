'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Server, Cloud, Lock, ShieldCheck, 
  Cpu, ArrowRight, CheckCircle2, 
  Network, Database, Terminal, User,
  Brain, Layers, Clock, Zap, Building2,
  Globe, Fingerprint, FileKey, Activity,
  Search, GitBranch, AlertCircle,
  AlertTriangle,
  BookOpen
} from 'lucide-react';

// --- 1. HERO SECTION: THE NERVE CENTER ---
const EnterpriseHero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center bg-[#020202] text-white lg:pt-44 pt-32 pb-10 lg:pb-20 overflow-hidden border-b border-white/5">
      
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-[#020202] to-[#020202]" />
        <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-orange-600/20 blur-[150px] rounded-[100%]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[50vh] bg-violet-900/20 blur-[180px] rounded-[100%]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-[0.04]" />

      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            The Cognitive Layer for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-200 to-amber-500">
              Global Enterprises.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Bridge the gap between disconnected systems. Gaprio provides <span className="text-white font-semibold">Shared Memory</span> and <span className="text-white font-semibold">Reasoning</span> across tools like Outlook, Teams, Salesforce, and Jira.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
          >
            <button
                          suppressHydrationWarning={true} // <--- THIS LINE FIXES THE ERROR
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
                          Book Architecture Review
                          <ArrowRight
                            size={16}
                            className="text-orange-100 group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </button>
            <div
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] w-full sm:w-auto min-w-[160px] cursor-pointer group"
            >
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
                View Security Specs
                <BookOpen
                  size={16}
                  className="text-zinc-600 group-hover:text-orange-500 transition-colors duration-300"
                />
              </span>
            </div>
          </motion.div>
        </div>

        {/* Hero Dashboard Visual */}
        {/* <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 relative max-w-6xl mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-b from-orange-500/10 to-transparent rounded-t-3xl blur-2xl" />
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-t-3xl shadow-2xl overflow-hidden border-b-0">
            <div className="h-12 bg-[#111] border-b border-white/5 flex items-center justify-between px-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700/50" />
                <div className="w-3 h-3 rounded-full bg-zinc-700/50" />
                <div className="w-3 h-3 rounded-full bg-zinc-700/50" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-black rounded border border-white/5 text-[10px] font-mono text-zinc-500">
                <Lock size={10} /> gaprio-enterprise-core
              </div>
              <div className="w-16" />
            </div>

            <div className="p-8 grid grid-cols-12 gap-6 h-[400px] bg-[#050505]">
              <div className="hidden md:block col-span-3 space-y-4">
                <div className="bg-[#111] rounded-xl p-4 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-3">Active Contexts</div>
                  <div className="space-y-2">
                    {['Project Alpha', 'Q4 Financials', 'Legal Audit', 'HR Policy'].map(i => (
                      <div key={i} className="flex items-center gap-3 text-sm text-zinc-300 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {i}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#111] rounded-xl p-4 border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-zinc-400">Memory Usage</span>
                    <span className="text-xs text-green-400 font-mono">14TB</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-[60%] h-full bg-gradient-to-r from-orange-600 to-orange-400" />
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-9 bg-[#0a0a0a] rounded-xl border border-white/5 relative overflow-hidden flex flex-col items-center justify-center p-8">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-[#050505] border border-orange-500/50 flex items-center justify-center shadow-[0_0_60px_rgba(249,115,22,0.15)] relative">
                    <Brain className="text-white" size={40} />
                    <div className="absolute inset-0 border border-orange-500 rounded-full animate-ping opacity-20" />
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-white font-bold text-lg">Gaprio Neural Core</div>
                    <div className="text-zinc-500 text-xs font-mono mt-1">Processing 42k Events/Sec</div>
                  </div>
                </div>

                <div className="absolute w-full h-full">
                  <div className="absolute top-10 left-10 bg-[#151515] px-4 py-2 rounded-lg border border-white/10 text-xs text-zinc-300 flex gap-2 items-center">
                    <Globe size={14} className="text-blue-500" /> Salesforce
                  </div>
                  <div className="absolute bottom-10 right-10 bg-[#151515] px-4 py-2 rounded-lg border border-white/10 text-xs text-zinc-300 flex gap-2 items-center">
                    <Terminal size={14} className="text-green-500" /> Jira Cloud
                  </div>
                  <div className="absolute top-10 right-20 bg-[#151515] px-4 py-2 rounded-lg border border-white/10 text-xs text-zinc-300 flex gap-2 items-center">
                    <Search size={14} className="text-yellow-500" /> Outlook
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div> */}
      </div>
    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050201] to-transparent z-10 pointer-events-none" />
    </section>
  );
};

// --- 2. THE PROBLEM (HIGH CONTRAST CARDS) ---
const EnterpriseProblem = () => {
  const costs = [
    {
      title: "Context Loss",
      subtitle: "SILENT KILLER",
      desc: "Emails, chats, and CRM updates live in separate systems. No single layer understands how they relate, so critical knowledge stays in people’s heads instead of systems.",
      icon: Network,
      stat: "40%",
      statDesc: "Info lost on turnover"
    },
    {
      title: "Bandwidth Waste",
      subtitle: "OPERATIONAL DRAG",
      desc: "Senior leaders spend time summarizing threads, searching for files, and aligning teams. This is low leverage work done by high leverage people.",
      icon: Clock,
      stat: "12hrs",
      statDesc: "Per week/manager"
    },
    {
      title: "Compliance Exposure",
      subtitle: "GOVERNANCE RISK",
      desc: "When context is missing, incorrect information gets shared and commitments are missed. Audit trails become fragmented and difficult to trust.",
      icon: AlertTriangle,
      stat: "High",
      statDesc: "Audit failure risk"
    },
    {
      title: "Disconnected AI",
      subtitle: "SILOED ROI",
      desc: "Most AI tools work inside one product. Gaprio connects signals across systems so reasoning happens at the organization level.",
      icon: Layers,
      stat: "0%",
      statDesc: "Cross-tool awareness"
    }
  ];

  return (
    <section className="pt-32 lg:pb-10 pb-5 bg-[#020202]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">The Invisible Costs <br/> of Modern Work.</h2>
          <p className="text-zinc-400 max-w-2xl text-lg">
            Large organizations run on many tools, but very little shared understanding. This fragmentation creates four major problems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {costs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl hover:border-orange-500/30 transition-all group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-white/5 rounded-2xl text-white group-hover:text-orange-500 transition-colors">
                  <item.icon size={28} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white leading-none">{item.stat}</div>
                  <div className="text-[10px] text-zinc-500 uppercase font-bold mt-1">{item.statDesc}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-xs font-bold text-orange-500/80 uppercase tracking-wider mb-2 block">{item.subtitle}</span>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
              </div>
              
              <p className="text-sm text-zinc-400 leading-relaxed mt-auto">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- 3. THE SOLUTION (LAYER VISUALIZATION) ---
const EnterpriseSolution = () => {
  return (
    <section className="pt-32 pb-10 bg-[#020202] border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white/5" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
              <Activity className="text-orange-500" size={20}/>
              <span className="text-orange-500 font-mono text-sm uppercase tracking-widest">The Solution</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">A Shared Brain for <br/> Your Organization.</h2>
            <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
              Gaprio sits above your existing stack. It understands documents, conversations, and decisions in relation to each other.
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="mt-1 w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shrink-0">
                  <Brain size={20} className="text-orange-500"/>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">Institutional Memory</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">Gaprio preserves context over time. Decisions, discussions, and rationale remain accessible even when people change roles or leave.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="mt-1 w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shrink-0">
                  <Zap size={20} className="text-orange-500"/>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">Faster Decisions</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">Executives get answers from documents, emails, and systems in minutes instead of days. Teams move forward without repeated clarification.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="mt-1 w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} className="text-orange-500"/>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">Enterprise Control</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">Gaprio follows your access rules. Data visibility matches existing permissions and every AI action is logged and reviewable.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Stack Visualization */}
          <div className="relative">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-12 relative z-10 shadow-2xl">
              
              {/* Stack Item 1 (Users) */}
              <div className="bg-[#151515] border border-white/5 rounded-xl p-4 text-center mb-4">
                <div className="text-xs text-zinc-500 mb-2 font-mono uppercase">Your Team</div>
                <div className="flex justify-center gap-4 text-white opacity-50">
                  <User size={24}/><User size={24}/><User size={24}/>
                </div>
              </div>

              {/* Stack Item 2 (GAPRIO) - Glowing */}
              <div className="bg-orange-600/10 border border-orange-500/50 rounded-xl p-8 text-center mb-4 relative overflow-hidden backdrop-blur-xl">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.1]" />
                <div className="relative z-10">
                  <div className="text-orange-500 font-bold flex items-center justify-center gap-2 mb-2">
                    <Layers size={20}/> Gaprio Cognitive Layer
                  </div>
                  <div className="text-[10px] text-orange-300/70 font-mono tracking-wider">
                    REASONING • MEMORY • CONTEXT
                  </div>
                </div>
              </div>

              {/* Stack Item 3 (Tools) */}
              <div className="bg-[#151515] border border-white/5 rounded-xl p-4">
                <div className="text-xs text-zinc-500 mb-4 text-center font-mono uppercase">Fragmented Data Sources</div>
                <div className="grid grid-cols-4 gap-2">
                  {['Slack', 'Jira', 'Outlook', 'HubSpot'].map(t => (
                    <div key={t} className="bg-[#0a0a0a] border border-white/5 rounded p-2 text-[10px] text-zinc-400 text-center">
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Connector */}
              <div className="absolute inset-y-8 -left-4 w-4 border-l border-t border-b border-orange-500/30 rounded-l-lg" />
              <div className="absolute top-1/2 -left-8 -translate-y-1/2 text-[10px] text-orange-500/50 -rotate-90 whitespace-nowrap font-mono tracking-widest">
                API ORCHESTRATION
              </div>

            </div>
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-600/10 blur-[100px] -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
};

// --- 4. DEPLOYMENT MODELS (VISUAL CARDS) ---
const DeploymentModels = () => {
  return (
    <section className="pt-24 pb-10 bg-[#020202]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Deployment Models</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Security and control requirements vary by organization. Gaprio supports multiple deployment options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 1. SaaS */}
          <motion.div whileHover={{y: -5}} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex flex-col">
            <div className="mb-6 bg-blue-500/10 w-fit p-3 rounded-xl text-blue-500">
              <Cloud size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Cloud SaaS</h3>
            <p className="text-xs font-mono text-zinc-500 mb-6 uppercase tracking-wider">Fastest Adoption</p>
            <p className="text-zinc-400 text-sm mb-8 flex-1">
              Gaprio runs in a managed cloud environment. Teams connect using secure authentication with minimal setup.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-zinc-300">
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500"/> Quick onboarding</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500"/> Managed infrastructure</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-500"/> Continuous updates</li>
            </ul>
            <button className="w-full py-3 border border-white/10 rounded-lg text-white text-sm hover:bg-white/5 transition-colors">Start Pilot</button>
          </motion.div>

          {/* 2. Private Cloud (FEATURED) */}
          <motion.div whileHover={{y: -5}} className="bg-[#0f0f0f] border border-orange-500/50 rounded-2xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(249,115,22,0.1)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-b-lg">MOST COMMON</div>
            <div className="mb-6 bg-orange-500/10 w-fit p-3 rounded-xl text-orange-500">
              <Network size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Private VPC</h3>
            <p className="text-xs font-mono text-zinc-500 mb-6 uppercase tracking-wider">Enterprise Standard</p>
            <p className="text-zinc-400 text-sm mb-8 flex-1">
              Gaprio runs inside your cloud environment. Data stays within your network boundary while we manage the application layer.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-zinc-300">
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-orange-500"/> Data residency control</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-orange-500"/> Custom model configuration</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-orange-500"/> Internal system access</li>
            </ul>
            <button className="w-full py-3 bg-orange-600 rounded-lg text-white text-sm font-bold hover:bg-orange-500 transition-colors">Contact Engineering</button>
          </motion.div>

          {/* 3. On-Prem */}
          <motion.div whileHover={{y: -5}} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex flex-col">
            <div className="mb-6 bg-green-500/10 w-fit p-3 rounded-xl text-green-500">
              <Server size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">On Prem Deployment</h3>
            <p className="text-xs font-mono text-zinc-500 mb-6 uppercase tracking-wider">High Control Environments</p>
            <p className="text-zinc-400 text-sm mb-8 flex-1">
              Designed for regulated industries. Gaprio is deployed on your infrastructure with full operational ownership.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-zinc-300">
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-500"/> Complete data control</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-500"/> Network isolated operation</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-500"/> Compliance aligned architecture</li>
            </ul>
            <button className="w-full py-3 border border-white/10 rounded-lg text-white text-sm hover:bg-white/5 transition-colors">Request Specs</button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};


// --- 5. INTEGRATION ROADMAP (VERTICAL TIMELINE) ---
const IntegrationRoadmap = () => {
  const steps = [
    { title: "Identity Connection", desc: "Integrate with existing identity providers like Azure AD or Okta. Gaprio follows your authentication and access policies.", icon: Fingerprint },
    { title: "Initial Data Sync", desc: "Connect communication and productivity tools in read only mode. Gaprio builds context without affecting live workflows.", icon: Search },
    { title: "Memory Initialization", desc: "Historical activity is indexed to establish organizational context and decision history.", icon: Database },
    { title: "Governance Mode", desc: "AI operates in draft mode. Human approval is required for all actions and detailed logs are enabled.", icon: ShieldCheck },
    { title: "Orchestrated Workflows", desc: "Trusted workflows are enabled selectively. Automation scales where confidence and control are established.", icon: GitBranch }
  ];

  return (
    <section className="pt-24 pb-10 bg-[#020202]">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-white text-center mb-16">The Integration Roadmap</h2>
        
        <div className="relative pl-8 md:pl-0">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Content Box */}
                <div className="flex-1 w-full text-left md:text-right md:group-odd:text-left">
                  <div className={`bg-[#0a0a0a] border border-white/10 p-6 rounded-xl hover:border-orange-500/30 transition-all ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-sm text-zinc-500">{step.desc}</p>
                  </div>
                </div>
                
                {/* Center Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 bg-[#000] border-2 border-orange-500 rounded-full flex items-center justify-center z-10 text-orange-500">
                  <step.icon size={16} />
                </div>
                
                {/* Empty Spacer */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 6. CTA: TERMINAL STYLE ---
const FinalCTA = () => {
  return (
    <section className="pt-32 pb-10 bg-black relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black" />
      
      <div className="relative z-10 container mx-auto px-4 max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl p-12 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          <div className="flex-1 text-center md:text-left">
            <Building2 className="w-12 h-12 text-white mb-6 opacity-50 mx-auto md:mx-0" />
            <h2 className="text-4xl font-bold text-white mb-4">
              odernize How Your <br /> Organization Thinks.
            </h2>
            <p className="text-zinc-400 mb-6">
              Gaprio adds a shared memory layer to your enterprise stack and reduces cognitive load across teams.
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-500 justify-center md:justify-start">
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500"/> SOC2 Ready</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500"/> GDPR Compliant</span>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 w-full">
            <form className="space-y-4 bg-[#111] p-6 rounded-2xl border border-white/5">
              <div>
                <label className="text-xs text-zinc-500 font-mono mb-1 block">WORK EMAIL</label>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition-colors"
                />
              </div>
              <button className="w-full bg-orange-600 text-white font-bold rounded-lg py-3 hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20">
                Book a Demo
              </button>
              <p className="text-[10px] text-center text-zinc-600">
                Deployment typically completes within days. No long term commitment required.
              </p>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

// --- MAIN LAYOUT ---
const EnterprisePage = () => {
  return (
    <main className="bg-[#020202] min-h-screen selection:bg-orange-500/30 selection:text-white font-sans">
      <EnterpriseHero />
      <EnterpriseSolution />
      <DeploymentModels />
      <EnterpriseProblem />
      <IntegrationRoadmap />
      <FinalCTA />
    </main>
  );
};

export default EnterprisePage;