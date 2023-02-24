import { storageRequest } from "helpers/storageRequests";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function PrivateLayout() {
  const token = storageRequest.getAuth();
  let isLoggedIn = false;
  if (token) isLoggedIn = true;

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return (
    <>
      <Outlet />
    </>
  );
}

export default PrivateLayout;
