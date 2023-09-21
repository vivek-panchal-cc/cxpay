import { CXPAY_SHADOW_LOGO } from "constants/all";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import $ from 'jquery';
import {
  IconActivity,
  IconContact,
  IconHome,
  IconLogout,
  IconProfileVerified,
  IconRequest,
  IconSend,
  IconSetting,
  IconWallet,
} from "styles/svgs";

function LeftSidebar() {
  const location = useLocation();
  const { profile, isLoading } = useSelector((state) => state.userProfile);
  const { user_type } = profile || "";

  const thisRoute = useMemo(() => location.pathname.split("/")[1], [location]);

  if (isLoading) {
    return null;
  }

  const handleToggleClick = () => {
    $(".dashboard-page > .container-fluid > .row").toggleClass("sidebar-open");
  };

  return (
    <div className="dashboard-left-wrap">
      <span className="toggle-admin-btn" onClick={handleToggleClick}>
        <img
          src="/assets/images/dashaboard-button-toggle.png"
          alt="button dashboard icon"
        />
      </span>
      <div className="dashboard-logo-wrap">
        <Link to="/" replace>
          <img src={CXPAY_SHADOW_LOGO} alt="dashboard logo" />
        </Link>
        <Link to="/" className="dashaboard-btn text-capitalize" replace>
          {user_type}
        </Link>
      </div>
      <div className="dashboard-link-wrap">
        <ul className="dashboard-main-links">
          <li className={`${thisRoute === "" ? "active" : ""}`}>
            <Link to="/" replace>
              <IconHome />
              <span>Dashboard</span>
            </Link>
          </li>
          {user_type !== "agent" && (
            <>
              <li className={`${thisRoute === "send" ? "active" : ""}`}>
                <Link to="/send" replace>
                  <IconSend style={{ stroke: "#F3F3F3" }} />
                  <span>Send</span>
                </Link>
              </li>
              <li className={`${thisRoute === "request" ? "active" : ""}`}>
                <Link to="/request" replace>
                  <IconRequest />
                  <span>Request</span>
                </Link>
              </li>
              <li className={`${thisRoute === "activities" ? "active" : ""}`}>
                <Link to="/activities" replace>
                  <IconActivity />
                  <span>Activities</span>
                </Link>
              </li>
              <li className={`${thisRoute === "wallet" ? "active" : ""}`}>
                <Link to="/wallet" replace>
                  <IconWallet />
                  <span>Wallet</span>
                </Link>
              </li>              
              <li
                className={`${
                  thisRoute === "contacts" || thisRoute === "contacts-invited"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/contacts" replace>
                  <IconContact style={{ stroke: "#F3F3F3" }} />
                  <span>Contacts</span>
                </Link>
              </li>
            </>
          )}
          {user_type === "agent" && (
            <>
              <li className={`${thisRoute === "top-up" ? "active" : ""}`}>
                <Link to="/top-up" replace>
                  <IconSend style={{ stroke: "#F3F3F3" }} />
                  <span>Top Up</span>
                </Link>
              </li>
              <li
                className={`${
                  thisRoute === "top-up-activities" ? "active" : ""
                }`}
              >
                <Link to="/top-up-activities" replace>
                  <IconActivity />
                  <span>Activities</span>
                </Link>
              </li>
            </>
          )}
        </ul>
        <ul className="dashboard-bottom-links">
          <li className={`${thisRoute === "profile" ? "active" : ""}`}>
            <Link to="/profile" replace>
              <IconProfileVerified />
              <span>Profile</span>
            </Link>
          </li>
          <li className={`${thisRoute === "setting" ? "active" : ""}`}>
            <Link to="/setting" replace>
              <IconSetting style={{ fill: "#fff100" }} />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link to="/logout" replace>
              <IconLogout style={{ stroke: "#FFF100" }} />
              <span>Log out</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LeftSidebar;
