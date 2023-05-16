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
import EditProfile from "pages/edit-profile/EditProfile";
import ChangePassword from "pages/change-password/ChangePassword";
import Wallet from "pages/wallet/Wallet";
import AddCard from "pages/add-card/AddCard";
import LinkBank from "pages/link-bank/LinkBank";
import Contacts from "pages/contacts/Contacts";
import ContactsInvited from "pages/contacts-invited/ContactsInvited";
import Logout from "pages/logout/Logout";
import PublicLayout from "layouts/PublicLayout";
import ViewCard from "pages/view-card/ViewCard";
import Profile from "pages/profile/Profile";
import Notification from "pages/notification/Notification";
import BusinessInfo from "pages/businessInfo/BusinessInfo";
import BankList from "pages/bank-list/BankList";
import { storageRequest } from "helpers/storageRequests";
import EditCard from "pages/edit-card/EditCard";
import EditBank from "pages/edit-bank/EditBank";
import SendContact from "pages/send/SendContact";
import EditGroup from "pages/edit-group/EditGroup";
import FundAccount from "pages/fund-account/FundAccount";
import SignupFundAccount from "pages/signup/components/SignupFundAccount";
import ViewNotification from "pages/view-notification/ViewNotification";
import SendPayment from "pages/send-payment/SendPayment";
import RequestContact from "pages/request/RequestContact";
import ContactsLayout from "layouts/ContactsLayout";
import RequestPayment from "pages/request-payment/RequestPayment";
import ViewSchedulePayment from "pages/view-schedule-payment/ViewSchedulePayment";
import Activities from "pages/activities/Activities";
import ScheduledPaymentLayout from "layouts/ScheduledPaymentLayout";
import EditScheduledPayment from "pages/edit-scheduled-payment/EditScheduledPayment";

async function loadData() {
  await import(`./styles/js/custom`);
}

function App() {
  const location = useLocation();

  useEffect(() => {
    loadData();
    if (location.pathname && !location.pathname.includes("/signup"))
      storageRequest.removeSignupCreds();
  }, [location.pathname]);

  return (
    <>
      <Routes>
        {/* List of Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/login-with-otp" element={<LoginWithOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:code/:mobile/:token"
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
          <Route path="/signup/:fundtype" element={<SignupFundAccount />} />
          <Route path="/" element={<DashboardLayout />}>
            {/* settings */}
            <Route path="/setting" element={<Setting />} />
            <Route path="/setting/edit-profile" element={<EditProfile />} />
            <Route path="/setting/notification" element={<Notification />} />
            <Route
              path="/setting/change-password"
              element={<ChangePassword />}
            />
            <Route path="/setting/business-info" element={<BusinessInfo />} />
            {/* wallet */}
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/wallet/add-card" element={<AddCard />} />
            <Route path="/wallet/link-bank" element={<LinkBank />} />
            <Route path="/wallet/view-card" element={<ViewCard />} />
            <Route path="/wallet/view-card/edit-card" element={<EditCard />} />
            <Route path="/wallet/bank-list" element={<BankList />} />
            <Route
              path="/wallet/fund-account/:fundtype?"
              element={<FundAccount />}
            />
            <Route path="/profile" element={<Profile />} />
            {/* contacts */}
            <Route element={<ContactsLayout />}>
              <Route path="/activities" element={<Activities />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/contacts-invited" element={<ContactsInvited />} />
              <Route path="/edit-group/:id" element={<EditGroup />} />
              <Route path="/send" element={<SendContact />} />
              <Route path="/send/payment" element={<SendPayment />} />
              <Route path="/request" element={<RequestContact />} />
              <Route path="/request/payment" element={<RequestPayment />} />
              <Route path="/view-notification" element={<ViewNotification />} />
            </Route>
            <Route element={<ScheduledPaymentLayout />}>
              <Route
                path="/view-schedule-payment"
                element={<ViewSchedulePayment />}
              />
              <Route
                path="/view-schedule-payment/update"
                element={<EditScheduledPayment />}
              />
            </Route>
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
