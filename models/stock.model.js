
import mongoose from "mongoose";

const stockSchema = mongoose.Schema(
  {
    name: { type: String },
    product_name: { type: String, required: true },
    product_description: { type: String },
    quantity: { type: Number, default: 0 },
    issued: { type: Number, default: 0 }, 
    category: {
      type: String,
      enum: ["TABLETS", "CAPSULE", "SYRUP", "INJECTION", "CREAM", "DROPS"],
      required: true,
      uppercase: true,
    },
    form: {
      type: String,
      enum: ["PIECES", "BOXES", "BOTTLES", "PACKS", "KILOGRAMS", "LITERS"],
      required: true,
      uppercase: true,
    },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "supplier" },
    batch_number: { type: String },
    expiry_date: { type: Date },
    notes: { type: String },
    total_value: { type: Number, default: 0 },
    unit_price: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

stockSchema.virtual("status").get(function () {
  if (this.quantity - this.issued <= 0) return "OUT_OF_STOCK";
  if (this.quantity - this.issued < 10) return "LOW";
  return "OK";
});


const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
