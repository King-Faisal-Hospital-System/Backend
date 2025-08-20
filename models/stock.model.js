import mongoose from "mongoose";

const stockSchema = mongoose.Schema({
    product : { type : mongoose.Schema.Types.ObjectId, ref : "Product" },
    quantity : { type : Number, default : 0 },
    issued : { type : Number, default : 0 },
    requested : { type : Number },
    received : { type : Number },
    expiry : { type : Date, required : true },
    batch : { type : String }
}, { timestamps : true });

const Stock = mongoose.model("stocks", stockSchema);
export default Stock