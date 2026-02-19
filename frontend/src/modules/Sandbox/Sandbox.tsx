
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { QuizModal } from '../../components/shared/QuizModal';
import { TestTube, ShieldCheck, FileJson, BadgeCheck, Calculator, Atom, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sandbox() {
    const { addXp, completeQuiz } = useUser();
    const [isQuizOpen, setIsQuizOpen] = useState(false);

    const testQuestions = [
        { q: "What is 2 + 2?", a: ["4"], options: ["3", "4", "5", "22"] },
        { q: "What is the capital of France?", a: ["Paris"], options: ["London", "Berlin", "Paris", "Madrid"] }
    ];

    return (
        <div className="page-padding pt-8 min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-[#0B1120]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto px-4"
            >
                {/* Header Section */}
                <div className="glass rounded-3xl p-6 mb-8 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-900/10">
                    <div className="flex items-center gap-5">
                        <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                            <ShieldCheck size={32} className="text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">
                                Developer Sandbox
                            </h1>
                            <p className="text-slate-400 text-sm">System Verification Environment</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Modules Grid */}
                        <section>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link to="/modules/math" className="group relative overflow-hidden p-6 glass rounded-3xl hover:bg-white/5 transition-all border border-transparent hover:border-cyan-500/30">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Calculator size={100} />
                                    </div>
                                    <div className="bg-gradient-to-br from-cyan-400/20 to-blue-600/20 w-12 h-12 flex items-center justify-center rounded-2xl mb-4 text-cyan-300 group-hover:scale-110 transition-transform ring-1 ring-cyan-500/30">
                                        <Calculator size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Math Quiz</h3>
                                    <div className="h-1 w-12 bg-cyan-500/30 rounded-full mb-3 group-hover:w-full transition-all duration-500" />
                                    <p className="text-slate-400 text-xs">Algebra, Geometry & Calculus</p>
                                </Link>

                                <Link to="/modules/lifescience" className="group relative overflow-hidden p-6 glass rounded-3xl hover:bg-white/5 transition-all border border-transparent hover:border-emerald-500/30">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Atom size={100} />
                                    </div>
                                    <div className="bg-gradient-to-br from-emerald-400/20 to-teal-600/20 w-12 h-12 flex items-center justify-center rounded-2xl mb-4 text-emerald-300 group-hover:scale-110 transition-transform ring-1 ring-emerald-500/30">
                                        <Atom size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Life Science</h3>
                                    <div className="h-1 w-12 bg-emerald-500/30 rounded-full mb-3 group-hover:w-full transition-all duration-500" />
                                    <p className="text-slate-400 text-xs">Biology & Ecosystems</p>
                                </Link>

                                <Link to="/modules/afrikaans" className="group relative overflow-hidden p-6 glass rounded-3xl hover:bg-white/5 transition-all border border-transparent hover:border-orange-500/30">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Award size={100} />
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-400/20 to-red-600/20 w-12 h-12 flex items-center justify-center rounded-2xl mb-4 text-orange-300 group-hover:scale-110 transition-transform ring-1 ring-orange-500/30">
                                        <Award size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Afrikaans</h3>
                                    <div className="h-1 w-12 bg-orange-500/30 rounded-full mb-3 group-hover:w-full transition-all duration-500" />
                                    <p className="text-slate-400 text-xs">Taal & Woordeskat</p>
                                </Link>
                            </div>
                        </section>

                        {/* Live State Inspector */}
                        {/* Live State Inspector Removed */}
                    </div>

                    {/* Right Column: Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass p-6 rounded-3xl border border-white/5 bg-slate-900/40 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl pointer-events-none" />
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white relative z-10">
                                <TestTube className="text-purple-400" size={20} /> Developer Controls
                            </h3>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Progression Testing</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={() => addXp(50)} className="py-3 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl border border-slate-700 hover:border-emerald-500/30 transition-all text-xs font-bold flex flex-col items-center justify-center gap-1">
                                            <span>+50 XP</span>
                                            <span className="text-[10px] text-slate-500 font-normal">Small Reward</span>
                                        </button>
                                        <button onClick={() => addXp(500)} className="py-3 px-3 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl border border-slate-700 hover:border-indigo-500/30 transition-all text-xs font-bold flex flex-col items-center justify-center gap-1">
                                            <span>+500 XP</span>
                                            <span className="text-[10px] text-slate-500 font-normal">Level Up</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5" />

                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Component Verification</label>
                                    <button
                                        onClick={() => setIsQuizOpen(true)}
                                        className="w-full py-4 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-transform active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <BadgeCheck size={20} />
                                        Launch System Quiz
                                    </button>
                                    <p className="text-center text-[10px] text-slate-500 mt-3">Verifies: Modal, State Updates, XP Calculation</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl border border-dashed border-slate-700/50 flex gap-3 items-start">
                            <div className="p-2 bg-slate-800/50 rounded-lg text-slate-400">
                                <FileJson size={16} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-300 mb-1">State Persistence</h4>
                                <p className="text-[10px] text-slate-500 leading-relaxed">
                                    All actions are saved to LocalStorage. Use the Factory Reset icon in the header to clear session data.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <QuizModal
                isOpen={isQuizOpen}
                onClose={() => setIsQuizOpen(false)}
                title="System Diagnostic Quiz"
                questions={testQuestions}
                onComplete={(score) => {
                    completeQuiz('sandbox_quiz', score, testQuestions.length);
                    setIsQuizOpen(false);
                }}
            />
        </div>
    );
}
