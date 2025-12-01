import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ADD PRODUCT
router.post("/add", async (req, res) => {
  try {
    const { name, price, stock, image, ownedBy } = req.body;

    const product = new Product({
      name,
      price,
      stock,
      image,
      ownedBy,
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

export default router;
