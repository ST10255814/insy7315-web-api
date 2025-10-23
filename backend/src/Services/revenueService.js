import { client } from "../utils/db.js";
import Object from '../utils/ObjectIDConvert.js';
const { toObjectId } = Object;

/**
 * Calculate monthly revenue for a specific admin from their bookings
 * @param {string} adminId - The admin's user ID
 * @param {number} month - Month (1-12)
 * @param {number} year - Year (e.g., 2024)
 * @returns {Object} Revenue data including total amount and booking details
 */
async function calculateMonthlyRevenue(adminId, month, year) {
    try {
        const db = client.db('RentWise');
        const bookingsCollection = db.collection('Bookings');
        const listingCollection = db.collection("Listings");

        console.log(`Calculating revenue for admin: ${adminId}, month: ${month}, year: ${year}`);

        // First, get all listings owned by this admin
        const adminListings = await listingCollection.find({ 
            "landlordInfo.userId": toObjectId(adminId) 
        }).toArray();

        if (adminListings.length === 0) {
            console.log(`No listings found for admin: ${adminId}`);
            return {
                adminId,
                month,
                year,
                totalRevenue: 0,
                bookingCount: 0,
                bookings: []
            };
        }

        // Get all bookings for this admin's properties
        const listingIds = adminListings.map(listing => listing._id.toString());
        
        // Try both string and ObjectId versions to be safe
        const allBookings = await bookingsCollection.find({ 
            $or: [
                { "listingDetail.listingID": { $in: listingIds } },
                { "listingDetail.listingID": { $in: adminListings.map(l => l._id) } }
            ]
        }).toArray();

        console.log(`Found ${allBookings.length} total bookings for admin's properties`);

        // Filter bookings for the specified month and year
        const monthlyBookings = allBookings.filter(booking => {
            const checkInDate = booking.newBooking.checkInDate;
            const status = booking.newBooking.status;
            
            // Only include completed or active bookings (revenue-generating)
            const validStatuses = ["Active", "active", "confirmed", "Confirmed", "expired", "Expired", "completed", "Completed"];
            if (!validStatuses.includes(status)) {
                return false;
            }
            
            // Parse check-in date (DD-MM-YYYY format)
            try {
                const [day, monthStr, yearStr] = checkInDate.split('-');
                const bookingMonth = parseInt(monthStr);
                const bookingYear = parseInt(yearStr);
                
                // Include booking if it starts in the specified month/year
                return bookingMonth === month && bookingYear === year;
            } catch (dateError) {
                console.error(`Error parsing date for booking ${booking.newBooking.bookingId}:`, dateError);
                return false;
            }
        });

        console.log(`Filtered to ${monthlyBookings.length} bookings for month ${month}/${year}`);

        // Calculate total revenue and prepare booking details
        let totalRevenue = 0;
        const bookingDetails = monthlyBookings.map(booking => {
            const price = booking.newBooking.totalPrice || 0;
            totalRevenue += price;
            
            // Find the corresponding listing for additional details
            const listing = adminListings.find(l => l._id.toString() === booking.listingDetail.listingID);
            
            return {
                bookingId: booking.newBooking.bookingId,
                listingTitle: listing ? listing.title : 'Unknown Property',
                listingAddress: listing ? listing.address : 'Unknown Address',
                checkInDate: booking.newBooking.checkInDate,
                checkOutDate: booking.newBooking.checkOutDate,
                guests: booking.newBooking.numberOfGuests,
                totalPrice: price,
                status: booking.newBooking.status,
                tenantId: booking.userId
            };
        });

        console.log(`Total revenue calculated: ${totalRevenue}`);

        return {
            adminId,
            month,
            year,
            totalRevenue,
            bookingCount: monthlyBookings.length,
            bookings: bookingDetails,
            calculatedAt: new Date()
        };
    } catch (error) {
        console.error("Error calculating monthly revenue:", error);
        throw new Error(`Failed to calculate monthly revenue: ${error.message}`);
    }
}

/**
 * Store monthly revenue data in the database
 * @param {Object} revenueData - Revenue data object from calculateMonthlyRevenue
 * @returns {Object} Stored revenue document
 */
async function storeMonthlyRevenue(revenueData) {
    try {
        const db = client.db('RentWise');
        const revenueCollection = db.collection('MonthlyRevenue');

        // Check if revenue data for this admin/month/year already exists
        const existingRevenue = await revenueCollection.findOne({
            adminId: revenueData.adminId,
            month: revenueData.month,
            year: revenueData.year
        });

        const revenueDocument = {
            ...revenueData,
            updatedAt: new Date()
        };

        if (existingRevenue) {
            // Update existing record
            const result = await revenueCollection.updateOne(
                { _id: existingRevenue._id },
                { $set: revenueDocument }
            );
            console.log(`Updated existing revenue record for admin ${revenueData.adminId}, month ${revenueData.month}/${revenueData.year}`);
            return { ...revenueDocument, _id: existingRevenue._id };
        } else {
            // Create new record
            revenueDocument.createdAt = new Date();
            const result = await revenueCollection.insertOne(revenueDocument);
            console.log(`Created new revenue record for admin ${revenueData.adminId}, month ${revenueData.month}/${revenueData.year}`);
            return { ...revenueDocument, _id: result.insertedId };
        }
    } catch (error) {
        console.error("Error storing monthly revenue:", error);
        throw new Error(`Failed to store monthly revenue: ${error.message}`);
    }
}

