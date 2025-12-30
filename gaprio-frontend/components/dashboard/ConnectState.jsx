import { Plus, Lock } from 'lucide-react';

export default function ConnectState({ icon: Icon, title, onClick }) {
    return (
        <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-6">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent blur-xl rounded-full opacity-50" />
                <div className="relative w-20 h-20 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon size={32} className="text-zinc-400 group-hover:text-white transition-colors" />
                    
                    {/* Floating Badge */}
                    <div className="absolute -top-2 -right-2 bg-zinc-800 p-1.5 rounded-lg border border-zinc-700 shadow-lg">
                        <Lock size={12} className="text-orange-500" />
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
            <p className="text-zinc-400 mb-8 max-w-sm text-sm leading-relaxed">
                Connect your account to unlock real-time data sync, automation features, and unified control.
            </p>

            <button 
                onClick={onClick} 
                className="group relative px-8 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all overflow-hidden"
            >
                <span className="relative z-10 flex items-center gap-2">
                    <Plus size={16} /> Connect Account
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
        </div>
    )
}