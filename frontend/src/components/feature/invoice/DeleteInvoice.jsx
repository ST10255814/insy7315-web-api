import { DeleteEntityComponent, EntityDetailsCard } from "../../common/index.js";
import { formatAmount } from "../../../utils/formatters.js";
import {
  useInvoiceByIdQuery,
  useDeleteInvoiceMutation,
} from "../../../utils/queries.js";
import { formatDate } from "../../../utils/formatters.js";

export default function DeleteInvoice() {
  const renderInvoiceDetails = (invoice) => (
    <EntityDetailsCard
      heading="Invoice Details"
      fields={[
        { label: "Invoice ID", value: invoice.invoice.invoiceId },
        { label: "Tenant", value: invoice.invoice.lease.tenant },
        { label: "Amount", value: `R${formatAmount(invoice.invoice.amount)}` },
        { label: "Due Date", value: formatDate(invoice.invoice.date) },
      ]}
    />
  );

  return (
    <DeleteEntityComponent
      entityType="invoice"
      entityDisplayName="Invoice"
      entityIdParam="invoiceId"
      useEntityByIdQuery={useInvoiceByIdQuery}
      useDeleteEntityMutation={useDeleteInvoiceMutation}
      renderEntityDetails={renderInvoiceDetails}
      basePath="/invoices"
    />
  );
}