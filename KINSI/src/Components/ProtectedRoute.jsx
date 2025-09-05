import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser } = useAuth();

  // Not logged in → redirect to login
  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  // Role not allowed → redirect to "unauthorized" page (or another route)
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If checks pass → show the protected component
  return <Outlet />;
};

export default ProtectedRoute;
