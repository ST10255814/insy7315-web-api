import { useQuery, useMutation } from "@tanstack/react-query";
import Toast from "../lib/toast.js";
import { getLeasesByAdminId, createLeaseForBookingID } from "./leases.api.js";
import { useQueryClient } from "@tanstack/react-query";

// https://youtu.be/r8Dg0KVnfMA?si=Ibl3mRWKy_tofYyf
export const useLeasesQuery = (adminId) => {

  return useQuery({
    queryKey: ["leases", adminId],
    queryFn: () => getLeasesByAdminId(),
    enabled: !!adminId
  })
};

export const useCreateLeaseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingID) =>
      new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const result = await createLeaseForBookingID(bookingID);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, 2000);
      }),
    onSuccess: (response) => {
      Toast.success(
        "Lease created successfully for BookingID: " + response.bookingId ||
          response
      );
      queryClient.invalidateQueries(["leases"]);
    },
  });
};
