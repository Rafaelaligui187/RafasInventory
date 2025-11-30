import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // ✅ Redirect to Products page after successful login
        navigate("/products");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
      alert("Login failed.");
    }
  };

  return (
    <div className="container mt-5">
      <title>Login</title>

      <div className="text-center mb-5">
        <h1 className="fw-bold">Welcome to Rafas Inventory</h1>
        <p className="text-muted">A simple and efficient way to manage your products.</p>
      </div>

      <form
        className="w-50 mx-auto border p-4 rounded shadow bg-blue-light"
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            value={formData.email}
            onChange={handleChange}
            type="email"
            className="form-control"
            name="email"
            placeholder="ex.. Juan@email.com"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            value={formData.password}
            onChange={handleChange}
            type="password"
            className="form-control"
            name="password"
            placeholder="Enter password"
            required
          />
        </div>

        <div className="d-grid gap-2">
          <button className="btn btn-primary" type="submit">Login</button>
          <p>Create account? <a href="/signup">Signup</a></p>
          <p>Forgot password? <a href="/">Work in progress</a></p>
        </div>
      </form>
    </div>
  );
}
