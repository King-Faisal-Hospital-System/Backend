import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

export const connectToDatabase = () => {
    try {
        mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected to MongoDB"))
    } catch (error) {
        throw new Error("Error connecting to MongoDB", error.message);
    }
};

export const backupDB = async () => {
    try {
        
    } catch (error) {
        throw new Error(error)
    }
}