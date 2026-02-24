import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Plus, Users, TrendingUp, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Quizzes Created', value: '0', icon: BookOpen, color: 'blue' },
        { label: 'Total Players', value: '0', icon: Users, color: 'emerald' },
        { label: 'Best Score', value: 'N/A', icon: Trophy, color: 'amber' },
        { label: 'Completion Rate', value: '—', icon: TrendingUp, color: 'purple' },
    ];

    const colorClasses = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
        emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
        amber: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
    };

    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-10"
                >
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">
                            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0] || 'User'}</span> 👋
                        </h1>
                        <p className="text-slate-400 mt-1">Here's what's happening with your quizzes today.</p>
                    </div>
                    <Link
                        to="/quizzes/create"
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={18} />
                        New Quiz
                    </Link>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-5"
                        >
                            <div className={`w-10 h-10 rounded-xl ${colorClasses[stat.color].bg} flex items-center justify-center mb-3`}>
                                <stat.icon className={colorClasses[stat.color].text} size={20} />
                            </div>
                            <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-10 text-center"
                >
                    <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <BookOpen className="text-blue-400" size={32} />
                    </div>
                    <h2 className="text-xl font-display font-bold text-white mb-2">No quizzes yet</h2>
                    <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                        Create your first quiz and share it with the world. It only takes a few minutes!
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link to="/quizzes/create" className="btn-primary inline-flex items-center gap-2">
                            <Plus size={18} />
                            Create Your First Quiz
                        </Link>
                        <Link to="/quiz/demo" className="btn-secondary inline-flex items-center gap-2">
                            <Play size={18} />
                            Try Demo Quiz
                        </Link>
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
