import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div className="container mt-5">

      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">Welcome to Rafa Inventory</h1>
        <p className="text-muted">
          A simple and efficient way to manage your products.
        </p>
      </div>

      {/* Content Section */}
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h4>Add Products</h4>
            <p>Easily add new items to your inventory.</p>
            <a href="/add-product" className="btn btn-primary">Add Product</a>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h4>View Inventory</h4>
            <p>Check all items currently stored in your system.</p>
            <a href="/inventory" className="btn btn-success">View Items</a>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h4>Manage Account</h4>
            <p>Access profile settings or modify login details.</p>
            <a href="/profile" className="btn btn-secondary">Profile</a>
          </div>
        </div>
      </div>

    </div>
  );
}
