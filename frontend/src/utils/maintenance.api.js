import api from "../lib/axios.js";

export async function getMaintenanceRequestsByAdminId() {
    try {
        const response = await api.get("/api/maintenance", { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}