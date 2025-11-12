import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import Toast from "../lib/toast.js";
import {
  getLeasesByAdminId,
  createLeaseForBookingID,
  deleteLeaseById,
  countActiveLeasesByAdminId,
  getLeasedPropertyPercentage,
  getLeaseById,
} from "../services/leases.api.js";
import {
  getInvoicesByAdminId,
  createInvoice,
  getInvoiceById,
  deleteInvoice,
  getInvoiceByIdForPreview,
  markInvoiceAsPaid,
} from "../services/invoice.api.js";
import {
  getListingsByAdminId,
  getListingById,
  createListing,
  deleteListingById,
  countNumberOfListingsByAdminId,
  countListingsAddedThisMonth,
  returnPropertiesByStatus,
  updateListingInfo,
} from "../services/listings.api.js";
import {
  getMaintenanceRequestsByAdminId,
  countMaintenanceRequestsByAdminId,
  countHighPriorityMaintenanceRequestsByAdminId,
  updateMaintenanceRequest,
  markRequestAsCompleted,
} from "../services/maintenance.api.js";
import {
  getBookingsByAdminId,
  getBookingById,
  deleteBookingById,
  getCurrentMonthRevenue,
} from "../services/bookings.api.js";
import { getAdminPropertiesReviews } from "../services/review.api.js";
import {
  getCaretakersByAdminId,
  createCaretaker,
  assignCaretakerToRequest,
  deleteCaretaker,
  getCaretakerById,
} from "../services/caretakers.api.js";
import { getRecentActivities } from "../services/activity.api.js";
import {
  CACHE_CONFIGS,
  createQueryKey,
  invalidateEntityQueries,
  invalidateOverviewQueries,
} from "./cacheUtils.js";
import { getRevenueTrend } from "../services/revenue.api.js";

// https://youtu.be/r8Dg0KVnfMA?si=Ibl3mRWKy_tofYyf

// Leases Queries and Mutations
export const useLeasesQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("leases", { adminId }),
    queryFn: async () => {
      return getLeasesByAdminId();
    },
    enabled: !!adminId,
    ...CACHE_CONFIGS.MEDIUM, // Use medium frequency caching config
  });
};

// Lease By ID Query
export const useLeaseByIdQuery = (adminId, leaseId) => {
  return useQuery({
    queryKey: createQueryKey("lease", { adminId, leaseId }),
    queryFn: async () => {
      return getLeaseById(leaseId);
    },
    enabled: !!leaseId,
    ...CACHE_CONFIGS.MEDIUM,
  });
};

// Delete Booking Mutation
export const useCreateLeaseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingID) => {
      return createLeaseForBookingID(bookingID);
    },
    onSuccess: (response) => {
      console.log(response);
      const leaseID = response?.leaseId || response;
      Toast.success(`Lease created successfully: Lease ID: ${leaseID}`);
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

// Delete Lease Mutation
export const useDeleteLeaseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (leaseId) => {
      return deleteLeaseById(leaseId);
    },
    onSuccess: (response) => {
      const leaseID = response?.leaseId || response;
      Toast.success(`Lease deleted successfully: Lease ID: ${leaseID}`);
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
        "Failed to delete lease";
      Toast.error(msg);
    },
  });
};

// Invoices Queries and Mutations
export const useInvoicesQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("invoices", { adminId }),
    queryFn: async () => {
      return getInvoicesByAdminId();
    },
    enabled: !!adminId,
    ...CACHE_CONFIGS.DYNAMIC, // Invoices change more frequently
  });
};

// Delete Booking Mutation
export const useCreateInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoiceData) => {
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

// Get Invoice by ID Query
export const useInvoiceByIdQuery = (adminId, invoiceId) => {
  return useQuery({
    queryKey: createQueryKey("invoice", { adminId, invoiceId }),
    queryFn: async () => {
      return getInvoiceById(invoiceId);
    },
    enabled: !!invoiceId,
    ...CACHE_CONFIGS.MEDIUM,
  });
};

// Get Invoice Data by ID Query
export const useInvoiceDataByIdQuery = (adminId, invoiceId) => {
  return useQuery({
    queryKey: createQueryKey("invoiceData", { adminId, invoiceId }),
    queryFn: async () => {
      return getInvoiceByIdForPreview(invoiceId);
    },
    enabled: !!invoiceId,
    ...CACHE_CONFIGS.MEDIUM,
  });
};

// Delete Invoice Mutation
export const useDeleteInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoiceId) => {
      return deleteInvoice(invoiceId);
    },
    onSuccess: (response) => {
      const invoiceID = response?.invoiceId || response;
      Toast.success(`Invoice deleted successfully: Invoice ID: ${invoiceID}`);
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
        "Failed to delete invoice";
      Toast.error(msg);
    },
  });
};

