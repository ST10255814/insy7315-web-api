import { migrateExistingIds, getIdStatistics } from '../utils/globalIdTracker.js';

/**
 * Migration script to populate the Global ID Tracker with existing IDs
 * 
 * Run this script once to migrate all existing IDs to the new tracking system.
 * This ensures no collisions with previously generated IDs.
 * 
 * Usage: node migrate-ids.js
 * 
 * Had help from GitHub Copilot which is an integrated AI tool to assist with coding.
 */
async function runMigration() {
  try {
    console.log("🚀 Starting ID migration process...");
    console.log("This will scan all existing collections and register their IDs in the global tracker.");
    console.log("");
    
    // Run the migration
    await migrateExistingIds();
    
    console.log("");
    console.log("✅ Migration completed successfully!");
    console.log("");
    
    // Show statistics
    console.log("📊 ID Statistics after migration:");
    const stats = await getIdStatistics();
    console.log(`Total active IDs: ${stats.totalActiveIds}`);
    console.log("");
    console.log("By entity type:");
    stats.byEntityType.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} IDs (latest: ${stat.latestId})`);
    });
    
    console.log("");
    console.log("🎉 Your system is now protected against ID collisions!");
    console.log("All new IDs will be checked against the global registry.");
    
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  } finally {
    // Close database connection if needed
    process.exit(0);
  }
}

// Run the migration
runMigration();