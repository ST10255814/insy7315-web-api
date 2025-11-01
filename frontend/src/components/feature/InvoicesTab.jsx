import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";
import Toast from "../../lib/toast.js";
import { TabWrapper, StateHandler, ActionButton, InvoiceCard } from "../common/index.js";
import {
  useInvoicesQuery,
} from "../../utils/queries.js";
import { useParams, useNavigate, Routes, Route } from "react-router-dom";
import AddInvoice from "../feature/invoice/AddInvoice.jsx";
import DeleteInvoice from "../feature/invoice/DeleteInvoice.jsx";
import ViewInvoice from "../feature/invoice/ViewInvoice.jsx";

export default function InvoicesTab() {
  return (
    <Routes>
      <Route path="add" element={<AddInvoice />} />
      <Route path="delete/:invoiceId" element={<DeleteInvoice />} />
      <Route path="view/:invoiceId" element={<ViewInvoice />} />
      <Route index element={<InvoicesListView />} />
    </Routes>
  );
}

function InvoicesListView() {
  const { userId: adminId } = useParams();
  // React Query to get invoices
  const { data, isLoading, isError } = useInvoicesQuery(adminId);
  // Normalize the data shape so `invoices` is always an array
  const invoices = Array.isArray(data) ? data : data?.invoices ?? [];
  const navigate = useNavigate();

  const handleInvoiceAction = (action, invoice) => {
    switch (action) {
      case "Edit":
        //TODO: Implement edit functionality
        Toast.info(`Editing ${invoice.invoiceId}`);
        break;
      case "Delete":
        navigate(`delete/${invoice.invoiceId}`);
        break;
      case "View":
        navigate(`view/${invoice.invoiceId}`);
        break;
      default:
        break;
    }
  };

  return (
    <TabWrapper decorativeElements="blue-purple">
      {/* Add Invoice Button */}
      <div className="flex justify-start">
        <ActionButton
          onClick={() => navigate(`add`)}
          icon={FaPlusCircle}
          disabled={isLoading}
          size="medium"
        >
          Add Invoice
        </ActionButton>
      </div>

      <StateHandler
        isLoading={isLoading}
        isError={isError}
        data={invoices}
        errorMessage="Failed to load invoices. Please try again."
        emptyMessage="No invoices found. Add a new invoice to get started."
        gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        loadingCount={8}
      >
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence>
            {invoices.map((invoice, index) => (
              <motion.div
                key={invoice.invoiceId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <InvoiceCard
                  invoice={invoice}
                  onAction={handleInvoiceAction}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </StateHandler>
    </TabWrapper>
  );
}
