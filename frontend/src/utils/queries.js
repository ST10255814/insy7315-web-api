import { useQuery, useMutation } from "@tanstack/react-query";
import Toast from "../lib/toast.js";
import { getLeasesByAdminId, createLeaseForBookingID } from "./leases.api.js";
import { getInvoicesByAdminId } from "./invoice.api.js";
import { useQueryClient } from "@tanstack/react-query";
import queryClient from "../lib/queryClient.js";

// https://youtu.be/r8Dg0KVnfMA?si=Ibl3mRWKy_tofYyf
export const useLeasesQuery = (adminId) => {
  return useQuery({
    queryKey: ["leases", adminId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return getLeasesByAdminId();
    },
    enabled: !!adminId,
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
      queryClient.invalidateQueries(["leases"]);
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

export const useInvoicesQuery = (adminId) => {
  return useQuery({
    queryKey: ["invoices", adminId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return getInvoicesByAdminId();
    },
    enabled: !!adminId,
  }, queryClient);
};
