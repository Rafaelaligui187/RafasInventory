import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [viewProduct, setViewProduct] = useState(null); // ✅ View modal
  const [searchQuery, setSearchQuery] = useState(""); // For Searching Product

  const [form, setForm] = useState({
    name: "",          // Product name
    price: "",         // Product price
    stock: "",         // Product stock
    image: "",         // Product image
    productDescription: "", // Product description
  });

  const userId = localStorage.getItem("userId");

  // IMGBB UPLOAD FUNCTION
  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=4b59f8977ddecb0dae921ba1d6a3654d`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.data.url; // returns uploaded image URL
  };

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
    (async () => {
      await loadProducts();
    })();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = async (e) => {
    if (e.target.name === "image" && e.target.files[0]) {
      const uploadedUrl = await uploadImageToImgBB(e.target.files[0]);
      setForm({ ...form, image: uploadedUrl });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
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

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sticky-top bg-white pt-3 pb-3" style={{ zIndex: 1000, borderBottom: "2px solid #ddd" }}>
      <h2 className="text-center mt-5">Product List</h2>

      {/* SEARCH PRODUCT */}
      <input
        className="form-control mb-3"
        style={{ borderColor: "black" }}
        type="search"
        placeholder="Search Products"
        aria-label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* ADD PRODUCT BUTTON */}
      <button
        className="btn btn-lg mb-3 text-light w-30"
        style={{ backgroundColor: "#181818ff" }}
        onClick={() => {
          setForm({ name: "", price: "", stock: "", image: "", productDescription: "" });
          setIsEditing(false);
          setShowModal(true);
        }}
      >
        Add Product
      </button>

      <div style={{ fontSize: 20, fontWeight: "bold" }}>
        Total Products: <strong>{products.length}</strong>
      </div>

      {/* PRODUCT GRID */}
      <div className="row" style={{ maxHeight: "70vh", overflowY: "auto", paddingTop: "10px" }}>
        {filteredProducts.map((product) => (
          <div className="col-md-4 mb-4" key={product._id}>
            <div className="card shadow-lg">
              <img src={product.image} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p>SKU: {product.sku}</p>
                <p>Price: ₱ {product.price}</p>
                <p>Stock: {product.stock}</p>
                <button className="btn w-100 mb-1 text-light" style={{ backgroundColor: '#181818ff' }} onClick={() => handleViewProduct(product)}>
                  View Product
                </button>
                <button className="btn w-100 mb-1 text-light" style={{ backgroundColor: '#646464ff' }} onClick={() => handleEditProduct(product)}>
                  Edit Product
                </button>
                <button className="btn w-100 mb-1 text-light" style={{ backgroundColor: '#ff3e3eff' }} onClick={() => handleDeleteProduct(product._id)}>
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="modal fade show d-flex align-items-center justify-content-center" style={{ display: "flex", background: "rgba(0,0,0,0.5)", minHeight: "100vh" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? "Edit Product" : "Add New Product"}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveProduct(); }}>
                <div className="modal-body text-center">
                  Product name:
                  <input
                    name="name"
                    placeholder="Product name"
                    className="form-control mb-2"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />

                  Price:
                  <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    className="form-control mb-2"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />

                  Stock:
                  <input
                    name="stock"
                    type="number"
                    placeholder="Stock"
                    className="form-control mb-2"
                    value={form.stock}
                    onChange={handleChange}
                    required
                  />

                  {/* SKU is auto-generated — no input needed */}

                  Product Image
                  <input
                    type="file"
                    name="image"
                    className="form-control mb-2"
                    onChange={handleChange}
                    required={!isEditing}
                  />

                  {form.image && (
                    <img src={form.image} alt="Preview" className="img-fluid mb-2" />
                  )}

                  Product Description:
                  <textarea
                    name="productDescription"
                    placeholder="Product Description"
                    className="form-control mb-2"
                    value={form.productDescription}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="modal-footer justify-content-center">
                  <button className="btn btn-secondary" type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="btn text-light" style={{ backgroundColor: "#181818ff" }} type="submit">
                    {isEditing ? "Update Product" : "Save Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PRODUCT MODAL */}
      {viewProduct && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          style={{ display: "flex", background: "rgba(0,0,0,0.5)", minHeight: "100vh" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View Product</h5>
                <button className="btn-close" onClick={() => setViewProduct(null)}></button>
              </div>
              <div className="row" style={{ maxHeight: "70vh", overflowY: "auto", paddingTop: "10px" }}>
              <div className="modal-body">
                <img src={viewProduct.image} className="img-fluid mb-2" alt={viewProduct.name} />
                <h5 className="text-center">{viewProduct.name}</h5>
                <p style={{fontWeight: 'bold'}}>SKU: {viewProduct.sku}</p>
                <p style={{fontWeight: 'bold'}}>Price: ₱ {viewProduct.price}</p>
                <p style={{fontWeight: 'bold'}}>Stock: {viewProduct.stock}</p>
                <p>{viewProduct.productDescription}</p>
              </div>
              </div>
              <div className="modal-footer justify-content-center">
                <button className="btn btn-secondary" onClick={() => setViewProduct(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
