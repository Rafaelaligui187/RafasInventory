import React, { useEffect, useState } from "react";
import axios from "axios";
import Barcode from "react-barcode";

export default function StockHistory() {
  const [stockHistory, setStockHistory] = useState([]);
  const [products, setProducts] = useState([]); // Load all products
  const [viewProduct, setViewProduct] = useState(null); // For modal
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

  // Load all products (to reference names and details)
  const loadProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${userId}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
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
            stockHistory.map((s) => {
              const product = products.find((p) => p._id === s.productId);
              return (
                <tr key={s._id}>
                  <td>{new Date(s.createdAt).toLocaleString()}</td>
                  <td>
                    {product ? (
                      <button
                        className="btn btn-link p-0"
                        style={{ textDecoration: "underline" }}
                        onClick={() => setViewProduct(product)}
                      >
                        {s.productName}
                      </button>
                    ) : (
                      s.productName
                    )}
                  </td>
                  <td>{s.quantity}</td>
                  <td>{s.action}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {/* View Product Modal */}
      {viewProduct && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          style={{
            display: "flex",
            background: "rgba(0,0,0,0.5)",
            minHeight: "100vh",
            padding: "15px"
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content d-flex flex-column" style={{ maxHeight: "90vh" }}>
              
              {/* Header */}
              <div className="modal-header flex-shrink-0">
                <h5 className="modal-title">{viewProduct.name}</h5>
                <button className="btn-close" onClick={() => setViewProduct(null)}></button>
              </div>

              {/* Scrollable Body */}
              <div
                className="modal-body overflow-auto"
                style={{ padding: "15px", flexGrow: 1 }}
              >
                <img
                  src={viewProduct.image}
                  alt={viewProduct.name}
                  className="img-fluid mb-3"
                  style={{ maxHeight: "300px", objectFit: "contain" }}
                />

                <p style={{ fontWeight: "bold", fontSize: "1.5rem" }}>{viewProduct.name}</p>

                <div className="d-flex justify-content-center mb-3">
                  <Barcode value={viewProduct.sku} format="CODE128" />
                </div>

                <p style={{ fontWeight: "bold", fontSize: 20 }}>Price: ₱ {viewProduct.price}</p>
                <p style={{ fontWeight: "bold", fontSize: 20 }}>Stock: {viewProduct.stock}</p>

                {/* Scrollable Description */}
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    textAlign: "left",
                    backgroundColor: "#f9f9f9"
                  }}
                >
                  <p>{viewProduct.productDescription || "No description available."}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer flex-shrink-0 justify-content-center">
                <button className="btn btn-secondary" onClick={() => setViewProduct(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}       
    </div>
  );
}
