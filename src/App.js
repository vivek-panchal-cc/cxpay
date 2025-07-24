import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import PrivateLayout from "layouts/PrivateLayout.jsx";
import { ToastContainer } from "react-toastify";
// Pages
import KycComplete from "pages/kyc-complete-form/KycComplete.jsx";
import KycCompleteInitial from "pages/kyc-complete-form/KycCompleteInitial.jsx";
import KycManual from "pages/kyc-complete-form/KycManual";
import KycManualSecondStep from "pages/kyc-complete-form/Components/KycManualSecondStep";
import KycSendMail from "pages/kyc-complete-form/Components/KycSendMail";
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
import Merchants from "pages/merchants/Merchants";
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
import SendContact from "pages/send/SendContact";
import EditGroup from "pages/edit-group/EditGroup";
import FundAccount from "pages/fund-account/FundAccount";
import SignupFundAccount from "pages/signup/components/SignupFundAccount";
import ViewNotification from "pages/view-notification/ViewNotification";
import SendPayment from "pages/send-payment/SendPayment";
import RequestContact from "pages/request/RequestContact";
import RequestPayment from "pages/request-payment/RequestPayment";
import ViewSchedulePayment from "pages/view-schedule-payment/ViewSchedulePayment";
import Activities from "pages/activities/Activities";
import TopUpActivities from "pages/top-up/TopUpActivities";
import ScheduledPaymentLayout from "layouts/ScheduledPaymentLayout";
import EditScheduledPayment from "pages/edit-scheduled-payment/EditScheduledPayment";
import ViewRecurringPayment from "pages/view-recurring-payment/ViewRecurringPayment";
import RecurringPaymentLayout from "layouts/RecurringPaymentLayout";
import EditRecurringPayment from "pages/edit-recurring-payment/EditRecurringPayment";
import Dashboard from "pages/dashboard/Dashboard";
import WithdrawalsCard from "pages/withdrawals-card/WithdrawalsCard";
import WithdrawalsBank from "pages/withdrawals-bank/WithdrawalsBank";
import WithdrawCard from "pages/withdraw-card/WithdrawCard";
import WithdrawBank from "pages/withdraw-bank/WithdrawBank";
import WithdrawDetails from "pages/withdraw-details/WithdrawDetails";
import TopUp from "pages/top-up/TopUp";
import TopUpDetails from "pages/top-up/TopUpDetails";
import { useDispatch, useSelector } from "react-redux";
import RecurringPayment from "pages/recurring/RecurringPayment";
import SendRecurringPayment from "pages/send-recurring-payment/SendRecurringPayment";
import RecurringDetails from "pages/recurring-details/RecurringDetails";
import CMSContent from "pages/cms-content/cmsContent";
import AppSetting from "pages/app-settings/AppSetting";
import { fetchUserProfile } from "features/user/userProfileSlice";
import CMSPage from "pages/cms-content/CmsPage";
import FaqContent from "pages/cms-content/faq/FaqContent";
import { CmsProvider } from "context/cmsContext";
import { FaqProvider } from "context/faqContext";
import ChangePin from "pages/change-pin/ChangePin";
import SetPin from "pages/change-pin/SetPin";
import ForgotPin from "pages/forgot-pin/ForgotPin";
import PendingPin from "pages/pending-pin/PendingPin";
import ProtectedRoute from "components/protected-pin-route/ProtectedPin";
import OrgDashboard from "pages/dashboard/OrgDashboard";
import { useOrganizationSwitch } from "context/organizationSwitchContext";
import AppInstall from "pages/app-install/AppInstall";
import WellKnown from "pages/deep-linking/WellKnown";
import MerchantFeesReport from "pages/merchant-fees-report/MerchantFeesReport";
import ViewSharedJars from "pages/view-jars/ViewSharedJars";
import ViewOwnJars from "pages/view-jars/ViewOwnJars";
import ViewInvitedJars from "pages/view-jars/ViewInvitedJars";
import CreateJar from "pages/create-jar/CreateJar";
import JarSend from "pages/jar-send/JarSend";
import JarRecurringSend from "pages/jar-send/JarRecurringSend";
import JarRecurringSendPayment from "pages/jar-send/JarRecurringSendPayment";
import JarDetails from "pages/view-jars/JarDetails";
import EditJar from "pages/edit-jar/EditJar";
import JarMembers from "pages/jar-members/JarMembers";
import JarActivities from "pages/jar-activities/JarActivities";
import JarSchedulePayment from "pages/jar-schedule-payment/JarSchedulePayment";
import JarRecurringPayment from "pages/jar-recurring-payment/JarRecurringPayment";
import EditJarScheduledPayment from "pages/edit-jar-scheduled-payment/EditJarScheduledPayment";
import EditJarRecurringPayment from "pages/edit-jar-recurring-payment/EditJarRecurringPayment";
import JarRecurringDetails from "pages/jar-recurring-details/JarRecurringDetails";
import JarRoutesWrapper from "layouts/JarRoutesWrapper";
import UnderMaintenance from "pages/under-maintenance/UnderMaintenance";
import LoginWithEmail from "pages/login/LoginWithEmail";

