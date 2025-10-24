import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { TabWrapper, StateHandler, ActionButton, PropertyCard } from "../common/index.js";
import AddPropertyModal from "../../models/AddPropertyModel.jsx";
import { propertyStatusMap } from "../../constants/status.js";
import Toast from "../../lib/toast.js";
import {
  useListingsQuery,
  useCreateListingMutation,
} from "../../utils/queries.js";

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
    status: "",
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
    <TabWrapper decorativeElements="default">
      {/* Add Property Button */}
      <div className="flex justify-start">
        <ActionButton
          onClick={() => setShowAddModal(true)}
          icon={FaPlusCircle}
          disabled={isLoading}
          size="medium"
        >
          Add Property
        </ActionButton>
      </div>

      <StateHandler
        isLoading={isLoading}
        isError={isError}
        data={properties}
        errorMessage="Failed to load properties. Please try again."
        emptyMessage="No properties found. Add a new property to get started."
        gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        loadingCount={6}
      >
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence>
            {properties.map((property, index) => (
              <motion.div
                key={property.listingId}
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
      </StateHandler>

      {/* Add Property Modal */}
      <AddPropertyModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        formData={formData}
        setFormData={setFormData}
        isPending={createPropertyMutation.isPending}
      />
    </TabWrapper>
  );
}
