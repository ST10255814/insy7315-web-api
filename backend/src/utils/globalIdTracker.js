import { client } from "./db.js";

/**
 * Global ID Tracker - Ensures no duplicate IDs across the entire system
 * 
 * This system maintains a central registry of all generated IDs to prevent
 * collisions across different collections and storage patterns.
 */

/**
 * Initialize the global ID tracking collection
 */
async function initializeIdTracker() {
  try {
    const db = client.db("RentWise");
    const idTrackerCollection = db.collection("Global-ID-Tracker");
    
    // Create unique index on the idValue field to prevent duplicates
    await idTrackerCollection.createIndex({ "idValue": 1 }, { unique: true });
    
    console.log("Global ID Tracker initialized successfully");
  } catch (error) {
    // Index might already exist, which is fine
    if (!error.message.includes("already exists")) {
      console.error("Error initializing Global ID Tracker:", error);
    }
  }
}

/**
 * Check if an ID already exists anywhere in the system
 * @param {string} idValue - The ID to check (e.g., "I-0001", "L-0001")
 * @returns {Promise<boolean>} True if ID exists, false otherwise
 */
async function checkIdExists(idValue) {
  try {
    const db = client.db("RentWise");
    const idTrackerCollection = db.collection("Global-ID-Tracker");
    
    const existingId = await idTrackerCollection.findOne({ idValue: idValue });
    return existingId !== null;
  } catch (error) {
    console.error("Error checking ID existence:", error);
    throw new Error(`Error checking ID existence: ${error.message}`);
  }
}

/**
 * Register a new ID in the global tracker
 * @param {string} idValue - The ID to register (e.g., "I-0001")
 * @param {string} entityType - Type of entity (invoice, lease, booking, etc.)
 * @param {string} collection - Collection where the entity is stored
 * @param {string} fieldPath - Full path to where ID is stored (e.g., "invoiceId", "newBooking.bookingId")
 * @returns {Promise<void>}
 */
async function registerNewId(idValue, entityType, collection, fieldPath) {
  try {
    const db = client.db("RentWise");
    const idTrackerCollection = db.collection("Global-ID-Tracker");
    
    const idRecord = {
      idValue: idValue,
      entityType: entityType,
      collection: collection,
      fieldPath: fieldPath,
      createdAt: new Date(),
      status: "active"
    };
    
    await idTrackerCollection.insertOne(idRecord);
    console.log(`Registered new ID: ${idValue} for ${entityType}`);
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      throw new Error(`ID ${idValue} already exists in the system`);
    }
    throw new Error(`Error registering ID: ${error.message}`);
  }
}

/**
 * Remove an ID from the tracker (when entity is deleted)
 * @param {string} idValue - The ID to remove
 * @returns {Promise<void>}
 */
async function unregisterExistingId(idValue) {
  try {
    const db = client.db("RentWise");
    const idTrackerCollection = db.collection("Global-ID-Tracker");
    
    await idTrackerCollection.deleteOne({ idValue: idValue });
    console.log(`Unregistered ID: ${idValue}`);
  } catch (error) {
    console.error("Error unregistering ID:", error);
    throw new Error(`Error unregistering ID: ${error.message}`);
  }
}

/**
 * Get the highest number used for a specific prefix
 * @param {string} prefix - The prefix to check (e.g., "I", "L", "B")
 * @returns {Promise<number>} The highest number used
 */
async function getHighestNumberForPrefix(prefix) {
  try {
    const db = client.db("RentWise");
    const idTrackerCollection = db.collection("Global-ID-Tracker");
    
    // Find all IDs with this prefix and extract the highest number
    const idsWithPrefix = await idTrackerCollection
      .find({ 
        idValue: { $regex: `^${prefix}-` },
        status: "active"
      })
      .toArray();
    
    let highestNumber = 0;
    
    for (const record of idsWithPrefix) {
      const idParts = record.idValue.split('-');
      if (idParts.length >= 2) {
        const number = parseInt(idParts[1]);
        if (!isNaN(number) && number > highestNumber) {
          highestNumber = number;
        }
      }
    }
    
    return highestNumber;
  } catch (error) {
    console.error("Error getting highest number for prefix:", error);
    throw new Error(`Error getting highest number for prefix: ${error.message}`);
  }
}

/**
 * Generate a unique ID with collision checking
 * @param {string} entityType - The type of entity
 * @param {string} prefix - The prefix for the ID
 * @param {string} collection - The collection name
 * @param {string} fieldPath - The field path where ID is stored
 * @returns {Promise<string>} The generated unique ID
 */
