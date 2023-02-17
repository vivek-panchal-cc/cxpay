import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// Pages
import Login from "./pages/login/Login.jsx";
import Signup from "./pages/signup/Singup.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import LoginWithOtp from "pages/loginWithOtp/LoginWithOtp.jsx";
// Layouts
import DashboardLayout from "layouts/dashboard/DashboardLayout";
import PrivateRoute from "routes/PrivateRoute.jsx";
import { ToastContainer } from "react-toastify";
import EditProfile from "pages/editProfile/EditProfile.jsx";

function App() {
  const location = useLocation();
  useEffect(() => {
    async function loadData() {
      await import(`./styles/js/custom`);
    }
    loadData();
  }, [location]);

  return (
    <>
      <Routes>
        {/* <Route path="/dashboard" element={ <Dashboard />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-with-otp" element={<LoginWithOtp />} />
        <Route path="/signup" element={<Signup />} />

        {/* List of Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route
              path="/dashboard"
              element={<> Welcome to the Dashboard </>}
            />
          </Route>
          <Route path="/private" element={<> Accessible after login! </>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {/* Toast Container */}
      <ToastContainer position="bottom-left" autoClose={3000} />
    </>
  );
}

export default App;
