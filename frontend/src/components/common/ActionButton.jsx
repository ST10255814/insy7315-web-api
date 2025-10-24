import { motion } from "framer-motion";

/**
 * Reusable animated action button with consistent hover effects
 */
export default function ActionButton({
  onClick,
  children,
  icon: Icon,
  variant = "primary", // "primary", "secondary", "danger"
  disabled = false,
  className = "",
  size = "medium" // "small", "medium", "large"
}) {
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
  };

  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3",
    large: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        scale: 1.07,
        boxShadow: "0 8px 25px rgba(59,130,246,0.45)",
      }}
      whileTap={{ scale: 0.96 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 18,
        mass: 0.8,
      }}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2 
        ${sizes[size]}
        ${variants[variant]}
        rounded-xl font-semibold 
        transition-all duration-300 shadow-md
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {Icon && <Icon className="text-sm" />}
      {children}
    </motion.button>
  );
}