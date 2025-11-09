import { motion } from "framer-motion";

/**
 * Reusable form button group component
 * Handles common button patterns: submit, reset, cancel with consistent styling
 */
export default function FormButtonGroup({
  submitText = "Submit",
  submitLoadingText = "Submitting...",
  isSubmitting = false,
  submitIcon,
  onReset,
  resetText = "Reset Form",
  onCancel,
  cancelText = "Cancel",
  showReset = false,
  showCancel = false,
  submitClassName = "",
  resetClassName = "",
  cancelClassName = "",
  disabled = false,
  errors = {},
  className = "space-y-4",
}) {
  const hasSubmitError = errors.submit;

  return (
    <div className={className}>
      {/* Submit Error Display */}
      {hasSubmitError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <p className="text-red-600 text-sm font-medium">{errors.submit}</p>
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-base font-bold focus:ring-2 focus:ring-blue-300 disabled:opacity-60 disabled:cursor-not-allowed ${submitClassName}`}
        disabled={isSubmitting || disabled}
      >
        {submitIcon && !isSubmitting && submitIcon}
        <span className="tracking-wide">
          {isSubmitting ? submitLoadingText : submitText}
        </span>
      </button>

      {/* Reset Button */}
      {showReset && onReset && (
        <button
          type="button"
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full border border-gray-300 shadow-sm hover:bg-gray-200 transition-all duration-200 text-base font-bold focus:ring-2 focus:ring-gray-300 disabled:opacity-60 ${resetClassName}`}
          onClick={onReset}
          disabled={isSubmitting || disabled}
        >
          <span className="tracking-wide">{resetText}</span>
        </button>
      )}

      {/* Cancel Button */}
      {showCancel && onCancel && (
        <button
          type="button"
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-full border border-red-300 shadow-sm hover:bg-red-200 transition-all duration-200 text-base font-bold focus:ring-2 focus:ring-red-300 disabled:opacity-60 ${cancelClassName}`}
          onClick={onCancel}
          disabled={isSubmitting || disabled}
        >
          <span className="tracking-wide">{cancelText}</span>
        </button>
      )}
    </div>
  );
}