import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "shared/cookies";

function PrivateRoute() {
  const token = getCookie("auth._token.Bearer");
  let isLoggedIn = false;
  if (token) isLoggedIn = true;

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return (
    <>
      <Outlet />
    </>
  );
}

export default PrivateRoute;
