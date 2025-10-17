import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

/**
 * Reusable modal wrapper component
 * 
 * @param {Object} props
 * @param {boolean} props.show - Whether the modal is visible
 * @param {Function} props.onClose - Function to call when modal should close
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {boolean} props.isPending - Whether an operation is in progress
 * @param {string} props.size - Modal size ('sm', 'md', 'lg', 'xl')
 * @param {boolean} props.closeOnBackdrop - Whether clicking backdrop closes modal
 */
export default function Modal({ 
  show, 
  onClose, 
  title, 
  children, 
  isPending = false,
  size = "md",
  closeOnBackdrop = true
}) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg", 
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop && !isPending) {
      onClose();
    }
  };

  const handleClose = () => {
    if (!isPending) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`bg-white rounded-3xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-blue-800">{title}</h3>
                <button 
                  onClick={handleClose} 
                  disabled={isPending}
                  className={`text-gray-500 hover:text-gray-700 p-1 rounded-full transition-colors ${
                    isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                  }`}
                >
                  <FaTimes size={18} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className={title ? "p-6" : "p-6"}>
              {children}
            </div>

            {/* Loading overlay */}
            {isPending && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-3xl">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600 font-medium">Processing...</span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Modal footer component for consistent button layouts
 */
export function ModalFooter({ children, className = "" }) {
  return (
    <div className={`flex justify-end space-x-4 pt-4 border-t border-gray-100 mt-6 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Modal button component with consistent styling
 */
export function ModalButton({ 
  children, 
  variant = "primary", 
  disabled = false, 
  onClick, 
  type = "button",
  className = ""
}) {
  const baseClasses = "px-6 py-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300"
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
    >
      {children}
    </motion.button>
  );
}