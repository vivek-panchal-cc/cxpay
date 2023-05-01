import React, { useContext, useEffect, useRef } from "react";
import LeftSidebar from "components/sidebar/LeftSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { LoaderContext } from "context/loaderContext";
import NotificationBar from "components/notification-bar/NotificationBar";
import { fetchGetNotifications } from "features/user/userNotificationSlice";

function DashboardLayout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { setIsLoading } = useContext(LoaderContext);
  const notificationIntervalId = useRef();
  const classNamePage = {
    "/send": "send-page-wrapper",
    "/request": "send-page-wrapper",
  };
  // Interval clling notification every 5 sec
  useEffect(() => {
    // // clear old interval
    // if (notificationIntervalId.current) {
    //   clearInterval(notificationIntervalId.current);
    //   notificationIntervalId.current = undefined;
    // }
    // // set new Interval
    // notificationIntervalId.current = setInterval(async () => {
    //   await dispatch(fetchGetNotifications(1));
    // }, 5000);
    // return () => clearInterval(notificationIntervalId.current);
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
  }, [dispatch]);

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
            <NotificationBar />
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
