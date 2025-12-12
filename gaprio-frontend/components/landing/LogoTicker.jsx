'use client';
import { motion } from 'framer-motion';

const brands = ["Acme Corp", "Quantum", "Vertex", "Echo", "Nebula", "Cyberdyne", "Oscorp", "Stark Ind"];

export default function LogoTicker() {
  return (
    <section className="py-10 border-y border-white/5 bg-black/50 backdrop-blur-sm">
      <div className="overflow-hidden relative flex">
        <motion.div 
          className="flex gap-20 flex-nowrap whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <span key={i} className="text-xl font-bold text-gray-600 uppercase tracking-widest">{brand}</span>
          ))}
        </motion.div>
        
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#030014] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#030014] to-transparent" />
      </div>
    </section>
  );
}