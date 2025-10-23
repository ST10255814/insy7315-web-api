import api from "../lib/axios.js";

export async function getRecentActivities() {
    try {
        const response = await api.get("/api/activity-logs", { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}