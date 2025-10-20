import api from "../lib/axios.js";

export async function getListingsByAdminId() {
  try {
    const response = await api.get("/api/listings", { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createListing(listingData) {
  try {
    const response = await api.post(
      "/api/listings/create",
      { listingData },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
