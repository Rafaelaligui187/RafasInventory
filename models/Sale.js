// models/Sale.js
import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  sku: { type: String },
  quantity: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true }, // price at time of sale
  total: { type: Number, required: true },
  ownedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Sale", SaleSchema);
