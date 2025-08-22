import mongoose from "mongoose";

const poSchema = mongoose.Schema({
    supplier : { type : mongoose.Schema.Types.ObjectId, ref : "Supplier" },
    status : { type : String, enum : ["REQUESTED", "CONFIRMED", "REJECTED"], default : "REQUESTED" },
    stock : { type : mongoose.Schema.Types.ObjectId, ref : "Stock" },
    quantity : { type : Number, required : true },
    total_value : { type : Number },
    createdBy : { type : mongoose.Schema.Types.ObjectId, ref : "User", required : true },
    order_date : { type : Date }
}, { timestamps : true });

const PurchaseOrder = mongoose.model("purchase_orders", poSchema);
export default PurchaseOrder