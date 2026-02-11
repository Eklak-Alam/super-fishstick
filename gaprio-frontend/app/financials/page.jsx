'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
// Ensure these are exported correctly from your data file
import { year1Data, year2Data, year3Data } from '../../data/expenses'; 

const THEME_ORANGE = '#EA812E';

export default function FinancialPage() {
  const [activeTab, setActiveTab] = useState('Year 1');
  
  const dataMap = {
    'Year 1': year1Data,
    'Year 2': year2Data,
    'Year 3': year3Data,
  };

  const currentData = dataMap[activeTab];
  const { meta, economics, periods } = currentData;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#EA812E] selection:text-white">
      
      {/* Container */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-32">
        
        {/* 1. Year Tabs */}
        <div className="flex items-center gap-10 mb-16 border-b border-zinc-800 pb-4">
          {Object.keys(dataMap).map((year) => (
            <button
              key={year}
              onClick={() => setActiveTab(year)}
              className={`text-base md:text-lg font-medium tracking-widest uppercase transition-colors ${
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
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-20"
        >
          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-800 pb-10">
            <div>
              <span className="block text-[#EA812E] text-sm font-mono mb-3 tracking-widest uppercase">
                {meta.duration}
              </span>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                {meta.phase}
              </h1>
            </div>
            
            {/* Net Burn Highlight (UPDATED: Added Negative Sign) */}
            <div className="text-left md:text-right">
              <span className="text-zinc-500 text-xs uppercase tracking-wider block mb-2">
                Net Result
              </span>
              <span className="text-4xl md:text-5xl font-mono font-medium text-white border-b-2 border-[#EA812E] pb-1">
                - {economics.netBurn}
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pt-10">
            <StatItem label="Total Expense" value={economics.totalExpense} highlight={true} />
            <StatItem label="Revenue" value={economics.totalRevenue} />
            <StatItem label="SaaS USERS" value={economics.saasUsers} />
            <StatItem label="Price / User" value={economics.pricePerUser} />
          </div>
        </motion.div>

        {/* 3. The List (Accordion) */}
        <div className="space-y-0">
          <div className="mb-8">
            <h3 className="text-sm text-zinc-500 font-mono uppercase tracking-widest">
                Detailed Breakdown
            </h3>
          </div>
          {periods.map((period, index) => (
            <PhaseAccordion key={`${activeTab}-${index}`} period={period} defaultOpen={index === 0} />
          ))}
        </div>

      </div>
    </div>
  );
}

// --- Sub-Components ---

function StatItem({ label, value, highlight }) {
  return (
    <div>
      <span className="block text-xs text-zinc-500 uppercase tracking-widest mb-3">
        {label}
      </span>
      <span className={`block text-3xl md:text-4xl font-medium ${highlight ? 'text-white' : 'text-zinc-300'}`}>
        {value}
      </span>
    </div>
  );
}

function PhaseAccordion({ period, defaultOpen }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-zinc-900 last:border-b">
      
      {/* Header Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-8 text-left focus:outline-none group hover:bg-zinc-900/30 transition-colors px-2 -mx-2 rounded-lg"
      >
        <div className="flex items-center gap-6">
          <motion.div 
             animate={{ rotate: isOpen ? 90 : 0 }}
             transition={{ duration: 0.2 }}
             className={`text-zinc-500 group-hover:text-[#EA812E] transition-colors`}
          >
             <ArrowRight size={24} />
          </motion.div>
          
          <div>
            <h3 className="text-2xl md:text-3xl font-medium text-white group-hover:text-zinc-200 transition-colors">
              {period.title}
            </h3>
            {/* Subtitle visible when closed */}
            {!isOpen && <p className="text-sm text-zinc-600 font-mono mt-2">{period.timeline}</p>}
          </div>
        </div>
        
        <span className="font-mono text-zinc-400 text-xl md:text-2xl group-hover:text-white transition-colors">
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Removed pl-padding here to align full left */}
            <div className="pb-12 pt-2">
              
              <div className="text-sm text-[#EA812E] font-mono mb-8 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#EA812E]"></span>
                {period.timeline}
              </div>

              {/* Categories */}
              <div className="space-y-10">
                {period.categories.map((cat, i) => (
                  <div key={i}>
                    {/* Category Header & Subtotal */}
                    <div className="flex items-baseline justify-between mb-4 border-b border-zinc-800 pb-3">
                      <h4 className="text-base md:text-lg font-bold text-white uppercase tracking-wider">
                        {cat.name}
                      </h4>
                      {/* Increased Subtotal Size */}
                      <span className="text-sm md:text-base text-zinc-400 font-mono">
                        SUB: <span className="text-white">{cat.total}</span>
                      </span>
                    </div>

                    {/* List Items */}
                    <ul className="space-y-4">
                      {cat.items.map((item, j) => (
                        <li key={j} className="flex justify-between items-end text-lg md:text-xl group/item">
                          <span className="text-zinc-400 group-hover/item:text-zinc-200 transition-colors">
                            {item.label}
                          </span>
                          
                          {/* Dotted Filler */}
                          <div className="flex-1 mx-6 border-b border-zinc-800 border-dotted opacity-30 relative top-[-6px]"></div>
                          
                          <span className="text-zinc-500 font-mono group-hover/item:text-[#EA812E] transition-colors">
                            {item.cost}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}