import React from "react";

const Navbar = () => {
  return (
    <div className="w-full h-16 bg-[#0a2342] text-white flex items-center justify-center shadow-md">
      <div className="flex-1 text-center text-2xl font-bold">GST</div>
      <div className="absolute right-8 flex items-center gap-3">
        <img
          src="https://ui-avatars.com/api/?name=User"
          alt="Profile"
          className="w-9 h-9 rounded-full border-2 border-white"
        />
        <span className="text-base font-medium">User Name</span>
      </div>
    </div>
  );
};

export default Navbar;
