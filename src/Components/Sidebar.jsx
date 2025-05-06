import React from "react";
import { Link, useLocation } from "react-router-dom";
import CustomButton from "../Utils/UI/CustomButton";

const navItems = [
  { name: "Dashboard", path: "/" },
  { name: "Verification", path: "/verification" },
  { name: "Investigation", path: "/investigation" },
  { name: "EntryDetails", path: "/entry-details" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="h-[calc(100vh-4rem)] w-56 bg-[#112d4e] text-white shadow-lg flex flex-col py-8 px-4 z-40">
      {/* <div className="mb-8 text-lg font-semibold tracking-wide text-center">
        Menu
      </div> */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`rounded-md px-4 py-3 transition-all duration-200 font-medium hover:bg-[#3f72af] hover:text-white ${
              location.pathname === item.path
                ? "bg-[#3f72af] text-white shadow"
                : "text-gray-200"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex flex-col items-center">
        <button
          className="w-full py-2 px-4 mb-4 rounded-md bg-red-500 text-white font-semibold hover:bg-gray-300 transition-all duration-200 shadow cursor-pointer"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
        <div className="text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} GST
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
