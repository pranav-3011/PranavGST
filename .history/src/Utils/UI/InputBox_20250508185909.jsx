import React from "react";

const InputBox = ({
  name,
  label,
  type = "text",
  className = "",
  isDisabled = false,
  ...rest
}) => {
  // Allow text, email, number, and date
  const inputType = ["email", "number", "date"].includes(type) ? type : "text";

  // Conditional classes for disabled state
  const disabledClasses = isDisabled
    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
    : "";

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-0"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={inputType}
        disabled={isDisabled}
        className={`border border-gray-600 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-slate-500 ${disabledClasses} ${className}`}
        {...rest}
      />
    </div>
  );
};

export default InputBox;
