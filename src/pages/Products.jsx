import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Barcode from "react-barcode";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockForm, setStockForm] = useState({ quantity: 0, action: "IN", productId: null });
  const [stockHistory, setStockHistory] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    productDescription: "",
  });

  const userId = localStorage.getItem("userId");

  // Upload image to imgbb
  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=4b59f8977ddecb0dae921ba1d6a3654d`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    return data.data.url;
  };

  // Fetch products
  const loadProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${userId}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  // Fetch stock history
  const loadStockHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stockHistory/${userId}`);
      setStockHistory(res.data);
    } catch (error) {
      console.error("Error loading stock history:", error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadStockHistory();
  }, []);

  // Handle product input changes
  const handleChange = async (e) => {
    if (e.target.name === "image" && e.target.files[0]) {
      const uploadedUrl = await uploadImageToImgBB(e.target.files[0]);
      setForm({ ...form, image: uploadedUrl });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Save product
  const handleSaveProduct = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/products/edit/${currentProductId}`, {
          ...form,
          ownedBy: userId,
        });
      } else {
        await axios.post("http://localhost:5000/api/products/add", {
          ...form,
          ownedBy: userId,
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

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/delete/${id}`);
        loadProducts();
        loadStockHistory();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Open edit modal
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

  // Open view product modal
  const handleViewProduct = (product) => setViewProduct(product);

  // Open stock modal
  const handleStockModal = (product) => {
    setStockForm({ quantity: 0, action: "IN", productId: product._id });
    setShowStockModal(true);
  };

  // Handle stock input change
  const handleStockChange = (e) => setStockForm({ ...stockForm, [e.target.name]: e.target.value });

  // Save stock
  const handleSaveStock = async () => {
    try {
      await axios.post("http://localhost:5000/api/stockHistory/add", {
        ...stockForm,
        quantity: Number(stockForm.quantity),
        ownedBy: userId,
      });
      setShowStockModal(false);
      loadProducts();
      loadStockHistory();
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  // Filter products by name or SKU
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-3">Product List</h2>

      {/* Search */}
      <input
        className="form-control mb-3"
        type="search"
        placeholder="Search Products by Name or SKU"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Add Product */}
      <button
        className="btn btn-dark mb-3"
        onClick={() => {
          setForm({ name: "", price: "", stock: "", image: "", productDescription: "" });
          setIsEditing(false);
          setShowModal(true);
        }}
      >
        Add Product
      </button>

      <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Total Products: {products.length}
      </div>

      {/* Product Grid */}
      <div className="row">
        {filteredProducts.map((product) => (
          <div className="col-md-4 mb-4" key={product._id}>
            <div className="card shadow">
              <img src={product.image} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p>SKU: {product.sku}</p>
                <p>Price: ₱ {product.price}</p>
                <p>Stock: {product.stock}</p>
                <button className="btn btn-dark w-100 mb-1" onClick={() => handleViewProduct(product)}>
                  View
                </button>
                <button className="btn btn-secondary w-100 mb-1" onClick={() => handleEditProduct(product)}>
                  Edit
                </button>
                <button className="btn btn-danger w-100 mb-1" onClick={() => handleDeleteProduct(product._id)}>
                  Delete
                </button>
                <button className="btn btn-warning w-100" onClick={() => handleStockModal(product)}>
                  Update Stock
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          style={{ display: "flex", background: "rgba(0,0,0,0.5)", minHeight: "100vh" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? "Edit Product" : "Add Product"}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveProduct();
                }}
              >
                <div className="modal-body">

                  {/* PRODUCT NAME */}
                  <input
                    name="name"
                    className="form-control mb-2"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />

                  {/* PRICE */}
                  <input
                    name="price"
                    type="number"
                    className="form-control mb-2"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />

                  {/* STOCK — only visible when ADDING */}
                  {!isEditing && (
                    <input
                      name="stock"
                      type="number"
                      className="form-control mb-2"
                      placeholder="Initial Stock"
                      value={form.stock}
                      onChange={handleChange}
                      required
                    />
                  )}

                  {/* IMAGE */}
                  <input
                    type="file"
                    name="image"
                    className="form-control mb-2"
                    onChange={handleChange}
                    required={!isEditing} 
                  />

                  {form.image && <img src={form.image} alt="Preview" className="img-fluid mb-2" />}

                  {/* DESCRIPTION */}
                  <textarea
                    name="productDescription"
                    className="form-control"
                    placeholder="Product Description"
                    value={form.productDescription}
                    onChange={handleChange}
                  />
                </div>

                <div className="modal-footer justify-content-center">
                  <button className="btn btn-secondary" type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-dark" type="submit">
                    {isEditing ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      {/* View Product Modal */}
      {viewProduct && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          style={{ display: "flex", background: "rgba(0,0,0,0.5)", minHeight: "100vh" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{viewProduct.name}</h5>
                <button className="btn-close" onClick={() => setViewProduct(null)}></button>
              </div>
              <div className="modal-body text-center">
                <img src={viewProduct.image} alt={viewProduct.name} className="img-fluid mb-2" />
                <p style={{ fontWeight: "bold" }}>SKU: {viewProduct.sku}</p>
                <div className="d-flex justify-content-center mb-2">
                  <Barcode value={viewProduct.sku} format="CODE128" />
                </div>
                <p style={{ fontWeight: "bold" }}>Price: ₱ {viewProduct.price}</p>
                <p style={{ fontWeight: "bold" }}>Stock: {viewProduct.stock}</p>
                <p>{viewProduct.productDescription}</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button className="btn btn-secondary" onClick={() => setViewProduct(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Modal */}
      {showStockModal && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          style={{ display: "flex", background: "rgba(0,0,0,0.5)", minHeight: "100vh" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Stock</h5>
                <button className="btn-close" onClick={() => setShowStockModal(false)}></button>
              </div>
              <div className="modal-body">
                <label>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-control mb-2"
                  value={stockForm.quantity}
                  onChange={handleStockChange}
                />
                <label>Action:</label>
                <select name="action" className="form-control" value={stockForm.action} onChange={handleStockChange}>
                  <option value="IN">IN</option>
                  <option value="OUT">OUT</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowStockModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSaveStock}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
