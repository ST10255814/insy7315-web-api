import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { TabWrapper, StateHandler } from "../../common/index.js";
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
    status: "Vacant",
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
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
          >
            <FaArrowLeft className="w-5 h-5" />
            Back to Properties
          </button>
        </div>

        <button
          onClick={handleViewProperty}
          className="px-4 py-2 rounded-lg border border-blue-500 text-blue-600 font-medium bg-white shadow hover:bg-blue-50 hover:text-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
        >
          View Property
        </button>
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
            <div className="bg-gradient-to-br from-red-100 via-white to-red-50 border border-red-300 rounded-xl p-5 mb-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-red-200 to-red-100 rounded-full flex-shrink-0 shadow">
                  <FaExclamationTriangle className="text-red-600 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-red-800 mb-1 tracking-tight">
                    Delete Property
                  </h1>
                  <p className="text-red-700 mb-3 text-sm">
                    Are you absolutely sure you want to delete this property?
                    <br className="hidden md:block" />
                    <span className="font-semibold">This action cannot be undone.</span>
                  </p>

                  <div className="bg-white border border-red-200 rounded-lg p-3 shadow-sm">
                    <h3 className="font-semibold text-red-900 mb-1 text-base">
                      Property to be deleted:
                    </h3>
                    <div className="space-y-1">
                      <p className="text-gray-900 text-sm">
                        <strong>Title:</strong> <span className="font-medium">{property.title}</span>
                      </p>
                      <p className="text-gray-700 text-sm">
                        <strong>Address:</strong> <span className="font-medium">{property.address}</span>
                      </p>
                      <p className="text-gray-700 text-sm">
                        <strong>Price:</strong> <span className="font-medium">R {formatAmount(property.price)}</span>
                      </p>
                      <p className="text-gray-700 text-sm">
                        <strong>Status:</strong> <span className="font-medium">{property.status}</span>
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
                <button
                  onClick={handleBack}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium shadow hover:bg-gray-300 hover:scale-105 hover:shadow-lg transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 text-base"
                  disabled={isPending}
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className={`px-4 py-2 rounded-lg font-medium shadow flex items-center gap-2 transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 text-base ${isDeleteDisabled ? 'bg-red-200 text-red-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-lg'}`}
                  disabled={isDeleteDisabled}
                >
                  <FaTrash className="w-5 h-5" />
                  {isPending ? "Deleting..." : "Delete Property"}
                </button>
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