async function loadData() {
  await import(`./styles/js/custom`);
}

// function withUserProtection(WrappedComponent, allowedUserTypes = []) {
//   return function ProtectedComponent(props) {
//     const { profile } = useSelector((state) => state.userProfile);
//     const { user_type } = profile || {};

//     if (profile && Object.keys(profile).length > 0 && !allowedUserTypes.includes(user_type)) {
//       console.warn("Unauthorized user type detected, navigating away");
//       return <Navigate to="/" />;
//     }
//     return <WrappedComponent {...props} />;
//   };
// }

function withUserProtection(WrappedComponent, allowedUserTypes = []) {
  return function ProtectedComponent(props) {
    const { profile } = useSelector((state) => state.userProfile);
    const { user_type } = profile || {};
    const loginCreds = storageRequest.getLoginCreds();
    const countryTimeZone = storageRequest.getTimeZone();

    if (!loginCreds || !countryTimeZone) {
      storageRequest.removeAuth();
    }

    if (profile && Object.keys(profile).length > 0) {
      if (!allowedUserTypes.includes(user_type)) {
        console.warn("Unauthorized user type detected, navigating away");
        return <Navigate to="/" />;
      }
    }
    return <WrappedComponent {...props} />;
  };
}

const AllowedAgent = ["agent"];
const AllowedBusiness = ["business"];
const AllowedBusinessPersonal = ["business", "personal"];
const AllowedAllTypes = ["business", "personal", "agent"];

