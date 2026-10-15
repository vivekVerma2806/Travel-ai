import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../service/api';
import { useToast } from '../components/ui/toast';
import { User, Mail, Phone, Lock, Save, Camera, ShieldCheck, Heart, MapPin, Bell, Sliders, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('account'); // account, security, preferences
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        phone: '',
        avatar: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                bio: user.bio || '',
                phone: user.phone || '',
                avatar: user.avatar || ''
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/users/profile', formData);
            toast({ title: "Profile Updated", description: "Your Pathora profile information has been saved." });
            setIsEditing(false);
        } catch (error) {
            toast({ title: "Update Failed", description: error.response?.data?.message || "Failed to update profile", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({ title: "Password Mismatch", description: "New passwords do not match", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            await api.put('/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast({ title: "Password Changed", description: "Security credentials updated successfully." });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast({ title: "Change Failed", description: error.response?.data?.message || "Failed to change password", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Profile Header Card matching UI Reference */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                        <div className="w-16 h-16 rounded-full bg-[#0A1628] text-white flex items-center justify-center font-bold text-2xl shadow-xs shrink-0">
                            {(user?.username || user?.email || "P")[0].toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1628] font-jakarta leading-tight">
                                {user?.username || "Pathora Traveler"}
                            </h2>
                            <p className="text-xs text-slate-500">{user?.email}</p>
                            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E0F7FA] text-[#0096B4]">
                                {user?.role || 'User'} Member
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-[#00B4D8] text-xs font-bold text-slate-700 hover:text-[#00B4D8] bg-white transition-all cursor-pointer shadow-xs"
                    >
                        {isEditing ? "View Details" : "Edit Profile"}
                    </button>
                </div>

                {/* 2-Column Section matching UI Reference */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

                    {/* Left Sub-Navigation Sidebar */}
                    <div className="md:col-span-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
                        <button
                            type="button"
                            onClick={() => { setActiveTab('account'); setIsEditing(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                activeTab === 'account'
                                    ? 'bg-[#F0F9FF] text-[#0096B4]'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <User className="w-4 h-4" />
                            <span>Account Information</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                activeTab === 'security'
                                    ? 'bg-[#F0F9FF] text-[#0096B4]'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <Lock className="w-4 h-4" />
                            <span>Security & Password</span>
                        </button>

                        <Link
                            to="/my-trips"
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            <MapPin className="w-4 h-4" />
                            <span>My Trips</span>
                        </Link>

                        <Link
                            to="/explore"
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            <Heart className="w-4 h-4" />
                            <span>Favorite Journeys</span>
                        </Link>
                    </div>

                    {/* Right Content Panel */}
                    <div className="md:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                        {activeTab === 'account' && !isEditing && (
                            <div className="space-y-6">
                                <div className="border-b border-slate-100 pb-4">
                                    <h3 className="text-lg font-bold text-[#0A1628] font-jakarta">
                                        Account Information
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Personal details associated with your Pathora traveler credentials.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                                            Full Name
                                        </span>
                                        <span className="text-sm font-bold text-slate-800">
                                            {user?.username || "Not specified"}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                                            Email Address
                                        </span>
                                        <span className="text-sm font-bold text-slate-800">
                                            {user?.email}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                                            Platform Role
                                        </span>
                                        <span className="text-sm font-bold text-slate-800 capitalize">
                                            {user?.role || "User"}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                                            Account Status
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                                            Contact Phone
                                        </span>
                                        <span className="text-sm font-bold text-slate-800">
                                            {formData.phone || "+1 (555) 019-2834"}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                                            Member Since
                                        </span>
                                        <span className="text-sm font-bold text-slate-800">
                                            {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'account' && isEditing && (
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="border-b border-slate-100 pb-4 mb-4">
                                    <h3 className="text-lg font-bold text-[#0A1628] font-jakarta">Edit Profile Details</h3>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Traveler Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={3}
                                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                                        placeholder="Passionate adventurer exploring new cultures..."
                                    />
                                </div>

                                <div className="pt-2 flex items-center gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#00B4D8] hover:bg-[#0096B4] transition-colors cursor-pointer"
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'security' && (
                            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                <div className="border-b border-slate-100 pb-4 mb-4">
                                    <h3 className="text-lg font-bold text-[#0A1628] font-jakarta">Security Settings</h3>
                                    <p className="text-xs text-slate-500">Update your account authentication password.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#00B4D8] hover:bg-[#0096B4] transition-colors cursor-pointer"
                                    >
                                        {loading ? "Updating..." : "Update Password"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
