import mongoose from "mongoose";

const supplierSchema = mongoose.Schema({
    user : { type : mongoose.Schema.Types.ObjectId, ref : "User", required : true },
    address : { type : String, required : true }
}, { timestamps : true });

const Supplier = mongoose.model("suppliers", supplierSchema);
export default Supplier;


