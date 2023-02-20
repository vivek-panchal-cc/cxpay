import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// Layouts
import DashboardLayout from "layouts/dashboard/DashboardLayout";
import PrivateRoute from "routes/PrivateRoute.jsx";
import { ToastContainer } from "react-toastify";
import EditProfile from "pages/editProfile/EditProfile.jsx";
// Pages
import Login from "pages/login/Login.jsx";
import Signup from "pages/signup/Singup.jsx";
import Setting from "pages/setting/Setting.jsx";
import LoginWithOtp from "pages/login-with-otp/LoginWithOtp";
import ChangePassword from "pages/change-password/ChangePassword";
import ForgotPassword from "pages/forgot-password/ForgotPassword";
import ResetPassword from "pages/reset-password/ResetPassword";
import AddCard from "pages/add-card/AddCard";

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:mobile/:token"
          element={<ResetPassword />}
        />
        {/* List of Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route path="/dashboard" element={<> Welcome, Dashboard </>} />
            {/* settings */}
            <Route path="/setting" element={<Setting />} />
            <Route path="/setting/edit-profile" element={<EditProfile />} />
            <Route path="/setting/notification" element={<></>} />
            <Route
              path="/setting/change-password"
              element={<ChangePassword />}
            />
            <Route path="/setting/business-info" element={<></>} />
            {/* wallet */}
            <Route path="/wallet" element={<>This is wallet</>} />
            <Route path="/wallet/add-card" element={<AddCard />} />
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
