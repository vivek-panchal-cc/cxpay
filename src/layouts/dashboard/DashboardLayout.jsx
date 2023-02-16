import LeftSidebar from "components/sidebar/LeftSidebar";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="dashboard-page wallet-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-lg-3 dashboard-left-sec">
            <LeftSidebar />
          </div>
          <div className="col-xs-12 col-lg-9 dashboard-right-sec dashaboard-main-sec">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
