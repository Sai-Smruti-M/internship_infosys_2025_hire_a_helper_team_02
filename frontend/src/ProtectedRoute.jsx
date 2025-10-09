
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const location = useLocation();


  if (!user || !token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Pure auth guard only — no history manipulation here
  return <>{children}</>;
};

export default ProtectedRoute;
