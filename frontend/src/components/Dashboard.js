import React, { useState } from "react";
import { motion } from "framer-motion";

import OverviewTab from "./OverviewTab.js";
import PropertiesTab from "./PropertiesTab.js";
import LeasesTab from "./LeaseTab.js";
import InvoicesTab from "./InvoicesTab.js";
import MaintenanceTab from "./MaintenanceTab.js";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "properties", label: "Properties" },
    { key: "leases", label: "Leases" },
    { key: "invoices", label: "Invoices" },
    { key: "maintenance", label: "Maintenance" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "properties":
        return <PropertiesTab />;
      case "leases":
        return <LeasesTab />;
      case "invoices":
        return <InvoicesTab />;
      case "maintenance":
        return <MaintenanceTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="p-6 mt-28 max-w-7xl mx-auto">
      <motion.h1
        className="text-3xl font-extrabold text-blue-700 mb-2 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Admin Dashboard
      </motion.h1>
      <p className="text-gray-600 mb-6 text-center">
        Manage your properties, view analytics, and track activity all in one place at a click of a button.
      </p>

      <div className="flex justify-center flex-wrap gap-4 mb-8">
        {tabs.map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-2xl font-semibold transition ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
}