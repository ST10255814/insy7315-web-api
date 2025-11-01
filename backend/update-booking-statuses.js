/**
 * Manual script to update all booking statuses
 * Run this with: node update-booking-statuses.js
 */

import 'dotenv/config';
import { client } from './src/utils/db.js';
import { updateAllBookingStatuses } from './src/Schedule_Updates/scheduledTasks.js';

async function runBookingStatusUpdate() {
  try {
    console.log('========================================');
    console.log('   MANUAL BOOKING STATUS UPDATE');
    console.log('========================================\n');
    console.log('Starting booking status update...');
    console.log('Current time:', new Date().toLocaleString());
    console.log('');
    
    // Run the booking status update
    const updatedCount = await updateAllBookingStatuses();
    
    console.log('');
    console.log('========================================');
    console.log('   UPDATE COMPLETED SUCCESSFULLY!');
    console.log('========================================');
    console.log(`✓ Total bookings updated: ${updatedCount}`);
    console.log(`✓ Completed at: ${new Date().toLocaleString()}`);
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('========================================');
    console.error('   UPDATE FAILED!');
    console.error('========================================');
    console.error('Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

// Run the update
runBookingStatusUpdate();
