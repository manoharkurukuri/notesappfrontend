"use client";
import { Menu, Share2, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import SideMenu from "./SideMenu";
import { useAuthstore } from "../store/useAuthstore";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const activeMenu = "dashboard"; // or pass from parent/layout if you want dynamic

  const {
    authUser,
    logout,
    checkAuth,
    isCheckingAuth,
    isAuthenticated,
    isLoggingIn,
  } = useAuthstore();

  const router = useRouter();

  const handleLogout = () => {
    setOpenUserMenu(false);
    logout();
    router.push("/signin");
  };

  // ✅ run checkAuth only once when Navbar mounts
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
    };
    verifyAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ⬅️ no checkAuth in deps -> no loop

  // ✅ redirect after auth check result
  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated && !isLoggingIn) {
      router.push("/signin");
    }
  }, [isCheckingAuth, isAuthenticated, isLoggingIn, router]);

  return (
    <div className="flex items-center justify-between gap-5 bg-black border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-30">
      {/* left side - menu button and title */}
      <div className="flex items-center gap-5">
        <button
          onClick={() => setOpenSideMenu(!openSideMenu)}
          className="block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors"
        >
          {openSideMenu ? <X className="text-2xl" /> : <Menu className="text-2xl" />}
        </button>
        <div className="flex items-center gap-2">
          <Share2 className="text-blue-600" />
          <span className="text-lg font-medium text-white truncate">
            Notes Community
          </span>
        </div>
      </div>

      {/* right side - user avatar / menu */}
      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <button
            onClick={() => setOpenUserMenu((prev) => !prev)}
            className="flex items-center justify-center rounded-full hover:bg-gray-100 p-1 transition-colors"
          >
            {authUser?.imageUrl ? (
              <img
                src={authUser.imageUrl}
                alt={authUser?.fullName || "User avatar"}
                className="h-9 w-9 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <User className="h-7 w-7 text-gray-700" />
            )}
          </button>

          {openUserMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-100 py-2 z-40">
              <Link
                href="/community/profile"
                onClick={() => setOpenUserMenu(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* mobile side menu */}
      {openSideMenu && (
        <div className="fixed top-[73px] left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
