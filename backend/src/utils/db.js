const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const connString = process.env.MONGO_URI;
const client = new MongoClient(connString, {
});

async function connectMongo(){
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

module.exports = { connectMongo, client };