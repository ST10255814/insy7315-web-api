import { client } from "../utils/db.js";
import Object from '../utils/ObjectIDConvert.js';
import { generateListingId } from '../utils/idGenerator.js';
const { toObjectId } = Object;

//Get bookings for admin (landlord)
async function getBookings(adminId){
    try{
        const db = client.db('RentWise');
        const bookingsCollection = db.collection('Bookings');
        const listingCollection = db.collection("Listings");
        const userCollection = db.collection("Users");

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
                    
                    const bookingDetails = {
                        bookingID: book.newBooking.bookingId,
                        listingAddress: listing.address,
                        checkIn: book.newBooking.checkInDate,
                        checkOut: book.newBooking.checkOutDate,
                        guests: book.newBooking.numberOfGuests,
                        price: book.newBooking.totalPrice,
                        status: book.newBooking.status,
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