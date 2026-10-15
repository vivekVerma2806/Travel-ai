import React from 'react';
import { Sparkles, Globe, Users, Zap, Heart, Compass, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    const stats = [
        { value: '50K+', label: 'Itineraries Curated', color: 'text-[#00B4D8]' },
        { value: '120+', label: 'Global Destinations', color: 'text-[#FF6B35]' },
        { value: '4.9/5', label: 'Traveler Satisfaction', color: 'text-emerald-500' },
    ];

    const values = [
        {
            icon: Sparkles,
            title: 'AI-First Planning',
            desc: 'We harness cutting-edge intelligence to craft personalized itineraries in seconds — tailored to your budget, pace, and interests.',
            accent: 'bg-[#00B4D8]/10 text-[#00B4D8]'
        },
        {
            icon: Users,
            title: 'Group Collaboration',
            desc: 'Real-time group planning, shared itineraries, and built-in chat make coordinating expeditions effortless.',
            accent: 'bg-[#FF6B35]/10 text-[#FF6B35]'
        },
        {
            icon: Globe,
            title: 'Global Geocoding & Wiki',
            desc: 'From remote mountain passes to cultural capitals, Pathora surfaces rich geographic details and trusted local context.',
            accent: 'bg-emerald-500/10 text-emerald-600'
        },
        {
            icon: Heart,
            title: 'Human-Centered Design',
            desc: 'Technology is our tool, but the joy of travel is our mission. We build for real explorers with genuine wanderlust.',
            accent: 'bg-amber-500/10 text-amber-600'
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Hero Section */}
            <div className="relative py-24 sm:py-32 flex items-center justify-center bg-[#0A1628] overflow-hidden">
                {/* Background image overlay */}
                <div className="absolute inset-0 opacity-25">
                    <img
                        src="/assets/pathora/destinations/santorini-hero.jpg"
                        alt="Pathora Travel"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/80 via-[#0A1628]/95 to-[#0A1628]" />

                <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 mb-6 backdrop-blur-md">
                        <Compass className="w-3.5 h-3.5 text-[#00B4D8]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#00E5FF]">Our Story & Mission</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 font-jakarta leading-tight tracking-tight">
                        Every Journey Has a <span className="text-[#00B4D8]">Path.</span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Pathora redefines how travelers discover, plan, and share their adventures. We combine intelligent itinerary generation with seamless group coordination to turn every trip into an unforgettable experience.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0096B4] text-xs font-bold uppercase tracking-wider mb-4">
                            <Zap className="w-3.5 h-3.5" /> Intelligent Travel
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1628] mb-6 font-jakarta leading-tight">
                            Travel should be <span className="text-[#00B4D8]">effortless</span> and deeply personal.
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                            At Pathora, we believe no two travelers are alike. Traditional travel agencies offer static, one-size-fits-all packages. Pathora replaces friction with fluid, intelligent curation — synthesizing real geocoding data, historical insights, and personalized pacing in seconds.
                        </p>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            Whether you're exploring the bamboo groves of Kyoto, navigating the caldera of Santorini, or taking a weekend cultural tour with close friends, Pathora is your trusted navigator.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {values.map(({ icon: Icon, title, desc, accent }, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 hover:shadow-md hover:border-[#00B4D8]/30 transition-all flex flex-col justify-between">
                                <div>
                                    <div className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center mb-4`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-[#0A1628] text-sm font-jakarta mb-1.5">{title}</h3>
                                    <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-16 border-y border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#00B4D8]">Proven Platform</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628] font-jakarta mt-1">
                            Pathora by the Numbers
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
                        {stats.map(({ value, label, color }, i) => (
                            <div key={i} className="p-6 bg-[#F8FAFC] rounded-2xl border border-slate-200/80 hover:border-[#00B4D8]/30 transition-all">
                                <div className={`text-4xl sm:text-5xl font-black font-jakarta ${color} mb-2`}>{value}</div>
                                <div className="text-slate-600 text-xs font-bold tracking-wide">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-20 text-center container mx-auto px-4">
                <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#0A1628] to-[#16243C] p-10 sm:p-14 rounded-3xl text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00B4D8]/10 rounded-full blur-3xl pointer-events-none" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#00E5FF]">Get Started Today</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-jakarta mt-2 mb-4">
                        Ready to Find Your Path?
                    </h2>
                    <p className="text-slate-300 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                        Experience next-generation travel planning. Create customized itineraries and connect with other travelers around the world.
                    </p>
                    <Link
                        to="/create-trip"
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FF6B35] hover:bg-[#E85D26] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#FF6B35]/25 transition-all hover:-translate-y-0.5"
                    >
                        <span>Plan Your Journey</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;
