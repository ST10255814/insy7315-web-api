import { ObjectId } from "mongodb";
import { client } from "../utils/db.js";

function toObjectId(id) {
  if (id instanceof ObjectId) return id;
  if (typeof id === "string" && ObjectId.isValid(id)) return new ObjectId(id);
  throw new Error("Invalid id format");
}

async function getLeasesByAdminId(adminId) {
  try {
    if (!adminId) {
      throw new Error("Admin ID is required");
    }
    const db = client.db("RentWise");
    const leasesCollection = db.collection("Leases");

    const leases = await leasesCollection
      .find({ _id: toObjectId(adminId) })
      .toArray();
    return leases;
  } catch (err) {
    throw new Error("Error fetching leases: " + err.message);
  }
}

const leaseService = {
  getLeasesByAdminId,
};

export default leaseService;