import React, { useState, useEffect } from "react";
import api from "../service/api";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Loader2, Eye, EyeOff, CheckCircle2, Sparkles } from "lucide-react";

const Register = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get("role") === "admin" ? "admin" : searchParams.get("role") === "organiser" ? "organiser" : "user";
    const [role, setRole] = useState(initialRole);
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const urlRole = searchParams.get("role");
        if (urlRole === "admin") setRole("admin");
        else if (urlRole === "organiser") setRole("organiser");
        else if (urlRole === "user") setRole("user");
    }, [searchParams]);

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await api.post("/auth/register", {
                ...credentials,
                role: role
            });
            setSuccess(`Registration successful! Please wait for admin approval for your ${role} account.`);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-72px)] flex justify-center items-center bg-[#F8FAFC] px-4 py-12">
            <div className="w-full max-w-md">

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10">

                    {/* Brand Lockup Header */}
                    <div className="text-center mb-6">
                        <Link to="/" className="inline-flex flex-col items-center group">
                            <img
                                src="/logo.png"
                                alt="Pathora Logo"
                                className="w-12 h-12 rounded-xl object-contain shadow-xs mb-2 group-hover:scale-105 transition-transform"
                            />
                            <span className="font-extrabold text-2xl tracking-tight text-[#0A1628] font-jakarta leading-none">
                                Pathora
                            </span>
                            <span className="text-[11px] font-semibold text-[#00B4D8] tracking-wider mt-1">
                                Every Journey Has a Path.
                            </span>
                        </Link>
                    </div>

                    {!success && (
                        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                            <button
                                type="button"
                                onClick={() => setRole("user")}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${role === "user"
                                    ? "bg-white text-[#0A1628] shadow-xs"
                                    : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                User
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("organiser")}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${role === "organiser"
                                    ? "bg-white text-[#00B4D8] shadow-xs"
                                    : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                Organiser
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("admin")}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${role === "admin"
                                    ? "bg-white text-rose-600 shadow-xs"
                                    : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                Admin
                            </button>
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-4">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold mb-2 text-[#0A1628]">
                                Registration Successful!
                            </h2>
                            <p className="text-xs text-slate-600 mb-6 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                                {success}
                            </p>
                            <Link
                                to="/login"
                                className="inline-block bg-[#00B4D8] hover:bg-[#0096B4] text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all shadow-sm"
                            >
                                Sign In to Pathora
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-extrabold text-[#0A1628] font-jakarta">
                                    Create Your Account
                                </h2>
                                <p className="text-slate-500 text-xs mt-1">
                                    Join Pathora and start planning your next adventure.
                                </p>
                            </div>

                            <form onSubmit={handleClick} className="space-y-4">
                                <div>
                                    <label className="block text-slate-700 text-xs font-semibold mb-1.5" htmlFor="username">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        required
                                        value={credentials.username}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00B4D8] focus:bg-white transition-all text-slate-800 placeholder-slate-400"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 text-xs font-semibold mb-1.5" htmlFor="email">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={credentials.email}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00B4D8] focus:bg-white transition-all text-slate-800 placeholder-slate-400"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 text-xs font-semibold mb-1.5" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            required
                                            value={credentials.password}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00B4D8] focus:bg-white transition-all text-slate-800 placeholder-slate-400 pr-10"
                                            placeholder="Create a password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-rose-50 border border-rose-200 text-rose-600 px-3.5 py-2 rounded-xl text-xs font-medium">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white transition-all flex justify-center items-center gap-2 shadow-sm cursor-pointer mt-2
                                        ${role === 'admin'
                                            ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                                            : 'bg-[#00B4D8] hover:bg-[#0096B4] shadow-[#00B4D8]/25'
                                        }`}
                                >
                                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {loading ? "Creating Account..." : "Sign Up"}
                                </button>
                            </form>

                            {/* OR Divider */}
                            <div className="flex items-center gap-3 my-5">
                                <div className="flex-1 h-px bg-slate-200" />
                                <span className="text-slate-400 text-xs font-semibold tracking-wider">OR</span>
                                <div className="flex-1 h-px bg-slate-200" />
                            </div>

                            {/* Social Buttons */}
                            <div className="space-y-2.5">
                                <button
                                    type="button"
                                    onClick={() => alert("Social authentication configured for production.")}
                                    className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                                    </svg>
                                    Continue with Google
                                </button>
                                <button
                                    type="button"
                                    onClick={() => alert("Social authentication configured for production.")}
                                    className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                    </svg>
                                    Continue with GitHub
                                </button>
                            </div>

                            <div className="text-center mt-6 pt-4 border-t border-slate-100">
                                <p className="text-slate-600 text-xs">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="font-semibold text-[#00B4D8] hover:underline"
                                    >
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Register;
