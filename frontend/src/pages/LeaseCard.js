import {
  FaEdit,
  FaTrash,
  FaPlay,
  FaTimes,
  FaHome,
  FaCalendarAlt,
  FaIdBadge,
  FaMoneyBillWave,
} from "react-icons/fa";
import { motion } from "framer-motion";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const statusClasses = {
  Active: "bg-green-100 text-green-700",
  "Expiring Soon": "bg-amber-200 text-amber-800",
  Expired: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-800",
};

const statusActions = {
  Active: [
    { label: "Cancel", icon: <FaTimes />, color: "text-red-600", hover: "hover:bg-red-50", action: "Cancel" },
  ],
  "Expiring Soon": [
    { label: "Renew", icon: <FaPlay />, color: "text-yellow-600", hover: "hover:bg-yellow-50", action: "Renew" },
  ],
  Expired: [
    { label: "Activate", icon: <FaPlay />, color: "text-green-600", hover: "hover:bg-green-50", action: "Activate" },
  ],
};

export default function LeaseCard({ lease, onAction }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between overflow-hidden cursor-pointer group">
      {/* Card Content */}
      <div className="space-y-2">
        <h4 className="font-bold text-blue-800 text-lg truncate">{lease.tenant.fullname}</h4>
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
          R{lease.bookingDetails.rentAmount.toLocaleString()}
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
        {/* Common Buttons */}
        <motion.button
          onClick={() => onAction("Edit", lease)}
          whileHover={{ scale: 1.2 }}
          className="bg-white p-3 rounded-full text-blue-600 shadow hover:bg-blue-50"
        >
          <FaEdit size={18} />
        </motion.button>
        <motion.button
          onClick={() => onAction("Delete", lease)}
          whileHover={{ scale: 1.2 }}
          className="bg-white p-3 rounded-full text-red-600 shadow hover:bg-red-50"
        >
          <FaTrash size={18} />
        </motion.button>

        {/* Status-specific Buttons */}
        {statusActions[lease.status]?.map((btn, idx) => (
          <motion.button
            key={idx}
            onClick={() => onAction(btn.action, lease)}
            whileHover={{ scale: 1.2 }}
            className={`bg-white p-3 rounded-full shadow ${btn.color} ${btn.hover}`}
          >
            {btn.icon}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}