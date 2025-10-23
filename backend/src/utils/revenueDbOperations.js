import { client } from '../utils/db.js';

/**
 * Initialize the MonthlyRevenue collection with proper indexes and structure
 */
async function initializeRevenueCollection() {
    try {
        const db = client.db('RentWise');
        const revenueCollection = db.collection('MonthlyRevenue');
        
        console.log('Initializing MonthlyRevenue collection...');
        
        // Create indexes for better query performance
        const indexes = [
            // Compound index for adminId, year, month (most common query pattern)
            { 
                key: { adminId: 1, year: -1, month: -1 }, 
                name: 'adminId_year_month_idx',
                unique: true // Ensure only one record per admin/month/year
            },
            // Index for adminId queries
            { 
                key: { adminId: 1 }, 
                name: 'adminId_idx' 
            },
            // Index for year queries
            { 
                key: { year: -1 }, 
                name: 'year_idx' 
            },
            // Index for createdAt (for general sorting/filtering)
            { 
                key: { createdAt: -1 }, 
                name: 'createdAt_idx' 
            }
        ];
        
        // Create indexes
        for (const index of indexes) {
            try {
                await revenueCollection.createIndex(index.key, { 
                    name: index.name,
                    unique: index.unique || false
                });
                console.log(`✓ Created index: ${index.name}`);
            } catch (error) {
                if (error.code === 85) {
                    console.log(`⚠ Index ${index.name} already exists, skipping...`);
                } else {
                    console.error(`✗ Error creating index ${index.name}:`, error.message);
                }
            }
        }
        
        // Insert a sample document structure (will be removed if it exists)
        const sampleDocument = {
            adminId: 'sample_admin_id',
            month: 1,
            year: 2024,
            totalRevenue: 0,
            bookingCount: 0,
            bookings: [],
            calculatedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // Check if collection is empty and add sample document for structure reference
        const count = await revenueCollection.countDocuments();
        if (count === 0) {
            await revenueCollection.insertOne(sampleDocument);
            console.log('✓ Inserted sample document structure');
            
            // Immediately remove the sample document
            await revenueCollection.deleteOne({ adminId: 'sample_admin_id' });
            console.log('✓ Removed sample document');
        }
        
        console.log('✓ MonthlyRevenue collection initialized successfully');
        
        // Return collection info
        const collectionInfo = {
            name: 'MonthlyRevenue',
            indexes: await revenueCollection.listIndexes().toArray(),
            documentCount: await revenueCollection.countDocuments()
        };
        
        return collectionInfo;
        
    } catch (error) {
        console.error('Error initializing MonthlyRevenue collection:', error);
        throw new Error(`Failed to initialize MonthlyRevenue collection: ${error.message}`);
    }
}

/**
 * Validate the revenue collection structure
 */
async function validateRevenueCollection() {
    try {
        const db = client.db('RentWise');
        const revenueCollection = db.collection('MonthlyRevenue');
        
        console.log('Validating MonthlyRevenue collection...');
        
        // Check if collection exists
        const collections = await db.listCollections({ name: 'MonthlyRevenue' }).toArray();
        if (collections.length === 0) {
            console.log('MonthlyRevenue collection does not exist, creating...');
            await initializeRevenueCollection();
            return true;
        }
        
        // Check indexes
        const indexes = await revenueCollection.listIndexes().toArray();
        const requiredIndexes = ['adminId_year_month_idx', 'adminId_idx', 'year_idx', 'createdAt_idx'];
        
        const missingIndexes = requiredIndexes.filter(required => 
            !indexes.some(index => index.name === required)
        );
        
        if (missingIndexes.length > 0) {
            console.log(`Missing indexes: ${missingIndexes.join(', ')}`);
            console.log('Reinitializing collection...');
            await initializeRevenueCollection();
        } else {
            console.log('✓ All required indexes exist');
        }
        
        console.log('✓ MonthlyRevenue collection validation completed');
        return true;
        
    } catch (error) {
        console.error('Error validating MonthlyRevenue collection:', error);
        return false;
    }
}

/**
 * Get collection statistics
 */
async function getRevenueCollectionStats() {
    try {
        const db = client.db('RentWise');
        const revenueCollection = db.collection('MonthlyRevenue');
        
        const stats = await db.command({ collStats: 'MonthlyRevenue' });
        const documentCount = await revenueCollection.countDocuments();
        const indexes = await revenueCollection.listIndexes().toArray();
        
        // Get unique admins count
        const uniqueAdmins = await revenueCollection.distinct('adminId');
        
        // Get date range
        const oldestRecord = await revenueCollection.findOne({}, { sort: { year: 1, month: 1 } });
        const newestRecord = await revenueCollection.findOne({}, { sort: { year: -1, month: -1 } });
        
        return {
            collectionExists: true,
            documentCount,
            uniqueAdminsCount: uniqueAdmins.length,
            storageSize: stats.storageSize,
            indexCount: indexes.length,
            indexes: indexes.map(idx => ({ name: idx.name, keys: idx.key })),
            dateRange: {
                oldest: oldestRecord ? `${oldestRecord.month}/${oldestRecord.year}` : null,
                newest: newestRecord ? `${newestRecord.month}/${newestRecord.year}` : null
            }
        };
        
    } catch (error) {
        console.error('Error getting collection stats:', error);
        return {
            collectionExists: false,
            error: error.message
        };
    }
}

const revenueDbOperations = {
    initializeRevenueCollection,
    validateRevenueCollection,
    getRevenueCollectionStats
};

export default revenueDbOperations;