import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "shared/cookies";

export const Protected = ({ children }) => {
  const token = getCookie("auth._token.Bearer");
  let isLoggedIn;
  if (token) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
