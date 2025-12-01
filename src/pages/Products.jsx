import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // FORM VALUES
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: ""
  });

  const userId = localStorage.getItem("userId");

  // FETCH PRODUCTS
  const loadProducts = async () => {
    const res = await axios.get(`http://localhost:5000/api/products/${userId}`);
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD PRODUCT
  const handleAddProduct = async () => {
    try {
      await axios.post("http://localhost:5000/api/products/add", {
        ...form,
        ownedBy: userId
      });

      setShowModal(false);
      loadProducts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4">Product List</h2>

      <button
        type="button"
        className="btn btn-primary btn-lg mb-4"
        onClick={() => setShowModal(true)}
      >
        Add Product
      </button>

      {/* PRODUCT GRID */}
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product._id}>
            <div className="card shadow-lg">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p>Price: ₱ {product.price}</p>
                <p>Stock: {product.stock}</p>
                <button className="btn btn-primary w-100 mb-1">View Product</button>
                <button className="btn w-100 mb-1 text-light" style={{background: '#55AB79'}}>Edit Product</button>
                <button className="btn btn-danger w-100 mb-1">Delete Product</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD PRODUCT MODAL */}
      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)"
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Add New Product</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body">
                <input
                  name="name"
                  placeholder="Product name"
                  className="form-control mb-2"
                  onChange={handleChange}
                />
                <input
                  name="price"
                  placeholder="Price"
                  className="form-control mb-2"
                  onChange={handleChange}
                />
                <input
                  name="stock"
                  placeholder="Stock"
                  className="form-control mb-2"
                  onChange={handleChange}
                />
                <input
                  name="image"
                  placeholder="Image URL"
                  className="form-control mb-2"
                  onChange={handleChange}
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAddProduct}>
                  Save Product
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
