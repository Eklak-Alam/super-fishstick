'use client';

import React from 'react';
import { ExternalLink, Quote, ArrowUpRight } from 'lucide-react';

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
      
      {/* Container with top margin for Navbar */}
      <div className="max-w-3xl mx-auto px-6 pt-40 pb-10">
        
        {/* Header */}
        <header className="mb-16 border-l-2 border-[#F97316] pl-6 py-2">
          <div className="flex items-center gap-2 text-[#F97316] mb-2">
            <Quote size={16} className="rotate-180" />
            <span className="text-xs font-mono tracking-widest uppercase">References</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
            Data Sources
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl">
            Research and statistical foundations cited in our problem statement.
          </p>
        </header>

        {/* The List */}
        <div className="space-y-0">
          {sourcesData.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-6 border-b border-zinc-900 hover:border-zinc-800 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 md:gap-8">
                
                {/* Title Section */}
                <div className="flex-1">
                  <div className="flex items-start justify-between md:justify-start gap-4 mb-1">
                    <h3 className="text-lg font-medium text-zinc-300 group-hover:text-white transition-colors">
                      {source.title}
                    </h3>
                    {/* Mobile Arrow */}
                    <ArrowUpRight className="w-5 h-5 text-zinc-700 group-hover:text-[#F97316] transition-colors shrink-0 md:hidden" />
                  </div>
                  
                  {/* Context Label (updated color) */}
                  <p className="text-xs text-[#F97316] font-mono mt-1">
                    {source.context}
                  </p>
                </div>

                {/* Dotted Line Spacer (Desktop Only) */}
                <div className="hidden md:block flex-1 border-b border-zinc-900 border-dotted relative -top-1 mx-4"></div>

                {/* Publisher & Icon (Desktop) */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors uppercase tracking-wider">
                    {source.publisher}
                  </span>
                  {/* Desktop Arrow (updated hover color) */}
                  <ArrowUpRight className="hidden md:block w-4 h-4 text-zinc-700 group-hover:text-[#F97316] transition-colors" />
                </div>

              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}