/**
 * Reusable form field component with consistent styling and error handling
 * Supports various input types and responsive design
 */
export default function ModalFormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  disabled = false,
  required = false,
  children, // For select options or custom content
  className = "",
  inputClassName = "",
  ...props
}) {
  const baseInputClass = `
    w-full px-3 sm:px-4 py-2.5 sm:py-3 
    border rounded-xl shadow-sm 
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition-all duration-200 outline-none 
    text-sm sm:text-base
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-gray-300'}
    ${inputClassName}
  `;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={baseInputClass}
          {...props}
        >
          {children}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className={`${baseInputClass} resize-none`}
          {...props}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={baseInputClass}
          {...props}
        />
      )}
      
      {error && (
        <p className="text-red-500 text-xs sm:text-sm font-medium flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
}