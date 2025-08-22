import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema({
    type: { type: String, enum: ["PROFORMA", "REGULAR"], default: "REGULAR" },
    purchase_order: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder" },
    total_value: { type: Number },
    notes: { type: String },
    status: { type: String, enum: ["PENDING", "PAID"], default: "PENDING" }
}, { timestamps: true });

const Invoice = mongoose.model("invoices", invoiceSchema);
export default Invoice