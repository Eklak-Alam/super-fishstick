'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const ProblemSection = () => {
  const [activeId, setActiveId] = useState('slack');
  const [isMobile, setIsMobile] = useState(false);

  // --- 1. Detect Mobile Device ---
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const items = [
    {
      id: 'slack',
      title: "Slack",
      subtitle: "Comms",
      desc: "Critical context is buried in threads, disconnected from work.",
      imgSrc: "/companylogo/slack.png",
      color: "from-orange-950/40" 
    },
    {
      id: 'jira',
      title: "Jira",
      subtitle: "Dev",
      desc: "Tickets sit isolated. Developers don't see the business 'why'.",
      imgSrc: "/companylogo/jira.png",
      color: "from-blue-950/40"
    },
    {
      id: 'asana',
      title: "Asana",
      subtitle: "Tasks",
      desc: "Projects move forward, but the context stays behind in comments.",
      imgSrc: "/companylogo/asana.png",
      color: "from-orange-900/40"
    },
    {
      id: 'google',
      title: "Google",
      subtitle: "Docs",
      desc: "Documentation rots in folders that nobody has visited in months.",
      imgSrc: "/companylogo/google.webp",
      color: "from-red-950/40"
    },
    {
      id: 'ms365',
      title: "MS 365",
      subtitle: "Suite",
      desc: "SharePoint mazes where key decisions go to hide forever.",
      imgSrc: "/companylogo/microsoft.webp",
      color: "from-blue-900/40"
    },
    {
      id: 'clickup',
      title: "ClickUp",
      subtitle: "All-in-one",
      desc: "Features everywhere, but clarity is nowhere to be found.",
      imgSrc: "/companylogo/clickup.png",
      color: "from-purple-950/40"
    },
    {
      id: 'zoho',
      title: "Zoho",
      subtitle: "CRM",
      desc: "Data silos that require manual export/import to connect.",
      imgSrc: "/companylogo/zoho.png",
      color: "from-yellow-950/40"
    },
    {
      id: 'miro',
      title: "Miro",
      subtitle: "Ideation",
      desc: "Great ideas stay on the board and never turn into tracked tasks.",
      imgSrc: "/companylogo/miro.png",
      color: "from-yellow-900/40"
    },
  ];

  // --- 2. CLICK Handler ---
  const handleCardClick = (id, e) => {
    if (activeId === id) return;
    setActiveId(id);

    // Auto-scroll logic for mobile only
    if (window.innerWidth < 768) {
        const element = e.currentTarget;
        setTimeout(() => {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
        }, 300);
    }
  };

  // --- 3. HOVER Handler (Desktop Only) ---
  const handleMouseEnter = (id) => {
    if (!isMobile) {
      setActiveId(id);
    }
  };

  return (
    <section className="w-full py-12 md:py-24 bg-[#020202] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
       {/* --- Header (Responsive & Premium) --- */}
        <div className="relative mb-12 md:mb-24 flex flex-col items-center text-center z-10 px-4 md:px-0">

          {/* 1. Background Glow (Adjusted for Mobile/Desktop) */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[250px] h-[120px] md:w-[600px] md:h-[200px] bg-orange-600/20 blur-[80px] md:blur-[100px] rounded-full pointer-events-none mix-blend-screen" />

          {/* 3. Main Title */}
          <h2 className="relative z-10 text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[1.05]">
            Your ecosystem is
            {/* Mobile break for emphasis */}
            <span className="block md:inline"> </span>
            <span className="block mt-1 md:mt-0 text-transparent bg-clip-text bg-gradient-to-b from-orange-400 via-orange-500 to-orange-800 drop-shadow-sm">
              Disconnected.
            </span>
          </h2>

          {/* 4. Subtitle Paragraph */}
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-5 md:mt-8 text-neutral-400 text-base sm:text-lg md:text-xl max-w-sm md:max-w-2xl mx-auto font-light leading-relaxed"
          >
            Tools don't talk to each other. <br className="block md:hidden" />
            <span className="text-white font-medium">You are the bridge.</span>
          </motion.p>
          
        </div>

        {/* --- Kinetic Shutter Component --- */}
        <div className="flex flex-col md:flex-row w-full h-auto md:h-[500px] gap-3">
          {items.map((item) => {
            const isActive = activeId === item.id;
            
            return (
              <motion.div
                key={item.id}
                layout 
                onClick={(e) => handleCardClick(item.id, e)}
                onMouseEnter={() => handleMouseEnter(item.id)}
                transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
                className={clsx(
                  "relative group cursor-pointer overflow-hidden rounded-xl border transition-all duration-500",
                  "shrink-0 w-full md:w-auto",

                  // --- BORDER COLOR CHANGE ---
                  // Active: Orange Border
                  // Inactive: White/10 Border (Subtle glass edge)
                  isActive 
                    ? "h-[400px] md:h-auto md:flex-[5] border-orange-500/50" 
                    : "h-[70px] md:h-auto md:flex-[1] border-white/5 hover:border-white/10"
                )}
              >
                
                {/* --- 1. Background Image (The Ghost) --- */}
                <div 
                   className="absolute inset-0 flex items-start justify-center pt-20 overflow-hidden pointer-events-none"
                >
                    <div className={clsx(
                        "absolute inset-0 z-10 bg-gradient-to-b transition-opacity duration-500 ease-in-out",
                        isActive ? `opacity-90 ${item.color} via-[#050505] to-black` : "opacity-0"
                    )} />

                    <div className={clsx(
                        "relative z-0 w-full h-full flex justify-center transition-all duration-700 ease-out",
                        isActive ? "scale-100 opacity-100" : "scale-50 opacity-0 -translate-y-10"
                    )}>
                       <img 
                          src={item.imgSrc} 
                          alt=""
                          className="w-[50%] h-auto object-contain opacity-50 grayscale"
                        />
                    </div>
                </div>

                {/* --- 2. Inactive Background (NEW INTERESTING GRADIENT) --- */}
                {/* We replaced the old orange-900/10 with a "Dark Metallic/Glass" gradient */}
                <div className={clsx(
                    "absolute inset-0 bg-gradient-to-b from-[#1f1f1f] to-[#0a0a0a] transition-opacity duration-500",
                    isActive ? "opacity-0" : "opacity-100"
                )} />

                {/* Optional: Add a top 'shine' to inactive cards to make them pop */}
                <div className={clsx(
                    "absolute inset-0 bg-gradient-to-b from-white/5 to-transparent h-1/2 transition-opacity duration-500",
                    isActive ? "opacity-0" : "opacity-100"
                )} />

                {/* --- 3. Active Content --- */}
                <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-end z-20">
                    
                    <motion.div
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{ 
                            duration: isActive ? 0.4 : 0, 
                            delay: isActive ? 0.2 : 0 
                        }}
                        className={clsx("flex flex-col h-full justify-end", !isActive && "hidden")}
                    >
                        <div className="mb-auto">
                           <span className="text-orange-400 font-mono text-[10px] md:text-xs uppercase tracking-wider bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20">
                             {item.subtitle}
                           </span>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/5">
                                <img src={item.imgSrc} alt="" className="w-4 h-4 md:w-5 md:h-5 object-contain" />
                            </div>
                            <h3 className="text-2xl md:text-4xl font-bold text-white leading-none whitespace-nowrap">
                                {item.title}
                            </h3>
                        </div>

                        <p className="text-neutral-400 text-sm md:text-lg leading-relaxed max-w-md line-clamp-3 md:line-clamp-none">
                           {item.desc}
                        </p>
                    </motion.div>
                </div>

                {/* --- 4. Inactive State UI --- */}
                
                {/* Desktop: Vertical Text + IMG (FIXED: Removed grayscale) */}
                <div 
                  className={clsx(
                    "hidden md:flex absolute inset-0 items-center justify-center transition-opacity duration-300",
                    isActive ? "opacity-0" : "opacity-100 delay-100"
                  )}
                >
                   <div className="flex items-center gap-3 -rotate-90">
                      {/* FIXED: Removed grayscale, increased opacity to 80% */}
                      <img src={item.imgSrc} className="w-5 h-5 opacity-80 object-contain" alt="" />
                      <p className="text-neutral-400 font-bold text-xs tracking-[0.2em] uppercase whitespace-nowrap">
                        {item.title}
                      </p>
                   </div>
                </div>

                {/* Mobile: Horizontal Strip (FIXED: Removed grayscale) */}
                <div 
                  className={clsx(
                    "md:hidden absolute inset-0 flex items-center px-5 transition-opacity duration-200",
                    isActive ? "opacity-0" : "opacity-100"
                  )}
                >
                    <div className="flex items-center gap-4 w-full">
                        {/* Box for icon */}
                        <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                           {/* FIXED: Removed grayscale here too */}
                           <img src={item.imgSrc} alt="" className="w-5 h-5 opacity-100 object-contain" />
                        </div>
                        <span className="text-neutral-200 font-bold text-base uppercase tracking-wider">
                           {item.title}
                        </span>
                        <div className="ml-auto opacity-30 text-white">
                           <ArrowUpRight size={16} />
                        </div>
                    </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* --- Footer (Optimized Status Bar) --- */}
        {/* <div className="mt-20 border-t border-white/5 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
               
               <p className="text-lg text-neutral-500 font-light">
                  The Result: <span className="text-white font-medium">Time, clarity, and accountability are <span className="text-red-500">lost</span>.</span>
               </p>

               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Critical Error Detected
               </div>

            </div>
        </div> */}

      </div>
    </section>
  );
};

export default ProblemSection;