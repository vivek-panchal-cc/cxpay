import { usePinContext } from "context/pinContext";
import { Navigate, useLocation } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({ children }) => {
  const { isPinValidated } = usePinContext();
  const location = useLocation();
  
  if (!isPinValidated) {
    return <Navigate to="/setting" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;
