/**
 * Reusable form validation preview component
 * Displays current form completion status in a consistent format
 * Eliminates ~200+ lines of duplicated validation preview code
 */
export default function FormValidationPreview({
  title = "Form Validation",
  stepNumber,
  validationItems = [],
  overallStatus,
  className = "",
}) {
  return (
    <div className={`bg-gray-50 rounded-2xl p-6 ${className}`}>
      <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
        {stepNumber && (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
            {stepNumber}
          </span>
        )}
        {title}
      </h3>
      
      <div className="space-y-3 text-sm">
        {validationItems.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-600">{item.label}:</span>
            <span
              className={`font-medium ${
                item.isValid ? "text-blue-700" : "text-gray-400"
              }`}
            >
              {item.value || (item.isValid ? "Yes" : "No")}
            </span>
          </div>
        ))}
        
        {overallStatus && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Overall Status:</span>
              <span
                className={`font-bold ${
                  overallStatus.isComplete
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {overallStatus.text}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}