// Mark Invoice as Paid Mutation
export const useMarkInvoiceAsPaidMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoiceId) => {
      return markInvoiceAsPaid(invoiceId);
    },
    onSuccess: (response) => {
      const invoiceID = response?.invoiceId || response;
      // Use efficient invalidation utility
      invalidateEntityQueries(queryClient, "invoices");
      invalidateEntityQueries(queryClient, "invoice", invoiceID);
      // Invalidate overview queries since revenue data may have changed
      invalidateOverviewQueries(queryClient);
    },
    onError: (error) => {
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) return;
    },
  });
};

// Listing Queries and Mutations
export const useListingsQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("listings", { adminId }),
    queryFn: async () => {
      return getListingsByAdminId();
    },
    enabled: !!adminId,
    ...CACHE_CONFIGS.MEDIUM,
  });
};

// Listing By ID Query
export const useListingByIdQuery = (adminId, listingId) => {
  return useQuery({
    queryKey: createQueryKey("listing", { adminId, listingId }),
    queryFn: async () => {
      return getListingById(listingId);
    },
    enabled: !!listingId,
    ...CACHE_CONFIGS.MEDIUM,
  });
};

// Delete Listing Mutation
export const useDeleteListingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId) => {
      return deleteListingById(listingId);
    },
    onSuccess: (response) => {
      const listingID = response?.listingId || response;
      Toast.success(
        `Property deleted successfully!${
          listingID ? ` Listing ID: ${listingID}` : ""
        }`
      );
      invalidateEntityQueries(queryClient, "listings");
      // Invalidate overview queries since property counts have changed
      invalidateOverviewQueries(queryClient);
    },
    onError: (error) => {
      console.error("Delete listing mutation error:", error);
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) return;
      const msg =
        error?.response?.data?.error ||
        error?.error ||
        error?.message ||
        "Failed to delete property";
      Toast.error(msg);
    },
  });
};

// Update Listing Mutation
export const useUpdateListingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, formData }) => {
      return updateListingInfo(listingId, formData);
    },
    onSuccess: (response) => {
      const listingID = response?.listingId || response;
      console.log("Update listing response:", response);
      Toast.success(
        `Property updated successfully!${
          listingID ? ` Listing ID: ${listingID}` : ""
        }`
      );
      invalidateEntityQueries(queryClient, "listings");
      invalidateEntityQueries(queryClient, "listing", listingID);
      // Invalidate overview queries since property counts have changed
      invalidateOverviewQueries(queryClient);
    },
    onError: (error) => {
      console.error("Update listing mutation error:", error);
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) return;

      const msg =
        error?.response?.data?.error ||
        error?.error ||
        error?.message ||
        "Failed to update property";
      Toast.error(msg);
    },
  });
};

// Create Listing Mutation
export const useCreateListingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingData) => {
      return createListing(listingData);
    },
    onSuccess: (response) => {
      const listingID = response?.listingId || response;
      Toast.success(
        `Property created successfully!${
          listingID ? ` Listing ID: ${listingID}` : ""
        }`
      );
      invalidateEntityQueries(queryClient, "listings");
      // Invalidate overview queries since property counts have changed
      invalidateOverviewQueries(queryClient);
    },
    onError: (error) => {
      console.error("Create listing mutation error:", error);
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
      return getBookingsByAdminId();
    },
    enabled: !!adminId,
    ...CACHE_CONFIGS.MEDIUM,
  });
};

// Booking By ID Query
export const useBookingByIdQuery = (adminId, bookingId) => {
  return useQuery({
    queryKey: createQueryKey("booking", { adminId, bookingId }),
    queryFn: async () => {
      return getBookingById(bookingId);
    },
    enabled: !!bookingId,
    ...CACHE_CONFIGS.MEDIUM,
  });
};

