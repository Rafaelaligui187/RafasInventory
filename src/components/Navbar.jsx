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

  ////LOG OUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // redirect to login page
  };

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand text-light" href="#">
          Rafas Inventory
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="offcanvas offcanvas-end text-bg-dark"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="text-center mb-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="User Icon"
              width="60"
              height="60"
              className="rounded-circle"
            />

            {user && (
              <p className="text-light fw-bold mt-2">
                {user.firstName} {user.lastName}
              </p>
            )}
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav text-light">
              <li className="nav-item"><a className="nav-link" href="/products">Products Management</a></li>
              <li className="nav-item"><a className="nav-link" href="/accountmanage">Manage Account</a></li>
              <li className="nav-item"><a className="nav-link" href="/stockhistory">Stock History</a></li>
              <li className="nav-item"><a className="nav-link" href="/dashboard">Dashboard</a></li>
              <li className="nav-item"><a className="nav-link" href="/reports">Reports</a></li>
              <li className="nav-item"><a className="nav-link" href="/about">About</a></li>
            </ul>

            <button
              onClick={handleLogout}
              className="btn btn-danger w-100 mt-4"
              type="button"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>

  );
}
