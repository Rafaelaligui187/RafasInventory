import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // redirect to login page
  };

  return (
    <nav className="navbar bg-body-tertiary fixed-top">
      <div className="container-fluid bg-dark">
        <a className="navbar-brand text-light" href="#">Rafas Inventory</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon bg-light"></span>
        </button>
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="User Icon"
              width="60"
              height="60"
              className="rounded-circle"
            />
            {user && <p className="text-dark mb-0">{user.firstName} {user.lastName}</p>}
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/products">Products management</a>
                <a className="nav-link active" aria-current="page" href="/accountmanage">Manage account</a>
                <a className="nav-link active" aria-current="page" href="/history">Stock History</a>
                <a className="nav-link active" aria-current="page" href="/dashboard">Dashboard</a>
                <a className="nav-link active" aria-current="page" href="/reports">Reports</a>
                <a className="nav-link active" aria-current="page" href="/about">About</a>
              </li>
            </ul>
          </div>
          <button onClick={handleLogout} className="btn btn-outline-danger mt-3" type="button">Log out</button>
        </div>
      </div>
    </nav>
  );
}
