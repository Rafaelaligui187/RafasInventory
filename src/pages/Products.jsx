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
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellForm, setSellForm] = useState({ productId: null, quantity: 1, pricePerUnit: 0 });
  const [sales, setSales] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    productDescription: "",
    category: "",
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


///////////////TO scrollable
  useEffect(() => {
  // Load products and stock history once
  loadProducts();
  loadStockHistory();
  loadSales();
}, []); // keep empty dependency so it runs only on mount

// NEW useEffect: handle body scroll when modals are open
useEffect(() => {
  if (viewProduct || showModal || showStockModal) {
    document.body.style.overflow = "hidden"; // disable background scroll
  } else {
    document.body.style.overflow = "auto"; // enable scroll again
  }

  // Cleanup when component unmounts
  return () => {
    document.body.style.overflow = "auto";
  };
}, [viewProduct, showModal, showStockModal]);


  // Handle product input changes
  const handleChange = async (e) => {
    if (e.target.name === "image" && e.target.files[0]) {
      const uploadedUrl = await uploadImageToImgBB(e.target.files[0]);
      setForm({ ...form, image: uploadedUrl });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };
  //////////////////////////////////////////////END OF USE EFFECT


  // Save product
  const handleSaveProduct = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/products/edit/${currentProductId}`, {
          ...form,
          ownedBy: userId,
          category: form.category,
        });
      } else {
        await axios.post("http://localhost:5000/api/products/add", {
          ...form,
          ownedBy: userId,
          category: form.category,
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

  ///FOR SALE
  const handleSellModal = (product) => {
  setSellForm({
    productId: product._id,
    quantity: 1,
    pricePerUnit: product.price || 0
  });
  setShowSellModal(true);
};
const handleSellChange = (e) => {
  setSellForm({ ...sellForm, [e.target.name]: e.target.value });
};

const handleSaveSale = async () => {
  try {
    await axios.post("http://localhost:5000/api/sales/add", {
      ...sellForm,
      quantity: Number(sellForm.quantity),
      pricePerUnit: Number(sellForm.pricePerUnit),
      ownedBy: userId
    });
    setShowSellModal(false);
    setSellForm({ productId: null, quantity: 1, pricePerUnit: 0 });
    await loadProducts();
    await loadStockHistory();
    await loadSales();
  } catch (err) {
    console.error("Error saving sale", err);
    alert(err.response?.data?.message || "Error saving sale");
  }
};

const loadSales = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/sales/${userId}`);
    setSales(res.data);
  } catch (err) {
    console.error("Error loading sales", err);
  }
};
//////////////////////////////////////////////////////////////


/////?Categories.  Add more if u want
  const categories = [
  "Electronics",
  "Apparel",
  "Food & Beverages",
  "Furniture",
  "Stationery",
  "Health & Beauty",
];


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
                <h5 className="card-title" style={{fontSize: 30}}>{product.name}</h5>
                <p>SKU: {product.sku}</p>
                <p>Price: ₱ {product.price}</p>
                <p>Stock: {product.stock}</p>
                <th>{product.category}</th>
                <button className="btn btn-dark w-100 mb-1" onClick={() => handleViewProduct(product)}>
                  View
                </button>
                <button className="btn btn-secondary w-100 mb-1" onClick={() => handleEditProduct(product)}>
                  Edit
                </button>
                <button className="btn btn-danger w-100 mb-1" onClick={() => handleDeleteProduct(product._id)}>
                  Delete
                </button>
                <button className="btn btn-warning w-100 mb-1" onClick={() => handleStockModal(product)}>
                  Update Stock
                </button>
                <button className="btn btn-success w-100 mb-1" onClick={() => handleSellModal(product)}>
                  Sell Product
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
                {/* CATEGORY */}
                <select
                  name="category"
                  className="form-control mb-2"
                  value={form.category || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>

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
                <p style={{ fontWeight: "bold", fontSize: 20 }}>Category: {viewProduct.category}</p>

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

      {/* Sell Modal */}
        {showSellModal && (
          <div className="modal fade show d-flex align-items-center justify-content-center"
              style={{ display: "flex", background: "rgba(0,0,0,0.5)", minHeight: "100vh" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Sell Product</h5>
                  <button className="btn-close" onClick={() => setShowSellModal(false)}></button>
                </div>
                <div className="modal-body">
                  <label>Product:</label>
                  <input className="form-control mb-2" disabled value={
                    products.find(p => p._id === sellForm.productId)?.name || ""
                  } />

                  <label>Quantity:</label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-control mb-2"
                    min="1"
                    value={sellForm.quantity}
                    onChange={handleSellChange}
                  />

                  <label>Price per unit:</label>
                  <input
                    type="number"
                    name="pricePerUnit"
                    className="form-control mb-2"
                    value={sellForm.pricePerUnit}
                    onChange={handleSellChange}
                  />

                  <div className="mt-2">
                    <strong>Total: ₱ { (Number(sellForm.quantity) * Number(sellForm.pricePerUnit)).toFixed(2) }</strong>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowSellModal(false)}>Cancel</button>
                  <button className="btn btn-success" onClick={handleSaveSale}>Confirm Sell</button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
