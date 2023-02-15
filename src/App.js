import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import Signup from "./pages/signup/Singup.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import PrivateRoute from "routes/PrivateRoute.jsx";
import LoginWithOtp from "pages/loginWithOtp/LoginWithOtp.jsx";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/dashboard" element={ <Dashboard />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-with-otp" element={<LoginWithOtp />} />
        <Route path="/signup" element={<Signup />} />
        {/* List of Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/private" element={<> Accessible after login! </>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {/* Toast Container */}
      <ToastContainer position="bottom-left" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
