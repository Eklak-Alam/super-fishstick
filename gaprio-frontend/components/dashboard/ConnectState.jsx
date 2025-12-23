import { Plus } from 'lucide-react';

export default function ConnectState({ icon: Icon, title, onClick }) {
    return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Icon size={32} className="text-zinc-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">{title}</h2>
            <p className="text-zinc-400 mb-8 max-w-md">Connect your account to enable automation.</p>
            <button onClick={onClick} className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-lg shadow-white/10">
                <Plus size={18} /> Connect Account
            </button>
        </div>
    )
}