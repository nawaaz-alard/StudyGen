
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Play, Award } from 'lucide-react';
import { TOPICS, FIXED_QUESTIONS } from './data';
import type { AfrikaansTopic } from './data';
import { ModuleHeader } from '../../components/shared/ModuleHeader';
import { TopicCard as SharedTopicCard } from '../../components/shared/TopicCard';
import { QuizModal as SharedQuizModal } from '../../components/shared/QuizModal';
import { useUser } from '../../context/UserContext';

export default function AfrikaansQuiz() {
    const { completeQuiz } = useUser();
    const [activeTab, setActiveTab] = useState<'woordeskat' | 'grammatika'>('woordeskat');
    const [search, setSearch] = useState('');
    const [selectedTopic, setSelectedTopic] = useState<AfrikaansTopic | null>(null);
    const [quizOpen, setQuizOpen] = useState(false);
    const [quizCategory, setQuizCategory] = useState<string>('');

    const filteredTopics = TOPICS.filter(t =>
        (t.category.toLowerCase() === activeTab) &&
        (t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
    );

    const handleQuizComplete = (score: number) => {
        const total = FIXED_QUESTIONS[quizCategory]?.length || 0;
        completeQuiz(`afrikaans-${quizCategory}`, score, total);
        setQuizOpen(false);
    };

    const startQuiz = (category: string) => {
        setQuizCategory(category);
        setQuizOpen(true);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
            <ModuleHeader
                title="Afrikaans"
                subtitle="Eerste Addisionele Taal"
                colorClass="text-orange-600"
                bgClass="bg-orange-500"
                icon={<Award size={20} />}
            />

            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden glass p-8 md:p-12 mb-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between border-0 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 opacity-90" />
                <div className="absolute inset-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', opacity: 0.1 }} />

                <div className="relative z-10 text-white max-w-lg">
                    <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Leer Afrikaans.</h2>
                    <p className="text-orange-100 text-lg mb-8 font-medium">Verbeter jou woordeskat en grammatika.</p>
                    <div className="flex gap-3 justify-center md:justify-start">
                        <button onClick={() => startQuiz('woordeskat')} className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                            <Play size={18} fill="currentColor" /> Toets Jouself
                        </button>
                    </div>
                </div>

                <div className="relative z-10 hidden md:block opacity-30 rotate-12">
                    <Award size={200} className="text-white" />
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
                    <button
                        onClick={() => setActiveTab('woordeskat')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'woordeskat' ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Woordeskat
                    </button>
                    <button
                        onClick={() => setActiveTab('grammatika')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'grammatika' ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Grammatika
                    </button>
                </div>

                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Soek..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none w-full md:w-64 transition-all shadow-sm text-sm"
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
                                subtitle: topic.category,
                                description: topic.desc,
                                iconComponent: <Award className="w-8 h-8 text-orange-400" />
                            }}
                            onClick={() => setSelectedTopic(topic)}
                            colorClass="text-orange-600"
                            bgGradient="from-orange-50 to-amber-100"
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
                                <span className="text-xs font-bold tracking-wider text-orange-600 uppercase mb-2 block">{selectedTopic.category}</span>
                                <h2 className="text-3xl font-extrabold text-slate-800 mb-4">{selectedTopic.title}</h2>
                                <p className="text-slate-600 text-lg mb-6">{selectedTopic.desc}</p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-700">Voorbeelde (Examples)</h4>
                                {selectedTopic.examples.map((ex, i) => (
                                    <div key={i} className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-orange-800 font-medium">
                                        {ex}
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
                title={quizCategory === 'woordeskat' ? 'Woordeskat Toets' : 'Grammatika Toets'}
                questions={FIXED_QUESTIONS[quizCategory] || []}
                onComplete={handleQuizComplete}
                colorClass="bg-orange-500"
            />
        </div>
    );
}
