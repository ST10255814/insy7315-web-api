import { TabWrapper, StateHandler, MaintenanceColumn } from "../common/index.js";
import { statuses } from "../../constants/constants.js";
import { useMaintenanceRequestsQuery } from "../../utils/queries.js";
import { useParams, Routes, Route} from "react-router-dom";
import AssignCaretaker from "./maintenance/AssignCaretaker.jsx";
import UpdateMaintenanceRequest from "./maintenance/UpdateMaintenanceRequest.jsx";
import { useNavigate } from "react-router-dom";
import DashboardNotFound from "../feature/DashboardNotFound.jsx";
import Toast from "../../lib/toast.js";
import { useMarkMaintenanceAsCompletedMutation } from "../../utils/queries.js";

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

  const markCompletedMutation = useMarkMaintenanceAsCompletedMutation();

  const handleMaintenanceAction = (action, request) => {
    switch (action) {
      case "assign":
        navigate(`assign/${request.maintenanceID}`);
        break;
      case "update":
        navigate(`update/${request.maintenanceID}`);
        break;
      case "complete":
        Toast.promise(
          markCompletedMutation.mutateAsync(request.maintenanceID),
          {
            pending: "Marking as completed...",
            success: `Maintenance request ${request.maintenanceID} marked as completed`,
            error: "Failed to mark maintenance request as completed",
          }
        );
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
        loadingCount={9}
      >
        {/* Content State - Mobile: scrollable page, Desktop: scrollable columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 h-auto md:h-full md:min-h-0 w-full">
          {statuses.map((status) => (
            <div key={status} className="flex flex-col h-full min-h-[320px] md:min-h-0">
              <MaintenanceColumn
                status={status}
                requests={maintenanceData.filter(
                  (request) => request.status === status
                )}
                onAction={handleMaintenanceAction}
              />
            </div>
          ))}
        </div>
      </StateHandler>
    </TabWrapper>
  );
}
