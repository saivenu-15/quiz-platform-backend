import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, LayoutDashboard, BookOpen, Trophy, LogOut, Plus, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const stats = [
        { label: 'Quizzes Created', value: '0', icon: BookOpen, color: 'blue' },
        { label: 'Total Players', value: '0', icon: Users, color: 'emerald' },
        { label: 'Best Score', value: 'N/A', icon: Trophy, color: 'amber' },
        { label: 'Completion Rate', value: '—', icon: TrendingUp, color: 'purple' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-dark-lighter border-r border-white/5 flex flex-col shrink-0">
                <div className="p-6 border-b border-white/5">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                            <Zap className="text-white fill-white" size={20} />
                        </div>
                        <span className="text-xl font-display font-bold text-white">Quiz<span className="text-blue-500">Pulse</span></span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {[
                        { label: 'Dashboard', icon: LayoutDashboard, active: true, to: '/dashboard' },
                        { label: 'My Quizzes', icon: BookOpen, to: '/dashboard/quizzes' },
                        { label: 'Leaderboard', icon: Trophy, to: '/dashboard/leaderboard' },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${item.active
                                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 text-sm font-semibold transition-all"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
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
                            to="/dashboard/quizzes/create"
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
                                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-3`}>
                                    <stat.icon className={`text-${stat.color}-400`} size={20} />
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
                        <Link to="/dashboard/quizzes/create" className="btn-primary inline-flex items-center gap-2">
                            <Plus size={18} />
                            Create Your First Quiz
                        </Link>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
