import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name : { type : String },
    price : { type : Number },
    form : { type : String, enum : ["TABLET", "CAPSULE", "LIQUID"], default : "LIQUID"}
}, { timestamps : true });

const Product = mongoose.model("products", productSchema);
export default Product;