// user_types = business and personal
const ProtectedWallet = withUserProtection(Wallet, AllowedBusinessPersonal);
const ProtectedAddCard = withUserProtection(AddCard, AllowedBusinessPersonal);
const ProtectedLinkBank = withUserProtection(LinkBank, AllowedBusinessPersonal);
const ProtectedViewCard = withUserProtection(ViewCard, AllowedBusinessPersonal);
const ProtectedEditCard = withUserProtection(EditCard, AllowedBusinessPersonal);
const ProtectedBankList = withUserProtection(BankList, AllowedBusinessPersonal);
const ProtectedFundAccount = withUserProtection(
  FundAccount,
  AllowedBusinessPersonal
);
const ProtectedWithdrawalsCard = withUserProtection(
  WithdrawalsCard,
  AllowedBusinessPersonal
);
const ProtectedWithdrawalsBank = withUserProtection(
  WithdrawalsBank,
  AllowedBusinessPersonal
);
const ProtectedWithdrawCard = withUserProtection(
  WithdrawCard,
  AllowedBusinessPersonal
);
const ProtectedWithdrawBank = withUserProtection(
  WithdrawBank,
  AllowedBusinessPersonal
);
const ProtectedWithdrawDetails = withUserProtection(
  WithdrawDetails,
  AllowedBusinessPersonal
);
const ProtectedActivities = withUserProtection(
  Activities,
  AllowedBusinessPersonal
);
const ProtectedContacts = withUserProtection(Contacts, AllowedBusinessPersonal);
const ProtectedMerchants = withUserProtection(
  Merchants,
  AllowedBusinessPersonal
);
const ProtectedMerchantFeesReport = withUserProtection(
  MerchantFeesReport,
  AllowedBusiness
);
const ProtectedContactsInvited = withUserProtection(
  ContactsInvited,
  AllowedBusinessPersonal
);
const ProtectedEditGroup = withUserProtection(
  EditGroup,
  AllowedBusinessPersonal
);
const ProtectedSendContact = withUserProtection(
  SendContact,
  AllowedBusinessPersonal
);
const ProtectedSendPayment = withUserProtection(
  SendPayment,
  AllowedBusinessPersonal
);
const ProtectedRequestContact = withUserProtection(
  RequestContact,
  AllowedBusinessPersonal
);
const ProtectedRequestPayment = withUserProtection(
  RequestPayment,
  AllowedBusinessPersonal
);
const ProtectedViewSchedulePayment = withUserProtection(
  ViewSchedulePayment,
  AllowedBusinessPersonal
);
const ProtectedEditScheduledPayment = withUserProtection(
  EditScheduledPayment,
  AllowedBusinessPersonal
);
const ProtectedEditProfile = withUserProtection(
  EditProfile,
  AllowedBusinessPersonal
);
const ProtectedRecurringPayment = withUserProtection(
  RecurringPayment,
  AllowedBusinessPersonal
);
const ProtectedSendRecurringPayment = withUserProtection(
  SendRecurringPayment,
  AllowedBusinessPersonal
);
const ProtectedViewRecurringPayment = withUserProtection(
  ViewRecurringPayment,
  AllowedBusinessPersonal
);
const ProtectedEditRecurringPayment = withUserProtection(
  EditRecurringPayment,
  AllowedBusinessPersonal
);
const ProtectedRecurringDetails = withUserProtection(
  RecurringDetails,
  AllowedBusinessPersonal
);
const ProtectedNotification = withUserProtection(
  Notification,
  AllowedBusinessPersonal
);
const ProtectedViewNotification = withUserProtection(
  ViewNotification,
  AllowedBusinessPersonal
);
const ProtectedSharedJars = withUserProtection(
  ViewSharedJars,
  AllowedBusinessPersonal
);
const ProtectedOwnJars = withUserProtection(
  ViewOwnJars,
  AllowedBusinessPersonal
);
const ProtectedInvitedJars = withUserProtection(
  ViewInvitedJars,
  AllowedBusinessPersonal
);
const ProtectedCreateJar = withUserProtection(
  CreateJar,
  AllowedBusinessPersonal
);
const ProtectedEditJar = withUserProtection(EditJar, AllowedBusinessPersonal);
const ProtectedJarSend = withUserProtection(JarSend, AllowedBusinessPersonal);
const ProtectedJarRecurringSend = withUserProtection(
  JarRecurringSend,
  AllowedBusinessPersonal
);
const ProtectedJarRecurringSendPayment = withUserProtection(
  JarRecurringSendPayment,
  AllowedBusinessPersonal
);
const ProtectedJarDetails = withUserProtection(
  JarDetails,
  AllowedBusinessPersonal
);
const ProtectedMembers = withUserProtection(
  JarMembers,
  AllowedBusinessPersonal
);

const ProtectedJarActivities = withUserProtection(
  JarActivities,
  AllowedBusinessPersonal
);

const ProtectedJarSchedulePayment = withUserProtection(
  JarSchedulePayment,
  AllowedBusinessPersonal
);

const ProtectedJarRecurringPayment = withUserProtection(
  JarRecurringPayment,
  AllowedBusinessPersonal
);

const ProtectedEditJarScheduledPayment = withUserProtection(
  EditJarScheduledPayment,
  AllowedBusinessPersonal
);

const ProtectedEditJarRecurringPayment = withUserProtection(
  EditJarRecurringPayment,
  AllowedBusinessPersonal
);
const ProtectedJarRecurringDetails = withUserProtection(
  JarRecurringDetails,
  AllowedBusinessPersonal
);

// user_types = business
const ProtectedBusinessInfo = withUserProtection(BusinessInfo, AllowedBusiness);

// user_types = agent
const ProtectedTopUp = withUserProtection(TopUp, AllowedAgent);
const ProtectedTopUpDetails = withUserProtection(TopUpDetails, AllowedAgent);
const ProtectedTopUpActivities = withUserProtection(
  TopUpActivities,
  AllowedAgent
);

