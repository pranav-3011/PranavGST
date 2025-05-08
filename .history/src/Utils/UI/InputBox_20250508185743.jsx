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

  // Function to validate input
  const handleKeyDown = (e) => {
    // Skip validation for date inputs
    if (type === "date") {
      // Call the original onKeyDown handler if it exists
      if (rest.onKeyDown) {
        rest.onKeyDown(e);
      }
      return;
    }
    
    // Regular expression to match allowed characters: alphabets, numbers, space and specified special characters
    const allowedPattern = /^[a-zA-Z0-9\s'",./\-_:;\\%#@!~&*()=+{}?]$/;

    // Allow control keys like backspace, delete, arrows, etc.
    const isControlKey =
      e.ctrlKey ||
      e.metaKey ||
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Tab";

    // If the key is not an allowed character and not a control key, prevent it
    if (!isControlKey && !allowedPattern.test(e.key)) {
      e.preventDefault();
    }

    // Call the original onKeyDown handler if it exists
    if (rest.onKeyDown) {
      rest.onKeyDown(e);
    }
  };

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
        onKeyDown={handleKeyDown}
        className={`border border-gray-600 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-slate-500 ${disabledClasses} ${className}`}
        {...rest}
      />
    </div>
  );
};

export default InputBox;
