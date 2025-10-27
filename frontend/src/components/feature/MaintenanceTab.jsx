import { TabWrapper, StateHandler, MaintenanceColumn } from "../common/index.js";
import { statuses } from "../../constants/constants.js";
import { useMaintenanceRequestsQuery } from "../../utils/queries.js";
import { useParams } from "react-router-dom";

export default function MaintenanceTab() {
  const { userId: adminId } = useParams();
  const {
    data: maintenanceData = [],
    isLoading,
    isError,
  } = useMaintenanceRequestsQuery(adminId);
  
  return (
    <TabWrapper className="flex flex-col h-full w-full overflow-y-auto md:overflow-hidden" decorativeElements="none">
      <StateHandler
        isLoading={isLoading}
        isError={isError}
        data={maintenanceData}
        errorMessage="Failed to load maintenance requests. Please try again."
        emptyMessage="No maintenance requests found. Contact support to report issues."
        loadingComponent={() => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-full md:overflow-hidden">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
          </div>
        )}
      >
        {/* Content State - Mobile: scrollable page, Desktop: scrollable columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-full md:min-h-0">
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
      </StateHandler>
    </TabWrapper>
  );
}
