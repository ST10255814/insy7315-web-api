import PropertyLoadingSkeleton from "../feature/properties/PropertyLoadingSkeleton.jsx";

/**
 * State handler for single property loading, error, empty, and content states
 */
export default function PropertyStateHandler({
  isLoading,
  isError,
  property,
  loadingComponent: LoadingComponent = PropertyLoadingSkeleton,
  errorMessage = "Failed to load property. Please try again.",
  emptyMessage = "Property not found.",
  children,
  loadingSkeletonCount = 1 // Only one skeleton for single property
}) {
  // Loading State
  if (isLoading) {
    return <LoadingComponent />;
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
  if (!property || Object.keys(property).length === 0) {
    return (
      <div className="text-gray-500 text-center mt-10 font-medium">
        {emptyMessage}
      </div>
    );
  }

  // Content State
  return children;
}
