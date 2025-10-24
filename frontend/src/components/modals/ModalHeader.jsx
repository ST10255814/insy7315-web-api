import { FaTimes } from "react-icons/fa";

/**
 * Reusable modal header with title, description, and close button
 * Consistent styling and responsive design
 */
export default function ModalHeader({ 
  title, 
  description, 
  onClose, 
  icon: Icon,
  statusBadge // For lease status, etc.
}) {
  return (
    <div className="flex justify-between items-start p-3 pb-2 border-b border-gray-200 flex-shrink-0 bg-gray-50/50">
      <div className="flex-1 pr-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-4 h-4 text-blue-600" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-blue-800 leading-tight">
              {title}
            </h3>
            {description && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                {description}
              </p>
            )}
            {statusBadge && (
              <div className="mt-2">
                {statusBadge}
              </div>
            )}
          </div>
        </div>
      </div>
      <button 
        onClick={onClose} 
        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full flex-shrink-0 group"
        aria-label="Close modal"
      >
        <FaTimes size={16} className="group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}