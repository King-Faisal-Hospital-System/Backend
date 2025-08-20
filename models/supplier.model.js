import mongoose from "mongoose";

const supplierSchema = mongoose.Schema({
    user : { type : mongoose.Schema.Types.ObjectId, ref : "User", required : true },
    company_name : { type : String, required : true },
    company_phone : { type : String, required : true },
    address : { type : String, required : true }
}, { timestamps : true });

const Supplier = mongoose.model("suppliers", supplierSchema);
export default Supplier;


