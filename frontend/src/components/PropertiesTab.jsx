import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import PropertyCard from "../pages/PropertyCard.jsx";
import AddPropertyModal from "../models/AddPropertyModel.jsx";
import LoadingSkeleton from "../pages/LoadingSkeleton.jsx";
import { propertyStatusMap } from "../constants/status.js";
import Toast from "../lib/toast.js";
import {
  useListingsQuery,
  useCreateListingMutation,
} from "../utils/queries.js";

export default function PropertiesTab() {
  const { userId: adminId } = useParams();
  const { data: properties = [], isLoading, isError } = useListingsQuery(adminId);
  const createPropertyMutation = useCreateListingMutation();

  // Create a function that uses the propertyStatusMap object
  const getStatusClasses = (status) => {
    return propertyStatusMap[status] || "bg-gray-100 text-gray-700";
  };

  const handlePropertyAction = (action, property) => {
    switch (action) {
      case "edit":
        //TODO: Implement edit functionality
        Toast.info(`Editing property ${property.listingId}`);
        break;
      case "delete":
        //TODO: Implement delete functionality
        Toast.warning(`Deleting property ${property.listingId}`);
        break;
      case "view":
        //TODO: Implement view functionality
        Toast.info(`Viewing details for ${property.listingId}`);
        break;
      default:
        break;
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    description: "",
    amenities: [],
    imageURL: [],
    imageFiles: [],
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

  return (
    <motion.div 
      className="space-y-6 w-full relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 left-0 w-24 h-24 bg-purple-100/30 rounded-full blur-2xl -z-10"></div>
      
      {/* Add Property Button */}
      <div className="flex justify-start">
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
      </div>
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
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AnimatePresence>
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <PropertyCard
                property={property}
                getStatusClasses={getStatusClasses}
                onAction={handlePropertyAction}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

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
