import React from "react";

const CustomDropDown = ({
  values = [],
  name,
  value,
  className = "",
  placeholder = "",
  ...rest
}) => {
  return (
    <select
      name={name}
      value={value}
      className={`px-2 py-1 rounded-sm border border-gray-400 ${className}`}
      {...rest}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {values.map((option, idx) =>
        typeof option === "object" ? (
          <option key={option.value || idx} value={option.value}>
            {option.label}
          </option>
        ) : (
          <option key={option} value={option}>
            {option}
          </option>
        )
      )}
    </select>
  );
};

export default CustomDropDown;
