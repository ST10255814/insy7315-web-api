import React from "react";
import { useParams, useLocation, NavLink, Routes, Route, Navigate } from "react-router-dom";
import OverviewTab from "./OverviewTab.jsx";
import PropertiesTab from "./PropertiesTab.jsx";
import LeasesTab from "./LeaseTab.jsx";
import InvoicesTab from "./InvoicesTab.jsx";
import MaintenanceTab from "./MaintenanceTab.jsx";
import BookingsTab from "./BookingsTab.jsx";

export default function Dashboard() {
  const { userId } = useParams();
  const location = useLocation();

  const tabs = [
    { key: "overview", label: "Overview", description: "View a summary of all your properties and activity in one place." },
    { key: "properties", label: "Properties", description: "Manage and track all your properties, units, and details." },
    { key: "leases", label: "Leases", description: "View, add, and manage all active and past leases." },
    { key: "invoices", label: "Invoices", description: "Track payments, generate invoices, and manage billing." },
    { key: "maintenance", label: "Maintenance", description: "Monitor and schedule maintenance requests and tasks." },
    { key: "bookings", label: "Bookings", description: "Manage property bookings and reservations." },
  ];

  const pathParts = location.pathname.split("/");
  const activeTab = pathParts[3] || "overview";
  const currentTab = tabs.find((t) => t.key === activeTab) || tabs[0];
  const isMaintenanceTab = activeTab === "maintenance";

  if (isMaintenanceTab) {
    return (
      <div className="flex flex-col h-screen">
        {/* Fixed Header for Maintenance Tab */}
        <div className="flex-shrink-0 p-6 mt-20 max-w-7xl mx-auto w-full">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">
            {currentTab.label}
          </h1>
          <p className="text-gray-600 mb-4 text-center">{currentTab.description}</p>

          {/* Tabs */}
          <div className="flex justify-center flex-wrap gap-4 mb-4">
            {tabs.map((tab) => (
              <NavLink
                key={tab.key}
                to={`/dashboard/${userId}/${tab.key}`}
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
        </div>

        {/* Maintenance Tab Content - Takes remaining height */}
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="maintenance" element={<MaintenanceTab />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">
        {currentTab.label}
      </h1>
      <p className="text-gray-600 mb-6 text-center">{currentTab.description}</p>

      {/* Tabs */}
      <div className="flex justify-center flex-wrap gap-4 mb-8">
        {tabs.map((tab) => (
          <NavLink
            key={tab.key}
            to={`/dashboard/${userId}/${tab.key}`}
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

      {/* Tab Content */}
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewTab />} />
        <Route path="properties" element={<PropertiesTab />} />
        <Route path="leases" element={<LeasesTab />} />
        <Route path="invoices" element={<InvoicesTab />} />
        <Route path="bookings" element={<BookingsTab />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </div>
  );
}
