'use client';

import React from 'react';
import { Quote, ArrowUpRight, ExternalLink } from 'lucide-react';

// Updated Theme Color
const THEME_ORANGE = '#F97316';

// 1. Data Structure
const sourcesData = [
  {
    id: 1,
    title: "Digital Fatigue: How Fragmented Tools Are Hurting Your Team",
    publisher: "Haiilo",
    context: "Problem Statement: Impact of tool switching",
    url: "https://blog.haiilo.com/blog/digital-fatigue-how-fragmented-tools-are-hurting-your-team/"
  },
  {
    id: 2,
    title: "Statistics About Time Wasted at Work",
    publisher: "Hubstaff",
    context: "Problem Statement: Productivity loss data",
    url: "https://hubstaff.com/blog/wasted-time-at-work/#:~:text=Statistics%20about%20time%20wasted%20at%20work,-Even%20if%20you&text=The%20average%20worker%20is%20only,time%20is%20actually%20spent%20productively."
  },
  {
    id: 3,
    title: "The Cost of Poor Communication in Business",
    publisher: "The Chimney Rock Chronicle",
    context: "Problem Statement: Financial impact analysis",
    url: "https://thechimneyrockchronicle.com/the-cost-of-poor-communication/"
  }
];

export default function SourcesPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#F97316] selection:text-white">
      
      {/* Container matched to Financial Page (max-w-5xl) */}
      <div className="max-w-5xl mx-auto px-6 pt-40 pb-10">
        
        {/* Header Section */}
        <div className="mb-20 border-b border-zinc-800 pb-10">
            <div className="flex items-center gap-2 text-[#F97316] mb-4">
                <Quote size={20} className="rotate-180" />
                <span className="text-xs font-mono tracking-widest uppercase">
                    Citations & References
                </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                Data Sources
            </h1>
            
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light leading-relaxed">
                The research, statistical foundations, and market analysis cited throughout our problem statement and pitch.
            </p>
        </div>

        {/* The List */}
        <div className="space-y-0">
          <div className="mb-8">
            <h3 className="text-sm text-zinc-500 font-mono uppercase tracking-widest">
                External Links
            </h3>
          </div>

          <div className="border-t border-zinc-900">
            {sourcesData.map((source) => (
                <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block py-8 border-b border-zinc-900 hover:bg-zinc-900/20 transition-all px-2 -mx-2 rounded-lg"
                >
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 md:gap-8">
                    
                    {/* Title Section */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between md:justify-start gap-4 mb-2">
                            <h3 className="text-xl md:text-2xl font-medium text-zinc-300 group-hover:text-white transition-colors">
                            {source.title}
                            </h3>
                            {/* Mobile Arrow */}
                            <ArrowUpRight className="w-6 h-6 text-zinc-600 group-hover:text-[#F97316] transition-colors shrink-0 md:hidden" />
                        </div>
                        
                        {/* Context Label */}
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]"></span>
                            <p className="text-sm text-[#F97316] font-mono uppercase tracking-wider">
                                {source.context}
                            </p>
                        </div>
                    </div>

                    {/* Dotted Line Spacer (Desktop Only) */}
                    <div className="hidden md:block flex-1 border-b border-zinc-800 border-dotted relative -top-2 mx-8 opacity-40"></div>

                    {/* Publisher & Icon (Desktop) */}
                    <div className="flex items-center gap-4 shrink-0">
                        <span className="text-base font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-widest">
                            {source.publisher}
                        </span>
                        {/* Desktop Arrow */}
                        <div className="hidden md:flex w-10 h-10 rounded-full border border-zinc-800 items-center justify-center group-hover:border-[#F97316] group-hover:bg-[#F97316] transition-all duration-300">
                             <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-black transition-colors" />
                        </div>
                    </div>

                </div>
                </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}