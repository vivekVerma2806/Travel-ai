import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Map, MessageSquare,
    CheckCircle, XCircle, Clock, ChevronRight,
    Search, Filter, ExternalLink, ShieldCheck, Plus, Compass
} from 'lucide-react';
import api from '../service/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/toast';

const OrganiserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [trips, setTrips] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user || (user.role !== 'organiser' && user.role !== 'admin')) {
            navigate('/');
            return;
        }
        fetchOrganiserData();
    }, [user, navigate]);

    const fetchOrganiserData = async () => {
        setLoading(true);
        try {
            const [tripsRes, requestsRes] = await Promise.all([
                api.get('/organiser/my-managed-trips'),
                api.get('/organiser/join-requests')
            ]);
            setTrips(tripsRes.data || []);
            setRequests(requestsRes.data || []);
        } catch (err) {
            console.error("Failed to fetch organiser data", err);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleRequestAction = async (requestId, status) => {
        try {
            await api.put(`/organiser/requests/${requestId}/validate`, { status });
            toast.success(`Request ${status} successfully`);
            fetchOrganiserData(); // Refresh
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update request");
        }
    };

    const pendingRequests = requests.filter(r => r.status === 'pending');
    const approvedRequests = requests.filter(r => r.status === 'approved');

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Organiser Hub...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#00B4D8]">
                            Expedition Coordination
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628] font-jakarta mt-0.5">
                            Organiser Hub
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Welcome back, <span className="font-bold text-[#0A1628]">{user?.username}</span>. Manage your journeys and traveler requests.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#00B4D8]" />
                            Organiser Access
                        </span>
                        <button
                            onClick={() => navigate('/create-trip')}
                            className="px-4 py-2 bg-[#00B4D8] hover:bg-[#0096B4] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Plan New Journey</span>
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-xl shadow-xs w-fit">
                    {[
                        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                        { id: 'trips', label: `Managed Journeys (${trips.length})`, icon: Map },
                        { id: 'requests', label: `Join Requests (${requests.length})`, icon: Users },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                activeTab === item.id
                                    ? 'bg-[#00B4D8] text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <item.icon className="w-3.5 h-3.5" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab 1: Overview */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Managed Journeys</span>
                                    <p className="text-3xl font-black text-[#0A1628] font-jakarta mt-1">{trips.length}</p>
                                </div>
                                <div className="p-3 bg-[#E0F2FE] rounded-xl text-[#00B4D8]">
                                    <Map className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Approved Travelers</span>
                                    <p className="text-3xl font-black text-[#0A1628] font-jakarta mt-1">{approvedRequests.length}</p>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                                    <Users className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Actions</span>
                                    <p className="text-3xl font-black text-[#FF6B35] font-jakarta mt-1">{pendingRequests.length}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-xl text-[#FF6B35]">
                                    <Clock className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        {/* Recent Requests Table/Card */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="font-extrabold text-sm text-[#0A1628] font-jakarta">Recent Join Requests</h3>
                                    <p className="text-[11px] text-slate-400">Travelers seeking permission to embark on your curated paths.</p>
                                </div>
                                <button
                                    onClick={() => setActiveTab('requests')}
                                    className="text-xs font-bold text-[#00B4D8] hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <span>View All</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {requests.slice(0, 5).map((req) => (
                                    <div key={req._id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0096B4] flex items-center justify-center font-bold text-xs uppercase">
                                                {req.userId?.username?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-xs text-[#0A1628]">{req.userId?.username || 'Explorer'}</h4>
                                                <p className="text-[11px] text-slate-500">
                                                    Requested path: <span className="font-bold text-[#00B4D8]">{req.tripId?.destination || 'Destination'}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {req.status === 'pending' ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleRequestAction(req._id, 'approved')}
                                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        <span>Approve</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestAction(req._id, 'rejected')}
                                                        className="px-3 py-1.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        <span>Reject</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    req.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                    'bg-rose-50 text-rose-700 border border-rose-200'
                                                }`}>
                                                    {req.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {requests.length === 0 && (
                                    <div className="py-12 text-center">
                                        <img
                                            src="/assets/pathora/illustrations/no-results.svg"
                                            alt="No requests"
                                            className="w-32 h-24 mx-auto mb-3 object-contain opacity-60"
                                        />
                                        <p className="text-xs text-slate-400 font-medium">No pending join requests at this time.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Trips */}
                {activeTab === 'trips' && (
                    <div className="space-y-6">
                        {trips.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {trips.map((trip) => {
                                    const tripApprovedCount = requests.filter(r => (r.tripId?._id === trip._id || r.tripId === trip._id) && r.status === 'approved').length;
                                    return (
                                        <div key={trip._id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#00B4D8]/30 transition-all flex flex-col justify-between">
                                            <div className="relative h-44 bg-slate-100 overflow-hidden">
                                                <img
                                                    src={trip.tripData?.locationInfo?.photoUrl ||
                                                         (trip.destination?.toLowerCase().includes("kyoto") ? "/assets/pathora/destinations/kyoto-banner.jpg" :
                                                          trip.destination?.toLowerCase().includes("bali") ? "/assets/pathora/destinations/bali.jpg" :
                                                          trip.destination?.toLowerCase().includes("paris") ? "/assets/pathora/destinations/paris.jpg" :
                                                          "/assets/pathora/destinations/santorini.jpg")}
                                                    alt={trip.destination}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-3 left-3">
                                                    <span className="px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-lg text-[10px] font-bold text-[#0A1628] shadow-xs">
                                                        {trip.duration || 3} Days • {trip.budget || 'Moderate'}
                                                    </span>
                                                </div>
                                                <div className="absolute top-3 right-3">
                                                    <span className="px-2.5 py-1 bg-[#00B4D8] text-white rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-xs">
                                                        Active Hub
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-5 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-base font-extrabold text-[#0A1628] font-jakarta mb-1 truncate">
                                                        {trip.destination}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 mb-4">
                                                        {tripApprovedCount} Joined Explorers
                                                    </p>
                                                </div>

                                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                                    <button
                                                        onClick={() => navigate(`/view-trip/${trip._id}`)}
                                                        className="text-xs font-bold text-[#00B4D8] hover:underline flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <span>View Public Path</span>
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/chat?tripId=${trip._id}`)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0096B4] flex items-center gap-1 transition-colors cursor-pointer"
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                        <span>Chat</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center max-w-md mx-auto shadow-xs">
                                <img
                                    src="/assets/pathora/illustrations/empty-trips.svg"
                                    alt="No trips"
                                    className="w-44 h-32 mx-auto mb-4"
                                />
                                <h3 className="text-base font-bold text-[#0A1628] font-jakarta mb-1">No Managed Journeys Yet</h3>
                                <p className="text-xs text-slate-500 mb-6">Create a trip and activate lead organizer features to coordinate groups.</p>
                                <button
                                    onClick={() => navigate('/create-trip')}
                                    className="px-5 py-2.5 bg-[#00B4D8] hover:bg-[#0096B4] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                                >
                                    Create First Journey
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 3: Requests */}
                {activeTab === 'requests' && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h3 className="font-extrabold text-sm text-[#0A1628] font-jakarta">Incoming Join Requests</h3>
                                <p className="text-[11px] text-slate-400">Review, validate, or reject travelers requesting to join your expeditions.</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#F8FAFC] border-b border-slate-100">
                                    <tr>
                                        <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Explorer</th>
                                        <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Destination</th>
                                        <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Decision</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {requests.map((req) => (
                                        <tr key={req._id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0096B4] flex items-center justify-center text-xs font-bold uppercase">
                                                        {req.userId?.username?.[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-xs text-[#0A1628]">{req.userId?.username || 'Explorer'}</div>
                                                        <div className="text-[11px] text-slate-400">{req.userId?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-xs font-bold text-[#0A1628]">
                                                {req.tripId?.destination || 'Custom Path'}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    req.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                    req.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                    'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                {req.status === 'pending' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleRequestAction(req._id, 'approved')}
                                                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleRequestAction(req._id, 'rejected')}
                                                            className="px-3 py-1 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400 font-medium italic">Validated</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {requests.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-5 py-12 text-center text-slate-400 text-xs">
                                                No join requests received yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default OrganiserDashboard;
