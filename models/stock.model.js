import mongoose from "mongoose";

const stockSchema = mongoose.Schema({
    name: { type: String },
    product: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, quantity: { type: Number, default: 0 } }],
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    quantity: { type: Number, default: 0 },
    issued: { type: Number, default: 0 },
    requested: { type: Number, default: 0 },
    received: { type: Number, default: 0 },
    batch : { type : String },
    supplyStatus: { type: String, enum: ["REQUESTED", "IN_PROGRESS", "SUPPLIED", "REJECTED"], default: "REQUESTED" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const Stock = mongoose.model("stocks", stockSchema);
export default Stock