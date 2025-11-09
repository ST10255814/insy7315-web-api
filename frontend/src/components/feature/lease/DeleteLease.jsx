import { DeleteEntityComponent } from "../../common/index.js";
import { formatAmount } from "../../../utils/formatters.js";
import {
  useLeaseByIdQuery,
  useDeleteLeaseMutation,
} from "../../../utils/queries.js";

export default function DeleteLease() {
  const renderLeaseDetails = (lease) => (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Property:</span>
        <span className="font-medium text-blue-700">{lease.propertyTitle}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Tenant:</span>
        <span className="font-medium text-blue-700">{lease.tenantName}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Monthly Rent:</span>
        <span className="font-medium text-blue-700">
          {formatAmount(lease.monthlyRent)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Duration:</span>
        <span className="font-medium text-blue-700">
          {lease.startDate} to {lease.endDate}
        </span>
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