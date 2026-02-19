
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Play, Calculator } from 'lucide-react';
import { TOPICS, FIXED_QUESTIONS } from './data';
import type { MathTopic } from './data';
import { ModuleHeader } from '../../components/shared/ModuleHeader';
import { TopicCard as SharedTopicCard } from '../../components/shared/TopicCard';
import { QuizModal as SharedQuizModal } from '../../components/shared/QuizModal';
import { useUser } from '../../context/UserContext';

export default function MathQuiz() {
    const { completeQuiz } = useUser();
    const [activeTab, setActiveTab] = useState<'paper1' | 'paper2'>('paper1');
    const [search, setSearch] = useState('');
    const [selectedTopic, setSelectedTopic] = useState<MathTopic | null>(null);
    const [quizOpen, setQuizOpen] = useState(false);
    const [quizPaper, setQuizPaper] = useState<string>('');

    const filteredTopics = TOPICS.filter(t =>
        (t.paper === (activeTab === 'paper1' ? 1 : 2)) &&
        (t.title.toLowerCase().includes(search.toLowerCase()) || t.tags.toLowerCase().includes(search.toLowerCase()))
    );

    const handleQuizComplete = (score: number) => {
        const total = FIXED_QUESTIONS[quizPaper]?.length || 0;
        completeQuiz(`math-${quizPaper}`, score, total);
        setQuizOpen(false);
    };

    const startQuiz = (paper: string) => {
        setQuizPaper(paper);
        setQuizOpen(true);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
            <ModuleHeader
                title="Mathematics"
                subtitle="Grade 8 Numeracy"
                colorClass="text-blue-600"
                bgClass="bg-blue-500"
                icon={<Calculator size={20} />}
            />

            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden glass p-8 md:p-12 mb-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between border-0 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-90" />
                <div className="absolute inset-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', opacity: 0.1 }} />

                <div className="relative z-10 text-white max-w-lg">
                    <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Solve Problems.</h2>
                    <p className="text-blue-100 text-lg mb-8 font-medium">Sharpen your logic and calculation skills with our daily math challenges.</p>
                    <div className="flex gap-3 justify-center md:justify-start">
                        <button onClick={() => startQuiz('paper1')} className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                            <Play size={18} fill="currentColor" /> Start Calculations
                        </button>
                    </div>
                </div>

                {/* Decorative Element */}
                <div className="relative z-10 hidden md:block opacity-30 rotate-12">
                    <Calculator size={200} className="text-white" />
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
                    <button
                        onClick={() => setActiveTab('paper1')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'paper1' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Term 1
                    </button>
                    <button
                        onClick={() => setActiveTab('paper2')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'paper2' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Term 2
                    </button>
                </div>

                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search topics..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none w-full md:w-64 transition-all shadow-sm text-sm"
                    />
                </div>
            </div>

            {/* Grid */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                    {filteredTopics.map((topic) => (
                        <SharedTopicCard
                            key={topic.title}
                            topic={{
                                title: topic.title,
                                subtitle: `Paper ${topic.paper}`,
                                description: topic.content[0]?.ex,
                                iconComponent: <Calculator className="w-8 h-8 text-blue-400" />
                            }}
                            onClick={() => setSelectedTopic(topic)}
                            colorClass="text-blue-600"
                            bgGradient="from-blue-50 to-indigo-100"
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Topic Detail Modal */}
            <AnimatePresence>
                {selectedTopic && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedTopic(null)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end"
                    >
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-lg h-full p-8 overflow-y-auto shadow-2xl relative"
                        >
                            <button onClick={() => setSelectedTopic(null)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <ArrowLeft size={24} className="text-slate-400" />
                            </button>

                            <div className="mb-8">
                                <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2 block">Paper {selectedTopic.paper}</span>
                                <h2 className="text-3xl font-extrabold text-slate-800 mb-4">{selectedTopic.title}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTopic.tags.split(' ').map(tag => (
                                        <span key={tag} className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {selectedTopic.content.map((item, i) => (
                                    <div key={i} className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                                        <h4 className="font-bold text-blue-800 mb-2">{item.topic}</h4>
                                        <p className="font-mono text-slate-600 text-sm bg-white/50 p-2 rounded border border-blue-100 inline-block">{item.ex}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <SharedQuizModal
                isOpen={quizOpen}
                onClose={() => setQuizOpen(false)}
                title={quizPaper === 'paper1' ? 'Math Paper 1' : 'Math Paper 2'}
                questions={FIXED_QUESTIONS[quizPaper] || []}
                onComplete={handleQuizComplete}
                colorClass="bg-blue-500"
            />
        </div>
    );
}
