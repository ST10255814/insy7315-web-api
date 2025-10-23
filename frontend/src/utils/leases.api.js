import api from "../lib/axios.js";

export async function getLeasesByAdminId() {
  try {
    const response = await api.get(`/api/leases`, { withCredentials: true });
    return response.data.data;
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
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function countActiveLeasesByAdminId() {
  try {
    const response = await api.get(`/api/leases/count`, { withCredentials: true });
    return response.data.data.count;
  } catch (error) {
    throw error;
  }
}

export async function getLeasedPropertyPercentage() {
  try {
    const response = await api.get(`/api/leases/leased-percentage`, { withCredentials: true });
    return response.data.data.percentage;
  } catch (error) {
    throw error;
  }
}