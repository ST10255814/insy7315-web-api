import api from "../lib/axios.js";

export async function getLeasesByAdminId() {
  try {
    const response = await api.get(`/api/leases`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createLeaseForBookingID(bookingID) {
  try {
    const response = await api.post(
      "/api/leases/create",
      { bookingID },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
