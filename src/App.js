import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import PrivateLayout from "layouts/PrivateLayout.jsx";
import { ToastContainer } from "react-toastify";
// Pages
import Login from "pages/login/Login.jsx";
import Signup from "pages/signup/Singup.jsx";
import LoginWithOtp from "pages/login-with-otp/LoginWithOtp";
import ForgotPassword from "pages/forgot-password/ForgotPassword";
import ResetPassword from "pages/reset-password/ResetPassword";
import SignupProvider from "context/signupContext";
import DashboardLayout from "layouts/DashboardLayout";
import Setting from "pages/setting/Setting";
import EditProfile from "pages/editProfile/EditProfile";
import ChangePassword from "pages/change-password/ChangePassword";
import Wallet from "pages/wallet/Wallet";
import AddCard from "pages/add-card/AddCard";
import LinkBank from "pages/linkBank/LinkBank";
import Contacts from "pages/contacts/Contacts";
import Logout from "pages/logout/Logout";
import PublicLayout from "layouts/PublicLayout";
import ViewCard from "pages/view-card/ViewCard";
import Profile from "pages/profile/Profile";
import BusinessInfo from "pages/businessInfo/BusinessInfo";

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
        {/* List of Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/login-with-otp" element={<LoginWithOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:mobile/:token"
            element={<ResetPassword />}
          />
          <Route
            path="/signup"
            element={
              <SignupProvider>
                <Signup />
              </SignupProvider>
            }
          />
        </Route>
        {/* List of Private Routes */}
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<DashboardLayout />}>
            {/* settings */}
            <Route path="/setting" element={<Setting />} />
            <Route path="/setting/edit-profile" element={<EditProfile />} />
            <Route path="/setting/notification" element={<></>} />
            <Route
              path="/setting/change-password"
              element={<ChangePassword />}
            />
            <Route path="/setting/business-info" element={<BusinessInfo />} />
            {/* wallet */}
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/wallet/add-card" element={<AddCard />} />
            <Route path="/wallet/link-bank" element={<LinkBank />} />
            <Route path="/view-card" element={<ViewCard />} />
            {/* contacts */}
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/logout" element={<Logout />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {/* Toast Container */}
      <ToastContainer position="bottom-left" autoClose={3000} />
    </>
  );
}

export default App;
