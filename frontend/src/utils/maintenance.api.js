import api from "../lib/axios.js";

export async function getMaintenanceRequestsByAdminId() {
    try {
        const response = await api.get("/api/maintenance", { withCredentials: true });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export async function countMaintenanceRequestsByAdminId() {
    try {
        const response = await api.get("/api/maintenance/count", { withCredentials: true });
        return response.data.data.count;
    } catch (error) {
        throw error;
    }
}

export async function countHighPriorityMaintenanceRequestsByAdminId() {
    try {
        const response = await api.get("/api/maintenance/count-high-priority", { withCredentials: true });
        return response.data.data.count;
    } catch (error) {
        throw error;
    }
}