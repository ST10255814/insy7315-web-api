import cron from 'node-cron';
import { client } from '../utils/db.js';
import leaseService from '../Services/leaseService.js';
import invoiceService from '../Services/invoiceService.js';
import revenueService from '../Services/revenueService.js';
import { determineLeaseStatus } from '../utils/statusManager.js';

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
      const newStatus = determineLeaseStatus(
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

// Function to calculate and store monthly revenue for all admins
async function calculateMonthlyRevenueForAllAdmins() {
  try {
    console.log('Starting monthly revenue calculation for all admins...');
    
    const currentDate = new Date();
    // For testing purposes, calculate for the current month
    // In production, you might want to calculate for the previous month
    let targetMonth = currentDate.getMonth() + 1; // Convert from 0-indexed to 1-indexed (1-12)
    let targetYear = currentDate.getFullYear();
    
    // If you want to calculate for previous month instead, uncomment below:
    // targetMonth = currentDate.getMonth(); // 0-indexed month
    // if (targetMonth === 0) {
    //   targetMonth = 12;
    //   targetYear -= 1;
    // }

    console.log(`Calculating revenue for month: ${targetMonth}, year: ${targetYear}`);

    const results = await revenueService.processAllAdminRevenue(targetMonth, targetYear);
    
    console.log(`Monthly revenue calculation completed:
      - Processed admins: ${results.processedAdmins}
      - Total revenue: R${results.totalRevenue}
      - Errors: ${results.errors.length}`);
    
    if (results.errors.length > 0) {
      console.log('Errors encountered:');
      results.errors.forEach(error => {
        console.log(`  - Admin ${error.adminName} (${error.adminId}): ${error.error}`);
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error calculating monthly revenue for all admins:', error);
    throw error;
  }
}

// Function to clean up zero-revenue records from the database
async function cleanupZeroRevenueRecords() {
  try {
    console.log('Starting cleanup of zero-revenue records...');
    
    const db = client.db("RentWise");
    const revenueCollection = db.collection("MonthlyRevenue");
    
    // Find and delete all records with totalRevenue = 0
    const deleteResult = await revenueCollection.deleteMany({ 
      totalRevenue: 0 
    });
    
    console.log(`Cleanup completed: Removed ${deleteResult.deletedCount} zero-revenue records`);
    return deleteResult.deletedCount;
  } catch (error) {
    console.error('Error during zero-revenue cleanup:', error);
    throw error;
  }
}

// Function to calculate historical revenue for all missing months
async function calculateHistoricalRevenue() {
  try {
    console.log('Starting historical revenue calculation...');
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 1-indexed
    
    // Calculate revenue for all months in 2025 up to the current month
    const monthsToCalculate = [];
    for (let month = 1; month <= currentMonth; month++) {
      monthsToCalculate.push({ month, year: currentYear });
    }
    
    console.log(`Will calculate revenue for ${monthsToCalculate.length} months: ${monthsToCalculate.map(m => `${m.month}/${m.year}`).join(', ')}`);
    
    const allResults = {
      totalMonthsProcessed: 0,
      totalRevenue: 0,
      monthlyResults: [],
      errors: []
    };
    
    for (const { month, year } of monthsToCalculate) {
      try {
        console.log(`\n--- Calculating revenue for ${month}/${year} ---`);
        const results = await revenueService.processAllAdminRevenue(month, year);
        
        allResults.totalMonthsProcessed++;
        allResults.totalRevenue += results.totalRevenue;
        allResults.monthlyResults.push({
          month,
          year,
          revenue: results.totalRevenue,
          adminsProcessed: results.processedAdmins
        });
        
        if (results.errors.length > 0) {
          allResults.errors.push(...results.errors);
        }
        
        if (results.totalRevenue > 0) {
          console.log(`✓ ${month}/${year}: R${results.totalRevenue} from ${results.processedAdmins} admins`);
        } else {
          console.log(`⚪ ${month}/${year}: R0 - skipped (no revenue to record)`);
        }
      } catch (monthError) {
        console.error(`Error calculating revenue for ${month}/${year}:`, monthError);
        allResults.errors.push({
          month,
          year,
          error: monthError.message
        });
      }
    }
    
    console.log('\n--- Historical Revenue Calculation Summary ---');
    console.log(`Total months processed: ${allResults.totalMonthsProcessed}`);
    console.log(`Total revenue calculated: R${allResults.totalRevenue}`);
    console.log('Monthly breakdown:');
    allResults.monthlyResults.forEach(result => {
      console.log(`  ${result.month}/${result.year}: R${result.revenue} (${result.adminsProcessed} admins)`);
    });
    
    if (allResults.errors.length > 0) {
      console.log(`Errors encountered: ${allResults.errors.length}`);
    }
    
    return allResults;
  } catch (error) {
    console.error('Error during historical revenue calculation:', error);
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
  
  // MONTHLY REVENUE SCHEDULE: Run on the 1st of every month at 02:00 AM
  cron.schedule('* * * * *', async () => {
    console.log('Running monthly revenue calculation...');
    try {
      await calculateMonthlyRevenueForAllAdmins();
      console.log('Monthly revenue calculation completed successfully');
    } catch (error) {
      console.error('Error during monthly revenue calculation:', error);
    }
  });
  
  console.log('Status scheduler started - Daily updates at midnight, Monthly revenue calculation on 1st at 2 AM');
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

// Function to manually trigger revenue calculation (useful for testing)
async function manualRevenueCalculation(month = null, year = null) {
  try {
    console.log('Starting manual revenue calculation...');
    
    const currentDate = new Date();
    // Default to current month for testing
    const targetMonth = month || (currentDate.getMonth() + 1); // Convert to 1-indexed
    const targetYear = year || currentDate.getFullYear();
    
    console.log(`Manual calculation for month: ${targetMonth}, year: ${targetYear}`);
    
    const results = await revenueService.processAllAdminRevenue(targetMonth, targetYear);
    console.log(`Manual revenue calculation completed - Processed: ${results.processedAdmins} admins, Total: R${results.totalRevenue}`);
    return results;
  } catch (error) {
    console.error('Error during manual revenue calculation:', error);
    throw error;
  }
}

export { 
  startStatusScheduler, 
  manualStatusUpdate, 
  manualRevenueCalculation,
  updateAllLeaseStatuses, 
  updateAllInvoiceStatuses,
  calculateMonthlyRevenueForAllAdmins,
  calculateHistoricalRevenue,
  cleanupZeroRevenueRecords
};