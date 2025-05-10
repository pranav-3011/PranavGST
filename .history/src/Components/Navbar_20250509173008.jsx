import React, { useState, useEffect } from "react";
import { Bell, Settings, Menu, X, ChevronDown, User, LogOut, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`fixed top-0 right-0 left-0 z-30 transition-all duration-300 ${
        isScrolled 
          ? "h-14 bg-white/95 backdrop-blur-sm shadow-md" 
          : "h-16 bg-gradient-to-r from-blue-600/95 via-blue-500/95 to-indigo-600/95"
      } text-gray-800 flex items-center justify-between px-4 sm:px-6 border-b border-gray-100/30`}
    >
      <div className="flex items-center gap-2">
        <div className={`text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate transition-colors duration-300 ${
          isScrolled ? "text-blue-600" : "text-white"
        }`}>
          <span className="flex items-center gap-2">
            <Shield className={`h-6 w-6 ${isScrolled ? "text-blue-600" : "text-white"}`} />
            CGST & C.Ex Bhiwandi
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notifications */}
        <div className="relative">
          <Link
            to="/alerts"
            className={`p-2 sm:p-3 rounded-full text-sm font-medium transition-all hover:scale-105 relative ${
              location.pathname === "/alerts"
                ? isScrolled ? "bg-blue-100 text-blue-600" : "bg-white/20 text-white"
                : isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white/90 hover:bg-white/20"
            }`}
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {notificationCount}
              </span>
            )}
          </Link>
        </div>

        {/* Settings */}
        <Link
          to="/settings"
          className={`p-2 sm:p-3 rounded-full text-sm font-medium transition-all hover:scale-105 ${
            location.pathname === "/settings"
              ? isScrolled ? "bg-blue-100 text-blue-600" : "bg-white/20 text-white"
              : isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white/90 hover:bg-white/20"
          }`}
        >
          <Settings className="w-5 h-5" />
        </Link>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-2 sm:gap-3 pl-3 sm:pl-4 ml-1 border-l ${
              isScrolled ? "border-gray-200" : "border-white/20"
            } focus:outline-none group transition-all`}
          >
            <div className="overflow-hidden rounded-full p-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:animate-spin-slow">
              <img
                src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff"
                alt="Profile"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white"
              />
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className={`text-sm font-medium transition-colors duration-300 ${
                isScrolled ? "text-gray-800" : "text-white"
              }`}>User Name</span>
              <span className={`text-xs transition-colors duration-300 ${
                isScrolled ? "text-gray-500" : "text-white/80"
              }`}>Administrator</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${
              isScrolled ? "text-gray-400" : "text-white/70"
            } ${isProfileOpen ? "rotate-180" : ""} transition-transform duration-200`} />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-3 z-50 border border-gray-100 transform transition-all duration-200 origin-top-right">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="font-medium text-gray-800">User Name</div>
                  <div className="text-sm text-gray-500">Administrator</div>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    Profile Settings
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    Account Settings
                  </Link>
                </div>
                <div className="pt-1 border-t border-gray-100">
                  <button
                    onClick={() => {
                      localStorage.removeItem("userData");
                      window.location.href = "/login";
                    }}
                    className="flex items-center w-full gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
