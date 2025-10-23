import { client } from "../utils/db.js";
import Object from '../utils/ObjectIDConvert.js';
import { generateLeaseId, generateBookingId } from '../utils/idGenerator.js';
import { determineLeaseStatus } from '../utils/statusManager.js';
const { toObjectId } = Object;

async function getLeasesByAdminId(adminId) {
  try {
    if (!adminId) {
      throw new Error("Admin ID is required");
    }
    
    const db = client.db("RentWise");
    const leasesCollection = db.collection("Leases");

    const leases = await leasesCollection
      .find({ adminId: toObjectId(adminId) })
      .toArray();

    console.log(`Found ${leases.length} leases for admin ${adminId}`);

    // Update lease statuses in real-time
    const updatedLeases = await Promise.all(
      leases.map(async (lease, index) => {
        try {
          const currentStatus = lease.status;
          
          // Check if bookingDetails and dates  exist
          if (!lease.bookingDetails || !lease.bookingDetails.startDate || !lease.bookingDetails.endDate) {
            console.warn(`Lease ${lease._id} missing booking details or dates`);
            return lease; // Return lease as-is if dates are missing
          }

          const newStatus = await validateDate(
            lease.bookingDetails.startDate,
            lease.bookingDetails.endDate
          );

          // If status changed, update in database
          if (currentStatus !== newStatus) {
            console.log(`Updating lease ${lease._id} status from ${currentStatus} to ${newStatus}`);
            await leasesCollection.updateOne(
              { _id: lease._id },
              { 
                $set: { 
                  status: newStatus,
                  lastStatusUpdate: new Date()
                }
              }
            );
            lease.status = newStatus;
            lease.lastStatusUpdate = new Date();
          }

          return lease;
        } catch (leaseError) {
          console.error(`Error processing lease ${lease._id}:`, leaseError);
          // Return the lease as-is if there's an error processing it
          return lease;
        }
      })
    );

    console.log(`Successfully processed ${updatedLeases.length} leases`);
    return updatedLeases;
  } catch (err) {
    console.error("Error in getLeasesByAdminId:", err);
    throw new Error("Error fetching leases: " + err.message);
  }
}

//creating lease from bookingID
async function createLease(bookingID, adminId) {
  try {
    if (!bookingID) {
      throw new Error("Booking ID is required to create a lease");
    }

    const db = client.db("RentWise");
    const bookingsCollection = db.collection("Bookings");
    const listingCollection = db.collection("Listings");
    const userCollection = db.collection('System-Users');
    const leasesCollection = db.collection("Leases");
    const activityCollection = db.collection("User-Activity-Logs");

    // Verify booking exists
    const booking = await bookingsCollection.findOne({ "newBooking.bookingId": bookingID });
    if (!booking) {
      throw new Error("Booking not found");
    }

    //extract both userID and listingID from bookingsCollection
    const userID = await userCollection.findOne({ _id: toObjectId(booking.userId) });

    if(!userID){
      throw new Error("User not found");
    }

    //create tenant Object
    const tenant = {
        userId: userID._id,
        firstName: userID.firstName,
        surname: userID.surname,
        email: userID.email
    }

    //using listing ID pull address from listingCollection
    const listingData = await listingCollection.findOne({ _id: toObjectId(booking.listingDetail.listingID) });
  
    if(!listingData){
      throw new Error("Listing not found");
    }

    //create listing object with address 
    const listing = {
        listingId : listingData._id,
        address: listingData.address
    }

    //create booking details object with startDate, endDate and rentAmount
    const bookingDetails = {
        bookingId: booking.newBooking.bookingId,
        startDate: booking.newBooking.checkInDate,
        endDate: booking.newBooking.checkOutDate,
        rentAmount: booking.newBooking.totalPrice
    }

    // Generate the lease ID
    const leaseId = await generateLeaseId();
    
    const lease = {
        adminId: toObjectId(adminId),
        leaseId: leaseId,
        bookingDetails,
        tenant,
        listing,
        status: "Pending",
        leaseCreatedAt: new Date()
    };

    const activityLog = {
        action: 'Create Lease',
        adminId: toObjectId(adminId),
        detail: `Created lease ${leaseId} for booking ${bookingID}`,
        timestamp: new Date()
    };
    await activityCollection.insertOne(activityLog);

    const result = await leasesCollection.insertOne(lease);
    return leaseId;
  } catch (err) {
    throw new Error("Error creating lease: " + err.message);
  }
}

