import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  Home,
  FileCheck,
  FileText,
  Shield,
  Menu,
  X,
  ChevronRight
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Verification", path: "/verification", icon: FileCheck },
  { name: "Investigation", path: "/entry-details", icon: FileText },
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all duration-200"
      >
        {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static h-full overflow-y-auto w-60 bg-gradient-to-lb from-[#f5f6f8] via-[#d3def5] to-[#f9fafd] shadow-md flex flex-col z-40 transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-sm">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#00256c]">GST PORTAL</h2>
              <p className="text-xs text-gray-700 font-medium">Case Monitoring System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center mb-2 justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-[#00256c] text-white shadow-md"
                      : "text-gray-700 hover:bg-[#e6ecf7]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-bLACK group-hover:text-blue-700"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-5 h-5 text-white" />}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-6 border-t border-blue-100 mt-auto">
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-[#00256c] hover:bg-[#0039a6] rounded-xl transition-all duration-200 shadow-sm"
            onClick={() => {
              localStorage.removeItem("userData");
              window.location.href = "/login";
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <div className="mt-4 text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} GST Case Monitoring Portal
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
