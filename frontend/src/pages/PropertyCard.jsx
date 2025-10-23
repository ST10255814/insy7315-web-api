import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaIdBadge,
  FaMoneyBillWave,
  FaMapMarkerAlt,
} from "react-icons/fa";
import HoverActionButton from "../components/ui/HoverActionButton.jsx";
import { formatAmount } from "../utils/formatters";

export default function PropertyCard({ property, getStatusClasses, onAction }) {
  // Get the first image from the imagesURL array, or use a placeholder
  const displayImage = property.imagesURL && property.imagesURL.length > 0
    ? property.imagesURL[0]
    : "https://via.placeholder.com/400x250?text=No+Image";

  // Format the price using the utility function
  const formattedPrice = formatAmount(property.price || 0);

  return (
    <motion.div
      className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl p-4 flex flex-col justify-between overflow-hidden group cursor-pointer border border-white/20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        backgroundColor: "rgba(255,255,255,0.95)"
      }}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden rounded-xl mb-3">
        <img
          src={displayImage}
          alt={property.title}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`${getStatusClasses(
            property.status
          )} absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold shadow-md`}
        >
          {property.status}
        </span>
      </div>

      {/* Content Section */}
      <div className="space-y-1.5">
        <h4 className="font-bold text-blue-800 text-base truncate">
          {property.title}
        </h4>
        
        <div className="flex items-center text-gray-600 text-sm gap-1.5">
          <FaIdBadge className="text-gray-400 text-xs" />
          <span className="font-medium truncate">{property.listingId}</span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm gap-1.5">
          <FaMapMarkerAlt className="text-gray-400 text-xs" />
          <span className="truncate">{property.address}</span>
        </div>

        <div className="flex items-baseline text-blue-700 font-bold gap-1.5 pt-1">
          <FaMoneyBillWave className="text-green-500 text-sm" />
          <span className="text-lg">R{formattedPrice}</span>
          <span className="text-xs text-gray-500 font-normal">/ per night</span>
        </div>
      </div>

      {/* Hover Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-20 bg-black/25 rounded-2xl flex items-center justify-center gap-4 pointer-events-none group-hover:pointer-events-auto"
      >
        {/* Action Buttons */}
        <HoverActionButton
          icon={<FaEdit size={18} />}
          label="Edit"
          onClick={() => onAction && onAction("edit", property)}
          className="text-blue-600 hover:bg-blue-50"
        />

        <HoverActionButton
          icon={<FaEye size={18} />}
          label="View"
          onClick={() => onAction && onAction("view", property)}
          className="text-yellow-600 hover:bg-yellow-50"
        />

        <HoverActionButton
          icon={<FaTrash size={18} />}
          label="Delete"
          onClick={() => onAction && onAction("delete", property)}
          className="text-red-600 hover:bg-red-50"
        />
      </motion.div>
    </motion.div>
  );
}
