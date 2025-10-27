import LoadingSkeleton from "./LoadingSkeleton.jsx";

/**
 * Reusable state handler for loading, error, and empty states in tab components
 */
export default function StateHandler({ 
  isLoading, 
  isError, 
  data, 
  loadingComponent: LoadingComponent = null,
  errorMessage = "Failed to load data. Please try again.",
  emptyMessage = "No data found.",
  children,
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", // Default grid configuration
  loadingCount = 8 // Number of loading skeletons to show
}) {
  // Loading State
  if (isLoading) {
    if (LoadingComponent) {
      return <LoadingComponent />;
    }
    return (
      <div className={`grid ${gridCols} gap-6`}>
        {[...Array(loadingCount)].map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="text-red-600 font-semibold text-center mt-10">
        {errorMessage}
      </div>
    );
  }

  // Empty State
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="text-gray-500 text-center mt-10 font-medium">
        {emptyMessage}
      </div>
    );
  }

  // Content State
  return children;
}