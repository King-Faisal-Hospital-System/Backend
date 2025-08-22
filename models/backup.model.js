import mongoose from "mongoose";

const backupSchema = mongoose.Schema({
    storage: { type: String, enum: ["CLOUD_STORAGE", "LOCAL_STORAGE", "EXTERNAL_DRIVE"], default: "CLOUD_STORAGE" },
    backup_size : { type : String }
}, { timestamps: true })