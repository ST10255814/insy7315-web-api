import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaEnvelope,
  FaHome,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

const statusClasses = {
  Paid: "bg-green-200 text-green-800",
  Unpaid: "bg-red-200 text-red-800",
  Pending: "bg-amber-200 text-amber-800",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function InvoiceCard({ invoice, onAction }) {
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
          {invoice.lease.tenant}
        </h4>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaEnvelope className="text-gray-400" /> Invoice #:{" "}
          <span className="font-medium">{invoice.invoiceId}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaHome className="text-gray-400" /> Property:{" "}
          <span className="font-medium">{invoice.lease.propertyAddress}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm gap-2">
          <FaCalendarAlt className="text-gray-400" /> Due:{" "}
          <span className="font-medium">{formatDate(invoice.date)}</span>
        </div>
        <div className="flex items-center text-blue-700 text-md font-bold gap-2 mt-1">
          <FaMoneyBillWave className="text-green-500" /> R
          {invoice.amount.toLocaleString()}
        </div>
        {invoice.notes && (
          <p className="text-gray-500 text-sm italic mt-1">{invoice.description}</p>
        )}
        <span
          className={`inline-block font-semibold px-3 py-1 rounded-full text-xs mt-2 ${
            statusClasses[invoice.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {invoice.status}
        </span>
      </div>

      {/* Hover Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-20 bg-black/25 rounded-2xl flex items-center justify-center gap-4 pointer-events-none group-hover:pointer-events-auto"
      >
        {["Edit", "Delete", "View"].map((action) => (
          <motion.button
            key={action}
            onClick={() => onAction(action, invoice)}
            whileHover={{ scale: 1.2 }}
            className={`bg-white p-3 rounded-full shadow ${
              action === "Edit"
                ? "text-blue-600 hover:bg-blue-50"
                : action === "Delete"
                ? "text-red-600 hover:bg-red-50"
                : "text-yellow-600 hover:bg-yellow-50"
            }`}
          >
            {action === "Edit" ? <FaEdit /> : action === "Delete" ? <FaTrash /> : <FaEye />}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
