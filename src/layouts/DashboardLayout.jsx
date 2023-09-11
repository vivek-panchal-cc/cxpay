import React, { useContext, useEffect } from "react";
import LeftSidebar from "components/sidebar/LeftSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { LoaderContext } from "context/loaderContext";
import NotificationBar from "components/notification-bar/NotificationBar";
import { fetchGetNotifications } from "features/user/userNotificationSlice";
import ContactsProvider from "context/contactsContext";
import SendPaymentProvider from "context/sendPaymentContext";
import ActivityProvider from "context/activityContext";
import TopUpActivityProvider from "context/topUpActivityContext";

function DashboardLayout() {
  const dispatch = useDispatch();
  const location = useLocation();
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

  return (
    <div className="dashboard-page wallet-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-lg-3 dashboard-left-sec">
            <LeftSidebar />
          </div>
          <div
            className={`col-xs-12 col-lg-9 dashboard-right-sec min-vh-100 ${
              classNamePage[location.pathname]
            }`}
          >
            <div className="mobile-toggle">
              <span className="toggle-admin-btn">
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
      </div>
    </div>
  );
}

export default DashboardLayout;
