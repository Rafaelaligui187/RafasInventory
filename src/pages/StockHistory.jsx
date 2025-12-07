import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StockHistory() {
  const [stockHistory, setStockHistory] = useState([]);
  const userId = localStorage.getItem("userId");

  // Load stock history
  const loadStockHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stockHistory/${userId}`);
      setStockHistory(res.data);
    } catch (error) {
      console.error("Error loading stock history:", error);
    }
  };

  useEffect(() => {
    loadStockHistory();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Stock History</h2>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stockHistory.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No stock history yet.</td>
            </tr>
          ) : (
            stockHistory.map((s) => (
              <tr key={s._id}>
                <td>{new Date(s.createdAt).toLocaleString()}</td>
                <td>{s.productName}</td>
                <td>{s.quantity}</td>
                <td>{s.action}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
