import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";
import Toast from "../lib/toast.js";
import InvoiceCard from "../pages/InvoiceCard.jsx";
import AddInvoiceModal from "../models/AddInvoiceModel.jsx";
import {
  useInvoicesQuery,
  useCreateInvoiceMutation,
} from "../utils/queries.js";
import LoadingSkeleton from "../pages/LoadingSkeleton.jsx";
import { useParams } from "react-router-dom";

export default function InvoicesTab() {
  const { userId: adminId } = useParams();
  // React Query to get invoices
  const { data, isLoading, isError } = useInvoicesQuery(adminId);
  // Normalize the data shape so `invoices` is always an array
  const invoices = Array.isArray(data) ? data : data?.invoices ?? [];

  const createInvoiceMutation = useCreateInvoiceMutation();

  const [showAddModal, setShowAddModal] = useState(false);

  const handleInvoiceAction = (action, invoice) => {
    switch (action) {
      case "Edit":
        //TODO: Implement edit functionality
        Toast.info(`Editing ${invoice.invoiceId}`);
        break;
      case "Delete":
        //TODO: Implement delete functionality
        Toast.warning(`Deleting ${invoice.invoiceId}`);
        break;
      case "View":
        //TODO: Implement view functionality
        Toast.info(`Viewing details for ${invoice.invoiceId}`);
        break;
      default:
        break;
    }
  };

  const handleAddInvoiceSubmit = (invoiceData) => {
    console.log("Adding Invoice:", invoiceData);
    createInvoiceMutation.mutate(invoiceData, {
      onSuccess: () => {
        setShowAddModal(false);
      },
    });
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
        whileHover={{
          scale: 1.07,
          boxShadow: "0 8px 25px rgba(59,130,246,0.45)",
        }}
        whileTap={{ scale: 0.96 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 18,
          mass: 0.8,
        }}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 
             bg-gradient-to-r from-blue-500 to-blue-600 
             text-white px-6 py-3 rounded-2xl shadow-md 
             font-semibold text-md 
             hover:from-blue-600 hover:to-blue-700 
             transition-all duration-300 ease-out
             focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        <FaPlusCircle className="text-lg" />
        Add Invoice
      </motion.button>

      {/* Lease Cards / Loading / Error */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-red-600 font-semibold text-center mt-10">
          Failed to load invoices. Please try again.
        </div>
      )}

      {!isLoading && !isError && invoices.length === 0 && (
        <div className="text-gray-500 text-center mt-10 font-medium">
          No invoices found. Add a new invoice to get started.
        </div>
      )}

      {!isLoading && !isError&& invoices.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {invoices.map((invoice) => (
              <InvoiceCard
                key={invoice.invoiceId}
                invoice={invoice}
                onAction={handleInvoiceAction}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Invoice Modal */}
      <AddInvoiceModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddInvoiceSubmit}
        isPending={createInvoiceMutation.isPending}
      />
    </motion.div>
  );
}
