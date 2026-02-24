import React from 'react';
import { Trophy, Medal, Star, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';

const Leaderboard = () => {
    // Mock data for the demo leaderboard
    const leaders = [
        { name: "QuizMaster_99", score: 12500, quizzes: 45, rank: 1, avatar: "M" },
        { name: "CodeNinja", score: 11200, quizzes: 38, rank: 2, avatar: "C" },
        { name: "ScienceWhiz", score: 9800, quizzes: 32, rank: 3, avatar: "S" },
        { name: "HistoryBuff", score: 8500, quizzes: 28, rank: 4, avatar: "H" },
        { name: "BinaryBrain", score: 7200, quizzes: 25, rank: 5, avatar: "B" },
    ];

    const stats = [
        { label: "Total Participants", value: "2.4k+", icon: Users, color: "text-blue-400" },
        { label: "Average Score", value: "78%", icon: Star, color: "text-yellow-400" },
        { label: "Quizzes Taken", value: "15k+", icon: TrendingUp, color: "text-emerald-400" },
    ];

    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto p-8">
                <div className="mb-10 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    >
                        <Trophy className="text-blue-400" size={32} />
                    </motion.div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2">Global Leaderboard</h1>
                    <p className="text-slate-400">See where you stand among the best quiz takers in the world.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="glass-card p-6">
                            <stat.icon size={24} className={`${stat.color} mx-auto mb-3`} />
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Leaderboard Table */}
                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                        <span className="text-sm font-bold text-white uppercase tracking-widest">Rankings</span>
                        <span className="text-xs text-slate-500 font-semibold tracking-wider">Top 5 Players</span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {leaders.map((player, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-8 text-center font-display font-bold ${idx === 0 ? "text-yellow-400" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-amber-600" : "text-slate-600"
                                        }`}>
                                        {idx === 0 ? <Medal size={24} className="mx-auto" /> : idx === 1 ? <Medal size={24} className="mx-auto" /> : idx === 2 ? <Medal size={24} className="mx-auto" /> : `#${idx + 1}`}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                            {player.avatar}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold">{player.name}</div>
                                            <div className="text-xs text-slate-500">{player.quizzes} Quizzes Completed</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-display font-bold text-blue-400">{player.score.toLocaleString()}</div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Points</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Leaderboard;
