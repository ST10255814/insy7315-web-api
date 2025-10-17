
import * as validation from '../utils/validation.js';
import Object from '../utils/ObjectIDConvert.js';
import { generateInvoiceId } from '../utils/idGenerator.js';
import { generateInvoiceDescription, formatCurrency, truncateText } from '../utils/invoiceHelpers.js';
import { determineInvoiceStatus } from '../utils/statusManager.js';
import dbOperations from '../utils/dbOperations.js';
import { 
  getInvoicesFromDB, 
  createInvoiceInDB, 
  findLeaseByLeaseId, 
  markInvoiceAsPaidInDB,
  getInvoiceStatsFromDB,
  regenerateDescriptionsInDB
} from '../utils/invoiceDbOperations.js';

const { toObjectId } = Object;

//create invoice
async function createInvoice(adminId, data){
    try{
        const {leaseId, description, date, amount } = data;

        //validate inputs - description is now optional as we'll auto-generate it
        if(!leaseId || !date || !amount){
            throw new Error("Lease ID, date, and amount are required");
        }

        // NOTE TO GERHARD: Adjust validation :)
        if(description) validation.sanitizeInput(description);
        validation.validateStartDate(date);
        validation.validateRentAmount(amount);

        //find lease by leaseId
        const lease = await findLeaseByLeaseId(leaseId);

        if(!lease){
            throw new Error("Lease not found with the provided Lease ID");
        }

        //create lease object
        const leaseObject = {
            tenant: lease.tenant.fullname,
            email: lease.tenant.email,
            propertyAddress: lease.listing.address,
        }

        // Generate automatic description if not provided
        const autoDescription = description || generateInvoiceDescription({
            tenantName: lease.tenant.fullname,
            propertyAddress: lease.listing.address,
            amount: amount,
            date: date,
            status: "Pending"
        });

        //create invoice object
        const invoiceId = await generateInvoiceId();
        const invoice = {
            invoiceId: invoiceId,
            adminId: toObjectId(adminId),
            lease: leaseObject,
            description: autoDescription,
            originalDescription: description || null, // Store original if provided
            amount,
            date, 
            status: "Pending",
            createdAt: new Date(),
            lastStatusUpdate: new Date()
        }

        //insert invoice into collection
        await createInvoiceInDB(invoice);
        return invoiceId;
    } catch (err) {
        throw new Error("Error creating invoice: " + err.message);
    }
}

async function getInvoicesByAdminId(adminId) {
  try {
    if (!adminId) {
      throw new Error("Admin ID is required");
    }
    
    const { invoices, invoicesCollection } = await getInvoicesFromDB(adminId);
    console.log(`Found ${invoices.length} invoices for admin ${adminId}`);

    // Update invoice statuses in real-time
    const updatedInvoices = await Promise.all(
      invoices.map(async (invoice, index) => {
        try {
          const currentStatus = invoice.status;
          
          // Check if date exists
          if (!invoice.date) {
            console.warn(`Invoice ${invoice._id} missing date`);
            return invoice; // Return invoice as-is if date is missing
          }

          const newStatus = determineInvoiceStatus(invoice.date, currentStatus);

          // If status changed, update in database with new description
          if (currentStatus !== newStatus) {
            console.log(`Updating invoice ${invoice.invoiceId} status from ${currentStatus} to ${newStatus}`);
            
            // Generate updated description based on new status
            const updatedDescription = generateInvoiceDescription({
              tenantName: invoice.lease.tenant,
              propertyAddress: invoice.lease.propertyAddress,
              amount: invoice.amount,
              date: invoice.date,
              status: newStatus
            });

            await invoicesCollection.updateOne(
              { _id: invoice._id },
              { 
                $set: { 
                  status: newStatus,
                  description: updatedDescription,
                  lastStatusUpdate: new Date()
                }
              }
            );
            invoice.status = newStatus;
            invoice.description = updatedDescription;
            invoice.lastStatusUpdate = new Date();
          }

          return invoice;
        } catch (invoiceError) {
          console.error(`Error processing invoice ${invoice._id}:`, invoiceError);
          // Return the invoice as-is if there's an error processing it
          return invoice;
        }
      })
    );

    console.log(`Successfully processed ${updatedInvoices.length} invoices`);
    return updatedInvoices;
  } catch (err) {
    console.error("Error in getInvoicesByAdminId:", err);
    throw new Error("Error fetching invoices: " + err.message);
  }
}

// Wrapper functions that use the utility modules
async function updateInvoiceStatusesByAdmin(adminId) {
  return await updateStatusesByAdmin(adminId);
}

async function updateAllInvoiceStatuses() {
  return await updateAllStatuses();
}

async function markInvoiceAsPaid(invoiceId, adminId) {
  try {
    const result = await markInvoiceAsPaidInDB(invoiceId, adminId);
    
    if (!result.found) {
      throw new Error("Invoice not found or unauthorized");
    }

    return result.modified;
  } catch (err) {
    throw new Error("Error marking invoice as paid: " + err.message);
  }
}

async function getInvoiceStats(adminId) {
  try {
    const stats = await getInvoiceStatsFromDB(adminId);

    // Transform the result into a more readable format
    const statsObj = {
      pending: { count: 0, totalAmount: 0 },
      overdue: { count: 0, totalAmount: 0 },
      paid: { count: 0, totalAmount: 0 },
      total: { count: 0, totalAmount: 0 }
    };

    stats.forEach(stat => {
      const status = stat._id.toLowerCase();
      if (statsObj[status]) {
        statsObj[status] = {
          count: stat.count,
          totalAmount: stat.totalAmount
        };
      }
      statsObj.total.count += stat.count;
      statsObj.total.totalAmount += stat.totalAmount;
    });

    return statsObj;
  } catch (err) {
    throw new Error("Error fetching invoice statistics: " + err.message);
  }
}

async function regenerateAllInvoiceDescriptions(adminId = null) {
  try {
    console.log('Starting invoice description regeneration...');
    const updatedCount = await regenerateDescriptionsInDB(adminId);
    console.log(`Description regeneration completed. Updated ${updatedCount} invoices.`);
    return updatedCount;
  } catch (error) {
    console.error('Error regenerating invoice descriptions:', error);
    throw error;
  }
}

export default {
    createInvoice,
    getInvoicesByAdminId,
    generateInvoiceId,
    generateInvoiceDescription,
    validateInvoiceDate: determineInvoiceStatus, // Use new utility function
    updateInvoiceStatusesByAdmin,
    updateAllInvoiceStatuses,
    markInvoiceAsPaid,
    getInvoiceStats,
    regenerateAllInvoiceDescriptions
};
