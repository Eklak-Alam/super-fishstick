'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
// Make sure you export year1Data, year2Data, and year3Data from your data file
import { year1Data, year2Data, year3Data } from '../../data/expenses'; 

const THEME_ORANGE = '#EA812E';

export default function FinancialPage() {
  // Simple state to toggle between years
  const [activeTab, setActiveTab] = useState('Year 1');
  
  // Map strings to actual data objects
  const dataMap = {
    'Year 1': year1Data,
    'Year 2': year2Data,
    'Year 3': year3Data,
  };

  const currentData = dataMap[activeTab];
  const { meta, economics, periods } = currentData;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#EA812E] selection:text-white">
      
      {/* Container with top margin for Navbar (pt-32 = 8rem space) */}
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        
        {/* 1. Year Tabs (Clean Text) */}
        <div className="flex items-center gap-8 mb-12 border-b border-zinc-900 pb-4 overflow-x-auto no-scrollbar">
          {Object.keys(dataMap).map((year) => (
            <button
              key={year}
              onClick={() => setActiveTab(year)}
              className={`text-sm font-medium tracking-wide uppercase transition-colors whitespace-nowrap ${
                activeTab === year 
                  ? 'text-[#EA812E]' 
                  : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* 2. Header Information */}
        <motion.div 
          key={activeTab} // Re-animate when year changes
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="block text-[#EA812E] text-xs font-mono mb-3 tracking-widest uppercase">
                {meta.duration}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 leading-tight">
                {meta.phase}
              </h1>
            </div>
            
            {/* Net Burn / Profit Highlight */}
            <div className="text-left md:text-right">
              <span className="text-zinc-500 text-xs uppercase tracking-wider block mb-1">
                Net Result
              </span>
              <span className="text-2xl font-mono font-medium text-white border-b-2 border-[#EA812E] pb-1">
                {economics.netBurn}
              </span>
            </div>
          </div>

          {/* Key Metrics Row (Simple Grid) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 mt-12 pt-8 border-t border-zinc-900">
            <StatItem label="Total Expense" value={economics.totalExpense} />
            <StatItem label="Revenue" value={economics.totalRevenue} />
            <StatItem label="User Base" value={economics.saasUsers} />
            <StatItem label="Price / User" value={economics.pricePerUser} />
          </div>
        </motion.div>

        {/* 3. The List (Accordion Style - No Boxes) */}
        <div className="space-y-8">
          {periods.map((period, index) => (
            <PhaseAccordion key={`${activeTab}-${index}`} period={period} defaultOpen={index === 0} />
          ))}
        </div>

      </div>
    </div>
  );
}

// --- Sub-Components ---

function StatItem({ label, value }) {
  return (
    <div>
      <span className="block text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
        {label}
      </span>
      <span className="block text-lg font-medium text-zinc-300">
        {value}
      </span>
    </div>
  );
}

function PhaseAccordion({ period, defaultOpen }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="group border-b border-zinc-900 last:border-0 pb-4">
      
      {/* Minimal Header Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <motion.div 
             animate={{ rotate: isOpen ? 90 : 0 }}
             transition={{ duration: 0.2 }}
          >
             <ArrowRight className={`w-5 h-5 transition-colors ${isOpen ? 'text-[#EA812E]' : 'text-zinc-600'}`} />
          </motion.div>
          
          <div>
            <h3 className={`text-xl font-medium transition-colors ${isOpen ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
              {period.title}
            </h3>
            {/* Show timeline in header only when closed */}
            {!isOpen && <p className="text-xs text-zinc-600 font-mono mt-1">{period.timeline}</p>}
          </div>
        </div>
        
        <span className="font-mono text-zinc-500 text-sm group-hover:text-[#EA812E] transition-colors">
          {period.totalCost}
        </span>
      </button>

      {/* Content Area */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            {/* REMOVED 'pl-9' here so content starts from left */}
            <div className="pt-2 pb-8">
              
              <div className="text-xs text-zinc-500 font-mono mb-8 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EA812E]"></span>
                {period.timeline}
              </div>

              {/* Categories Loop */}
              {period.categories.map((cat, i) => (
                <div key={i} className="mb-10 last:mb-0">
                  <div className="flex items-baseline justify-between mb-4 border-b border-zinc-900 pb-2">
                    <h4 className="text-xs font-bold text-[#EA812E] uppercase tracking-wider">
                      {cat.name}
                    </h4>
                    <span className="text-[10px] text-zinc-600 font-mono">
                      SUBTOTAL: {cat.total}
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {cat.items.map((item, j) => (
                      <li key={j} className="flex justify-between items-end text-sm group/item">
                        <span className="text-zinc-400 group-hover/item:text-zinc-200 transition-colors">
                          {item.label}
                        </span>
                        
                        {/* The dotted line filler */}
                        <div className="flex-1 mx-4 border-b border-zinc-900 border-dotted opacity-30 relative top-[-4px]"></div>
                        
                        <span className="text-zinc-500 font-mono group-hover/item:text-white transition-colors">
                          {item.cost}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}