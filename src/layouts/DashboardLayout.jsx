import React, { useContext, useEffect, useState } from "react";
import LeftSidebar from "components/sidebar/LeftSidebar";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { LoaderContext } from "context/loaderContext";
import NotificationBar from "components/notification-bar/NotificationBar";
import { fetchGetAllNotifications } from "features/user/userNotificationSlice";

function DashboardLayout() {
  const dispatch = useDispatch();
  const { setIsLoading } = useContext(LoaderContext);
  // const { profile } = useSelector((state) => state.userProfile);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await dispatch(fetchUserProfile());
      await dispatch(fetchGetAllNotifications(1));
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
          <div className="col-xs-12 col-lg-9 dashboard-right-sec min-vh-100">
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
