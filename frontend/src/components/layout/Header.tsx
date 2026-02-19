
import { useUser } from '../../context/UserContext';
import { Monitor, User, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
    const { user, login, logout } = useUser();
    return (
        <header className="glass header">
            <Link to="/" className="header-brand no-underline">
                <Monitor className="text-secondary" size={32} color="#a78bfa" />
                <h2 className="header-title">StudyGen Hub</h2>
            </Link>
            <div className="header-actions">
                {user.isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        <Link to="/progress" className="hidden md:flex items-center gap-2 px-3 py-1.5 glass rounded-lg hover:bg-white/10 transition-colors no-underline">
                            <span className="text-xl">🔥</span>
                            <span className="text-sm font-bold text-orange-400">{user.streak} Day Streak</span>
                        </Link>

                        <Link to="/leaderboard" className="hidden md:flex items-center gap-2 px-3 py-1.5 glass rounded-lg hover:bg-white/10 transition-colors no-underline text-yellow-500">
                            <Crown size={16} />
                        </Link>

                        <Link to="/progress" className="text-sm font-bold text-slate-300 hover:text-white transition-colors no-underline">
                            Lvl {user.level} {user.name.split(' ')[0]}
                        </Link>

                        <button onClick={logout} className="glass-btn btn-login text-sm">Logout</button>
                    </div>
                ) : (
                    <button onClick={() => login()} className="glass-btn btn-login">
                        <User size={18} /> Login
                    </button>
                )}
            </div>
        </header>
    )
}
