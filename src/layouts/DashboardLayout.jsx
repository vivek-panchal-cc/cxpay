import React, { useContext, useEffect, useState } from "react";
import LeftSidebar from "components/sidebar/LeftSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "features/user/userProfileSlice";
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
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