// ID generation functions now imported from utils/idGenerator.js

//compare startDate and endDate to today's date
//if startDate has passed today's date, and endDate is still before today's date, set status to "Active"
async function validateDate(startDate, endDate) {
  // Use the centralized status determination logic
  return determineLeaseStatus(startDate, endDate);
}

// Function to update all lease statuses for a specific admin
async function updateLeaseStatusesByAdmin(adminId) {
  try {
    const db = client.db("RentWise");
    const leasesCollection = db.collection("Leases");

    const leases = await leasesCollection
      .find({ 
        adminId: toObjectId(adminId),
        status: { $in: ["Pending", "Active"] } // Only check non-expired leases
      })
      .toArray();

    let updatedCount = 0;

    for (const lease of leases) {
      const currentStatus = lease.status;
      const newStatus = await validateDate(
        lease.bookingDetails.startDate,
        lease.bookingDetails.endDate
      );

      if (currentStatus !== newStatus) {
        await leasesCollection.updateOne(
          { _id: lease._id },
          { 
            $set: { 
              status: newStatus,
              lastStatusUpdate: new Date()
            }
          }
        );
        updatedCount++;
      }
    }

    return updatedCount;
  } catch (err) {
    throw new Error("Error updating lease statuses: " + err.message);
  }
}

// Function to update ALL lease statuses across ALL admins (for scheduled tasks)
async function updateAllLeaseStatuses() {
  try {
    console.log('Starting lease status update for all admins...');
    
    const db = client.db("RentWise");
    const leasesCollection = db.collection("Leases");

    // Get all leases that are not already expired
    const leases = await leasesCollection
      .find({ 
        status: { $in: ["Pending", "Active"] } 
      })
      .toArray();

    let updatedCount = 0;

    for (const lease of leases) {
      const currentStatus = lease.status;
      const newStatus = await validateDate(
        lease.bookingDetails.startDate,
        lease.bookingDetails.endDate
      );

      // Only update if status has changed
      if (currentStatus !== newStatus) {
        await leasesCollection.updateOne(
          { _id: lease._id },
          { 
            $set: { 
              status: newStatus,
              lastStatusUpdate: new Date()
            }
          }
        );
        updatedCount++;
        console.log(`Updated lease ${lease.leaseId} from ${currentStatus} to ${newStatus}`);
      }
    }

    console.log(`Lease status update completed. Updated ${updatedCount} leases.`);
    return updatedCount;
  } catch (error) {
    console.error('Error updating lease statuses:', error);
    throw error;
  }
}

//get total active leases for adminId
async function countActiveLeasesByAdminId(adminId) {
  try {
    const db = client.db("RentWise");
    const leasesCollection = db.collection("Leases");

    const count = await leasesCollection.countDocuments({ 
      adminId: toObjectId(adminId),
      status: "Active"
    });

    return count;
  } catch (error) {
    console.error(`Error counting active leases for adminId=${adminId}:`, error);
    throw error;
  }
}

//get % of admin owned properties that are currently leased
async function getLeasedPropertyPercentage(adminId) {
  try {
    const db = client.db("RentWise");
    const leasesCollection = db.collection("Leases");
    const listingsCollection = db.collection("Listings");

    const totalProperties = await listingsCollection.countDocuments({ "landlordInfo.userId": toObjectId(adminId) });
    if (totalProperties === 0) {
      return 0; // Avoid division by zero
    }

    //count leases that are active
    const activeLeases = await leasesCollection.countDocuments({ 
      adminId: toObjectId(adminId),
      status: "Active"
    });

    const percentage = (activeLeases / totalProperties) * 100;
    return percentage;
  } catch (error) {
    console.error(`Error calculating leased property percentage for adminId=${adminId}:`, error);
    throw error;
  }
}

const leaseService = {
    getLeasesByAdminId,
    createLease,
    generateLeaseId,
    generateBookingId,
    countActiveLeasesByAdminId,
    validateDate,
    updateLeaseStatusesByAdmin,
    updateAllLeaseStatuses,
    getLeasedPropertyPercentage
};

export default leaseService;