// Delete Booking Mutation
export const useDeleteBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId) => {
      return deleteBookingById(bookingId);
    },
    onSuccess: (response) => {
      const bookingID = response?.bookingId || response;
      Toast.success(
        `Booking deleted successfully!${
          bookingID ? ` Booking ID: ${bookingID}` : ""
        }`
      );
      invalidateEntityQueries(queryClient, "bookings");
      // Invalidate overview queries since booking counts have changed
      invalidateOverviewQueries(queryClient);
    },
    onError: (error) => {
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) return;
      const msg =
        error?.response?.data?.error ||
        error?.error ||
        error?.message ||
        "Failed to delete booking";
      Toast.error(msg);
    },
  });
};

// Maintenance queries and mutations
export const useMaintenanceRequestsQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("maintenanceRequests", { adminId }),
    queryFn: async () => {
      return getMaintenanceRequestsByAdminId();
    },
    enabled: !!adminId,
    keepPreviousData: true,
    ...CACHE_CONFIGS.REALTIME,
  });
};

// Update Maintenance Request Mutation
export const useUpdateMaintenanceRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ maintenanceRequestId, updateData }) => {
      return updateMaintenanceRequest(maintenanceRequestId, updateData);
    },
    onSuccess: () => {
      Toast.success(`Maintenance request updated successfully`);
      invalidateEntityQueries(queryClient, "maintenanceRequests");
      // Invalidate overview queries since maintenance counts have changed
      invalidateOverviewQueries(queryClient);
      // Wait for toast to show before reload
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
    onError: (error) => {
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) return;
      const msg =
        error?.response?.data?.error ||
        error?.error ||
        error?.message ||
        "Failed to update maintenance request";
      Toast.error(msg);
    },
  });
};

// Mark Maintenance Request as Completed Mutation
export const useMarkMaintenanceAsCompletedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (maintenanceRequestId) => {
      return markRequestAsCompleted(maintenanceRequestId);
    },
    onSuccess: () => {
      invalidateEntityQueries(queryClient, "maintenanceRequests");
      // Invalidate overview queries since maintenance counts have changed
      invalidateOverviewQueries(queryClient);
      // Wait for toast to show before reload
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
    onError: (error) => {
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) return;;
    },
  });
};

// Overview-specific queries for dashboard statistics
export const useMonthlyRevenueQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("monthlyRevenue", { adminId }),
    queryFn: async () => {
      return getCurrentMonthRevenue();
    },
    ...CACHE_CONFIGS.DYNAMIC,
  });
};

// Monthly Properties Count Query
export const useTotalPropertiesCountQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("totalPropertiesCount", { adminId }),
    queryFn: async () => {
      if (!adminId) {
        throw new Error('Admin ID is required');
      }
      try {
          const count = await countNumberOfListingsByAdminId();
          return count;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!adminId, // Only run query if adminId exists
    retry: 1, // Reduce retries to see errors faster
    ...CACHE_CONFIGS.MEDIUM,
  });
};

// Monthly Properties Count Query
export const useMonthlyPropertiesCountQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("monthlyPropertiesCount", { adminId }),
    queryFn: async () => {
      if (!adminId) {
        throw new Error('Admin ID is required');
      }
      try {
          const count = await countListingsAddedThisMonth();
          return count;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!adminId, // Only run query if adminId exists
    retry: 1, // Reduce retries to see errors faster
    ...CACHE_CONFIGS.MEDIUM,
  });
};

// Active Leases Count Query
export const useActiveLeasesCountQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("activeLeasesCount", { adminId }),
    queryFn: async () => {
      return countActiveLeasesByAdminId();
    },
    ...CACHE_CONFIGS.MEDIUM,
  });
};

// Leased Property Percentage Query
export const useLeasedPercentageQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("leasedPercentage", { adminId }),
    queryFn: async () => {
      return getLeasedPropertyPercentage();
    },
    ...CACHE_CONFIGS.MEDIUM,
  });
};

