import mongoose from "mongoose";

const supplierSchema = mongoose.Schema({
    company_name : { type : String, required : true },
    company_email : { type : String, required : true },
    contact_person : { type : String, required : true },
    company_phone : { type : String, required : true },
    address : { type : String },
   tax_id: { type: String }, 
    payment_terms : { type : Number }, // In days
    isVerified : { type : Boolean, default : false },
}, { timestamps : true });

const Supplier = mongoose.model("supplier", supplierSchema);
export default Supplier;


