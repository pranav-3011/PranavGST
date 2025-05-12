import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  Home,
  FileCheck,
  Search,
  FileText,
  Shield,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Verification", path: "/verification", icon: FileCheck },
  // { name: "Investigation", path: "/investigation", icon: Search },
  { name: "Entry Details", path: "/entry-details", icon: FileText },
];

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static h-[calc(100vh-4rem)] w-64 bg-white flex flex-col z-40 border-r border-gray-100 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">GST Portal</h2>
              {/* <p className="text-xs text-gray-500">GST Portal</p> */}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto">
          <div className="space-y-1 sm:space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-3 sm:p-4 border-t border-gray-100">
          <button
            className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm"
            onClick={() => {
              localStorage.removeItem("userData");
              window.location.href = "/login";
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <div className="mt-3 sm:mt-4 text-xs text-gray-400 text-center">
            &copy; {new Date().getFullYear()} GST Case Monitoring Portal. All
            rights reserved.
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
