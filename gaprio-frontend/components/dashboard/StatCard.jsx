'use client';
import { ArrowUpRight } from 'lucide-react';

export default function StatCard({ label, value, icon: Icon, color, bg, trend, sub }) {
    return (
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-3xl hover:border-white/20 transition-all hover:-translate-y-1 shadow-lg group relative overflow-hidden">
            
            {/* Background Glow */}
            <div className={`absolute -right-4 -top-4 w-20 h-20 ${bg} blur-[40px] opacity-50 group-hover:opacity-100 transition-opacity`} />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-2.5 rounded-xl ${bg} ${color} border border-white/5`}>
                    <Icon size={20} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                        <ArrowUpRight size={10} /> {trend}
                    </div>
                )}
            </div>
            
            <div className="relative z-10">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
                <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
            </div>
        </div>
    );
}