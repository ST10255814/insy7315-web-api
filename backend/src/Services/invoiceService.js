
import { client } from "../utils/db.js";
import * as validation from '../utils/validation.js'
import Object from '../utils/ObjectIDConvert.js';
const { toObjectId } = Object;

//auto ID generation for invoiceID 
// format example I-0001, I-0002, etc.
async function generateInvoiceId() {
  try {
    const db = client.db("RentWise");
    const invoicesCollection = db.collection("Invoices");

    // Find the invoice with the highest invoiceId number
    const lastInvoice = await invoicesCollection
      .findOne(
        { invoiceId: { $exists: true } },
        { sort: { invoiceId: -1 } }
      );

    let nextNumber = 1;

    if (lastInvoice && lastInvoice.invoiceId) {
      // Extract the number from the invoice ID (e.g., "I-0001" -> 1)
      const lastNumber = parseInt(lastInvoice.invoiceId.split('-')[1]);
      nextNumber = lastNumber + 1;
    }

    // Format the number with leading zeros (4 digits)
    const formattedNumber = nextNumber.toString().padStart(4, '0');
    return `I-${formattedNumber}`;
  } catch (err) {
    throw new Error("Error generating invoice ID: " + err.message);
  }
}

//create invoice
async function createInvoice(adminId, data){
    try{
        const db = client.db("RentWise");
        const invoicesCollection = db.collection("Invoices");
        const leaseCollection = db.collection("Leases");

        const {leaseId, description, date, amount } = data;

        //validate inputs
        if(!leaseId || !description || !date || !amount){
            throw new Error("All fields are required");
        }

        // NOTE TO GERHARD: Adjust validation :)
        validation.sanitizeInput(description);
        validation.validateStartDate(date);
        validation.validateRentAmount(amount);

        //find lease by leaseId
        const lease = await leaseCollection.findOne({leaseId: leaseId});

        if(!lease){
            throw new Error("Lease not found with the provided Lease ID");
        }

        //create lease object
        const leaseObject = {
            tenant: lease.tenant.fullname,
            email: lease.tenant.email,
            propertyAddress: lease.listing.address,
        }

        //create invoice object
        const invoiceId = await generateInvoiceId();
        const invoice = {
            invoiceId: invoiceId,
            adminId: toObjectId(adminId),
            lease: leaseObject,
            description,
            amount,
            date, 
            status: "Pending",
        }

        //insert invoice into collection
        const result = await invoicesCollection.insertOne(invoice);
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
    
    const db = client.db("RentWise");
    const invoicesCollection = db.collection("Invoices");

    const invoices = await invoicesCollection
      .find({ adminId: toObjectId(adminId) })
      .toArray();

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

          const newStatus = await validateInvoiceDate(invoice.date);

          // If status changed, update in database
          if (currentStatus !== newStatus) {
            console.log(`Updating invoice ${invoice.invoiceId} status from ${currentStatus} to ${newStatus}`);
            await invoicesCollection.updateOne(
              { _id: invoice._id },
              { 
                $set: { 
                  status: newStatus,
                  lastStatusUpdate: new Date()
                }
              }
            );
            invoice.status = newStatus;
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

//compare invoice date to today's date to determine status
//if invoice date has passed today's date, set status to "Overdue"
//if invoice date is today or in the future, keep status as "Pending"
async function validateInvoiceDate(invoiceDate) {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of day for accurate comparison
    
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
    
    const dueDate = parseDate(invoiceDate);
    
    // Validate that date is valid
    if (isNaN(dueDate.getTime())) {
      console.error(`Invalid invoice date: ${invoiceDate}`);
      return "Pending"; // Return safe default
    }
    
    // Set time to end of day for accurate comparison
    dueDate.setHours(23, 59, 59, 999);
    
    if (dueDate < today) {
      return "Overdue";
    } else {
      return "Pending";
    }
  } catch (error) {
    console.error('Error parsing invoice date:', error, 'invoiceDate:', invoiceDate);
    // Return a safe default status instead of throwing
    return "Pending";
  }
}

// Function to update all invoice statuses for a specific admin
async function updateInvoiceStatusesByAdmin(adminId) {
  try {
    const db = client.db("RentWise");
    const invoicesCollection = db.collection("Invoices");

    const invoices = await invoicesCollection
      .find({ 
        adminId: toObjectId(adminId),
        status: { $in: ["Pending", "Overdue"] } // Only check non-paid invoices
      })
      .toArray();

    let updatedCount = 0;

    for (const invoice of invoices) {
      const currentStatus = invoice.status;
      const newStatus = await validateInvoiceDate(invoice.date);

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
    console.log('Starting invoice status update for all admins...');
    
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
      const newStatus = await validateInvoiceDate(invoice.date);

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

// Function to mark an invoice as paid
async function markInvoiceAsPaid(invoiceId, adminId) {
  try {
    const db = client.db("RentWise");
    const invoicesCollection = db.collection("Invoices");

    const result = await invoicesCollection.updateOne(
      { 
        invoiceId: invoiceId,
        adminId: toObjectId(adminId)
      },
      { 
        $set: { 
          status: "Paid",
          paidDate: new Date(),
          lastStatusUpdate: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      throw new Error("Invoice not found or unauthorized");
    }

    return result.modifiedCount > 0;
  } catch (err) {
    throw new Error("Error marking invoice as paid: " + err.message);
  }
}

// Function to get invoice statistics for an admin
async function getInvoiceStats(adminId) {
  try {
    const db = client.db("RentWise");
    const invoicesCollection = db.collection("Invoices");

    const stats = await invoicesCollection.aggregate([
      { $match: { adminId: toObjectId(adminId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }
      }
    ]).toArray();

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

export default {
    createInvoice,
    getInvoicesByAdminId,
    generateInvoiceId,
    validateInvoiceDate,
    updateInvoiceStatusesByAdmin,
    updateAllInvoiceStatuses,
    markInvoiceAsPaid,
    getInvoiceStats
};
