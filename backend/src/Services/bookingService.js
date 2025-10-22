import { client } from "../utils/db.js";
import Object from '../utils/ObjectIDConvert.js';
import { generateListingId } from '../utils/idGenerator.js';
const { toObjectId } = Object;

// Helper function to calculate number of nights between two dates
function calculateNights(checkInDate, checkOutDate) {
    try {
        // Parse dates - assuming format is "DD-MM-YYYY"
        const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split('-');
            return new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date
        };

        const checkIn = parseDate(checkInDate);
        const checkOut = parseDate(checkOutDate);
        
        // Calculate difference in milliseconds
        const timeDifference = checkOut.getTime() - checkIn.getTime();
        
        // Convert to days
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        
        return Math.max(0, daysDifference); // Ensure non-negative result
    } catch (error) {
        console.error("Error calculating nights:", error);
        return 0; // Return 0 if there's an error in date parsing
    }
}

//Get bookings for admin (landlord)
async function getBookings(adminId){
    try{
        const db = client.db('RentWise');
        const bookingsCollection = db.collection('Bookings');
        const listingCollection = db.collection("Listings");
        const userCollection = db.collection("System-Users");

        //Get all bookings
        const bookings = await bookingsCollection.find().toArray();

        //go through each booking and grab the listing details
        const detailedBookings = await Promise.all(bookings.map(async (book) => {
            try {
                const listing = await listingCollection.findOne({ _id: toObjectId(book.listingDetail.listingID) });

                //Check if listing exists and belongs to this admin
                if(listing && listing.landlordInfo.userId.toString() === adminId){
                    // Get tenant information
                    const tenant = await userCollection.findOne({ _id: toObjectId(book.userId) });
                    
                    // Calculate number of nights
                    const nights = calculateNights(book.newBooking.checkInDate, book.newBooking.checkOutDate);
                    
                    const bookingDetails = {
                        bookingID: book.newBooking.bookingId,
                        listingAddress: listing.address,
                        listingTitle: listing.title,
                        checkIn: book.newBooking.checkInDate,
                        checkOut: book.newBooking.checkOutDate,
                        nights: nights,
                        guests: book.newBooking.numberOfGuests,
                        price: book.newBooking.totalPrice,
                        status: book.newBooking.status,
                        createdAt: book.createdAt,
                        tenantInfo: tenant ? {
                            name: `${tenant.firstName} ${tenant.surname}`,
                            userId: tenant._id
                        } : {
                            name: "Unknown User",
                            userId: book.userId
                        }
                    }
                    
                    return bookingDetails;
                }
            } catch (listingError) {
                console.error(`Error fetching listing ${book.listingDetail.listingID}:`, listingError);
                return null;
            }
            return null;
        }));
        
        return detailedBookings.filter(book => book !== null);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw new Error("Failed to fetch bookings");
    }
}

const bookingService = {
    getBookings
};
export default bookingService;