import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";
import { useParams, useNavigate, Routes, Route } from "react-router-dom";
import { TabWrapper, StateHandler, ActionButton, PropertyCard } from "../common/index.js";
import { propertyStatusMap } from "../../constants/status.js";
import { useListingsQuery } from "../../utils/queries.js";
import ViewProperty from "./properties/ViewProperty.jsx";
import EditProperty from "./properties/EditProperty.jsx";
import DeleteProperty from "./properties/DeleteProperty.jsx";
import AddProperty from "./properties/AddProperty.jsx";

export default function PropertiesTab() {
  return (
    <Routes>
      <Route path="add" element={<AddProperty />} />
      <Route path="view/:propertyId" element={<ViewProperty />} />
      <Route path="edit/:propertyId" element={<EditProperty />} />
      <Route path="delete/:propertyId" element={<DeleteProperty />} />
      <Route index element={<PropertiesListView />} />
    </Routes>
  );
}

// Separate component for the main properties list view
function PropertiesListView() {
  const { userId: adminId } = useParams();
  const navigate = useNavigate();
  const { data: properties = [], isLoading, isError } = useListingsQuery(adminId);

  // Create a function that uses the propertyStatusMap object
  const getStatusClasses = (status) => {
    return propertyStatusMap[status] || "bg-gray-100 text-gray-700";
  };

  const handlePropertyAction = (action, property) => {
    switch (action) {
      case "edit":
        navigate(`edit/${property.listingId}`);
        break;
      case "delete":
        navigate(`delete/${property.listingId}`);
        break;
      case "view":
        navigate(`view/${property.listingId}`);
        break;
      default:
        break;
    }
  };

  const handleAddProperty = () => {
    navigate("add");
  };

  return (
    <TabWrapper decorativeElements="default">
      {/* Add Property Button */}
      <div className="flex justify-start">
        <ActionButton
          onClick={handleAddProperty}
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
        loadingCount={8}
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
    </TabWrapper>
  );
}
