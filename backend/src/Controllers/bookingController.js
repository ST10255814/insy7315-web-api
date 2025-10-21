import bookingService from "../Services/bookingService.js";

//Get bookings for admin
async function getBookings(req, res){
    const adminId = req.user.userId; // Get admin ID from the authenticated user
    try{
        const bookings = await bookingService.getBookings(adminId);
        res.status(200).json(bookings);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
}


export default {
    getBookings
};