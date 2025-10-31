import { client } from "../utils/db.js";
import Object from "../utils/ObjectIDConvert.js";
const { toObjectId } = Object;

//check occupancy status of a listing
async function checkOccupancyStatus(listingId) {
  try {
    const db = client.db("RentWise");
    const listingsCollection = db.collection("Listings");

    // Try to find by _id if it's a valid ObjectId, otherwise find by listingId field
    let listing;
    try {
      listing = await listingsCollection.findOne({ _id: toObjectId(listingId) });
    } catch (idError) {
      // If not a valid ObjectId, try to find by listingId field
      listing = await listingsCollection.findOne({ listingId: listingId });
    }
    
    if (!listing) {
      throw new Error("Listing not found");
    }

    return listing.status;
  } catch (error) {
    console.error("Error checking occupancy status:", error);
    throw error;
  }
}

/**
 * Helper function to check if a booking is currently active
 * @param {string} checkInDate - Check-in date in DD-MM-YYYY format
 * @param {string} checkOutDate - Check-out date in DD-MM-YYYY format
 * @returns {boolean} - True if the booking is currently active
 */
function isBookingActive(checkInDate, checkOutDate) {
  try {
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('-');
      return new Date(year, month - 1, day);
    };

    const checkIn = parseDate(checkInDate);
    const checkOut = parseDate(checkOutDate);
    const today = new Date();
    
    // Set time to midnight for accurate date comparison
    today.setHours(0, 0, 0, 0);
    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);

    // Booking is active if today is between check-in and check-out dates (inclusive of check-in, exclusive of check-out)
    return today >= checkIn && today < checkOut;
  } catch (error) {
    console.error('Error checking if booking is active:', error);
    return false;
  }
}

/**
 * Update listing statuses for all listings owned by admin
 * Checks active bookings and maintenance requests to determine status:
 * - Occupied: Has an active booking
 * - Under Maintenance: No active booking but has pending/active maintenance request
 * - Vacant: No active booking and no maintenance requests
 */
async function updateListingStatuses(adminId) {
  try {
    console.log(`Starting listing status update for admin: ${adminId}`);
    
    const db = client.db("RentWise");
    const listingsCollection = db.collection("Listings");
    const bookingsCollection = db.collection("Bookings");
    const maintenanceCollection = db.collection("Maintenance-Requests");
    
    // Get all listings owned by the admin
    const listings = await listingsCollection.find({
      "landlordInfo.userId": toObjectId(adminId)
    }).toArray();
    
    if (!listings || listings.length === 0) {
      console.log(`No listings found for admin: ${adminId}`);
      return { 
        processedListings: 0, 
        updated: 0, 
        statusCounts: { Occupied: 0, 'Under Maintenance': 0, Vacant: 0 },
        details: []
      };
    }
    
    console.log(`Found ${listings.length} listings to process`);
    
    let updatedCount = 0;
    const statusCounts = { Occupied: 0, 'Under Maintenance': 0, Vacant: 0 };
    const details = [];
    
    for (const listing of listings) {
      try {
        const currentStatus = listing.status;
        let newStatus = 'Vacant'; // Default status
        
        // Check for active bookings
        const bookings = await bookingsCollection.find({
          "listingDetail.listingID": listing._id,
          "newBooking.status": { $in: ["Active", "active", "confirmed", "Confirmed"] }
        }).toArray();
        
        let hasActiveBooking = false;
        
        if (bookings && bookings.length > 0) {
          // Check if any booking is currently active (dates overlap with today)
          for (const booking of bookings) {
            if (booking.newBooking && booking.newBooking.checkInDate && booking.newBooking.checkOutDate) {
              if (isBookingActive(booking.newBooking.checkInDate, booking.newBooking.checkOutDate)) {
                hasActiveBooking = true;
                break;
              }
            }
          }
        }
        
        if (hasActiveBooking) {
          newStatus = 'Occupied';
        } else {
          // Check for maintenance requests (only if not occupied)
          const maintenanceRequests = await maintenanceCollection.find({
            "listingDetail.listingID": listing._id,
            "newMaintenanceRequest.status": { $in: ["pending", "Pending", "in-progress", "In-Progress", "In Progress"] }
          }).toArray();
          
          if (maintenanceRequests && maintenanceRequests.length > 0) {
            newStatus = 'Under Maintenance';
          }
        }
        
        statusCounts[newStatus]++;
        
        // Update status if it has changed
        if (currentStatus !== newStatus) {
          await listingsCollection.updateOne(
            { _id: listing._id },
            { 
              $set: { 
                status: newStatus,
                lastStatusUpdate: new Date()
              }
            }
          );
          
          updatedCount++;
          details.push({
            listingId: listing.listingId,
            title: listing.title,
            address: listing.address,
            oldStatus: currentStatus,
            newStatus: newStatus
          });
          
          console.log(`Updated listing ${listing.listingId} (${listing.title}): ${currentStatus} -> ${newStatus}`);
        } else {
          console.log(`Listing ${listing.listingId} (${listing.title}): Status unchanged (${currentStatus})`);
        }
      } catch (listingError) {
        console.error(`Error processing listing ${listing.listingId}:`, listingError);
      }
    }
    
    const result = {
      processedListings: listings.length,
      updated: updatedCount,
      statusCounts: statusCounts,
      details: details
    };
    
    console.log(`Listing status update completed for admin ${adminId}:`);
    console.log(`- Processed: ${result.processedListings} listings`);
    console.log(`- Updated: ${result.updated} listings`);
    console.log(`- Occupied: ${statusCounts.Occupied}`);
    console.log(`- Under Maintenance: ${statusCounts['Under Maintenance']}`);
    console.log(`- Vacant: ${statusCounts.Vacant}`);
    
    return result;
  } catch (error) {
    console.error('Error updating listing statuses:', error);
    throw error;
  }
}

