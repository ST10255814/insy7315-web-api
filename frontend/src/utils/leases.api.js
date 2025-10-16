import api from "../lib/axios.js";
import Toast from "../lib/toast.js";
import { useNavigate } from "react-router-dom";

export async function getLeasesByAdminId() {
  let count = 0;
  try {
    const response = await api.get(`/api/leases`, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (count < 1) {
        Toast.error(error.response.data.error);
        await api.post("/api/users/logout", {}, { withCredentials: true });
        localStorage.removeItem("user");
        count++;
      }
    }
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
    console.log("Lease created for BookingID: " + bookingID);
    return response.data;
  } catch (error) {
    console.error("Error creating lease: ", error);
    if (error.response) {
      Toast.error(error.response.data.error);
    }
    throw error;
  }
}