// user_types = all
const ProtectedDashboard = withUserProtection(Dashboard, AllowedAllTypes);
const ProtectedCMSContent = withUserProtection(CMSContent, AllowedAllTypes);
const ProtectedCMSPage = withUserProtection(CMSPage, AllowedAllTypes);
const ProtectedFaqContent = withUserProtection(FaqContent, AllowedAllTypes);

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isToggled } = useOrganizationSwitch();

  // useEffect(() => {
  //   dispatch(fetchUserProfile());
  // }, [dispatch]);

  useEffect(() => {
    loadData();
    if (!location.pathname) return;
    if (!location.pathname.includes("/signup"))
      storageRequest.removeSignupCreds();
  }, [location.pathname]);

  return (
    <>
      <Routes>
        {/* CMS Pages Route */}
        <Route
          path="/cms-page/:slug"
          element={
            <CmsProvider>
              <ProtectedCMSPage />
            </CmsProvider>
          }
        />
        {/* List of Public Routes */}
        <Route element={<PublicLayout />}>
          {/* <Route path="/app-install" element={<AppInstall />} />
          <Route path="/.well-known/:fileName" element={<WellKnown />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/login-with-email" element={<LoginWithEmail />} />
          {/* <Route path="/login-with-otp" element={<LoginWithOtp />} /> */}
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
          <Route path="/under-maintenance" element={<UnderMaintenance />} />
        </Route>
        {/* List of Private Routes */}
        <Route element={<PrivateLayout />}>
          <Route path="/complete-kyc-valid" element={<KycComplete />} />
          <Route
            path="/complete-kyc-initial"
            element={<KycCompleteInitial />}
          />
          <Route path="/kyc-manual" element={<KycManual />} />
          <Route
            path="/kyc-manual-second-step"
            element={<KycManualSecondStep />}
          />
          <Route path="/send-mail" element={<KycSendMail />} />
          <Route path="/set-pin" element={<SetPin />} />
          <Route path="/forgot-pin" element={<ForgotPin />} />
          <Route path="/pending-pin" element={<PendingPin />} />
          <Route path="/signup/:fundtype" element={<SignupFundAccount />} />
          <Route element={<DashboardLayout />}>
            {/* settings */}
            <Route path="/setting" element={<Setting />} />
            <Route path="/setting/edit-profile" element={<EditProfile />} />
            <Route
              path="/setting/notification"
              element={<ProtectedNotification />}
            />
            <Route
              path="/setting/change-password"
              element={<ChangePassword />}
            />
            <Route path="/setting/change-pin" element={<ChangePin />} />
            <Route
              path="/setting/business-info"
              element={<ProtectedBusinessInfo />}
            />
            {/* <Route
              path="/setting/app-settings"
              element={<AppSetting />}
            /> */}
            <Route path="/top-up" element={<ProtectedTopUp />} />
            <Route path="/top-up-details" element={<ProtectedTopUpDetails />} />
            <Route
              path="/top-up-activities"
              element={<ProtectedTopUpActivities />}
            />
            {/* wallet */}
            <Route path="/wallet" element={<ProtectedWallet />} />
            <Route path="/wallet/add-card" element={<ProtectedAddCard />} />
            <Route path="/wallet/link-bank" element={<ProtectedLinkBank />} />
            <Route path="/wallet/view-card" element={<ProtectedViewCard />} />
            <Route
              path="/wallet/view-card/edit-card"
              element={<ProtectedEditCard />}
            />
            <Route path="/wallet/bank-list" element={<ProtectedBankList />} />
            <Route
              path="/wallet/fund-account/:fundtype?"
              element={<ProtectedFundAccount />}
            />
            <Route
              path="/wallet/withdrawals-card"
              element={<ProtectedWithdrawalsCard />}
            />
            <Route
              path="/wallet/withdrawals-bank"
              element={<ProtectedWithdrawalsBank />}
            />
            <Route
              path="/wallet/withdraw-card/:tid?"
              element={<ProtectedWithdrawCard />}
            />
            <Route
              path="/wallet/withdraw-bank"
              element={<ProtectedWithdrawBank />}
            />
            <Route
              path="/wallet/withdraw-details/:type/:tid"
              element={<ProtectedWithdrawDetails />}
            />
            <Route path="/profile" element={<Profile />} />
            {/* contacts */}
            <Route path="/" element={<ProtectedDashboard />} />
            {/* <Route
              path="/"
              element={isToggled ? <OrgDashboard /> : <ProtectedDashboard />}
            /> */}
            <Route path="/more/:slug" element={<ProtectedCMSContent />} />
            <Route
              path="/more/faq"
              element={
                <FaqProvider>
                  <ProtectedFaqContent />
                </FaqProvider>
              }
            />
            <Route path="/activities" element={<ProtectedActivities />} />
            <Route
              path="/view-notification"
              element={<ProtectedViewNotification />}
            />
            <Route path="/contacts" element={<ProtectedContacts />} />
            <Route
              path="/contacts-invited"
              element={<ProtectedContactsInvited />}
            />
            <Route path="/merchants" element={<ProtectedMerchants />} />
            <Route
              path="/wallet/merchant-fees-report"
              element={<ProtectedMerchantFeesReport />}
            />
            <Route path="/edit-group/:id" element={<ProtectedEditGroup />} />
            <Route path="/send" element={<ProtectedSendContact />} />
            <Route path="/send/payment" element={<ProtectedSendPayment />} />
            <Route
              path="/send/recurring-payment"
              element={<ProtectedRecurringPayment />}
            />
            <Route
              path="/send/recurring-payment-send"
              element={<ProtectedSendRecurringPayment />}
            />
            <Route
              path="/view-recurring-payment-details/:id"
              element={<ProtectedRecurringDetails />}
            />
            <Route path="/request" element={<ProtectedRequestContact />} />
            <Route
              path="/request/payment"
              element={<ProtectedRequestPayment />}
            />
            <Route element={<ScheduledPaymentLayout />}>
              <Route
                path="/view-schedule-payment"
                element={<ProtectedViewSchedulePayment />}
              />
              <Route
                path="/view-schedule-payment/update"
                element={<ProtectedEditScheduledPayment />}
              />
            </Route>
            <Route element={<RecurringPaymentLayout />}>
              <Route
                path="/view-recurring-payment"
                element={<ProtectedViewRecurringPayment />}
              />
              <Route
                path="/view-recurring-payment/update"
                element={<ProtectedEditRecurringPayment />}
              />
            </Route>
            {/* Sub-account */}
            {/* <Route element={<JarRoutesWrapper />}> */}
            <Route
              path="/jars/own/jar-details"
              element={<ProtectedJarDetails />}
            />
            <Route path="/jars/own" element={<ProtectedOwnJars />} />
            <Route
              path="/jars/own/create-jar"
              element={<ProtectedCreateJar />}
            />
            <Route path="/jars/own/edit-jar" element={<ProtectedEditJar />} />
            <Route path="/jars/own/send" element={<ProtectedJarSend />} />
            <Route
              path="/jars/own/recurring-send"
              element={<ProtectedJarRecurringSend />}
            />
            <Route
              path="/jars/own/recurring-send-payment"
              element={<ProtectedJarRecurringSendPayment />}
            />
            <Route path="/jars/shared" element={<ProtectedSharedJars />} />
            <Route path="/jars/invited" element={<ProtectedInvitedJars />} />
            <Route
              path="/jars/own/members-list"
              element={<ProtectedMembers />}
            />
            <Route
              path="/jars/own/jar-activities-list"
              element={<ProtectedJarActivities />}
            />
            <Route
              path="/jars/own/jar-schedule-pay-list"
              element={<ProtectedJarSchedulePayment />}
            />
            <Route
              path="/jars/own/jar-recurring-pay-list"
              element={<ProtectedJarRecurringPayment />}
            />
            <Route
              path="/jars/own/jar-schedule-pay-list/update"
              element={<ProtectedEditJarScheduledPayment />}
            />
            <Route
              path="/jars/own/jar-recurring-pay-list/update"
              element={<ProtectedEditJarRecurringPayment />}
            />
            <Route
              path="/jars/own/jar-recurring-pay-list/view-jar-recurring-payment-details"
              element={<ProtectedJarRecurringDetails />}
            />
            {/* </Route> */}
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
