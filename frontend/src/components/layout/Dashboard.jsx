import {
  useParams,
  useLocation,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import OverviewTab from "../feature/OverviewTab.jsx";
import PropertiesTab from "../feature/PropertiesTab.jsx";
import LeasesTab from "../feature/LeaseTab.jsx";
import InvoicesTab from "../feature/InvoicesTab.jsx";
import MaintenanceTab from "../feature/MaintenanceTab.jsx";
import BookingsTab from "../feature/BookingsTab.jsx";
import DashboardNotFound from "../feature/DashboardNotFound.jsx";
import Sidebar, { tabs } from "./Sidebar.jsx";
import DashboardHeader from "./DashboardHeader.jsx";
import MobileMenuButton from "./MobileMenuButton.jsx";

export default function Dashboard() {
  const { userId } = useParams();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);

      // Close mobile sidebar when switching to desktop
      if (desktop && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  const pathParts = location.pathname.split("/");
  const activeTab = pathParts[3] || "overview";
  const currentTab = tabs.find((t) => t.key === activeTab) || tabs[0];

  // Check if current route is valid (exact match and no extra path segments for main tabs)
  const expectedPath = `/dashboard/${userId}/${activeTab}`;
  const isValidRoute =
    tabs.some((tab) => tab.key === activeTab) &&
    (location.pathname === expectedPath ||
      location.pathname === `/dashboard/${userId}` ||
      location.pathname.startsWith(`/dashboard/${userId}/${activeTab}/`));

  return (
    <div className="flex h-screen bg-white pt-16">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isDesktop={isDesktop}
      />

      <MobileMenuButton
        isDesktop={isDesktop}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10">
        <div className={isValidRoute ? "p-6" : ""}>
          {/* Page Header - Only show for valid routes and main tabs (not sub-routes) */}
          {isValidRoute && location.pathname === expectedPath && (
            <DashboardHeader currentTab={currentTab} />
          )}

          {/* Tab Content */}
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<OverviewTab />} />
            <Route path="properties/*" element={<PropertiesTab />} />
            <Route path="leases/*" element={<LeasesTab />} />
            <Route path="invoices/*" element={<InvoicesTab />} />
            <Route path="maintenance/*" element={<MaintenanceTab />} />
            <Route path="bookings/*" element={<BookingsTab />} />
            {/* Catch-all route for invalid dashboard paths */}
            <Route path="*" element={<DashboardNotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
