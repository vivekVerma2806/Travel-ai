import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Sparkles, CheckCircle, Compass, MessageSquare } from 'lucide-react';

const Contact = () => {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 4000);
    };

    const contactItems = [
        {
            icon: Mail,
            title: 'Email Us',
            subtitle: 'Our dedicated travel support team is here.',
            value: 'support@pathora.app',
            href: 'mailto:support@pathora.app',
            colorBg: 'bg-[#00B4D8]/10',
            colorText: 'text-[#00B4D8]',
            linkColor: 'text-[#00B4D8] hover:text-[#0096B4]',
        },
        {
            icon: Phone,
            title: 'Call Support',
            subtitle: 'Monday–Friday from 9:00 AM to 6:00 PM UTC.',
            value: '+1 (800) 555-PATH',
            href: 'tel:+18005557284',
            colorBg: 'bg-[#FF6B35]/10',
            colorText: 'text-[#FF6B35]',
            linkColor: 'text-[#FF6B35] hover:text-[#E85D26]',
        },
        {
            icon: MapPin,
            title: 'Global Headquarters',
            subtitle: 'Visit our traveler hub.',
            value: '42 Journey Lane, Pathora Way, CA 94107',
            href: null,
            colorBg: 'bg-emerald-500/10',
            colorText: 'text-emerald-600',
            linkColor: 'text-[#0A1628]',
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-16 sm:py-24">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0096B4] text-xs font-bold uppercase tracking-wider mb-4">
                        <Compass className="w-3.5 h-3.5" />
                        We're Here For You
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A1628] mb-3 font-jakarta tracking-tight">
                        We'd Love to <span className="text-[#00B4D8]">Hear from You</span>
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
                        Have a question about your itinerary, group journeys, or partnership opportunities? Reach out anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Contact Info */}
                    <div className="lg:col-span-5 space-y-4">
                        {contactItems.map(({ icon: Icon, title, subtitle, value, href, colorBg, colorText, linkColor }, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover:border-[#00B4D8]/30 transition-all flex items-start gap-4">
                                <div className={`p-3.5 ${colorBg} rounded-xl ${colorText} flex-shrink-0`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-[#0A1628] font-jakarta mb-0.5">{title}</h3>
                                    <p className="text-slate-500 text-xs mb-1.5">{subtitle}</p>
                                    {href ? (
                                        <a href={href} className={`font-bold text-xs ${linkColor} transition-colors break-words`}>{value}</a>
                                    ) : (
                                        <p className={`font-medium text-xs ${linkColor} break-words`}>{value}</p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Tagline Card */}
                        <div className="bg-[#0A1628] p-6 rounded-2xl text-white shadow-md relative overflow-hidden border border-slate-800">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B4D8]/10 rounded-full blur-2xl pointer-events-none" />
                            <div className="flex items-center gap-2 text-[#00B4D8] mb-2">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Official Promise</span>
                            </div>
                            <h3 className="text-lg font-extrabold mb-1.5 font-jakarta text-white">Every Journey Has a Path.</h3>
                            <p className="text-slate-300 text-xs leading-relaxed">
                                At Pathora, we ensure every detail of your expedition is backed by responsive, dedicated support.
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-xs border border-slate-200/80">
                        {sent ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-extrabold text-[#0A1628] mb-2 font-jakarta">Message Transmitted!</h3>
                                <p className="text-slate-500 text-xs max-w-sm">Thanks for reaching out. A Pathora traveler specialist will connect with you within 24 hours.</p>
                            </div>
                        ) : (
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <h2 className="text-xl font-extrabold text-[#0A1628] font-jakarta">Send Us a Direct Message</h2>
                                    <p className="text-slate-500 text-xs mt-0.5">Fill out the form below and we will follow up promptly.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Your Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none transition-all"
                                            placeholder="Alex Johnson"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none transition-all"
                                            placeholder="alex@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Subject</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none transition-all"
                                        placeholder="How can we assist your journey?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Message</label>
                                    <textarea
                                        rows="4"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none transition-all resize-none"
                                        placeholder="Describe your trip details or inquiry..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#00B4D8] hover:bg-[#0096B4] text-white text-xs font-bold py-3.5 rounded-xl shadow-md shadow-[#00B4D8]/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Send Message</span>
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
