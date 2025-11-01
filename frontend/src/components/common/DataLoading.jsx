import { motion } from "framer-motion";

/**
 * Generic loading spinner component with customizable text and colors
 * Can be used for any type of data loading across the application
 * 
 * @param {Object} props
 * @param {string} [props.message] - Custom loading message to display
 * @param {string} [props.size] - Size of spinner: 'sm', 'md', 'lg', 'xl'
 * @param {string} [props.color] - Color variant: 'blue', 'green', 'purple', 'red', 'gray'
 * @param {boolean} [props.showText] - Whether to show loading text
 * @param {string} [props.className] - Additional CSS classes
 */
export default function DataLoading({
  message = "Loading...",
  size = "md",
  color = "blue",
  showText = true,
  className = ""
}) {
  // Size configurations
  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    md: "w-16 h-16 border-4",
    lg: "w-24 h-24 border-4",
    xl: "w-32 h-32 border-6"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl"
  };

  // Color configurations
  const colorClasses = {
    blue: {
      border: "border-blue-300 border-t-blue-600",
      text: "text-blue-600",
      borderTopColor: "#2563eb"
    },
    green: {
      border: "border-green-300 border-t-green-600",
      text: "text-green-600",
      borderTopColor: "#16a34a"
    },
    purple: {
      border: "border-purple-300 border-t-purple-600",
      text: "text-purple-600",
      borderTopColor: "#9333ea"
    },
    red: {
      border: "border-red-300 border-t-red-600",
      text: "text-red-600",
      borderTopColor: "#dc2626"
    },
    gray: {
      border: "border-gray-300 border-t-gray-600",
      text: "text-gray-600",
      borderTopColor: "#4b5563"
    }
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;
  const selectedTextSize = textSizeClasses[size] || textSizeClasses.md;
  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center py-16 ${className}`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className={`${selectedSize} ${selectedColor.border} rounded-full mb-4`}
        style={{ borderTopColor: selectedColor.borderTopColor }}
      />
      {showText && (
        <span className={`${selectedColor.text} font-semibold ${selectedTextSize}`}>
          {message}
        </span>
      )}
    </motion.div>
  );
}
