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
  const [isConfirming, setIsConfirming] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewEntity = () => {
    navigate(`/dashboard/${adminId}${basePath}/view/${entityId}`);
  };

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== "delete") {
      Toast.error('Please type "delete" to confirm deletion.');
      return;
    }

    setIsConfirming(true);
    
    try {
      await deleteMutation.mutateAsync(entityId);
      Toast.success(`${entityDisplayName} deleted successfully.`);
      navigate(`/dashboard/${adminId}${basePath}`);
    } catch (error) {
      Toast.error(error?.message || `Failed to delete ${entityType}. Please try again.`);
    } finally {
      setIsConfirming(false);
    }
  };

  const isDeleteDisabled = confirmText.toLowerCase() !== "delete" || deleteMutation.isPending || isConfirming;

  return (
    <TabWrapper decorativeElements="default">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="group p-2 bg-blue-200 hover:bg-blue-300 rounded-full shadow-md flex items-center justify-center transition-all hover:scale-105"
          >
            <FaArrowLeft className="w-5 h-5 text-blue-700 group-hover:text-blue-800" />
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
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Warning Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-gradient-to-br from-red-100 via-white to-red-50 border border-red-300 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="p-3 bg-gradient-to-br from-red-200 to-red-100 rounded-full flex-shrink-0 shadow-md"
                >
                  <FaExclamationTriangle className="text-red-600 w-6 h-6" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-red-800 mb-2 tracking-tight">
                    Permanent Deletion Warning
                  </h2>
                  <p className="text-red-700 mb-4 text-sm leading-relaxed">
                    You are about to permanently delete this {entityType}. This action is{" "}
                    <span className="font-bold text-red-800">irreversible</span> and will remove
                    all associated data.
                    <br className="hidden sm:block" />
                    <span className="font-semibold">
                      Please review the details carefully before proceeding.
                    </span>
                  </p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="bg-white border border-red-200 rounded-lg p-4 shadow-sm"
                  >
                    {renderEntityDetails(entity)}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Confirmation Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-full">
                  <FaTrash className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Confirm Deletion
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="confirm-input" className="block text-gray-700 mb-3 text-sm">
                    To confirm deletion, please type{" "}
                    <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                      "delete"
                    </span>{" "}
                    in the field below:
                  </label>

                  <input
                    id="confirm-input"
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type 'delete' to confirm"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                      confirmText
                        ? confirmText.toLowerCase() === "delete"
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50"
                          : "border-yellow-400 focus:ring-yellow-400 focus:border-yellow-400 bg-yellow-50"
                        : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                    }`}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                {/* Real-time feedback */}
                {confirmText && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 rounded-lg text-sm ${
                      confirmText.toLowerCase() === "delete"
                        ? "bg-red-50 border border-red-200 text-red-800"
                        : "bg-yellow-50 border border-yellow-200 text-yellow-800"
                    }`}
                  >
                    {confirmText.toLowerCase() === "delete" ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-medium">Deletion confirmed. You can now proceed.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Please type "delete" exactly as shown to enable deletion.</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold shadow-md hover:from-gray-200 hover:to-gray-300 hover:scale-105 transition-all text-sm"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Cancel & Go Back
                </button>

                <button
                  onClick={handleDelete}
                  className={`flex items-center justify-center gap-3 px-8 py-3 rounded-xl font-bold shadow-lg transition-all text-sm ${
                    isDeleteDisabled
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-xl"
                  }`}
                  disabled={isDeleteDisabled}
                >
                  {deleteMutation.isPending || isConfirming ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-red-500 rounded-full"
                      />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <FaTrash className="w-5 h-5" />
                      <span>Delete {entityDisplayName}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </DataStateHandler>
    </TabWrapper>
  );
}