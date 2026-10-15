import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Star, Clock, Calendar,
  Phone, Globe, Wifi, Car, Utensils, Users,
  CreditCard, Shield, CheckCircle, Navigation,
  Hotel, Map, Clock3, DollarSign, User, Tag, MessageSquare
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNav, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useAuth } from '../context/AuthContext';
import api from '../service/api';
import { useToast } from '../components/ui/toast';
import PaymentModal from '../components/PaymentModal';
import ItinerarySection from '../components/ItinerarySection';

// Function to redirect to OYO with user inputs
const redirectToOYO = (bookingData) => {
  const baseUrl = "https://www.oyorooms.com";

  // Build search parameters based on user input
  const params = new URLSearchParams({
    location: bookingData.destination || '',
    checkin: bookingData.checkIn || '',
    checkout: bookingData.checkOut || '',
    guests: bookingData.guests || '2',
    rooms: bookingData.rooms || '1'
  });

  // Redirect to OYO with parameters
  window.open(`${baseUrl}/search?${params.toString()}`, '_blank');
};

// Usage in your form submit
const handleSubmit = (e) => {
  e.preventDefault();

  const bookingData = {
    destination: document.getElementById('destination').value,
    checkIn: document.getElementById('checkin').value,
    checkOut: document.getElementById('checkout').value,
    guests: document.getElementById('guests').value,
    rooms: document.getElementById('rooms').value
  };

  redirectToOYO(bookingData);
};
const ViewDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, isHotel = true, tripId, tripHotelName } = location.state || {};
  const [loading, setLoading] = useState(!hotel);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);

  // New Features State
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookingStatus, setBookingStatus] = useState('none'); // none, pending, approved, rejected
  const [showChat, setShowChat] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const images = hotel ? (function () {
    const name = isHotel ? hotel.hotelName : hotel.placeName;
    const images = [];
    if (hotel.imageUrl && hotel.imageUrl.startsWith('http')) {
      images.push(hotel.imageUrl);
    }
    if (name) {
      images.push(`https://source.unsplash.com/featured/1200x800/?${encodeURIComponent(name)} ${isHotel ? 'hotel' : 'tourist attraction'}`);
      images.push(`https://source.unsplash.com/featured/1200x800/?${encodeURIComponent(name)} ${isHotel ? 'luxury' : 'travel'}`);
    }
    images.push(`https://source.unsplash.com/featured/1200x800/?${isHotel ? 'luxury hotel room' : 'tourist destination'}`);
    images.push(`https://source.unsplash.com/featured/1200x800/?${isHotel ? 'hotel lobby' : 'vacation spot'}`);
    return [...new Set(images.filter(url => url && url.startsWith('http')))].slice(0, 5);
  })() : [];

  const name = isHotel ? hotel?.hotelName || 'Hotel Name' : hotel?.placeName || 'Attraction Name';
  const displayTitle = tripHotelName || name;
  const description = isHotel ? hotel?.description || 'Comfortable accommodation' : hotel?.details || 'Popular tourist attraction';
  const address = hotel?.address || 'Address not specified';
  const price = isHotel ? (hotel?.price || '$100 - $200 per night') : (hotel?.ticketPricing || 'Varies');
  const rating = hotel?.rating || '4.5';
  const bestTime = hotel?.bestTimeToVisit || 'Morning';

  const destinationName = address || hotel?.placeName || hotel?.hotelName || "Unknown Destination";

  const [tripData, setTripData] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!hotel) {
      setTimeout(() => setLoading(false), 1000);
    } else {
      if (user) checkBookingStatus();
      // Only fetch if tripId is a valid-looking ObjectId string
      if (tripId && typeof tripId === 'string' && tripId.length >= 24 && tripId !== 'undefined' && tripId !== 'null' && !tripId.includes('[object')) {
        fetchTripAndMembers();
      } else {
        console.warn("ViewDetails: Missing or invalid tripId, skipping context fetch", tripId);
      }
    }
  }, [hotel, user, tripId]);

  const fetchTripAndMembers = async () => {
    try {
      const [tripRes, membersRes] = await Promise.all([
        api.get(`/trips/${tripId}`),
        api.get(`/bookings/trip/${tripId}/members`)
      ]);
      setTripData(tripRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      console.error("Failed to fetch trip context", err);
    }
  };

  const checkBookingStatus = async () => {
    try {
      const { data } = await api.get(`/bookings/status/${encodeURIComponent(destinationName)}`);
      if (data && data.status) {
        setBookingStatus(data.status);
      }
    } catch (error) {
      console.error("Failed to check status", error);
    }
  };

  const handleJoinTrip = () => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to join trips.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    setShowPaymentModal(true);
  };

  const processBooking = async () => {
    try {
      console.log("DEBUG: Processing booking for", destinationName);
      const response = await api.post('/bookings/join', {
        destination: destinationName,
        tripId: tripId || hotel?.tripId,
        hotelId: hotel?.id || hotel?.name,
        hotelName: name,
        hotelImage: images[0],
        hotelAddress: address,
        price: price
      });

      console.log("DEBUG: Booking successful", response.data);
      setBookingStatus('pending');
      setShowPaymentModal(false);
      toast({
        title: "Request Sent",
        description: "Your request to join has been sent to the Organiser/Admin.",
        type: "success"
      });
    } catch (error) {
      console.error("Booking Error FULL:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to join.";
      toast({
        title: "Booking Failed",
        description: errorMsg,
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({ title: "Link Copied", description: "Share this destination with your friends!" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#00B4D8] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Loading waypoint details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="w-20 h-20 mx-auto mb-5 bg-[#E0F2FE] rounded-full flex items-center justify-center">
            <Hotel className="w-10 h-10 text-[#00B4D8]" />
          </div>
          <h1 className="text-xl font-extrabold text-[#0A1628] font-jakarta mb-2">No Details Found</h1>
          <p className="text-xs text-slate-500 mb-6">
            Please select a destination waypoint, hotel, or attraction to inspect full details.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00B4D8] hover:bg-[#0096B4] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Image generation moved up

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-left">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 hover:text-[#00B4D8] transition-colors text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <h1 className="text-lg md:text-xl font-extrabold text-[#0A1628] font-jakarta truncate max-w-md">
              {displayTitle}
            </h1>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isHotel
                ? 'bg-[#E0F2FE] text-[#0096B4]'
                : 'bg-emerald-50 text-emerald-700'}`}>
                {isHotel ? 'Hotel' : 'Attraction'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="rounded-2xl overflow-hidden shadow-xl mb-6">
              <Swiper
                modules={[SwiperNav, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                className="h-64 md:h-96"
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={img}
                      alt={`${name} - Image ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = isHotel
                          ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'
                          : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Basic Info */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-gray-800">{rating}</span>
                  <span className="text-gray-500">/5.0</span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="font-bold text-green-600">{price}</span>
                </div>

                {!isHotel && (
                  <div className="flex items-center gap-2">
                    <Clock3 className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium text-gray-700">Best: {bestTime}</span>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 p-4 bg-[#F0F9FF] border border-[#BAE6FD]/60 rounded-xl mb-6">
                <MapPin className="w-5 h-5 text-[#00B4D8] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#0096B4] mb-0.5">Location</h3>
                  <p className="text-xs text-slate-600">{address}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-extrabold text-[#0A1628] font-jakarta mb-2">About</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-slate-200">
                <nav className="flex flex-wrap gap-4 sm:gap-6">
                  {['overview', 'amenities', 'itinerary', 'community', 'reviews', 'location'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 px-1 font-bold capitalize border-b-2 transition-colors text-xs sm:text-sm cursor-pointer ${activeTab === tab
                        ? 'border-[#00B4D8] text-[#00B4D8]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="py-6">
                {activeTab === 'overview' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">About</h3>
                    <p className="text-gray-600 leading-relaxed mb-8">{description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#F0F9FF] rounded-xl border border-[#BAE6FD]/60">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-[#0096B4] mb-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          Exact Location
                        </h4>
                        <p className="text-xs text-slate-600">{address}</p>
                      </div>
                      <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-amber-700 mb-1 flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5" />
                          Pricing
                        </h4>
                        <p className="text-xs text-slate-600">{price}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h3 className="text-xl font-extrabold text-[#0A1628] font-jakarta mb-4">
                      {isHotel ? 'Amenities & Services' : 'Features & Facilities'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(isHotel ? ['Free High-Speed WiFi', 'Scenic Lounge', 'Spa Wellness', 'Parking Facilities', 'Restaurant', 'Concierge Service'] : ['Guided Tour Access', 'Photography Vantage', 'Accessible Route', 'Restrooms', 'Local Refreshments', 'Parking']).map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-bold text-[#0A1628]">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {tripData?.tripData?.itinerary ? (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Calendar className="w-5 h-5 text-[#00B4D8]" />
                          <h3 className="text-xl font-extrabold text-[#0A1628] font-jakarta">Full Trip Itinerary</h3>
                        </div>
                        <ItinerarySection itinerary={tripData.tripData.itinerary} />
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
                        <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-400">No itinerary data available for this trip yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'community' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-extrabold text-[#0A1628] font-jakarta mb-1 flex items-center gap-2">
                          <Users className="w-5 h-5 text-[#00B4D8]" />
                          Travel Community
                        </h3>
                        <p className="text-xs text-slate-500">Meet the travelers who are part of this journey</p>
                      </div>
                      <div className="bg-[#00B4D8] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
                        {members.length} Members
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {members.length > 0 ? (
                        members.map((member, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-xs group">
                            <div className="w-10 h-10 bg-[#E0F2FE] text-[#0096B4] rounded-full flex items-center justify-center font-bold text-xs uppercase">
                              {member.userId?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-[#0A1628]">{member.userId?.username || 'Traveler'}</h4>
                              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Approved Member</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                          <Globe className="w-10 h-10 text-gray-300 mx-auto mb-3 animate-pulse" />
                          <p className="text-gray-500">Be the first to join this community!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Verified Guest Reviews</h3>
                    <div className="space-y-4">
                      {[
                        { user: 'Sarah L.', rating: 5, comment: 'Simply amazing! Every detail was perfect.', date: 'Dec 2024' },
                        { user: 'James W.', rating: 4, comment: 'Great location and very responsive staff.', date: 'Nov 2024' }
                      ].map((review, idx) => (
                        <div key={idx} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                {review.user[0]}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800">{review.user}</h4>
                                <div className="flex gap-1">
                                  {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />)}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">{review.date}</span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed italic">"{review.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Location Exploration</h3>
                    <div className="bg-gray-100 rounded-2xl h-80 flex items-center justify-center mb-6 relative overflow-hidden group">
                      <img
                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=13&size=800x400&key=YOUR_API_KEY`}
                        alt="Map Placeholder"
                        className="w-full h-full object-cover blur-xs group-hover:blur-0 transition-all duration-700"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200";
                          e.target.classList.remove('blur-xs');
                        }}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-white p-4">
                        <MapPin className="w-12 h-12 mb-2 drop-shadow-lg animate-bounce" />
                        <p className="font-bold text-lg drop-shadow-lg">{address}</p>
                        <button className="mt-4 px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-bold hover:bg-blue-600 hover:text-white transition-all">
                          Open in Google Maps
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card (Replaced with Join Trip) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {isHotel ? 'Trip Details' : 'Plan Visit'}
                </h3>
                <Tag className="w-5 h-5 text-blue-500" />
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-1">
                  Est. Cost
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {isHotel ? (price.split('-')[0]?.trim()?.replace('$', '') || '200') : '20'}
                  <span className="text-lg text-gray-500">USD</span>
                </div>
              </div>

              <div className="space-y-4 mb-6 text-sm text-gray-600">
                <p>Join this trip to connect with other travelers.</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">

                {/* Dynamic Logic for Booking/Chat */}
                {bookingStatus === 'none' && (
                  <button
                    onClick={handleJoinTrip}
                    className="w-full py-3.5 bg-[#00B4D8] hover:bg-[#0096B4] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#00B4D8]/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    Request to Join Trip
                  </button>
                )}

                {bookingStatus === 'pending' && (
                  <button
                    disabled
                    className="w-full py-3.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-amber-200"
                  >
                    <Clock className="w-4 h-4" />
                    Pending Validation
                  </button>
                )}

                {bookingStatus === 'approved' && (
                  <div className="space-y-2.5">
                    <button
                      disabled
                      className="w-full py-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl cursor-default flex items-center justify-center gap-2 border border-emerald-200"
                    >
                      <Users className="w-4 h-4" />
                      Join Request Approved
                    </button>
                    <button
                      onClick={() => navigate('/chat', { state: { tripId } })}
                      className="w-full py-3 bg-[#00B4D8] hover:bg-[#0096B4] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Enter Group Chat
                    </button>
                  </div>
                )}

                {(tripData?.userId === user?.id || tripData?.userId?._id === user?.id) && (
                  <button
                    onClick={() => navigate('/chat', { state: { tripId } })}
                    className="w-full py-3 bg-[#0A1628] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Trip Chat (Organiser)
                  </button>
                )}

                {bookingStatus === 'rejected' && (
                  <button
                    disabled
                    className="w-full py-4 bg-red-100 text-red-800 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    Join Request Rejected
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Share Destination
                </button>
              </div>

              {/* Safety Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>Verified Travelers Only</span>
                </div>

                <div className="text-xs text-gray-500">
                  Admins or Trip Organisers validate all members before they can join the trip.
                </div>
              </div>
              <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={processBooking}
                amount={isHotel ? (price.split('-')[0]?.trim()?.replace('$', '') || '200') : '20'}
                itemName={name}
              />
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ViewDetails;