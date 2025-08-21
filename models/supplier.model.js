import mongoose from "mongoose";

const supplierSchema = mongoose.Schema({
    company_name : { type : String, required : true },
    company_email : { type : String, required : true },
    isVerified : { type : Boolean, default : false },
    password : { type : String, required : true },
    role : { type : String, default : "SUPPLIER" }
}, { timestamps : true });

const Supplier = mongoose.model("suppliers", supplierSchema);
export default Supplier;


