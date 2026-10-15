import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, User, Compass, MessageSquare, Plus, Bell } from 'lucide-react'
import NotificationDropdown from "../NotificationDropdown";
import api, { getBackendUrl } from '../../service/api'
import { io } from "socket.io-client";
import { useToast } from '../ui/toast';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, logout, refreshUser } = useAuth()
    const navigate = useNavigate();
    const { toast } = useToast();

    // Refresh user data on mount to sync roles
    useEffect(() => {
        if (user) {
            refreshUser();
        }
    }, []);

    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);

    // Fetch Notifications on load
    useEffect(() => {
        if (user) {
            fetchNotifications();

            // Connect Socket
            const socketUrl = getBackendUrl();
            const newSocket = io(socketUrl, {
                withCredentials: true
            });
            setSocket(newSocket);

            newSocket.on(`notification_${user.id}`, (newNotif) => {
                setNotifications(prev => [newNotif, ...prev]);
                toast({
                    title: "New Notification",
                    description: newNotif.message,
                });
            });

            return () => newSocket.disconnect();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put(`/notifications/mark-all-read`);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all read", error);
        }
    };

    return (
        <header className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-18">

                    {/* Pathora Logo Brand Lockup */}
                    <Link to="/" className="flex items-center gap-3 group cursor-pointer select-none">
                        <img
                            src="/logo.png"
                            alt="Pathora Logo"
                            className="w-10 h-10 rounded-xl object-contain shadow-xs transform group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="flex flex-col">
                            <span className="font-extrabold text-xl tracking-tight text-[#0A1628] font-jakarta leading-none group-hover:text-[#00B4D8] transition-colors">
                                Pathora
                            </span>
                            <span className="text-[11px] font-semibold text-[#00B4D8] tracking-wider mt-0.5">
                                Every Journey Has a Path.
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <Link
                            to="/"
                            className="px-3.5 py-2 text-sm text-slate-700 hover:text-[#00B4D8] font-medium rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/explore"
                            className="px-3.5 py-2 text-sm text-slate-700 hover:text-[#00B4D8] font-medium rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Explore
                        </Link>
                        <Link
                            to="/about"
                            className="px-3.5 py-2 text-sm text-slate-700 hover:text-[#00B4D8] font-medium rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className="px-3.5 py-2 text-sm text-slate-700 hover:text-[#00B4D8] font-medium rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Right Action Bar */}
                    <div className="hidden md:flex items-center gap-2.5">
                        {user ? (
                            <>
                                <Link to="/my-trips">
                                    <Button variant="ghost" size="sm" className="text-slate-700 hover:text-[#00B4D8] hover:bg-slate-50">
                                        My Trips
                                    </Button>
                                </Link>
                                <Link to="/chat">
                                    <Button variant="ghost" size="sm" className="text-slate-700 hover:text-[#00B4D8] hover:bg-[#F0F9FF]">
                                        <MessageSquare className="w-4 h-4 mr-1 text-[#00B4D8]" />
                                        Chat
                                    </Button>
                                </Link>
                                <Link to="/create-trip">
                                    <Button size="sm" className="bg-[#00B4D8] hover:bg-[#0096B4] text-white shadow-sm shadow-cyan-500/20">
                                        <Plus className="w-4 h-4 mr-1" />
                                        Plan Trip
                                    </Button>
                                </Link>

                                {user?.role === 'admin' && (
                                    <Button asChild size="sm" className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-2.5">
                                        <Link to="/admin">Admin</Link>
                                    </Button>
                                )}
                                {user?.role === 'organiser' && (
                                    <Button asChild size="sm" className="bg-[#0A1628] hover:bg-[#16243C] text-white text-xs px-2.5">
                                        <Link to="/organiser">Organiser</Link>
                                    </Button>
                                )}

                                {/* Notification Bell */}
                                <NotificationDropdown
                                    notifications={notifications}
                                    onMarkRead={handleMarkRead}
                                    onMarkAllRead={handleMarkAllRead}
                                />

                                {/* User profile badge & logout */}
                                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                                    <Link to="/profile" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-[#0A1628] text-white flex items-center justify-center font-bold text-xs">
                                            {(user.username || user.email || "P")[0].toUpperCase()}
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs font-semibold text-slate-800 leading-tight">
                                                {user.username || user.email.split('@')[0]}
                                            </span>
                                            <span className="text-[10px] text-[#00B4D8] capitalize font-medium">
                                                {user.role || 'Member'}
                                            </span>
                                        </div>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            logout();
                                            navigate('/');
                                        }}
                                        className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                        title="Logout"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm" className="text-slate-700 hover:text-[#00B4D8] font-medium">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm" className="bg-[#00B4D8] hover:bg-[#0096B4] text-white px-5 rounded-xl shadow-sm shadow-[#00B4D8]/30">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                        aria-label="Toggle Navigation"
                    >
                        <div className="w-6 h-5 flex flex-col justify-between">
                            <span className={`w-full h-0.5 bg-slate-800 rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`w-full h-0.5 bg-slate-800 rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-full h-0.5 bg-slate-800 rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </div>
                    </button>
                </div>

                {/* Mobile Drawer */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-100 animate-slideDown space-y-2">
                        <Link
                            to="/"
                            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-[#F0F9FF] hover:text-[#00B4D8] rounded-lg"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/explore"
                            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-[#F0F9FF] hover:text-[#00B4D8] rounded-lg"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Explore
                        </Link>
                        <Link
                            to="/about"
                            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-[#F0F9FF] hover:text-[#00B4D8] rounded-lg"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-[#F0F9FF] hover:text-[#00B4D8] rounded-lg"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </Link>

                        {user ? (
                            <div className="pt-3 border-t border-slate-100 space-y-2">
                                <Link
                                    to="/my-trips"
                                    className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Trips
                                </Link>
                                <Link
                                    to="/chat"
                                    className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Group Chat
                                </Link>
                                <Link
                                    to="/create-trip"
                                    className="block px-3 py-2 text-base font-medium text-white bg-[#00B4D8] rounded-xl text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    + Plan New Trip
                                </Link>
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile ({user.username || user.email})
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        logout();
                                        navigate('/');
                                    }}
                                    className="w-full text-left px-3 py-2 text-base font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#00B4D8] rounded-xl shadow-xs"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header
