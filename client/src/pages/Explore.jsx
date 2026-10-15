import React, { useEffect, useState } from 'react';
import api from '../service/api';
import UserTripCard from '../components/ui/UserTripCard';
import TripFilters from '../components/custom/TripFilters';
import { Loader2, Compass } from 'lucide-react';

const Explore = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        query: '',
        budget: '',
        minDays: '',
        maxDays: ''
    });
    const [userBookings, setUserBookings] = useState([]);

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (filters.query) params.append('query', filters.query);
                if (filters.budget) params.append('budget', filters.budget);
                if (filters.minDays) params.append('minDays', filters.minDays);
                if (filters.maxDays) params.append('maxDays', filters.maxDays);

                const res = await api.get(`/trips?${params.toString()}`);
                setTrips(res.data);

                if (localStorage.getItem('token')) {
                    const bookingsRes = await api.get('/bookings/user-bookings');
                    setUserBookings(bookingsRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch trips", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchTrips();
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [filters]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00B4D8]">
                        Discover the World
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A1628] font-jakarta mt-1 mb-3">
                        Explore Community Journeys
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Browse handcrafted AI itineraries created by travelers worldwide. Request to join group departures or save paths to your favorites.
                    </p>
                </div>

                <div className="mb-8">
                    <TripFilters filters={filters} setFilters={setFilters} />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <div className="w-10 h-10 border-3 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-semibold text-slate-500">Searching Pathora journeys...</p>
                    </div>
                ) : trips.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.map((trip) => {
                            const booking = userBookings.find(b => b.tripId?._id === trip._id || b.tripId === trip._id);
                            return (
                                <UserTripCard
                                    key={trip._id}
                                    trip={trip}
                                    isJoined={!!booking}
                                    bookingStatus={booking?.status}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto">
                        <img
                            src="/assets/pathora/illustrations/no-results.svg"
                            alt="No journeys found"
                            className="w-40 h-32 mx-auto mb-4"
                        />
                        <h3 className="text-base font-bold text-[#0A1628] font-jakarta">No Journeys Match Your Search</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                            Try adjusting your filters or destination keywords to find more adventures.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;
