import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema({
    type: { type: String, enum: ["PROFORMA", "REGULAR"], default: "REGULAR" },
    purchase_order: { type: String }, 
    total_value: { type: Number, required: true },
    notes: { type: String },
    status: { type: String, enum: ["PENDING", "PAID", "DRAFT", "SENT"], default: "PENDING" }
}, { timestamps: true });

const Invoice = mongoose.model("invoices", invoiceSchema);
export default Invoice