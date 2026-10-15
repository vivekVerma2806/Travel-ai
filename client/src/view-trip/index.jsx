import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Star, Clock, Calendar, Navigation, Globe, Share2, Users, Shield, CheckCircle, MessageCircle, Heart, XCircle, ArrowLeft } from "lucide-react";
import TripCard from "../components/ui/TripCard";
import ItinerarySection from '../components/ItinerarySection';
import api from "../service/api";
import { useToast } from '../components/ui/toast';
import { useAuth } from '../context/AuthContext';

export default function ViewTrip() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const { user } = useAuth();
  const [bookingStatus, setBookingStatus] = useState('none');
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'itinerary' | 'members' | 'hotels'
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      try {
        const { data } = await api.get(`/trips/${id}`);
        if (data && data.tripData) {
          setTrip({
            ...data.tripData,
            destination: data.destination,
            rawTrip: data
          });
        }
      } catch (error) {
        console.error("Error fetching trip:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load trip details.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const fetchMembers = async () => {
    if (!id) return;
    try {
      const { data } = await api.get(`/bookings/trip/${id}/members`);
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [id]);

  useEffect(() => {
    if (trip && user) {
      checkBookingStatus();
    }
  }, [trip, user]);

  const checkBookingStatus = async () => {
    try {
      const { data } = await api.get(`/bookings/status/${encodeURIComponent(trip.destination)}`);
      if (data) {
        setBookingStatus(data.status || 'none');
      }
    } catch (error) {
      console.error("Failed to check status", error);
    }
  };

  const handleJoinTrip = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to join community journeys."
      });
      return;
    }
    try {
      await api.post('/bookings/join', {
        destination: trip.destination,
        tripId: id
      });
      setBookingStatus('pending');
      fetchMembers();
      toast({
        title: "Request Submitted",
        description: "Your join request has been sent to the journey organizer.",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to join.";
      toast({
        title: "Error Joining",
        description: errorMsg,
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Pathora journey link copied to clipboard."
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Pathora Journey...</p>
      </div>
    </div>
  );

  if (!trip) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <img
          src="/assets/pathora/illustrations/empty-trips.svg"
          alt="No trip found"
          className="w-48 h-36 mx-auto mb-4"
        />
        <h1 className="text-xl font-bold text-[#0A1628] mb-2 font-jakarta">No Journey Found</h1>
        <p className="text-slate-500 text-xs mb-6">This itinerary may have been removed or does not exist.</p>
        <Link
          to="/create-trip"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00B4D8] hover:bg-[#0096B4] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
        >
          <Navigation className="w-4 h-4" />
          Plan New Journey
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">

      {/* Panoramic Banner matching UI Reference Kyoto screen */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#0A1628]">
        <img
          src={trip.destination?.toLowerCase().includes("kyoto")
            ? "/assets/pathora/destinations/kyoto-banner.jpg"
            : trip.destination?.toLowerCase().includes("bali")
            ? "/assets/pathora/destinations/bali.jpg"
            : trip.destination?.toLowerCase().includes("paris")
            ? "/assets/pathora/destinations/paris.jpg"
            : "/assets/pathora/destinations/santorini-hero.jpg"
          }
          alt={trip.destination}
          className="w-full h-full object-cover filter brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-black/30" />

        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs font-medium backdrop-blur-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">

        {/* Header Information Card matching UI Reference */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E0F7FA] text-[#0096B4] tracking-wide">
                  Public Journey
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00B4D8]" />
                  {trip.destination}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {trip.duration || 5} Days
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {members.length + 1} Travelers
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0A1628] font-jakarta leading-tight">
                {trip.rawTrip?.title || `${trip.destination} Cultural Expedition`}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Organized by <strong className="text-slate-800">{trip.rawTrip?.userId?.username || 'Pathora Community'}</strong>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFavorited(!isFavorited)}
                className={`p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer ${
                  isFavorited ? 'text-rose-500 border-rose-200 bg-rose-50' : 'text-slate-500'
                }`}
                title="Save to Favorites"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer"
                title="Share Journey"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {/* Dynamic Booking CTA matching UI Reference */}
              {bookingStatus === 'none' && (
                <button
                  type="button"
                  onClick={handleJoinTrip}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#00B4D8] hover:bg-[#0096B4] shadow-sm shadow-[#00B4D8]/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Request to Join</span>
                </button>
              )}

              {bookingStatus === 'pending' && (
                <div className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Request Pending Review</span>
                </div>
              )}

              {bookingStatus === 'approved' && (
                <Link
                  to={`/chat?tripId=${id}`}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open Trip Chat</span>
                </Link>
              )}
            </div>
          </div>

          {/* Navigation Tabs matching UI Reference */}
          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-slate-100 overflow-x-auto text-sm font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'text-[#00B4D8] border-b-2 border-[#00B4D8]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('itinerary')}
              className={`pb-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'itinerary'
                  ? 'text-[#00B4D8] border-b-2 border-[#00B4D8]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Itinerary Schedule
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hotels')}
              className={`pb-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'hotels'
                  ? 'text-[#00B4D8] border-b-2 border-[#00B4D8]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Accommodations ({trip.hotels?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className={`pb-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'members'
                  ? 'text-[#00B4D8] border-b-2 border-[#00B4D8]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Travelers ({members.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              {/* About This Trip */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                <h3 className="text-lg font-bold text-[#0A1628] mb-3 font-jakarta">
                  About This Trip
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Explore the rich culture, stunning temples, and hidden gems of {trip.destination}.
                  From ancient shrines to modern culinary delicacies, this trip offers the perfect blend of tradition, exploration, and community travel.
                </p>

                {/* Highlights Grid */}
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-6 mb-3">
                  Trip Highlights
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl overflow-hidden aspect-video relative group">
                    <img src="/assets/pathora/destinations/kinkaku-ji.jpg" alt="Highlight 1" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-2 text-white text-[11px] font-bold">Kinkaku-ji</div>
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-video relative group">
                    <img src="/assets/pathora/destinations/arashiyama.jpg" alt="Highlight 2" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-2 text-white text-[11px] font-bold">Bamboo Grove</div>
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-video relative group">
                    <img src="/assets/pathora/destinations/fushimi-inari.jpg" alt="Highlight 3" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-2 text-white text-[11px] font-bold">Torii Gates</div>
                  </div>
                </div>
              </div>

              {/* Itinerary Preview */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#0A1628] font-jakarta">
                    Daily Schedule
                  </h3>
                  <button
                    onClick={() => setActiveTab('itinerary')}
                    className="text-xs font-bold text-[#00B4D8] hover:underline"
                  >
                    View All Days →
                  </button>
                </div>
                <ItinerarySection itinerary={trip.itinerary} tripHotelName={trip.hotels?.[0]?.hotelName} />
              </div>
            </div>

            {/* Right Sidebar: Details & Booking Status */}
            <div className="lg:col-span-4 space-y-6">
              {/* Hotel Summary */}
              {trip.hotels?.[0] && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-[#0096B4] tracking-wider block mb-1">
                    Featured Accommodation
                  </span>
                  <h4 className="font-bold text-base text-[#0A1628] mb-1">
                    {trip.hotels[0].hotelName}
                  </h4>
                  <p className="text-xs text-slate-500 mb-3 truncate">
                    {trip.hotels[0].address}
                  </p>
                  <div className="rounded-xl overflow-hidden aspect-video mb-3">
                    <img
                      src="/assets/pathora/destinations/hotel-granvia.jpg"
                      alt={trip.hotels[0].hotelName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-600">{trip.hotels[0].price || '$140/night'}</span>
                    <span className="text-slate-500 font-medium">★ {trip.hotels[0].rating || '4.8'} rating</span>
                  </div>
                </div>
              )}

              {/* Community Members Pill */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <h4 className="font-bold text-sm text-[#0A1628] mb-3">
                  Confirmed Members ({members.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {members.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-[#0A1628] text-white flex items-center justify-center text-[10px]">
                        {m.userId?.username?.[0]?.toUpperCase() || 'T'}
                      </span>
                      <span>{m.userId?.username || 'Traveler'}</span>
                    </div>
                  ))}
                  {members.length === 0 && (
                    <p className="text-xs text-slate-400">Be the first to join this journey!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            <ItinerarySection itinerary={trip.itinerary} tripHotelName={trip.hotels?.[0]?.hotelName} />
          </div>
        )}

        {activeTab === 'hotels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trip.hotels?.map((hotel, index) => (
              <TripCard
                key={index}
                hotel={hotel}
                isHotel={true}
                tripId={id}
                tripHotelName={trip.hotels?.[0]?.hotelName}
              />
            ))}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h3 className="text-lg font-bold text-[#0A1628] mb-4 font-jakarta">
              Travelers on this Path
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {members.map((m, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-[#00B4D8] text-white flex items-center justify-center font-bold text-sm">
                    {m.userId?.username?.[0]?.toUpperCase() || 'T'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0A1628]">{m.userId?.username}</h4>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase">Approved Member</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Journey Actions & Summary Bar */}
        <section className="mt-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00B4D8]">
              Ready for Departure?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628] font-jakarta mt-1 mb-3">
              Embark on this Journey to {trip.destination}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mb-6 max-w-xl mx-auto">
              Coordinate with fellow travelers, review curated waypoints, and export your itinerary for offline navigation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Dynamic Logic for Booking/Chat */}
              {bookingStatus === 'none' && (
                <button
                  type="button"
                  onClick={handleJoinTrip}
                  className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-[#00B4D8] hover:bg-[#0096B4] shadow-md shadow-[#00B4D8]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Request to Join Trip</span>
                </button>
              )}

              {bookingStatus === 'pending' && (
                <div className="px-5 py-3 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Pending Admin/Organiser Review</span>
                </div>
              )}

              {bookingStatus === 'approved' && (
                <div className="flex items-center gap-2">
                  <div className="px-4 py-3 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Member Confirmed</span>
                  </div>
                  <Link
                    to={`/chat?tripId=${id}`}
                    className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Group Chat</span>
                  </Link>
                </div>
              )}

              {bookingStatus === 'rejected' && (
                <div className="px-5 py-3 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>Join Request Declined</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowTripDetails(true)}
                className="px-5 py-3 bg-[#FF6B35] hover:bg-[#E85D26] text-white text-xs font-bold rounded-xl shadow-md shadow-[#FF6B35]/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Trip Overview & Roadmap</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-3 bg-white border border-slate-200 hover:border-[#00B4D8] text-slate-700 hover:text-[#00B4D8] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-5 py-3 bg-white border border-slate-200 hover:border-[#00B4D8] text-slate-700 hover:text-[#00B4D8] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Path</span>
              </button>
            </div>
          </div>
        </section>

        {/* Custom Trip Details Modal */}
        {showTripDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-all duration-300">
            <div
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all scale-100"
              role="dialog"
              aria-modal="true"
            >
              {/* Modal Header */}
              <div className="relative px-8 py-6 bg-[#0A1628] shrink-0 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#00E5FF]">Comprehensive Guide</span>
                    <h2 className="text-2xl font-extrabold text-white font-jakarta mt-0.5 mb-2">{trip.destination} Overview</h2>
                    <div className="flex items-center gap-2 text-slate-300 text-xs">
                      <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                        <MapPin className="w-3.5 h-3.5 text-[#00B4D8]" /> {trip.destination}
                      </span>
                      <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                        <Clock className="w-3.5 h-3.5 text-[#FF6B35]" /> {trip.duration || 5} Days
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTripDetails(false)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
                    aria-label="Close modal"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8 bg-[#F8FAFC]">
                {/* Accommodation Highlights */}
                {trip.hotels?.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-base font-bold text-[#0A1628] mb-4 font-jakarta">
                      <MapPin className="w-4 h-4 text-[#00B4D8]" />
                      Accommodation Highlights
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {trip.hotels.map((hotel, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex gap-4 items-center">
                          <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                            <img
                              src={hotel?.imageUrl || '/assets/pathora/destinations/hotel-granvia.jpg'}
                              alt={hotel?.hotelName}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = '/assets/pathora/destinations/hotel-granvia.jpg'; }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-[#0A1628] truncate">{hotel?.hotelName}</h4>
                            <p className="text-[11px] text-slate-500 truncate mb-2">{hotel?.address}</p>
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
                                {hotel?.price || '$120 - $220/night'}
                              </span>
                              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{hotel?.rating || '4.8'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Itinerary Roadmap */}
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-[#0A1628] mb-4 font-jakarta">
                    <Calendar className="w-4 h-4 text-[#00B4D8]" />
                    Itinerary Roadmap
                  </h3>

                  <div className="relative border-l-2 border-[#00B4D8]/30 ml-4 space-y-6 pb-2">
                    {Array.isArray(trip.itinerary) ? (
                      trip.itinerary.map((dayPlan, idx) => (
                        <div key={idx} className="relative pl-6">
                          <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#00B4D8] shadow-xs" />
                          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[#0096B4] font-bold uppercase text-[10px] tracking-wider font-jakarta">
                                Day {dayPlan.day || idx + 1}
                              </span>
                              <span className="text-slate-400 text-[10px] bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                {dayPlan.places?.length || 0} stops
                              </span>
                            </div>
                            <h4 className="font-bold text-xs text-[#0A1628] mb-1">
                              {dayPlan.title || `Day ${dayPlan.day} Exploration`}
                            </h4>
                            <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                              {dayPlan.places?.[0]?.details || 'Custom curated exploration path for today.'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : typeof trip.itinerary === 'object' && trip.itinerary !== null ? (
                      Object.entries(trip.itinerary).map(([dayKey, details], idx) => (
                        <div key={idx} className="relative pl-6">
                          <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#00B4D8] shadow-xs" />
                          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
                            <span className="text-[#0096B4] font-bold uppercase text-[10px] tracking-wider font-jakarta block mb-1">
                              {dayKey}
                            </span>
                            <h4 className="font-bold text-xs text-[#0A1628] mb-1">
                              {details?.theme || details?.placeName || 'Exploration Day'}
                            </h4>
                            <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                              {details?.details || details?.description || 'Enjoy a wonderful day exploring destination highlights.'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 pl-4">Itinerary details loading...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 bg-white border-t border-slate-200 shrink-0 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTripDetails(false)}
                  className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => { setShowTripDetails(false); window.print(); }}
                  className="px-5 py-2.5 bg-[#00B4D8] hover:bg-[#0096B4] text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
