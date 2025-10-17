import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";

export default function PropertiesTab() {
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "Sunset Villa",
      unit: "Unit 4A",
      location: "Cape Town",
      rent: 12000,
      status: "Available",
      image:
        "https://res.cloudinary.com/dq6lcecng/image/upload/v1758626947/listings/b1hcfpcn2njznlqnecwl.png",
    },
    {
      id: 2,
      name: "Ocean Breeze",
      unit: "Unit 12B",
      location: "Durban",
      rent: 15000,
      status: "Occupied",
      image:
        "https://res.cloudinary.com/dq6lcecng/image/upload/v1758626947/listings/b1hcfpcn2njznlqnecwl.png",
    },
    {
      id: 3,
      name: "Mountain View",
      unit: "Unit 7C",
      location: "Johannesburg",
      rent: 10000,
      status: "Available",
      image:
        "https://res.cloudinary.com/dq6lcecng/image/upload/v1758626947/listings/b1hcfpcn2njznlqnecwl.png",
    },
    {
      id: 4,
      name: "City Heights",
      unit: "Unit 3D",
      location: "Pretoria",
      rent: 13000,
      status: "Under Maintenance",
      image:
        "https://res.cloudinary.com/dq6lcecng/image/upload/v1758626947/listings/b1hcfpcn2njznlqnecwl.png",
    },
  ]);

  const addProperty = () => {
    const name = prompt("Enter Property Name:");
    if (!name) return;
    const unit = prompt("Enter Unit:");
    if (!unit) return;
    const location = prompt("Enter Location:");
    if (!location) return;
    const rent = parseFloat(prompt("Enter Rent Amount:"));
    if (isNaN(rent)) return;
    const status = prompt(
      "Enter Status (Available/Occupied/Under Maintenance):"
    );
    if (!status) return;

    const newProperty = {
      id: properties.length + 1,
      name,
      unit,
      location,
      rent,
      status,
      image: "https://source.unsplash.com/400x250/?house",
    };

    setProperties([...properties, newProperty]);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700";
      case "Occupied":
        return "bg-blue-100 text-blue-700";
      case "Under Maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* Add Property Button */}
      <motion.button
        onClick={addProperty}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-xl shadow-lg font-semibold text-md hover:from-blue-600 hover:to-blue-700 transition-all"
      >
        <FaPlusCircle />
        Add Property
      </motion.button>

      {/* Property Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {properties.map((property) => (
          <motion.div
            key={property.id}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer w-full max-w-sm"
            whileHover={{
              scale: 1.03,
              y: -3,
              boxShadow: "0 15px 25px rgba(0,0,0,0.1)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
              />
              <span
                className={`${getStatusClasses(
                  property.status
                )} absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold`}
              >
                {property.status}
              </span>
            </div>

            {/* Details */}
            <div className="p-4 text-center">
              <p className="font-bold text-gray-800 text-base truncate">
                {property.name}
              </p>
              <p className="text-gray-600 text-sm truncate">{property.unit}</p>
              <p className="text-gray-500 text-sm truncate">
                {property.location}
              </p>
              <p className="text-blue-700 font-semibold mt-2 text-sm">
                R{property.rent.toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
