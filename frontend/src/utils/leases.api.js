import api from "../lib/axios.js";

export async function getLeasesByAdminId(adminId) {
    try {
        const response = await api.get(`/api/${adminId}/leases`, {withCredentials: true});
        console.log("Fetched leases for admin:", adminId, response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching leases:", error);
        throw error; 
    }
}

export async function createLeaseForBookingID(bookingID, adminId) {
    try {
        const response = await api.post(`/api/${adminId}/leases/create`, {bookingID}, {withCredentials: true})
        console.log("Lease created for BookingID: " + bookingID)
        return response.data
    } catch (error) {
        console.error("Error creating lease: ", error)
        throw error
    }
}