
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Play, Atom } from 'lucide-react';
import { TOPICS, FIXED_QUESTIONS } from './data';
import type { LifeScienceTopic } from './data';
import { ModuleHeader } from '../../components/shared/ModuleHeader';
import { TopicCard as SharedTopicCard } from '../../components/shared/TopicCard';
import { QuizModal as SharedQuizModal } from '../../components/shared/QuizModal';
import { useUser } from '../../context/UserContext';

export default function LifeScienceQuiz() {
    const { completeQuiz } = useUser();
    const [activeTab, setActiveTab] = useState<'paper1' | 'paper2'>('paper1');
    const [search, setSearch] = useState('');
    const [selectedTopic, setSelectedTopic] = useState<LifeScienceTopic | null>(null);
    const [quizOpen, setQuizOpen] = useState(false);
    const [quizPaper, setQuizPaper] = useState<string>('');

    const filteredTopics = TOPICS.filter(t =>
        (t.paper === (activeTab === 'paper1' ? 1 : 2)) &&
        (t.title.toLowerCase().includes(search.toLowerCase()) || t.tags.toLowerCase().includes(search.toLowerCase()))
    );

    const handleQuizComplete = (score: number) => {
        // Check if score is decent enough to count as complete? 
        // For now, any completion counts.
        const total = FIXED_QUESTIONS[quizPaper]?.length || 0;
        completeQuiz(`lifescience-${quizPaper}`, score, total);
        setQuizOpen(false);
    };

    const startQuiz = (paper: string) => {
        setQuizPaper(paper);
        setQuizOpen(true);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
            <ModuleHeader
                title="Life Sciences"
                subtitle="Natural Explorer"
                colorClass="text-green-600"
                bgClass="bg-green-500"
                icon={<Atom size={20} />}
            />

            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden glass p-8 md:p-12 mb-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between border-0 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-90" />
                <div className="absolute inset-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', opacity: 0.1 }} />

                <div className="relative z-10 text-white max-w-lg">
                    <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Ready to explore?</h2>
                    <p className="text-green-100 text-lg mb-8 font-medium">Master the natural world with our daily challenges and interactive lessons.</p>
                    <div className="flex gap-3 justify-center md:justify-start">
                        <button onClick={() => startQuiz('paper1')} className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                            <Play size={18} fill="currentColor" /> Start Quiz
                        </button>
                    </div>
                </div>

                {/* Decorative Element */}
                <div className="relative z-10 hidden md:block">
                    <AtomIcon />
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
                    <button
                        onClick={() => setActiveTab('paper1')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'paper1' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Term 1
                    </button>
                    <button
                        onClick={() => setActiveTab('paper2')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'paper2' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
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
                        className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none w-full md:w-64 transition-all shadow-sm text-sm"
                    />
                </div>
            </div>

            {/* Grid */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                    {filteredTopics.map((topic) => (
                        <SharedTopicCard
                            key={topic.title}
                            topic={{ ...topic, subtitle: `Paper ${topic.paper}` }}
                            onClick={() => setSelectedTopic(topic)}
                            colorClass="text-green-600"
                            bgGradient="from-green-50 to-emerald-100"
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
                                <span className="text-xs font-bold tracking-wider text-green-600 uppercase mb-2 block">Paper {selectedTopic.paper}</span>
                                <h2 className="text-3xl font-extrabold text-slate-800 mb-4">{selectedTopic.title}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTopic.tags.split(' ').map(tag => (
                                        <span key={tag} className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {selectedTopic.diagram && (
                                <div className="mb-8 rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50 p-4">
                                    <div dangerouslySetInnerHTML={{ __html: selectedTopic.diagram }} />
                                </div>
                            )}

                            <div className="space-y-6">
                                {selectedTopic.content.map((item, i) => (
                                    <div key={i} className="bg-green-50/50 p-6 rounded-2xl border border-green-100/50">
                                        <h4 className="font-bold text-green-800 mb-2">{item.topic}</h4>
                                        <p className="text-slate-600 text-sm leading-relaxed">{item.ex}</p>
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
                title={quizPaper === 'paper1' ? 'Term 1 Assessment' : 'Term 2 Assessment'}
                questions={FIXED_QUESTIONS[quizPaper] || []}
                onComplete={handleQuizComplete}
                colorClass="bg-green-500"
            />
        </div>
    );
}

const AtomIcon = () => (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/20 animate-spin-slow">
        <circle cx="100" cy="100" r="20" fill="currentColor" />
        <ellipse cx="100" cy="100" rx="80" ry="30" stroke="currentColor" strokeWidth="4" transform="rotate(0 100 100)" />
        <ellipse cx="100" cy="100" rx="80" ry="30" stroke="currentColor" strokeWidth="4" transform="rotate(60 100 100)" />
        <ellipse cx="100" cy="100" rx="80" ry="30" stroke="currentColor" strokeWidth="4" transform="rotate(120 100 100)" />
    </svg>
);
