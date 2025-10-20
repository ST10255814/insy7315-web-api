import { motion } from "framer-motion";

export default function PropertyCard({ property, getStatusClasses }) {
  // Get the first image from the imagesURL array, or use a placeholder
  const displayImage = property.imagesURL && property.imagesURL.length > 0 
    ? property.imagesURL[0] 
    : "https://via.placeholder.com/400x250?text=No+Image";

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer w-full max-w-sm"
      whileHover={{
        scale: 1.03,
        y: -3,
        boxShadow: "0 15px 25px rgba(0,0,0,0.1)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="relative overflow-hidden">
        <img
          src={displayImage}
          alt={property.title}
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

      <div className="p-4 text-center">
        <p className="font-bold text-gray-800 text-base truncate">
          {property.title}
        </p>
        <p className="text-gray-600 text-sm truncate">{property.listingId}</p>
        <p className="text-gray-500 text-sm truncate">{property.address}</p>
        <p className="text-blue-700 font-semibold mt-2 text-sm">
          R{property.price?.toLocaleString() || '0'}
        </p>
      </div>
    </motion.div>
  );
}
