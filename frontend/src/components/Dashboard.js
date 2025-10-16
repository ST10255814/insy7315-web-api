import React, { useState} from "react";
import { useParams, NavLink, Routes, Route, Navigate } from "react-router-dom";
import OverviewTab from "./OverviewTab.js";
import PropertiesTab from "./PropertiesTab.js";
import LeasesTab from "./LeaseTab.js";
import InvoicesTab from "./InvoicesTab.js";
import MaintenanceTab from "./MaintenanceTab.js";

export default function Dashboard() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { key: "overview", label: "Overview", description: "View a summary of all your properties and activity in one place." },
    { key: "properties", label: "Properties", description: "Manage and track all your properties, units, and details." },
    { key: "leases", label: "Leases", description: "View, add, and manage all active and past leases." },
    { key: "invoices", label: "Invoices", description: "Track payments, generate invoices, and manage billing." },
    { key: "maintenance", label: "Maintenance", description: "Monitor and schedule maintenance requests and tasks." },
  ];
  
  const currentTab = tabs.find(t => t.key === activeTab);

  return (
    <div className="p-6 mt-28 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">
        {currentTab.label}
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        {currentTab.description}
      </p>

      {/* Tabs as NavLinks */}
      <div className="flex justify-center flex-wrap gap-4 mb-8">
        {tabs.map((tab) => (
          <NavLink
            key={tab.key}
            to={`/dashboard/${userId}/${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={({ isActive }) =>
              `px-5 py-2 rounded-2xl font-semibold transition ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      <Routes>
        <Route path="/overview" element={<OverviewTab />} />
        <Route path="/properties" element={<PropertiesTab />} />
        <Route path="/leases" element={<LeasesTab />} />
        <Route path="/invoices" element={<InvoicesTab />} />
        <Route path="maintenance" element={<MaintenanceTab />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </div>
  );
}
