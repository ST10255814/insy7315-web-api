
import { client } from "../utils/db.js";
import * as validation from '../utils/validation.js';
import Object from '../utils/ObjectIDConvert.js';
import { generateInvoiceId } from '../utils/idGenerator.js';
import { generateInvoiceDescription } from '../utils/invoiceHelpers.js';
import { determineInvoiceStatus } from '../utils/statusManager.js';
import {
  getInvoicesFromDB,
  getInvoiceFromDB,
  deleteInvoiceFromDB,
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
        const db = client.db("RentWise");
        const activityCollection = db.collection("User-Activity-Logs");

        console.log("[invoiceService.createInvoice] Received data:", data);
        console.log("[invoiceService.createInvoice] AdminId:", adminId);

        const {leaseId, description, date, amount } = data;

        console.log("[invoiceService.createInvoice] Extracted leaseId:", leaseId);

        //validate inputs - description is now optional as we'll auto-generate it
        if(!leaseId || !date || !amount){
            throw new Error("Lease ID, date, and amount are required");
        }

        // NOTE TO GERHARD: Adjust validation :)
        if(description) validation.sanitizeInput(description);
        validation.validateStartDate(date);
        validation.validateRentAmount(amount);

        //find lease by leaseId
        console.log("[invoiceService.createInvoice] Searching for lease with leaseId:", leaseId);
        const lease = await findLeaseByLeaseId(leaseId);

        console.log("[invoiceService.createInvoice] Found lease:", lease ? "Yes" : "No");
        if (lease) {
            console.log("[invoiceService.createInvoice] Lease details:", JSON.stringify(lease, null, 2));
        }

        if(!lease){
            throw new Error("Lease not found with the provided Lease ID");
        }

        //create lease object
        const leaseObject = {
            leaseId: lease.leaseId,
            tenant: lease.tenant.firstName + " " + lease.tenant.surname,
            email: lease.tenant.email,
            propertyAddress: lease.listing.address,
            leaseStatus: lease.status
        }

        // Generate automatic description if not provided
        const autoDescription = description || generateInvoiceDescription({
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

        const activityLog = {
            action: 'Create Invoice',
            adminId: toObjectId(adminId),
            detail: `Created invoice ${invoiceId} for lease ${leaseId}`,
            timestamp: new Date()
        };
        await activityCollection.insertOne(activityLog);

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
      invoices.map(async (invoice, _index) => {
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

// Get invoice by ID
async function getInvoiceById(invoiceId, adminId) {
  try {
    if (!invoiceId || !adminId) {
      throw new Error("Invoice ID and Admin ID are required");
    }

    const invoice = await getInvoiceFromDB(invoiceId, adminId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    return invoice;
  } catch (err) {
    throw new Error("Error fetching invoice: " + err.message);
  }
}

// Delete invoice by ID
async function deleteInvoiceById(invoiceId, adminId) {
  try {
    const db = client.db("RentWise");
    const activityCollection = db.collection("User-Activity-Logs");

    if (!invoiceId || !adminId) {
      throw new Error("Invoice ID and Admin ID are required");
    }

    // Validate and sanitize invoiceId to prevent NoSQL injection
    if (typeof invoiceId !== 'string') {
      throw new Error("Invalid invoice ID format");
    }
    
    const sanitizedInvoiceId = invoiceId.replace(/[^a-zA-Z0-9_-]/g, '');
    if (sanitizedInvoiceId !== invoiceId) {
      throw new Error("Invalid characters in invoice ID");
    }

    const result = await deleteInvoiceFromDB(sanitizedInvoiceId, adminId);
    if (!result) {
      throw new Error("Invoice not found or unauthorized");
    }

    const activityLog = {
      action: 'Delete Invoice',
      adminId: toObjectId(adminId),
      detail: `Deleted invoice ${sanitizedInvoiceId}`,
      timestamp: new Date()
    };

    await activityCollection.insertOne(activityLog);

    return result;
  } catch (err) {
    throw new Error("Error deleting invoice: " + err.message);
  }
}

// Function to update all invoice statuses for a specific admin
async function updateInvoiceStatusesByAdmin(adminId) {
  try {
    const { invoices, invoicesCollection } = await getInvoicesFromDB(adminId);
    let updatedCount = 0;

    for (const invoice of invoices) {
      const currentStatus = invoice.status;
      
      if (!invoice.date) continue;
      
      const newStatus = determineInvoiceStatus(invoice.date, currentStatus);

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
      }
    }

    return updatedCount;
  } catch (err) {
    throw new Error("Error updating invoice statuses: " + err.message);
  }
}

// Function to update ALL invoice statuses across ALL admins (for scheduled tasks)
async function updateAllInvoiceStatuses() {
  try {
    const db = client.db("RentWise");
    const invoicesCollection = db.collection("Invoices");

    const invoices = await invoicesCollection
      .find({ 
        status: { $in: ["Pending", "Active", "Overdue"] } 
      })
      .toArray();

    let updatedCount = 0;

    for (const invoice of invoices) {
      const currentStatus = invoice.status;
      
      if (!invoice.date) continue;
      
      const newStatus = determineInvoiceStatus(invoice.date, currentStatus);

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
      }
    }

    return updatedCount;
  } catch (error) {
    throw new Error("Error updating all invoice statuses: " + error.message);
  }
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

async function returnInvoiceData(invoiceId, adminId){
  try{
    const invoice = await getInvoiceById(invoiceId, adminId);

    const invoiceData = {
      invoiceId: invoice.invoiceId,
      dueDate: invoice.date,
      tenantName: invoice.lease.tenant,
      tenantEmail: invoice.lease.email,
      leaseId: invoice.lease.leaseId,
      leaseStatus: invoice.lease.leaseStatus,
      status: invoice.status,
      propertyAddress: invoice.lease.propertyAddress,
      amount: invoice.amount
    }

    return invoiceData;
  } catch (error) {
    throw new Error(`Error returning invoice data: ${error.message}`);
  }
}

export default {
    createInvoice,
    getInvoicesByAdminId,
    getInvoiceById,
    deleteInvoiceById,
    generateInvoiceId,
    generateInvoiceDescription,
    validateInvoiceDate: determineInvoiceStatus, // Use new utility function
    updateInvoiceStatusesByAdmin,
    updateAllInvoiceStatuses,
    markInvoiceAsPaid,
    returnInvoiceData,
    getInvoiceStats,
    regenerateAllInvoiceDescriptions,
};
