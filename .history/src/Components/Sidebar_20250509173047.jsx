import React, { useState, useEffect } from "react";
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
  ChevronRight,
  ChevronLeft,
  BarChart2,
  UserPlus,
  Award,
  HelpCircle
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: Home, description: "Overview and analytics" },
  { name: "Verification", path: "/verification", icon: FileCheck, description: "Verify documents & records" },
  { name: "Investigation", path: "/entry-details", icon: FileText, description: "Case investigation details" },
  { name: "Reports", path: "/reports", icon: BarChart2, description: "Statistics and reports" },
  { name: "Taxpayers", path: "/taxpayers", icon: UserPlus, description: "Manage taxpayer information" },
];

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  // Check window size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-white/80 shadow-md hover:bg-white hover:scale-105 transition-all backdrop-blur-sm"
        aria-label="Toggle menu"
      >
        {isOpen ? 
          <X className="w-6 h-6 text-blue-600" /> : 
          <Menu className="w-6 h-6 text-blue-600" />
        }
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white flex flex-col z-40 border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "w-72"}`}
      >
        <div className={`p-4 border-b border-gray-100 flex ${isCollapsed ? "justify-center" : "justify-between"} items-center h-16`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
            <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800">GST Portal</h2>
                <p className="text-xs text-gray-500">Case Monitoring</p>
              </div>
            )}
          </div>
          
          {/* Toggle collapse button - visible only on desktop */}
          <button 
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 py-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className={`space-y-1 px-3 ${isCollapsed ? "text-center" : ""}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={() => setActiveHover(item.name)}
                  onMouseLeave={() => setActiveHover(null)}
                  className={`flex items-center ${isCollapsed ? "justify-center" : "px-4"} py-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } ${
                    !isCollapsed && activeHover === item.name && !isActive
                      ? "bg-gray-50"
                      : ""
                  }`}
                >
                  <div className={`flex ${isCollapsed ? "justify-center w-full" : ""}`}>
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"} ${
                      isCollapsed ? "mx-auto" : "mr-3"
                    }`} />
                    {!isCollapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </div>
                  
                  {/* Tooltips for collapsed state */}
                  {isCollapsed && activeHover === item.name && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10 whitespace-nowrap">
                      <div className="font-medium">{item.name}</div>
                      <div className="mt-1 text-gray-300 text-xs">{item.description}</div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
          
          {!isCollapsed && (
            <div className="mt-6 px-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                Support
              </div>
              <div className="space-y-1">
                <Link
                  to="/help"
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                  <HelpCircle className="w-5 h-5 text-gray-500 mr-3" />
                  Help Center
                </Link>
                <Link
                  to="/support"
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                  <Award className="w-5 h-5 text-gray-500 mr-3" />
                  Training Resources
                </Link>
              </div>
            </div>
          )}
        </nav>

        <div className={`p-4 border-t border-gray-100 ${isCollapsed ? "flex justify-center" : ""}`}>
          <button
            className={`cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all shadow-sm ${
              isCollapsed ? "w-10 h-10 p-0 rounded-full" : "w-full"
            }`}
            onClick={() => {
              localStorage.removeItem("userData");
              window.location.href = "/login";
            }}
            title="Sign Out"
          >
            <LogOut className={`w-4 h-4 ${isCollapsed ? "" : "mr-1"}`} />
            {!isCollapsed && "Sign Out"}
          </button>
          
          {!isCollapsed && (
            <div className="mt-4 text-xs text-gray-400 text-center">
              &copy; {new Date().getFullYear()} GST Monitoring Portal
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
