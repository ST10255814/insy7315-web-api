import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../lib/toast";

export default function InvoicesTab() {
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
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    tenant: "",
    property: "",
    amount: "",
    due: "",
    errors: {},
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      errors: { ...formData.errors, [name]: false },
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email required";
    if (!formData.tenant) errors.tenant = "Tenant required";
    if (!formData.property) errors.property = "Property required";
    if (!formData.amount || isNaN(formData.amount))
      errors.amount = "Valid amount required";
    if (!formData.due) errors.due = "Due date required";
    setFormData((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // API call to backend would go here
    Toast.success(`Invoice added: ${formData.invoiceNumber}`);
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      invoiceNumber: "",
      tenant: "",
      property: "",
      amount: "",
      due: "",
      errors: {},
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const buttonHoverTransition = { type: "spring", stiffness: 800, damping: 15 };

  return (
    <motion.div className="relative p-6 sm:p-10 max-w-6xl mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-2xl border border-blue-100">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-800">
          Invoice Management
        </h3>
        <motion.button
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={buttonHoverTransition}
          className="w-full sm:w-auto bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md"
        >
          + Add Invoice
        </motion.button>
      </div>

      {/* TABLE VIEW */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl shadow-xl bg-white/90 backdrop-blur-md">
        <table className="min-w-full text-center border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white uppercase tracking-wide text-xs sm:text-sm">
              <th className="px-4 py-3 rounded-l-2xl">Invoice #</th>
              <th className="px-4 py-3">Tenant</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3 rounded-r-2xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {invoices.map((inv, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-gray-100 hover:bg-blue-50/60 transition-colors duration-200"
                >
                  <td className="px-3 py-3 text-blue-700 font-bold">{inv.invoiceNumber}</td>
                  <td className="px-3 py-3">{inv.tenant}</td>
                  <td className="px-3 py-3">{inv.property}</td>
                  <td className="px-3 py-3 font-bold text-blue-600">
                    R{inv.amount.toLocaleString()}
                  </td>
                  <td className="px-3 py-3">{formatDate(inv.due)}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        inv.status === "Paid"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm italic">{inv.notes}</td>
                  <td className="px-3 py-3 flex justify-center gap-2 flex-wrap">
                    {["Edit", "Delete"].map((action, j) => (
                      <motion.button
                        key={j}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.95 }}
                        transition={buttonHoverTransition}
                        className={`${
                          action === "Edit"
                            ? "text-blue-600 hover:text-blue-700"
                            : "text-red-600 hover:text-red-700"
                        } font-semibold px-3 py-1 rounded text-sm`}
                      >
                        {action}
                      </motion.button>
                    ))}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="sm:hidden mt-4 space-y-4">
        <AnimatePresence>
          {invoices.map((inv, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
            >
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-bold text-blue-800 text-lg">{inv.tenant}</h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    inv.status === "Paid" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                  }`}
                >
                  {inv.status}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                <p><strong>Invoice #:</strong> {inv.invoiceNumber}</p>
                <p><strong>Property:</strong> {inv.property}</p>
                <p><strong>Due:</strong> {formatDate(inv.due)}</p>
                <p className="text-blue-700 font-semibold">Amount: R{inv.amount.toLocaleString()}</p>
              </div>
              <div className="flex justify-end gap-3 mt-3">
                {["Edit", "Delete"].map((action, j) => (
                  <motion.button
                    key={j}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    transition={buttonHoverTransition}
                    className={`${
                      action === "Edit" ? "text-blue-600 hover:text-blue-700" : "text-red-600 hover:text-red-700"
                    } text-xs font-semibold`}
                  >
                    {action}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ADD INVOICE MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-gray-900/20 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md border border-gray-200"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-blue-800 mb-6 text-center">
                Add New Invoice
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {["tenant", "email","property","amount","due"].map((field) => (
                  <motion.div
                    key={field}
                    animate={
                      formData.errors[field] ? { x: [0, -5, 5, -5, 5, 0] } : {}
                    }
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-blue-700 mb-1">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type={field === "amount" ? "number" : field === "due" ? "date" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={`Enter ${field}`}
                      className={`w-full px-3 py-2 border rounded-xl shadow-sm transition outline-none ${
                        formData.errors[field]
                          ? "border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]"
                          : "border-gray-300 focus:ring-2 focus:ring-blue-700"
                      }`}
                    />
                    {formData.errors[field] && (
                      <p className="text-[#FF3B30] text-sm mt-1 font-semibold">
                        {formData.errors[field]}
                      </p>
                    )}
                  </motion.div>
                ))}

                <div className="flex justify-end gap-3 mt-4">
                  <motion.button
                    type="button"
                    onClick={closeModal}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={buttonHoverTransition}
                    className="px-4 py-2 rounded-lg font-semibold bg-blue-700 text-white hover:bg-blue-800 shadow-md"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={buttonHoverTransition}
                    className="px-5 py-2 rounded-lg font-semibold bg-blue-700 text-white shadow-md"
                  >
                    Add Invoice
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}