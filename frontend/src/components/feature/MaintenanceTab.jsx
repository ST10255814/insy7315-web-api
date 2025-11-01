import { TabWrapper, StateHandler, MaintenanceColumn } from "../common/index.js";
import { statuses } from "../../constants/constants.js";
import { useMaintenanceRequestsQuery } from "../../utils/queries.js";
import { useParams, Routes, Route} from "react-router-dom";
import AssignCaretaker from "./maintenance/AssignCaretaker.jsx";
import UpdateMaintenanceRequest from "./maintenance/UpdateMaintenanceRequest.jsx";
import { useNavigate } from "react-router-dom";
import DashboardNotFound from "../feature/DashboardNotFound.jsx";

export default function MaintenanceTab() {
  return (
    <Routes>
      <Route index element={<MaintenanceListView />} />
      <Route path="assign/:maintenanceId" element={<AssignCaretaker />} />
      <Route path="update/:maintenanceId" element={<UpdateMaintenanceRequest />} />
      <Route path="*" element={<DashboardNotFound />} />
    </Routes>
  );
}

function MaintenanceListView() {
  const navigate = useNavigate();
  const { userId: adminId } = useParams();
  const {
    data: maintenanceData = [],
    isLoading,
    isError,
  } = useMaintenanceRequestsQuery(adminId);

  const handleMaintenanceAction = (action, request) => {
    switch (action) {
      case "assign":
        navigate(`assign/${request.maintenanceID}`);
        break;
      case "update":
        navigate(`update/${request.maintenanceID}`);
        break;
      default:
        break;
    }
  };
  
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
            {Array(9)
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
              onAction={handleMaintenanceAction}
            />
          ))}
        </div>
      </StateHandler>
    </TabWrapper>
  );
}
