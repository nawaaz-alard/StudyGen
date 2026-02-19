
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Crown } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { Link } from 'react-router-dom';

interface LeaderboardUser {
    id: string;
    name: string;
    xp: number;
    level: number;
    avatar?: string;
    rank: number;
}

const MOCK_LEADERBOARD: LeaderboardUser[] = [
    { id: '1', name: 'Sarah Connor', xp: 15400, level: 42, rank: 1 },
    { id: '2', name: 'John Doe', xp: 12350, level: 35, rank: 2 },
    { id: '3', name: 'Alice Wonder', xp: 11200, level: 31, rank: 3 },
    { id: '4', name: 'Bob Builder', xp: 9800, level: 28, rank: 4 },
    { id: '5', name: 'Charlie Day', xp: 8500, level: 25, rank: 5 },
    { id: '6', name: 'Diana Prince', xp: 7200, level: 21, rank: 6 },
    { id: '7', name: 'Bruce Wayne', xp: 6400, level: 19, rank: 7 },
    { id: '8', name: 'Clark Kent', xp: 5100, level: 16, rank: 8 },
    { id: '9', name: 'Peter Parker', xp: 4300, level: 14, rank: 9 },
    { id: '10', name: 'Tony Stark', xp: 3200, level: 11, rank: 10 },
];

export default function Leaderboard() {
    const { user } = useUser();
    const [timeframe, setTimeframe] = useState<'weekly' | 'all-time'>('weekly');

    // Insert current user into mock data for demo purposes if not already there
    const userRank = 15; // Mock rank
    const displayList = [...MOCK_LEADERBOARD];

    return (
        <div className="page-padding pt-8 min-h-screen">
            <Link to="/" className="back-link mb-8 inline-block">
                ← Back to Dashboard
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
                        <Crown size={40} className="text-yellow-400" />
                        Leaderboard
                    </h1>
                    <p className="text-slate-400">See who's leading the pack!</p>
                </div>

                {/* Filters */}
                <div className="flex justify-center mb-8">
                    <div className="glass p-1 rounded-xl inline-flex">
                        <button
                            onClick={() => setTimeframe('weekly')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${timeframe === 'weekly' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setTimeframe('all-time')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${timeframe === 'all-time' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            All Time
                        </button>
                    </div>
                </div>

                {/* Top 3 Podium */}
                <div className="grid grid-cols-3 gap-4 md:gap-8 items-end mb-12 px-4">
                    {/* 2nd Place */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-slate-700 border-4 border-slate-500 mb-4 flex items-center justify-center relative shadow-xl">
                            <span className="text-2xl font-bold text-slate-300">2</span>
                        </div>
                        <div className="glass p-4 rounded-t-2xl w-full text-center h-32 flex flex-col justify-end border-t-4 border-slate-400 bg-gradient-to-b from-slate-400/10 to-transparent">
                            <p className="font-bold text-slate-200 truncate">{displayList[1].name}</p>
                            <p className="text-xs text-slate-400">{displayList[1].xp} XP</p>
                        </div>
                    </motion.div>

                    {/* 1st Place */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="flex flex-col items-center z-10"
                    >
                        <div className="w-24 h-24 rounded-full bg-yellow-500/20 border-4 border-yellow-400 mb-4 flex items-center justify-center relative shadow-xl shadow-yellow-500/20">
                            <Crown size={40} className="text-yellow-400 absolute -top-10" />
                            <span className="text-3xl font-bold text-yellow-400">1</span>
                        </div>
                        <div className="glass p-4 rounded-t-2xl w-full text-center h-40 flex flex-col justify-end border-t-4 border-yellow-400 bg-gradient-to-b from-yellow-400/10 to-transparent">
                            <p className="font-bold text-yellow-100 text-lg truncate">{displayList[0].name}</p>
                            <p className="text-sm text-yellow-400 font-bold">{displayList[0].xp} XP</p>
                        </div>
                    </motion.div>

                    {/* 3rd Place */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-amber-900/40 border-4 border-amber-700 mb-4 flex items-center justify-center relative shadow-xl">
                            <span className="text-2xl font-bold text-amber-600">3</span>
                        </div>
                        <div className="glass p-4 rounded-t-2xl w-full text-center h-28 flex flex-col justify-end border-t-4 border-amber-700 bg-gradient-to-b from-amber-700/10 to-transparent">
                            <p className="font-bold text-slate-200 truncate">{displayList[2].name}</p>
                            <p className="text-xs text-slate-400">{displayList[2].xp} XP</p>
                        </div>
                    </motion.div>
                </div>

                {/* List */}
                <div className="glass rounded-3xl overflow-hidden">
                    {displayList.slice(3).map((u) => (
                        <div key={u.id} className="flex items-center p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                            <span className="w-8 text-center font-bold text-slate-500">{u.rank}</span>
                            <div className="w-10 h-10 rounded-full bg-slate-700 mx-4 flex items-center justify-center">
                                <User size={16} className="text-slate-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-white">{u.name}</h4>
                                <span className="text-xs text-slate-500">Level {u.level}</span>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-indigo-400">{u.xp} XP</span>
                            </div>
                        </div>
                    ))}

                    {/* User's Rank (Fixed at bottom) */}
                    <div className="bg-indigo-900/40 p-4 border-t border-indigo-500/30 flex items-center relative">
                        <div className="absolute inset-0 bg-indigo-500/5 animate-pulse" />
                        <span className="w-8 text-center font-bold text-indigo-300">{userRank}</span>
                        <div className="w-10 h-10 rounded-full bg-indigo-600 mx-4 flex items-center justify-center border-2 border-indigo-400">
                            {user.picture ? <img src={user.picture} alt="You" className="w-full h-full rounded-full" /> : <User size={16} className="text-white" />}
                        </div>
                        <div className="flex-1 relative z-10">
                            <h4 className="font-bold text-white">You</h4>
                            <span className="text-xs text-indigo-300">Level {user.level}</span>
                        </div>
                        <div className="text-right relative z-10">
                            <span className="font-bold text-white">{user.xp} XP</span>
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
