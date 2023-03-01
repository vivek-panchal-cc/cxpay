import React, { useEffect, useState } from "react";
import LeftSidebar from "components/sidebar/LeftSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { IconNotify, IconContact, IconSetting, IconLogout } from "styles/svgs";

const contentTitles = [
  {
    url: "/view-card",
    heading: "View Cards",
    subHeading: "My Credit Cards List",
  },
];

function DashboardLayout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [headings, setHeading] = useState({
    heading: "",
    subHeading: "",
  });
  const { profile } = useSelector((state) => state.userProfile);

  useEffect(() => {
    const url = location.pathname;
    const titleObj = contentTitles.find((item) => item.url === url);
    if (titleObj) return setHeading(titleObj);
    setHeading({ heading: "", subHeading: "" });
  }, [location.pathname]);

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
          <div className="col-xs-12 col-lg-9 dashboard-right-sec min-vh-100">
            <div className="dashboard-top-sec no-search-ontop">
              <div className="dashboard-search-wrap col-lg-7 col-12">
                <div className="title-content-wrap send-pay-title-sec title-common-sec">
                  <h3>{headings.heading}</h3>
                  <p>{headings.subHeading}</p>
                </div>
              </div>
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
                      <span className="user-image h-100 w-100">
                        <img
                          src={
                            profile.profile_image
                              ? profile.profile_image
                              : "/assets/images/user-avatar.png"
                          }
                          className="object-fit-cover h-100 w-100"
                          alt="user img"
                        />
                      </span>
                    </div>
                    <ul>
                      <li>
                        <a href="/profile">
                          <IconContact style={{ stroke: "#363853" }} />
                          Profile
                        </a>
                      </li>
                      <li>
                        <a href="/setting">
                          <IconSetting style={{ stroke: "#363853" }} />
                          Settings
                        </a>
                      </li>
                      <li>
                        <a href="/logout">
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
