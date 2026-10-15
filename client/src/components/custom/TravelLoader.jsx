import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Route } from 'lucide-react';

const loadingMessages = [
    "Discovering hidden gems...",
    "Crafting your perfect itinerary...",
    "Analyzing travel preferences...",
    "Curating local experiences...",
    "Mapping out your journey...",
];

const TravelLoader = () => {
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex(prev => (prev + 1) % loadingMessages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/96 backdrop-blur-md">
            {/* Logo mark */}
            <div className="mb-8 flex items-center gap-3">
                <img src="/logo.png" alt="Pathora" className="w-11 h-11 object-contain drop-shadow-sm" />
                <div className="flex flex-col text-left">
                    <span className="text-2xl font-extrabold text-[#0A1628] font-jakarta tracking-tight">
                        Pathora
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#00B4D8]">
                        Every Journey Has a Path.
                    </span>
                </div>
            </div>

            <div className="relative w-44 h-44 flex items-center justify-center">
                {/* Central Map Pin — Pathora Teal & Sunset Orange */}
                <div className="absolute z-10 animate-bounce">
                    <MapPin className="w-16 h-16 text-[#00B4D8] fill-[#00B4D8]/20 drop-shadow-md" />
                </div>

                {/* Orbiting Ring 1 */}
                <div className="absolute inset-0 border-4 border-dashed border-[#00B4D8]/30 rounded-full animate-[spin_8s_linear_infinite]" />

                {/* Orbiting Ring 2 */}
                <div className="absolute inset-4 border-4 border-dashed border-[#FF6B35]/30 rounded-full animate-[spin_6s_linear_infinite_reverse]" />

                {/* Orbiting Plane */}
                <div className="absolute inset-0 animate-[spin_3.5s_linear_infinite]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform -rotate-45">
                        <Plane className="w-9 h-9 text-[#00B4D8] fill-[#00B4D8]/20" />
                    </div>
                </div>

                {/* Orbiting Route icon */}
                <div className="absolute inset-0 animate-[spin_5s_linear_infinite_reverse]">
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                        <Route className="w-7 h-7 text-[#FF6B35]" />
                    </div>
                </div>
            </div>

            {/* Text Content */}
            <div className="mt-10 text-center space-y-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold font-jakarta text-[#0A1628]">
                    Finding Your <span className="text-[#00B4D8]">Path</span>
                </h2>
                <div className="flex flex-col items-center gap-1.5 text-slate-500 min-h-[3rem]">
                    <p className="text-base font-medium transition-all duration-500">{loadingMessages[msgIndex]}</p>
                    <p className="text-xs font-semibold tracking-wider uppercase text-[#00B4D8]/80">Curated by Pathora AI</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 w-72 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-[#00B4D8] via-[#00E5FF] to-[#FF6B35] rounded-full animate-[loading_2s_ease-in-out_infinite]" />
            </div>

            <style>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0%); }
                    100% { transform: translateX(110%); }
                }
            `}</style>
        </div>
    );
};

export default TravelLoader;
