import React from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, Users, Zap, Search, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const [joinCode, setJoinCode] = React.useState('');
    const [loadingCode, setLoadingCode] = React.useState(false);
    const [error, setError] = React.useState('');

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

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0f172a]">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-lg">
                        <Zap className="text-white fill-white" size={24} />
                    </div>
                    <span className="text-2xl font-display font-bold text-white tracking-tight">Quiz<span className="text-blue-500">Pulse</span></span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-slate-400 font-medium">
                    <Link to="/quizzes" className="hover:text-blue-400 transition-colors">Explore</Link>
                    <Link to="/quizzes" className="hover:text-blue-400 transition-colors">How it Works</Link>
                    <Link to="/leaderboard" className="hover:text-blue-400 transition-colors">Leaderboards</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-slate-300 font-semibold hover:text-white transition-colors">Sign In</Link>
                    <Link to="/register" className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-white/20 transition-all active:scale-95">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-8 pt-20 pb-32">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Next-Gen Learning Experience
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-extrabold text-white leading-[1.1] mb-6 md:mb-8">
                            Elevate Your <span className="text-gradient">Knowledge</span> in Real-Time
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-8 md:mb-10 max-w-lg">
                            The only platform that combines competitive gaming mechanics with deep learning. Join thousands of creators and learners worldwide.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <Link to="/quizzes/create" className="btn-primary flex items-center justify-center gap-3 group">
                                Create a Quiz
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            {/* Join with Code Input */}
                            <div className="relative group flex-1 max-w-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Zap size={18} className="text-blue-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit code..."
                                    maxLength={6}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-32 text-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleJoinByCode()}
                                />
                                <button
                                    onClick={handleJoinByCode}
                                    disabled={loadingCode || joinCode.length !== 6}
                                    className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-blue-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95"
                                >
                                    {loadingCode ? '...' : 'Join Game'}
                                </button>
                                {error && <p className="absolute -bottom-6 left-0 text-xs text-red-500">{error}</p>}
                            </div>
                        </div>

                        <div className="mt-12 flex items-center gap-8">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0f172a] bg-slate-800 flex items-center justify-center text-xs text-white">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-[#0f172a] bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                                    +2k
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 italic">
                                Join <span className="text-slate-300 font-semibold">2,400+</span> active players right now
                            </p>
                        </div>
                    </motion.div>

                    {/* Featured Quizzes / Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="hidden lg:block relative"
                    >
                        <div className="glass-card p-8 relative overflow-hidden border-2 border-white/5">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white">Featured Challenges</h3>
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                                        <Search size={18} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: "Quantum Physics Masters", icon: "⚛️", players: 432, color: "blue" },
                                    { title: "React Performance optimization", icon: "⚡", players: 128, color: "emerald" },
                                    { title: "World History: 20th Century", icon: "🌍", players: 856, color: "amber" }
                                ].map((quiz, i) => (
                                    <Link to="/quizzes" key={i} className="group p-4 flex items-center gap-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                                        <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                            {quiz.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{quiz.title}</h4>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                                                <span className="flex items-center gap-1.5"><Users size={14} /> {quiz.players}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                                <span className="flex items-center gap-1.5 text-blue-400 font-medium tracking-wide text-[10px] uppercase">Join Now</span>
                                            </div>
                                        </div>
                                        <Play className="text-slate-600 group-hover:text-blue-400" size={20} />
                                    </Link>
                                ))}
                            </div>

                            {/* Stats Overlay */}
                            <div className="absolute -bottom-4 -left-4 glass-card p-6 bg-blue-600/10 backdrop-blur-2xl border-blue-500/20 shadow-2xl skew-x-3 rotate-3 transform transition-transform hover:rotate-0 hover:skew-x-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/40">
                                        <Trophy size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">$12,450</div>
                                        <div className="text-xs text-blue-400 font-semibold uppercase tracking-widest">Prize Pool Today</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Soft decorative light behind the card */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-2xl -z-10 opacity-50"></div>
                    </motion.div>
                </div>
            </main>

            {/* How it Works / Features Section */}
            <section id="how-it-works" className="max-w-7xl mx-auto px-8 py-32 border-t border-white/5">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-display font-bold text-white mb-4">How It <span className="text-blue-500">Works</span></h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">Experience a seamless flow from discovery to mastery in just three simple steps.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[
                        { title: "Choose a Challenge", desc: "Browse thousands of community-created quizzes across any topic you can imagine.", icon: BookOpen, color: "blue" },
                        { title: "Real-Time Play", desc: "Compete against players worldwide with live score updates and instant feedback.", icon: Zap, color: "emerald" },
                        { title: "Rise the Ranks", desc: "Earn points, unlock badges, and see your name on the global leaderboards.", icon: Trophy, color: "amber" }
                    ].map((step, i) => (
                        <div key={i} className={`glass-card p-6 md:p-8 flex flex-col items-center text-center group hover:bg-white/[0.07] transition-all ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-${step.color}-500/10 flex items-center justify-center text-${step.color}-400 mb-5 md:mb-6 group-hover:scale-110 transition-transform`}>
                                <step.icon size={28} className="md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{step.title}</h3>
                            <p className="text-sm md:text-base text-slate-400 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-5xl mx-auto px-6 md:px-8 py-16 md:py-20">
                <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-blue-500/20">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 md:mb-6">Ready to Start Your Journey?</h2>
                        <p className="text-base md:text-lg text-slate-400 mb-8 md:mb-10 max-w-xl mx-auto">Join a community of learners and creators who are pushing the boundaries of interactive education.</p>
                        <Link to="/register" className="btn-primary inline-flex items-center gap-3 w-full sm:w-auto">
                            Get Started for Free
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                    {/* Decorative Background for CTA */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 bg-dark/20 text-center md:text-left">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-2">
                            <Zap className="text-blue-500" size={24} />
                            <span className="text-xl font-display font-bold text-white">QuizPulse</span>
                        </div>
                        <p className="text-sm text-slate-500 max-w-xs">Empowering creators and learners with next-gen interactive challenges.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        <Link to="/quizzes" className="hover:text-white transition-colors">Explore</Link>
                        <Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">Discord</a>
                    </div>

                    <p className="text-sm text-slate-600">
                        &copy; 2024 QuizPulse.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
