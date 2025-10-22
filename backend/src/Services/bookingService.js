import { client } from "../utils/db.js";
import Object from '../utils/ObjectIDConvert.js';
import { generateListingId } from '../utils/idGenerator.js';
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

const bookingService = {
    getBookings
};
export default bookingService;