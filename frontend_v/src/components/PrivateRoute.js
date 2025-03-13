// frontend/src/components/PrivateRoute.js
import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated, refreshToken } from "../utils/auth";

const PrivateRoute = () => {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const verifyToken = async () => {
      if (!isAuth) {
        const newToken = await refreshToken();
        if (newToken) setIsAuth(true);
      }
      setLoading(false);
    };
    verifyToken();
  }, [isAuth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuth) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user is trying to access admin dashboard
  if (location.pathname === "/admin-dashboard" && userRole !== "System Admin") {
    // Redirect non-admin users to user dashboard
    return <Navigate to="/user-dashboard" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
