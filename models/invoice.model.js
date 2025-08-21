import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema({
    type : { type : String, enum : ["PROFORMA", "REGULAR"], default : "REGULAR" },
    amount : { type : Number, required : true },
    notes : { type : String },
    supplier : { type : mongoose.Schema.Types.ObjectId, ref : "Supplier" },
    stock : { type : mongoose.Schema.Types.ObjectId, ref : "Stock" },
    product : { type: mongoose.Schema.Types.ObjectId, ref : "Product" }
}, { timestamps : true });

const Invoice = mongoose.model("invoices", invoiceSchema);
export default Invoice