/**
 * Update listing statuses for all admins in the system
 */
async function updateAllListingStatuses() {
  try {
    console.log('Starting listing status update for all admins...');
    
    const db = client.db("RentWise");
    const userCollection = db.collection("System-Users");
    
    // Get all admin users (you may need to adjust this query based on how admins are identified)
    const admins = await userCollection.find({ 
      role: { $in: ["admin", "Admin", "landlord", "Landlord"] } 
    }).toArray();
    
    if (!admins || admins.length === 0) {
      console.log('No admins found');
      return { 
        processedAdmins: 0, 
        totalListingsProcessed: 0, 
        totalUpdated: 0,
        adminResults: []
      };
    }
    
    console.log(`Found ${admins.length} admins to process`);
    
    let totalListingsProcessed = 0;
    let totalUpdated = 0;
    const adminResults = [];
    
    for (const admin of admins) {
      try {
        const adminName = `${admin.firstName} ${admin.surname}`;
        console.log(`\n--- Processing listings for admin: ${adminName} (${admin._id}) ---`);
        
        const result = await updateListingStatuses(admin._id.toString());
        
        totalListingsProcessed += result.processedListings;
        totalUpdated += result.updated;
        
        adminResults.push({
          adminId: admin._id.toString(),
          adminName: adminName,
          ...result
        });
      } catch (adminError) {
        console.error(`Error processing admin ${admin._id}:`, adminError);
        adminResults.push({
          adminId: admin._id.toString(),
          adminName: `${admin.firstName} ${admin.surname}`,
          error: adminError.message
        });
      }
    }
    
    const finalResult = {
      processedAdmins: admins.length,
      totalListingsProcessed: totalListingsProcessed,
      totalUpdated: totalUpdated,
      adminResults: adminResults
    };
    
    console.log('\n=== Listing Status Update Summary ===');
    console.log(`Processed ${finalResult.processedAdmins} admins`);
    console.log(`Total listings processed: ${finalResult.totalListingsProcessed}`);
    console.log(`Total listings updated: ${finalResult.totalUpdated}`);
    
    return finalResult;
  } catch (error) {
    console.error('Error updating all listing statuses:', error);
    throw error;
  }
}

export default {
  checkOccupancyStatus,
  updateListingStatuses,
  updateAllListingStatuses
};