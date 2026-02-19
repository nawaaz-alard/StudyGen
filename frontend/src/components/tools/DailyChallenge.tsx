
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Trophy, X, CheckCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useSFX } from '../../context/SoundContext';
import Confetti from 'react-confetti';

function useWindowSize() {
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    useEffect(() => {
        const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return size;
}

const DAILY_QUESTIONS = [
    { q: "What covers 70% of Earth's surface?", a: "Water", options: ["Land", "Water", "Ice", "Forest"] },
    { q: "Solve for x: 2x + 6 = 14", a: "4", options: ["2", "4", "6", "8"] },
    { q: "Which planet is known as the Red Planet?", a: "Mars", options: ["Venus", "Mars", "Jupiter", "Saturn"] },
    { q: "What is the capital of South Africa (Admin)?", a: "Pretoria", options: ["Cape Town", "Durban", "Pretoria", "Johannesburg"] },
    { q: "Synonym for 'Happy'?", a: "Joyful", options: ["Sad", "Angry", "Joyful", "Tired"] }
];

export default function DailyChallenge() {
    const { addXp } = useUser();
    const { playCorrect, playIncorrect, playLevelUp } = useSFX();
    const { width, height } = useWindowSize(); // Custom hook above

    const [isOpen, setIsOpen] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [completedToday, setCompletedToday] = useState(false);
    const [confettiActive, setConfettiActive] = useState(false);

    // Check if already completed today (mock check)
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const lastChallenge = localStorage.getItem('last_daily_challenge');
        if (lastChallenge === today) setCompletedToday(true);
    }, []);

    const handleAnswer = (answer: string) => {
        if (answer === DAILY_QUESTIONS[currentQ].a) {
            setScore(s => s + 1);
            playCorrect();
        } else {
            playIncorrect();
        }

        if (currentQ < DAILY_QUESTIONS.length - 1) {
            setCurrentQ(q => q + 1);
        } else {
            finishChallenge();
        }
    };

    const finishChallenge = () => {
        setShowResult(true);
        const passed = score >= 3;
        if (passed) {
            playLevelUp();
            setConfettiActive(true);
            setTimeout(() => setConfettiActive(false), 5000);

            if (!completedToday) {
                addXp(100); // Bonus XP
                localStorage.setItem('last_daily_challenge', new Date().toISOString().split('T')[0]);
                setCompletedToday(true);
            }
        }
    };

    const reset = () => {
        setIsOpen(false);
        setCurrentQ(0);
        setScore(0);
        setShowResult(false);
    };

    return (
        <>
            {/* Widget Button */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => !completedToday && setIsOpen(true)}
                className={`glass p-6 rounded-3xl border border-white/5 relative overflow-hidden group cursor-pointer ${completedToday ? 'opacity-80' : ''}`}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-3 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl shadow-lg shadow-orange-500/20">
                        <Zap className="text-white" size={24} />
                    </div>
                    {completedToday && (
                        <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
                            <CheckCircle size={12} /> Done
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-white mb-1 relative z-10">Daily Challenge</h3>
                <p className="text-slate-400 text-sm mb-4 relative z-10">
                    {completedToday ? "Come back tomorrow for more!" : "Complete 5 mixed questions to earn +100 XP bonus!"}
                </p>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 relative z-10">
                    <Clock size={14} />
                    <span>Resets in 12h</span>
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
                    >
                        {confettiActive && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Zap className="text-orange-400 border-2 border-orange-400/20 rounded-lg p-1" size={32} />
                                    Daily Challenge
                                </h2>
                                <button onClick={reset} className="text-slate-400 hover:text-white transition-colors" aria-label="Close" title="Close">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8">
                                {!showResult ? (
                                    <>
                                        <div className="mb-6 flex justify-between text-sm font-bold text-slate-500 uppercase tracking-widest">
                                            <span>Question {currentQ + 1} of {DAILY_QUESTIONS.length}</span>
                                            <span>Score: {score}</span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-8 leading-tight">
                                            {DAILY_QUESTIONS[currentQ].q}
                                        </h3>

                                        <div className="grid grid-cols-1 gap-3">
                                            {DAILY_QUESTIONS[currentQ].options.map((opt, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleAnswer(opt)}
                                                    className="p-4 rounded-xl bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-left text-slate-300 hover:text-white font-bold transition-all active:scale-[0.98]"
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="mb-6 inline-flex p-6 rounded-full bg-slate-800 border-4 border-slate-700">
                                            <Trophy size={64} className={score >= 3 ? "text-yellow-400" : "text-slate-600"} />
                                        </div>

                                        <h3 className="text-3xl font-bold text-white mb-2">
                                            {score >= 3 ? "Challenge Complete!" : "Try Again Tomorrow"}
                                        </h3>
                                        <p className="text-slate-400 mb-8">
                                            You scored {score} out of {DAILY_QUESTIONS.length}
                                        </p>

                                        {score >= 3 && (
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-8 text-emerald-400 font-bold">
                                                +100 XP Bonus Earned!
                                            </div>
                                        )}

                                        <button
                                            onClick={reset}
                                            className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!showResult && (
                                <div className="h-2 bg-slate-800 w-full">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-300 ease-out"
                                        style={{ width: `${((currentQ) / DAILY_QUESTIONS.length) * 100}%` }}
                                    />
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
