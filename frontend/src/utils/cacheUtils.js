/**
 * Caching utilities for React Query optimization
 */

/**
 * Predefined cache configurations for different data types
 */
export const CACHE_CONFIGS = {
  // Static/rarely changing data
  STATIC: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },
  
  // Frequently changing data (like invoices, payments)
  DYNAMIC: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  },
  
  // Medium frequency data (like leases, properties)
  MEDIUM: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },
  
  // Real-time data (notifications, live updates)
  REALTIME: {
    staleTime: 0, // Always stale
    cacheTime: 1 * 60 * 1000, // 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // 30 seconds
  }
};

/**
 * Helper function to create optimized query keys
 * @param {string} entity - The main entity (e.g., 'leases', 'invoices')
 * @param {object} params - Additional parameters for the query
 * @returns {Array} - Optimized query key
 */
export function createQueryKey(entity, params = {}) {
  const baseKey = [entity];
  
  // Add parameters in a consistent order for better cache hits
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});
    
  if (Object.keys(sortedParams).length > 0) {
    baseKey.push(sortedParams);
  }
  
  return baseKey;
}

/**
 * Helper to invalidate related queries efficiently
 * @param {QueryClient} queryClient - React Query client
 * @param {string} entity - Entity to invalidate
 * @param {object} filters - Optional filters for specific invalidation
 */
export function invalidateEntityQueries(queryClient, entity, filters = {}) {
  queryClient.invalidateQueries({
    queryKey: [entity],
    exact: false,
    ...filters
  });
}

/**
 * Invalidate all overview dashboard statistics queries
 * Call this whenever data changes that affects the overview stats
 * @param {QueryClient} queryClient - React Query client
 */
export function invalidateOverviewQueries(queryClient) {
  // Invalidate all overview statistics
  const overviewQueries = [
    "monthlyRevenue",
    "totalPropertiesCount", 
    "monthlyPropertiesCount",
    "activeLeasesCount",
    "leasedPercentage", 
    "maintenanceCount",
    "highPriorityMaintenanceCount",
    "recentActivities"
  ];

  overviewQueries.forEach(queryKey => {
    queryClient.invalidateQueries({
      queryKey: [queryKey],
      exact: false
    });
  });
}