// Maintenance Count Query
export const useMaintenanceCountQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("maintenanceCount", { adminId }),
    queryFn: async () => {
      return countMaintenanceRequestsByAdminId();
    },
    ...CACHE_CONFIGS.MEDIUM,
  });
};

// High Priority Maintenance Count Query
export const useHighPriorityMaintenanceCountQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("highPriorityMaintenanceCount", { adminId }),
    queryFn: async () => {
      return countHighPriorityMaintenanceRequestsByAdminId();
    },
    ...CACHE_CONFIGS.MEDIUM,
  });
};

// Recent Activities Query
export const useRecentActivitiesQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("recentActivities", { adminId }),
    queryFn: async () => {
      return getRecentActivities(adminId);
    },
    ...CACHE_CONFIGS.DYNAMIC,
  });
};

// Utility function to manually invalidate overview data
// Use this in components when you know overview data has changed
export const useInvalidateOverview = () => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    invalidateOverviewQueries(queryClient);
  }, [queryClient]);
};

// Revenue trend query
export const useRevenueTrendQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("revenueTrend", { adminId }),
    queryFn: async () => {
      return getRevenueTrend();
    },
    ...CACHE_CONFIGS.DYNAMIC,
  });
};

// Property Status Query
export const useAdminPropertiesStatusQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("statusOverview", { adminId }),
    queryFn: async () => {
      return returnPropertiesByStatus();
    },
    ...CACHE_CONFIGS.DYNAMIC,
  });
};

// Review Query
export const useAdminPropertiesReviewsQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("reviews", { adminId }),
    queryFn: async () => {
      return getAdminPropertiesReviews();
    },
    ...CACHE_CONFIGS.DYNAMIC,
  });
};

// Caretaker Queries and Mutations
export const useCaretakersQuery = (adminId) => {
  return useQuery({
    queryKey: createQueryKey("caretakers", { adminId }),
    queryFn: async () => {
      return getCaretakersByAdminId();
    },
    enabled: !!adminId,
    ...CACHE_CONFIGS.MEDIUM,
  });
};

// Create Caretaker Mutation
export const useCreateCaretakerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (caretakerData) => {
      return createCaretaker(caretakerData);
    },
    onSuccess: (response) => {
      const caretakerID = response?.caretakerId || response;
      Toast.success(
        `Caretaker created successfully: Caretaker ID: ${caretakerID}`
      );
      // Use efficient invalidation utility
      invalidateEntityQueries(queryClient, "caretakers");
    },
    onError: (error) => {
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) return;
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create caretaker";
      Toast.error(`Error creating caretaker: ${msg}`);
    },
  });
};

// Assign Caretaker Mutation
export const useAssignCaretakerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ caretakerId, requestId }) => {
      return assignCaretakerToRequest(caretakerId, requestId);
    },
    onSuccess: () => {
      Toast.success(`Caretaker assigned to request successfully`);
      // Invalidate maintenance requests to reflect assignment
      invalidateEntityQueries(queryClient, "maintenanceRequests");
      invalidateOverviewQueries(queryClient);
    },
    onError: (error) => {
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) return;
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to assign caretaker";
      Toast.error(`Error assigning caretaker: ${msg}`);
    },
  });
};

// Delete Caretaker Mutation
export const useDeleteCaretakerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (caretakerId) => {
      return deleteCaretaker(caretakerId);
    },
    onSuccess: () => {
      Toast.success(`Caretaker deleted successfully`);
      // Invalidate caretakers to reflect deletion
      invalidateEntityQueries(queryClient, "caretakers");
      invalidateOverviewQueries(queryClient);
    },
    onError: (error) => {
      // Don't show toast if error was already handled by 401 interceptor
      if (error.isHandledBy401Interceptor) return;
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to delete caretaker";
      Toast.error(`Error deleting caretaker: ${msg}`);
    },
  });
};

// Caretaker By ID Query
export const useCaretakerByIdQuery = (adminId, caretakerId) => {
  return useQuery({
    queryKey: createQueryKey("caretaker", { adminId, caretakerId }),
    queryFn: async () => {
      return getCaretakerById(caretakerId);
    },
    enabled: !!caretakerId,
    ...CACHE_CONFIGS.MEDIUM,
  });
}