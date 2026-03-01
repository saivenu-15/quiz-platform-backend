import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ChevronRight, Trophy, ArrowLeft, Users } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import api, { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const QuizPlay = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { socket } = useSocket();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [liveLeaderboard, setLiveLeaderboard] = useState([]);
    const timerRef = useRef(null);

    // Socket room joining and notifications
    useEffect(() => {
        if (socket && id && user) {
            socket.emit('joinQuiz', { quizId: id, username: user.name });

            socket.on('userJoined', ({ username }) => {
                const newNotif = { id: Date.now(), message: `${username} joined the quiz!`, type: 'info' };
                setNotifications(prev => [...prev, newNotif]);
                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
                }, 3000);
            });

            socket.on('leaderboardUpdate', ({ username, score }) => {
                setLiveLeaderboard(prev => {
                    const others = prev.filter(p => p.username !== username);
                    return [...others, { username, score }].sort((a, b) => b.score - a.score);
                });
            });

            return () => {
                socket.off('userJoined');
                socket.off('leaderboardUpdate');
            };
        }
    }, [socket, id, user]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                // For demo mode we'll use a mocked quiz if ID is "demo"
                if (id === 'demo') {
                    setQuiz({
                        title: "Example Technology Quiz",
                        questions: [
                            { questionText: "What does HTML stand for?", options: ["Hyper Tag Markup Language", "Hyper Text Markup Language", "High Text Modern Language", "Hyperlink Text Mark Language"], correctAnswer: "Hyper Text Markup Language" },
                            { questionText: "Which company created React?", options: ["Google", "Meta", "Amazon", "Microsoft"], correctAnswer: "Meta" }
                        ],
                        timeLimit: 1
                    });
                    setTimeLeft(60);
                } else {
                    const { data } = await api.get(`/api/quizzes/${id}`);
                    setQuiz(data.data);
                    setTimeLeft(data.data.timeLimit * 60);
                }
            } catch (err) {
                console.error("Failed to fetch quiz", err);
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id, navigate]);

    useEffect(() => {
        if (timeLeft > 0 && !isFinished) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !loading && !isFinished) {
            finishQuiz();
        }
        return () => clearInterval(timerRef.current);
    }, [timeLeft, loading, isFinished]);

    const handleAnswerSelect = (option) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(option);
        const correct = option === quiz.questions[currentQuestionIndex].correctAnswer;
        setIsCorrect(correct);

        const newScore = correct ? score + 1 : score;
        if (correct) setScore(newScore);

        // Broadcast progress in real-time
        if (socket && id !== 'demo') {
            socket.emit('submitAnswer', { quizId: id, username: user.name, score: newScore });
        }

        const timer = setTimeout(() => {
            if (currentQuestionIndex < quiz.questions.length - 1) {
                nextQuestion();
            } else {
                finishQuiz();
            }
        }, 1500);

        return () => clearTimeout(timer);
    };

    const nextQuestion = () => {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    const finishQuiz = async () => {
        setIsFinished(true);
        clearInterval(timerRef.current);

        // PERSIST RESULTS TO DB (Bug Fix: Bridges realtime to persistence)
        if (id !== 'demo') {
            try {
                await api.post(`/api/quizzes/${id}/submit`, {
                    score: score,
                    totalQuestions: quiz.questions.length,
                    // Optional: track individual answers if needed
                    answers: []
                });
                console.log('✅ Results persisted to database');
            } catch (err) {
                console.error('❌ Failed to persist results', err);
            }
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (isFinished) {
        return (
            <AppLayout>
                <div className="max-w-xl mx-auto p-8 pt-20 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-card p-12"
                    >
                        <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trophy className="text-blue-400" size={40} />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-2">Quiz Completed!</h2>
                        <p className="text-slate-400 mb-8">You successfully finished the challenge.</p>

                        <div className="text-6xl font-display font-bold text-blue-400 mb-4">
                            {Math.round((score / quiz.questions.length) * 100)}%
                        </div>
                        <div className="text-white font-semibold mb-10">
                            Score: {score} / {quiz.questions.length} Correct
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                            >
                                Back to Dashboard
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 btn-primary"
                            >
                                Replay
                            </button>
                        </div>
                    </motion.div>
                </div>
            </AppLayout>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
        <AppLayout>
            {/* Real-time Notifications */}
            <div className="fixed top-24 right-8 z-50 pointer-events-none flex flex-col gap-2">
                <AnimatePresence>
                    {notifications.map((notif) => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: 50, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.5 }}
                            className="bg-blue-600 shadow-lg shadow-blue-900/40 text-white px-5 py-3 rounded-2xl flex items-center gap-3 font-semibold text-sm backdrop-blur-md"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Users size={16} />
                            </div>
                            {notif.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="max-w-3xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowLeft size={18} />
                        Quit Quiz
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-widest">
                            <Zap size={14} />
                            Code: {quiz?.joinCode}
                        </div>
                        <div className="flex items-center gap-3 glass-card px-4 py-2 text-white font-mono">
                            <Clock size={18} className={timeLeft < 30 ? "text-red-400 animate-pulse" : "text-blue-400"} />
                            <span className={timeLeft < 30 ? "text-red-400" : ""}>{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-white/5 rounded-full mb-10 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                    />
                </div>

                {/* Question Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="glass-card p-10"
                    >
                        <span className="text-blue-400 text-sm font-bold uppercase tracking-widest block mb-4">
                            Question {currentQuestionIndex + 1} of {quiz.questions.length}
                        </span>
                        <h2 className="text-2xl font-display font-bold text-white mb-10">
                            {currentQuestion.questionText}
                        </h2>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option, idx) => {
                                let style = "glass-card p-5 cursor-pointer flex items-center justify-between hover:bg-white/5 transition-all text-slate-300";
                                let icon = null;

                                if (selectedAnswer === option) {
                                    if (isCorrect) {
                                        style = "p-5 cursor-default flex items-center justify-between transition-all rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 text-white font-semibold";
                                        icon = <CheckCircle2 className="text-emerald-500" size={20} />;
                                    } else {
                                        style = "p-5 cursor-default flex items-center justify-between transition-all rounded-2xl border-2 border-red-500 bg-red-500/10 text-white font-semibold";
                                        icon = <XCircle className="text-red-500" size={20} />;
                                    }
                                } else if (selectedAnswer !== null && option === currentQuestion.correctAnswer) {
                                    style = "p-5 cursor-default flex items-center justify-between transition-all rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/5 text-slate-100 font-semibold";
                                } else if (selectedAnswer !== null) {
                                    style = "glass-card p-5 opacity-40 grayscale flex items-center justify-between text-slate-500";
                                }

                                return (
                                    <motion.div
                                        key={idx}
                                        whileHover={selectedAnswer === null ? { scale: 1.01 } : {}}
                                        whileTap={selectedAnswer === null ? { scale: 0.99 } : {}}
                                        onClick={() => handleAnswerSelect(option)}
                                        className={style}
                                    >
                                        <span>{option}</span>
                                        {icon}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Real-time Leaderboard Mini-Widget */}
                {liveLeaderboard.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 glass-card p-6"
                    >
                        <div className="flex items-center gap-2 mb-4 text-white font-semibold">
                            <Trophy size={18} className="text-yellow-500" />
                            <span>Live Leaderboard</span>
                        </div>
                        <div className="space-y-3">
                            {liveLeaderboard.slice(0, 5).map((player, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-500 font-mono w-4">{idx + 1}.</span>
                                        <span className={player.username === user.name ? "text-blue-400 font-bold" : "text-slate-300"}>
                                            {player.username} {player.username === user.name && "(You)"}
                                        </span>
                                    </div>
                                    <span className="text-white font-bold bg-white/5 px-2 py-1 rounded-lg">
                                        {player.score} pts
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </AppLayout>
    );
};

export default QuizPlay;
