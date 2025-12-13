'use client';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

export default function Hero() {
  return (
    // Background: A very deep, warm carbon black (almost undetectable red tint)
    <section className="relative lg:py-40 pt-24 pb-12 w-full flex flex-col items-center justify-center bg-[#050201] overflow-hidden">
      
      {/* --- Cinematic Background Mesh --- */}
      {/* 1. Grid: Very subtle, warm tint */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:30px_30px] opacity-[0.06] bg-fixed" />
      
      {/* 2. Primary Glow (Top Center): "Solar Flare" (Orange/Amber) */}
      <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-orange-600/20 blur-[150px] rounded-[100%] pointer-events-none" />
      
      {/* 3. Secondary Glow (Bottom Right): Deep Violet for contrast/depth */}
      <div className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[50vh] bg-violet-900/20 blur-[180px] rounded-[100%] pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-4xl mt-10">
        
        {/* Badge: Crisp Amber Border */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-900/10 backdrop-blur-md shadow-[0_0_15px_rgba(249,115,22,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[11px] font-bold text-orange-200 tracking-widest uppercase font-mono">
              System v2.0 Live
            </span>
          </div>
        </motion.div>

        {/* Headline: Metallic Silver melting into Molten Gold */}
        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-white mb-8 leading-[1.05]">
          Orchestrate your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-200 to-amber-500">
            Digital Nervous System.
          </span>
        </h1>

        {/* Subtext: Warm Gray */}
        <p className="text-base text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          Gaprio is the AI layer that sits above Slack, Asana, and Microsoft 365. 
          It connects your tools, automates context, and eliminates busywork.
        </p>

        {/* Buttons: High Impact */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Primary: Pure White text on Orange Gradient Button */}
          <Button className="h-12 px-8 text-base bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white border-0 shadow-[0_0_30px_rgba(234,88,12,0.3)] transition-all">
            Start Free Trial
          </Button>
          
          {/* Secondary: Glassy with Amber Tint */}
          <Button variant="outline" className="h-12 px-8 text-base border-white/10 bg-white/5 hover:bg-white/10 hover:border-orange-500/30 text-white transition-all">
            View Documentation
          </Button>
        </motion.div>
      </div>
    </section>
  );
}