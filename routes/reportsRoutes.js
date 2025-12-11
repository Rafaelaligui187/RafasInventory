// routes/reportsRoutes.js
import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import StockHistory from "../models/StockHistory.js";
import Sale from "../models/Sale.js"; // adjust path if different

const router = express.Router();

function parseRangeQuery(range, start, end) {
  // returns { from: Date, to: Date }
  const now = new Date();
  let from, to;

  if (start && end) {
    from = new Date(start);
    from.setHours(0,0,0,0);
    to = new Date(end);
    to.setHours(23,59,59,999);
    return { from, to };
  }

  switch ((range || "month").toLowerCase()) {
    case "today":
      from = new Date();
      from.setHours(0,0,0,0);
      to = new Date();
      to.setHours(23,59,59,999);
      break;
    case "week":
      // last 7 days
      to = new Date();
      to.setHours(23,59,59,999);
      from = new Date();
      from.setDate(to.getDate() - 6);
      from.setHours(0,0,0,0);
      break;
    case "month":
      to = new Date();
      to.setHours(23,59,59,999);
      from = new Date();
      from.setMonth(to.getMonth() - 1);
      from.setHours(0,0,0,0);
      break;
    case "all":
    default:
      from = new Date(0); // epoch
      to = new Date();
      to.setHours(23,59,59,999);
      break;
  }

  return { from, to };
}

// GET /api/reports/:userId?range=month OR ?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { range, start, end, lowStockThreshold } = req.query;
    const threshold = Number(lowStockThreshold) || 5;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const { from, to } = parseRangeQuery(range, start, end);

    // 1) Inventory summary
    const inventoryAgg = await Product.aggregate([
      { $match: { ownedBy: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          inventoryValue: { $sum: { $multiply: ["$stock", { $ifNull: ["$price", 0] }] } }
        }
      }
    ]);

    const inventorySummary = inventoryAgg[0] || {
      totalProducts: 0,
      totalStock: 0,
      inventoryValue: 0
    };

    // Get low stock count and list (small sample)
    const lowStockItems = await Product.find({
      ownedBy: userId,
      stock: { $lt: threshold }
    }).select("name stock sku category").lean();

    inventorySummary.lowStockCount = lowStockItems.length;
    inventorySummary.lowStockItems = lowStockItems.slice(0, 20); // limit in response

    // 2) Sales summary (all sales in range for user)
    // Assumes Sale model fields: productId, productName, sku, quantity, pricePerUnit, total, ownedBy, createdAt
    const sales = await Sale.find({
      ownedBy: userId,
      createdAt: { $gte: from, $lte: to }
    })
      .sort({ createdAt: -1 })
      .lean();

    // 3) Stock movements from StockHistory in range
    const stockMovements = await StockHistory.find({
      ownedBy: userId,
      createdAt: { $gte: from, $lte: to }
    })
      .sort({ createdAt: -1 })
      .lean();

    // 4) Product performance: group sales by productId
    const productPerfAgg = await Sale.aggregate([
      { $match: { ownedBy: mongoose.Types.ObjectId(userId), createdAt: { $gte: from, $lte: to } } },
      {
        $group: {
          _id: "$productId",
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: { $ifNull: ["$total", { $multiply: ["$quantity", "$pricePerUnit"] }] } }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $unwind: { path: "$product", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          _id: 1,
          totalSold: 1,
          totalRevenue: 1,
          name: { $ifNull: ["$product.name", "Unknown Product"] },
          sku: { $ifNull: ["$product.sku", ""] }
        }
      },
      { $sort: { totalSold: -1 } }
    ]);

    return res.json({
      inventorySummary,
      salesSummary: sales,
      stockMovements,
      productPerformance: productPerfAgg
    });
  } catch (error) {
    console.error("Error generating reports:", error);
    return res.status(500).json({ message: "Error generating reports", error });
  }
});

export default router;
