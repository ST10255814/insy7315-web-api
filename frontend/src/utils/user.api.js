import api from "../lib/axios.js";
import queryClient from "../lib/queryClient.js";

export async function logoutUser() {
  try {
    const response = await api.post(
      "/api/user/logout",
      {},
      { withCredentials: true }
    );
    localStorage.removeItem("user");
    queryClient.clear()
    return response.data;
  } catch (error) {
    throw error;
  }
}
