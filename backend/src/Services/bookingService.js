import { client } from "../utils/db.js";
import Object from '../utils/ObjectIDConvert.js';
const { toObjectId } = Object;

// Helper function to decode Cloudinary filename from URL
function decodeCloudinaryFilename(url) {
    try {
        if (!url || typeof url !== 'string') {
            return 'Unknown File';
        }
        
        // Extract the filename from Cloudinary URL
        // Cloudinary URLs typically follow this pattern:
        // https://res.cloudinary.com/[cloud_name]/[resource_type]/upload/[version]/[public_id].[format]
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1]; // Get the last part (filename with extension)
        
        // Decode URL encoding
        const decodedFilename = decodeURIComponent(filename);
        
        // If the filename looks like it still has Cloudinary formatting, try to clean it up
        // Sometimes Cloudinary adds version numbers or other metadata
        const cleanFilename = decodedFilename.replace(/^v\d+_/, ''); // Remove version prefix like "v1234_"
        
        // If we still don't have a readable filename, extract from the public_id
        if (!cleanFilename || cleanFilename.includes('%') || cleanFilename.length < 3) {
            // Try to get a more readable name from the public_id (second to last part)
            const publicId = urlParts[urlParts.length - 2];
            if (publicId) {
                const decodedPublicId = decodeURIComponent(publicId);
                // Add a generic extension if none exists
                return decodedPublicId.includes('.') ? decodedPublicId : `${decodedPublicId}.file`;
            }
        }
        
        return cleanFilename || 'Document';
    } catch (error) {
        console.error('Error decoding Cloudinary filename:', error);
        return 'Document';
    }
}

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

// Get a booking via its ID
async function getBookingById(bookingId) {
    try{
        const db = client.db('RentWise');
        const bookingsCollection = db.collection('Bookings');

        const booking = await bookingsCollection.findOne({ "newBooking.bookingId": bookingId });
        return booking;
    }
    catch (error) {
        console.error("Error fetching booking by ID:", error);
        throw new Error("Failed to fetch booking");
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

                    //check if the supporting documents array is populated within the newBookings object
                    const hasSupportingDocuments = Array.isArray(book.newBooking.supportDocuments) && book.newBooking.supportDocuments.length > 0;

                    // Process supportDocuments to extract readable filenames
                    let processedSupportDocuments = [];
                    if (hasSupportingDocuments) {
                        processedSupportDocuments = book.newBooking.supportDocuments.map(doc => {
                            // If the document is a string (URL), try to extract filename
                            if (typeof doc === 'string') {
                                const decodedFilename = decodeCloudinaryFilename(doc);
                                return {
                                    url: doc,
                                    filename: decodedFilename,
                                    originalName: decodedFilename
                                };
                            }
                            // If the document is already an object with filename, return as is
                            if (typeof doc === 'object' && doc.filename) {
                                return doc;
                            }
                            // If the document has url and originalname properties
                            if (typeof doc === 'object' && doc.url) {
                                return {
                                    url: doc.url,
                                    filename: doc.originalname || doc.filename || decodeCloudinaryFilename(doc.url),
                                    originalName: doc.originalname || doc.filename || decodeCloudinaryFilename(doc.url)
                                };
                            }
                            // Fallback
                            return {
                                url: doc,
                                filename: 'Unknown File',
                                originalName: 'Unknown File'
                            };
                        });
                    }

                    //if supportDocuments exist, include them in the response
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
                        supportDocuments: processedSupportDocuments,
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

//calculate the total amount of revenue generated by bookings for a given admin in the current month
async function getCurrentMonthRevenue(adminId) {
    try{
        const db = client.db('RentWise');
        const bookingsCollection = db.collection('Bookings');
        const listingCollection = db.collection("Listings");

        // Get current month and year automatically
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
        const currentYear = now.getFullYear();

        console.log(`Calculating revenue for admin: ${adminId}, month: ${currentMonth}, year: ${currentYear}`);

        // First, get all listings owned by this admin
        const adminListings = await listingCollection.find({ 
            "landlordInfo.userId": toObjectId(adminId) 
        }).toArray();

        // Get all bookings for this admin's properties
        const allBookings = await bookingsCollection.find({ "listingDetail.listingID": { $in: adminListings.map(listing => listing._id) } }).toArray();

        console.log(`Found ${allBookings.length} total bookings for admin's properties`);

        // Filter bookings manually for better debugging
        const monthlyBookings = allBookings.filter(booking => {
            const checkInDate = booking.newBooking.checkInDate;
            const status = booking.newBooking.status;
            
            console.log(`Booking ${booking.newBooking.bookingId}: status=${status}, checkIn=${checkInDate}, price=${booking.newBooking.totalPrice}`);
            
            // Check if status is valid (including common status variations)
            const validStatuses = ["Active", "active", "confirmed", "Confirmed", "expired", "Expired"];
            if (!validStatuses.includes(status)) {
                console.log(`Booking ${booking.newBooking.bookingId} excluded due to status: ${status}`);
                return false;
            }
            
            // Parse check-in date (DD-MM-YYYY format)
            try {
                const [_day, month, year] = checkInDate.split('-');
                const bookingMonth = parseInt(month);
                const bookingYear = parseInt(year);
                
                console.log(`Booking ${booking.newBooking.bookingId} date parsed: month=${bookingMonth}, year=${bookingYear}`);
                
                // Include booking if it starts in current month/year
                const isCurrentMonth = bookingMonth === currentMonth && bookingYear === currentYear;
                console.log(`Booking ${booking.newBooking.bookingId} is current month: ${isCurrentMonth}`);
                
                return isCurrentMonth;
            } catch (dateError) {
                console.error(`Error parsing date for booking ${booking.newBooking.bookingId}:`, dateError);
                return false;
            }
        });

        console.log(`Filtered to ${monthlyBookings.length} bookings for current month`);

        // Calculate total revenue
        const totalRevenue = monthlyBookings.reduce((sum, booking) => {
            const price = booking.newBooking.totalPrice || 0;
            console.log(`Adding booking ${booking.newBooking.bookingId} price: ${price}`);
            return sum + price;
        }, 0);

        console.log(`Total revenue calculated: ${totalRevenue}`);
        return totalRevenue;
    }catch(error){
        console.error("Error calculating current month revenue:", error);
        throw new Error("Failed to calculate current month revenue");
    }
}

async function deleteBooking(bookingId, adminId){
    try{
        const db = client.db('RentWise');
        const bookingsCollection = db.collection('Bookings');
        const listingCollection = db.collection("Listings");

        //Find the booking first
        const booking = await bookingsCollection.findOne({ "newBooking.bookingId": bookingId });
        if(!booking){
            throw new Error("Booking not found");
        }

        //Check if the listing belongs to the admin
        const listing = await listingCollection.findOne({ _id: toObjectId(booking.listingDetail.listingID) });
        if(!listing){
            throw new Error("Listing not found");
        }

        //Verify that the admin owns this listing
        if(listing.landlordInfo.userId.toString() !== adminId){
            throw new Error("Unauthorized: You can only delete bookings for your own listings");
        }

        //If all checks pass, delete the booking
        const result = await bookingsCollection.deleteOne({ "newBooking.bookingId": bookingId });
        return result.deletedCount > 0;
    }catch(error){
        console.error("Error deleting booking:", error);
        throw new Error("Failed to delete booking");
    }
}

const bookingService = {
    getBookings,
    getBookingById,
    getCurrentMonthRevenue,
    deleteBooking
};
export default bookingService;