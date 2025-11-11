import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaIdBadge,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaImage,
} from "react-icons/fa";
import HoverActionButton from "../../common/HoverActionButton.jsx";
import { formatAmount } from "../../../utils/formatters.js";

export default function PropertyCard({ property, getStatusClasses, onAction }) {
  // Get the first image from the imagesURL array, or use a placeholder
  const displayImage = property.imagesURL && property.imagesURL.length > 0
    ? property.imagesURL[0]
    : "https://via.placeholder.com/400x250?text=No+Image";

  // Format the price using the utility function
  const formattedPrice = formatAmount(property.price || 0);

  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-md hover:shadow-xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden group cursor-pointer border"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.02,
        y: -2,
        borderColor: "rgb(209, 213, 219)",
        transition: { duration: 0.2 }
      }}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden rounded-lg mb-3 bg-gray-100">
        <img
          src={displayImage}
          alt={property.title}
          className="w-full h-40 sm:h-48 object-cover"
        />
        
        {/* Status Badge */}
        <span
          className={`${getStatusClasses(
            property.status
          )} absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-md border border-white/20`}
        >
          {property.status}
        </span>

        {/* Image count indicator */}
        {property.imagesURL && property.imagesURL.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-gray-900/75 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 shadow-lg">
            <FaImage size={10} />
            <span>{property.imagesURL.length}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="space-y-2.5">
        <div>
          <h4 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-2 mb-1 group-hover:text-gray-700 transition-colors">
            {property.title}
          </h4>
          
          <div className="flex items-center text-gray-500 text-xs gap-1.5">
            <FaIdBadge className="flex-shrink-0" size={11} />
            <span className="font-mono truncate">{property.listingId}</span>
          </div>
        </div>
        
        <div className="flex items-start text-gray-600 text-sm gap-2 min-h-[2.5rem]">
          <FaMapMarkerAlt className="text-red-500 flex-shrink-0 mt-0.5" size={13} />
          <span className="line-clamp-2 break-words leading-snug">{property.address}</span>
        </div>

        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-gray-200">
          <div className="flex items-baseline gap-2">
            <FaMoneyBillWave className="text-green-500" size={15} />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-blue-700 leading-none">
                R{formattedPrice} <span className="text-xs text-gray-500 mt-0.5">/per night</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 z-20 bg-gradient-to-br from-gray-400/10 via-gray-400/10 to-gray-400/10 backdrop-blur-md rounded-xl flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-4 pointer-events-none group-hover:pointer-events-auto"
      >
        {/* Action Buttons */}
        <HoverActionButton
          icon={<FaEdit size={17} />}
          label="Edit"
          onClick={() => onAction && onAction("edit", property)}
          className="text-blue-600 hover:bg-blue-50 hover:shadow-lg"
        />

        <HoverActionButton
          icon={<FaEye size={17} />}
          label="View"
          onClick={() => onAction && onAction("view", property)}
          className="text-yellow-600 hover:bg-yellow-50 hover:shadow-lg"
        />

        <HoverActionButton
          icon={<FaTrash size={17} />}
          label="Delete"
          onClick={() => onAction && onAction("delete", property)}
          className="text-red-600 hover:bg-red-50 hover:shadow-lg"
        />
      </motion.div>
    </motion.div>
  );
}
