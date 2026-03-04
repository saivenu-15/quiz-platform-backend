import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, Plus, Users, TrendingUp, Play, Loader2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import api from '../context/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joinCode, setJoinCode] = useState('');
    const [loadingCode, setLoadingCode] = useState(false);
    const [error, setError] = useState('');

    const [stats, setStats] = useState([
        { label: 'Quizzes Created', value: '0', icon: BookOpen, color: 'blue', key: 'quizzes' },
        { label: 'Total Players', value: '0', icon: Users, color: 'emerald', key: 'participants' },
        { label: 'Best Score', value: 'N/A', icon: Trophy, color: 'amber', key: 'bestScore' },
        { label: 'Completion Rate', value: '—', icon: TrendingUp, color: 'purple', key: 'completion' },
    ]);

    const handleJoinByCode = async () => {
        if (joinCode.length !== 6) return;
        setLoadingCode(true);
        setError('');
        try {
            const { data } = await api.get(`/api/quizzes/code/${joinCode}`);
            navigate(`/quiz/${data.data._id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid code');
        } finally {
            setLoadingCode(false);
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch quizzes created by the user
                const { data } = await api.get('/api/quizzes/user/me');
                setQuizzes(data.data || []);

                const quizCount = data.count || 0;
                setStats(prev => prev.map(stat => {
                    if (stat.key === 'quizzes') return { ...stat, value: quizCount.toString() };
                    return stat;
                }));
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const colorClasses = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
        emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
        amber: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-vh-60">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
                >
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">
                            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0] || 'User'}</span> 👋
                        </h1>
                        <p className="text-slate-400 mt-1">Manage your sessions and create new challenges.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            to="/quizzes/create"
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Create Quiz
                        </Link>
                    </div>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: My Quizzes */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">My Active Quizzes</h2>
                            <Link to="/quizzes" className="text-sm text-blue-400 hover:underline">View All</Link>
                        </div>

                        {quizzes.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {quizzes.slice(0, 5).map((quiz, idx) => (
                                    <motion.div
                                        key={quiz._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="glass-card p-4 flex items-center justify-between group hover:border-blue-500/50 transition-all cursor-pointer"
                                        onClick={() => navigate(`/quiz/${quiz._id}`)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                <Zap size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{quiz.title}</h3>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                    <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 uppercase tracking-tighter">{quiz.category}</span>
                                                    <span>{quiz.questions?.length || 0} Questions</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 text-right">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Join Code</div>
                                            <div className="text-lg font-display font-black text-blue-400 tracking-tighter tabular-nums leading-none">
                                                {quiz.joinCode}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-10 text-center border-dashed">
                                <BookOpen className="text-slate-600 mx-auto mb-3" size={32} />
                                <p className="text-slate-400 text-sm">No quizzes found. Start by creating one!</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Quick Join & Stats */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 border-blue-500/20 bg-blue-500/5">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Zap size={14} className="text-blue-400" />
                                Quick Join
                            </h3>
                            <div className="relative mb-3">
                                <input
                                    type="text"
                                    placeholder="6-digit code..."
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white font-display font-bold outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                                />
                                <button
                                    onClick={handleJoinByCode}
                                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all active:scale-95"
                                >
                                    Join
                                </button>
                            </div>
                            {error && <p className="text-[10px] text-red-500 pl-1">{error}</p>}
                            <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
                                Enter a join code provided by a host to participate in a live session.
                            </p>
                        </div>

                        <div className="glass-card p-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Quick Insights</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Completion rate</span>
                                    <span className="text-white font-bold">—</span>
                                </div>
                                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full w-[10%]"></div>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-4">
                                    <span className="text-slate-400">Avg. participants</span>
                                    <span className="text-white font-bold">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
