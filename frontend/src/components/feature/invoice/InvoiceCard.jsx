import { motion } from "framer-motion";
import {
  FaTrash,
  FaEye,
  FaEnvelope,
  FaHome,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaHandHoldingUsd,
} from "react-icons/fa";
import { formatDateUS, formatAmount } from "../../../utils/formatters.js";
import { statusClasses } from "../../../constants/constants.js";
import HoverActionButton from "../../common/HoverActionButton.jsx";

export default function InvoiceCard({ invoice, onAction }) {
  // Use the utility function to format amount
  const formattedAmount = formatAmount(invoice?.amount);

  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-md hover:shadow-lg p-4 sm:p-5 flex flex-col justify-between overflow-hidden group cursor-pointer border border-gray-200"
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
      {/* Card Info */}
      <div className="space-y-3">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-3 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-blue-700 text-base sm:text-lg break-words line-clamp-2 mb-1">
              {invoice.lease.tenant}
            </h4>
            <div className="flex items-center text-gray-500 text-xs gap-1.5">
              <FaEnvelope className="flex-shrink-0" size={11} />
              <span className="font-mono truncate">
                {invoice.invoiceId}
              </span>
            </div>
          </div>
          
          {/* Status Badge */}
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              statusClasses[invoice.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {invoice.status}
          </span>
        </div>

        {/* Property Info */}
        <div className="flex items-start gap-2">
          <FaHome className="text-gray-400 flex-shrink-0 mt-0.5" size={14} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Property</p>
            <p className="font-medium text-gray-800 text-sm break-words">
              {invoice.lease.propertyAddress}
            </p>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
          <FaCalendarAlt className="text-gray-400 flex-shrink-0" size={12} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Due Date</p>
            <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">
              {formatDateUS(invoice.date)}
            </p>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-600">
            <FaMoneyBillWave className="text-green-500" size={14} />
            <span className="text-sm">Amount</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-blue-700">
            R{formattedAmount}
          </span>
        </div>

        {/* Description */}
        {invoice.description && (
          <div className="bg-gray-200 rounded-lg p-2.5">
            <p className="text-xs text-blue-700 font-medium mb-1">Notes</p>
            <p className="text-gray-700 text-xs leading-relaxed line-clamp-2">
              {invoice.description}
            </p>
          </div>
        )}
      </div>

      {/* Hover Overlay with Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-20 bg-gray-400/10 backdrop-blur-sm rounded-xl flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-4 pointer-events-none group-hover:pointer-events-auto"
      >
        <HoverActionButton
          icon={<FaEye size={17} />}
          label="View"
          onClick={() => onAction("View", invoice)}
          className="text-yellow-600 hover:bg-yellow-50"
        />

        <HoverActionButton
          icon={<FaTrash size={17} />}
          label="Delete"
          onClick={() => onAction("Delete", invoice)}
          className="text-red-600 hover:bg-red-50"
        />

        <HoverActionButton
          icon={<FaHandHoldingUsd size={17} />}
          label="Mark as Paid"
          onClick={() => onAction("Paid", invoice)}
          className="text-green-600 hover:bg-green-50"
        />
      </motion.div>
    </motion.div>
  );
}
