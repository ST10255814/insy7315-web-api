/**
 * Generic form section component that provides consistent styling for form cards
 * Eliminates duplication of section layouts across different forms
 */
export default function FormSection({
  title,
  subtitle,
  stepNumber,
  children,
  className = "",
  cardClassName = "",
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-white/20 p-6 ${cardClassName}`}>
      {title && (
        <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
          {stepNumber && (
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-2">
              {stepNumber}
            </span>
          )}
          {title}
        </h2>
      )}
      {subtitle && <p className="text-gray-600 mb-4">{subtitle}</p>}
      <div className={className}>
        {children}
      </div>
    </div>
  );
}