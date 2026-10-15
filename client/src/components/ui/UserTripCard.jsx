import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/toast';
import api from '../../service/api';

const UserTripCard = ({ trip, isJoined, bookingStatus }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();
    const [joining, setJoining] = React.useState(false);

    const getInitialImage = () => {
        const dest = (trip.destination || "").toLowerCase();
        if (dest.includes("kyoto")) return "/assets/pathora/destinations/kyoto-banner.jpg";
        if (dest.includes("bali")) return "/assets/pathora/destinations/bali.jpg";
        if (dest.includes("paris")) return "/assets/pathora/destinations/paris.jpg";
        if (dest.includes("tokyo")) return "/assets/pathora/destinations/tokyo.jpg";
        if (dest.includes("santorini")) return "/assets/pathora/destinations/santorini.jpg";
        if (dest.includes("new york") || dest.includes("york")) return "/assets/pathora/destinations/newyork.jpg";
        return trip.tripData?.locationInfo?.photoUrl ||
               trip.tripData?.hotels?.[0]?.imageUrl ||
               "/assets/pathora/destinations/kyoto-banner.jpg";
    };

    const [imgSrc, setImgSrc] = React.useState(getInitialImage());

    const handleJoinClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("Please login to join trips");
            navigate('/login');
            return;
        }

        setJoining(true);
        try {
            await api.post('/bookings/join', {
                destination: trip.destination,
                tripId: trip._id,
                hotelName: trip.tripData?.hotels?.[0]?.hotelName || "Main Accommodation",
                hotelImage: imgSrc,
                price: trip.budget || "Varies"
            });
            toast.success("Join request sent to organiser!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to join trip");
        } finally {
            setJoining(false);
        }
    };

    return (
        <div
            onClick={() => navigate(`/view-trip/${trip._id}`)}
            className="border rounded-2xl p-4 hover:shadow-md hover:border-[#00B4D8]/50 transition-all cursor-pointer h-full flex flex-col bg-white border-slate-200 shadow-xs relative overflow-hidden group"
        >
            <div className="relative h-48 w-full mb-3.5 overflow-hidden rounded-xl bg-slate-100">
                <img
                    src={imgSrc}
                    alt={trip.destination}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={() => setImgSrc("/assets/pathora/destinations/kyoto-banner.jpg")}
                />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg text-[10px] font-bold shadow-xs uppercase tracking-wider text-slate-700">
                    {trip.duration || trip.tripData?.duration || 3} Days
                </div>

                {trip.status === 'approved' && (
                    <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-emerald-600/90 backdrop-blur-md rounded-md text-[9px] font-bold text-white uppercase tracking-wider">
                        Verified
                    </div>
                )}
            </div>

            <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-base text-[#0A1628] truncate flex-1 font-jakarta group-hover:text-[#00B4D8] transition-colors">
                    {trip.tripData?.hotels?.[0]?.hotelName || trip.destination || 'Pathora Journey'}
                </h3>
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                <MapPin className="w-3.5 h-3.5 text-[#00B4D8]" /> {trip.destination}
            </p>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 gap-3">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Budget</span>
                    <span className="font-bold text-[#0A1628] text-xs">
                        {trip.budget || trip.tripData?.budget || 'Moderate'}
                    </span>
                </div>

                {(trip.userId !== user?.id && trip.userId?._id !== user?.id) ? (
                    <button
                        type="button"
                        onClick={handleJoinClick}
                        disabled={joining || isJoined}
                        className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                            isJoined
                                ? 'bg-emerald-600 text-white cursor-default'
                                : 'bg-[#00B4D8] hover:bg-[#0096B4] text-white shadow-[#00B4D8]/20'
                        }`}
                    >
                        {joining ? (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : isJoined ? (
                            <span>{bookingStatus === 'approved' ? 'Joined' : 'Requested'}</span>
                        ) : (
                            <span>Request to Join</span>
                        )}
                    </button>
                ) : (
                    <div className="py-1.5 px-3 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold text-center border border-slate-200 uppercase tracking-wider">
                        Your Trip
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserTripCard;
