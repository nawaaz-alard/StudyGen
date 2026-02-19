
import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function PomodoroTimer() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');

    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Switch modes automatically for demo
            if (mode === 'focus') {
                setMode('break');
                setTimeLeft(5 * 60);
            } else {
                setMode('focus');
                setTimeLeft(25 * 60);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="glass p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-indigo-900/30 to-purple-900/30">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🍅</span> Focus Timer
            </h3>

            <div className="flex justify-center mb-6">
                <div className="text-5xl font-mono font-bold text-white tracking-wider tabular-nums">
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="flex justify-center gap-3 mb-4">
                <button
                    onClick={() => { setMode('focus'); setTimeLeft(25 * 60); setIsActive(false); }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${mode === 'focus' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                    Focus
                </button>
                <button
                    onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${mode === 'break' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                    Break
                </button>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={toggleTimer}
                    className={`p-4 rounded-xl transition-all shadow-lg ${isActive ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                    aria-label={isActive ? "Pause Timer" : "Start Timer"}
                    title={isActive ? "Pause Timer" : "Start Timer"}
                >
                    {isActive ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="p-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all shadow-lg"
                    aria-label="Reset Timer"
                    title="Reset Timer"
                >
                    <RotateCcw size={24} />
                </button>
            </div>
        </div>
    );
}
