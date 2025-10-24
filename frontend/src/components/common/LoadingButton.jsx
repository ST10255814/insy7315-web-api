import { motion } from "framer-motion";

/**
 * Loading button component with animations
 * @param {Object} props
 * @param {Boolean} props.isLoading - Whether the button is in loading state
 * @param {String} props.loadingText - Text to show when loading
 * @param {String} props.children - Button text when not loading
 * @param {Function} props.onClick - Click handler
 * @param {String} props.type - Button type
 * @param {Boolean} props.disabled - Whether the button is disabled
 * @param {String} props.className - Additional CSS classes
 */
export default function LoadingButton({
  isLoading = false,
  loadingText = "Loading",
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  ...rest
}) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileHover={
        !isDisabled
          ? { scale: 1.03, backgroundColor: "#1E40AF" }
          : {}
      }
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      transition={{ duration: 0.1, ease: "easeInOut" }}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`font-semibold py-2.5 rounded-xl shadow-md transition-colors duration-150 text-white text-sm ${
        isDisabled
          ? "bg-blue-800/70 cursor-not-allowed"
          : "bg-blue-700"
      } ${className}`}
      {...rest}
    >
      {isLoading ? loadingText : children}
      {isLoading && (
        <span className="inline-flex ml-1">
          {[".", ".", "."].map((dot, index) => (
            <motion.span
              key={index}
              className="mx-[2px]"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.15,
              }}
            >
              {dot}
            </motion.span>
          ))}
        </span>
      )}
    </motion.button>
  );
}