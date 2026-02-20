'use client';
import { ArrowUpRight } from 'lucide-react';

export default function StatCard({ label, value, trend, sub }) {
    return (
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl hover:border-orange-500/50 transition-colors group flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <p className="text-zinc-400 text-xs font-medium">{label}</p>
                {trend && (
                    <div className="flex items-center gap-1 text-[11px] font-medium text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                        <ArrowUpRight size={14} /> {trend}
                    </div>
                )}
            </div>
            
            <div>
                <p className="text-3xl font-semibold text-zinc-100 tracking-tight">{value}</p>
                {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
            </div>
        </div>
    );
}