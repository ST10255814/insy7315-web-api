import { DeleteEntityComponent } from "../../common/index.js";
import { formatAmount } from "../../../utils/formatters.js";
import {
  useInvoiceByIdQuery,
  useDeleteInvoiceMutation,
} from "../../../utils/queries.js";
import { formatDate } from "../../../utils/formatters.js";

export default function DeleteInvoice() {
  const renderInvoiceDetails = (invoice) => (
    <div className="pl-1">
          <div className="space-y-1">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Invoice Details</div>
            <div className="text-sm text-gray-700 mb-1">
              <span className="font-bold text-red-800 mr-2">Invoice ID:</span>
              <span className="font-semibold text-gray-900">{invoice.invoice.invoiceId}</span>
            </div>
            <div className="text-sm font-bold text-red-800 mb-1">
              <span className="font-bold text-red-800 mr-2">Tenant:</span>
              <span className="font-semibold text-gray-900 ml-2">{invoice.invoice.lease.tenant}</span>
            </div>
            <div className="text-sm text-gray-700 mb-1">
              <span className="font-bold text-red-800 mr-2">Amount:</span>
              <span className="font-semibold text-gray-900">R{formatAmount(invoice.invoice.amount)}</span>
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-bold text-red-800 mr-2">Due Date:</span>
              <span className="font-semibold text-gray-700">{formatDate(invoice.invoice.date)}</span>
            </div>
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