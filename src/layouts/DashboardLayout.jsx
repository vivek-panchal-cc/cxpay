import React, { useContext, useEffect, useState } from "react";
import LeftSidebar from "components/sidebar/LeftSidebar";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { IconNotify, IconContact, IconSetting, IconLogout } from "styles/svgs";
import Image from "components/ui/Image";
import { LoaderContext } from "context/loaderContext";
import NotificationBar from "components/notification-bar/NotificationBar";

const contentTitles = [
  // {
  //   url: "/wallet/view-card",
  //   heading: "View Cards",
  //   subHeading: "My Credit Cards List",
  // },
  // {
  //   url: "/wallet/bank-list",
  //   heading: "My Bank Accounts",
  //   subHeading: "Primary Bank Accounts",
  // },
];

function DashboardLayout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { setIsLoading } = useContext(LoaderContext);
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
      setIsLoading(true);
      await dispatch(fetchUserProfile());
      setIsLoading(false);
    })();
  }, [dispatch]);

  // if (Object.keys(profile).length === 0) return null;
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
            {/* <div className="dashboard-top-sec no-search-ontop">
              <div className="dashboard-search-wrap col-lg-7 col-12">
                <div className="title-content-wrap send-pay-title-sec title-common-sec ms-4">
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
                        <Image
                          src={profile?.profile_image}
                          alt="profile avtar"
                          fallbacksrc={
                            profile?.user_type === "business"
                              ? "/assets/images/Business-account.png"
                              : "/assets/images/Personal.png"
                          }
                          className="h-100 w-100 object-fit-cover"
                          style={{ objectPosition: "center" }}
                        />
                      </span>
                    </div>
                    <ul>
                      <li>
                        <Link to="/profile">
                          <IconContact style={{ stroke: "#363853" }} />
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/setting">
                          <IconSetting style={{ stroke: "#363853" }} />
                          Settings
                        </Link>
                      </li>
                      <li>
                        <Link to="/logout" replace>
                          <IconLogout style={{ stroke: "#363853" }} />
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div> */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
