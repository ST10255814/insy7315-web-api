import { client } from "./db.js";

/**
 * Generic ID generator for different entity types
 * Generates IDs in format: {prefix}-{number} (e.g., I-0001, L-0001, B-0001)
 * 
 * @param {string} entityType - The type of entity (invoice, lease, booking)
 * @param {string} prefix - The prefix for the ID (I, L, B)
 * @param {string} collection - The MongoDB collection name
 * @param {string} idField - The field name that stores the ID
 * @returns {Promise<string>} The generated ID
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
 * Generate a new invoice ID
 * @returns {Promise<string>} Invoice ID in format I-0001
 */
export async function generateInvoiceId() {
  return generateEntityId('invoice', 'I', 'Invoices', 'invoiceId');
}

/**
 * Generate a new lease ID
 * @returns {Promise<string>} Lease ID in format L-0001
 */
export async function generateLeaseId() {
  return generateEntityId('lease', 'L', 'Leases', 'leaseId');
}

/**
 * Generate a new booking ID
 * @returns {Promise<string>} Booking ID in format B-0001
 */
export async function generateBookingId() {
  return generateEntityId('booking', 'B', 'Bookings', 'bookingId');
}

export async function generateListingId() {
  return generateEntityId('listing', 'LS', 'Listings', 'listingId');
}

export async function generateCareTakerId() {
  return generateEntityId('caretaker', 'CT', 'Care-Takers', 'careTakerId');
}

// Export all functions for backwards compatibility
const idGenerator = {
  generateInvoiceId,
  generateLeaseId,
  generateBookingId,
  generateEntityId
};

export default idGenerator;