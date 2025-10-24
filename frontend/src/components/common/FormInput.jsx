import { motion } from "framer-motion";

/**
 * Reusable form input component
 * @param {Object} props
 * @param {String} props.type - Input type
 * @param {String} props.name - Input name
 * @param {String} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {String} props.placeholder - Input placeholder
 * @param {Boolean} props.hasError - Whether the input has an error
 * @param {Boolean} props.disabled - Whether the input is disabled
 * @param {String} props.className - Additional CSS classes
 */
export default function FormInput({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  hasError = false,
  disabled = false,
  className = "",
  ...rest
}) {
  return (
    <motion.input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-2.5 border rounded-xl outline-none shadow-sm transition text-sm ${
        hasError
          ? "border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]"
          : "border-gray-300 focus:ring-2 focus:ring-blue-700"
      } ${className}`}
      {...rest}
    />
  );
}