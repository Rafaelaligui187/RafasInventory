import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Reports() {
  const [salesSummary, setSalesSummary] = useState([]);
  const [inventorySummary, setInventorySummary] = useState({});
  const [stockMovements, setStockMovements] = useState([]);
  const [productPerformance, setProductPerformance] = useState([]);
  const [dateRange, setDateRange] = useState("today");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/reports/${userId}?range=${dateRange}`
      );

      setSalesSummary(res.data.salesSummary || []);
      setInventorySummary(res.data.inventorySummary || {});
      setStockMovements(res.data.stockMovements || []);
      setProductPerformance(res.data.productPerformance || []);
    } catch (err) {
      console.log("Error fetching reports:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Reports Dashboard</h2>

      {/* DATE FILTERS */}
      <div className="d-flex justify-content-center mb-4">
        <select
          className="form-select w-auto"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* ROW 1 — INVENTORY SUMMARY */}
      <div className="row g-3">
        <div className="col-md-3">
          <div className="p-3 bg-primary text-white rounded">
            <h6>Total Products</h6>
            <h3>{inventorySummary.totalProducts || 0}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 bg-success text-white rounded">
            <h6>Total Stock</h6>
            <h3>{inventorySummary.totalStock || 0}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 bg-warning text-white rounded">
            <h6>Inventory Value</h6>
            <h3>₱{inventorySummary.inventoryValue || 0}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 bg-danger text-white rounded">
            <h6>Low Stock Items</h6>
            <h3>{inventorySummary.lowStockCount || 0}</h3>
          </div>
        </div>
      </div>

      {/* SALES SUMMARY */}
      <div className="mt-5">
        <h4>Sales Summary</h4>
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Qty Sold</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {salesSummary.length === 0 ? (
                <tr>
                  <td colSpan="5">No sales in this period.</td>
                </tr>
              ) : (
                salesSummary.map((s) => (
                  <tr key={s._id}>
                    <td>{new Date(s.createdAt).toLocaleString()}</td>
                    <td>{s.productName}</td>
                    <td>{s.quantity}</td>
                    <td>₱ {s.pricePerUnit}</td>
                    <td>₱ {s.total}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STOCK MOVEMENT */}
      <div className="mt-5">
        <h4>Stock Movement</h4>
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Action</th>
                <th>Qty</th>
              </tr>
            </thead>

            <tbody>
              {stockMovements.length === 0 ? (
                <tr>
                  <td colSpan="4">No stock activity in this period.</td>
                </tr>
              ) : (
                stockMovements.map((m) => (
                  <tr key={m._id}>
                    <td>{new Date(m.createdAt).toLocaleString()}</td>
                    <td>{m.productName}</td>
                    <td>{m.action}</td>
                    <td>{m.quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRODUCT PERFORMANCE */}
      <div className="mt-5 mb-5">
        <h4>Product Performance</h4>
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Total Sold</th>
                <th>Total Revenue</th>
              </tr>
            </thead>

            <tbody>
              {productPerformance.length === 0 ? (
                <tr>
                  <td colSpan="3">No product performance data.</td>
                </tr>
              ) : (
                productPerformance.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.totalSold}</td>
                    <td>₱ {p.totalRevenue}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
