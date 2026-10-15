import React from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import api from '../service/api';

const NotificationDropdown = ({ notifications, onMarkRead, onMarkAllRead }) => {
    const navigate = useNavigate();
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleItemClick = async (notif) => {
        if (!notif.isRead) {
            onMarkRead(notif._id);
        }
        if (notif.link) {
            navigate(notif.link);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-gray-600" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-84 p-0 rounded-2xl border border-slate-200 shadow-xl bg-white" align="end" forceMount>
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-[#0A1628] font-jakarta">Notifications</span>
                    {unreadCount > 0 && (
                        <button
                            className="text-[11px] font-bold text-[#00B4D8] hover:text-[#0096B4] transition-colors cursor-pointer"
                            onClick={onMarkAllRead}
                        >
                            Mark all read
                        </button>
                    )}
                </div>
                <ScrollArea className="h-[320px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                            <img
                                src="/assets/pathora/illustrations/no-notifications.svg"
                                alt="No notifications"
                                className="w-24 h-24 mb-3 object-contain"
                            />
                            <p className="text-xs font-bold text-[#0A1628]">All Caught Up!</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">No notifications on your path right now.</p>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <div
                                key={notif._id}
                                onClick={() => handleItemClick(notif)}
                                className={`
                                    flex items-start gap-3 p-3.5 text-xs cursor-pointer transition-colors border-b border-slate-100 last:border-0
                                    ${notif.isRead ? 'bg-white hover:bg-slate-50' : 'bg-[#F0F9FF] hover:bg-[#E0F2FE]/60'}
                                `}
                            >
                                <div className={`
                                    mt-1.5 h-2 w-2 rounded-full flex-shrink-0
                                    ${notif.isRead ? 'bg-slate-300' : 'bg-[#00B4D8] ring-2 ring-[#00B4D8]/20'}
                                `} />
                                <div className="flex-1 space-y-1">
                                    <p className={`leading-snug ${notif.isRead ? 'text-slate-600' : 'text-[#0A1628] font-bold'}`}>
                                        {notif.message}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        {new Date(notif.createdAt).toLocaleDateString()} • {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationDropdown;
