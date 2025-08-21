import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: { type: String },
    price: { type: Number },
    category: { type: String, enum: ["TABLETS", "CAPSULE", "SYRUP", "INJECTION", "CREAM", "DROPS"], required : true },
    form: { type: String, enum: ["PIECES", "BOXES", "BOTTLES", "PACKS", "KILOGRAMS", "LITERS"] },
    expiry : { type : Date, required : true }
}, { timestamps: true });

const Product = mongoose.model("products", productSchema);
export default Product;