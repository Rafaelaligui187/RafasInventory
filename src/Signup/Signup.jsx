import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Signup() {
  return (
   <div className="container mt-5">

      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">Welcome to Rafa Inventory</h1>
        <p className="text-muted">
          A simple and efficient way to manage your products.
        </p>
      </div>

      {/* Signup Form Section */}
      <form className="w-50 mx-auto border p-4 rounded shadow bg-blue-light">
        <div class="mb-3">
          <label for="fullname" class="form-label">Firstname and lastname</label>
        </div>
        <div class="input-group mb-3">
          <input type="text" aria-label="First name" class="form-control" placeholder="ex.. Juan"/>
          <input type="text" aria-label="Last name" class="form-control" placeholder="ex.. Dela Cruz"/>
        </div>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="ex.. Juan@email.com"/>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1"/>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Confirm Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1"/>
          
        </div>
        <div class="mb-3">
          <label for="tel" class="form-label">Phone no. </label>
          <input type="tel" name="phone" class="form-control"></input>
        </div>
        
        <div class="d-grid gap-2">
          <button class="btn btn-primary" type="submit">Signup</button>
          <p>Already have an account?<a href="/login"> Login</a></p>
        </div>
      </form>


    </div>
  );
    
}
