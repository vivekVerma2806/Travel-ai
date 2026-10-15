import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../service/api'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Calendar, MapPin, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react'

function MyTrips() {
    const { user } = useAuth()
    const [trips, setTrips] = useState([])
    const [bookings, setBookings] = useState([])
    const [creatorRequests, setCreatorRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tripsRes, bookingsRes, requestsRes] = await Promise.all([
                    api.get('/trips/user-trips'),
                    api.get('/bookings/user-bookings'),
                    api.get('/bookings/creator-requests')
                ]);
                setTrips(tripsRes.data);
                setBookings(bookingsRes.data);
                setCreatorRequests(requestsRes.data);
            } catch (error) {
                console.error("Failed to fetch user journeys", error);
            } finally {
                setLoading(false);
            }
        }

        if (user) fetchData()
    }, [user])

    const handleRemoveBooking = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this join request?")) return;
        try {
            await api.delete(`/bookings/${id}`);
            setBookings(prev => prev.filter(b => b._id !== id));
        } catch (error) {
            console.error("Failed to cancel request", error);
            alert("Failed to cancel join request. Please try again.");
        }
    };

    const handleRemoveTrip = async (id) => {
        if (!window.confirm("Are you sure you want to delete this journey? This will remove its associated messages and requests.")) return;
        try {
            await api.delete(`/trips/${id}`);
            setTrips(prev => prev.filter(t => t._id !== id));
        } catch (error) {
            console.error("Failed to remove journey", error);
            alert("Failed to delete journey.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-semibold text-slate-500">Loading your journeys...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-14">

                {/* Section 1: Created Journeys */}
                <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#00B4D8]">
                                Your Adventure Portfolio
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628] font-jakarta mt-0.5">
                                My Created Journeys
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            {(user?.role === 'organiser' || user?.role === 'admin') && (
                                <Link
                                    to={user.role === 'admin' ? "/admin" : "/organiser"}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-[#00B4D8] rounded-xl text-xs font-bold shadow-xs transition-colors"
                                >
                                    {user.role === 'admin' ? 'Admin Portal' : 'Organiser Hub'}
                                </Link>
                            )}

                            <Link
                                to="/create-trip"
                                className="px-4 py-2 bg-[#00B4D8] hover:bg-[#0096B4] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Plan New Journey</span>
                            </Link>
                        </div>
                    </div>

                    {trips.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.map((trip) => (
                                <div key={trip._id} className="relative group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#00B4D8]/40 transition-all flex flex-col">
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        <img
                                            src={trip.tripData?.locationInfo?.photoUrl ||
                                                 (trip.destination?.toLowerCase().includes("kyoto") ? "/assets/pathora/destinations/kyoto-banner.jpg" :
                                                  trip.destination?.toLowerCase().includes("bali") ? "/assets/pathora/destinations/bali.jpg" :
                                                  trip.destination?.toLowerCase().includes("paris") ? "/assets/pathora/destinations/paris.jpg" :
                                                  "/assets/pathora/destinations/santorini.jpg")}
                                            alt={trip.destination}
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-xs ${
                                                trip.status === 'approved' ? 'bg-emerald-600' :
                                                trip.status === 'rejected' ? 'bg-rose-600' :
                                                'bg-amber-500'
                                            }`}>
                                                {trip.status || 'Active'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveTrip(trip._id);
                                            }}
                                            className="absolute top-3 left-3 p-2 bg-black/40 hover:bg-rose-600 text-white rounded-full transition-colors backdrop-blur-xs cursor-pointer"
                                            title="Delete Journey"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-base text-[#0A1628] truncate mb-1 font-jakarta group-hover:text-[#00B4D8] transition-colors">
                                                {trip.destination}
                                            </h3>
                                            <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                Created {new Date(trip.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#F0F9FF] text-[#0096B4]">
                                                {trip.duration || 3} Days • {trip.budget || 'Moderate'}
                                            </span>
                                            <Link
                                                to={`/view-trip/${trip._id}`}
                                                className="text-xs font-bold text-[#00B4D8] hover:underline flex items-center gap-1"
                                            >
                                                <span>View Path</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto shadow-xs">
                            <img
                                src="/assets/pathora/illustrations/empty-trips.svg"
                                alt="No journeys yet"
                                className="w-48 h-36 mx-auto mb-4"
                            />
                            <h3 className="text-lg font-bold text-[#0A1628] font-jakarta mb-1">No Journeys Created Yet</h3>
                            <p className="text-xs text-slate-500 mb-6">
                                Experience intelligent travel curation. Let Pathora create your custom schedule in seconds.
                            </p>
                            <Link
                                to="/create-trip"
                                className="px-6 py-2.5 bg-[#00B4D8] hover:bg-[#0096B4] text-white text-xs font-bold rounded-xl transition-colors shadow-xs inline-block"
                            >
                                Plan Your First Journey
                            </Link>
                        </div>
                    )}
                </div>

                {/* Section 2: Joined Journeys */}
                <div className="pt-10 border-t border-slate-200">
                    <div className="mb-6">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#00B4D8]">
                            Community Expeditions
                        </span>
                        <h2 className="text-2xl font-extrabold text-[#0A1628] font-jakarta mt-0.5">
                            Joined Departures
                        </h2>
                    </div>

                    {bookings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                booking.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                booking.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                'bg-amber-50 text-amber-700 border border-amber-200'
                                            }`}>
                                                {booking.status}
                                            </span>
                                            <button
                                                onClick={() => handleRemoveBooking(booking._id)}
                                                className="text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                        <h3 className="font-bold text-base text-[#0A1628] mb-1 font-jakarta truncate">
                                            {booking.destination}
                                        </h3>
                                        <p className="text-xs text-slate-500 truncate mb-4">
                                            {booking.hotelName || 'Community Group Journey'}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <Link
                                            to={booking.tripId ? `/view-trip/${booking.tripId?._id || booking.tripId}` : '#'}
                                            className="text-xs font-bold text-slate-700 hover:text-[#00B4D8]"
                                        >
                                            View Details
                                        </Link>

                                        {booking.status === 'approved' && (
                                            <Link
                                                to={`/chat?tripId=${booking.tripId?._id || booking.tripId}`}
                                                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#00B4D8] hover:bg-[#0096B4] text-white flex items-center gap-1.5 shadow-xs"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                <span>Group Chat</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-sm mx-auto shadow-xs">
                            <p className="text-xs text-slate-500 mb-3">You haven't requested to join any community trips yet.</p>
                            <Link to="/explore" className="text-xs font-bold text-[#00B4D8] hover:underline">
                                Browse Explore Page →
                            </Link>
                        </div>
                    )}
                </div>

                {/* Section 3: Incoming Join Requests for Creator Trips */}
                {creatorRequests && creatorRequests.length > 0 && (
                    <div className="pt-10 border-t border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
                                    Expedition Approvals
                                </span>
                                <h2 className="text-2xl font-extrabold text-[#0A1628] font-jakarta mt-0.5">
                                    Incoming Join Requests ({creatorRequests.length})
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Travelers requesting permission to join your curated paths.
                                </p>
                            </div>

                            <Link
                                to="/organiser"
                                className="px-4 py-2 bg-[#0A1628] hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors w-fit"
                            >
                                <ShieldCheck className="w-4 h-4 text-[#00B4D8]" />
                                <span>Manage in Organiser Hub</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {creatorRequests.map((request, index) => (
                                <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-[#00B4D8]/40 transition-all flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-9 h-9 rounded-full bg-[#E0F2FE] text-[#0096B4] flex items-center justify-center font-bold text-xs uppercase">
                                                {request.userId?.username?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                request.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                request.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                'bg-amber-50 text-amber-700 border border-amber-200'
                                            }`}>
                                                {request.status}
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-base text-[#0A1628] mb-0.5 font-jakarta truncate">
                                            {request.userId?.username || 'Explorer'}
                                        </h3>
                                        <p className="text-xs text-slate-400 mb-3 truncate">{request.userId?.email}</p>

                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">
                                                Requested Path
                                            </span>
                                            <p className="text-xs font-bold text-[#0A1628] truncate">
                                                {request.tripId?.destination || 'Your Journey'}
                                            </p>
                                            {request.hotelName && (
                                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                                    {request.hotelName}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </span>
                                        <Link
                                            to="/organiser"
                                            className="text-xs font-bold text-[#00B4D8] hover:underline flex items-center gap-1"
                                        >
                                            <span>Process Request</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default MyTrips
