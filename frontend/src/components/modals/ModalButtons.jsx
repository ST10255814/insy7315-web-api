import { motion } from "framer-motion";

/**
 * Reusable modal button footer with responsive layout
 * Supports primary and secondary actions with loading states
 */
export default function ModalButtons({ 
  primaryAction,
  secondaryAction,
  isPending = false,
  disabled = false
}) {
  const buttonHoverTransition = { type: "spring", stiffness: 300, damping: 20 };

  return (
    <div className="border-t border-gray-200 px-3 py-3 flex-shrink-0 bg-gray-50/30">
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
        {/* Secondary Action (Cancel, etc.) */}
        {secondaryAction && (
          <motion.button
            type="button"
            onClick={secondaryAction.onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={buttonHoverTransition}
            className="w-full sm:w-auto px-4 py-2 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm transition-colors text-sm border border-gray-300"
          >
            {secondaryAction.label}
          </motion.button>
        )}

        {/* Primary Action (Submit, Save, etc.) */}
        <motion.button
          type={primaryAction.type || "submit"}
          disabled={isPending || disabled}
          onClick={primaryAction.onClick}
          whileHover={!isPending && !disabled ? { scale: 1.02 } : {}}
          whileTap={!isPending && !disabled ? { scale: 0.98 } : {}}
          transition={buttonHoverTransition}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl font-semibold text-white shadow-md flex items-center justify-center gap-2 text-sm transition-all ${
            isPending || disabled
              ? "bg-blue-400 cursor-not-allowed opacity-75" 
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
          }`}
        >
          {isPending ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Processing...</span>
            </>
          ) : (
            <>
              {primaryAction.icon && <primaryAction.icon className="w-4 h-4" />}
              {primaryAction.label}
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}