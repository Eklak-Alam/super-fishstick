'use client';
import { motion } from 'framer-motion';
import StatCard from './StatCard';

export default function OverviewTab({ user, googleData, slackData }) {
    const isGoogle = user.connections?.some(c => c.provider === 'google');
    const isSlack = user.connections?.some(c => c.provider === 'slack');
    const activeCount = (isGoogle ? 1 : 0) + (isSlack ? 1 : 0);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-white">Welcome back, {user.full_name.split(' ')[0]} 👋</h1>
            <p className="text-zinc-400 mb-10">Your AI command center is active.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Active Connections" value={activeCount} />
                <StatCard label="Emails Processed" value={googleData.emails?.length || 0} />
                <StatCard label="Active Slack Channels" value={slackData.channels?.length || 0} />
            </div>
        </motion.div>
    );
}