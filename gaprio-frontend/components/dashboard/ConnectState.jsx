import { Plus } from 'lucide-react';

export default function ConnectState({ icon: Icon, title, onClick }) {
    return (
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-zinc-800 border-dashed rounded-xl bg-zinc-950/50">
            
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 text-zinc-500">
                <Icon size={28} strokeWidth={1.5} />
            </div>

            <h2 className="text-lg font-semibold text-zinc-100 mb-2">{title}</h2>
            <p className="text-zinc-400 mb-8 max-w-sm text-sm">
                Connect your account to sync your workspace data and view it directly within this dashboard.
            </p>

            <button 
                onClick={onClick} 
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
            >
                <Plus size={16} /> 
                <span>Connect Account</span>
            </button>
            
        </div>
    )
}