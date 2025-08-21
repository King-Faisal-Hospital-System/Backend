import mongoose from "mongoose";

const grnSchema = mongoose.Schema({
    purchase_order: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder" },
    received_date: { type: Date, default: Date.now },
    status: { type: String, enum: ["PARTIAL", "COMPLETE"], required: true },
    received_quantity : { type : Number},
    total_value : { type : Number },
    notes : { type : String }
}, { timestamps : true });

const GoodsReceivedNotice = mongoose.model("goods_received_notices", grnSchema);
export default GoodsReceivedNotice