import React, { useEffect } from "react";
import LeftSidebar from "components/sidebar/LeftSidebar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "features/user/userProfileSlice";

function DashboardLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(fetchUserProfile());
    })();
  }, [dispatch]);

  return (
    <div className="dashboard-page wallet-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-lg-3 dashboard-left-sec">
            <LeftSidebar />
          </div>
          <div className="col-xs-12 col-lg-9 dashboard-right-sec">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
