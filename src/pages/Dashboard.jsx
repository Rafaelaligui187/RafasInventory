import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar,
  PieChart, Pie,
  LineChart, Line,
  XAxis, YAxis, Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function Dashboard({ userId }) {
  const [products, setProducts] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, historyRes, salesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/products/${userId}`),
          axios.get(`http://localhost:5000/api/stockhistories/${userId}`),
          axios.get(`http://localhost:5000/api/sales/${userId}`)
        ]);

        setProducts(productsRes.data || []);
        setStockHistory(historyRes.data || []);
        setSales(salesRes.data || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  if (loading) return <p className="text-center mt-4">Loading dashboard...</p>;

  // TOTALS
  const totalProducts = products.length;
  const totalStockQty = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockList = products.filter((p) => p.stock < 5);
  const totalRevenue = sales.reduce((sum, s) => sum + (s.total || 0), 0);

  // Today's sales
  const todayStr = new Date().toDateString();
  const todaysSales = sales.filter(s => new Date(s.createdAt).toDateString() === todayStr).length;

  // BAR CHART DATA: stock per product
  const stockBarData = products.map(p => ({
    name: p.name,
    stock: p.stock
  }));

  // PIE CHART DATA: category distribution
  const categoryCounts = {};
  products.forEach(p => {
    const cat = p.category || "Uncategorized";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const categoryPieData = Object.keys(categoryCounts).map(key => ({
    name: key,
    value: categoryCounts[key]
  }));

  // LINE CHART DATA: stock activity timeline
  const lineDataMap = {};
  stockHistory.forEach(h => {
    const dateStr = new Date(h.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
    const qty = h.quantity * (h.action === "IN" ? 1 : -1);
    lineDataMap[dateStr] = (lineDataMap[dateStr] || 0) + qty;
  });

  const lineData = Object.keys(lineDataMap).map(date => ({
    date,
    quantity: lineDataMap[date]
  }));

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Dashboard</h2>

      {/* TOP CARDS */}
      <div className="row">
        <div className="col-md-3 mb-2">
          <div className="p-3 bg-primary text-white rounded text-center">
            <h5>Total Products</h5>
            <h2>{totalProducts}</h2>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="p-3 bg-success text-white rounded text-center">
            <h5>Total Stock</h5>
            <h2>{totalStockQty}</h2>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="p-3 bg-info text-white rounded text-center">
            <h5>Today's Sales</h5>
            <h2>{todaysSales}</h2>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="p-3 bg-warning text-white rounded text-center">
            <h5>Total Revenue</h5>
            <h2>₱{totalRevenue}</h2>
          </div>
        </div>
      </div>

      {/* LOW STOCK */}
      <div className="mt-4">
        <h4>Low Stock Items</h4>
        {lowStockList.length === 0 ? (
          <p>No low stock items.</p>
        ) : (
          <ul>
            {lowStockList.map(item => (
              <li key={item._id} style={{ color: "red", fontWeight: "bold" }}>
                {item.name} — {item.stock} left
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CHARTS */}
      <div className="row mt-4">
        {/* Bar Chart */}
        <div className="col-md-6 mb-4" style={{ height: "300px" }}>
          <h5>Stock per Product</h5>
          {stockBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No product data</p>
          )}
        </div>

        {/* Pie Chart */}
        <div className="col-md-6 mb-4" style={{ height: "300px" }}>
          <h5>Category Distribution</h5>
          {categoryPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  fill="#82ca9d"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No category data</p>
          )}
        </div>

        {/* Line Chart */}
        <div className="col-md-12" style={{ height: "300px" }}>
          <h5>Stock Activity Timeline</h5>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="quantity" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No stock activity yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
