import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  return (
   <div className="container mt-5">

      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">Welcome to Rafa Inventory</h1>
        <p className="text-muted">
          A simple and efficient way to manage your products.
        </p>
      </div>

      {/* Login Form Section */}
      <form className="w-50 mx-auto border p-4 rounded shadow bg-blue-light">
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1"/>
        </div>
        <div class="d-grid gap-2">
          <button class="btn btn-primary" type="submit">Login</button>
          <p>Create account?<a href="/signup"> Signup</a></p>
        </div>

      </form>

    </div>
  );
    
}