/**
 * Get stored revenue data for a specific admin and time period
 * @param {string} adminId - The admin's user ID
 * @param {number} year - Year (optional, defaults to current year)
 * @param {number} month - Month (optional, if not provided returns all months for the year)
 * @returns {Array|Object} Revenue data
 */
async function getStoredRevenue(adminId, year = null, month = null) {
    try {
        const db = client.db('RentWise');
        const revenueCollection = db.collection('MonthlyRevenue');

        const currentDate = new Date();
        const defaultYear = year || currentDate.getFullYear();

        let query = {
            adminId: adminId,
            year: defaultYear
        };

        if (month) {
            query.month = month;
        }

        const revenueData = await revenueCollection
            .find(query)
            .sort({ year: -1, month: -1 })
            .toArray();

        if (month) {
            // Return single month data
            return revenueData.length > 0 ? revenueData[0] : null;
        } else {
            // Return all months for the year
            return revenueData;
        }
    } catch (error) {
        console.error("Error retrieving stored revenue:", error);
        throw new Error(`Failed to retrieve stored revenue: ${error.message}`);
    }
}

/**
 * Get revenue trend data for the last 12 months for a specific admin
 * @param {string} adminId - The admin's user ID
 * @returns {Array} Array of monthly revenue data for the last 12 months
 */
async function getRevenueTrend(adminId) {
    try {
        const db = client.db('RentWise');
        const revenueCollection = db.collection('MonthlyRevenue');

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        // Calculate date range for last 12 months
        let startYear = currentYear;
        let startMonth = currentMonth - 11;
        
        if (startMonth <= 0) {
            startMonth += 12;
            startYear -= 1;
        }

        // Get revenue data for the last 12 months
        const revenueData = await revenueCollection
            .find({
                adminId: adminId,
                $or: [
                    { year: currentYear, month: { $lte: currentMonth } },
                    { year: startYear, month: { $gte: startMonth } }
                ]
            })
            .sort({ year: 1, month: 1 })
            .toArray();

        // Create a complete 12-month array with zero values for missing months
        const trendData = [];
        let tempYear = startYear;
        let tempMonth = startMonth;

        for (let i = 0; i < 12; i++) {
            const existingData = revenueData.find(data => 
                data.year === tempYear && data.month === tempMonth
            );

            trendData.push({
                year: tempYear,
                month: tempMonth,
                monthName: getMonthName(tempMonth),
                totalRevenue: existingData ? existingData.totalRevenue : 0,
                bookingCount: existingData ? existingData.bookingCount : 0
            });

            tempMonth++;
            if (tempMonth > 12) {
                tempMonth = 1;
                tempYear++;
            }
        }

        return trendData;
    } catch (error) {
        console.error("Error retrieving revenue trend:", error);
        throw new Error(`Failed to retrieve revenue trend: ${error.message}`);
    }
}

/**
 * Process monthly revenue for all admins (used by cron job)
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @returns {Object} Summary of processed revenue data
 */
async function processAllAdminRevenue(month, year) {
    try {
        const db = client.db('RentWise');
        const userCollection = db.collection('System-Users');

        // Get all users who have listings (property owners/landlords)
        const listingCollection = db.collection("Listings");
        const uniqueLandlords = await listingCollection.distinct("landlordInfo.userId");
        
        const admins = await userCollection.find({ 
            _id: { $in: uniqueLandlords }
        }).toArray();

        console.log(`Found ${admins.length} admin users to process revenue for`);

        const results = {
            month,
            year,
            processedAdmins: 0,
            totalRevenue: 0,
            errors: []
        };

        for (const admin of admins) {
            try {
                const adminId = admin._id.toString();
                console.log(`Processing revenue for admin: ${adminId} (${admin.firstName} ${admin.surname})`);
                
                const revenueData = await calculateMonthlyRevenue(adminId, month, year);
                
                // Only store revenue data if there's actual revenue > 0
                if (revenueData.totalRevenue > 0) {
                    await storeMonthlyRevenue(revenueData);
                    console.log(`✓ Stored revenue for admin ${adminId}: R${revenueData.totalRevenue} from ${revenueData.bookingCount} bookings`);
                } else {
                    console.log(`⚪ Skipped admin ${adminId}: R0 (no bookings/revenue for ${month}/${year})`);
                }
                
                results.processedAdmins++;
                results.totalRevenue += revenueData.totalRevenue;
                
            } catch (adminError) {
                console.error(`Error processing admin ${admin._id}:`, adminError);
                results.errors.push({
                    adminId: admin._id.toString(),
                    adminName: `${admin.firstName} ${admin.surname}`,
                    error: adminError.message
                });
            }
        }

        console.log(`Monthly revenue processing complete: ${results.processedAdmins} admins processed, total revenue: R${results.totalRevenue}`);
        return results;
    } catch (error) {
        console.error("Error processing all admin revenue:", error);
        throw new Error(`Failed to process all admin revenue: ${error.message}`);
    }
}

/**
 * Helper function to get month name from month number
 * @param {number} monthNumber - Month number (1-12)
 * @returns {string} Month name
 */
function getMonthName(monthNumber) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1] || 'Unknown';
}

const revenueService = {
    calculateMonthlyRevenue,
    storeMonthlyRevenue,
    getStoredRevenue,
    getRevenueTrend,
    processAllAdminRevenue
};

export default revenueService;