import React, { useState } from "react";
import { Bell, Settings, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="w-full h-16 bg-white text-gray-800 flex items-center justify-between px-4 sm:px-6 shadow-sm border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-blue-600 truncate">
          CGST & C.Ex Bhiwandi Commissionerate
        </div>
        {/* <div className="h-6 w-px bg-gray-200 mx-4"></div>
        <div className="text-sm text-gray-500">GST Case Monitoring Portal</div> */}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          to="/alerts"
          className={`p-2 sm:p-3 rounded-full text-sm font-medium transition-all ${
            location.pathname === "/alerts"
              ? "bg-blue-50 text-blue-600 shadow-sm"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Bell className="w-5 h-5" />
        </Link>

        <Link
          to="/settings"
          className={`p-2 sm:p-3 rounded-full text-sm font-medium transition-all ${
            location.pathname === "/settings"
              ? "bg-blue-50 text-blue-600 shadow-sm"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Settings className="w-5 h-5" />
        </Link>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200 focus:outline-none"
          >
            <img
              src="https://ui-avatars.com/api/?name=User&background=2563eb&color=fff"
              alt="Profile"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-gray-100"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-medium text-gray-800">User Name</span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
          </button>

          {/* Mobile Profile Dropdown */}
          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                  <div className="font-medium text-gray-800">User Name</div>
                  <div className="text-sm text-gray-500">Administrator</div>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Profile Settings
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Account Settings
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("userData");
                    window.location.href = "/login";
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
