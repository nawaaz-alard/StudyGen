
import { Award } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface BadgeModalProps {
    badgeId: string;
    isOpen: boolean;
    onClose: () => void;
}

const BADGE_INFO: Record<string, { title: string; desc: string; color: string }> = {
    'lvl5_wizard': { title: 'Level 5 Wizard', desc: 'You have mastered the basics!', color: 'text-indigo-400' },
    'lvl10_master': { title: 'Level 10 Master', desc: 'You are becoming a true scholar!', color: 'text-yellow-400' },
};

export function BadgeModal({ badgeId, isOpen, onClose }: BadgeModalProps) {
    const info = BADGE_INFO[badgeId] || { title: 'Achievement Unlocked', desc: 'You earned a new badge!', color: 'text-white' };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.5, y: 50, rotate: -10 }}
                        animate={{ scale: 1, y: 0, rotate: 0, transition: { type: 'spring', bounce: 0.5 } }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-slate-900 border-2 border-yellow-500/50 p-8 rounded-3xl max-w-sm w-full text-center relative shadow-[0_0_50px_rgba(234,179,8,0.3)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none opacity-20"
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent,rgba(234,179,8,0.5),transparent)]" />
                        </motion.div>

                        <div className="relative z-10">
                            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
                                <Award className="text-white" size={48} />
                            </div>

                            <h2 className={`text-3xl font-bold mb-2 ${info.color}`}>{info.title}</h2>
                            <p className="text-slate-300 mb-8 text-lg">{info.desc}</p>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl transition-colors"
                            >
                                Awesome!
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
