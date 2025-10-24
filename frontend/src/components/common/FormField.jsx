import { motion, AnimatePresence } from "framer-motion";

/**
 * Reusable form field wrapper component
 * @param {Object} props
 * @param {String} props.label - Field label
 * @param {String} props.error - Error message
 * @param {React.ReactNode} props.children - Input component
 * @param {String} props.className - Additional CSS classes
 */
export default function FormField({ label, error, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="block text-blue-700 font-semibold mb-1 text-sm">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-[#FF3B30] text-xs sm:text-sm mt-1 font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}