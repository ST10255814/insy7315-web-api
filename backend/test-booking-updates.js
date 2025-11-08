#!/usr/bin/env node

/**
 * Test script to manually run booking status updates and see listing changes
 */

import { client } from './src/utils/db.js';
import { manualStatusUpdate } from './src/Schedule_Updates/scheduledTasks.js';

async function testBookingUpdates() {
  try {
    console.log('=== TESTING BOOKING STATUS UPDATES ===\n');
    
    // Connect to database
    await client.connect();
    console.log('Connected to database');
    
    const db = client.db("RentWise");
    const bookingsCollection = db.collection("Bookings");
    const listingsCollection = db.collection("Listings");
    
    // Show current state before update
    console.log('\n--- BEFORE UPDATE ---');
    const bookingsBefore = await bookingsCollection.find({}).toArray();
    const listingsBefore = await listingsCollection.find({}).toArray();
    
    console.log(`Current bookings (${bookingsBefore.length}):`);
    bookingsBefore.forEach(booking => {
      console.log(`  - Booking ${booking.newBooking?.bookingId}: ${booking.newBooking?.status} (Listing: ${booking.listingDetail?.listingID})`);
    });
    
    console.log(`\nCurrent listings (${listingsBefore.length}):`);
    listingsBefore.forEach(listing => {
      console.log(`  - Listing ${listing.listingId}: ${listing.status} (${listing.title})`);
    });
    
    // Run the manual status update
    console.log('\n--- RUNNING MANUAL STATUS UPDATE ---');
    const updateResult = await manualStatusUpdate();
    
    console.log('\nUpdate Results:');
    console.log(`  - Lease updates: ${updateResult.leaseUpdates}`);
    console.log(`  - Invoice updates: ${updateResult.invoiceUpdates}`);
    console.log(`  - Booking updates: ${updateResult.bookingUpdates}`);
    console.log(`  - Listing updates: ${updateResult.listingUpdates.totalUpdated}/${updateResult.listingUpdates.totalListingsProcessed}`);
    
    // Show state after update
    console.log('\n--- AFTER UPDATE ---');
    const bookingsAfter = await bookingsCollection.find({}).toArray();
    const listingsAfter = await listingsCollection.find({}).toArray();
    
    console.log(`Updated bookings (${bookingsAfter.length}):`);
    bookingsAfter.forEach(booking => {
      const beforeBooking = bookingsBefore.find(b => b._id.toString() === booking._id.toString());
      const statusChanged = beforeBooking?.newBooking?.status !== booking.newBooking?.status;
      const changeIndicator = statusChanged ? ' [CHANGED]' : '';
      console.log(`  - Booking ${booking.newBooking?.bookingId}: ${booking.newBooking?.status} (Listing: ${booking.listingDetail?.listingID})${changeIndicator}`);
    });
    
    console.log(`\nUpdated listings (${listingsAfter.length}):`);
    listingsAfter.forEach(listing => {
      const beforeListing = listingsBefore.find(l => l._id.toString() === listing._id.toString());
      const statusChanged = beforeListing?.status !== listing.status;
      const changeIndicator = statusChanged ? ' [CHANGED]' : '';
      console.log(`  - Listing ${listing.listingId}: ${listing.status} (${listing.title})${changeIndicator}`);
    });
    
    // Show detailed changes
    console.log('\n--- DETAILED CHANGES ---');
    let hasChanges = false;
    
    bookingsAfter.forEach(booking => {
      const beforeBooking = bookingsBefore.find(b => b._id.toString() === booking._id.toString());
      if (beforeBooking && beforeBooking.newBooking?.status !== booking.newBooking?.status) {
        console.log(`📋 Booking ${booking.newBooking?.bookingId}: ${beforeBooking.newBooking?.status} → ${booking.newBooking?.status}`);
        hasChanges = true;
      }
    });
    
    listingsAfter.forEach(listing => {
      const beforeListing = listingsBefore.find(l => l._id.toString() === listing._id.toString());
      if (beforeListing && beforeListing.status !== listing.status) {
        console.log(`🏠 Listing ${listing.listingId}: ${beforeListing.status} → ${listing.status}`);
        hasChanges = true;
      }
    });
    
    if (!hasChanges) {
      console.log('ℹ️  No status changes detected');
    }
    
    console.log('\n=== TEST COMPLETED SUCCESSFULLY ===');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    // Close database connection
    try {
      await client.close();
      console.log('\nDatabase connection closed');
    } catch (closeError) {
      console.error('Error closing database:', closeError);
    }
  }
}

// Run the test
testBookingUpdates().catch(console.error);