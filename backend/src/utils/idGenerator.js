import { client } from "./db.js";
import { generateUniqueId, unregisterExistingId } from "./globalIdTracker.js";

/**
 * Legacy ID generator for backward compatibility
 * NOTE: This is deprecated - use the new collision-safe generators below
 * 
 * @param {string} entityType - The type of entity (invoice, lease, booking)
 * @param {string} prefix - The prefix for the ID (I, L, B)
 * @param {string} collection - The MongoDB collection name
 * @param {string} idField - The field name that stores the ID
 * @returns {Promise<string>} The generated ID
 * @deprecated Use specific generator functions instead
 */
async function generateEntityId(entityType, prefix, collection, idField) {
  try {
    const db = client.db("RentWise");
    const entityCollection = db.collection(collection);

    // Find the entity with the highest ID number
    const lastEntity = await entityCollection
      .findOne(
        { [idField]: { $exists: true } },
        { sort: { [idField]: -1 } }
      );

    let nextNumber = 1;

    if (lastEntity && lastEntity[idField]) {
      // Extract the number from the ID (e.g., "I-0001" -> 1)
      const lastNumber = parseInt(lastEntity[idField].split('-')[1]);
      nextNumber = lastNumber + 1;
    }

    // Format the number with leading zeros (4 digits)
    const formattedNumber = nextNumber.toString().padStart(4, '0');
    return `${prefix}-${formattedNumber}`;
  } catch (err) {
    throw new Error(`Error generating ${entityType} ID: ${err.message}`);
  }
}

/**
 * Generate a new invoice ID (collision-safe)
 * @returns {Promise<string>} Invoice ID in format I-0001
 */
export async function generateInvoiceId() {
  return generateUniqueId('invoice', 'I', 'Invoices', 'invoiceId');
}

/**
 * Generate a new lease ID (collision-safe)
 * @returns {Promise<string>} Lease ID in format L-0001
 */
export async function generateLeaseId() {
  return generateUniqueId('lease', 'L', 'Leases', 'leaseId');
}

/**
 * Generate a new booking ID (collision-safe)
 * @returns {Promise<string>} Booking ID in format B-0001
 */
export async function generateBookingId() {
  return generateUniqueId('booking', 'B', 'Bookings', 'newBooking.bookingId');
}

/**
 * Generate a new listing ID (collision-safe)
 * @returns {Promise<string>} Listing ID in format LS-0001
 */
export async function generateListingId() {
  return generateUniqueId('listing', 'LS', 'Listings', 'listingId');
}

/**
 * Generate a new care-taker ID (collision-safe)
 * @returns {Promise<string>} Care-taker ID in format CT-0001
 */
export async function generateCareTakerId() {
  return generateUniqueId('caretaker', 'CT', 'Care-Takers', 'careTakerId');
}

/**
 * Generate a new maintenance request ID (collision-safe)
 * @returns {Promise<string>} Maintenance ID in format M-0001
 */
export async function generateMaintenanceId() {
  return generateUniqueId('maintenance', 'M', 'Maintenance-Requests', 'newMaintenanceRequest.maintenanceId');
}

/**
 * Unregister an ID when an entity is deleted
 * @param {string} idValue - The ID to remove from tracking
 * @returns {Promise<void>}
 */
export async function removeIdFromTracking(idValue) {
  return unregisterExistingId(idValue);
}

// Export all functions for backwards compatibility
const idGenerator = {
  generateInvoiceId,
  generateLeaseId,
  generateBookingId,
  generateEntityId
};

export default idGenerator;