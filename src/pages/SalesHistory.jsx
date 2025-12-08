import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const userId = localStorage.getItem("userId");

  const loadSales = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sales/${userId}`);
      setSales(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Sales History</h2>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>SKU</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.length === 0 ? (
            <tr><td colSpan="6" className="text-center">No sales yet.</td></tr>
          ) : (
            sales.map(s => (
              <tr key={s._id}>
                <td>{new Date(s.createdAt).toLocaleString()}</td>
                <td>{s.productName}</td>
                <td>{s.sku}</td>
                <td>{s.quantity}</td>
                <td>₱ {s.pricePerUnit}</td>
                <td>₱ {s.total}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
