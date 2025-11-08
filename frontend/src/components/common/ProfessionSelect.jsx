// FormSelect component for dropdowns - matching properties pattern
import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function FormSelect({ value, onChange, options, hasError = false, disabled = false, placeholder = "Select an option" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange({ target: { value: option } });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2.5 border rounded-xl shadow-sm focus:ring-2 focus:border-blue-500 transition-all duration-200 outline-none text-sm bg-white flex items-center justify-between ${
          hasError
            ? "border-[#FF3B30] focus:ring-[#FF3B30]"
            : "border-gray-300 focus:ring-blue-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value || placeholder}
        </span>
        <FaChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};