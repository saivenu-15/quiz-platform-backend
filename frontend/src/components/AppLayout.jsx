import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, LayoutDashboard, BookOpen, Trophy, LogOut, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const AppLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const { onlineUsers } = useSocket();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
        { label: 'Explore Quizzes', icon: BookOpen, to: '/quizzes' },
        { label: 'Leaderboard', icon: Trophy, to: '/leaderboard' },
    ];

    return (
        <div className="min-h-screen flex bg-[#0f172a]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1e293b] border-r border-white/5 flex flex-col shrink-0 sticky top-0 h-screen">
                <div className="p-6 border-b border-white/5">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                            <Zap className="text-white fill-white" size={20} />
                        </div>
                        <span className="text-xl font-display font-bold text-white tracking-tight">Quiz<span className="text-blue-500">Pulse</span></span>
                    </Link>
                    <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-fit">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{onlineUsers} Online Now</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.to;
                        return (
                            <Link
                                key={item.label}
                                to={item.to}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 text-sm font-semibold transition-all"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
