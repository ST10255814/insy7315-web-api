import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaHome,
} from "react-icons/fa";
import { TabWrapper, StateHandler, ActionButton } from "../../common/index.js";
import { propertyStatusMap } from "../../../constants/status.js";
import Toast from "../../../lib/toast.js";
import { formatAmount } from "../../../utils/formatters.js";

export default function ViewProperty() {
  const { userId: adminId, propertyId } = useParams();
  const navigate = useNavigate();

  // Mock data for UI display
  const property = {
    listingId: propertyId,
    title: "Modern Downtown Apartment",
    address: "123 Main Street, City Center, NY 10001",
    description:
      "Beautiful modern apartment in the heart of downtown. Features include hardwood floors, stainless steel appliances, and stunning city views. Perfect for professionals or small families.",
    price: "2500",
    status: "Available",
    amenities: ["WiFi", "Parking", "Gym", "Pool", "Laundry", "Pet Friendly"],
    imageURL: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ],
  };
  const isLoading = false;
  const isError = false;

  const getStatusClasses = (status) => {
    return propertyStatusMap[status] || "bg-gray-100 text-gray-700";
  };

  const handleEdit = () => {
    Toast.info("Edit functionality will be implemented soon");
    navigate(`/dashboard/${adminId}/properties/edit/${propertyId}`);
  };

  const handleDelete = () => {
    Toast.warning("Delete functionality will be implemented soon");
    navigate(`/dashboard/${adminId}/properties/delete/${propertyId}`);
  };

  const handleBack = () => {
    navigate(`/dashboard/${adminId}/properties`);
  };

  return (
    <TabWrapper decorativeElements="default">
      <div className="flex items-center gap-4 mb-6">
        <ActionButton
          onClick={handleBack}
          icon={FaArrowLeft}
          variant="secondary"
          size="small"
        >
          Back to Properties
        </ActionButton>
      </div>

      <StateHandler
        isLoading={isLoading}
        isError={isError}
        data={property}
        errorMessage="Failed to load property details. Please try again."
        emptyMessage="Property not found."
      >
        {property && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-white/20 overflow-hidden"
          >
            {/* Property Images */}
            {property.imageURL && property.imageURL.length > 0 && (
              <div className="relative h-64 md:h-80 lg:h-96">
                <img
                  src={property.imageURL[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(
                      property.status
                    )}`}
                  >
                    {property.status}
                  </span>
                </div>
              </div>
            )}

            {/* Property Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{property.address}</span>
                  </div>
                  <div className="flex items-center text-green-600 font-semibold text-xl">
                    <span>R {formatAmount(property.price)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <ActionButton
                    onClick={handleEdit}
                    icon={FaEdit}
                    variant="primary"
                    size="small"
                  >
                    Edit
                  </ActionButton>
                  <ActionButton
                    onClick={handleDelete}
                    icon={FaTrash}
                    variant="danger"
                    size="small"
                  >
                    Delete
                  </ActionButton>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Amenities
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {property.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 bg-blue-50 rounded-lg"
                      >
                        <FaHome className="text-blue-600 mr-2" />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Images */}
              {property.imageURL && property.imageURL.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Additional Images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {property.imageURL.slice(1).map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`${property.title} - View ${index + 2}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </StateHandler>
    </TabWrapper>
  );
}
