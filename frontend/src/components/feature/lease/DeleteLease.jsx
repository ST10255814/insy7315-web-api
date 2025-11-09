import { DeleteEntityComponent } from "../../common/index.js";
import {
  useLeaseByIdQuery,
  useDeleteLeaseMutation,
} from "../../../utils/queries.js";
import { formatAmount, formatDate } from "../../../utils/formatters.js";

export default function DeleteLease() {
  const renderLeaseDetails = (lease) => (
    <div className="pl-1">
      <div className="space-y-1">
        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Lease Details</div>
        <div className="text-sm text-gray-700 mb-1">
          <span className="font-bold text-red-800 mr-2">Lease ID:</span>
          <span className="font-semibold text-gray-900">{lease.leaseId}</span>
        </div>
        <div className="text-sm font-bold text-red-800 mb-1">
          <span className="font-bold text-red-800 mr-2">Tenant:</span>
          <span className="font-semibold text-gray-900 ml-2">{lease.tenant.firstName} {lease.tenant.lastName}</span>
        </div>
        <div className="text-sm text-gray-700 mb-1">
          <span className="font-bold text-red-800 mr-2">Nightly Price:</span>
          <span className="font-semibold text-gray-900">R{formatAmount(lease.bookingDetails.rentAmount)}</span>
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-bold text-red-800 mr-2">Duration:</span>
          <span className="font-semibold text-gray-700">{formatDate(lease.bookingDetails.startDate)} to {formatDate(lease.bookingDetails.endDate)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <DeleteEntityComponent
      entityType="lease"
      entityDisplayName="Lease"
      entityIdParam="leaseId"
      useEntityByIdQuery={useLeaseByIdQuery}
      useDeleteEntityMutation={useDeleteLeaseMutation}
      renderEntityDetails={renderLeaseDetails}
      basePath="/leases"
    />
  );
}