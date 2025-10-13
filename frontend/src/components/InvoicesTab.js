import React, { useState } from "react";
import { motion } from "framer-motion";

export default function InvoicesTab() {
  const [invoices, setInvoices] = useState([
    {
      invoiceNumber: "INV-001",
      tenant: "John Smith",
      property: "Unit 4A",
      amount: 22500,
      due: "28 Feb 2025",
      status: "Paid",
      notes: "Paid via EFT",
    },
    {
      invoiceNumber: "INV-002",
      tenant: "Mike Davis",
      property: "Unit 12B",
      amount: 33800,
      due: "28 Feb 2025",
      status: "Unpaid",
      notes: "Reminder sent",
    },
    {
      invoiceNumber: "INV-003",
      tenant: "Alice Brown",
      property: "Unit 7C",
      amount: 15000,
      due: "28 Feb 2025",
      status: "Overdue",
      notes: "Late fee applied",
    },
  ]);

  const [invoiceNotes, setInvoiceNotes] = useState(
    invoices.map((inv) => inv.notes)
  );
  const [lastActions, setLastActions] = useState(invoices.map(() => ""));

  const handleAction = (index, action) => {
    const newLastActions = [...lastActions];
    newLastActions[index] = action;
    setLastActions(newLastActions);

    const newNotes = [...invoiceNotes];
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    switch (action) {
      case "Mark Paid":
        newNotes[index] = `Paid on ${formattedDate}`;
        break;
      case "Eviction Notice":
        newNotes[index] = `Eviction notice sent on ${formattedDate}`;
        break;
      case "Send Reminder":
        newNotes[index] = `Reminder sent on ${formattedDate}`;
        break;
      case "Send Final Reminder":
        newNotes[index] = `Final reminder sent on ${formattedDate}`;
        break;
      default:
        newNotes[index] = action;
    }
    setInvoiceNotes(newNotes);
  };

  const getAvailableActions = (invoice, lastAction) => {
    const today = new Date();
    const dueDate = new Date(invoice.due);
    const diffDays = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
    const actions = [];

    if (invoice.status === "Paid") {
      if (lastAction !== "Mark Paid") actions.push("Mark Paid");
    } else {
      if (diffDays > 0) {
        if (lastAction !== "Eviction Notice") actions.push("Eviction Notice");
        if (lastAction !== "Send Final Reminder")
          actions.push("Send Final Reminder");
      } else {
        if (lastAction !== "Send Reminder") actions.push("Send Reminder");
      }
      if (lastAction !== "Mark Paid") actions.push("Mark Paid");
    }

    return actions;
  };

  const addInvoice = () => {
    const invoiceNumber = prompt("Enter Invoice Number:");
    if (!invoiceNumber) return;
    const tenant = prompt("Enter Tenant Name:");
    if (!tenant) return;
    const property = prompt("Enter Property:");
    if (!property) return;
    const amount = parseFloat(prompt("Enter Amount:"));
    if (isNaN(amount)) return;
    const due = prompt("Enter Due Date (e.g., 28 Feb 2025):");
    if (!due) return;

    const newInvoice = {
      invoiceNumber,
      tenant,
      property,
      amount,
      due,
      status: "Unpaid",
      notes: "",
    };

    setInvoices([...invoices, newInvoice]);
    setInvoiceNotes([...invoiceNotes, ""]);
    setLastActions([...lastActions, ""]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-2xl p-10 mx-auto w-full max-w-5xl border border-blue-100"
    >
      {/* Header + Animated Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-extrabold text-blue-800">
          Invoice Management
        </h3>

        <motion.button
          onClick={addInvoice}
          whileHover={{
            scale: 1.08,
            backgroundColor: "#2563eb", // Darker blue on hover
            boxShadow: "0px 8px 15px rgba(0,0,0,0.2)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md"
        >
          + Add Invoice
        </motion.button>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm uppercase tracking-wide">
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
            {invoices.map((inv, i) => (
              <motion.tr
                key={i}
                initial={{
                  scale: 1,
                  backgroundColor: "rgba(242, 247, 255, 0)",
                }}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(242, 247, 255, 0.6)",
                }}
                transition={{ type: "tween", duration: 0.3 }}
                className="border-b border-gray-100"
              >
                <td className="px-3 py-3 font-semibold text-blue-700">
                  {inv.invoiceNumber}
                </td>
                <td className="px-3 py-3 text-gray-800">{inv.tenant}</td>
                <td className="px-3 py-3 text-gray-700">{inv.property}</td>
                <td className="px-3 py-3 font-semibold text-blue-700">
                  R{inv.amount.toLocaleString()}
                </td>
                <td className="px-3 py-3 text-gray-600">{inv.due}</td>
                <td className="px-3 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                      inv.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : inv.status === "Unpaid"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-gray-700 text-sm italic">
                  {invoiceNotes[i]}
                </td>
                <td className="px-3 py-3 flex justify-center gap-2 flex-wrap">
                  {getAvailableActions(inv, lastActions[i])
                    .slice(0, 3)
                    .map((action, idx) => {
                      let colorClass = "";
                      if (action === "Eviction Notice")
                        colorClass = "bg-red-100 text-red-700";
                      if (action === "Send Reminder")
                        colorClass = "bg-yellow-100 text-yellow-700";
                      if (action === "Send Final Reminder")
                        colorClass = "bg-yellow-200 text-yellow-800";
                      if (action === "Mark Paid")
                        colorClass = "bg-green-100 text-green-700";
                      else if (!colorClass)
                        colorClass = "bg-blue-100 text-blue-700";

                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleAction(i, action)}
                          className={`${colorClass} rounded-full px-3 py-1 text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-200`}
                        >
                          {action}
                        </motion.button>
                      );
                    })}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
