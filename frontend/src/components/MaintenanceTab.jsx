import { motion } from "framer-motion";
import MaintenanceColumn from "../pages/MaintenanceColumn.jsx";
import LoadingSkeleton from "../pages/LoadingSkeleton.jsx";
import { statuses } from "../constants/constants.js";
import { useMaintenanceRequestsQuery } from "../utils/queries.js";
import { useParams } from "react-router-dom";

export default function MaintenanceTab() {
  const { userId: adminId } = useParams();
  const {
    data: maintenanceData = [],
    isLoading,
    isError,
  } = useMaintenanceRequestsQuery(adminId);
  return (
    <motion.div className="flex flex-col h-full md:h-full max-w-7xl mx-auto px-4 overflow-y-auto md:overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-full md:overflow-hidden pt-2 px-4 pb-4">
          {Array(6)
            .fill(0)
            .map((_, i) => <LoadingSkeleton key={i} />)}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex items-center justify-center h-64 md:h-full">
          <div className="text-red-600 font-semibold text-center">
            Failed to load maintenance requests. Please try again.
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && maintenanceData.length === 0 && (
        <div className="flex items-center justify-center h-64 md:h-full">
          <div className="text-gray-500 text-center font-medium">
            No maintenance requests found. Contact support to report issues.
          </div>
        </div>
      )}

      {/* Content State - Mobile: scrollable page, Desktop: scrollable columns */}
      {!isLoading && !isError && maintenanceData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-full md:min-h-0 pt-2 px-4 pb-4">
          {statuses.map((status) => (
            <MaintenanceColumn
              key={status}
              status={status}
              requests={maintenanceData.filter(
                (request) => request.status === status
              )}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
