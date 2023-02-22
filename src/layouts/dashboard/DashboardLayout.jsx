import React, { useEffect } from "react";
import LeftSidebar from "components/sidebar/LeftSidebar";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { IconNotify, IconContact, IconSetting, IconLogout } from "styles/svgs";

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
            <div className="dashboard-top-sec no-search-ontop">
              <div className="dashboard-notification-sec col-lg-5 col-12">
                <div className="notification-user-wrap">
                  <div className="dashboard-notification-wrap">
                    <div className="notification-icon">
                      <IconNotify />
                      <span className="notification-count">
                        <span></span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="user-profile">
                  <div className="user-image">
                    <div className="user-image-wrap">
                      <span className="user-image">
                        <img
                          src="assets/images/user-image-logged-in.png"
                          alt="user img"
                        />
                      </span>
                    </div>
                    <ul>
                      <li>
                        <a href="/">
                          <IconContact style={{ stroke: "#363853" }} />
                          Profile
                        </a>
                      </li>
                      <li>
                        <a href="/">
                          <IconSetting style={{ stroke: "#363853" }} />
                          Settings
                        </a>
                      </li>
                      <li>
                        <a href="/">
                          <IconLogout style={{ stroke: "#363853" }} />
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
