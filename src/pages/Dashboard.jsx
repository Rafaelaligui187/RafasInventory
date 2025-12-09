import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar,
  PieChart, Pie,
  LineChart, Line,
  XAxis, YAxis, Tooltip,
  Legend, CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function Dashboard({ userId }) {
  const [products, setProducts] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    if (!userId) return;
    loadProducts();
    loadStockHistory();
    loadSales();
  }, [userId]);

  const loadProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${userId}`);
      console.log("Products:", res.data);
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  const loadStockHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stockHistory/${userId}`);
      console.log("Stock History:", res.data);
      setStockHistory(res.data);
    } catch (err) {
      console.error("Error loading stock history:", err);
    }
  };

  const loadSales = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sales/${userId}`);
      console.log("Sales:", res.data);
      setSales(res.data);
    } catch (err) {
      console.error("Error loading sales:", err);
    }
  };

  // TOTALS
  const totalProducts = products.length;
  const totalStockQty = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockList = products.filter(p => (p.stock || 0) < 5);

  const totalRevenue = sales.reduce((sum, s) => sum + (s.total || 0), 0);
  const today = new Date().toDateString();
  const todaysSales = sales.filter(s => new Date(s.createdAt).toDateString() === today).length;

  // BAR CHART: Stock per product
  const stockBarData = products.map(p => ({
    name: p.name,
    stock: p.stock || 0
  }));

  // PIE CHART: Category distribution
  const categoryCounts = {};
  products.forEach(p => {
    const cat = p.category || "Uncategorized";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryPieData = Object.keys(categoryCounts).map(key => ({
    name: key,
    value: categoryCounts[key]
  }));

  // LINE CHART: Stock activity timeline
  const lineData = stockHistory.map(h => ({
    date: new Date(h.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    quantity: h.quantity * (h.action === "IN" ? 1 : -1)
  }));

  return (
    <div className="container mt-5 pt-4">
    <h2 className="mb-3 text-center">Dashboard</h2>

    {/* TOP CARDS */}
    <div className="row g-3">
      <div className="col-12 col-sm-6 col-md-3">
        <div className="p-3 bg-primary text-white rounded text-center">
          <h5>Total Products</h5>
          <h2>{totalProducts}</h2>
        </div>
      </div>

      <div className="col-12 col-sm-6 col-md-3">
        <div className="p-3 bg-success text-white rounded text-center">
          <h5>Total Stock</h5>
          <h2>{totalStockQty}</h2>
        </div>
      </div>

      <div className="col-12 col-sm-6 col-md-3">
        <div className="p-3 bg-info text-white rounded text-center">
          <h5>Today's Sales</h5>
          <h2>{todaysSales}</h2>
        </div>
      </div>

      <div className="col-12 col-sm-6 col-md-3">
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
        <p className="text-center">No low stock items.</p>
      ) : (
        <ul className="list-unstyled text-center">
          {lowStockList.map(item => (
            <li key={item._id} className="text-danger fw-bold">
              {item.name} — {item.stock} left
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* CHARTS */}
  <div className="row mt-4 g-3">
    <div className="col-12 col-lg-6" style={{ minHeight: "300px" }}>
      <h5 className="text-center">Stock per Product</h5>
      {stockBarData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={stockBarData}
            margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              interval={0} 
              tick={{ fontSize: 12 }} 
              angle={-30} 
              textAnchor="end" 
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="stock" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center">No product data</p>
      )}
    </div>

    <div className="col-12 col-lg-6" style={{ minHeight: "300px" }}>
      <h5 className="text-center">Category Distribution</h5>
      {categoryPieData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryPieData}
              dataKey="value"
              nameKey="name"
              outerRadius={80} // smaller radius for mobile
              fill="#82ca9d"
              label={{ fontSize: 12 }}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center">No category data</p>
      )}
    </div>
  </div>

  {/* LINE CHART */}
  <div className="mt-4" style={{ minHeight: "300px" }}>
    <h5 className="text-center">Stock Activity Timeline</h5>
    {lineData.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={lineData}
          margin={{ top: 20, right: 20, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            interval={0} 
            angle={-30} 
            textAnchor="end" 
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <p className="text-center">No stock activity yet</p>
    )}
  </div>


  {/* LINE CHART */}
  <div className="mt-4">
    <h5 className="text-center">Stock Activity Timeline</h5>
    {lineData.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <p className="text-center">No stock activity yet</p>
    )}
  </div>
</div>

  );
}
