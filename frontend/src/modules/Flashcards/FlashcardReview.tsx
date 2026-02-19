
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, Brain, Zap } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import { MOCK_FLASHCARDS } from '../../data/flashcards';
import type { Flashcard } from '../../data/flashcards';

export default function FlashcardReview() {
    const { addXp } = useUser(); // We'll assume updateCardProgress is here or implement local state

    // In a real app, this would come from UserContext or API
    // For now, we simulate progress locally per session, or load from localStorage
    const [progress, setProgress] = useState<Record<string, { box: number, nextReview: number }>>(() => {
        const saved = localStorage.getItem('srs_progress');
        return saved ? JSON.parse(saved) : {};
    });

    const [dueCards, setDueCards] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

    useEffect(() => {
        // Filter cards that are due
        const now = Date.now();
        const due = MOCK_FLASHCARDS.filter(card => {
            const cardProgress = progress[card.id];
            // If no progress, it's new (due immediately)
            if (!cardProgress) return true;
            return cardProgress.nextReview <= now;
        });
        setDueCards(due);
    }, []);

    const handleResult = (success: boolean) => {
        const card = dueCards[currentCardIndex];
        const cardProgress = progress[card.id] || { box: 0, nextReview: 0 };

        // SRS Logic: simple Leitner system simulation
        // Box 0: 1 day, Box 1: 3 days, Box 2: 7 days, Box 3: 14 days, Box 4: 30 days
        const intervals = [1, 3, 7, 14, 30];
        let newBox = success ? Math.min(cardProgress.box + 1, 4) : 0;

        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + intervals[newBox]);

        const newProgress = {
            ...progress,
            [card.id]: {
                box: newBox,
                nextReview: nextReviewDate.getTime()
            }
        };

        setProgress(newProgress);
        localStorage.setItem('srs_progress', JSON.stringify(newProgress));

        // Update session stats
        setSessionStats(prev => ({
            correct: prev.correct + (success ? 1 : 0),
            incorrect: prev.incorrect + (success ? 0 : 1)
        }));

        if (success) addXp(10); // Reward for reviewing

        // Next card
        if (currentCardIndex < dueCards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentCardIndex(prev => prev + 1), 200);
        } else {
            setSessionComplete(true);
            if (sessionStats.correct > 0) addXp(50); // Bonus for completion
        }
    };

    if (dueCards.length === 0) {
        return (
            <div className="page-padding min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-green-500/20 p-6 rounded-full inline-block mb-6">
                        <Check size={64} className="text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">All Caught Up!</h2>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                        You've reviewed all your due cards for now. Great job keeping your memory sharp!
                    </p>
                    <Link to="/" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all inline-block">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (sessionComplete) {
        return (
            <div className="page-padding min-h-screen flex items-center justify-center">
                <div className="glass p-12 rounded-3xl text-center max-w-lg w-full">
                    <h2 className="text-3xl font-bold text-white mb-8">Session Complete!</h2>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                            <span className="block text-3xl font-bold text-green-400">{sessionStats.correct}</span>
                            <span className="text-sm text-green-200/60 uppercase tracking-wider">Remembered</span>
                        </div>
                        <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                            <span className="block text-3xl font-bold text-red-400">{sessionStats.incorrect}</span>
                            <span className="text-sm text-red-200/60 uppercase tracking-wider">Forgot</span>
                        </div>
                    </div>

                    <p className="text-slate-400 mb-8">
                        You've earned <span className="text-yellow-400 font-bold">+{sessionStats.correct * 10 + 50} XP</span> today!
                    </p>

                    <Link to="/" className="w-full block py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all">
                        Finish
                    </Link>
                </div>
            </div>
        );
    }

    const currentCard = dueCards[currentCardIndex];

    return (
        <div className="page-padding min-h-screen flex flex-col items-center pt-8">
            <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
                <Link to="/" className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                    <Brain size={16} className="text-purple-400" />
                    <span>{currentCardIndex + 1} / {dueCards.length}</span>
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-2xl h-1.5 bg-slate-800 rounded-full mb-12 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentCardIndex) / dueCards.length) * 100}%` }}
                />
            </div>

            {/* Flashcard */}
            <div className="w-full max-w-2xl perspective-1000 h-[400px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                <motion.div
                    className="relative w-full h-full preserve-3d transition-all duration-500"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-slate-800 border border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl">
                        <span className="absolute top-6 left-6 text-xs text-slate-500 uppercase tracking-widest font-bold border border-slate-700 px-2 py-1 rounded">
                            {currentCard.category}
                        </span>
                        <h3 className="text-3xl font-bold text-white leading-relaxed">
                            {currentCard.front}
                        </h3>
                        <p className="absolute bottom-8 text-slate-500 text-sm flex items-center gap-2 animate-pulse">
                            <Zap size={14} /> Tap to flip
                        </p>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-900 border border-indigo-700/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl bg-gradient-to-br from-indigo-900 to-slate-900">
                        <span className="absolute top-6 left-6 text-xs text-indigo-300 uppercase tracking-widest font-bold border border-indigo-500/30 px-2 py-1 rounded">
                            Answer
                        </span>
                        <p className="text-2xl font-medium text-white leading-relaxed">
                            {currentCard.back}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <AnimatePresence>
                {isFlipped && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 w-full max-w-md px-4 grid grid-cols-2 gap-4"
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); handleResult(false); }}
                            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <X size={20} /> Forgot
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleResult(true); }}
                            className="bg-green-500 hover:bg-green-400 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-all active:scale-95"
                        >
                            <Check size={20} /> I Know It
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
