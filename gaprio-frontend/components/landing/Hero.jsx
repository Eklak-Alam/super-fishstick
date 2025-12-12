'use client';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center bg-[#020202] overflow-hidden">
      
      {/* --- Standard Enterprise Background --- */}
      {/* 1. Subtle Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:30px_30px] opacity-[0.08]" />
      
      {/* 2. Static Aurora Mesh (No mouse movement) */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-purple-600/20 blur-[150px] rounded-[100%] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vh] bg-blue-600/10 blur-[120px] rounded-[100%] pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-4xl mt-10">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
            <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">Gaprio Enterprise 2.0</span>
          </div>
        </motion.div>

        {/* Headline - Clean & Tight */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
          Orchestrate your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-blue-300">
            Digital Nervous System.
          </span>
        </h1>

        {/* Subtext - Readable width */}
        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Gaprio is the AI layer that sits above Slack, Asana, and Microsoft 365. 
          It connects your tools, automates context, and eliminates busywork.
        </p>

        {/* Buttons - Standard Size */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button className="h-12 px-8 text-base bg-white text-black hover:bg-gray-100 border-0">
            Start Free Trial
          </Button>
          <Button variant="outline" className="h-12 px-8 text-base border-white/10 hover:bg-white/5 text-white">
            View Documentation
          </Button>
        </motion.div>
      </div>
    </section>
  );
}