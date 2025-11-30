import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";


export default function Signup() {
  const navigate = useNavigate(); // ✅ Initialize navigate
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { firstName, lastName, email, password } = formData;

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();
      alert(data.message);

      if (data.success) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        navigate("/"); // ✅ Redirect to login page
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="container mt-5">
      <title>Signup</title>

      <div className="text-center mb-5">
        <h1 className="fw-bold">Welcome to Rafas Inventory</h1>
        <p className="text-muted">
          A simple and efficient way to manage your products.
        </p>
      </div>

      <form className="w-50 mx-auto border p-4 rounded shadow bg-blue-light" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="fullname" className="form-label">Firstname and lastname</label>
        </div>
        <div className="input-group mb-3">
          <input value={formData.firstName} onChange={handleChange} name="firstName" type="text" aria-label="First name" className="form-control" placeholder="ex.. Juan" required/>
          <input value={formData.lastName} onChange={handleChange} name="lastName" type="text" aria-label="Last name" className="form-control" placeholder="ex.. Dela Cruz" required/>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input value={formData.email} onChange={handleChange} type="email" className="form-control" name="email" aria-describedby="emailHelp" placeholder="ex.. Juan@email.com" required/>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input value={formData.password} onChange={handleChange} type="password" className="form-control" name="password" required/>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Confirm Password</label>
          <input value={formData.confirmPassword} onChange={handleChange} type="password" className="form-control" name="confirmPassword" />
        </div>
        

        <div className="d-grid gap-2">
          <button className="btn btn-primary" type="submit" href="/">Signup</button>
          <p>Already have an account?<a href="/"> Login</a></p>
        </div>
      </form>
    </div>
  );
}
