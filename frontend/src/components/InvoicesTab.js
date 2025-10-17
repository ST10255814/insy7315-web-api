import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";
import Toast from "../lib/toast.js";
import InvoiceCard from "../pages/InvoiceCard.js";
import AddInvoiceModal from "../models/AddInvoiceModel.js";

export default function InvoicesTab() {
  // Mock data - replace with query later
  const [invoices, setInvoices] = useState([
    {
      invoiceNumber: "INV-001",
      tenant: "John Smith",
      property: "Unit 4A",
      amount: 22500,
      due: "2025-02-28",
      status: "Paid",
      notes: "Paid via EFT",
    },
    {
      invoiceNumber: "INV-002",
      tenant: "Mike Davis",
      property: "Unit 12B",
      amount: 33800,
      due: "2025-02-28",
      status: "Unpaid",
      notes: "Reminder sent",
    },
    {
      invoiceNumber: "INV-003",
      tenant: "Mike Davis",
      property: "Unit 12B",
      amount: 33800,
      due: "2025-02-28",
      status: "Pending",
      notes: "Reminder sent",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleInvoiceAction = (action, invoice) => {
    switch (action) {
      case "Edit":
        Toast.info(`Editing ${invoice.invoiceNumber}`);
        break;
      case "Delete":
        if (window.confirm(`Delete ${invoice.invoiceNumber}?`)) {
          setInvoices((prev) =>
            prev.filter((i) => i.invoiceNumber !== invoice.invoiceNumber)
          );
        }
        break;
      case "View":
        Toast.info(`Viewing details for ${invoice.invoiceNumber}`);
        break;
      default:
        break;
    }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto space-y-6 p-2 sm:p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Add Invoice Button */}
      <motion.button
        onClick={() => setShowAddModal(true)}
        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg font-semibold text-md hover:from-blue-600 hover:to-blue-700 transition-all"
      >
        <FaPlusCircle /> Add Invoice
      </motion.button>

      {/* Invoice Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {invoices.map((invoice) => (
            <InvoiceCard
              key={invoice.invoiceNumber}
              invoice={invoice}
              onAction={handleInvoiceAction}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add Invoice Modal */}
      <AddInvoiceModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        // onSubmit={handleAddInvoiceSubmit} -> to add later
      />
    </motion.div>
  );
}
