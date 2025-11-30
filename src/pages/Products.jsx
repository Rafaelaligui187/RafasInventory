import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Products() {
  const dummyProducts = [
    {
      id: 1,
      name: "Wireless Mouse",
      price: "₱350",
      stock: 25,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      name: "USB Keyboard",
      price: "₱450",
      stock: 12,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      name: "Laptop Stand",
      price: "₱600",
      stock: 18,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 1,
      name: "Wireless Mouse",
      price: "₱350",
      stock: 25,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      name: "USB Keyboard",
      price: "₱450",
      stock: 12,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      name: "Laptop Stand",
      price: "₱600",
      stock: 18,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 1,
      name: "Wireless Mouse",
      price: "₱350",
      stock: 25,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      name: "USB Keyboard",
      price: "₱450",
      stock: 12,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      name: "Laptop Stand",
      price: "₱600",
      stock: 18,
      image: "https://via.placeholder.com/150"
    },

  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Product List</h2>

      <div className="row">
        {dummyProducts.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card shadow-sm">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Price: {product.price}</p>
                <p className="card-text">Stock: {product.stock}</p>
                <button className="btn btn-primary w-100">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
