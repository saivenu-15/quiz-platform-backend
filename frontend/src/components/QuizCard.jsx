import React from 'react';
import { motion } from 'framer-motion';
import { Play, Users, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuizCard = ({ quiz, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card group overflow-hidden hover:border-blue-500/30 transition-all"
        >
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {quiz.category === 'Technology' ? '⚡' : quiz.category === 'Science' ? '⚛️' : '🧠'}
                    </div>
                    <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${quiz.difficulty === 'hard' ? 'bg-red-500/10 text-red-400' :
                            quiz.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                                'bg-emerald-500/10 text-emerald-400'
                        }`}>
                        {quiz.difficulty}
                    </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {quiz.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-6">
                    {quiz.description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><Users size={14} /> {quiz.participantCount || 0}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {quiz.timeLimit}m</span>
                    </div>
                    <Link
                        to={`/quiz/${quiz._id}`}
                        className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest hover:text-blue-300"
                    >
                        Play Now
                        <Play size={12} className="fill-current" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default QuizCard;
