import cron from 'node-cron';
import { client } from '../utils/db.js';
import leaseService from '../Services/leaseService.js';

// Function to update all lease statuses
async function updateAllLeaseStatuses() {
  try {
    console.log('Starting scheduled lease status update...');
    
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
      const newStatus = await leaseService.validateDate(
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

// Function to start the scheduled task
function startLeaseStatusScheduler() {
  // PRIMARY SCHEDULE: Run every day at midnight (00:00)
  cron.schedule('0 0 * * *', () => {
    console.log('Running daily lease status update...');
    updateAllLeaseStatuses();
  });

  // OPTIONAL: Uncomment for more frequent updates during business hours
  // Run every 2 hours from 8 AM to 8 PM
  // cron.schedule('0 8-20/2 * * *', () => {
  //   console.log('Running business hours lease status update...');
  //   updateAllLeaseStatuses();
  // });

  // OPTIONAL: For testing - run every 5 minutes (comment out for production)
  // cron.schedule('*/5 * * * *', () => {
  //   console.log('Running test lease status update...');
  //   updateAllLeaseStatuses();
  // });

  console.log('Lease status scheduler started - Daily updates at midnight');
}

// Function to manually trigger status update (useful for testing)
async function manualStatusUpdate() {
  return await updateAllLeaseStatuses();
}

export { startLeaseStatusScheduler, manualStatusUpdate, updateAllLeaseStatuses };