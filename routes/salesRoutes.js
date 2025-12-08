// routes/salesRoutes.js
import express from "express";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import StockHistory from "../models/StockHistory.js";

const router = express.Router();

// Create a sale (deducts stock, records stock history & sale)
router.post("/add", async (req, res) => {
  try {
    const { productId, quantity, pricePerUnit, ownedBy } = req.body;
    if (!productId || !quantity || !pricePerUnit) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const qty = Number(quantity);
    if (qty <= 0) return res.status(400).json({ message: "Quantity must be > 0" });

    if (product.stock < qty) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Deduct stock
    product.stock = product.stock - qty;
    await product.save();

    // Record sale
    const total = Number(pricePerUnit) * qty;
    const sale = await Sale.create({
      productId: product._id,
      productName: product.name,
      sku: product.sku,
      quantity: qty,
      pricePerUnit: Number(pricePerUnit),
      total,
      ownedBy
    });

    // Record stock history (OUT)
    await StockHistory.create({
      productId: product._id,
      productName: product.name,
      quantity: qty,
      action: "OUT",
      ownedBy
    });

    res.json({ message: "Sale recorded", sale, product });
  } catch (error) {
    console.error("Error recording sale", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Get sales by user
router.get("/:ownerId", async (req, res) => {
  try {
    const sales = await Sale.find({ ownedBy: req.params.ownerId }).sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error });
  }
});

export default router;
