import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Sparkles, Heart, Shield, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full bg-[#0A1628] text-white pt-16 pb-12 border-t border-[#1E293B] relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00B4D8]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

                    {/* Column 1 & 2: Brand & Tagline */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center gap-3">
                            <img
                                src="/logo.png"
                                alt="Pathora Logo"
                                className="w-10 h-10 rounded-xl object-contain shadow-xs"
                            />
                            <div>
                                <span className="font-extrabold text-2xl tracking-tight text-white font-jakarta">
                                    Pathora
                                </span>
                                <span className="block text-xs font-semibold text-[#00B4D8] tracking-wider">
                                    Every Journey Has a Path.
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                            Pathora combines intelligent travel curation, AI itinerary planning, and seamless group collaboration to turn dream destinations into unforgettable shared memories.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#16243C] text-cyan-300 border border-cyan-800/40">
                                <Sparkles className="w-3.5 h-3.5" /> AI Itinerary Engine
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#16243C] text-amber-300 border border-amber-800/40">
                                <Compass className="w-3.5 h-3.5" /> Real Destination Discovery
                            </span>
                        </div>
                    </div>

                    {/* Column 3: Explore */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-jakarta">
                            Discover
                        </h4>
                        <ul className="space-y-2.5 text-sm text-slate-400">
                            <li>
                                <Link to="/explore" className="hover:text-[#00B4D8] transition-colors">
                                    Explore Trips
                                </Link>
                            </li>
                            <li>
                                <Link to="/explore?filter=popular" className="hover:text-[#00B4D8] transition-colors">
                                    Popular Destinations
                                </Link>
                            </li>
                            <li>
                                <Link to="/explore?category=Cultural" className="hover:text-[#00B4D8] transition-colors">
                                    Cultural Expeditions
                                </Link>
                            </li>
                            <li>
                                <Link to="/explore?category=Adventure" className="hover:text-[#00B4D8] transition-colors">
                                    Adventure Treks
                                </Link>
                            </li>
                            <li>
                                <Link to="/create-trip" className="hover:text-[#00B4D8] transition-colors">
                                    AI Itinerary Planner
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Platform */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-jakarta">
                            Platform
                        </h4>
                        <ul className="space-y-2.5 text-sm text-slate-400">
                            <li>
                                <Link to="/my-trips" className="hover:text-[#00B4D8] transition-colors">
                                    My Trips
                                </Link>
                            </li>
                            <li>
                                <Link to="/chat" className="hover:text-[#00B4D8] transition-colors">
                                    Group Chat Rooms
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="hover:text-[#00B4D8] transition-colors">
                                    Traveler Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-[#00B4D8] transition-colors">
                                    About Pathora
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-[#00B4D8] transition-colors">
                                    Support & Feedback
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 5: Stay Connected */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-jakarta">
                            Stay Inspired
                        </h4>
                        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                            Get curated itineraries and hidden gems delivered directly to your inbox.
                        </p>
                        <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for joining Pathora!"); }} className="space-y-2">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    className="w-full bg-[#16243C] text-sm text-white placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-[#00B4D8] text-xs"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 rounded-xl text-xs font-semibold bg-[#00B4D8] hover:bg-[#0096B4] text-white transition-colors cursor-pointer shadow-xs"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>
                        © {new Date().getFullYear()} Pathora Inc. Every Journey Has a Path. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="/about" className="hover:text-slate-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/about" className="hover:text-slate-400 transition-colors">
                            Terms of Service
                        </Link>
                        <Link to="/contact" className="hover:text-slate-400 transition-colors">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
