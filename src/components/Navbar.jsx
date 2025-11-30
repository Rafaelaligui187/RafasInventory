import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  return (
    <nav class="navbar bg-body-tertiary fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Rafas Inventory</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <img src="https://img.icons8.com/ios-filled/50/000000/user-male-circle.png" alt="User Icon" width="120" height="120" style={{alignSelf: "center"}}/>
          <div class="offcanvas-body ">
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3 ">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/products">Products management</a>
                <a class="nav-link active" aria-current="page" href="/accountmanage">Manage account</a>
                <a class="nav-link active" aria-current="page" href="/history">Stock History</a>
                <a class="nav-link active" aria-current="page" href="/dashboard">Dashboard</a>
                <a class="nav-link active" aria-current="page" href="/reports">Reports</a>
                <a class="nav-link active" aria-current="page" href="/about">About</a>
              </li>
              
              
            </ul>
            <form class="d-flex mt-3" role="search">
              <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
              <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
            <button class="btn btn-outline-danger" type="button">Log out</button>
        </div>
      </div>
      
</nav>
  );
}
