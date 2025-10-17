import { client } from "../utils/db.js";
import Object from './ObjectIDConvert.js';
const { toObjectId } = Object;

/**
 * Generic database operations utility
 * Provides reusable CRUD operations and common query patterns
 */

/**
 * Generic function to find documents by admin ID
 * 
 * @param {string} collectionName - Name of the MongoDB collection
 * @param {string} adminId - Admin ID to filter by
 * @param {Object} additionalFilters - Additional filters to apply
 * @param {Object} sortOptions - Sort options
 * @returns {Promise<Array>} Array of matching documents
 */
export async function findByAdminId(collectionName, adminId, additionalFilters = {}, sortOptions = {}) {
  try {
    const db = client.db("RentWise");
    const collection = db.collection(collectionName);

    const query = { 
      adminId: toObjectId(adminId),
      ...additionalFilters 
    };

    let cursor = collection.find(query);
    
    if (Object.keys(sortOptions).length > 0) {
      cursor = cursor.sort(sortOptions);
    }

    return await cursor.toArray();
  } catch (err) {
    throw new Error(`Error finding documents in ${collectionName}: ${err.message}`);
  }
}

/**
 * Generic function to find a single document by a field value
 * 
 * @param {string} collectionName - Name of the MongoDB collection
 * @param {string} fieldName - Field name to search by
 * @param {*} fieldValue - Value to search for
 * @param {Object} additionalFilters - Additional filters to apply
 * @returns {Promise<Object|null>} The found document or null
 */
export async function findByField(collectionName, fieldName, fieldValue, additionalFilters = {}) {
  try {
    const db = client.db("RentWise");
    const collection = db.collection(collectionName);

    const query = { 
      [fieldName]: fieldValue,
      ...additionalFilters 
    };

    return await collection.findOne(query);
  } catch (err) {
    throw new Error(`Error finding document in ${collectionName} by ${fieldName}: ${err.message}`);
  }
}

/**
 * Generic function to insert a document
 * 
 * @param {string} collectionName - Name of the MongoDB collection
 * @param {Object} document - Document to insert
 * @returns {Promise<Object>} Insert result
 */
export async function insertDocument(collectionName, document) {
  try {
    const db = client.db("RentWise");
    const collection = db.collection(collectionName);

    return await collection.insertOne(document);
  } catch (err) {
    throw new Error(`Error inserting document into ${collectionName}: ${err.message}`);
  }
}

/**
 * Generic function to update documents
 * 
 * @param {string} collectionName - Name of the MongoDB collection
 * @param {Object} filter - Filter criteria
 * @param {Object} updateData - Update operations
 * @param {boolean} updateOne - Whether to update one (true) or many (false)
 * @returns {Promise<Object>} Update result
 */
export async function updateDocuments(collectionName, filter, updateData, updateOne = true) {
  try {
    const db = client.db("RentWise");
    const collection = db.collection(collectionName);

    if (updateOne) {
      return await collection.updateOne(filter, updateData);
    } else {
      return await collection.updateMany(filter, updateData);
    }
  } catch (err) {
    throw new Error(`Error updating documents in ${collectionName}: ${err.message}`);
  }
}

/**
 * Generic function to delete documents
 * 
 * @param {string} collectionName - Name of the MongoDB collection
 * @param {Object} filter - Filter criteria
 * @param {boolean} deleteOne - Whether to delete one (true) or many (false)
 * @returns {Promise<Object>} Delete result
 */
export async function deleteDocuments(collectionName, filter, deleteOne = true) {
  try {
    const db = client.db("RentWise");
    const collection = db.collection(collectionName);

    if (deleteOne) {
      return await collection.deleteOne(filter);
    } else {
      return await collection.deleteMany(filter);
    }
  } catch (err) {
    throw new Error(`Error deleting documents from ${collectionName}: ${err.message}`);
  }
}

/**
 * Generic aggregation pipeline function
 * 
 * @param {string} collectionName - Name of the MongoDB collection
 * @param {Array} pipeline - Aggregation pipeline stages
 * @returns {Promise<Array>} Aggregation results
 */
export async function aggregate(collectionName, pipeline) {
  try {
    const db = client.db("RentWise");
    const collection = db.collection(collectionName);

    return await collection.aggregate(pipeline).toArray();
  } catch (err) {
    throw new Error(`Error running aggregation on ${collectionName}: ${err.message}`);
  }
}

/**
 * Get document count with optional filters
 * 
 * @param {string} collectionName - Name of the MongoDB collection
 * @param {Object} filter - Filter criteria
 * @returns {Promise<number>} Document count
 */
export async function getDocumentCount(collectionName, filter = {}) {
  try {
    const db = client.db("RentWise");
    const collection = db.collection(collectionName);

    return await collection.countDocuments(filter);
  } catch (err) {
    throw new Error(`Error counting documents in ${collectionName}: ${err.message}`);
  }
}

/**
 * Check if a document exists
 * 
 * @param {string} collectionName - Name of the MongoDB collection
 * @param {Object} filter - Filter criteria
 * @returns {Promise<boolean>} True if document exists
 */
export async function documentExists(collectionName, filter) {
  try {
    const count = await getDocumentCount(collectionName, filter);
    return count > 0;
  } catch (err) {
    throw new Error(`Error checking document existence in ${collectionName}: ${err.message}`);
  }
}

/**
 * Get statistics for numeric fields
 * 
 * @param {string} collectionName - Name of the MongoDB collection
 * @param {string} field - Field to get statistics for
 * @param {Object} filter - Filter criteria
 * @returns {Promise<Object>} Statistics object
 */
export async function getFieldStatistics(collectionName, field, filter = {}) {
  try {
    const pipeline = [
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: `$${field}` },
          average: { $avg: `$${field}` },
          min: { $min: `$${field}` },
          max: { $max: `$${field}` },
          count: { $sum: 1 }
        }
      }
    ];

    const result = await aggregate(collectionName, pipeline);
    return result[0] || { total: 0, average: 0, min: 0, max: 0, count: 0 };
  } catch (err) {
    throw new Error(`Error getting statistics for ${field} in ${collectionName}: ${err.message}`);
  }
}

/**
 * Batch update documents with different update operations
 * 
 * @param {string} collectionName - Name of the MongoDB collection
 * @param {Array} updates - Array of {filter, update} objects
 * @returns {Promise<Array>} Array of update results
 */
export async function batchUpdate(collectionName, updates) {
  try {
    const db = client.db("RentWise");
    const collection = db.collection(collectionName);

    const results = [];
    for (const { filter, update } of updates) {
      const result = await collection.updateOne(filter, update);
      results.push(result);
    }

    return results;
  } catch (err) {
    throw new Error(`Error performing batch update on ${collectionName}: ${err.message}`);
  }
}

// Export all functions
const dbOperations = {
  findByAdminId,
  findByField,
  insertDocument,
  updateDocuments,
  deleteDocuments,
  aggregate,
  getDocumentCount,
  documentExists,
  getFieldStatistics,
  batchUpdate
};

export default dbOperations;