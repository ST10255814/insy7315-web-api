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
  Overdue: "bg-red-200 text-red-800",
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
  // Normalize amount to a number and format with thousands separators
  const rawAmount = invoice?.amount ?? 0;
  const numberAmount =
    typeof rawAmount === "number"
      ? rawAmount
      : Number(String(rawAmount).replace(/[^0-9.-]+/g, ""));
  const formattedAmount = Number.isFinite(numberAmount)
    ? numberAmount.toLocaleString("en-US")
    : String(rawAmount);

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
        <h4 className="font-bold text-blue-800 text-lg truncate">Tenant:{" "}
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
        <div className="relative">
          <motion.button
            onClick={(e) => { e.currentTarget.blur(); onAction("Edit", invoice); }}
            whileHover={{ scale: 1.2 }}
            className="peer bg-white p-3 rounded-full shadow text-blue-600 hover:bg-blue-50"
          >
            <FaEdit />
          </motion.button>
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 peer-hover:opacity-100 transition-opacity text-xs bg-white text-gray-800 px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap">
            Edit
          </div>
        </div>

        <div className="relative">
          <motion.button
            onClick={(e) => { e.currentTarget.blur(); onAction("Delete", invoice); }}
            whileHover={{ scale: 1.2 }}
            className="peer bg-white p-3 rounded-full shadow text-red-600 hover:bg-red-50"
          >
            <FaTrash />
          </motion.button>
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 peer-hover:opacity-100 transition-opacity text-xs bg-white text-gray-800 px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap">
            Delete
          </div>
        </div>

        <div className="relative">
          <motion.button
            onClick={(e) => { e.currentTarget.blur(); onAction("View", invoice); }}
            whileHover={{ scale: 1.2 }}
            className="peer bg-white p-3 rounded-full shadow text-yellow-600 hover:bg-yellow-50"
          >
            <FaEye />
          </motion.button>
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 peer-hover:opacity-100 transition-opacity text-xs bg-white text-gray-800 px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap">
            View
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
