import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, ChevronRight, ChevronLeft, Layout, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import api from '../context/AuthContext';

const CreateQuiz = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        category: 'technology',
        difficulty: 'medium',
        timeLimit: 10,
        isPublic: true,
        questions: []
    });

    const [aiTopic, setAiTopic] = useState('');
    const [generatingAI, setGeneratingAI] = useState(false);

    const handleGenerateAI = async () => {
        if (!aiTopic) return;
        setGeneratingAI(true);
        try {
            const { data } = await api.post('/api/ai/generate', {
                topic: aiTopic,
                difficulty: quizData.difficulty,
                count: 5
            });

            setQuizData(prev => ({
                ...prev,
                questions: [...prev.questions, ...data.data]
            }));
            setAiTopic('');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "AI generation failed. Please ensure your API key is correct.");
        } finally {
            setGeneratingAI(false);
        }
    };

    const [currentQuestion, setCurrentQuestion] = useState({
        questionText: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 5
    });

    const handleQuizChange = (e) => {
        const { name, value, type, checked } = e.target;
        setQuizData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addQuestion = () => {
        if (!currentQuestion.questionText || !currentQuestion.correctAnswer) {
            alert('Please fill question text and select a correct answer');
            return;
        }

        // Ensure all 4 options are filled for multiple-choice
        if (currentQuestion.type === 'multiple-choice') {
            const emptyOptions = currentQuestion.options.some(opt => !opt.trim());
            if (emptyOptions) {
                alert('Please fill all 4 options for multiple-choice questions');
                return;
            }
        }
        setQuizData(prev => ({
            ...prev,
            questions: [...prev.questions, currentQuestion]
        }));
        setCurrentQuestion({
            questionText: '',
            type: 'multiple-choice',
            options: ['', '', '', ''],
            correctAnswer: '',
            points: 5
        });
    };

    const removeQuestion = (index) => {
        setQuizData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        if (quizData.questions.length === 0) {
            alert('Add at least one question');
            return;
        }
        setLoading(true);
        try {
            // REAL API CALL (Removed demo_token bypass)
            await api.post('/api/quizzes', quizData);
            navigate('/dashboard');
        } catch (err) {
            let errorMsg = 'Failed to create quiz. Please check all fields.';
            if (err.response?.data?.error) {
                errorMsg = err.response.data.error;
            } else if (err.response?.data?.errors?.[0]) {
                const firstErr = err.response.data.errors[0];
                errorMsg = typeof firstErr === 'object' ? Object.values(firstErr)[0] : firstErr;
            } else if (!err.response) {
                errorMsg = 'Network Error: Cannot reach server.';
            }
            alert(errorMsg);
        } finally {
            if (localStorage.getItem('token') !== 'demo_token') {
                setLoading(false);
            }
        }
    };

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto p-8">
                <div className="mb-10">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-display font-bold text-white">Create New Quiz</h1>
                        {quizData.questions.length > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold animate-pulse">
                                {quizData.questions.length} Questions Added
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <div className={`flex items-center gap-2 text-sm font-semibold ${step === 1 ? 'text-blue-400' : 'text-slate-500'}`}>
                            <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${step === 1 ? 'border-blue-400' : 'border-slate-700'}`}>1</span>
                            Details
                        </div>
                        <div className="w-10 h-px bg-slate-800"></div>
                        <div className={`flex items-center gap-2 text-sm font-semibold ${step === 2 ? 'text-blue-400' : 'text-slate-500'}`}>
                            <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${step === 2 ? 'border-blue-400' : 'border-slate-700'}`}>2</span>
                            Questions
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="glass-card p-8 space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Quiz Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={quizData.title}
                                        onChange={handleQuizChange}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-blue-500 outline-none"
                                        placeholder="Enter an catchy title..."
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={quizData.description}
                                        onChange={handleQuizChange}
                                        rows="3"
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-blue-500 outline-none resize-none"
                                        placeholder="Tell participants what this quiz is about..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={quizData.category}
                                        onChange={handleQuizChange}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-blue-500 outline-none appearance-none"
                                    >
                                        <option value="technology" className="bg-slate-800">Technology</option>
                                        <option value="science" className="bg-slate-800">Science</option>
                                        <option value="history" className="bg-slate-800">History</option>
                                        <option value="sports" className="bg-slate-800">Sports</option>
                                        <option value="geography" className="bg-slate-800">Geography</option>
                                        <option value="entertainment" className="bg-slate-800">Entertainment</option>
                                        <option value="music" className="bg-slate-800">Music</option>
                                        <option value="cinema" className="bg-slate-800">Cinema</option>
                                        <option value="general" className="bg-slate-800">General</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Difficulty</label>
                                    <select
                                        name="difficulty"
                                        value={quizData.difficulty}
                                        onChange={handleQuizChange}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-blue-500 outline-none appearance-none"
                                    >
                                        <option value="easy" className="bg-slate-800">Easy</option>
                                        <option value="medium" className="bg-slate-800">Medium</option>
                                        <option value="hard" className="bg-slate-800">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Time Limit (mins)</label>
                                    <input
                                        type="number"
                                        name="timeLimit"
                                        value={quizData.timeLimit}
                                        onChange={handleQuizChange}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div className="flex items-center pt-8">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isPublic"
                                            checked={quizData.isPublic}
                                            onChange={handleQuizChange}
                                            className="w-5 h-5 rounded border-white/10 bg-white/5 text-blue-500"
                                        />
                                        <span className="text-sm font-semibold text-slate-300">Public Quiz</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="btn-primary flex items-center gap-2"
                                    disabled={!quizData.title || !quizData.description}
                                >
                                    Next: Add Questions
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* AI Generation Section */}
                            <div className="glass-card p-6 border-dashed border-2 border-blue-500/30 bg-blue-500/5">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                            <Sparkles size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">AI Question Generator</h3>
                                            <p className="text-sm text-slate-400">Auto-create questions from any topic.</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full max-w-md flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Topic (e.g. JavaScript, Space...)"
                                            value={aiTopic}
                                            onChange={(e) => setAiTopic(e.target.value)}
                                            className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500"
                                        />
                                        <button
                                            onClick={handleGenerateAI}
                                            disabled={generatingAI || !aiTopic}
                                            className="btn-primary py-2 px-6 text-sm flex items-center gap-2 whitespace-nowrap"
                                        >
                                            {generatingAI ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                            Generate
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Question Form */}
                            <div className="glass-card p-8 border-l-4 border-l-blue-500">
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Question Text</label>
                                    <input
                                        type="text"
                                        value={currentQuestion.questionText}
                                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-blue-500 outline-none"
                                        placeholder="What is the capital of France?"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {currentQuestion.options.map((option, idx) => (
                                        <div key={idx} className="relative">
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => {
                                                    const newOptions = [...currentQuestion.options];
                                                    newOptions[idx] = e.target.value;
                                                    setCurrentQuestion({ ...currentQuestion, options: newOptions });
                                                }}
                                                className={`w-full bg-white/5 border text-white rounded-xl px-4 py-3 outline-none transition-all ${currentQuestion.correctAnswer === option && option !== ''
                                                    ? 'border-emerald-500/50 bg-emerald-500/5'
                                                    : 'border-white/10 focus:border-blue-500'
                                                    }`}
                                                placeholder={`Option ${idx + 1}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: option })}
                                                className={`absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${currentQuestion.correctAnswer === option && option !== ''
                                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                                    : 'border-slate-700 text-slate-700 hover:border-slate-500'
                                                    }`}
                                            >
                                                ✓
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-slate-500">
                                        Tip: Click the checkmark to mark an option as the correct answer.
                                    </div>
                                    <button
                                        onClick={addQuestion}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-all border border-white/10"
                                    >
                                        <Plus size={18} />
                                        Add to Quiz
                                    </button>
                                </div>
                            </div>

                            {/* Added Questions List */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Layout size={20} className="text-blue-400" />
                                    Quiz Content ({quizData.questions.length})
                                </h3>
                                {quizData.questions.length > 0 ? (
                                    quizData.questions.map((q, i) => (
                                        <div key={i} className="glass-card p-4 flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 font-bold text-sm">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold text-sm">{q.questionText}</p>
                                                    <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">Correct: {q.correctAnswer}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeQuestion(i)}
                                                className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="glass-card p-10 text-center text-slate-500 text-sm border-dashed">
                                        No questions added yet.
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between pt-10">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-slate-400 font-bold hover:text-white transition-all px-4"
                                >
                                    <ChevronLeft size={18} />
                                    Back to Details
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || quizData.questions.length === 0}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    {loading ? 'Creating...' : 'Finalize & Save Quiz'}
                                    <Save size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AppLayout>
    );
};

export default CreateQuiz;
