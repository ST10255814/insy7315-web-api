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
import { statusClasses, statusActions } from "../constants/status";
import HoverActionButton from "../components/ui/HoverActionButton.jsx";

export default function LeaseCard({ lease, onAction }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between overflow-hidden cursor-pointer group">
      {/* Card Content */}
      <div className="space-y-2">
        <h4 className="font-bold text-blue-800 text-lg truncate">Tenant: {" "}{lease.tenant.firstName} {" "}{lease.tenant.surname}</h4>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaIdBadge className="text-gray-400" />
          Lease ID: <span className="font-medium">{lease.leaseId}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaIdBadge className="text-gray-400" />
          Booking ID: <span className="font-medium">{lease.bookingDetails.bookingId}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaHome className="text-gray-400" />
          Property: <span className="font-medium">{lease.listing.address}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaCalendarAlt className="text-gray-400" />
          Duration:{" "}
          <span className="font-medium">
            {formatDate(lease.bookingDetails.startDate)} – {formatDate(lease.bookingDetails.endDate)}
          </span>
        </div>
        <div className="flex items-center text-blue-700 text-md font-bold gap-2 mt-1">
          <FaMoneyBillWave className="text-green-500" />
          R{formatAmount(lease.bookingDetails.rentAmount)}
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
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-20 bg-black/25 rounded-2xl flex items-center justify-center gap-4 pointer-events-none group-hover:pointer-events-auto"
      >
        {/* Common Buttons (each uses `peer` so label appears only when that button is hovered) */}
        <HoverActionButton
          icon={<FaEdit size={18} />}
          label="Edit"
          onClick={() => onAction("Edit", lease)}
          className="text-blue-600 hover:bg-blue-50"
        />

        <HoverActionButton
          icon={<FaTrash size={18} />}
          label="Delete"
          onClick={() => onAction("Delete", lease)}
          className="text-red-600 hover:bg-red-50"
        />

        {/* Status-specific Buttons with hover labels */}
        {statusActions[lease.status]?.map((btn, idx) => (
          <HoverActionButton
            key={idx}
            icon={btn.icon}
            label={btn.label}
            onClick={() => onAction(btn.action, lease)}
            className={`${btn.color} ${btn.hover}`}
          />
        ))}
      </motion.div>
    </div>
  );
}