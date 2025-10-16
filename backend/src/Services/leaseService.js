import { client } from '../utils/db.js';
import { ObjectId } from 'mongodb';
import * as validation from '../utils/validation.js';

function toObjectId(id) {
  if (id instanceof ObjectId) return id;
  if (typeof id === 'string' && ObjectId.isValid(id)) return new ObjectId(id);
  throw new Error("Invalid id format");
}

//function to create a lease with updateable status fields
export async function createLease(bookingID) {
    try{
        const db = client.db('RentWise');
        const bookingCollection = db.collection('Bookings');
        const userCollection = db.collection('System-Users');
        const leaseCollection = db.collection('Leases');

        //search bookingID
        const booking = await bookingCollection.findOne({ _id: toObjectId(bookingID) });
        if(!booking){
            throw new Error("Booking not found");
        }

        //find user
        const user = await userCollection.findOne({ _id: toObjectId(booking.userId) });
        if(!user){
            throw new Error("User not found");
        }

        //create user object with firstName and lastName
        const tenant = {
            userId: user._id,
            firstName: user.firstName,
            surname: user.surname,
            email: user.email,
        }

        //get property details from booking (already contains the listing info)
        const propertyDetails = {
            listingID: booking.listingDetail.listingID,
            address: booking.listingDetail.address,
        }

        //create lease object
        const lease = {
            bookingID: booking._id,
            tenant: tenant,
            property: propertyDetails,
            startDate: booking.newBooking.checkInDate,
            endDate: booking.newBooking.checkOutDate,
            rentAmount: booking.newBooking.totalPrice,
            status: booking.newBooking.status, //pending, confirmed, cancelled
        }

        //insert lease into database
        const result = await leaseCollection.insertOne(lease);
        return result.insertedId;
    }catch(error){
        console.error("Error creating lease:", error);
        throw new Error("Error creating lease");
    }
}