import { NavLink, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaBuilding,
  FaFileContract,
  FaFileInvoice,
  FaWrench,
  FaCalendarCheck,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

const tabs = [
  { key: "overview", label: "Overview", description: "View a summary of all your properties and activity in one place.", icon: FaHome },
  { key: "properties", label: "Your Properties", description: "Manage and track all your properties, units, and details.", icon: FaBuilding },
  { key: "leases", label: "Your Leases", description: "View, add, and manage all active and past leases.", icon: FaFileContract },
  { key: "invoices", label: "Your Invoices", description: "Track payments, generate invoices, and manage billing.", icon: FaFileInvoice },
  { key: "maintenance", label: "Your Maintenance Requests", description: "Monitor and schedule maintenance requests and tasks.", icon: FaWrench },
  { key: "bookings", label: "Your Bookings", description: "Manage property bookings and reservations.", icon: FaCalendarCheck },
];

export default function Sidebar({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  isCollapsed, 
  setIsCollapsed, 
  isDesktop 
}) {
  const { userId } = useParams();
  const location = useLocation();
  
  const pathParts = location.pathname.split("/");
  const activeTab = pathParts[3] || "overview";

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isSidebarOpen || isDesktop ? 0 : -320,
          width: isCollapsed && isDesktop ? 80 : 320
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed lg:relative z-50 h-full bg-white backdrop-blur-lg border-r border-white/20 shadow-xl flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {(!isCollapsed || !isDesktop) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <span className="text-xl font-bold text-blue-700">Dashboard</span>
              </motion.div>
            )}
            
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-lg hover:bg-white/70 transition-colors"
            >
              {isCollapsed ? (
                <FaChevronRight className="text-gray-600 w-4 h-4" />
              ) : (
                <FaChevronLeft className="text-gray-600 w-4 h-4" />
              )}
            </button>
            
            {/* Mobile Close */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-red-500 transition-colors"
            >
              <FaTimes className="text-gray-600 hover:text-white w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            
            return (
              <NavLink
                key={tab.key}
                to={`/dashboard/${userId}/${tab.key}`}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-white/70"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className="flex items-center justify-center w-5 h-5">
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"}`} />
                </div>
                {(!isCollapsed || !isDesktop) && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center"
                  >
                    <span className="font-semibold">{tab.label}</span>
                  </motion.div>
                )}
                
                {/* Tooltip for collapsed state - only on desktop */}
                {isCollapsed && isDesktop && (
                  <div className="absolute left-full ml-3 px-4 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-gray-700/50 group-hover:translate-x-1">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900/95 rotate-45 border-l border-b border-gray-700/50"></div>
                    {tab.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}

export { tabs };