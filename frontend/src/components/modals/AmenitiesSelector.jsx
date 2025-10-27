import { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";

/**
 * Reusable Amenities Selector Component
 * Handles amenity selection with dropdown and tag display
 */
export default function AmenitiesSelector({ 
  availableOptions = [],
  selectedAmenities = [],
  onAmenitiesChange,
  error = "",
  required = false,
  placeholder = "Select amenities",
  className = ""
}) {
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

  // Handle amenity toggle
  const handleAmenityToggle = (amenity) => {
    const updatedAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((item) => item !== amenity)
      : [...selectedAmenities, amenity];
    onAmenitiesChange(updatedAmenities);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none text-sm sm:text-base bg-white flex items-center justify-between ${
            error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
          }`}
        >
          <span className="text-gray-500">
            {selectedAmenities.length > 0 
              ? `${selectedAmenities.length} amenities selected`
              : placeholder
            }
          </span>
          <FaChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
            {availableOptions.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3">{amenity}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-xs sm:text-sm font-medium flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
      
      {/* Selected Amenities Display */}
      {selectedAmenities.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedAmenities.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {amenity}
              <button
                type="button"
                onClick={() => handleAmenityToggle(amenity)}
                className="ml-2 hover:text-blue-600 transition-colors"
              >
                <FaTimes size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}