async function generateUniqueId(entityType, prefix, collection, fieldPath) {
  try {
    // Initialize tracker if not already done
    await initializeIdTracker();
    
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      // Get the highest number for this prefix
      const highestNumber = await getHighestNumberForPrefix(prefix);
      const nextNumber = highestNumber + 1;
      
      // Format the ID
      const formattedNumber = nextNumber.toString().padStart(4, '0');
      const candidateId = `${prefix}-${formattedNumber}`;
      
      // Check if this ID already exists anywhere
      const exists = await checkIdExists(candidateId);
      
      if (!exists) {
        // Register the new ID
        await registerNewId(candidateId, entityType, collection, fieldPath);
        return candidateId;
      }
      
      attempts++;
      console.warn(`ID collision detected for ${candidateId}, attempting again...`);
    }
    
    throw new Error(`Failed to generate unique ID after ${maxAttempts} attempts`);
  } catch (error) {
    throw new Error(`Error generating unique ID: ${error.message}`);
  }
}

/**
 * Migrate existing IDs to the tracker (run once to populate existing data)
 * @returns {Promise<void>}
 */
async function migrateExistingIds() {
  try {
    console.log("Starting migration of existing IDs...");
    const db = client.db("RentWise");
    
    // Migration configurations for different collections
    const migrations = [
      {
        collection: "Invoices",
        entityType: "invoice",
        fieldPath: "invoiceId",
        idField: "invoiceId"
      },
      {
        collection: "Leases",
        entityType: "lease",
        fieldPath: "leaseId",
        idField: "leaseId"
      },
      {
        collection: "Listings",
        entityType: "listing",
        fieldPath: "listingId",
        idField: "listingId"
      },
      {
        collection: "Bookings",
        entityType: "booking",
        fieldPath: "newBooking.bookingId",
        idField: "newBooking.bookingId"
      },
      {
        collection: "Maintenance-Requests",
        entityType: "maintenance",
        fieldPath: "newMaintenanceRequest.maintenanceId",
        idField: "newMaintenanceRequest.maintenanceId"
      },
      {
        collection: "Care-Takers",
        entityType: "caretaker",
        fieldPath: "careTakerId",
        idField: "careTakerId"
      }
    ];
    
    let totalMigrated = 0;
    
    for (const migration of migrations) {
      try {
        const collection = db.collection(migration.collection);
        const documents = await collection.find({}).toArray();
        
        console.log(`Migrating ${documents.length} documents from ${migration.collection}...`);
        
        for (const doc of documents) {
          try {
            // Extract ID based on field path
            let idValue;
            if (migration.fieldPath.includes('.')) {
              const parts = migration.fieldPath.split('.');
              idValue = doc[parts[0]]?.[parts[1]];
            } else {
              idValue = doc[migration.idField];
            }
            
            if (idValue) {
              // Try to register the ID (skip if already exists)
              try {
                await registerNewId(idValue, migration.entityType, migration.collection, migration.fieldPath);
                totalMigrated++;
              } catch (error) {
                if (error.message.includes("already exists")) {
                  console.log(`ID ${idValue} already exists in tracker, skipping...`);
                } else {
                  throw error;
                }
              }
            }
          } catch (docError) {
            console.error(`Error migrating document ${doc._id}:`, docError);
          }
        }
      } catch (collectionError) {
        console.error(`Error migrating collection ${migration.collection}:`, collectionError);
      }
    }
    
    console.log(`Migration completed. Total IDs migrated: ${totalMigrated}`);
  } catch (error) {
    console.error("Error during migration:", error);
    throw error;
  }
}

/**
 * Get statistics about ID usage
 * @returns {Promise<Object>} Statistics object
 */
async function getIdStatistics() {
  try {
    const db = client.db("RentWise");
    const idTrackerCollection = db.collection("Global-ID-Tracker");
    
    const stats = await idTrackerCollection.aggregate([
      {
        $group: {
          _id: "$entityType",
          count: { $sum: 1 },
          latestId: { $max: "$idValue" }
        }
      }
    ]).toArray();
    
    const totalIds = await idTrackerCollection.countDocuments({ status: "active" });
    
    return {
      totalActiveIds: totalIds,
      byEntityType: stats
    };
  } catch (error) {
    console.error("Error getting ID statistics:", error);
    throw error;
  }
}

export {
  initializeIdTracker,
  checkIdExists,
  registerNewId,
  unregisterExistingId,
  getHighestNumberForPrefix,
  generateUniqueId,
  migrateExistingIds,
  getIdStatistics
};