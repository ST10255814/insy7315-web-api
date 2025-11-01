import api from "../lib/axios";

// Get all bookings via adminId
export async function getBookingsByAdminId() {
    try{
        const response = await api.get('/api/bookings', { withCredentials: true });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export async function getBookingById(bookingId) {
    try {
        const response = await api.get(`/api/bookings/${bookingId}`, { withCredentials: true });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteBookingById(bookingId) {
    try {
        const response = await api.delete(`/api/bookings/${bookingId}`, { withCredentials: true });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

// Get current month revenue for the logged-in admin
// Uses the revenue service endpoint which reads from MonthlyRevenue collection
export async function getCurrentMonthRevenue() {
    try {
        const response = await api.get('/api/revenue/current-month', {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}


