import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const connString = process.env.MONGO_URI;
const client = new MongoClient(connString, {
});

export const mongoConnection = async () => {
    try{
        await client.connect();
        console.log("Connected to MongoDB Successfully");
    }catch(err){
        console.error("MongoDB connection failed", err);
        console.log("This is likely a network connectivity issue with MongoDB Atlas.");
        console.log("Please check your MongoDB Atlas network access settings.");
        console.log("Server will continue running without database connection for now.");
    }
}

// Export the client so other modules can use it
export { client };

