import { ObjectId } from "mongodb";
import { client } from "../utils/db.js";
import * as validation from '../utils/validation.js'
import Object from '../utils/ObjectIDConvert.js';
const { toObjectId } = Object;

//auto ID generation for invoiceID 
// format example I-0001, I-0002, etc.
async function generateInvoiceId() {
  try {
    const db = client.db("RentWise");
    const invoicesCollection = db.collection("Invoices");

    // Find the invoice with the highest invoiceId number
    const lastInvoice = await invoicesCollection
      .findOne(
        { invoiceId: { $exists: true } },
        { sort: { invoiceId: -1 } }
      );

    let nextNumber = 1;

    if (lastInvoice && lastInvoice.invoiceId) {
      // Extract the number from the invoice ID (e.g., "I-0001" -> 1)
      const lastNumber = parseInt(lastInvoice.invoiceId.split('-')[1]);
      nextNumber = lastNumber + 1;
    }

    // Format the number with leading zeros (4 digits)
    const formattedNumber = nextNumber.toString().padStart(4, '0');
    return `I-${formattedNumber}`;
  } catch (err) {
    throw new Error("Error generating invoice ID: " + err.message);
  }
}

//create invoice
async function createInvoice(adminId, data){
    try{
        const db = client.db("RentWise");
        const invoicesCollection = db.collection("Invoices");
        const leaseCollection = db.collection("Leases");

        const {leaseId, description, date, amount } = data;

        //validate inputs
        if(!leaseId || !description || !date || !amount){
            throw new Error("All fields are required");
        }

        validation.sanitizeInput(description);
        validation.validateDate(date);
        validation.validateAmount(amount);

        validation.validateEndDate(date);
        validation.validateAmount(amount);

        //find lease by leaseId
        const lease = await leaseCollection.findOne({leaseId: toObjectId(leaseId)});

        //create lease object
        const leaseObject = {
            tenant: lease.tenant.fullName,
            email: lease.tenant.email,
            propertyAddress: lease.listing.address,
        }

        //create invoice object
        const invoiceId = await generateInvoiceId();
        const invoice = {
            invoiceId: invoiceId,
            adminId: toObjectId(adminId),
            lease: leaseObject,
            description,
            amount,
            date
        }

        //insert invoice into collection
        const result = await invoicesCollection.insertOne(invoice);
        return result.insertedId;
    } catch (err) {
        throw new Error("Error creating invoice: " + err.message);
    }
}

async function getInvoicesByAdminId(adminId) {
  try {
    const db = client.db("RentWise");
    const invoicesCollection = db.collection("Invoices");
    const invoices = await invoicesCollection
      .find({ adminId: toObjectId(adminId) })
      .toArray();
    return invoices;
  } catch (err) {
    throw new Error("Error fetching invoices: " + err.message);
  }
}

export default {
    createInvoice,
    getInvoicesByAdminId
};
