import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import PropertyCard from "../pages/PropertyCard";
import AddPropertyModal from "../models/AddPropertyModel";
import LoadingSkeleton from "../pages/LoadingSkeleton";
import {
  useListingsQuery,
  useCreateListingMutation,
} from "../utils/queries.js";

export default function PropertiesTab() {
  const { userId: adminId } = useParams();
  const { data: properties = [], isLoading, isError } = useListingsQuery(adminId);
  const createPropertyMutation = useCreateListingMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    description: "",
    amenities: [],
    imageURL: [],
    price: "",
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    createPropertyMutation.mutate(formData, {
      onSuccess: () => {
        setShowAddModal(false);
      },
    });
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
    <motion.div className="space-y-6 max-w-6xl mx-auto">
      {/* Add Property Button */}
      <motion.button
        onClick={() => setShowAddModal(true)}
        whileHover={{
          scale: 1.07,
          boxShadow: "0 8px 25px rgba(59,130,246,0.45)",
        }}
        whileTap={{ scale: 0.96 }}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl shadow-md font-semibold text-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-out"
      >
        <FaPlusCircle className="text-lg" />
        Add Property
      </motion.button>
      {/* Properties Grid */}
      {/* Lease Cards / Loading / Error */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      )}
      {isError && (
        <div className="text-red-600 font-semibold text-center mt-10">
          Failed to load invoices. Please try again.
        </div>
      )}
      {!isLoading && !isError && properties.length === 0 && (
        <div className="text-gray-500 text-center mt-10 font-medium">
          No properties found. Add a new property to get started.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        <AnimatePresence>
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              getStatusClasses={getStatusClasses}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add Property Modal */}
      <AddPropertyModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        formData={formData}
        setFormData={setFormData}
        isPending={createPropertyMutation.isPending}
      />
    </motion.div>
  );
}
