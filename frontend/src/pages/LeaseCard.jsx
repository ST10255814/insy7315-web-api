import { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaHome,
  FaCalendarAlt,
  FaIdBadge,
  FaMoneyBillWave,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { formatDate, formatAmount } from "../utils/formatters";
import { statusClasses, statusActions } from "../constants/constants.js";
import HoverActionButton from "../components/ui/HoverActionButton.jsx";

export default function LeaseCard({ lease, onAction }) {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleActionClick = (action, lease) => {
    setShowOverlay(false);
    if (onAction) onAction(action, lease);
  };

  return (
    <motion.div 
      className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl p-6 flex flex-col justify-between overflow-hidden cursor-pointer group border border-white/20"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
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
      {/* Card Content */}
      <div className="space-y-2">
        <h4 className="font-bold text-blue-800 text-lg truncate">
          Tenant: {lease.tenant.firstName} {lease.tenant.surname}
        </h4>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaIdBadge className="text-gray-400" />
          Lease ID: <span className="font-medium">{lease.leaseId}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaIdBadge className="text-gray-400" />
          Booking ID:{" "}
          <span className="font-medium">{lease.bookingDetails.bookingId}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaHome className="text-gray-400" />
          Property: <span className="font-medium">{lease.listing.address}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaCalendarAlt className="text-gray-400" />
          Duration:{" "}
          <span className="font-medium">
            {formatDate(lease.bookingDetails.startDate)} –{" "}
            {formatDate(lease.bookingDetails.endDate)}
          </span>
        </div>
        <div className="flex items-center text-blue-700 text-md font-bold gap-2 mt-1">
          <FaMoneyBillWave className="text-green-500" />R
          {formatAmount(lease.bookingDetails.rentAmount)}
        </div>
        <span
          className={`inline-block font-semibold px-3 py-1 rounded-full text-xs mt-2 ${
            statusClasses[lease.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {lease.status}
        </span>
      </div>

      {/* Hover Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showOverlay ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-20 bg-black/25 rounded-2xl flex items-center justify-center gap-4 pointer-events-none"
        style={{ pointerEvents: showOverlay ? 'auto' : 'none' }}
      >
        {/* Common Buttons (each uses `peer` so label appears only when that button is hovered) */}
        <HoverActionButton
          icon={<FaEdit size={18} />}
          label="Edit"
          onClick={() => handleActionClick("Edit", lease)}
          className="text-blue-600 hover:bg-blue-50"
        />

        <HoverActionButton
          icon={<FaTrash size={18} />}
          label="Delete"
          onClick={() => handleActionClick("Delete", lease)}
          className="text-red-600 hover:bg-red-50"
        />

        {/* Status-specific Buttons with hover labels */}
        {statusActions[lease.status]?.map((btn, idx) => (
          <HoverActionButton
            key={idx}
            icon={btn.icon}
            label={btn.label}
            onClick={() => handleActionClick(btn.action, lease)}
            className={`${btn.color} ${btn.hover}`}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
