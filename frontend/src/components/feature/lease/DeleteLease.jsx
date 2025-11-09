import { DeleteEntityComponent, EntityDetailsCard } from "../../common/index.js";
import {
  useLeaseByIdQuery,
  useDeleteLeaseMutation,
} from "../../../utils/queries.js";
import { formatAmount, formatDate } from "../../../utils/formatters.js";

export default function DeleteLease() {
  const renderLeaseDetails = (lease) => (
    <EntityDetailsCard
      heading="Lease Details"
      fields={[
        { label: "Lease ID", value: lease.leaseId },
        { label: "Tenant", value: `${lease.tenant.firstName} ${lease.tenant.lastName}` },
        { label: "Nightly Price", value: `R${formatAmount(lease.bookingDetails.rentAmount)}` },
        { label: "Duration", value: `${formatDate(lease.bookingDetails.startDate)} to ${formatDate(lease.bookingDetails.endDate)}` },
      ]}
    />
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