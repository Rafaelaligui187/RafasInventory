import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [viewProduct, setViewProduct] = useState(null); // ✅ View modal

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    productDescription: "",
  });

  const userId = localStorage.getItem("userId");

  // FETCH PRODUCTS
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
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD OR UPDATE PRODUCT
  const handleSaveProduct = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/products/edit/${currentProductId}`, {
          ...form,
          ownedBy: userId
        });
      } else {
        await axios.post("http://localhost:5000/api/products/add", {
          ...form,
          ownedBy: userId
        });
      }

      setShowModal(false);
      setForm({ name: "", price: "", stock: "", image: "", productDescription: "" });
      setIsEditing(false);
      setCurrentProductId(null);
      loadProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // DELETE PRODUCT
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/delete/${id}`);
        loadProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // OPEN EDIT MODAL
  const handleEditProduct = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image,
      productDescription: product.productDescription || "",
    });
    setCurrentProductId(product._id);
    setIsEditing(true);
    setShowModal(true);
  };

  // OPEN VIEW MODAL
  const handleViewProduct = (product) => {
    setViewProduct(product);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Product List</h2>

      <button
        className="btn btn-lg mb-4 text-light"
        style={{backgroundColor: '#181818ff'}}
        onClick={() => {
          setForm({ name: "", price: "", stock: "", image: "", productDescription: "" });
          setIsEditing(false);
          setShowModal(true);
        }}
      >
        Add Product
      </button>

      {/* PRODUCT GRID */}
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product._id}>
            <div className="card shadow-lg">
              <img src={product.image} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p>Price: ₱ {product.price}</p>
                <p>Stock: {product.stock}</p>
                <button className="btn w-100 mb-1 text-light" style={{backgroundColor: '#181818ff'}} onClick={() => handleViewProduct(product)}>
                  View Product
                </button>
                <button className="btn w-100 mb-1 text-light" style={{backgroundColor: '#181818ff'}} onClick={() => handleEditProduct(product)}>
                  Edit
                </button>
                <button className="btn w-100 mb-1 text-light" style={{backgroundColor: '#ff3e3eff'}} onClick={() => handleDeleteProduct(product._id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? "Edit Product" : "Add New Product"}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body">
                <input
                  name="name"
                  placeholder="Product name"
                  className="form-control mb-2"
                  value={form.name}
                  onChange={handleChange}
                />
                <input
                  name="price"
                  type="number"
                  placeholder="Price"
                  className="form-control mb-2"
                  value={form.price}
                  onChange={handleChange}
                />
                <input
                  name="stock"
                  type="number"
                  placeholder="Stock"
                  className="form-control mb-2"
                  value={form.stock}
                  onChange={handleChange}
                />
                <input
                  name="image"
                  placeholder="Image URL"
                  className="form-control mb-2"
                  value={form.image}
                  onChange={handleChange}
                />
                <textarea
                  name="productDescription"
                  placeholder="Product Description"
                  className="form-control mb-2"
                  value={form.productDescription}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveProduct}>
                  {isEditing ? "Update Product" : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PRODUCT MODAL */}
      {viewProduct && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View Product</h5>
                <button className="btn-close" onClick={() => setViewProduct(null)}></button>
              </div>

              <div className="modal-body">
                <img src={viewProduct.image} className="img-fluid mb-2" alt={viewProduct.name} />
                <h5>{viewProduct.name}</h5>
                <p>Price: ₱ {viewProduct.price}</p>
                <p>Stock: {viewProduct.stock}</p>
                <p>{viewProduct.productDescription}</p>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setViewProduct(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
