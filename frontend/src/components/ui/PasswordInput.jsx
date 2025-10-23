import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FormInput from "./FormInput";

/**
 * Password input component with show/hide toggle
 * @param {Object} props
 * @param {String} props.name - Input name
 * @param {String} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {String} props.placeholder - Input placeholder
 * @param {Boolean} props.hasError - Whether the input has an error
 * @param {Boolean} props.disabled - Whether the input is disabled
 * @param {String} props.className - Additional CSS classes
 */
export default function PasswordInput({
  name,
  value,
  onChange,
  placeholder = "Enter your password...",
  hasError = false,
  disabled = false,
  className = "",
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full">
      <FormInput
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        hasError={hasError}
        disabled={disabled}
        className={`pr-10 ${className}`}
        style={{ minHeight: "42px" }}
        {...rest}
      />
      
      {value && value.length > 0 && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          disabled={disabled}
        >
          {showPassword ? (
            <FaEyeSlash size={18} />
          ) : (
            <FaEye size={18} />
          )}
        </button>
      )}
    </div>
  );
}