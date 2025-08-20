import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone_number : { type : String, required : true, unique : true },
    password: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "STOCK_MANAGER", "SUPPLIER"], default : "ADMIN" },
    isVerified : { type : Boolean, default : false },
    company_name : { type : String },
    company_phone : { type : String }
}, { timestamps: true });

const User = mongoose.model("users", userSchema);
export default User