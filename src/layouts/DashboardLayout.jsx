import React, { useContext, useEffect, useState } from "react";
import LeftSidebar from "components/sidebar/LeftSidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { LoaderContext } from "context/loaderContext";
import NotificationBar from "components/notification-bar/NotificationBar";
import { fetchGetNotifications } from "features/user/userNotificationSlice";
import ContactsProvider from "context/contactsContext";
import SendPaymentProvider from "context/sendPaymentContext";
import ActivityProvider from "context/activityContext";
import TopUpActivityProvider from "context/topUpActivityContext";
import { CmsProvider } from "context/cmsContext";
import $ from "jquery";
import useForgotPinHandler from "hooks/useForgotPinHandler";
import ModalPaymentPin from "components/modals/ModalPaymentPin";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { usePinContext } from "context/pinContext";

function DashboardLayout() {
  const { setIsPinValidated } = usePinContext();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPinPopup, setShowPinPopup] = useState(false);
  const [error, setError] = useState("");
  const { handleForgotPin, OtpModal, PinModal } =
    useForgotPinHandler(setShowPinPopup);
  const { setIsLoading } = useContext(LoaderContext);
  const classNamePage = {
    "/send": "send-page-wrapper",
    "/request": "send-page-wrapper",
  };

  useEffect(() => {
    (async () => {
      await dispatch(fetchGetNotifications(1));
    })();
  }, [location.pathname]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await dispatch(fetchUserProfile());
      setIsLoading(false);
    })();
  }, []);

  const handleToggleClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmitPin = async (pin) => {
    if (!pin) return;
    setIsLoading(true);
    try {
      const { data } = await apiRequest.pinValidate({ user_pin: pin });
      if (!data.success) throw data;
      toast.success(data.message);
      setShowPinPopup(false);
      setIsPinValidated(true);
      navigate("/setting");
    } catch (error) {
      setError(error.message);
      if (error.data.is_suspended) {
        navigate("/logout", { replace: true });
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-page wallet-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-lg-3 dashboard-left-sec">
            <CmsProvider>
              <LeftSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                setShowPinPopup={setShowPinPopup}
                setError={setError}
              />
            </CmsProvider>
          </div>
          <div
            className={`col-xs-12 col-lg-9 dashboard-right-sec min-vh-100 ${
              classNamePage[location.pathname]
            }`}
          >
            <div className="mobile-toggle">
              <span className="toggle-admin-btn" onClick={handleToggleClick}>
                <img
                  src="/assets/images/dashaboard-button-toggle.png"
                  alt="button dashboard icon"
                />
              </span>
            </div>
            <ContactsProvider>
              <SendPaymentProvider>
                <ActivityProvider>
                  <TopUpActivityProvider>
                    <NotificationBar />
                    <Outlet />
                  </TopUpActivityProvider>
                </ActivityProvider>
              </SendPaymentProvider>
            </ContactsProvider>
          </div>
        </div>
        {showPinPopup && (
          <ModalPaymentPin
            id="group_pay_otp_modal"
            className="otp-verification-modal group_pay_otp_modal"
            show={showPinPopup}
            allowClickOutSide={true}
            setShow={setShowPinPopup}
            heading="5 - Digit PIN Access"
            headingImg="/assets/images/setupPin.svg"
            subHeading="Secure your account with 5 - Digit PIN Access"
            error={error}
            handleSubmitPin={handleSubmitPin}
            handleForgotPin={handleForgotPin}
          />
        )}
        {OtpModal()}
        {PinModal()}
      </div>
    </div>
  );
}

export default DashboardLayout;
