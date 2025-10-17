import cron from 'node-cron';
import { client } from '../utils/db.js';
import leaseService from '../Services/leaseService.js';
import invoiceService from '../Services/invoiceService.js';

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

// Function to update all invoice statuses
async function updateAllInvoiceStatuses() {
  try {
    console.log('Starting scheduled invoice status update...');
    
    const db = client.db("RentWise");
    const invoicesCollection = db.collection("Invoices");

    // Get all invoices that are not already paid
    const invoices = await invoicesCollection
      .find({ 
        status: { $in: ["Pending", "Overdue"] } 
      })
      .toArray();

    let updatedCount = 0;

    for (const invoice of invoices) {
      const currentStatus = invoice.status;
      const newStatus = await invoiceService.validateInvoiceDate(invoice.date);

      // Only update if status has changed
      if (currentStatus !== newStatus) {
        await invoicesCollection.updateOne(
          { _id: invoice._id },
          { 
            $set: { 
              status: newStatus,
              lastStatusUpdate: new Date()
            }
          }
        );
        updatedCount++;
        console.log(`Updated invoice ${invoice.invoiceId} from ${currentStatus} to ${newStatus}`);
      }
    }

    console.log(`Invoice status update completed. Updated ${updatedCount} invoices.`);
    return updatedCount;
  } catch (error) {
    console.error('Error updating invoice statuses:', error);
    throw error;
  }
}
// Function to start the scheduled tasks
function startStatusScheduler() {
  // PRIMARY SCHEDULE: Run every day at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily status updates...');
    try {
      await updateAllLeaseStatuses();
      await updateAllInvoiceStatuses();
      console.log('Daily status updates completed successfully');
    } catch (error) {
      console.error('Error during daily status updates:', error);
    }
  });
  console.log('Status scheduler started - Daily updates at midnight');
}

// Function to manually trigger status updates (useful for testing)
async function manualStatusUpdate() {
  try {
    console.log('Starting manual status update...');
    const leaseUpdates = await updateAllLeaseStatuses();
    const invoiceUpdates = await updateAllInvoiceStatuses();
    console.log(`Manual update completed - Leases: ${leaseUpdates}, Invoices: ${invoiceUpdates}`);
    return { leaseUpdates, invoiceUpdates };
  } catch (error) {
    console.error('Error during manual status update:', error);
    throw error;
  }
}

export { startStatusScheduler, manualStatusUpdate, updateAllLeaseStatuses, updateAllInvoiceStatuses };