/**
 * React Query hooks and mutations for the RentWise application
 * 
 * OVERVIEW INVALIDATION STRATEGY:
 * =============================
 * When data changes that affects the overview dashboard statistics, we automatically
 * invalidate the relevant overview queries so they refetch with updated data.
 * 
 * The following mutations automatically update overview statistics:
 * - Creating/updating/deleting properties → affects property counts
 * - Creating/updating/deleting leases → affects lease counts and occupancy percentage  
 * - Creating/updating invoices → affects revenue data
 * - Creating/updating maintenance requests → affects maintenance counts
 * - Any action that creates activity → affects recent activities
 * 
 * Use the invalidateOverviewQueries() utility in any mutation that should
 * trigger overview data updates.
 */

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Toast from "../lib/toast.js";
import { getLeasesByAdminId, createLeaseForBookingID, countActiveLeasesByAdminId, getLeasedPropertyPercentage } from "./leases.api.js";
import { getInvoicesByAdminId, createInvoice } from "./invoice.api.js";
import { getListingsByAdminId, createListing, countNumberOfListingsByAdminId, countListingsAddedThisMonth } from "./listings.api.js";
import { getMaintenanceRequestsByAdminId, countMaintenanceRequestsByAdminId, countHighPriorityMaintenanceRequestsByAdminId } from "./maintenance.api.js";
import { getBookingsByAdminId, getCurrentMonthRevenue } from "./bookings.api.js";
import { getRecentActivities } from "./activity.api.js";
import { useQueryClient } from "@tanstack/react-query";
import queryClient from "../lib/queryClient.js";
import { CACHE_CONFIGS, createQueryKey, invalidateEntityQueries, invalidateOverviewQueries } from "./cacheUtils.js";
import { getRevenueTrend } from "./revenue.api.js";

// https://youtu.be/r8Dg0KVnfMA?si=Ibl3mRWKy_tofYyf
export const useLeasesQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("leases", { adminId }),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return getLeasesByAdminId();
    },
    enabled: !!adminId,
    ...CACHE_CONFIGS.MEDIUM, // Use medium frequency caching config
  }, queryClient);
};

export const useCreateLeaseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingID) => {
      await new Promise((r) => setTimeout(r, 2000)); 
      return createLeaseForBookingID(bookingID);
    },
    onSuccess: (response) => {
      console.log(response)
      const leaseID = response?.leaseId || response;
      Toast.success(
        `Lease created successfully: Lease ID: ${leaseID}`
      );
      // Use efficient invalidation utility
      invalidateEntityQueries(queryClient, "leases");
      // Invalidate overview queries since lease count and occupancy changed
      invalidateOverviewQueries(queryClient);
    },
    onError: (error) => {
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) return;
      
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create lease";
      Toast.error(msg);
    },
  });
};

// Invoices Queries and Mutations
export const useInvoicesQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("invoices", { adminId }),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return getInvoicesByAdminId();
    },
    enabled: !!adminId,
    ...CACHE_CONFIGS.DYNAMIC, // Invoices change more frequently
  }, queryClient);
};

export const useCreateInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoiceData) => {
      await new Promise((r) => setTimeout(r, 2000));
      return createInvoice(invoiceData);
    },
    onSuccess: (response) => {
      const invoiceID = response?.invoiceId || response;
      Toast.success(`Invoice created successfully: Invoice ID: ${invoiceID}`);
      // Use efficient invalidation utility
      invalidateEntityQueries(queryClient, "invoices");
      // Invalidate overview queries since revenue data may have changed
      invalidateOverviewQueries(queryClient);
    },
    onError: (error) => {
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) return;
      
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create invoice";
      Toast.error(msg);
    },
  });
};

// Listing Queries and Mutations
export const useListingsQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("listings", { adminId }),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return getListingsByAdminId();
    },
    enabled: !!adminId,
    ...CACHE_CONFIGS.MEDIUM,
  }, queryClient);
}

export const useCreateListingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingData) => {
      await new Promise((r) => setTimeout(r, 2000));
      return createListing(listingData);
    },
    onSuccess: (response) => {
      const listingID = response?.listingId || response;
      Toast.success(`Property created successfully!${listingID ? ` Listing ID: ${listingID}` : ''}`);
      invalidateEntityQueries(queryClient, "listings");
      // Invalidate overview queries since property counts have changed
      invalidateOverviewQueries(queryClient);
    },
    onError: (error) => {
      console.error('Create listing mutation error:', error);
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) return;
      
      const msg =
        error?.response?.data?.error ||
        error?.error ||
        error?.message ||
        "Failed to create property";
      Toast.error(msg);
    },
  });
};

// Bookings queries and mutations
export const useBookingsQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("bookings", { adminId }),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return getBookingsByAdminId();
    },
    enabled: !!adminId,
    ...CACHE_CONFIGS.MEDIUM,
  }, queryClient);
}

// Maintenance queries and mutations
export const useMaintenanceRequestsQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("maintenanceRequests", { adminId }),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return getMaintenanceRequestsByAdminId();
    },
    enabled: !!adminId,
    ...CACHE_CONFIGS.MEDIUM,
  }, queryClient);
}

// Overview-specific queries for dashboard statistics
export const useMonthlyRevenueQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("monthlyRevenue", { adminId }),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return getCurrentMonthRevenue();
    },
    ...CACHE_CONFIGS.DYNAMIC,
  }, queryClient);
};

export const useTotalPropertiesCountQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("totalPropertiesCount", { adminId }),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return countNumberOfListingsByAdminId();
    },
    ...CACHE_CONFIGS.MEDIUM,
  }, queryClient);
};

export const useMonthlyPropertiesCountQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("monthlyPropertiesCount", { adminId }),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return countListingsAddedThisMonth();
    },
    ...CACHE_CONFIGS.MEDIUM,
  }, queryClient);
};

export const useActiveLeasesCountQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("activeLeasesCount", { adminId }),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return countActiveLeasesByAdminId();
    },
    ...CACHE_CONFIGS.MEDIUM,
  }, queryClient);
};

export const useLeasedPercentageQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("leasedPercentage", { adminId }),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return getLeasedPropertyPercentage();
    },
    ...CACHE_CONFIGS.MEDIUM,
  }, queryClient);
};

export const useMaintenanceCountQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("maintenanceCount", { adminId }),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return countMaintenanceRequestsByAdminId();
    },
    ...CACHE_CONFIGS.MEDIUM,
  }, queryClient);
};

export const useHighPriorityMaintenanceCountQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("highPriorityMaintenanceCount", { adminId }),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return countHighPriorityMaintenanceRequestsByAdminId();
    },
    ...CACHE_CONFIGS.MEDIUM,
  }, queryClient);
};

export const useRecentActivitiesQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("recentActivities", { adminId }),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return getRecentActivities(adminId);
    },
    ...CACHE_CONFIGS.DYNAMIC,
  }, queryClient);
};

// Utility function to manually invalidate overview data
// Use this in components when you know overview data has changed
export const useInvalidateOverview = () => {
  const queryClient = useQueryClient();
  
  return React.useCallback(() => {
    invalidateOverviewQueries(queryClient);
  }, [queryClient]);
};

// Revenue trend query
export const useRevenueTrendQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("revenueTrend", { adminId }),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return getRevenueTrend();
    },
    ...CACHE_CONFIGS.DYNAMIC,
  }, queryClient);
};
