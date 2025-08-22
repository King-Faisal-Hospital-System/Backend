import mongoose from "mongoose";

const stockSchema = mongoose.Schema({
    name: { type: String },
    product_name: { type: String },
    product_description: { type: String },
    quantity: { type: Number, default: 0 },
    category: { type: String, enum: ["TABLETS", "CAPSULE", "SYRUP", "INJECTION", "CREAM", "DROPS"], required: true },
    form: { type: String, enum: ["PIECES", "BOXES", "BOTTLES", "PACKS", "KILOGRAMS", "LITERS"], required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    batch_number: { type: String },
    expiry_date: { type: Date },
    notes: { type: String },
    total_value: { type: Number },
    unit_cost : { type : Number }
}, { timestamps: true });

const Stock = mongoose.model("stocks", stockSchema);
export default Stock