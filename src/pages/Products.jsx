import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Products() {
  const dummyProducts = [
    {
      id: 1,
      name: "Wireless Mouse",
      price: "₱350",
      stock: 25,
      image: "https://contents.mediadecathlon.com/p1574676/k$3be5882a1bce6c60c24269eb54c6af5f/riverside-100-hybrid-bike-matte-black-riverside-8550625.jpg?f=1920x0&format=auto"
    },
    {
      id: 1,
      name: "Wireless Mouse",
      price: "₱350",
      stock: 25,
      image: "https://contents.mediadecathlon.com/p1574676/k$3be5882a1bce6c60c24269eb54c6af5f/riverside-100-hybrid-bike-matte-black-riverside-8550625.jpg?f=1920x0&format=auto"
    },
    {
      id: 1,
      name: "Wireless Mouse",
      price: "₱350",
      stock: 25,
      image: "https://contents.mediadecathlon.com/p1574676/k$3be5882a1bce6c60c24269eb54c6af5f/riverside-100-hybrid-bike-matte-black-riverside-8550625.jpg?f=1920x0&format=auto"
    },
    {
      id: 1,
      name: "Wireless Mouse",
      price: "₱350",
      stock: 25,
      image: "https://contents.mediadecathlon.com/p1574676/k$3be5882a1bce6c60c24269eb54c6af5f/riverside-100-hybrid-bike-matte-black-riverside-8550625.jpg?f=1920x0&format=auto"
    },
    {
      id: 1,
      name: "Wireless Mouse",
      price: "₱350",
      stock: 25,
      image: "https://contents.mediadecathlon.com/p1574676/k$3be5882a1bce6c60c24269eb54c6af5f/riverside-100-hybrid-bike-matte-black-riverside-8550625.jpg?f=1920x0&format=auto"
    },
    {
      id: 1,
      name: "Wireless Mouse",
      price: "₱350",
      stock: 25,
      image: "https://contents.mediadecathlon.com/p1574676/k$3be5882a1bce6c60c24269eb54c6af5f/riverside-100-hybrid-bike-matte-black-riverside-8550625.jpg?f=1920x0&format=auto"
    },
    

  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Product List</h2>

      <button type="button" class="btn btn-primary btn-lg mb-5">Add product</button>

      {/* search bar */}
      <nav class="navbar bg-body-tertiary">
        <div class="container-fluid">
          <form class="d-flex" role="search">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
            <button class="btn bg-success text-light" type="submit">Search</button>
          </form>
        </div>
      </nav>


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
                <button className="btn w-100 mb-1 text-light bg-primary">View Details</button>
                <button className="btn w-100 mb-1 text-light bg-secondary">Edit</button>
                <button className="btn w-100 mb-1 text-light bg-danger">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
