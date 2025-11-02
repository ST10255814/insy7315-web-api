import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { TabWrapper, DataStateHandler, DataLoading } from "../../common/index.js";
import { propertyStatusMap } from "../../../constants/status.js";
import Toast from "../../../lib/toast.js";
import { formatAmount } from "../../../utils/formatters.js";
import { useListingByIdQuery } from "../../../utils/queries.js";
import { amenitiesWithIcons } from "../../../constants/amenities.js";

export default function ViewProperty() {
  const { userId: adminId, propertyId } = useParams();
  const navigate = useNavigate();
  const { data: property, isLoading, isError } = useListingByIdQuery(adminId, propertyId);

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
    navigate(-1);
  };

  return (
    <TabWrapper decorativeElements="default">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
        >
          <FaArrowLeft className="w-5 h-5" />
          Back to Properties
        </button>
      </div>

      <DataStateHandler
        isLoading={isLoading}
        isError={isError}
        data={property}
        errorMessage="Failed to load property details. Please try again."
        emptyMessage="Property not found."
        loadingComponent={DataLoading}
      >
        {property && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden"
          >
            {/* Property Images */}
            {property.imagesURL && property.imagesURL.length > 0 && (
              <div className="relative h-72 md:h-96 lg:h-[28rem] group">
                <img
                  src={property.imagesURL[0]}
                  alt={property.title}
                  className="w-full h-full object-cover rounded-t-3xl"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-4 py-2 rounded-full text-base font-semibold shadow-lg ${getStatusClasses(
                      property.status
                    )}`}
                  >
                    {property.status}
                  </span>
                </div>
              </div>
            )}

            {/* Property Details */}
            <div className="p-10 bg-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-800 mb-3 tracking-tight hover:text-blue-600 transition-colors duration-200 cursor-pointer drop-shadow-lg">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-500 mb-3">
                    <FaMapMarkerAlt className="mr-2 text-blue-700" />
                    <span className="hover:text-blue-700 transition-colors duration-200 font-medium text-lg drop-shadow">
                      {property.address}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700 font-extrabold text-3xl">
                    <span className="hover:text-blue-700 transition-colors duration-200 bg-gray-100 px-4 py-2 rounded-xl shadow">
                      R {formatAmount(property.price)}{" "}
                      <span className="text-base font-medium text-gray-500">
                        /per night
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="transition-all duration-500 ease-in-out bg-blue-600 text-white border border-blue-700 hover:bg-blue-500 hover:text-white hover:scale-110 hover:shadow-xl focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold"
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="transition-all duration-500 ease-in-out bg-white border border-red-200 text-red-700 hover:bg-red-600 hover:text-white hover:scale-110 hover:shadow-xl focus:ring-2 focus:ring-red-400 focus:ring-offset-2 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-700 mb-2 drop-shadow">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed hover:text-blue-700 transition-colors duration-200 text-lg italic">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-700 mb-4 drop-shadow">
                    Amenities
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {property.amenities.map((amenity, index) => {
                      const amenityData = amenitiesWithIcons.find((a) => a.name === amenity);
                      return (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-full shadow hover:bg-blue-100 hover:text-blue-700 border border-gray-200 transition-all duration-300 cursor-pointer drop-shadow"
                        >
                          {amenityData?.icon && <amenityData.icon className="mr-2 text-blue-700" />}
                          {amenity}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Additional Images */}
              {property.imagesURL && property.imagesURL.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-4 drop-shadow">
                    Additional Images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {property.imagesURL.slice(1).map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-blue-100 hover:scale-103 transition-transform duration-300 cursor-pointer bg-white"
                      >
                        <img
                          src={image}
                          alt={`${property.title} - View ${index + 2}`}
                          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-110 hover:brightness-95 rounded-2xl"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </DataStateHandler>
    </TabWrapper>
  );
}
