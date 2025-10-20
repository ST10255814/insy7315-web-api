import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPlusCircle } from "react-icons/fa";
import Toast from "../lib/toast";

// Initial form state - defined outside component to avoid re-creation
const INITIAL_FORM_STATE = {
  amount: "",
  date: "",
  leaseId: "",
};

export default function AddInvoiceModal({ show, onClose, onSubmit, isPending }) {
  const buttonHoverTransition = { type: "spring", stiffness: 300, damping: 20 };

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  // Reset form function - memoized to prevent unnecessary re-renders
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
  }, []);

  // Reset form when modal is closed
  useEffect(() => {
    if (!show) {
      resetForm();
    }
  }, [show, resetForm]);

  // Handle close action
  const handleClose = () => {
    onClose();
  };
  // Reset form when submission completes
  const [wasPending, setWasPending] = useState(false);
  useEffect(() => {
    if (wasPending && !isPending) {
      // Submission finished, reset form
      resetForm();
    }
    setWasPending(isPending);
  }, [isPending, wasPending, resetForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.amount || formData.amount <= 0) newErrors.amount = "Amount is required and must be greater than 0";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.leaseId) newErrors.leaseId = "Lease ID is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Toast.error("Please fix the errors before submitting!");
      return;
    }

    // Submit the form - reset will be handled automatically when isPending changes
    if (onSubmit) onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-gray-900/30 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-blue-800">Add New Invoice</h3>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Lease ID */}
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">Lease ID</label>
                <input
                  type="text"
                  name="leaseId"
                  value={formData.leaseId}
                  onChange={handleChange}
                  placeholder="Enter Lease ID"
                  className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 transition outline-none ${
                    errors.leaseId ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-700"
                  }`}
                />
                {errors.leaseId && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.leaseId}</p>}
              </div>
              
              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">Amount (R)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter Amount"
                  className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 transition outline-none ${
                    errors.amount ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-700"
                  }`}
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.amount}</p>}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">Due Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 transition outline-none ${
                    errors.date ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-700"
                  }`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.date}</p>}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-2">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={buttonHoverTransition}
                  className="px-5 py-2 rounded-xl font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 shadow transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isPending}
                  whileHover={!isPending ? { scale: 1.05 } : {}}
                  whileTap={!isPending ? { scale: 0.95 } : {}}
                  transition={buttonHoverTransition}
                  className={`px-5 py-2 rounded-xl font-semibold text-white shadow flex items-center justify-center gap-2 ${
                    isPending ? "bg-blue-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  {isPending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <FaPlusCircle /> Add Invoice
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
