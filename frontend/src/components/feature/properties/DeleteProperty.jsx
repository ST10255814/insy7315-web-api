import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { TabWrapper, StateHandler, ActionButton } from "../../common/index.js";
import Toast from "../../../lib/toast.js";
import { formatAmount } from "../../../utils/formatters.js";

export default function DeleteProperty() {
  const { userId: adminId, propertyId } = useParams();
  const navigate = useNavigate();

  // Mock data for UI display
  const property = {
    listingId: propertyId,
    title: "Modern Downtown Apartment",
    address: "123 Main Street, City Center, NY 10001",
    price: "2500",
    status: "Available",
  };
  const isLoading = false;
  const isError = false;
  const [isPending, setIsPending] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleBack = () => {
    navigate(`/dashboard/${adminId}/properties`);
  };

  const handleViewProperty = () => {
    navigate(`/dashboard/${adminId}/properties/view/${propertyId}`);
  };

  const handleDelete = () => {
    if (confirmText.toLowerCase() !== "delete") {
      Toast.error('Please type "delete" to confirm deletion.');
      return;
    }

    setIsPending(true);

    // Mock deletion with delay
    setTimeout(() => {
      setIsPending(false);
      Toast.success("Property deleted successfully! (Mock functionality)");
      navigate(`/dashboard/${adminId}/properties`);
    }, 1500);
  };

  const isDeleteDisabled = confirmText.toLowerCase() !== "delete" || isPending;

  return (
    <TabWrapper decorativeElements="default">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <ActionButton
            onClick={handleBack}
            icon={FaArrowLeft}
            variant="secondary"
            size="small"
          >
            Back to Properties
          </ActionButton>
        </div>

        <ActionButton
          onClick={handleViewProperty}
          variant="outline"
          size="small"
        >
          View Property
        </ActionButton>
      </div>

      <StateHandler
        isLoading={isLoading}
        isError={isError}
        data={property}
        errorMessage="Failed to load property details. Please try again."
        emptyMessage="Property not found."
      >
        {property && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            {/* Warning Card */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
                  <FaExclamationTriangle className="text-red-600 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-red-900 mb-2">
                    Delete Property
                  </h1>
                  <p className="text-red-700 mb-4">
                    Are you absolutely sure you want to delete this property?
                    This action cannot be undone.
                  </p>

                  <div className="bg-white border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 mb-2">
                      Property to be deleted:
                    </h3>
                    <div className="space-y-1">
                      <p className="text-gray-900">
                        <strong>Title:</strong> {property.title}
                      </p>
                      <p className="text-gray-700">
                        <strong>Address:</strong> {property.address}
                      </p>
                      <p className="text-gray-700">
                        <strong>Price:</strong> R {formatAmount(property.price)}
                      </p>
                      <p className="text-gray-700">
                        <strong>Status:</strong> {property.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Confirm Deletion
              </h2>

              <div className="mb-6">
                <p className="text-gray-600 mb-3">
                  Please type <strong className="text-red-600">"delete"</strong>{" "}
                  to confirm that you want to permanently delete this property:
                </p>

                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type 'delete' to confirm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  autoComplete="off"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <ActionButton
                  onClick={handleBack}
                  variant="secondary"
                  size="medium"
                >
                  Cancel
                </ActionButton>

                <ActionButton
                  onClick={handleDelete}
                  icon={FaTrash}
                  variant="danger"
                  size="medium"
                  disabled={isDeleteDisabled}
                >
                  {isPending ? "Deleting..." : "Delete Property"}
                </ActionButton>
              </div>

              {confirmText && confirmText.toLowerCase() !== "delete" && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    Type "delete" exactly to enable the delete button.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </StateHandler>
    </TabWrapper>
  );
}
