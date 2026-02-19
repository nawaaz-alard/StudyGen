
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';

export interface Question {
    q: string;
    a: string[]; // Correct answer variants
    options?: string[]; // Multiple choice options (optional)
}

interface QuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    questions: Question[];
    onComplete: (score: number) => void;
    colorClass?: string; // e.g. 'bg-green-500'
}

export const QuizModal = ({ isOpen, onClose, title, questions, onComplete, colorClass = 'bg-indigo-500' }: QuizModalProps) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    if (!isOpen || !questions || questions.length === 0) return null;

    const handleFinish = () => {
        let finalScore = 0;
        questions.forEach((q, idx) => {
            const userA = (answers[idx] || '').toLowerCase().trim();
            if (q.a.some(ans => userA.includes(ans.toLowerCase()) || userA === ans.toLowerCase())) {
                finalScore++;
            }
        });
        setScore(finalScore);
        setShowResult(true);
        // Don't call onComplete immediately, user clicks "Collect XP"
    };

    const handleClose = () => {
        onComplete(score); // Award XP on close
        onClose();
        // Reset state after close 
        setTimeout(() => {
            setCurrentQ(0);
            setScore(0);
            setShowResult(false);
            setAnswers({});
        }, 300);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                    className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
                >
                    {showResult ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <Trophy size={64} className="text-yellow-400 mb-6" />
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Complete!</h2>
                            <p className="text-slate-500 mb-8">You scored <strong className={colorClass.replace('bg-', 'text-')}>{score} / {questions.length}</strong></p>
                            <button onClick={handleClose} className={`px-8 py-3 ${colorClass} text-white rounded-xl font-bold hover:opacity-90 transition-colors`}>
                                Collect XP & Close
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-700">{title} <span className="text-slate-400 text-sm">Question {currentQ + 1} / {questions.length}</span></h3>
                                <button onClick={onClose} aria-label="Close Quiz"><X size={20} className="text-slate-400 hover:text-red-500" /></button>
                            </div>

                            <div className="p-8 flex-1 overflow-y-auto">
                                <h2 className="text-xl font-medium text-slate-800 mb-6 leading-relaxed">{questions[currentQ].q}</h2>

                                {questions[currentQ].options ? (
                                    <div className="grid gap-3">
                                        {questions[currentQ].options?.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setAnswers({ ...answers, [currentQ]: opt })}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${answers[currentQ] === opt ? `border-${colorClass.split('-')[1]}-400 bg-${colorClass.split('-')[1]}-50` : 'border-slate-100 hover:border-slate-300'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <textarea
                                        className={`w-full p-4 rounded-xl border border-slate-200 focus:border-${colorClass.split('-')[1]}-500 focus:ring-2 focus:ring-${colorClass.split('-')[1]}-100 outline-none resize-none transition-all placeholder:text-slate-300`}
                                        rows={3}
                                        placeholder="Type your answer here..."
                                        value={answers[currentQ] || ''}
                                        onChange={(e) => setAnswers({ ...answers, [currentQ]: e.target.value })}
                                    />
                                )}
                            </div>

                            <div className="p-6 border-t border-slate-100 flex justify-between bg-slate-50">
                                <button
                                    onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                                    disabled={currentQ === 0}
                                    className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-50 font-medium transition-colors"
                                >
                                    Back
                                </button>
                                {currentQ === questions.length - 1 ? (
                                    <button
                                        onClick={handleFinish}
                                        className={`px-6 py-2 rounded-lg ${colorClass} text-white font-bold hover:opacity-90 shadow-lg transition-all`}
                                    >
                                        Finish Quiz
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))}
                                        className="px-6 py-2 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
