import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaEnvelope,
  FaHome,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUsers,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { formatDateUS, formatAmount } from "../utils/formatters";
import { statusClasses } from "../constants/constants.js";
import HoverActionButton from "../components/ui/HoverActionButton.jsx";
import { downloadFiles } from "../utils/fileDownload.js";

export default function BookingCard({ booking, onAction }) {
  // Use the utility function to format amount
  const formattedAmount = formatAmount(booking?.price);

  return (
    <motion.div
      className="relative bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card Info */}
      <div className="space-y-2">
        <h4 className="font-bold text-blue-800 text-lg truncate">
          Tenant: {booking.tenantInfo.name}
        </h4>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaEnvelope className="text-gray-400" /> Booking ID:{" "}
          <span className="font-medium">{booking.bookingID}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaHome className="text-gray-400" /> Property:{" "}
          <span className="font-medium">{booking.listingAddress}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaCalendarAlt className="text-gray-400" /> Check-in:{" "}
          <span className="font-medium">{formatDateUS(booking.checkIn)}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaCalendarAlt className="text-gray-400" /> Check-out:{" "}
          <span className="font-medium">{formatDateUS(booking.checkOut)}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaUsers className="text-gray-400" /> Guests:{" "}
          <span className="font-medium">
            {booking.guests} • {booking.nights} night
            {booking.nights !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center text-blue-700 text-md font-bold gap-2 mt-1">
          <FaMoneyBillWave className="text-green-500" /> R{formattedAmount}
        </div>
        {booking.specialRequests && (
          <p className="text-gray-500 text-sm italic mt-1">
            Notes: {booking.specialRequests}
          </p>
        )}
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            statusClasses[booking.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      {/* Hover Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-20 bg-black/25 rounded-2xl flex items-center justify-center gap-4 pointer-events-none group-hover:pointer-events-auto"
      >
        {/* Common Buttons */}
        <HoverActionButton
          icon={<FaEdit size={18} />}
          label="Edit"
          onClick={() => onAction("Edit", booking)}
          className="text-blue-600 hover:bg-blue-50"
        />

        <HoverActionButton
          icon={<FaTrash size={18} />}
          label="Delete"
          onClick={() => onAction("Delete", booking)}
          className="text-red-600 hover:bg-red-50"
        />

        <HoverActionButton
          icon={<FaEye size={18} />}
          label="View"
          onClick={() => onAction("View", booking)}
          className="text-yellow-600 hover:bg-yellow-50"
        />

        {/* Status-specific Buttons */}
        {booking.status === "pending" && (
          <>
            <HoverActionButton
              icon={<FaCheck size={18} />}
              label="Confirm"
              onClick={() => onAction("Confirm", booking)}
              className="text-green-600 hover:bg-green-50"
            />
            <HoverActionButton
              icon={<FaTimes size={18} />}
              label="Cancel"
              onClick={() => onAction("Cancel", booking)}
              className="text-red-600 hover:bg-red-50"
            />
          </>
        )}
      </motion.div>

      {/* Bottom Right Corner Button */}
      {booking.supportDocuments && booking.supportDocuments.length > 0 && (
        <motion.button
          className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full shadow-lg transition-colors duration-200 z-30 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => downloadFiles(booking.supportDocuments)}
        >
          <FaEye size={12} />
          <span className="text-xs font-medium">Download Attached Docs</span>
        </motion.button>
      )}
    </motion.div>
  );
}
