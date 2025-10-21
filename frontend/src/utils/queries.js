import { useQuery, useMutation } from "@tanstack/react-query";
import Toast from "../lib/toast.js";
import { getLeasesByAdminId, createLeaseForBookingID } from "./leases.api.js";
import { getInvoicesByAdminId, createInvoice } from "./invoice.api.js";
import { getListingsByAdminId, createListing } from "./listings.api.js";
import { getBookingsByAdminId } from "./bookings.api.js";
import { useQueryClient } from "@tanstack/react-query";
import queryClient from "../lib/queryClient.js";
import { CACHE_CONFIGS, createQueryKey, invalidateEntityQueries } from "./cacheUtils.js";

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
    },
    onError: (error) => {
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
    },
    onError: (error) => {
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
    },
    onError: (error) => {
      console.error('Create listing mutation error:', error);
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