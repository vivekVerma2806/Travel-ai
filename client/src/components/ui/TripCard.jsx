import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { MapPin, Star, Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TripCard = ({ hotel, isHotel = true, tripId, tripHotelName }) => {
  const [imageArray, setImageArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const generateImages = () => {
      const name = isHotel ? hotel.hotelName : hotel.placeName;
      const images = [];

      if (hotel.imageUrl && hotel.imageUrl.startsWith('http')) {
        images.push(hotel.imageUrl);
      }

      if (isHotel) {
        images.push('/assets/pathora/destinations/hotel-granvia.jpg');
        images.push('/hotels/luxury.png');
        images.push('/hotels/modern.png');
      } else {
        images.push('/assets/pathora/destinations/kinkaku-ji.jpg');
        images.push('/assets/pathora/destinations/arashiyama.jpg');
      }

      if (name) {
        images.push(`https://loremflickr.com/800/600/${encodeURIComponent(name.toLowerCase())},travel`);
      }

      images.push('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80');

      const uniqueImages = [...new Set(images.filter(Boolean))];
      setImageArray(uniqueImages);
    };

    generateImages();
  }, [hotel, isHotel]);

  const handleViewDetails = () => {
    navigate("/view-details", {
      state: {
        hotel,
        isHotel,
        tripId,
        tripHotelName: tripHotelName || (isHotel ? hotel.hotelName : null)
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-md hover:border-[#00B4D8]/40 hover:-translate-y-1 group">
      {/* Image Slider */}
      <div className="relative h-60 bg-slate-100">
        {imageArray.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="h-full"
          >
            {imageArray.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt={`${hotel.hotelName || hotel.placeName || 'Destination'}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/assets/pathora/destinations/hotel-granvia.jpg';
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">
            {isHotel ? '🏨' : '🏛️'}
          </div>
        )}

        {/* Rating Badge */}
        {hotel.rating && (
          <div className="absolute top-3.5 right-3.5 z-10 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm text-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-bold text-slate-800">{hotel.rating}</span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0A1628]/80 text-white backdrop-blur-sm">
            {isHotel ? 'Accommodation' : 'Must-Visit Highlight'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-[#0A1628] mb-1 line-clamp-1 font-jakarta">
          {isHotel ? hotel.hotelName || 'Curated Hotel' : hotel.placeName || 'Attraction'}
        </h3>

        {isHotel && hotel.address && (
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#00B4D8]" />
            <span className="truncate">{hotel.address}</span>
          </div>
        )}

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {isHotel ? hotel.description || 'Verified accommodation with comfortable amenities.' : hotel.details || 'Popular destination recommended by Pathora.'}
        </p>

        {/* Details row */}
        <div className="flex items-center justify-between py-3 border-t border-slate-100 text-xs mb-4">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Est. Price</span>
            <span className="font-bold text-emerald-600">
              {isHotel ? (hotel.price || '$120 - $220/night') : (hotel.ticketPricing || 'Free entry')}
            </span>
          </div>

          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              {isHotel ? 'Rating' : 'Best Time'}
            </span>
            <span className="font-semibold text-slate-700">
              {isHotel ? `${hotel.rating || '4.5'} / 5.0` : (hotel.bestTimeToVisit || 'Morning')}
            </span>
          </div>
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={handleViewDetails}
          className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-[#00B4D8] hover:bg-[#0096B4] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <span>{isHotel ? 'View Details & Rates' : 'Explore Attraction'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default TripCard;