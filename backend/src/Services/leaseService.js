import { client } from "../utils/db.js";
import Object from '../utils/ObjectIDConvert.js';
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
          
          // Check if bookingDetails and dates exist
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
    const userCollection = db.collection('System-Users');
    const leasesCollection = db.collection("Leases");

    // Verify booking exists
    const booking = await bookingsCollection.findOne({ _id: toObjectId(bookingID) });
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
        //firstName: userID.firstName,
        //surname: userID.surname,
        fullname: userID.name,
        email: userID.email
    }

    //create listing object with address 
    const listing = {
        listingId : booking.listingDetail.listingID,
        address: booking.listingDetail.address
    }

    const bookingIDGenerated = await generateBookingId();

    //create booking details object with startDate, endDate and rentAmount
    const bookingDetails = {
        bookingId: bookingIDGenerated,
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

    const result = await leasesCollection.insertOne(lease);
    return result.insertedId;
  } catch (err) {
    throw new Error("Error creating lease: " + err.message);
  }
}

//auto ID generation for leases
//ID format example L-0001, L-0002, etc.
async function generateLeaseId() {
  try {
    const db = client.db("RentWise");
    const leasesCollection = db.collection("Leases");

    // Find the lease with the highest leaseId number
    const lastLease = await leasesCollection
      .findOne(
        { leaseId: { $exists: true } },
        { sort: { leaseId: -1 } }
      );

    let nextNumber = 1;
    
    if (lastLease && lastLease.leaseId) {
      // Extract the number from the lease ID (e.g., "L-0001" -> 1)
      const lastNumber = parseInt(lastLease.leaseId.split('-')[1]);
      nextNumber = lastNumber + 1;
    }

    // Format the number with leading zeros (4 digits)
    const formattedNumber = nextNumber.toString().padStart(4, '0');
    return `L-${formattedNumber}`;
  } catch (err) {
    throw new Error("Error generating lease ID: " + err.message);
  }
}

//auto ID generation for bookings
//ID format example B-0001, B-0002, etc.
async function generateBookingId() {
  try {
    const db = client.db("RentWise");
    const bookingsCollection = db.collection("Bookings");

    // Find the booking with the highest bookingId number
    const lastBooking = await bookingsCollection
      .findOne(
        { bookingId: { $exists: true } },
        { sort: { bookingId: -1 } }
      );

    let nextNumber = 1;

    if (lastBooking && lastBooking.bookingId) {
      // Extract the number from the booking ID (e.g., "B-0001" -> 1)
      const lastNumber = parseInt(lastBooking.bookingId.split('-')[1]);
      nextNumber = lastNumber + 1;
    }

    // Format the number with leading zeros (4 digits)
    const formattedNumber = nextNumber.toString().padStart(4, '0');
    return `B-${formattedNumber}`;
  } catch (err) {
    throw new Error("Error generating booking ID: " + err.message);
  }
}

//compare startDate and endDate to today's date
//if startDate has passed today's date, and endDate is still before today's date, set status to "Active"
async function validateDate(startDate, endDate) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    // Helper function to parse dates flexibly
    const parseDate = (dateInput) => {
      // If already a Date object, return it
      if (dateInput instanceof Date) {
        return new Date(dateInput);
      }
      
      // If it's a string, try different parsing methods
      if (typeof dateInput === 'string') {
        // Try DD-MM-YYYY format first
        if (dateInput.includes('-') && dateInput.split('-').length === 3) {
          const parts = dateInput.split('-');
          // Check if it's DD-MM-YYYY or YYYY-MM-DD
          if (parts[0].length === 4) {
            // YYYY-MM-DD format
            return new Date(parts[0], parts[1] - 1, parts[2]);
          } else {
            // DD-MM-YYYY format
            return new Date(parts[2], parts[1] - 1, parts[0]);
          }
        }
        // Fall back to native Date parsing
        return new Date(dateInput);
      }
      
      // If it's a number (timestamp), create Date object
      if (typeof dateInput === 'number') {
        return new Date(dateInput);
      }
      
      throw new Error(`Unable to parse date: ${dateInput}`);
    };
    
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    
    // Validate that dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error(`Invalid date values: start=${startDate}, end=${endDate}`);
      return "Pending"; // Return safe default
    }
    
    // Set times to start of day for accurate comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999); // End date should include the full day
    
    if (start <= today && end >= today) {
      return "Active";
    } else if (end < today) {
      return "Expired";
    } else {
      return "Pending";
    }
  } catch (error) {
    console.error('Error parsing dates:', error, 'startDate:', startDate, 'endDate:', endDate);
    // Return a safe default status instead of throwing
    return "Pending";
    
    if (start <= today && end >= today) {
      return "Active";
    } else if (end < today) {
      return "Expired";
    } else {
      return "Pending";
    }
  }
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

const leaseService = {
    getLeasesByAdminId,
    createLease,
    generateLeaseId,
    generateBookingId,
    validateDate,
    updateLeaseStatusesByAdmin,
    updateAllLeaseStatuses
};

export default leaseService;