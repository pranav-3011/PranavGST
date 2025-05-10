import React, { useState, useEffect } from "react";
import { Bell, Settings, Menu, X, Search, User, ChevronDown, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New case added", time: "2 hours ago", read: false },
    { id: 2, message: "Reminder: Complete investigation report", time: "1 day ago", read: false },
    { id: 3, message: "System update scheduled", time: "3 days ago", read: true },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isNotificationOpen) setIsNotificationOpen(false);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen || isNotificationOpen) {
        if (!event.target.closest('.dropdown-container')) {
          setIsProfileOpen(false);
          setIsNotificationOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen, isNotificationOpen]);

  return (
    <div className="w-full h-16 bg-white text-gray-800 flex items-center justify-between px-4 sm:px-6 shadow-md border-b border-gray-100 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="text-xl md:text-2xl font-bold tracking-tight text-[#00256c] truncate">
          CGST & C.EX BHIWANDI
        </div>
      </div>

      {/* <div className="hidden md:flex items-center bg-gray-50 rounded-full px-3 py-1.5 border border-gray-200 w-1/3">
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search cases, reports..."
          className="bg-transparent border-none outline-none w-full text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div> */}

      <div className="flex items-center gap-1 sm:gap-3">
        {/* Notifications Button */}
        <div className="dropdown-container relative">
          <button
            onClick={toggleNotificationDropdown}
            className={`p-2 rounded-full text-sm font-medium transition-colors duration-200 relative ${
              isNotificationOpen
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-40 border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                <h3 className="font-semibold text-gray-700">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex justify-between">
                        <p className={`text-sm ${!notification.read ? "font-medium text-gray-800" : "text-gray-600"}`}>
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500 text-sm">
                    No notifications
                  </div>
                )}
              </div>
              
              <div className="px-4 py-2 border-t border-gray-100 text-center">
                <Link to="/notifications" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Help Button */}
        <Link
          to="/help"
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-200"
        >
          <HelpCircle className="w-5 h-5" />
        </Link>

        {/* Settings Button */}
        <Link
          to="/settings"
          className={`p-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            location.pathname === "/settings"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Settings className="w-5 h-5" />
        </Link>

        {/* Profile Section */}
        <div className="dropdown-container relative">
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center gap-2 pl-1 sm:pl-3 border-l border-gray-200 focus:outline-none"
          >
            <div className="relative">
              <img
                src="https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff"
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-gray-800">User Name</span>
              <div className="flex items-center">
                <span className="text-xs text-gray-500">Administrator</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 ml-1 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-40 border border-gray-100">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="font-medium text-gray-800">User Name</div>
                <div className="text-sm text-gray-500">administrator@gst.gov.in</div>
              </div>
              
              <div className="py-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  <span>Your Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>Settings</span>
                </Link>
              </div>
              
              <div className="border-t border-gray-100 pt-2 mt-1">
                <button
                  onClick={() => {
                    localStorage.removeItem("userData");
                    window.location.href = "/login";
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left"
                >
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
