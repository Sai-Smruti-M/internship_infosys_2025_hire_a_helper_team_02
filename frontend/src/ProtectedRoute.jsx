
import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();


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
  }

  return children;
};

export default ProtectedRoute;
