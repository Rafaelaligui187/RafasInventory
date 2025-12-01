import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");

  // If NOT logged in, redirect to login page
  return user ? children : <Navigate to="/" replace />;
}
