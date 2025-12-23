export default function StatCard({ label, value }) {
    return (
        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl hover:border-orange-500/20 transition-colors">
            <p className="text-zinc-500 text-sm font-medium mb-2">{label}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    )
}