import { ObjectId } from "mongodb";

function toObjectId(id) {
  if (id instanceof ObjectId) return id;
  if (typeof id === "string" && ObjectId.isValid(id)) return new ObjectId(id);
  throw new Error("Invalid id format");
}

const ObjectIDConverter = {
    toObjectId
}

export default ObjectIDConverter;