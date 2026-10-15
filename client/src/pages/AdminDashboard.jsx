import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Loader2, CheckCircle, XCircle, Map, Users, Trash2, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../service/api';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [trips, setTrips] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user, navigate, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'users') {
                const res = await api.get('/users');
                setUsers(res.data);
            } else if (activeTab === 'bookings') {
                const res = await api.get('/bookings/admin/all');
                setBookings(res.data);
            } else {
                const res = await api.get('/trips/admin/all');
                setTrips(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch admin data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUserAction = async (id, action) => {
        try {
            await api.patch(`/users/${id}/${action}`);
            fetchData();
        } catch (err) {
            console.error(`User ${action} failed`, err);
        }
    };

    const handleUserDelete = async (id) => {
        if (!window.confirm("Permanently delete this user? This will remove all their data.")) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id));
            fetchData();
        } catch (err) {
            console.error("User deletion failed", err);
            alert("Failed to delete user: " + (err.response?.data?.message || err.message));
            fetchData();
        }
    };

    const handleTripStatus = async (id, status) => {
        try {
            await api.patch(`/trips/${id}/status`, { status });
            fetchData();
        } catch (err) {
            console.error("Trip status update failed", err);
        }
    };

    const handleOrganiserStatus = async (id, status) => {
        try {
            await api.patch(`/trips/${id}/organiser-status`, { status });
            fetchData();
        } catch (err) {
            console.error("Organiser status update failed", err);
        }
    };

    const handleBookingValidate = async (id, status) => {
        try {
            await api.put(`/bookings/admin/validate/${id}`, { status });
            fetchData();
        } catch (err) {
            console.error("Booking validation failed", err);
        }
    };

    const handleTripDelete = async (id) => {
        if (!window.confirm("Permanently delete this journey?")) return;
        try {
            await api.delete(`/trips/${id}`);
            setTrips(prev => prev.filter(t => t._id !== id));
            fetchData();
        } catch (err) {
            console.error("Trip deletion failed", err);
            alert("Failed to delete journey.");
            fetchData();
        }
    };

    const handleBookingDelete = async (id) => {
        if (!window.confirm("Delete this join request?")) return;
        try {
            await api.delete(`/bookings/admin/${id}`);
            setBookings(prev => prev.filter(b => b._id !== id));
            fetchData();
        } catch (err) {
            console.error("Booking deletion failed", err);
            alert("Failed to delete request.");
            fetchData();
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                            Superadmin Operations
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628] font-jakarta mt-0.5">
                            Pathora Management Console
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Admin Access: {user.username || user.email}
                        </span>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-xl shadow-xs w-fit">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'users'
                                ? 'bg-[#00B4D8] text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        <span>Platform Users ({users.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'bookings'
                                ? 'bg-[#00B4D8] text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <CheckCircle className="w-4 h-4" />
                        <span>Join Requests ({bookings.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('trips')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'trips'
                                ? 'bg-[#00B4D8] text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Map className="w-4 h-4" />
                        <span>Journey Moderation ({trips.length})</span>
                    </button>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="w-8 h-8 border-3 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-semibold text-slate-500">Loading records...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-xs">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                                        {activeTab === 'users' ? (
                                            <>
                                                <th className="px-6 py-3.5">User</th>
                                                <th className="px-6 py-3.5">Email</th>
                                                <th className="px-6 py-3.5">Role</th>
                                                <th className="px-6 py-3.5">Status</th>
                                                <th className="px-6 py-3.5 text-right">Actions</th>
                                            </>
                                        ) : activeTab === 'bookings' ? (
                                            <>
                                                <th className="px-6 py-3.5">Destination</th>
                                                <th className="px-6 py-3.5">Traveler</th>
                                                <th className="px-6 py-3.5">Status</th>
                                                <th className="px-6 py-3.5 text-right">Actions</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="px-6 py-3.5">Destination</th>
                                                <th className="px-6 py-3.5">Creator</th>
                                                <th className="px-6 py-3.5">Organiser Request</th>
                                                <th className="px-6 py-3.5">Status</th>
                                                <th className="px-6 py-3.5 text-right">Actions</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {activeTab === 'users' ? users.map((u) => (
                                        <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-800">{u.username}</td>
                                            <td className="px-6 py-4 text-slate-600">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                                    u.role === 'admin' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                    u.role === 'organiser' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                                                    'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    u.isVerified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}>
                                                    {u.isVerified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {!u.isVerified ? (
                                                        <button onClick={() => handleUserAction(u._id, 'verify')} className="text-emerald-600 hover:text-emerald-800 font-bold">
                                                            Approve
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleUserAction(u._id, 'revoke')} className="text-amber-600 hover:text-amber-800 font-bold">
                                                            Revoke
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleUserDelete(u._id)} className="text-rose-500 hover:text-rose-700 ml-2" title="Delete User">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : activeTab === 'bookings' ? bookings.map((b) => (
                                        <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                {b.hotelName || b.destination}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {b.userId?.username || 'Unknown'} ({b.userId?.email})
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    b.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                    b.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                    'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}>
                                                    {b.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button onClick={() => handleBookingValidate(b._id, 'approved')} className="text-emerald-600 hover:text-emerald-800 font-bold">
                                                        Approve
                                                    </button>
                                                    <button onClick={() => handleBookingValidate(b._id, 'rejected')} className="text-rose-600 hover:text-rose-800 font-bold">
                                                        Reject
                                                    </button>
                                                    <button onClick={() => handleBookingDelete(b._id)} className="text-slate-400 hover:text-rose-600">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : trips.map((t) => (
                                        <tr key={t._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-800">{t.destination}</td>
                                            <td className="px-6 py-4 text-slate-600">{t.userId?.username || 'Unknown'}</td>
                                            <td className="px-6 py-4">
                                                {t.requestOrganiser ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-50 text-cyan-700 border border-cyan-200">
                                                            {t.organiserStatus || 'pending'}
                                                        </span>
                                                        {t.organiserStatus === 'pending' && (
                                                            <div className="flex gap-2">
                                                                <button onClick={() => handleOrganiserStatus(t._id, 'approved')} className="text-[10px] font-bold text-emerald-600 hover:underline">Verify</button>
                                                                <button onClick={() => handleOrganiserStatus(t._id, 'rejected')} className="text-[10px] font-bold text-rose-600 hover:underline">Deny</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 italic">No</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    t.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                    t.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                    'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}>
                                                    {t.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    {t.status !== 'approved' && (
                                                        <button onClick={() => handleTripStatus(t._id, 'approved')} className="text-emerald-600 hover:text-emerald-800 font-bold">
                                                            Approve
                                                        </button>
                                                    )}
                                                    {t.status !== 'rejected' && (
                                                        <button onClick={() => handleTripStatus(t._id, 'rejected')} className="text-rose-600 hover:text-rose-800 font-bold">
                                                            Reject
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleTripDelete(t._id)} className="text-slate-400 hover:text-rose-600">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
