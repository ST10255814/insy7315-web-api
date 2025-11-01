/**
 * Generic state handler for loading, error, empty, and content states
 * Can be used for any type of data (properties, leases, invoices, users, etc.)
 * 
 * @param {Object} props
 * @param {boolean} props.isLoading - Whether data is currently loading
 * @param {boolean} props.isError - Whether an error occurred
 * @param {*} props.data - The data to check (can be object, array, or any value)
 * @param {React.ComponentType} [props.loadingComponent] - Custom loading component
 * @param {React.ReactNode} [props.loadingFallback] - Custom loading fallback JSX
 * @param {string} [props.errorMessage] - Custom error message
 * @param {React.ReactNode} [props.errorComponent] - Custom error component/JSX
 * @param {string} [props.emptyMessage] - Custom empty state message
 * @param {React.ReactNode} [props.emptyComponent] - Custom empty state component/JSX
 * @param {Function} [props.isEmpty] - Custom function to determine if data is empty
 * @param {React.ReactNode} props.children - Content to render when data is loaded
 */
export default function DataStateHandler({
  isLoading,
  isError,
  data,
  loadingComponent: LoadingComponent,
  loadingFallback,
  errorMessage = "Failed to load data. Please try again.",
  errorComponent,
  emptyMessage = "No data found.",
  emptyComponent,
  isEmpty,
  children,
}) {
  // Loading State
  if (isLoading) {
    if (LoadingComponent) {
      return <LoadingComponent />;
    }
    if (loadingFallback) {
      return loadingFallback;
    }
    // Default loading spinner
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  // Error State
  if (isError) {
    if (errorComponent) {
      return errorComponent;
    }
    return (
      <div className="text-red-600 font-semibold text-center mt-10 bg-red-50 p-6 rounded-lg border border-red-200">
        <svg
          className="w-12 h-12 mx-auto mb-3 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p>{errorMessage}</p>
      </div>
    );
  }

  // Empty State - Use custom isEmpty function or default logic
  const isDataEmpty = isEmpty
    ? isEmpty(data)
    : !data ||
      (Array.isArray(data) && data.length === 0) ||
      (typeof data === "object" && Object.keys(data).length === 0);

  if (isDataEmpty) {
    if (emptyComponent) {
      return emptyComponent;
    }
    return (
      <div className="text-gray-500 text-center mt-10 font-medium bg-gray-50 p-8 rounded-lg border border-gray-200">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  // Content State
  return children;
}
