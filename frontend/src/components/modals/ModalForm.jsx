/**
 * Reusable modal form wrapper with proper scrolling and responsive layout
 * Handles form submission and provides consistent spacing
 */
export default function ModalForm({ 
  children, 
  onSubmit, 
  className = "",
  scrollable = true 
}) {
  const scrollClass = scrollable 
    ? "flex-1 overflow-y-auto min-h-0" 
    : "flex-shrink-0";

  return (
    <div className={`${scrollClass} px-3 sm:px-4 py-2 sm:py-3`}>
      <form 
        onSubmit={onSubmit} 
        className={`flex flex-col gap-4 sm:gap-5 ${className}`}
      >
        {children}
      </form>
    </div>
  );
}