import mongoose from "mongoose";

const connectDb = async()=>{
    try{
        mongoose.connection.on("connected",()=>{
            console.log("MongoDB Database Connected")
        })
        const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017"
        // Default to 'Capsnet' (match existing DB casing to avoid case-conflict)
        const dbName = process.env.MONGODB_DB_NAME || "Capsnet";
        console.debug(`[db] connecting to ${mongoUrl}/${dbName}`);
        await mongoose.connect(`${mongoUrl}/${dbName}`)
    }catch(e){
        console.log("MongoDB connection error:", e.message)
        console.log("Please ensure MongoDB is running locally or set MONGODB_URL environment variable")
    }
}

export default connectDb
