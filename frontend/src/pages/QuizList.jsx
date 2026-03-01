import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import QuizCard from '../components/QuizCard';
import api from '../context/AuthContext';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const { data } = await api.get('/api/quizzes', {
                    params: { search, category }
                });
                setQuizzes(data.data);
            } catch (err) {
                console.error('Error fetching quizzes:', err);
                // Fallback for demo/restricted environments
                setQuizzes([{
                    _id: 'demo',
                    title: 'Ultimate Frontend Challenge',
                    description: 'Test your knowledge on modern frontend technologies like React and Tailwind.',
                    category: 'Technology',
                    difficulty: 'Intermediate',
                    timeLimit: 1,
                    participants: 124,
                    questions: []
                }]);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchQuizzes();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, category]);

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">Explore Quizzes</h1>
                        <p className="text-slate-400 mt-1">Challenge yourself with quizzes from the community.</p>
                    </div>
                    <Link to="/quizzes/create" className="btn-primary flex items-center gap-2 self-start">
                        <Plus size={18} />
                        Create Quiz
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or description..."
                            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative w-full sm:w-48">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <select
                            className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 appearance-none transition-all"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="" className="bg-slate-800">All Categories</option>
                            <option value="technology" className="bg-slate-800">Technology</option>
                            <option value="science" className="bg-slate-800">Science</option>
                            <option value="history" className="bg-slate-800">History</option>
                            <option value="general" className="bg-slate-800">General</option>
                        </select>
                    </div>
                </div>

                {/* Quiz Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="glass-card h-[280px] animate-pulse bg-white/5"></div>
                        ))}
                    </div>
                ) : quizzes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes.map((quiz, index) => (
                            <QuizCard key={quiz._id} quiz={quiz} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-20 text-center">
                        <BookOpen className="text-slate-600 mx-auto mb-4" size={48} />
                        <h3 className="text-xl font-bold text-white">No quizzes found</h3>
                        <p className="text-slate-500">Try adjusting your search or category filters.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default QuizList;
