import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../service/api";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [loginType, setLoginType] = useState("user"); // "user" | "organiser" | "admin"
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const { loading, error, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await api.post("/auth/login", credentials);
            const userRole = res.data.user.role;

            // Strict Role Validation based on Toggle
            if (loginType === 'admin') {
                if (userRole !== 'admin') {
                    throw new Error("Access Denied: You are not an administrator.");
                }
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
                navigate('/admin');
            } else if (loginType === 'organiser') {
                if (userRole !== 'organiser' && userRole !== 'admin') {
                    throw new Error("Access Denied: You are not an organiser.");
                }
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
                navigate('/organiser');
            } else {
                if (userRole === 'admin') {
                    throw new Error("Please use Admin Portal for administrator accounts.");
                }
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
                navigate('/');
            }
        } catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: err.response?.data?.message || err.message });
        }
    };

    return (
        <div className="min-h-[calc(100vh-72px)] flex justify-center items-center bg-[#F8FAFC] px-4 py-12">
            <div className="w-full max-w-md">

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10">

                    {/* Brand Lockup Header matching UI Reference */}
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

                    {/* Role Selection Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setLoginType("user")}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${loginType === "user"
                                ? "bg-white text-[#0A1628] shadow-xs"
                                : "text-slate-500 hover:text-slate-900"
                                }`}
                        >
                            User
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginType("organiser")}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${loginType === "organiser"
                                ? "bg-white text-[#00B4D8] shadow-xs"
                                : "text-slate-500 hover:text-slate-900"
                                }`}
                        >
                            Organiser
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginType("admin")}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${loginType === "admin"
                                ? "bg-white text-rose-600 shadow-xs"
                                : "text-slate-500 hover:text-slate-900"
                                }`}
                        >
                            Admin
                        </button>
                    </div>

                    {/* Card Title matching UI Reference */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-extrabold text-[#0A1628] font-jakarta">
                            {loginType === 'admin' ? 'Admin Portal' :
                                loginType === 'organiser' ? 'Organiser Portal' :
                                    'Welcome Back'}
                        </h2>
                        <p className="text-slate-500 text-xs mt-1">
                            Log in to continue your journey.
                        </p>
                    </div>

                    {/* Inputs Form */}
                    <form onSubmit={handleClick} className="space-y-4">
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
                                    placeholder="Enter your password"
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

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="rounded border-slate-300 text-[#00B4D8] focus:ring-[#00B4D8]"
                                />
                                <span>Remember me</span>
                            </label>
                            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Please contact your administrator to reset credentials."); }} className="text-[#00B4D8] hover:underline font-medium">
                                Forgot password?
                            </a>
                        </div>

                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-3.5 py-2 rounded-xl text-xs font-medium">
                                {error}
                            </div>
                        )}

                        {/* Submit Button matching UI Reference */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white transition-all flex justify-center items-center gap-2 shadow-sm cursor-pointer mt-2
                                ${loginType === 'admin'
                                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                                    : 'bg-[#00B4D8] hover:bg-[#0096B4] shadow-[#00B4D8]/25'
                                }`}
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {loading ? "Signing in..." : "Login"}
                        </button>
                    </form>

                    {/* OR Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-slate-400 text-xs font-semibold tracking-wider">OR</span>
                        <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    {/* Social Buttons matching UI Reference */}
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

                    {/* Switch Link matching UI Reference */}
                    <div className="text-center mt-6 pt-4 border-t border-slate-100">
                        <p className="text-slate-600 text-xs">
                            Don't have an account?{" "}
                            <Link
                                to={loginType === 'admin' ? "/register?role=admin" : loginType === 'organiser' ? "/register?role=organiser" : "/register"}
                                className="font-semibold text-[#00B4D8] hover:underline"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
