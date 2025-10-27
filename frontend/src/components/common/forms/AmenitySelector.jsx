import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaCheck, FaTimes } from 'react-icons/fa';
import { amenitiesWithIcons } from '../../../constants/amenities';

export default function AmenitySelector({
  selectedAmenities = [],
  onChange,
  label = "Amenities",
  placeholder = "Select amenities...",
  className = "",
  maxHeight = "200px"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter amenities based on search term
  const filteredAmenities = amenitiesWithIcons.filter(amenity =>
    amenity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const handleAmenityToggle = (amenityId) => {
    const isSelected = selectedAmenities.includes(amenityId);
    let newSelected;
    
    if (isSelected) {
      newSelected = selectedAmenities.filter(id => id !== amenityId);
    } else {
      newSelected = [...selectedAmenities, amenityId];
    }
    
    onChange(newSelected);
  };

  const handleRemoveAmenity = (amenityId, event) => {
    event.stopPropagation();
    onChange(selectedAmenities.filter(id => id !== amenityId));
  };

  const getSelectedAmenitiesDisplay = () => {
    return selectedAmenities.map(id => {
      const amenity = amenitiesWithIcons.find(a => a.id === id);
      return amenity || { id, name: id, icon: null };
    });
  };

  const selectedDisplay = getSelectedAmenitiesDisplay();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      {/* Selected Amenities Display */}
      {selectedAmenities.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedDisplay.map((amenity) => {
            const Icon = amenity.icon;
            return (
              <div
                key={amenity.id}
                className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {Icon && <Icon className="w-3 h-3 mr-2" />}
                <span>{amenity.name}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveAmenity(amenity.id, e)}
                  className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Dropdown Trigger */}
      <div
        onClick={handleToggleDropdown}
        className={`
          w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer transition-all
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-200' : 'hover:border-gray-400'}
          ${selectedAmenities.length > 0 ? 'bg-gray-50' : 'bg-white'}
        `}
      >
        <div className="flex items-center justify-between">
          <span className={`text-sm ${selectedAmenities.length === 0 ? 'text-gray-500' : 'text-gray-700'}`}>
            {selectedAmenities.length === 0 
              ? placeholder 
              : `${selectedAmenities.length} amenit${selectedAmenities.length === 1 ? 'y' : 'ies'} selected`
            }
          </span>
          <FaChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search amenities..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Amenities List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredAmenities.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No amenities found
              </div>
            ) : (
              filteredAmenities.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity.id);
                const Icon = amenity.icon;
                
                return (
                  <div
                    key={amenity.id}
                    onClick={() => handleAmenityToggle(amenity.id)}
                    className={`
                      flex items-center px-4 py-3 cursor-pointer transition-colors
                      ${isSelected 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                        : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-3
                      ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}
                    `}>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>
                    
                    <span className="flex-1 text-sm font-medium">
                      {amenity.name}
                    </span>
                    
                    {isSelected && (
                      <FaCheck className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}