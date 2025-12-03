import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function About() {
  return (
    <>
    return (
    <div className="container" style={{ marginTop: "120px", marginBottom: "40px" }}>
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-3">About Rafas Inventory</h2>

        <p>
          <strong>Rafas Inventory</strong> is a simple and user-friendly inventory
          management system designed for easy tracking of products, stock levels,
          price updates, and overall store management.
        </p>

        <p>
          This system allows you to add, edit, view, and delete products with
          images, descriptions, and stock counts. It also includes features such
          as dashboard analytics, account management, stock history, and reports.
        </p>

        <p>
          The goal is to provide a clean and fast inventory solution for small
          businesses and personal use.
        </p>

        <hr />

        <h4>Developer</h4>
        <p>
          Created by <strong>Rafael Aligui</strong> as a personal project to
          improve skills in React, Node.js, MongoDB, and full-stack development.
        </p>

        <div className="about-section text-center mt-4">
          <h4>Social Media</h4>

          <div className="social-icons d-flex justify-content-center gap-3 mt-3">
            {/* Facebook */}
            <a href="https://www.facebook.com/RafaelL.AliguiDotaID414855942" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="40" height="40"/>
            </a>

            {/* YouTube */}
            <a href="https://www.youtube.com/@rafaelaligui3058" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" width="40" height="40"/>
            </a>

            {/* GitHub */}
            <a href="https://github.com/Rafaelaligui187" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub" width="40" height="40"/>
            </a>

            {/* Pixiv */}
            <a href="https://www.pixiv.net/en/users/88357352" target="_blank" rel="noopener noreferrer">
              <img src="https://s.pximg.net/soy/pixiv-web-next//_static/newLogo2025.svg" alt="Pixiv" width="40" height="40"/>
            </a>

            {/* Instagram
            <a href="https://www.instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="40" height="40"/>
            </a> */}
          </div>
        </div>

        
        <h5 className="mt-3">Email</h5>
        <p>aliguirafael@gmail.com</p>      
        <h5 className="mt-3">Version</h5>
        <p>Rafas Inventory v1.0.0 (2025)</p>
        <p>Date Created: 11/29/(2025)</p>
        <p>Date Finished: ???</p>
      </div>
    </div>
    </>
  );
}


