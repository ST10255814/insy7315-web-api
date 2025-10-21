import { client } from "../utils/db.js";
import Object from '../utils/ObjectIDConvert.js';
import { generateListingId } from '../utils/idGenerator.js';
const { toObjectId } = Object;

//Get for admin booking
async function getBookings(adminId){

    try{
        const db = client.db('RentWise');
        const bookingsCollection = db.collection('Bookings');
        const listingCollection = db.collection("Listings");

        //Get all bookings without the admin ID
        const booking = await bookingsCollection.find().toArray();

        //go through each booking and grab the listing ID
        const detailedBookings = await Promise.all(booking.map(async (book) => {
            const listing = await listingCollection.findOne({ _id: book.listingDetail.listingID });

            //using the listing ID we search for a listing that contains the adminID
            if(listing.landlordInfo.landlord.toString() === adminId){
                //Grab the booking that this listing is associated with
                const bookingDetails = {
                    bookingID: book.newBooking.BookingId,
                    listingAddress: listing.address,
                    checkIn: book.newBooking.checkInDate,
                    checkOut: book.newBooking.checkOutDate,
                    guests: book.newBooking.numberOfGuests,
                    price: book.newBooking.totalPrice,
                    status: book.newBooking.status
                }
                return bookingDetails;
            }

        }));
        return detailedBookings.filter(book => book !== undefined);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw new Error("Failed to fetch bookings");
    }
}

const bookingService = {
    getBookings
};
export default bookingService;