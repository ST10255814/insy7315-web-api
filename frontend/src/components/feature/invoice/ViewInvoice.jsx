import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { DataStateHandler, DataLoading } from "../../common/index.js";
import {
  useInvoiceByIdQuery,
} from "../../../utils/queries.js";
import { TabWrapper } from "../../common";
import InvoicePreview from "./InvoicePreview.jsx";

export default function ViewInvoice() {
  const { userId: adminId, invoiceId } = useParams();
  const navigate = useNavigate();

  const {
    data: invoice,
    isLoading: invoiceLoading,
    isError: invoiceError,
  } = useInvoiceByIdQuery(adminId, invoiceId);

  const handleBack = () => {
    navigate(-1);
  };

  const isLoading = invoiceLoading ;
  const isError = invoiceError;
  
  return (
    <TabWrapper decorativeElements="default">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
          >
            <FaArrowLeft className="w-5 h-5" />
            Back to Invoices
          </button>
        </div>

        <DataStateHandler
          isLoading={isLoading}
          isError={isError}
          data={invoice}
          errorMessage="Failed to load invoice details. Please try again."
          emptyMessage="Invoice not found."
          loadingComponent={DataLoading}
        >
          {invoice && (
            <InvoicePreview
              selectedLease={invoice.invoice}
              formData={invoice.invoice}
            />
          )}
        </DataStateHandler>
      </div>
    </TabWrapper>
  );
}
