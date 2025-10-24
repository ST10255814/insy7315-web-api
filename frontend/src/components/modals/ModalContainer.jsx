import { motion, AnimatePresence } from "framer-motion";

/**
 * Reusable modal container with proper positioning and responsive sizing
 * Ensures modals don't go under navbar and are properly centered
 */
export default function ModalContainer({ 
  show, 
  onClose, 
  children, 
  size = "md", // "sm", "md", "lg", "xl"
  maxHeight = "mobile-safe" // "mobile-safe", "viewport", "custom"
}) {
  
  // Size configurations
  const sizeClasses = {
    sm: "max-w-sm sm:max-w-md",
    md: "max-w-sm sm:max-w-md lg:max-w-lg",
    lg: "max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl",
    xl: "max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl"
  };

  // Height configurations - mobile-safe ensures no overlap with navbar
  const heightClasses = {
    "mobile-safe": "max-h-[75vh] sm:max-h-[80vh] lg:max-h-[85vh]", // Safer for mobile
    "viewport": "max-h-[90vh] sm:max-h-[85vh] lg:max-h-[80vh]", // Original heights
    "compact": "max-h-[50vh] sm:max-h-[55vh] lg:max-h-[60vh]", // Very compact
    "custom": "" // Let parent define
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[9999] bg-gray-900/30 backdrop-blur-md overflow-auto"
        >
          <div className="min-h-full flex items-center justify-center p-4">
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -20, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, type: "spring", stiffness: 300 }}
              className={`
                bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full
                ${sizeClasses[size]} 
                ${heightClasses[maxHeight]}
                relative flex flex-col border border-gray-200 overflow-hidden
              `}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}