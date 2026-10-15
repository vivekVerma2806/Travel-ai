import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, ChevronDown, Star, Heart, ExternalLink, Bookmark, Share2, Compass, DollarSign, Route } from 'lucide-react';
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/components/ui/toast";

const ItinerarySection = ({ itinerary, tripHotelName }) => {
  const [expandedDays, setExpandedDays] = useState({ 0: true }); // Expand Day 1 by default
  const [likedPlaces, setLikedPlaces] = useState({});
  const [savedPlaces, setSavedPlaces] = useState({});
  const { toast } = useToast();

  const totalPlaces = itinerary?.reduce((acc, day) => acc + (day.places?.length || 0), 0) || 0;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    if (toast) {
      toast({
        title: "Itinerary Link Copied",
        description: "Direct waypoint link copied to clipboard."
      });
    } else {
      alert("Itinerary link copied to clipboard!");
    }
  };

  const PlaceCard = ({ place, placeIndex, dayIndex }) => {
    const [isPlaceExpanded, setIsPlaceExpanded] = useState(false);
    const isLiked = likedPlaces[`${dayIndex}-${placeIndex}`];
    const isSaved = savedPlaces[`${dayIndex}-${placeIndex}`];

    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-[#00B4D8]/40 hover:shadow-sm transition-all mb-3">
        <div className="flex flex-col sm:flex-row gap-4 items-start">

          {/* Time & Stop Badge */}
          <div className="sm:w-24 shrink-0 flex sm:flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center gap-1">
            <span className="text-xs font-bold text-[#0096B4] font-jakarta">
              {place.time || `${9 + placeIndex * 2}:00 AM`}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Stop {placeIndex + 1}
            </span>
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-base text-[#0A1628] leading-tight font-jakarta">
                  {place.placeName}
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {place.details || 'Experience this highlight curated by Pathora AI.'}
                </p>
              </div>

              {/* Action Buttons: Like & Save */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setLikedPlaces(prev => ({
                    ...prev,
                    [`${dayIndex}-${placeIndex}`]: !isLiked
                  }))}
                  className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Favorite place"
                  aria-label="Favorite place"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                <Toggle
                  pressed={isSaved}
                  onPressed={() => setSavedPlaces(prev => ({
                    ...prev,
                    [`${dayIndex}-${placeIndex}`]: !isSaved
                  }))}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-[#E0F2FE] hover:text-[#0096B4] data-[state=on]:bg-[#E0F2FE] data-[state=on]:text-[#0096B4] flex items-center gap-1 cursor-pointer transition-colors"
                  title="Save to Waypoints"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline-block">{isSaved ? 'Saved' : 'Save'}</span>
                </Toggle>
              </div>
            </div>

            {/* Badges / Metrics */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              {place.travelTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{place.travelTime}</span>
                </div>
              )}

              {place.ticketPricing && (
                <div className="flex items-center gap-1 font-semibold text-emerald-600">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{place.ticketPricing}</span>
                </div>
              )}

              {place.rating && (
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{place.rating}</span>
                </div>
              )}

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#F0F9FF] text-[#0096B4] hover:bg-[#E0F2FE] transition-colors cursor-pointer flex items-center gap-1 border border-[#BAE6FD]/60"
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName)}`, '_blank')}
                >
                  <MapPin className="w-3 h-3" />
                  <span>View Map</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaceExpanded(!isPlaceExpanded)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title={isPlaceExpanded ? "Hide notes" : "Show notes"}
                >
                  {isPlaceExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Expandable Notes / Details Drawer */}
            {isPlaceExpanded && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-[#0096B4] font-bold">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Pathora Traveler Tip</span>
                </div>
                <p>
                  Optimal arrival time is early morning to beat the crowds. Public transit waypoints and nearby cafes are accessible within a 5-minute stroll.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DayHeader = ({ dayPlan, dayIndex, isExpanded }) => {
    return (
      <div
        className="p-4 sm:p-5 cursor-pointer bg-white hover:bg-slate-50/80 border-b border-slate-200 transition-colors flex items-center justify-between"
        onClick={() => setExpandedDays(prev => ({ ...prev, [dayIndex]: !isExpanded }))}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00B4D8] text-white flex items-center justify-center font-bold text-sm shadow-xs font-jakarta">
            D{dayPlan.day}
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0A1628] font-jakarta">
              {dayPlan.title || `Day ${dayPlan.day} Exploration`}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> Full Day</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {dayPlan.places?.length || 0} Places</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const tripId = window.location.pathname.split('/').pop();
              if (tripId && tripId !== 'view-trip') {
                window.location.href = `/view-details?tripId=${tripId}`;
              }
            }}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0096B4] transition-colors cursor-pointer"
          >
            <span>View Day Plan</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-xs font-semibold text-[#00B4D8] hidden sm:inline-block">
              {isExpanded ? 'Collapse' : 'Expand'}
            </span>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-600" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header Section with Count, Share & Export */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00B4D8]">
            Curated Route Matrix
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1628] font-jakarta mt-0.5">
            Travel Itinerary
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {itinerary?.length || 0} scheduled days • {totalPlaces} curated experiences
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="px-3.5 py-2 border border-slate-200 hover:border-[#00B4D8] text-slate-700 hover:text-[#00B4D8] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-white shadow-xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-[#00B4D8] hover:bg-[#0096B4] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {itinerary?.map((dayPlan, dayIndex) => {
          const isExpanded = expandedDays[dayIndex];

          return (
            <div key={dayIndex} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <DayHeader
                dayPlan={dayPlan}
                dayIndex={dayIndex}
                isExpanded={isExpanded}
              />

              {isExpanded && (
                <div className="p-4 sm:p-6 bg-slate-50/50">
                  {/* Places List */}
                  <div className="space-y-3">
                    {dayPlan.places?.map((place, placeIndex) => (
                      <PlaceCard
                        key={placeIndex}
                        place={place}
                        placeIndex={placeIndex}
                        dayIndex={dayIndex}
                      />
                    ))}
                  </div>

                  {/* Day Summary Matrix */}
                  <div className="mt-6 p-4 sm:p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Route className="w-4 h-4 text-[#00B4D8]" />
                      <h4 className="font-extrabold text-sm text-[#0A1628] font-jakarta">
                        Day {dayPlan.day} Metrics & Estimation
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Duration</span>
                        <span className="text-sm font-extrabold text-[#0A1628]">Full Day (8h)</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Stops</span>
                        <span className="text-sm font-extrabold text-[#0096B4]">{dayPlan.places?.length || 0} Waypoints</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Est. Budget</span>
                        <span className="text-sm font-extrabold text-emerald-600">$150 / day</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Distance</span>
                        <span className="text-sm font-extrabold text-[#0A1628]">~15 km Transit</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItinerarySection;