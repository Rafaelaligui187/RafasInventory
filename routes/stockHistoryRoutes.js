import express from "express";
import StockHistory from "../models/StockHistory.js";
import Product from "../models/Product.js";

const router = express.Router();

// ADD STOCK HISTORY
router.post("/add", async (req, res) => {
  try {
    const { productId, quantity, action, ownedBy } = req.body;

    // Get product name
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update product stock
    const newStock = action === "IN" 
      ? product.stock + quantity 
      : product.stock - quantity;

    await Product.findByIdAndUpdate(productId, { stock: newStock });

    // Save stock history
    const stockHistory = new StockHistory({
      productId,
      productName: product.name,
      quantity,
      action,
      ownedBy
    });
    await stockHistory.save();

    res.json({ message: "Stock updated!", stockHistory });
  } catch (error) {
    res.status(500).json({ message: "Error updating stock", error });
  }
});

// GET STOCK HISTORY BY USER
router.get("/:ownerId", async (req, res) => {
  try {
    const history = await StockHistory.find({ ownedBy: req.params.ownerId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock history", error });
  }
});

export default router;
