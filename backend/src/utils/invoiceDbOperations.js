import { client } from "../utils/db.js";
import Object from '../utils/ObjectIDConvert.js';
import { generateInvoiceDescription } from '../utils/invoiceHelpers.js';

const { toObjectId } = Object;

/**
 * Invoice-specific database operations
 * Contains database logic specific to invoice management
 */

/**
 * Get invoices by admin ID from database
 * 
 * @param {string} adminId - Admin ID to filter by
 * @returns {Promise<Object>} Object containing invoices and collection reference
 */
export async function getInvoicesFromDB(adminId) {
  try {
    const db = client.db("RentWise");
    const invoicesCollection = db.collection("Invoices");

    const invoices = await invoicesCollection
      .find({ adminId: toObjectId(adminId) })
      .toArray();

    return { invoices, invoicesCollection };
  } catch (err) {
    throw new Error("Error fetching invoices from database: " + err.message);
  }
}

/**
 * Create invoice in database
 * 
 * @param {Object} invoiceData - Invoice data to insert
 * @returns {Promise<Object>} Insert result
 */
export async function createInvoiceInDB(invoiceData) {
  try {
    const db = client.db("RentWise");
    const invoicesCollection = db.collection("Invoices");

    const result = await invoicesCollection.insertOne(invoiceData);
    return result;
  } catch (err) {
    throw new Error("Error creating invoice in database: " + err.message);
  }
}

/**
 * Find lease by lease ID
 * 
 * @param {string} leaseId - Lease ID to search for
 * @returns {Promise<Object|null>} Lease document or null
 */
export async function findLeaseByLeaseId(leaseId) {
  try {
    const db = client.db("RentWise");
    const leaseCollection = db.collection("Leases");

    console.log("[invoiceDbOperations.findLeaseByLeaseId] Searching for leaseId:", leaseId);
    console.log("[invoiceDbOperations.findLeaseByLeaseId] leaseId type:", typeof leaseId);
    
    const lease = await leaseCollection.findOne({ leaseId: leaseId });
    
    console.log("[invoiceDbOperations.findLeaseByLeaseId] Result:", lease ? "Found" : "Not found");
    
    // Also try to see if there are any leases at all
    if (!lease) {
      const sampleLease = await leaseCollection.findOne({});
      console.log("[invoiceDbOperations.findLeaseByLeaseId] Sample lease in DB:", sampleLease ? JSON.stringify({ _id: sampleLease._id, leaseId: sampleLease.leaseId }) : "No leases found");
    }
    
    return lease;
  } catch (err) {
    console.error("[invoiceDbOperations.findLeaseByLeaseId] Error:", err);
    throw new Error("Error finding lease: " + err.message);
  }
}

/**
 * Mark invoice as paid in database
 * 
 * @param {string} invoiceId - Invoice ID
 * @param {string} adminId - Admin ID
 * @returns {Promise<Object>} Update result with found and modified flags
 */
export async function markInvoiceAsPaidInDB(invoiceId, adminId) {
  try {
    const db = client.db("RentWise");
    const invoicesCollection = db.collection("Invoices");

    // First get the invoice to generate updated description
    const invoice = await invoicesCollection.findOne({
      invoiceId: invoiceId,
      adminId: toObjectId(adminId)
    });

    if (!invoice) {
      return { found: false };
    }

    // Generate updated description for paid status
    const updatedDescription = generateInvoiceDescription({
      tenantName: invoice.lease.tenant,
      propertyAddress: invoice.lease.propertyAddress,
      amount: invoice.amount,
      date: invoice.date,
      status: "Paid"
    });

    const result = await invoicesCollection.updateOne(
      { 
        invoiceId: invoiceId,
        adminId: toObjectId(adminId)
      },
      { 
        $set: { 
          status: "Paid",
          description: updatedDescription,
          paidDate: new Date(),
          lastStatusUpdate: new Date()
        }
      }
    );

    return { found: true, modified: result.modifiedCount > 0 };
  } catch (err) {
    throw new Error("Error marking invoice as paid in database: " + err.message);
  }
}

/**
 * Get invoice statistics from database
 * 
 * @param {string} adminId - Admin ID to filter by
 * @returns {Promise<Array>} Statistics array
 */
export async function getInvoiceStatsFromDB(adminId) {
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

    return stats;
  } catch (err) {
    throw new Error("Error fetching invoice statistics from database: " + err.message);
  }
}

/**
 * Regenerate descriptions for all invoices in database
 * 
 * @param {string|null} adminId - Admin ID to filter by (null for all)
 * @returns {Promise<number>} Number of updated invoices
 */
export async function regenerateDescriptionsInDB(adminId = null) {
  try {
    const db = client.db("RentWise");
    const invoicesCollection = db.collection("Invoices");

    // Build query - if adminId provided, only update that admin's invoices
    const query = adminId ? { adminId: toObjectId(adminId) } : {};
    
    const invoices = await invoicesCollection.find(query).toArray();
    let updatedCount = 0;

    for (const invoice of invoices) {
      try {
        // Generate new description based on current status
        const newDescription = generateInvoiceDescription({
          tenantName: invoice.lease.tenant,
          propertyAddress: invoice.lease.propertyAddress,
          amount: invoice.amount,
          date: invoice.date,
          status: invoice.status
        });

        // Only update if description actually changed
        if (invoice.description !== newDescription) {
          await invoicesCollection.updateOne(
            { _id: invoice._id },
            { 
              $set: { 
                description: newDescription,
                lastDescriptionUpdate: new Date()
              }
            }
          );
          updatedCount++;
        }
      } catch (error) {
        console.error(`Error updating description for invoice ${invoice.invoiceId}:`, error);
      }
    }

    return updatedCount;
  } catch (error) {
    throw new Error("Error regenerating descriptions in database: " + error.message);
  }
}

// Export all functions
const invoiceDbOperations = {
  getInvoicesFromDB,
  createInvoiceInDB,
  findLeaseByLeaseId,
  markInvoiceAsPaidInDB,
  getInvoiceStatsFromDB,
  regenerateDescriptionsInDB
};

export default invoiceDbOperations;