import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ADD PRODUCT
router.post("/add", async (req, res) => {
  try {
    const { name, price, stock, image, ownedBy, productDescription } = req.body;

    // --- AUTO SKU GENERATION ---
    // 1. Prefix = first 3 letters of product name
    const prefix = name.substring(0, 3).toUpperCase();

    // 2. Count existing products with same prefix (same owner)
    const count = await Product.countDocuments({
      ownedBy: ownedBy,
      sku: { $regex: `^${prefix}` }
    });

    // 3. Generate SKU (e.g., COC-001)
    const sku = `${prefix}-${String(count + 1).padStart(3, "0")}`;

    const product = new Product({
      name,
      price,
      stock,
      image,
      sku, // <-- AUTO GENERATED
      ownedBy,
      productDescription: productDescription || "",
    });

    await product.save();
    res.json({ message: "Product saved!", product });

  } catch (error) {
    res.status(500).json({ message: "Error saving product", error });
  }
});

// GET PRODUCTS BY USER ID
router.get("/:ownerId", async (req, res) => {
  try {
    const products = await Product.find({ ownedBy: req.params.ownerId });
    res.json(products);

  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});


// EDIT PRODUCT (SKU SHOULD NOT CHANGE)
router.put("/edit/:id", async (req, res) => {
  try {
    const { sku, ...updateFields } = req.body; 
    // Remove SKU from update so it stays permanent

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json({ message: "Product updated!", product: updatedProduct });

  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});

// DELETE PRODUCT
router.delete("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});





export default router;
