import React from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, Users, Zap, Search, ArrowRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-lg">
                        <Zap className="text-white fill-white" size={24} />
                    </div>
                    <span className="text-2xl font-display font-bold text-white tracking-tight">Quiz<span className="text-blue-500">Pulse</span></span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-slate-400 font-medium">
                    <a href="#" className="hover:text-blue-400 transition-colors">Explore</a>
                    <a href="#" className="hover:text-blue-400 transition-colors">How it Works</a>
                    <a href="#" className="hover:text-blue-400 transition-colors">Leaderboards</a>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-slate-300 font-semibold hover:text-white transition-colors">Sign In</button>
                    <button className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-white/20 transition-all active:scale-95">Get Started</button>
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

                        <h1 className="text-6xl md:text-7xl font-display font-extrabold text-white leading-[1.1] mb-8">
                            Elevate Your <span className="text-gradient">Knowledge</span> in Real-Time
                        </h1>

                        <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-lg">
                            The only platform that combines competitive gaming mechanics with deep learning. Join thousands of creators and learners worldwide.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <button className="btn-primary flex items-center justify-center gap-3 group">
                                Create a Quiz
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <button className="relative w-full glass-card h-full px-8 py-3 flex items-center justify-center gap-3 text-white font-semibold">
                                    <Play size={20} className="fill-white" />
                                    Join Game
                                </button>
                            </div>
                        </div>

                        <div className="mt-12 flex items-center gap-8">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-dark bg-slate-800"></div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-dark bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
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
                                    <div key={i} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
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
                                        </div>
                                    </div>
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

            {/* Trust Badges / Quick Stats */}
            <section className="border-t border-white/5 bg-dark/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: "Quizzes Created", val: "50k+" },
                            { label: "Active Players", val: "1.2M" },
                            { label: "Success Rate", val: "99.9%" },
                            { label: "AI Questions", val: "200k" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="text-3xl font-display font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight mb-1">{stat.val}</div>
                                <div className="text-xs text-slate-500 font-semibold uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
