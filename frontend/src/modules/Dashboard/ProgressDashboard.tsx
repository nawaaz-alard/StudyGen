
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Award, Zap, TrendingUp, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { format } from 'date-fns';

export default function ProgressDashboard() {
    const { user, toggleTheme, toggleSound } = useUser();

    // Prepare data for charts
    const recentActivity = user.quizHistory.slice(-7).map((h, i) => ({
        name: `Quiz ${i + 1}`,
        score: (h.score / h.total) * 100,
        date: format(new Date(h.date), 'MMM dd')
    }));

    return (
        <div className="page-padding pt-8 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                            My Progress
                        </h1>
                        <p className="text-slate-400">Track your learning journey and achievements</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"
                            title={user.preferences.theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
                        >
                            {user.preferences.theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
                        </button>
                        <button
                            onClick={toggleSound}
                            className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"
                            title={user.preferences.soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
                        >
                            {user.preferences.soundEnabled ? <Volume2 size={20} className="text-green-400" /> : <VolumeX size={20} className="text-red-400" />}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass p-6 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap size={100} />
                        </div>
                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Current Streak</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">{user.streak}</span>
                            <span className="text-slate-400">Days</span>
                        </div>
                        <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 w-full animate-pulse" style={{ width: `${Math.min(user.streak * 10, 100)}%` }} />
                        </div>
                    </div>

                    <div className="glass p-6 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Award size={100} />
                        </div>
                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Total XP</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">{user.xp}</span>
                            <span className="text-slate-400">XP</span>
                        </div>
                        <p className="text-sm text-cyan-400 mt-2">Level {user.level} Explorer</p>
                    </div>

                    <div className="glass p-6 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp size={100} />
                        </div>
                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Quizzes Completed</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">{user.completedQuizzes.length}</span>
                            <span className="text-slate-400">Quizzes</span>
                        </div>
                        <p className="text-sm text-emerald-400 mt-2">{user.quizHistory.length} total attempts</p>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="glass p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="text-cyan-400" size={20} /> Performance History
                        </h3>
                        <div className="h-64">
                            {recentActivity.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={recentActivity}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                                        <YAxis stroke="#94a3b8" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                            itemStyle={{ color: '#38bdf8' }}
                                        />
                                        <Line type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#38bdf8' }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500">
                                    No quiz data yet. Take a quiz to see your stats!
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Award className="text-yellow-400" size={20} /> Badges Earned
                        </h3>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {user.badges.length > 0 ? user.badges.map((badge, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
                                    className="aspect-square bg-slate-800/50 rounded-2xl flex flex-col items-center justify-center p-2 border border-white/5 hover:border-yellow-500/50 transition-colors group cursor-pointer"
                                    title={badge}
                                >
                                    <Award className="text-yellow-500 mb-2 group-hover:scale-110 transition-transform" size={32} />
                                    <span className="text-[10px] text-center text-slate-400 font-bold uppercase truncate w-full">{badge.replace('lvl', 'Level ').replace('_', ' ')}</span>
                                </motion.div>
                            )) : (
                                <div className="col-span-full text-center text-slate-500 py-12">
                                    No badges yet. Keep leveling up!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
