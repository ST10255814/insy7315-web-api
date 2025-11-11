import { useState } from "react";
import {
  FaEye,
  FaTrash,
  FaHome,
  FaCalendarAlt,
  FaIdBadge,
  FaMoneyBillWave,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { formatDate, formatAmount } from "../../../utils/formatters.js";
import { statusClasses } from "../../../constants/constants.js";
import HoverActionButton from "../../common/HoverActionButton.jsx";

export default function LeaseCard({ lease, onAction }) {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleActionClick = (action, lease) => {
    setShowOverlay(false);
    if (onAction) onAction(action, lease);
  };

  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-md hover:shadow-lg p-4 sm:p-5 flex flex-col justify-between overflow-hidden cursor-pointer group border border-gray-200"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.02,
        y: -2,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
      }}
    >
      {/* Card Content */}
      <div className="space-y-3">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-3 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-blue-700 text-base sm:text-lg break-words line-clamp-2 mb-1">
              {lease.tenant.firstName} {lease.tenant.surname}
            </h4>
            <div className="flex items-center text-gray-500 text-xs gap-1.5">
              <FaIdBadge className="flex-shrink-0" size={11} />
              <span className="font-mono truncate">
                {lease.leaseId}
              </span>
            </div>
          </div>
          
          {/* Status Badge */}
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              statusClasses[lease.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {lease.status}
          </span>
        </div>

        {/* Booking ID */}
        <div className="flex items-start gap-2">
          <FaIdBadge className="text-gray-400 flex-shrink-0 mt-0.5" size={14} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Booking ID</p>
            <p className="font-medium text-gray-800 text-sm break-words">
              {lease.bookingDetails.bookingId}
            </p>
          </div>
        </div>

        {/* Property Info */}
        <div className="flex items-start gap-2">
          <FaHome className="text-gray-400 flex-shrink-0 mt-0.5" size={14} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Property</p>
            <p className="font-medium text-gray-800 text-sm break-words">
              {lease.listing.address}
            </p>
          </div>
        </div>

        {/* Lease Duration */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
          <FaCalendarAlt className="text-gray-400 flex-shrink-0" size={12} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Duration</p>
            <p className="font-medium text-gray-800 text-xs sm:text-sm">
              {formatDate(lease.bookingDetails.startDate)} – {formatDate(lease.bookingDetails.endDate)}
            </p>
          </div>
        </div>

        {/* Rent Amount */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-600">
            <FaMoneyBillWave className="text-green-500" size={14} />
            <span className="text-sm">Rent Amount</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-blue-700">
            R{formatAmount(lease.bookingDetails.rentAmount)}
          </span>
        </div>
      </div>

      {/* Hover Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showOverlay ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-20 bg-gray-400/10 backdrop-blur-sm rounded-xl flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-4 pointer-events-none"
        style={{ pointerEvents: showOverlay ? 'auto' : 'none' }}
      >
        {/* Common Buttons */}
        <HoverActionButton
          icon={<FaEye size={17} />}
          label="View"
          onClick={() => handleActionClick("View", lease)}
          className="text-yellow-600 hover:bg-yellow-50"
        />

        <HoverActionButton
          icon={<FaTrash size={17} />}
          label="Delete"
          onClick={() => handleActionClick("Delete", lease)}
          className="text-red-600 hover:bg-red-50"
        />
      </motion.div>
    </motion.div>
  );
}
