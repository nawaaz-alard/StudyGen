
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Lock, Calculator, Atom, Award, Brain, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { MOCK_MODULES } from '../../data/mockData';
import type { Module } from '../../data/mockData';
import PomodoroTimer from '../../components/tools/PomodoroTimer';
import DailyChallenge from '../../components/tools/DailyChallenge';

export default function Dashboard() {
    const [modules, setModules] = useState<Module[]>(MOCK_MODULES)

    useEffect(() => {
        // Attempt to fetch from consolidated API
        fetch('/api/getModules')
            .then(res => {
                const contentType = res.headers.get("content-type");
                if (res.ok && contentType && contentType.includes("application/json")) {
                    return res.json();
                }
                throw new Error("API not available (likely dev mode)");
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setModules(data.map((m: any) => ({
                        ...m,
                        icon: <BookOpen className="w-8 h-8" />,
                        description: m.description || "Loaded from Consolidated API"
                    })))
                }
            })
            .catch(err => {
                console.warn("API Fetch Failed - using Mock Data for demo", err);
            })
    }, [])

    const getIcon = (id: string) => {
        switch (id) {
            case 'math': return <Calculator className="w-8 h-8" />;
            case 'lifescience': return <Atom className="w-8 h-8" />;
            case 'afrikaans': return <Award className="w-8 h-8" />;
            default: return <BookOpen className="w-8 h-8" />;
        }
    }

    return (
        <div>
            {/* Tools Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Brain className="text-purple-400" /> Daily Focus
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DailyChallenge />
                    <PomodoroTimer />
                </div>
            </section>

            {/* Modules Section */}
            <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="text-cyan-400" /> Study Modules
                </h2>
                <div className="grid-layout">
                    {modules.map((mod, i) => (
                        <motion.div
                            key={mod.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="glass module-card"
                        >
                            <div className="module-bg-glow" />

                            <div className="module-icon-container">
                                {getIcon(mod.id)}
                            </div>

                            <div>
                                <h3 className="module-title">{mod.name}</h3>
                                <p className="module-desc">{mod.description}</p>
                            </div>

                            <div className="module-footer">
                                {mod.authorized ? (
                                    <Link to={`/modules/${mod.id}`} style={{ textDecoration: 'none' }}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="btn-access"
                                        >
                                            Access Module
                                        </motion.button>
                                    </Link>
                                ) : (
                                    <div className="locked-badge">
                                        <Lock size={18} /> <span>Subscription Required</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    )
}
