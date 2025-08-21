import mongoose from "mongoose";

const poSchema = mongoose.Schema({
    supplier : { type : mongoose.Schema.Types.ObjectId, ref : "Supplier" },
    item : { product : { type : mongoose.Schema.Types.ObjectId, ref : "Product" }, quantity : Number, unit_price : Number },
    status : { type : String, enum : ["REQUESTED", "CONFIRMED", "REJECTED"], default : "REQUESTED" },
    stock : { type : mongoose.Schema.Types.ObjectId, ref : "Stock" },
    createdBy : { type : mongoose.Schema.Types.ObjectId, ref : "User", required : true }
}, { timestamps : true });

const PurchaseOrder = mongoose.model("purchase_orders", poSchema);
export default PurchaseOrder