import { FaArrowLeft } from "react-icons/fa";

/**
 * Generic form layout component that eliminates duplication across Add/Edit forms
 * Provides consistent structure, navigation, and layout patterns
 */
export default function FormLayout({
  title,
  subtitle,
  backButtonText = "Back",
  backButtonAction,
  decorativeElements = "default",
  maxWidth = "max-w-6xl",
  children,
  formProps = {},
  className = "",
}) {
  return (
    <div className={`${maxWidth} mx-auto ${className}`}>
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
          onClick={backButtonAction}
        >
          <FaArrowLeft /> {backButtonText}
        </button>
        <div>
          <h1 className="text-2xl font-bold text-blue-700">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>

      {/* Form Content */}
      <form {...formProps} className="space-y-8">
        {children}
      </form>
    </div>
  );
}