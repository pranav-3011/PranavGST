import React from "react";
import { Bell, Settings } from "lucide-react";

const Navbar = () => {
  return (
    <div className="w-full h-16 bg-white text-gray-800 flex items-center justify-between px-6 shadow-sm border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold tracking-tight text-blue-600">
          Indian Customs
        </div>
        <div className="h-6 w-px bg-gray-200 mx-4"></div>
        <div className="text-sm text-gray-500">GST Portal</div>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-600">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-600">
          <Settings className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <img
            src="https://ui-avatars.com/api/?name=User&background=2563eb&color=fff"
            alt="Profile"
            className="w-9 h-9 rounded-full border-2 border-gray-100"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">User Name</span>
            <span className="text-xs text-gray-500">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
