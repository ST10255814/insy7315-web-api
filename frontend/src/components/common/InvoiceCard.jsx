import { motion } from "framer-motion";
import {
  FaTrash,
  FaEye,
  FaEnvelope,
  FaHome,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import { formatDateUS, formatAmount } from "../../utils/formatters";
import { statusClasses } from "../../constants/constants.js";
import HoverActionButton from "./HoverActionButton.jsx";

export default function InvoiceCard({ invoice, onAction }) {
  // Use the utility function to format amount
  const formattedAmount = formatAmount(invoice?.amount);

  return (
    <motion.div
      className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl p-5 flex flex-col justify-between overflow-hidden group cursor-pointer border border-white/20"
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
      {/* Card Info */}
      <div className="space-y-2">
        <h4 className="font-bold text-blue-800 text-lg truncate">Tenant:{" "}
          {invoice.lease.tenant}
        </h4>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaEnvelope className="text-gray-400" /> Invoice ID:{" "}
          <span className="font-medium">{invoice.invoiceId}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaHome className="text-gray-400" /> Property:{" "}
          <span className="font-medium">{invoice.lease.propertyAddress}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaCalendarAlt className="text-gray-400" /> Due:{" "}
          <span className="font-medium">{formatDateUS(invoice.date)}</span>
        </div>
        <div className="flex items-center text-blue-700 text-md font-bold gap-2 mt-1">
          <FaMoneyBillWave className="text-green-500" /> R{formattedAmount}
        </div>
        {invoice.description && (
          <p className="text-gray-500 text-sm italic mt-1">Notes: {invoice.description}</p>
        )}
        <span
          className={`inline-block font-semibold px-3 py-1 rounded-full text-xs mt-2 ${
            statusClasses[invoice.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {invoice.status}
        </span>
      </div>

      {/* Hover Overlay with labels under each action button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-20 bg-black/25 rounded-2xl flex items-center justify-center gap-4 pointer-events-none group-hover:pointer-events-auto"
      >
        <HoverActionButton
          icon={<FaEye />}
          label="View"
          onClick={() => onAction("View", invoice)}
          className="text-yellow-600 hover:bg-yellow-50"
        />

        <HoverActionButton
          icon={<FaTrash />}
          label="Delete"
          onClick={() => onAction("Delete", invoice)}
          className="text-red-600 hover:bg-red-50"
        />
      </motion.div>
    </motion.div>
  );
}
