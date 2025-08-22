import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
    invoice : { type : mongoose.Schema.Types.ObjectId, ref : "Invoice", required : true },
    amount : { type : Number, required : true },
    method : { type : String, enum : ["MOMO", "AIRTEL_MONEY", "BANK CARD", "CASHLESS"], required: true },
    status : { type : String, enum : ["PROCESSING", "COMPLETED"]},
    notes : { type : String }
}, { timestamps : true });

const Transaction = mongoose.model("transaction", transactionSchema);
export default Transaction