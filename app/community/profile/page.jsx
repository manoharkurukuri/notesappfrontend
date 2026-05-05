"use client";
import React, { useState } from "react";
import { useAuthstore } from "../../../store/useAuthstore";

const ProfilePage = () => {
  const { authUser, update } = useAuthstore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [imageUrl, setImageUrl] = useState(authUser?.imageUrl || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const openModal = () => {
    // sync with latest authUser data
    setFullName(authUser?.fullName || "");
    setEmail(authUser?.email || "");
    setImageUrl(authUser?.imageUrl || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isUpdating) return;
    setIsModalOpen(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      await update({
        fullName,
        email,
        imageUrl,
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      // show toast / error here if you want
    } finally {
      setIsUpdating(false);
    }
  };

  const getInitials = () => {
    const name = authUser?.fullName || authUser?.username || "";
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // simple loading state if authUser is not ready yet
  if (!authUser) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-black">
        <div className="text-gray-500 text-sm animate-pulse">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        {/* Header / Title */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Manage your Notes Community identity and account details.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl shadow-xl backdrop-blur-sm p-6 md:p-8 flex flex-col md:flex-row gap-8">
          {/* Left: Avatar + quick info */}
          <div className="md:w-1/3 flex flex-col items-center md:items-start gap-4">
            <div className="relative">
              {authUser?.imageUrl ? (
                <img
                  src={authUser.imageUrl}
                  alt={authUser?.fullName || "Profile picture"}
                  className="h-28 w-28 md:h-32 md:w-32 rounded-full object-cover border-4 border-sky-500/40 shadow-lg shadow-sky-900/40"
                />
              ) : (
                <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-sky-500/20 flex items-center justify-center text-3xl md:text-4xl font-semibold text-sky-300 border-4 border-sky-500/30 shadow-lg shadow-sky-900/40">
                  {getInitials()}
                </div>
              )}
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold text-white">
                {authUser?.fullName || "Unnamed User"}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                @{authUser?.username || "username"}
              </p>
            </div>

            <button
              onClick={openModal}
              className="mt-1 inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-medium bg-sky-600 text-white hover:bg-sky-500 transition-colors shadow-sm"
            >
              Edit profile
            </button>
          </div>

          {/* Right: Details */}
          <div className="md:w-2/3 grid gap-5">
            {/* Username - read only */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Username
              </span>
              <div className="mt-1 inline-flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2">
                <span className="text-sm text-slate-100 break-all">
                  @{authUser?.username || "-"}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase">
                  read only
                </span>
              </div>
            </div>

            {/* Full Name */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Full Name
              </span>
              <span className="mt-1 text-sm md:text-base text-slate-100 break-all">
                {authUser?.fullName || "-"}
              </span>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Email
              </span>
              <span className="mt-1 text-sm md:text-base text-slate-100 break-all">
                {authUser?.email || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="absolute inset-0" onClick={closeModal} />

          <div className="relative z-50 w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-7">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-1">
              Edit Profile
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              You can update your full name, email and profile picture. Your
              username cannot be changed.
            </p>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center">
                <label className="relative cursor-pointer group">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="profile"
                      className="h-24 w-24 rounded-full object-cover border-4 border-sky-500/50 shadow-md shadow-sky-900/40 group-hover:opacity-90 transition"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-sky-500/20 flex items-center justify-center text-2xl font-semibold text-sky-300 border-4 border-sky-500/40 shadow-md shadow-sky-900/40 group-hover:opacity-90 transition">
                      {getInitials()}
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 text-[11px] text-white font-medium transition">
                    Change
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setImageUrl(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                <p className="text-[11px] text-slate-400 mt-2">
                  Click avatar to upload a new picture
                </p>
              </div>

              {/* Username (read-only) */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={authUser?.username || ""}
                  readOnly
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-300 cursor-not-allowed"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="you@example.com"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800/80 transition"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {isUpdating ? "Updating..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
