
import React from 'react';
import { motion } from 'framer-motion';

export interface Topic {
    title: string;
    subtitle?: string; // used for tags or extra info
    icon?: string; // HTML string for SVG
    iconComponent?: React.ReactNode; // React Node for Icon
    description?: string;
    tag?: string;
}

interface TopicCardProps {
    topic: Topic;
    onClick: () => void;
    colorClass?: string; // e.g. 'text-green-600'
    bgGradient?: string; // e.g. 'from-green-50 to-emerald-100'
}

export const TopicCard = ({ topic, onClick, colorClass = 'text-indigo-600', bgGradient = 'from-indigo-50 to-blue-100' }: TopicCardProps) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`glass p-0 cursor-pointer overflow-hidden group border border-slate-200 hover:border-opacity-50 transition-all`}
        onClick={onClick}
    >
        <div className={`h-24 bg-gradient-to-br ${bgGradient} relative p-4 flex items-center justify-center ${colorClass}`}>
            {topic.icon ? (
                <div dangerouslySetInnerHTML={{ __html: topic.icon }} className="w-12 h-12 [&>svg]:w-full [&>svg]:h-full" />
            ) : (
                <div className="w-12 h-12 flex items-center justify-center">{topic.iconComponent}</div>
            )}
        </div>
        <div className="p-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className={`font-bold text-slate-800 group-hover:${colorClass} transition-colors line-clamp-1`}>{topic.title}</h3>
                {topic.tag && (
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">{topic.tag}</span>
                )}
            </div>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{topic.description || topic.subtitle}</p>
        </div>
    </motion.div>
);
