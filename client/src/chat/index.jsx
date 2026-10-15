import React, { useState, useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import { Send, MessageCircle, LogOut, Lock, Image as ImageIcon, X, Loader2, ArrowLeft, Users, Phone, Search, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api, { getBackendUrl } from '../service/api';

function Chat() {
    const { user } = useContext(AuthContext);
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [socket, setSocket] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);
    const [approvedTrips, setApprovedTrips] = useState([]);
    const [loadingTrips, setLoadingTrips] = useState(false);
    const [currentTripDetails, setCurrentTripDetails] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tripId = searchParams.get('tripId');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messageList]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!tripId) {
            setLoadingTrips(true);
            api.get('/bookings/user-bookings')
                .then(res => {
                    const approved = res.data.filter(b => b.status === 'approved' && b.tripId);
                    setApprovedTrips(approved);
                })
                .catch(err => console.error("Failed to fetch approved trips", err))
                .finally(() => setLoadingTrips(false));
            return;
        }

        // Fetch Trip Title/Details for Header
        api.get(`/trips/${tripId}`).then(res => {
            if (res.data) setCurrentTripDetails(res.data);
        }).catch(() => {});

        // FETCH HISTORY
        api.get(`/messages/${tripId}`).then((response) => {
            const history = response.data.map(msg => ({
                tripId: msg.tripId,
                author: msg.username,
                message: msg.message,
                type: msg.type || 'text',
                imageUrl: msg.imageUrl || "",
                time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            setMessageList(history);
            setAccessDenied(false);
        }).catch(err => {
            console.error("Failed to fetch chat history", err);
            if (err.response?.status === 403) {
                setAccessDenied(true);
            }
        });

        // Initialize socket with session (cookie)
        const socketUrl = getBackendUrl();
        const newSocket = io(socketUrl, {
            withCredentials: true
        });

        newSocket.on("connect", () => {
            newSocket.emit("join_chat", { tripId });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };

    }, [user, navigate, tripId]);

    // Receive Messages
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (data) => {
            setMessageList((list) => [...list, data]);
        };

        socket.on("receive_message", handleReceiveMessage);

        socket.on("error", (data) => {
            alert(data.message || "Failed to deliver message.");
        });

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("error");
        };
    }, [socket]);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const sendMessage = async () => {
        if ((currentMessage.trim() !== "" || selectedImage) && socket && tripId) {
            if (!socket.connected) {
                socket.connect();
                return;
            }

            setUploading(true);
            const messageData = {
                tripId,
                author: user.username,
                message: currentMessage.trim(),
                type: selectedImage ? 'image' : 'text',
                imageUrl: selectedImage || "",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            socket.emit("send_message", messageData);

            setCurrentMessage("");
            setSelectedImage(null);
            setUploading(false);
        }
    };

    if (!user) return null;

    if (!tripId) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-slate-100">
                        <div className="w-12 h-12 bg-[#F0F9FF] rounded-xl flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-[#00B4D8]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-[#0A1628] font-jakarta">Pathora Conversations</h2>
                            <p className="text-xs text-slate-500">Connect with travelers on your approved journeys</p>
                        </div>
                    </div>

                    {loadingTrips ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#00B4D8] mb-4" />
                            <p className="text-xs text-slate-500">Loading your journeys...</p>
                        </div>
                    ) : approvedTrips.length > 0 ? (
                        <div className="space-y-3">
                            {approvedTrips.map((booking) => (
                                <button
                                    key={booking._id}
                                    onClick={() => navigate(`/chat?tripId=${booking.tripId._id}`)}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-[#00B4D8] hover:bg-[#F0F9FF] transition-all text-left cursor-pointer group"
                                >
                                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                                        <img
                                            src={booking.hotelImage || '/assets/pathora/destinations/kyoto-banner.jpg'}
                                            alt={booking.destination}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-sm text-[#0A1628] group-hover:text-[#00B4D8] transition-colors truncate">
                                            {booking.destination}
                                        </h3>
                                        <p className="text-xs text-slate-500 truncate">{booking.hotelName || 'Group Traveler Chat'}</p>
                                    </div>
                                    <span className="px-3.5 py-1.5 rounded-xl bg-[#00B4D8] text-white text-xs font-bold shrink-0">
                                        Enter Chat
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <img
                                src="/assets/pathora/illustrations/no-notifications.svg"
                                alt="No active chats"
                                className="w-32 h-28 mx-auto mb-3"
                            />
                            <h4 className="text-base font-bold text-slate-800">No Active Conversations</h4>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                                Join a community journey and receive approval to start group messaging.
                            </p>
                            <Link
                                to="/explore"
                                className="mt-4 inline-block px-5 py-2.5 bg-[#00B4D8] hover:bg-[#0096B4] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                            >
                                Explore Journeys
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (accessDenied) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className="text-xl font-bold text-[#0A1628] mb-2 font-jakarta">Access Restricted</h2>
                    <p className="text-xs text-slate-500 mb-6">
                        You must be an approved member of this trip to view or participate in group chat.
                    </p>
                    <button
                        onClick={() => navigate(tripId ? `/view-trip/${tripId}` : '/')}
                        className="px-6 py-2.5 bg-[#0A1628] hover:bg-[#16243C] text-white text-xs font-bold rounded-xl transition-colors"
                    >
                        Return to Journey
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-72px)] bg-[#F8FAFC] py-6 px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="bg-white w-full max-w-5xl rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[82vh]">

                {/* Chat Top Header matching UI Reference */}
                <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/chat')}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors mr-1 cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-[#00B4D8] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                            {currentTripDetails?.destination?.[0] || 'P'}
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-[#0A1628] font-jakarta leading-tight">
                                {currentTripDetails?.destination || "Kyoto Cultural Adventure"}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span>Group Chat</span>
                                <span>•</span>
                                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Active Now
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to={`/view-trip/${tripId}`}
                            className="text-xs font-semibold text-[#00B4D8] hover:underline px-3 py-1.5 rounded-lg hover:bg-[#F0F9FF] transition-colors"
                        >
                            View Itinerary
                        </Link>
                    </div>
                </div>

                {/* Messages Feed Area matching UI Reference */}
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50/60 space-y-4">
                    {/* Welcome banner message */}
                    <div className="text-center py-3">
                        <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] text-slate-500">
                            Connected to Pathora live chat room
                        </span>
                    </div>

                    {messageList.map((msg, index) => {
                        const isMyMessage = user.username === msg.author;
                        return (
                            <div
                                key={index}
                                className={`flex ${isMyMessage ? "justify-end" : "justify-start"} items-end gap-2.5`}
                            >
                                {!isMyMessage && (
                                    <div className="w-8 h-8 rounded-full bg-[#0A1628] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                        {(msg.author || "P")[0].toUpperCase()}
                                    </div>
                                )}

                                <div className={`max-w-[70%] flex flex-col ${isMyMessage ? "items-end" : "items-start"}`}>
                                    <span className="text-[10px] text-slate-400 px-1 mb-1 font-medium">
                                        {msg.author} • {msg.time}
                                    </span>

                                    <div
                                        className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                                            isMyMessage
                                                ? "bg-[#00B4D8] text-white rounded-br-xs"
                                                : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                                        }`}
                                    >
                                        {msg.type === 'image' ? (
                                            <img
                                                src={msg.imageUrl}
                                                alt="Shared upload"
                                                className="max-h-60 rounded-xl object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                                onClick={() => window.open(msg.imageUrl, '_blank')}
                                            />
                                        ) : (
                                            <p className="break-words">{msg.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Image Preview */}
                {selectedImage && (
                    <div className="px-6 py-2.5 bg-[#F0F9FF] border-t border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={selectedImage} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                            <span className="text-xs font-semibold text-[#0096B4]">Image attached</span>
                        </div>
                        <button onClick={() => setSelectedImage(null)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Input Bar matching UI Reference */}
                <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2.5 text-slate-400 hover:text-[#00B4D8] hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                            title="Attach Photo"
                        >
                            <ImageIcon className="w-5 h-5" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageSelect}
                        />

                        <input
                            type="text"
                            value={currentMessage}
                            placeholder={selectedImage ? "Add a caption..." : "Type a message..."}
                            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-[#00B4D8] focus:bg-white focus:outline-none transition-all text-slate-800 placeholder-slate-400"
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />

                        <button
                            type="button"
                            onClick={sendMessage}
                            disabled={uploading}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs cursor-pointer transition-transform active:scale-95 ${
                                uploading ? 'bg-slate-300' : 'bg-[#00B4D8] hover:bg-[#0096B4]'
                            }`}
                        >
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Chat;
