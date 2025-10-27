import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 2 * 60 * 1000, // 2 minutes - reduced for better invalidation
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime in v5)
      refetchOnMount: 'always', // Always refetch on mount to ensure fresh data after invalidation
      refetchOnReconnect: true, // Refetch when network reconnects
    },
    mutations: {
      retry: 1, // Reduce mutation retries
    },
  },
});

export default queryClient;