import { DeleteEntityComponent } from "../../common/index.js";
import { formatAmount } from "../../../utils/formatters.js";
import {
  useInvoiceByIdQuery,
  useDeleteInvoiceMutation,
} from "../../../utils/queries.js";

export default function DeleteInvoice() {
  const renderInvoiceDetails = (invoice) => (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Invoice ID:</span>
        <span className="font-medium text-blue-700">{invoice.invoiceNumber}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Property:</span>
        <span className="font-medium text-blue-700">{invoice.propertyTitle}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Amount:</span>
        <span className="font-medium text-blue-700">
          {formatAmount(invoice.amount)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Due Date:</span>
        <span className="font-medium text-blue-700">
          {invoice.dueDate}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Status:</span>
        <span className="font-medium text-blue-700">
          {invoice.status}
        </span>
      </div>
    </div>
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