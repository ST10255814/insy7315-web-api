import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { TabWrapper, DataStateHandler, DataLoading } from "../common/index.js";
import Toast from "../../lib/toast.js";

/**
 * Generic Delete Component for any entity type
 * Handles the common deletion pattern used across properties, leases, bookings, and invoices
 * 
 * @param {Object} props
 * @param {string} props.entityType - Type of entity (e.g., "property", "lease", "booking", "invoice")
 * @param {string} props.entityDisplayName - Display name for the entity type (e.g., "Property", "Lease")
 * @param {string} props.entityIdParam - URL parameter name for the entity ID (e.g., "propertyId", "leaseId")
 * @param {Function} props.useEntityByIdQuery - React Query hook to fetch entity by ID
 * @param {Function} props.useDeleteEntityMutation - React Query hook to delete entity
 * @param {Function} props.renderEntityDetails - Function to render entity-specific details
 * @param {string} props.basePath - Base navigation path (e.g., "/properties", "/leases")
 */
export default function DeleteEntityComponent({
  entityType,
  entityDisplayName,
  entityIdParam,
  useEntityByIdQuery,
  useDeleteEntityMutation,
  renderEntityDetails,
  basePath,
}) {
  const { userId: adminId, [entityIdParam]: entityId } = useParams();
  const navigate = useNavigate();
  const {
    data: entity,
    isLoading,
    isError,
  } = useEntityByIdQuery(adminId, entityId);

  const deleteMutation = useDeleteEntityMutation();
  const [confirmText, setConfirmText] = useState("");

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewEntity = () => {
    navigate(`/dashboard/${adminId}${basePath}/view/${entityId}`);
  };

  const handleDelete = () => {
    if (confirmText.toLowerCase() !== "delete") {
      Toast.error('Please type "delete" to confirm deletion.');
      return;
    }
    deleteMutation.mutate(entityId, {
      onSuccess: () => {
        navigate(`/dashboard/${adminId}${basePath}`);
      },
    });
  };

  const isDeleteDisabled = confirmText.toLowerCase() !== "delete" || deleteMutation.isPending;

  return (
    <TabWrapper decorativeElements="default">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="group p-2 bg-gray-200 hover:bg-gray-300 rounded-full shadow-md flex items-center justify-center transition-all hover:scale-105"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-800" />
          </button>
          <h1 className="text-2xl font-bold text-blue-800 capitalize tracking-tight">
            Delete {entityDisplayName}
          </h1>
        </div>
        <button
          onClick={handleViewEntity}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-md hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all text-sm"
        >
          View {entityDisplayName}
        </button>
      </div>

      <DataStateHandler
        isLoading={isLoading}
        isError={isError}
        data={entity}
        loadingComponent={DataLoading}
        errorMessage={`Failed to load ${entityType}. Please try again.`}
        emptyMessage={`${entityDisplayName} not found.`}
      >
        {entity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            {/* Warning Section */}
            <div className="bg-gradient-to-br from-red-100 via-white to-red-50 border border-red-300 rounded-xl p-5 mb-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-red-200 to-red-100 rounded-full flex-shrink-0 shadow">
                  <FaExclamationTriangle className="text-red-600 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-red-800 mb-1 tracking-tight">
                    Delete {entityDisplayName}
                  </h1>
                  <p className="text-red-700 mb-3 text-sm">
                    Are you absolutely sure you want to delete this {entityType}?
                    <br className="hidden md:block" />
                    <span className="font-semibold">
                      This action cannot be undone.
                    </span>
                  </p>

                  <div className="bg-white border border-red-200 rounded-lg p-3 shadow-sm">
                    {renderEntityDetails(entity)}
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
                  to confirm that you want to permanently delete this {entityType}:
                </p>

                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type 'delete' to confirm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all"
                  autoComplete="off"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 rounded-xl font-semibold shadow-md hover:from-gray-400 hover:to-gray-500 hover:scale-105 hover:shadow-lg transition-all text-sm"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold shadow-lg transition-all transform text-sm ${
                    isDeleteDisabled
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed scale-100"
                      : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-lg"
                  } ${deleteMutation.isPending ? "animate-pulse" : ""}`}
                  disabled={isDeleteDisabled || deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <span className="inline-block w-5 h-5 mr-2 border-2 border-white border-t-red-500 rounded-full animate-spin"></span>
                  ) : (
                    <FaTrash className="w-5 h-5" />
                  )}
                  <span className="tracking-wide">
                    {deleteMutation.isPending ? "Deleting..." : `Delete ${entityDisplayName}`}
                  </span>
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
      </DataStateHandler>
    </TabWrapper>
  );
}