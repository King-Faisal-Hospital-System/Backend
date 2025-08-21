import mongoose from "mongoose";

const stockSchema = mongoose.Schema({
    name: { type: String },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 0 },
    value: { type: Number }
}, { timestamps: true });

const Stock = mongoose.model("stocks", stockSchema);
export default Stock