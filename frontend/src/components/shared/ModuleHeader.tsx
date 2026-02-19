
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, User } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { Link } from 'react-router-dom';

interface ModuleHeaderProps {
    title: string;
    subtitle: string;
    colorClass: string; // e.g., 'text-green-600'
    bgClass: string;    // e.g., 'bg-green-500'
    icon: React.ReactNode;
}

export const ModuleHeader = ({ title, subtitle, colorClass, bgClass, icon }: ModuleHeaderProps) => {
    const { user } = useUser();
    const progressPercent = Math.min((user.xp % 100), 100); // Simplified level progress for now

    return (
        <div className="glass p-4 mb-6 flex justify-between items-center relative overflow-hidden">
            <div className={`absolute inset-0 ${colorClass.replace('text', 'bg')}/10 pointer-events-none`} />

            <div className="z-10 flex items-center gap-3">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <div className={`${bgClass} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg`}>
                        {icon}
                    </div>
                </Link>
                <div>
                    <h1 className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorClass} via-slate-500 to-slate-800`}>
                        {title}
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">{subtitle} • Lvl {user.level}</p>
                </div>
            </div>

            <div className="z-10 flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end min-w-[100px]">
                    <div className={`text-xs font-bold ${colorClass.replace('from-', 'text-').split(' ')[0]}`}>{user.xp} XP</div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                        <motion.div
                            className={`h-full ${bgClass}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 relative">
                    <Zap size={20} />
                    {user.xp > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />}
                </button>

                <div className="md:hidden">
                    <User size={24} className="text-slate-400" />
                </div>
            </div>
        </div>
    );
};
