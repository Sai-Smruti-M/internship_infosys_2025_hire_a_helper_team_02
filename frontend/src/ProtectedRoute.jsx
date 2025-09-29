
import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  // If user manually clears storage or uses back/forward buttons, enforce redirect
  useEffect(() => {
    const handlePop = () => {
      const u = JSON.parse(localStorage.getItem("user"));
      const t = localStorage.getItem("token");
      if (!u || !t) {
        navigate("/", { replace: true });
      }
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [navigate]);

 
  if (!user || !token) {
    return <Navigate to="/" replace state={{ from: location }} />;

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    
    return <Navigate to="/" replace />;

  }

  return children;
};

export default ProtectedRoute;
