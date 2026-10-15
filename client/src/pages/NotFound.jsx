import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search, ArrowRight } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-[80vh] bg-[#F8FAFC] flex items-center justify-center px-4 py-16">
            <div className="max-w-xl w-full text-center">
                {/* Brand Logo & Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <img
                            src="/assets/pathora/illustrations/no-results.svg"
                            alt="Path not found"
                            className="w-56 h-44 mx-auto object-contain drop-shadow-sm"
                        />
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0096B4] text-xs font-bold uppercase tracking-wider mb-4">
                    <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                    Waypoint Not Found
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0A1628] font-jakarta mb-3 tracking-tight">
                    Lost on the <span className="text-[#00B4D8]">Path</span>?
                </h1>

                <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
                    The destination you're attempting to reach doesn't exist or has moved. Every journey has a path — let's help you find yours.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00B4D8] hover:bg-[#0096B4] text-white text-xs font-bold shadow-md shadow-[#00B4D8]/20 transition-all hover:-translate-y-0.5"
                    >
                        <Home className="w-4 h-4" />
                        <span>Return to Main Path</span>
                    </Link>

                    <Link
                        to="/explore"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-[#0A1628] hover:border-[#00B4D8] hover:text-[#00B4D8] text-xs font-bold shadow-xs transition-all hover:-translate-y-0.5"
                    >
                        <Search className="w-4 h-4" />
                        <span>Explore Destinations</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
