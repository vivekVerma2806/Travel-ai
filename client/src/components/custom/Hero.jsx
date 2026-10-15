import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, MapPin, Users, MessageSquare, ArrowRight, Compass, Calendar, ChevronRight } from "lucide-react";

export default function Hero() {
    const popularDestinations = [
        {
            name: "Bali",
            country: "Indonesia",
            image: "/assets/pathora/destinations/bali.jpg",
            tag: "Nature & Zen",
            trips: "1.2k+ travelers"
        },
        {
            name: "Paris",
            country: "France",
            image: "/assets/pathora/destinations/paris.jpg",
            tag: "Romance & Art",
            trips: "2.4k+ travelers"
        },
        {
            name: "Tokyo",
            country: "Japan",
            image: "/assets/pathora/destinations/tokyo.jpg",
            tag: "Culture & Tech",
            trips: "1.8k+ travelers"
        },
        {
            name: "Santorini",
            country: "Greece",
            image: "/assets/pathora/destinations/santorini.jpg",
            tag: "Caldera Vistas",
            trips: "950+ travelers"
        },
        {
            name: "New York",
            country: "USA",
            image: "/assets/pathora/destinations/newyork.jpg",
            tag: "Urban Energy",
            trips: "3.1k+ travelers"
        }
    ];

    return (
        <div className="w-full">
            {/* HERO SECTION — Exact UI Reference Direction */}
            <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
                {/* Full-bleed Santorini Sunset Travel Photography */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/pathora/destinations/santorini-hero.jpg"
                        alt="Santorini caldera sunset"
                        className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.08] transform scale-102 transition-transform duration-1000"
                    />
                    {/* Cinematic Dark Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/90 via-[#0A1628]/65 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-black/30" />
                </div>

                {/* Hero Content Container */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                    <div className="max-w-2xl text-left">

                        {/* Top subtle brand pill */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-fadeIn">
                            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                            <span className="text-xs font-semibold text-white tracking-wide">
                                Intelligent Travel Platform
                            </span>
                        </div>

                        {/* Authoritative Headline matching UI Reference */}
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white font-jakarta tracking-tight leading-[1.08] mb-6">
                            Your Next Journey <br />
                            <span className="text-pathora-teal drop-shadow-sm">
                                Starts Here.
                            </span>
                        </h1>

                        {/* Subtitle matching UI Reference */}
                        <p className="text-base sm:text-lg lg:text-xl text-slate-200 font-normal leading-relaxed mb-10 max-w-xl">
                            Plan smarter trips with AI-powered itineraries, discover real destinations, and bring your travel group together in one place.
                        </p>

                        {/* Action Buttons matching UI Reference */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-16">
                            <Link to="/create-trip">
                                <button className="pathora-btn-orange flex items-center justify-center gap-3 text-base cursor-pointer w-full sm:w-auto">
                                    <span>Plan Your Journey</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                            <Link to="/explore">
                                <button className="px-6 py-3 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 transition-all text-base cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2">
                                    <Compass className="w-5 h-5 text-[#00E5FF]" />
                                    <span>Explore Trips</span>
                                </button>
                            </Link>
                        </div>

                        {/* 4 Bottom Glass Badges matching UI Reference */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t border-white/15">
                            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/95">
                                <div className="p-2 rounded-lg bg-[#00B4D8]/20 text-[#00E5FF]">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-semibold leading-snug">
                                    AI-Powered Itinerary Planning
                                </span>
                            </div>

                            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/95">
                                <div className="p-2 rounded-lg bg-[#00B4D8]/20 text-[#00E5FF]">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-semibold leading-snug">
                                    Discover Places Worth Exploring
                                </span>
                            </div>

                            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/95">
                                <div className="p-2 rounded-lg bg-[#00B4D8]/20 text-[#00E5FF]">
                                    <Users className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-semibold leading-snug">
                                    Travel Together, Plan Together
                                </span>
                            </div>

                            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/95">
                                <div className="p-2 rounded-lg bg-[#00B4D8]/20 text-[#00E5FF]">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-semibold leading-snug">
                                    Real-Time Collaboration
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* POPULAR DESTINATIONS SHOWCASE — matching UI Reference */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#00B4D8]">
                                Inspiring Getaways
                            </span>
                            <h2 className="text-3xl font-extrabold text-[#0A1628] font-jakarta mt-1">
                                Popular Destinations
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                Handcrafted AI itineraries generated for top global travel hotspots.
                            </p>
                        </div>
                        <Link
                            to="/explore"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#00B4D8] hover:text-[#0096B4] mt-4 sm:mt-0 group"
                        >
                            <span>View All Destinations</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    {/* Destination Cards Row (3:4 ratio per UI Reference) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                        {popularDestinations.map((dest, i) => (
                            <Link
                                to={`/create-trip?destination=${encodeURIComponent(dest.name + ', ' + dest.country)}`}
                                key={i}
                                className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-sm hover:shadow-xl transition-all duration-300 block"
                            >
                                <img
                                    src={dest.image}
                                    alt={`${dest.name}, ${dest.country}`}
                                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/30 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                    <span className="text-[11px] font-semibold text-[#00E5FF] tracking-wide block mb-1">
                                        {dest.tag}
                                    </span>
                                    <h3 className="text-xl font-bold font-jakarta leading-tight">
                                        {dest.name}
                                    </h3>
                                    <p className="text-xs text-slate-300">
                                        {dest.country}
                                    </p>
                                    <div className="mt-2 text-[10px] text-slate-400 font-medium">
                                        {dest.trips}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED ITINERARY SPOTLIGHT — Kyoto Cultural Adventure */}
            <section className="py-20 bg-[#F0F9FF] border-y border-slate-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-5 space-y-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00B4D8]/15 text-[#0096B4]">
                                <Sparkles className="w-3.5 h-3.5" /> Sample AI Journey
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1628] font-jakarta leading-tight">
                                Kyoto Cultural Adventure
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Experience how Pathora balances cultural heritage, zen gardens, local culinary gems, and optimized routing into a seamless multi-day schedule.
                            </p>
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="w-7 h-7 rounded-full bg-[#00B4D8] text-white flex items-center justify-center font-bold text-xs">
                                        1
                                    </div>
                                    <span><strong>Kinkaku-ji</strong> (Golden Pavilion) • 9:00 AM - 10:30 AM</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="w-7 h-7 rounded-full bg-[#00B4D8] text-white flex items-center justify-center font-bold text-xs">
                                        2
                                    </div>
                                    <span><strong>Arashiyama Bamboo Grove</strong> • 11:00 AM - 1:00 PM</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="w-7 h-7 rounded-full bg-[#00B4D8] text-white flex items-center justify-center font-bold text-xs">
                                        3
                                    </div>
                                    <span><strong>Fushimi Inari Taisha</strong> • 2:00 PM - 4:00 PM</span>
                                </div>
                            </div>
                            <div className="pt-4">
                                <Link to="/create-trip?destination=Kyoto%2C%20Japan">
                                    <button className="pathora-btn-teal flex items-center gap-2 cursor-pointer">
                                        <span>Generate Your Own Itinerary</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Visual Preview Card matching UI Reference */}
                        <div className="lg:col-span-7">
                            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-200/80">
                                <div className="rounded-xl overflow-hidden mb-5 aspect-[16/9] relative">
                                    <img
                                        src="/assets/pathora/destinations/kyoto-banner.jpg"
                                        alt="Kyoto Golden Pavilion"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#0A1628]/80 text-white text-xs font-semibold backdrop-blur-sm">
                                        5-Day Plan
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="rounded-xl overflow-hidden aspect-square relative group">
                                        <img src="/assets/pathora/destinations/kinkaku-ji.jpg" alt="Kinkaku-ji" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-end p-2 text-white text-[11px] font-bold">Kinkaku-ji</div>
                                    </div>
                                    <div className="rounded-xl overflow-hidden aspect-square relative group">
                                        <img src="/assets/pathora/destinations/arashiyama.jpg" alt="Arashiyama Bamboo" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-end p-2 text-white text-[11px] font-bold">Arashiyama</div>
                                    </div>
                                    <div className="rounded-xl overflow-hidden aspect-square relative group">
                                        <img src="/assets/pathora/destinations/fushimi-inari.jpg" alt="Fushimi Inari" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-end p-2 text-white text-[11px] font-bold">Fushimi Inari</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION — Pathora Final Prompt */}
            <section className="py-20 bg-[#0A1628] text-white relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
                    <img
                        src="/logo.png"
                        alt="Pathora App Icon"
                        className="w-16 h-16 rounded-2xl mx-auto shadow-lg"
                    />
                    <h2 className="text-3xl sm:text-5xl font-extrabold font-jakarta tracking-tight">
                        Every Journey Has a Path.
                    </h2>
                    <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
                        Join travelers worldwide planning smarter adventures, collaborating with friends, and discovering unforgettable destinations with Pathora.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register">
                            <button className="pathora-btn-orange text-base font-semibold px-8 py-3.5 cursor-pointer w-full sm:w-auto">
                                Start Your Adventure Free
                            </button>
                        </Link>
                        <Link to="/explore">
                            <button className="px-6 py-3 rounded-xl font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-colors w-full sm:w-auto">
                                Browse Community Trips
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}