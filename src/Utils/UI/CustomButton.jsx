import React from "react";

const styleMap = {
  red: "text-white bg-red-500 border-red-500 hover:text-red-500 hover:bg-white",
  blue: "text-white bg-blue-600 border-blue-600 hover:text-blue-600 hover:bg-white",
  green:
    "text-white bg-green-600 border-green-600 hover:text-green-600 hover:bg-white",
  yellow:
    "text-white bg-yellow-500 border-yellow-500 hover:text-yellow-500 hover:bg-white",
  secondary:
    "text-gray-700 bg-transparent border-gray-400 hover:bg-gray-400 hover:text-white",
};

const CustomButton = ({
  children,
  className = "",
  variant = "red", // default variant
  ...rest
}) => {
  const baseClasses =
    "rounded-sm px-2 py-1 border font-semibold cursor-pointer";
  const variantClasses = styleMap[variant] || styleMap["red"];

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default CustomButton;
