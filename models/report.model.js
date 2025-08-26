import mongoose from "mongoose";

const reportSchema = mongoose.Schema({
    type : { type : String, enum : ["INVENTORY_REPORT", "EXPIRATION_REPORT", "SUPPLIER_REPORT"], required : true },
    name : { type : String },
    status : { type : String, enum : ["PENDING", "COMPLETED", "FAILED", "REJECTED"], default : "PENDING" },
    file_url : { type : String } // Cloudinary file store url
}, { timestamps : true });

const Report = mongoose.model("reports", reportSchema);
export default Report