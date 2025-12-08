import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true },
  sku: { type: String, required: true }, ///SKU barcode
  productDescription: { type: String, default: "" }, // <- added
  ownedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, default: "Uncategorized" },
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
