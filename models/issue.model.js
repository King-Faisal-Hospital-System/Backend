import mongoose from "mongoose";

const issueSchema = mongoose.Schema({
    stock : { type : mongoose.Schema.Types.ObjectId, ref : "Stock" },
    requestor : { type : String },
    notes : { type : String },
    quantity : { type : Number, required : true }
}, { timestamps : true });

const Issue = mongoose.model("issues", issueSchema);
export default Issue