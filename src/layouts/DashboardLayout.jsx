import React, { useContext, useEffect, useRef, useState } from "react";
import LeftSidebar from "components/sidebar/LeftSidebar";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { LoaderContext } from "context/loaderContext";
import NotificationBar from "components/notification-bar/NotificationBar";
import { fetchGetNotifications } from "features/user/userNotificationSlice";

function DashboardLayout() {
  const dispatch = useDispatch();
  const { setIsLoading } = useContext(LoaderContext);
  const notificationIntervalId = useRef();

  // Interval clling notification every 5 sec
  useEffect(() => {
    // clear old interval
    if (notificationIntervalId.current) {
      clearInterval(notificationIntervalId.current);
      notificationIntervalId.current = undefined;
    }
    // set new Interval
    notificationIntervalId.current = setInterval(async () => {
      await dispatch(fetchGetNotifications(1));
    }, 5000);
    return () => clearInterval(notificationIntervalId.current);
  }, []);

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
              window.location.pathname == "/send" ? "send-page-wrapper" : ""
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
